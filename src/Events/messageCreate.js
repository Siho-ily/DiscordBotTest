import { ChannelType, Collection, Events, MessageFlags } from 'discord.js';
import { CommandContext } from '../structures/CommandContext.js';
import dotenv from 'dotenv';

dotenv.config({ path: './src/Config/.env' });
const config = process.env;
const prefix = config.PREFIX;
const owners = Array.isArray(config.OWNERS) ? config.OWNERS : config.OWNERS.split(',').map((id) => id.trim());

const cooldown = new Collection();

export const event = {
	name: Events.MessageCreate,
	async execute(message) {
		const { client } = message;

		// 기본 검증
		// 봇 메시지, DM 채널, 접두사 없는 메시지 무시
		if (message.author.bot) {
			return;
		}
		if (message.channel.type === ChannelType.DM) {
			return;
		}
		if (!message.content.startsWith(prefix)) {
			return;
		}

		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const cmd = args.shift().toLowerCase();

		if (cmd.length === 0) {
			return;
		}

		let command = client.commands.get(cmd) || client.commands.get(client.commandAliases.get(cmd));
		if (!command) {
			return message.reply({ content: `\`${cmd}\` 명령어는 존재하지 않습니다.`, flags: MessageFlags.Ephemeral });
		}

		if (command.ownerOnly && !owners.includes(message.author.id)) {
			return message.reply({ content: `⛔ 해당 명령어는 개발자만 사용할 수 있습니다.`, flags: MessageFlags.Ephemeral });
		}

		if (!command.allowPrefix) {
			return message.reply({ content: `⚠️ 이 명령어는 슬래시 명령어로만 사용할 수 있습니다.`, flags: MessageFlags.Ephemeral });
		}

		const cooldownKey = `${command.name}-${message.author.id}`;
		if (cooldown.has(cooldownKey)) {
			const remaining = Math.floor(cooldown.get(cooldownKey) / 1000);
			return message.reply({ content: `⏳ 쿨타임 중입니다. <t:${remaining}:R> 다시 시도해주세요.`, flags: MessageFlags.Ephemeral });
		}

		// 실행
		const context = new CommandContext({ message, args });
		try {
			await command.execute(context);
		} catch (err) {
			console.error(`[PrefixCommand Error]`, err);
			message.reply({ content: `❌ 명령어 실행 중 오류가 발생했습니다.`, flags: MessageFlags.Ephemeral });
		}

		// 쿨다운 등록
		if (command.cooldown > 0) {
			cooldown.set(cooldownKey, Date.now() + command.cooldown);
			setTimeout(() => cooldown.delete(cooldownKey), command.cooldown);
		}
	},
};
