#!/usr/bin/env node
'use strict';

const
	yargs = require('yargs'),
	tmp = require('tmp');

yargs
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
				default: process.cwd()
			})
			.option('n', {
				alias: 'name',
				describe: 'name of the output bundle',
				default: 'rbeta_bundle.js'
			}),
		args => require('./build')(args)
			.then(() => console.log('OK.'))
			.catch(err => console.log(err))
	)
	.command(
		'test',
		'validate a rbeta reducer implementation',
		yargs => yargs.option('e', {
			demand: true,
			alias: 'entry',
			describe: 'entry point javascript file'
		}),
		args => {
			args = {
				entry: args.entry,
				output: tmp.dirSync({ unsafeCleanup: true }).name,
				name: 'rbeta_bundle.js'
			};

			require('./build')(args)
				.then(() => require('./validate')(args))
				.then(() => console.log('OK.'))
				.catch(err => console.log(err))
		}
	)
	.argv;
