import { Collection, Events, MessageFlags } from 'discord.js';
import { readdirSync } from 'node:fs';
import { config } from 'dotenv';

config({ path: './src/Config/.env' });
const prefix = process.env.PREFIX;

export default async function commandHandler(client) {
	client.commands = new Collection();
	client.commandAliases = new Collection();
	client.slashCommands = new Collection();
	client.slashDatas = [];

	// - Handlers -
	const commandFolders = readdirSync('./src/Commands');

	await Promise.all(
		commandFolders.map(async (category) => {
			const commandFiles = readdirSync(`./src/Commands/${category}`);

			await Promise.all(
				commandFiles.map(async (file) => {
					// js 파일이 아니면 무시
					if (!file.endsWith('.js')) return;

					// 파일 경로 및 모듈 가져오기
					const path = `../Commands/${category}/${file}`;
					const module = await import(path);
					const command = module?.commandBase;

					if (!command) {
						console.warn(`[Commands]: commandBase가 정의되지 않아 무시되었습니다. 경로: '${path}'`);
						return;
					}

					// prefixData와 slashData가 모두 정의되지 않은 경우 경고 메시지 출력하고 무시
					if (!command.prefixData && !command.slashCommands) {
						console.warn(`[Commands]: prefixData 혹은 slashData 중 하나 이상 정의되지 않아 무시되었습니다.  경로: '${path}'`);
						return;
					}

					// Handle prefix command
					if (command.prefixData) {
						client.commands.set(command.prefixData.name, command);
						if (Array.isArray(command.prefixData.aliases)) {
							command.prefixData.aliases.forEach((alias) => client.commandAliases.set(alias, command.prefixData.name));
						}
					}

					// Handle slash command
					if (command.slashData) {
						client.slashDatas.push(command.slashData.toJSON());
						client.slashCommands.set(command.slashData.name, command);
					}
				})
			);
		})
	);

	client.on(Events.InteractionCreate, async (interaction) => {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.slashRun(client, interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
			}
		}
	});

	client.on('messageCreate', async (message) => {
		// 봇 메시지, DM 등 무시
		if (message.author.bot || !message.guild) return;

		// 접두사 확인 (예: '!')
		if (!message.content.startsWith(prefix)) return;

		// 명령어 이름 + 인자 분리
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();

		// 명령어 또는 별칭 확인
		const cmdKey = client.commands.has(commandName) ? commandName : client.commandAliases.get(commandName);

		if (!cmdKey) return;

		const command = client.commands.get(cmdKey);
		if (!command || typeof command.prefixRun !== 'function') return;

		// 실행
		try {
			await command.prefixRun(client, message, args);
		} catch (error) {
			console.error(error);
			await message.reply('명령어 실행 중 오류가 발생했어요!');
		}
	});
}
