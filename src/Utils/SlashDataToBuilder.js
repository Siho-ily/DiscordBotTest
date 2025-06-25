import { SlashCommandBuilder } from 'discord.js';

const SUPPORTED_OPTION_TYPES = {
	String: 'addStringOption',
	Integer: 'addIntegerOption',
	Boolean: 'addBooleanOption',
	User: 'addUserOption',
	Channel: 'addChannelOption',
	Role: 'addRoleOption',
	Number: 'addNumberOption',
	Attachment: 'addAttachmentOption',
	Mentionable: 'addMentionableOption',
};

/**
 * CommandData 객체를 SlashCommandBuilder로 변환합니다.
 * @param {object} cmd CommandData 인스턴스
 * @returns {SlashCommandBuilder}
 */
export function SlashDataToBuilder(cmd) {
	if (!cmd.name || !cmd.description) {
		throw new Error(`명령어 이름 또는 설명이 없습니다: ${cmd.name}`);
	}

	const builder = new SlashCommandBuilder().setName(cmd.name).setDescription(cmd.description);

	for (const opt of cmd.options || []) {
		if (!opt.name || !opt.description || !opt.type) {
			throw new Error(`옵션 '${opt.name ?? '알 수 없음'}'에 name/description/type 중 누락된 항목이 있습니다.`);
		}

		const method = SUPPORTED_OPTION_TYPES[opt.type];
		if (!method || typeof builder[method] !== 'function') {
			throw new Error(`지원되지 않는 옵션 타입: '${opt.type}'`);
		}

		builder[method]((option) =>
			option
				.setName(opt.name)
				.setDescription(opt.description)
				.setRequired(opt.required ?? false)
		);
	}

	return builder;
}
