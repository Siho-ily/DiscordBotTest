// get-command-info.js
import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';

config({ path: './src/Config/.env' });

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const rest = new REST({ version: '10' }).setToken(token);

async function fetchGuildCommands() {
	try {
		const commands = await rest.get(Routes.applicationGuildCommands(clientId, guildId));

		console.log(`📋 등록된 명령어 ${commands.length}개:\n`);
		console.log(JSON.stringify(commands, null, 2));
	} catch (err) {
		console.error('❌ 명령어 목록 가져오기 실패:', err);
	}
}

fetchGuildCommands();
