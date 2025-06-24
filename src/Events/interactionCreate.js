import { Collection, Events, InteractionType } from 'discord.js';
import { config } from 'dotenv';

config({ path: './src/Config/.env' });
const owners = process.env.OWNERS.split(',');

const cooldown = new Collection();

export const event = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		const { client } = interaction;
		if (!interaction.type === InteractionType.ApplicationCommand) {
			return;
		}
		if (interaction.user.bot) {
			return;
		}

		try {
			const command = client.slashCommands.get(interaction.commandName);
			if (command) {
				if (command.ownerOnly && !owners.includes(interaction.user.id)) {
					return interaction.reply({
						content: '**developers**만 이 명령어를 사용할 수 있습니다..',
						ephemeral: true,
					});
				}

				if (command.cooldown) {
					if (cooldown.has(`${command.name}-${interaction.user.id}`)) {
						const nowDate = interaction.createdTimestamp;
						const waitedDate = cooldown.get(`${command.name}-${interaction.user.id}`) - nowDate;
						return interaction
							.reply({
								content: `현재 쿨타임중입니다. 나중에 다시 시도하여주세요. <t:${Math.floor(
									new Date(nowDate + waitedDate).getTime() / 1000
								)}:R>.`,
								ephemeral: true,
							})
							.then(() =>
								setTimeout(
									() => interaction.deleteReply(),
									cooldown.get(`${command.name}-${interaction.user.id}`) - Date.now() + 1000
								)
							);
					}

					command.slashRun(client, interaction);

					cooldown.set(`${command.name}-${interaction.user.id}`, Date.now() + command.cooldown);

					setTimeout(() => {
						cooldown.delete(`${command.name}-${interaction.user.id}`);
					}, command.cooldown + 1000);
				} else {
					command.slashRun(client, interaction);
				}
			}
		} catch (e) {
			console.error(`[InteractionCreate] 명령어 실행 중 오류 발생`, e);
			interaction.reply({
				content: '오류가 발생하였습니다. 나중에 다시 시도하여주세요.',
				ephemeral: true,
			});
		}
	},
};
