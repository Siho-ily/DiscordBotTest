import { CommandData } from '../../structures/BaseCommand.js';

export default new CommandData({
	name: 'test',
	aliases: ['테스트'],
	allowPrefix: false,
	description: '테스트용 커맨드입니다.',
	cooldown: 1000,
	ownerOnly: false,
	options: [
		{
			name: 'subcommand',
			description: '서브커맨드를 선택하세요.',
			type: 'Subcommand',
			options: [
				{
					name: 'option1',
					description: '서브커맨드 옵션 1',
					required: true,
					type: 'String',
					choices: [
						{ name: '옵션 1', value: 'option1' },
						{ name: '옵션 2', value: 'option2' },
					],
				},
				{
					name: 'option2',
					description: '서브커맨드 옵션 2',
					type: 'Integer',
					required: false,
					choices: [
						{ name: '선택 1', value: 1 },
						{ name: '선택 2', value: 2 },
					],
				},
			],
		},
		{
			name: 'subcommandgroup',
			description: '서브커맨드 그룹을 선택하세요.',
			type: 'SubcommandGroup',
			options: [
				{
					name: 'group1',
					description: '그룹 1 옵션',
					type: 'Subcommand',
					options: [
						{
							name: 'option-a',
							description: '그룹 1 옵션 A',
							type: 'String',
							required: true,
							choices: [
								{ name: '옵션 A1', value: 'a1' },
								{ name: '옵션 A2', value: 'a2' },
							],
						},
						{
							name: 'option-b',
							description: '그룹 1 옵션 B',
							type: 'Number',
							required: false,
							minValue: 0,
							maxValue: 100,
						},
					],
				},
				{
					name: 'group2',
					description: '그룹 2 옵션',
					type: 'Subcommand',
					options: [
						{
							name: 'option-c',
							description: '그룹 2 옵션 C',
							type: 'Boolean',
							required: true,
							choices: [
								{ name: '참', value: true },
								{ name: '거짓', value: false },
							],
						},
						{
							name: 'option-d',
							description: '그룹 2 옵션 D',
							type: 'Channel',
							required: false,
						},
					],
				},
			],
		},
	],

	async execute(context) {
		try {
			await context.deferReply();

			let reply = `🔍 **Test 명령어 실행됨**\n`;

			const group = context.options.getSubcommandGroup(false);
			const sub = context.options.getSubcommand(false);

			reply += `- Subcommand Group: \`${group ?? '없음'}\`\n`;
			reply += `- Subcommand: \`${sub ?? '없음'}\`\n`;

			if (!group && sub === 'subcommand') {
				const option1 = context.options.getString('option1');
				const option2 = context.options.getInteger('option2');
				reply += `- option1: \`${option1}\`\n`;
				reply += `- option2: \`${option2 ?? '없음'}\`\n`;
			}

			if (group === 'group1' && sub === 'group1') {
				const optionA = context.options.getString('option-a');
				const optionB = context.options.getNumber('option-b');
				reply += `- option-a: \`${optionA}\`\n`;
				reply += `- option-b: \`${optionB ?? '없음'}\`\n`;
			}

			if (group === 'group2' && sub === 'group2') {
				const optionC = context.options.getBoolean('option-c');
				const optionD = context.options.getChannel('option-d');
				reply += `- option-c: \`${optionC}\`\n`;
				reply += `- option-d: \`${optionD?.name ?? '없음'}\`\n`;
			}

			await context.editReply(reply);
		} catch (error) {
			console.error('❌ Test 명령어 처리 중 오류:', error);
			if (context.type === 'slash' && !context.interaction.replied) {
				await context.interaction.editReply('⚠️ 오류가 발생했습니다.');
			}
		}
	},
});
