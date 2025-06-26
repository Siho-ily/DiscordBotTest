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
	// 글로벌, 초기화, 리셋 flag
	const globalFlag = process.env.GLOBAL_COMMANDS === 'true' ? true : false;
	const initFlag = process.env.INIT_COMMANDS === 'true' ? true : false;
	const resetFlag = process.env.RESET_COMMANDS === 'true' ? true : false;
	let data;

	console.log(`🔧 명령어 등록 시작... (글로벌: ${globalFlag}, 초기화: ${initFlag}, 리셋: ${resetFlag}`);
	if (resetFlag) {
		console.log('🔄 기존 명령어 삭제 중...');
		await rest.put(Routes.applicationCommands(clientId), { body: [] });
		await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
		console.log('기존 명령어 삭제 완료.');
	} else {
		console.log(`🚀 슬래시 명령어 ${commands.length}개 등록 시도 중...\n[${commands.map((e) => e.name).join(' | ')}]`);

		if (globalFlag) {
			// 글로벌 명령어 등록
			initFlag === true ? await rest.put(Routes.applicationCommands(clientId), { body: [] }) : null;
			data = await rest.put(Routes.applicationCommands(clientId), { body: commands });
		} else {
			// 서버 전용 명령어 등록
			initFlag === true ? await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] }) : null;
			data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
		}
	}

	console.log(`🎉 ${data.length}개 등록 완료!`);
} catch (err) {
	console.error('❌ 등록 실패:', err);
}
