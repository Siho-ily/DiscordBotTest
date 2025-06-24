import { SlashCommandBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';

export const commandBase = new BaseCommand({
	prefixData: {
		name: 'user',
		aliases: ['유저정보', '유저'],
	},
	slashData: new SlashCommandBuilder().setName('user').setDescription('입력한 사용자에 대한 정보를 반환합니다'),
	// 1 s = 1000 ms / 0으로 설정하면 쿨타임이 없음
	cooldown: 1000,
	// 관리자만 사용하려면 true로 설정
	ownerOnly: false,
	// 응답 처리
	async prefixRun(client, message) {
		message.reply(`이 커멘드는 ${message.user.username}에 의해 사용되었으며, ${message.member.joinedAt}에 서버에 참여하였습니다.`);
	},
	async slashRun(client, interaction) {
		interaction.reply(`이 커멘드는 ${interaction.user.username}에 의해 사용되었으며, ${interaction.member.joinedAt}에 서버에 참여하였습니다.`);
	},
});
