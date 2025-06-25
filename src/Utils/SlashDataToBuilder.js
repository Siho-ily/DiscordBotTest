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

export function SlashDataToBuilder(cmd) {
	if (!cmd.name || !cmd.description) {
		throw new Error(`명령어 이름 또는 설명이 없습니다: ${cmd.name}`);
	}

	const builder = new SlashCommandBuilder().setName(cmd.name).setDescription(cmd.description);

	// 현지화 지원
	if (cmd.nameLocalizations) builder.setNameLocalizations(cmd.nameLocalizations);
	if (cmd.descriptionLocalizations) builder.setDescriptionLocalizations(cmd.descriptionLocalizations);

	// 퍼미션 설정
	if (cmd.defaultMemberPermissions) builder.setDefaultMemberPermissions(cmd.defaultMemberPermissions);

	// 컨텍스트 설정
	if (cmd.context) builder.setContexts(cmd.context);

	for (const opt of cmd.options || []) {
		if (!opt.name || !opt.description || !opt.type) {
			throw new Error(`옵션 '${opt.name ?? '알 수 없음'}'에 name/description/type 중 누락된 항목이 있습니다.`);
		}

		// 서브커맨드 그룹 처리
		if (opt.type === 'SubcommandGroup') {
			builder.addSubcommandGroup((group) => {
				group.setName(opt.name).setDescription(opt.description);

				// 현지화 지원
				if (opt.nameLocalizations) group.setNameLocalizations(opt.nameLocalizations);
				if (opt.descriptionLocalizations) group.setDescriptionLocalizations(opt.descriptionLocalizations);

				// 서브커맨드 추가
				for (const sub of opt.options || []) {
					group.addSubcommand((subcmd) => {
						subcmd.setName(sub.name).setDescription(sub.description);
						if (sub.nameLocalizations) subcmd.setNameLocalizations(sub.nameLocalizations);
						if (sub.descriptionLocalizations) subcmd.setDescriptionLocalizations(sub.descriptionLocalizations);

						addOptionsToBuilder(subcmd, sub.options || []);
						return subcmd;
					});
				}
				return group;
			});
			continue;
		}

		// 서브커맨드 처리
		if (opt.type === 'Subcommand') {
			builder.addSubcommand((subcmd) => {
				subcmd.setName(opt.name).setDescription(opt.description);
				if (opt.nameLocalizations) subcmd.setNameLocalizations(opt.nameLocalizations);
				if (opt.descriptionLocalizations) subcmd.setDescriptionLocalizations(opt.descriptionLocalizations);

				addOptionsToBuilder(subcmd, opt.options || []);
				return subcmd;
			});
			continue;
		}

		// 일반 옵션 처리
		addOptionsToBuilder(builder, [opt]);
	}

	return builder;
}

function addOptionsToBuilder(builder, options) {
	for (const opt of options) {
		const method = SUPPORTED_OPTION_TYPES[opt.type];
		if (opt.type === 'Subcommand' || opt.type === 'SubcommandGroup') continue;
		if (!method || typeof builder[method] !== 'function') {
			throw new Error(`지원되지 않는 옵션 타입: '${opt.type}'`);
		}

		builder[method]((option) => {
			option
				.setName(opt.name)
				.setDescription(opt.description)
				.setRequired(opt.required ?? false);

			if (opt.nameLocalizations) option.setNameLocalizations(opt.nameLocalizations);
			if (opt.descriptionLocalizations) option.setDescriptionLocalizations(opt.descriptionLocalizations);
			if (Array.isArray(opt.choices) && opt.choices.length > 0) option.addChoices(...opt.choices);
			if (opt.minLength !== undefined) option.setMinLength(opt.minLength);
			if (opt.maxLength !== undefined) option.setMaxLength(opt.maxLength);
			if (opt.minValue !== undefined) option.setMinValue(opt.minValue);
			if (opt.maxValue !== undefined) option.setMaxValue(opt.maxValue);
			if (opt.channelTypes) option.addChannelTypes(...opt.channelTypes);

			return option;
		});
	}
}
