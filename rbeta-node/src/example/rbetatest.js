module.exports = [
	[
		{
			group: 'g1',
			aggregate: 'a',
			type: 'update',
			seq: 0,
			data: { value: 1 }
		},
		{
			group: 'g1',
			aggregate: 'a',
			type: 'update',
			seq: 0,
			data: { value: 3 }
		},
		{
			group: 'g1',
			aggregate: 'a',
			type: 'update',
			seq: 0,
			data: { value: 5 }
		}
	],
	[
		{ value: 1 },
		{ value: 1 + 3 },
		{ value: 1 + 3 + 5 }
	]
];
