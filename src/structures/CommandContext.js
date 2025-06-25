import { MessageFlags } from 'discord.js';

export class CommandContext {
	constructor({ message = null, interaction = null, args = [] }) {
		this.type = message ? 'prefix' : 'slash';
		this.message = message;
		this.interaction = interaction;

		this.client = message?.client ?? interaction?.client;
		this.user = message?.author ?? interaction?.user;
		this.guild = message?.guild ?? interaction?.guild;

		this.args = args;
		this.options = interaction?.options ?? null;

		this.reply = (content) => {
			const payload = normalizeReplyContent(content);
			if (!payload) {
				console.warn('[reply] 잘못된 응답 형식. 응답 생략됨.');
				return;
			}

			if (this.type === 'prefix') return message.reply(content);
			if (this.type === 'slash') return interaction.reply(content);
		};

		this.deferReply = (content) => {
			const payload = normalizeReplyContent(content);
			if (!payload) {
				console.warn('[reply] 잘못된 응답 형식. 응답 생략됨.');
				return;
			}

			if (this.type === 'slash') return this.interaction.deferReply(payload);
			if (this.type === 'prefix') return message.reply('이 기능은 슬래시 명령어에서만 사용 가능합니다.');
		};

		this.editReply = (content) => {
			const payload = normalizeReplyContent(content);
			if (!payload) {
				console.warn('[reply] 잘못된 응답 형식. 응답 생략됨.');
				return;
			}

			if (this.type === 'slash') return this.interaction.editReply(payload);
			if (this.type === 'prefix') return message.reply('이 기능은 슬래시 명령어에서만 사용 가능합니다.');
		};

		this.followUp = (content) => {
			const payload = normalizeReplyContent(content);
			if (!payload) {
				console.warn('[reply] 잘못된 응답 형식. 응답 생략됨.');
				return;
			}

			if (this.type === 'slash') return this.interaction.followUp(payload);
			if (this.type === 'prefix') return message.reply('이 기능은 슬래시 명령어에서만 사용 가능합니다.');
		};

		this.deleteReply = (content) => {
			const payload = normalizeReplyContent(content);
			if (!payload) {
				console.warn('[reply] 잘못된 응답 형식. 응답 생략됨.');
				return;
			}

			if (this.type === 'slash') return this.interaction.deleteReply(payload);
			if (this.type === 'prefix') return message.reply('이 기능은 슬래시 명령어에서만 사용 가능합니다.');
		};

		this.getOption = ({ name, index } = {}) => {
			if (this.type === 'slash') return this.options?.get(name);
			if (typeof index === 'number') return this.args?.[index];
			if (typeof name === 'number') return this.args?.[name]; // index를 name으로 대신
			return null;
		};
	}
}
function normalizeReplyContent(content) {
	if (!content) return null;

	if (typeof content === 'string') {
		return { content };
	}

	if (typeof content === 'object' && content.content) {
		return content;
	}

	return null;
}
