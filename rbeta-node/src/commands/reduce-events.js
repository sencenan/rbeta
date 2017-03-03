'use strict';

const
	bluebird = require('bluebird'),

	Command = require('./command'),
	FetchEvents = require('./fetch-events'),
	FetchLastReduction = require('./fetch-last-reduction'),
	TrackReduction = require('./track-reduction'),

	ST = require('../types/schematic-type'),
	NewEvent = require('../types/new-event'),
	ReducerObj = require('../types/reducer-obj'),

	returnp = require('../utils/return-promise');

const
	ERROR_NO_OP = new Error('no events to be reduced'),
	ERROR_NOT_IN_SAME_AGG_GROUP = new Error(
		'Events must have the same aggregate and group'
	),
	ERROR_DUPLICATED_SEQ_VALUE = new Error('Events must have unique seq value');

module.exports = class ReduceEvents extends Command {

	static get ERROR_NO_OP() {
		return ERROR_NO_OP;
	}

	static get ERROR_NOT_IN_SAME_AGG_GROUP() {
		return ERROR_NOT_IN_SAME_AGG_GROUP;
	}

	static get ERROR_DUPLICATED_SEQ_VALUE() {
		return ERROR_DUPLICATED_SEQ_VALUE;
	}

	static get schema() {
		return ST.joi.object().keys({
			reducer: ST.joi.st(ReducerObj).required(),
			events: ST.joi.array().items(ST.joi.st(NewEvent)).required()
		}).required().label('parameter');
	}

	constructor(param) {
		super(param);

		if (!this.events.length) {
			throw ReduceEvents.ERROR_NO_OP;
		}

		if (
			Object.keys(
				this.events.reduce((a, e) => (a[e.aggregate] = true, a), {})
			).length > 1 || Object.keys(
				this.events.reduce((a, e) => (a[e.group] = true, a), {})
			).length > 1
		) {
			throw ReduceEvents.ERROR_NOT_IN_SAME_AGG_GROUP;
		}

		if (
			Object.keys(
				this.events.reduce((a, e) => (a[e.seq] = true, a), {})
			).length !== this.events.length
		) {
			throw ReduceEvents.ERROR_DUPLICATED_SEQ_VALUE;
		}

		for (let i = 1; i < this.events.length; i += 1) {
			if (this.events[i].seq - this.events[i - 1].seq > 1) {
				this.log('Warning: Events seq numbers are sparse');
				continue;
			}
		}

		this.group = this.events[0].group,
		this.aggregate = this.events[0].aggregate;
	}

	_loadInitState() {
		return returnp(this.reducer.state(this.aggregate))
			.then(state => this.initState = state);
	}

	_loadLastReduction(ctx) {
		return new FetchLastReduction({
			group: this.group,
			reducerName: this.reducer.name,
			aggregate: this.aggregate
		}).run(ctx).then(e => this.lastReducedEvent = e);
	}

	_normalizeEvents(ctx) {
		let lastReducedSeq
				= this.lastReducedEvent && this.lastReducedEvent.seq || -1;

		this.log(
			'last reduced seq: %s. oldest event seq: %s',
			lastReducedSeq, this.events[0].seq
		);

		if (lastReducedSeq + 1 < this.events[0].seq) {
			this.log('gap in events to be reduced. fetch more events.');

			return new FetchEvents({
				group: this.group,
				aggregate: this.aggregate,
				fromSeq: lastReducedSeq + 1,
				toSeq: this.events[0].seq - 1
			})
				.run(ctx)
				.then(events => this.events = events.concat(this.events));
		} else if (lastReducedSeq >= this.events[0].seq) {
			this.log('stale events to be reduced. trimming.');

			let i = 0;

			while (
				i < this.events.length && lastReducedSeq >= this.events[i].seq
			) { i += 1; }

			this.events.splice(0, i);

			if (!this.events.length) { throw ReduceEvents.ERROR_NO_OP; }
		}
	}

	/*
	 * The fundamental difficulty here is to protect the integrity of
	 * reducer.state(). It is not always possible to recover the last event
	 * reduced from the value of reducer.state().
	 */
	run(ctx) {
		this.log(
			'starting reducer [%s] for aggregate [%s] group [%s] events[%s - %s]',
			this.reducer.name, this.aggregate, this.group,
			this.events[0].seq, this.events[this.events.length - 1].seq
		);

		return bluebird
			.all([
				this._loadInitState(),
				this._loadLastReduction(ctx)
			])
			.then(() => this._normalizeEvents(ctx))
			.then(() => bluebird.reduce(
				this.events,
				(s, e) => returnp(this.reducer.reduce(s, e)),
				this.initState === undefined ? null : this.initState
			))
			.then(state => this.reducer.persist(this.group, this.aggregate, state))
			.then(
				res => new TrackReduction({
					group: this.group,
					reducerName: this.reducer.name,
					event: this.events[this.events.length - 1],
					previousSeq: this.lastReducedEvent
						? this.lastReducedEvent.seq
						: undefined
				}).run(ctx).then(() => res)
			);
	}

};
