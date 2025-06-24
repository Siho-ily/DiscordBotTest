import { REST, Routes } from 'discord.js';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { config } from 'dotenv';
import { readdirSync } from 'node:fs';

// Load .env
config({ path: './src/Config/.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 환경 변수
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const commands = [];

const foldersPath = path.join(__dirname, 'src', 'Commands');
const commandFolders = readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandPath = path.join(foldersPath, folder);
	const commandFiles = readdirSync(commandPath).filter((file) => file.endsWith('.js'));

	for (const file of commandFiles) {
		const fullPath = path.join(commandPath, file);
		const commandModule = await import(pathToFileURL(fullPath).href);
		const base = commandModule?.commandBase;

		if (base?.slashData && typeof base.slashData.toJSON === 'function') {
			commands.push(base.slashData.toJSON());
		} else {
			console.warn(`[등록 무시] ${fullPath} → slashData 누락`);
		}
	}
}

// 등록 요청
const rest = new REST().setToken(token);

try {
	console.log(`🔄 총 ${commands.length}개의 슬래시 명령어를 갱신 중...`);
	// 글로벌 서버에 적용시키고 싶으면, Routes.applicationCommands(clientId)을 사용
	const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
	console.log(`✅ 슬래시 명령어 ${data.length}개 등록 완료.`);
} catch (err) {
	console.error('❌ 명령어 등록 실패:', err);
}
