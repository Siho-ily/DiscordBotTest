import { Collection, Events, MessageFlags } from 'discord.js';
import { config } from 'dotenv';
import { CommandContext } from '../structures/CommandContext.js';

config({ path: './src/Config/.env' });
const owners = process.env.OWNERS.split(',');
const cooldown = new Collection();

export const event = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;
		if (interaction.user.bot) return;

		const command = interaction.client.slashCommands.get(interaction.commandName);
		if (!command) return;

		if (command.ownerOnly && !owners.includes(interaction.user.id)) {
			return interaction.reply({
				content: '🔒 이 명령어는 개발자만 사용할 수 있습니다.',
				flags: MessageFlags.Ephemeral,
			});
		}

		const ctx = new CommandContext({ interaction });

		// 쿨타임 처리
		if (command.cooldown) {
			const key = `${command.name}-${interaction.user.id}`;
			const now = Date.now();

			if (cooldown.has(key) && cooldown.get(key) > now) {
				const remaining = Math.floor(cooldown.get(key) / 1000);
				return interaction.reply({
					content: `⏳ 쿨타임 중입니다. <t:${remaining}:R>에 다시 시도해주세요.`,
					flags: MessageFlags.Ephemeral,
				});
			}

			cooldown.set(key, now + command.cooldown);
			setTimeout(() => cooldown.delete(key), command.cooldown);
		}

		try {
			await command.execute(ctx);
		} catch (e) {
			console.error(`[InteractionCreate] 명령어 실행 중 오류 발생:`, e);
			return interaction.reply({
				content: '❌ 오류가 발생하였습니다. 나중에 다시 시도해주세요.',
				flags: MessageFlags.Ephemeral,
			});
		}
	},
};
