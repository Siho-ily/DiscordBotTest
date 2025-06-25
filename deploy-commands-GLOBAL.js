import { REST, Routes } from 'discord.js';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { config } from 'dotenv';
import { readdirSync } from 'node:fs';
import { SlashDataToBuilder } from './src/Utils/SlashDataToBuilder.js';

config({ path: './src/Config/.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const commands = [];

const foldersPath = path.join(__dirname, './src/Commands');
const commandFolders = readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandPath = path.join(foldersPath, folder);
	const commandFiles = readdirSync(commandPath).filter((file) => file.endsWith('.js'));

	for (const file of commandFiles) {
		const fullPath = path.join(commandPath, file);
		const { default: command } = await import(pathToFileURL(fullPath).href);

		if (!command?.name || !command?.description) {
			console.warn(`[등록 무시] ${file} → name 또는 description 없음`);
			continue;
		}

		try {
			const builder = SlashDataToBuilder(command);
			commands.push(builder.toJSON());
			console.log(`✅ 명령어 변환 완료: ${command.name}`);
		} catch (err) {
			console.error(`❌ [${command.name}] 변환 실패:`, err);
		}
	}
}

const rest = new REST({ version: '10' }).setToken(token);

try {
	console.log(`🚀 슬래시 명령어 ${commands.length}개 등록 시도 중...\n[${commands.map((e) => e.name).join(' | ')}]`);
	// 서버 전용 명령어 등록
	// const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
	// 글로벌 명령어 등록
	const data = await rest.put(Routes.applicationCommands(clientId), { body: commands });
	console.log(`🎉 ${data.length}개 등록 완료.`);
} catch (err) {
	console.error('❌ 등록 실패:', err);
}
