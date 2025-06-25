import { REST, Routes } from 'discord.js';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { config } from 'dotenv';
import { readdirSync } from 'node:fs';
import { ApplicationCommandOptionType } from 'discord.js';

config({ path: './src/Config/.env' });

const OPTION_TYPE_MAP = {
	String: ApplicationCommandOptionType.String,
	Integer: ApplicationCommandOptionType.Integer,
	Boolean: ApplicationCommandOptionType.Boolean,
	User: ApplicationCommandOptionType.User,
	Channel: ApplicationCommandOptionType.Channel,
	Role: ApplicationCommandOptionType.Role,
	Mentionable: ApplicationCommandOptionType.Mentionable,
	Number: ApplicationCommandOptionType.Number,
	Attachment: ApplicationCommandOptionType.Attachment,
};

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

		// 🔁 옵션 타입 변환
		const fixedOptions = (command.options || []).map((opt) => {
			const mappedType = OPTION_TYPE_MAP[opt.type];
			if (!mappedType) {
				throw new Error(`지원되지 않는 옵션 타입: ${opt.type} in ${file}`);
			}

			return {
				...opt,
				type: mappedType,
			};
		});

		commands.push({
			name: command.name,
			description: command.description,
			options: fixedOptions,
		});
	}
}

// 디스코드 등록 요청
const rest = new REST({ version: '10' }).setToken(token);

try {
	console.log(`🔄 슬래시 명령어 ${commands.length}개 등록 시도 중...\n[${commands.map((e) => e.name).join(' | ')}]`);
	const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
	console.log(`✅ ${data.length}개 등록 완료.`);
} catch (err) {
	console.error('❌ 등록 실패:', err);
}
