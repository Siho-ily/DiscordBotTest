import { setTimeout as wait } from 'node:timers/promises';
import { CommandData } from '../../structures/BaseCommand.js';

export default new CommandData({
	name: 'test',
	aliases: ['테스트'],
	allowPrefix: true,
	options: [],
	description: '테스트용 커맨드입니다.',
	cooldown: 1000,
	ownerOnly: false,

	async execute(context) {
		try {
			await context.deferReply();
			await wait(4000);
			await context.editReply('Pong!');
		} catch (error) {
			console.error('응답 처리 중 오류:', error);
			if (context.type === 'slash' && !context.interaction.replied) {
				await context.interaction.editReply('오류가 발생했습니다.');
			}
		}
	},
});
