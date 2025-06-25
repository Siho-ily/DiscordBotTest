import { Collection } from 'discord.js';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { config } from 'dotenv';
import { SlashDataToBuilder } from '../Utils/SlashDataToBuilder.js';

config({ path: './src/Config/.env' });

export default async function commandHandler(client) {
	client.commands = new Collection();
	client.commandAliases = new Collection();
	client.slashCommands = new Collection();
	client.slashDatas = [];

	const commandsPath = join(process.cwd(), 'src', 'Commands');
	const commandFolders = readdirSync(commandsPath);

	for (const category of commandFolders) {
		const folderPath = join(commandsPath, category);
		const commandFiles = readdirSync(folderPath).filter((f) => f.endsWith('.js'));

		for (const file of commandFiles) {
			const fullPath = join(folderPath, file);
			const module = await import(pathToFileURL(fullPath).href);
			const command = module?.default;

			if (!command) {
				console.warn(`[무시됨] ${file} → 기본 내보내기 없음`);
				continue;
			}

			registerCommand(client, command, pathToFileURL(fullPath).href);
		}
	}
}

function registerCommand(client, command, fileURL) {
	// 기본 검증
	if (!command.name || typeof command.execute !== 'function') {
		console.warn(`[무시됨] ${command?.name ?? '알 수 없음'} → 필수 속성 누락`);
		return;
	}

	command.__filePath = fileURL;

	// Prefix 등록
	client.commands.set(command.name, command);
	for (const alias of command.aliases || []) {
		client.commandAliases.set(alias, command.name);
	}

	// Slash 등록
	if (command.description && Array.isArray(command.options)) {
		try {
			const builder = SlashDataToBuilder(command);
			client.slashDatas.push(builder.toJSON());
			client.slashCommands.set(command.name, command);
		} catch (e) {
			throw new Error(`슬래시 명령어 등록 실패: ${command.name} - ${e.message}`);
		}
	}
}
