import { MessageFlags } from 'discord.js';
import { CommandData } from '../../structures/BaseCommand.js';

export default new CommandData({
	name: 'server',
	aliases: ['서버정보', '서버'],
	allowPrefix: true,
	options: [],
	description: '서버 정보를 제공합니다.',
	cooldown: 1000,
	ownerOnly: false,

	async execute(context) {
		const guild = context?.guild;
		if (!guild) return context.reply({ content: '이 명령어는 서버 내에서만 사용할 수 있습니다.', flags: MessageFlags.Ephemeral });
		const content = `이 서버의 이름은 ${guild.name}이며, ${guild.memberCount}명의 멤버가 있습니다.`;
		return context.reply(content);
	},
});
