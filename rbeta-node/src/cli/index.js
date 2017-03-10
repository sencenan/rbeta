#!/usr/bin/env node
'use strict';

const
	yargs = require('yargs'),
	cliUtils = require('./utils/cli-utils');

const argv = yargs
	.usage('Build and package a rbeta reducer to a zip ready for aws lambda')
	.wrap(120)
	.epilogue('LikeMindNetworks Inc.')
	.option('raw', {
		alias: 'r',
		describe: 'display raw json output',
		type: 'boolean',
		default: false,
		global: true
	})
	.commandDir('commands')
	.demandCommand(1, 1)
	.strict()
	.help()
	.argv;

cliUtils.setRawMode(argv.raw);
