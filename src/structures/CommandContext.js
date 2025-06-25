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
			if (!content || (typeof content === 'object' && !content.content)) {
				console.warn('[reply] 빈 메시지 전송 시도 감지됨. 응답 중단.');
				return;
			}

			if (this.type === 'prefix') return message.reply(content);
			if (this.type === 'slash') return interaction.reply(content);
		};

		this.deferReply = (options) => {
			if (this.type === 'slash') return this.interaction.deferReply(options);
			if (this.type === 'prefix')
				return message.reply({ content: '슬래시 명령어에서만 사용 가능한 기능입니다.', flags: MessageFlags.Ephemeral });
		};

		this.editReply = (options) => {
			if (this.type === 'slash') return this.interaction.editReply(options);
			throw new Error('editReply는 슬래시 명령어에서만 사용할 수 있습니다.');
		};

		this.getOption = (name) => {
			return this.type === 'slash' ? this.options?.get(name) : this.args?.[0];
		};
	}
}
