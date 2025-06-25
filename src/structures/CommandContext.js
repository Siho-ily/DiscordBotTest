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
				if (this.type === 'slash') return interaction.reply({ content: '잘못된 응답 형식입니다.', flags: MessageFlags.Ephemeral });
				if (this.type === 'prefix') return message.reply('잘못된 응답 형식입니다.');
				return;
			}

			if (this.type === 'prefix') return message.reply(content);
			if (this.type === 'slash') return interaction.reply(content);
		};

		this.deferReply = (content) => {
			const payload = normalizeReplyContent(content, 'deferReplay');
			if (!payload && payload !== undefined) {
				console.warn('[CommandContext] 잘못된 응답 형식. 응답 생략됨.');
				if (this.type === 'slash') return interaction.deferReply({ content: '잘못된 응답 형식입니다.', flags: MessageFlags.Ephemeral });
				if (this.type === 'prefix') return message.reply('잘못된 응답 형식입니다.');
				return;
			}

			if (this.type === 'slash') return this.interaction.deferReply(payload);
			if (this.type === 'prefix') return message.reply('이 기능은 슬래시 명령어에서만 사용 가능합니다.');
		};

		this.editReply = (content) => {
			const payload = normalizeReplyContent(content);
			if (!payload) {
				console.warn('[CommandContext] 잘못된 응답 형식. 응답 생략됨.');
				if (this.type === 'slash') return interaction.editReply({ content: '잘못된 응답 형식입니다.', flags: MessageFlags.Ephemeral });
				if (this.type === 'prefix') return message.reply('잘못된 응답 형식입니다.');
				return;
			}

			if (this.type === 'slash') return this.interaction.editReply(payload);
			if (this.type === 'prefix') return message.reply('이 기능은 슬래시 명령어에서만 사용 가능합니다.');
		};

		this.followUp = (content) => {
			const payload = normalizeReplyContent(content);
			if (!payload) {
				console.warn('[CommandContext] 잘못된 응답 형식. 응답 생략됨.');
				if (this.type === 'slash') return interaction.followUp({ content: '잘못된 응답 형식입니다.', flags: MessageFlags.Ephemeral });
				if (this.type === 'prefix') return message.reply('잘못된 응답 형식입니다.');
				return;
			}

			if (this.type === 'slash') return this.interaction.followUp(payload);
			if (this.type === 'prefix') return message.reply('이 기능은 슬래시 명령어에서만 사용 가능합니다.');
		};

		this.deleteReply = (content) => {
			const payload = normalizeReplyContent(content);
			if (!payload) {
				console.warn('[CommandContext] 잘못된 응답 형식. 응답 생략됨.');
				if (this.type === 'slash') return interaction.deleteReply({ content: '잘못된 응답 형식입니다.', flags: MessageFlags.Ephemeral });
				if (this.type === 'prefix') return message.reply('잘못된 응답 형식입니다.');
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
function normalizeReplyContent(content, expectedType = 'default') {
	// 응답 형식에 따른 기대 타입 처리
	if (expectedType === 'deferReplay' && content === undefined) {
		return undefined;
	}

	if (!content) return null;

	if (typeof content === 'string') {
		return { content };
	}

	if (typeof content === 'object') {
		// content, embeds, components, files 중 하나라도 있으면 유효
		if ('content' in content || 'embeds' in content || 'components' in content || 'files' in content || 'attachments' in content) {
			return content;
		}
	}

	return null;
}
