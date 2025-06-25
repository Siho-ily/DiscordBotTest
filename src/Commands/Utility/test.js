import { setTimeout as wait } from 'node:timers/promises';
import { CommandData } from '../../structures/BaseCommand.js';

export default new CommandData({
	name: 'test',
	aliases: ['테스트'],
	allowPrefix: true,
	options: [
		{
			name: 'mode',
			description: '모드를 선택하세요.',
			type: 'String',
			required: true,
			choices: [
				{ name: '빠르게', value: 'fast' },
				{ name: '느리게', value: 'slow' },
			],
		},
	],
	description: '테스트용 커맨드입니다.',
	cooldown: 1000,
	ownerOnly: false,

	async execute(context) {
		try {
			await context.deferReply('처리 중...');
			const mode = context.getOption({ name: 'mode' }).value;
			await wait(mode === 'fast' ? 100 : 2000);
			await context.editReply(mode === 'fast' ? '빠르게 응답했습니다!' : '느리게 응답했습니다!');
		} catch (error) {
			console.error('응답 처리 중 오류:', error);
			if (context.type === 'slash' && !context.interaction.replied) {
				await context.interaction.editReply('오류가 발생했습니다.');
			}
		}
	},
});
