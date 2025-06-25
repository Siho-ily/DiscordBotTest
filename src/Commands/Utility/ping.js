import { CommandData } from '../../structures/BaseCommand.js';

export default new CommandData({
	name: 'ping',
	allowPrefix: true,
	aliases: ['핑'],
	options: [], // slash 명령어 옵션 없을 경우 비워도 OK
	description: '봇의 응답을 확인합니다.',
	cooldown: 1000,
	ownerOnly: false,

	async execute(context) {
		const ping = context.client.ws.ping;
		return context.reply(`Pong 🏓 핑 속도는 ${await ping} 입니다!`);
	},
});
