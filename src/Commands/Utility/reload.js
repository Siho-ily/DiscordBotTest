import { MessageFlags } from 'discord.js';
import { CommandData } from '../../structures/BaseCommand.js';
import { SlashDataToBuilder } from '../../Utils/SlashDataToBuilder.js';

export default new CommandData({
	name: 'reload',
	aliases: ['reload', 'debug'],
	allowPrefix: true,
	description: '커맨드를 리로드합니다.',
	options: [
		{
			name: 'command',
			description: '리로드할 커맨드의 이름을 입력하세요.',
			type: 'String',
			required: true,
		},
	],
	cooldown: 1000,
	ownerOnly: true,

	async execute(ctx) {
		const commandName = ctx.type === 'slash' ? ctx.options?.getString('command')?.toLowerCase() : ctx.args?.[0]?.toLowerCase();

		if (!commandName) {
			return ctx.reply({
				content: '리로드할 커맨드 이름을 입력하세요.',
				flags: MessageFlags.Ephemeral,
			});
		}

		const result = await reloadCommand(ctx.client, commandName);

		return ctx.reply({
			content: result.success ?? result.error,
			flags: MessageFlags.Ephemeral,
		});
	},
});

function findCommand(client, name) {
	const key = name.toLowerCase();
	return client.commands.get(key) || client.commands.get(client.commandAliases.get(key));
}

async function reloadCommand(client, commandName) {
	console.log(`[Reload Command] 리로드 시도: ${commandName}`);

	const oldCommand = findCommand(client, commandName);
	if (!oldCommand || !oldCommand.__filePath) {
		console.warn(`[Reload Command] ${commandName} 커맨드를 찾을 수 없거나 경로가 없습니다.`, { oldCommand, path: oldCommand?.__filePath });
		return {
			error: `❌ \`${commandName}\` 커맨드는 존재하지 않거나, 리로드할 수 없습니다.`,
		};
	}

	try {
		const updatedPath = `${oldCommand.__filePath}?update=${Date.now()}`;
		const { default: newCommand } = await import(updatedPath);

		newCommand.__filePath = oldCommand.__filePath;

		// 접두사 명령어 등록
		client.commands.set(newCommand.name, newCommand);
		for (const alias of newCommand.aliases || []) {
			client.commandAliases.set(alias, newCommand.name);
		}

		// 슬래시 명령어 등록
		if (newCommand.description && Array.isArray(newCommand.options)) {
			try {
				const builder = SlashDataToBuilder(newCommand);
				client.slashCommands.set(newCommand.name, newCommand);

				const idx = client.slashDatas.findIndex((d) => d.name === newCommand.name);
				if (idx !== -1) {
					client.slashDatas[idx] = builder.toJSON();
				} else {
					client.slashDatas.push(builder.toJSON());
				}
				console.log(`[Reload Slash] ${newCommand.name} 슬래시 명령어 갱신 완료`);
			} catch (e) {
				console.warn(`[Reload Slash] ${newCommand.name} 슬래시 등록 실패 → ${e.message}`);
			}
		}

		return {
			success: `✅ \`${newCommand.name}\` 명령어가 성공적으로 리로드되었습니다.`,
		};
	} catch (error) {
		console.error(`[Reload Command] ${commandName} 오류:`, error);
		return {
			error: `❌ \`${commandName}\` 리로드 중 오류:\n\`${error.message}\``,
		};
	}
}
