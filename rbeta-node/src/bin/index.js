#!/usr/bin/env node
'use strict';

const
	bluebird = require('bluebird'),
	yargs = require('yargs'),
	tmp = require('tmp'),
	path = require('path'),
	prettyjson = require('prettyjson');

const
	RBETA_BUNDLE_NAME = 'rbeta-reducer-bundle',
	RBETA_LAMBDA_ZIP_NAME = 'rbeta-reducer';

const
	prompt = obj => {
		try {
			//console.log(JSON.stringify(obj, null, '\t'));
			console.log(prettyjson.render(obj));
		} catch(e) {
			console.log(obj);
		}
	},
	logError = err => err && err.stack && prompt(err.stack) || prompt(err),
	chain = function(cmd, args) {
		var f = (cmd, args) => (f._cmds.push({ cmd: cmd, args: args }), f);

		f._cmds = [];
		f._results = [];
		f.end = () => (
			f(prompt, f._results),
			bluebird.reduce(
				f._cmds,
				(results, c) => Promise.resolve(
					(
						typeof c.cmd === 'function'
							? c.cmd
							: require(path.resolve(__dirname, c.cmd))
					)(
						typeof c.args === 'function'
							? c.args(results)
							: c.args
					)
				).then(r => (results.push(r), results)),
				f._results
			)
		);

		return f(cmd, args);
	};

if (!process.env.NODE_DEBUG) {
	process.env.NODE_DEBUG = 'rbeta-node';
}

const defOutputDir = (
	process.cwd().indexOf(path.resolve(__dirname, '../..')) >= 0
) ? path.resolve(__dirname, '../../build') : process.cwd()

const argv = yargs
	.usage('Build and package a rbeta reducer to a zip ready for aws lambda')
	.wrap(120)
	.epilogue('LikeMindNetworks Inc.')
	.strict()
	.demandCommand(1)
	.help()
	.command(
		'build',
		'build the rbeta reducer',
		yargs => yargs
			.option('e', {
				demand: true,
				alias: 'entry',
				describe: 'entry point javascript file'
			})
			.option('o', {
				alias: 'output',
				describe: 'output directory',
				default: defOutputDir
			})
			.option('n', {
				alias: 'name',
				describe: 'name of the output file',
				default: RBETA_BUNDLE_NAME + '.js'
			})
			.strict(),
		args => chain('build', args).end().catch(logError)
	)
	.command(
		'validate',
		'validate a rbeta reducer implementation',
		yargs => yargs
			.option('e', {
				demand: true,
				alias: 'entry',
				describe: 'entry point javascript file'
			})
			.strict(),
		args => {
			args = {
				entry: args.entry,
				output: tmp.dirSync({ unsafeCleanup: true }).name,
				name: RBETA_BUNDLE_NAME + '.js'
			};

			chain('build', args)('validate', args).end().catch(logError)
		}
	)
	.command(
		'pack',
		'package the rbeta reducer',
		yargs => yargs
			.option('e', {
				demand: true,
				alias: 'entry',
				describe: 'entry point javascript file'
			})
			.option('o', {
				alias: 'output',
				describe: 'output directory',
				default: defOutputDir
			})
			.option('n', {
				alias: 'name',
				describe: 'name of the output bundle',
				default: RBETA_LAMBDA_ZIP_NAME + '.zip'
			})
			.strict(),
		args => {
			const buildOpts = {
				entry: args.entry,
				output: tmp.dirSync({ unsafeCleanup: true }).name,
				name: RBETA_BUNDLE_NAME + '.js'
			};

			chain(
				'build', buildOpts
			)(
				'validate', buildOpts
			)(
				'pack', Object.assign({ buildOpts: buildOpts }, args)
			).end().catch(logError)
		}
	)
	.argv;
