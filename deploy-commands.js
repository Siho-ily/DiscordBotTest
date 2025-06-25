import { REST, Routes } from 'discord.js';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { config } from 'dotenv';
import { readdirSync } from 'node:fs';

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

		// 필수 속성 검사
		if (!command?.name || !command?.description) {
			console.warn(`[등록 무시] ${file} → name 또는 description 없음`);
			continue;
		}

		commands.push({
			name: command.name,
			description: command.description,
			options: command.options || [],
		});
	}
}

// 디스코드 등록 요청
const rest = new REST({ version: '10' }).setToken(token);

try {
	console.log(`🔄 슬래시 명령어 ${commands.length}개 등록 시도 중...`);
	const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
	console.log(`✅ ${data.length}개 등록 완료.`);
} catch (err) {
	console.error('❌ 등록 실패:', err);
}
