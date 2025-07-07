import { CommandData } from '../../structures/BaseCommand.js';
import {
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	StringSelectMenuOptionBuilder,
	StringSelectMenuBuilder,
	UserSelectMenuBuilder,
} from 'discord.js';

export default new CommandData({
	name: 'test',
	aliases: ['테스트'],
	description: '테스트용 커맨드입니다.',

	async execute(context) {
		try {
			const userSelect = new UserSelectMenuBuilder()
				.setCustomId('users')
				.setPlaceholder('Select multiple users.')
				.setMinValues(1)
				.setMaxValues(10);

			const row1 = new ActionRowBuilder().addComponents(userSelect);

			await context.reply({
				content: 'Select users:',
				components: [row1],
			});
		} catch (error) {
			console.error('❌ Test 명령어 처리 중 오류:', error);
			if (context.type === 'slash' && !context.interaction.replied) {
				await context.interaction.editReply('⚠️ 오류가 발생했습니다.');
			}
		}
	},
});
