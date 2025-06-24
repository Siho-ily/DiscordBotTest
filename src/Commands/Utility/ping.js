import { SlashCommandBuilder } from '@discordjs/builders';
import { BaseCommand } from '../../structures/BaseCommand.js';

export const commandBase = new BaseCommand({
	prefixData: {
		name: 'ping',
		aliases: ['pong'],
	},
	slashData: new SlashCommandBuilder().setName('ping').setDescription('Pong!'),
	// 1 s = 1000 ms / 0으로 설정하면 쿨타임이 없음
	cooldown: 1000,
	// 관리자만 사용하려면 true로 설정
	ownerOnly: false,
	// 응답 처리
	async prefixRun(client, message) {
		message.reply('Pong 🏓');
	},
	async slashRun(client, interaction) {
		interaction.reply('Pong 🏓');
	},
});
