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
			if (this.type === 'prefix') return message.reply(content);
			if (this.type === 'slash') return interaction.reply(content);
		};

		this.getOption = (name) => {
			return this.type === 'slash' ? this.options?.get(name) : this.args?.[0];
		};
	}
}
