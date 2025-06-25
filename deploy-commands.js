import { REST, Routes, ApplicationCommandOptionType } from 'discord.js';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { config } from 'dotenv';
import { readdirSync } from 'node:fs';

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

// 서브커맨드 타입 숫자 직접 지정 (discord.js enum 값)
const SUBCOMMAND_TYPE_MAP = {
	Subcommand: 1,
	SubcommandGroup: 2,
};

// 재귀 타입 매핑 함수
function mapOptionTypes(option, file) {
	const baseType = OPTION_TYPE_MAP[option.type] ?? SUBCOMMAND_TYPE_MAP[option.type];

	if (!baseType) {
		throw new Error(`지원되지 않는 옵션 타입: ${option.type} in ${file}`);
	}

	const mapped = {
		...option,
		type: baseType,
	};

	if (Array.isArray(option.options)) {
		mapped.options = option.options.map((subOpt) => mapOptionTypes(subOpt, file));
	}

	return mapped;
}

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

		const fixedOptions = (command.options || []).map((opt) => mapOptionTypes(opt, file));

		commands.push({
			name: command.name,
			description: command.description,
			options: fixedOptions,
		});
	}
}

// 슬래시 명령어 등록
const rest = new REST({ version: '10' }).setToken(token);

try {
	console.log(`🔄 슬래시 명령어 ${commands.length}개 등록 시도 중...\n[${commands.map((e) => e.name).join(' | ')}]`);
	const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
	console.log(`✅ ${data.length}개 등록 완료.`);
} catch (err) {
	console.error('❌ 등록 실패:', err);
}
