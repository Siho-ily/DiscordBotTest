import { MessageFlags } from 'discord.js';
import { CommandData } from '../../structures/BaseCommand.js';

export default new CommandData({
	name: 'user',
	aliases: ['유저정보', '유저'],
	allowPrefix: true,
	options: [],
	description: '사용자에 대한 정보를 반환합니다',
	cooldown: 1000,
	ownerOnly: false,

	async execute(context) {
		const member = await context.guild.members.fetch(context.user.id);
		const joinedAt = member.joinedAt?.toLocaleString('ko-KR');
		context.reply({
			// 사용자 정보 반환
			// 유저 이름과 서버 참여 날짜 포함
			content: `이 커멘드는 ${context.user.username}에 의해 사용되었으며, ${joinedAt}에 서버에 참여했습니다.`,
			flags: MessageFlags.Ephemeral,
		});
	},
});
