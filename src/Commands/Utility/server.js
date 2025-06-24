import { SlashCommandBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';

export const commandBase = new BaseCommand({
	prefixData: {
		name: 'server',
		aliases: ['서버정보', '서버'],
	},
	slashData: new SlashCommandBuilder().setName('server').setDescription('서버 정보를 제공합니다.'),
	// 1 s = 1000 ms / 0으로 설정하면 쿨타임이 없음
	cooldown: 1000,
	// 관리자만 사용하려면 true로 설정
	ownerOnly: false,
	// 응답 처리
	async prefixRun(client, message) {
		message.reply(`이 서버의 이름은${message.guild.name}이며, ${message.guild.memberCount}명의 멤버가 있습니다.`);
	},
	async slashRun(client, interaction) {
		interaction.reply(`이 서버의 이름은${interaction.guild.name}이며, ${interaction.guild.memberCount}명의 멤버가 있습니다.`);
	},
});
