import { InteractionContextType, PermissionFlagsBits } from 'discord.js';

const VALID_TYPES = [
	'String',
	'Integer',
	'Boolean',
	'User',
	'Channel',
	'Role',
	'Mentionable',
	'Number',
	'Attachment',
	'Subcommand',
	'SubcommandGroup',
];

export class CommandData {
	constructor({
		name,
		description,
		descriptionLocalizations = {},
		aliases = [],
		allowPrefix = false,
		options = [],
		cooldown = 0,
		ownerOnly = false,
		execute,
		autocomplete,
		defaultMemberPermissions = null,
		context = null,
		autoComplete = null,
		// 추가적인 필드가 필요할 경우 여기에 추가
	}) {
		// name 검사
		if (!name || typeof name !== 'string' || !name.trim()) {
			throw new Error('Command name은 필수 항목이며, 문자열이여야 합니다.');
		}

		// description 검사
		if (!description || typeof description !== 'string' || !description.trim()) {
			throw new Error('Command description은 필수 항목이며, 문자열이여야 합니다.');
		}

		// aliases 검사
		if (!Array.isArray(aliases)) {
			throw new Error('aliases는 반드시 배열이어야 합니다.');
		}
		// aliases 내부 문자열 검사
		for (const alias of aliases) {
			if (typeof alias !== 'string' || !alias.trim()) {
				throw new Error('aliases 배열의 각 항목은 문자열이어야 합니다.');
			}
		}

		// allowPrefix 검사
		if (typeof allowPrefix !== 'boolean') {
			console.warn('allowPrefix는 boolean이어야 합니다. 기본값 false로 설정합니다.');
			allowPrefix = false;
		}

		// options 검사
		if (!Array.isArray(options)) {
			throw new Error('options는 반드시 배열이어야 합니다.');
		}
		// options 내부 객체 검사
		for (const option of options) {
			if (typeof option !== 'object' || option === null) {
				throw new Error('options 배열의 각 항목은 객체여야 합니다.');
			}
			if (!option.name || typeof option.name !== 'string' || !option.name.trim()) {
				throw new Error('option.name은 필수 문자열입니다. name은 빈 문자열일 수 없습니다.');
			}
			if (option.choices) {
				if (!Array.isArray(option.choices)) {
					throw new Error(`option "${option.name}"의 choices는 배열이어야 합니다.`);
				}
			}
			if (!option.description || typeof option.description !== 'string') {
				throw new Error(`option "${option.name}"은 description이 필요합니다.`);
			}
			if (option.nameLocalizations && typeof option.nameLocalizations !== 'object') {
				throw new Error(`option "${option.name}"의 nameLocalizations는 객체여야 합니다.`);
			}
			if (!option.type || typeof option.type !== 'string') {
				throw new Error('options 객체는 type 속성을 필수로 가져야 합니다.');
			}
			if (!VALID_TYPES.includes(option.type)) {
				throw new Error(`옵션 타입 '${option.type}'은 지원되지 않습니다.`);
			}
			if ('required' in option && typeof option.required !== 'boolean') {
				console.warn(`option "${option.name}"의 required가 잘못되었습니다. 기본값 false로 설정합니다.`);
				option.required = false;
			}
		}

		// cooldown 검사
		if (typeof cooldown !== 'number' || cooldown < 0) {
			throw new Error('cooldown은 숫자여야 하며, 0 이상의 값을 가져야 합니다.');
		}

		// ownerOnly 검사
		if (typeof ownerOnly !== 'boolean') {
			throw new Error('ownerOnly는 반드시 boolean이어야 합니다.');
		}

		// execute 검사
		if (!execute || typeof execute !== 'function') {
			throw new Error('execute는 필수 항목이며, 함수여야 합니다.');
		}
		if (execute.length !== 1) {
			throw new Error('execute 함수는 반드시 1개의 인자(context)를 받아야 합니다.');
		}

		// defaultMemberPermissions 검사
		if (defaultMemberPermissions && typeof defaultMemberPermissions !== 'bigint') {
			throw new Error('defaultMemberPermissions는 PermissionFlagsBits 객체이어야 합니다.');
		}

		// context 검사
		if (context && !(context instanceof InteractionContextType)) {
			throw new Error('context는 InteractionContextType 객체이어야합니다.');
		}

		// autoComplete 검사
		if (autoComplete && typeof autoComplete !== 'boolean') {
			throw new Error('autoComplete는 boolean이어야 합니다.');
		}
		if (autoComplete && (!autocomplete || typeof autocomplete !== 'function')) {
			throw new Error('autocomplete가 true인 경우, autocomplete 함수가 필요합니다.');
		}

		// 값 할당
		this.name = name;
		this.aliases = aliases;
		this.description = description;
		this.descriptionLocalizations = descriptionLocalizations;
		this.allowPrefix = allowPrefix;
		this.options = options;
		this.cooldown = cooldown;
		this.ownerOnly = ownerOnly;
		this.execute = execute;
		this.defaultMemberPermissions = defaultMemberPermissions;
		this.context = context;
		this.autoComplete = autoComplete;
		this.autocomplete = autocomplete;
	}
}
