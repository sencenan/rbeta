#!/usr/bin/env node
'use strict';

const
	yargs = require('yargs'),
	tmp = require('tmp');

const
	RBETA_BUNDLE_NAME = 'rbeta-reducer-bundle',
	RBETA_LAMBDA_ZIP_NAME = 'rbeta-reducer',
	logError = err => {
		if (err && err.stack) {
			console.log(err.stack);
		} else {
			console.log(err);
		}
	};

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
				describe: 'name of the output file',
				default: RBETA_BUNDLE_NAME + '.js'
			}),
		args => require('./build')(args)
			.then(() => console.log('OK.'))
			.catch(logError)
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
				name: RBETA_BUNDLE_NAME + '.js'
			};

			require('./build')(args)
				.then(() => require('./validate')(args))
				.catch(logError)
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
				default: process.cwd()
			})
			.option('n', {
				alias: 'name',
				describe: 'name of the output bundle',
				default: RBETA_LAMBDA_ZIP_NAME + '.zip'
			}),
		args => {
			const buildOpts = {
				entry: args.entry,
				output: tmp.dirSync({ unsafeCleanup: true }).name,
				name: RBETA_BUNDLE_NAME + '.js'
			};

			require('./build')(buildOpts)
				.then(() => require('./validate')(buildOpts))
				.then(() => require('./pack')(
					Object.assign({ buildOpts: buildOpts }, args)
				))
				.catch(logError)
		}
	)
	.argv;
