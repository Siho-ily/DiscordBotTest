export class CommandData {
	constructor({ name, description, aliases = [], allowPrefix = false, options = [], cooldown = 0, ownerOnly = false, execute }) {
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
				throw new Error('options 객체는 name 속성을 필수로 가져야 하며, 문자열이어야 합니다.');
			}
			if (!option.type || typeof option.type !== 'string') {
				throw new Error('options 객체는 type 속성을 필수로 가져야 하며, 숫자어야 합니다.');
			}
			if (option.required !== undefined && typeof option.required !== 'boolean') {
				// options 객체의 required 속성은 boolean이어야 함
				// 정의되어 있지 않다면, 기본값은 false로 설정
				option.required = false;
				console.warn(`options 객체의 ${option.name}에 required 속성이 정의되지 않았습니다. 기본값 false로 설정합니다.`);
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
		// execute 함수는 sender 인자를 받아야 함
		if (execute.length !== 1) {
			throw new Error('execute 함수는 반드시 interaction 인자를 받아야 합니다.');
		}

		// 값 할당
		this.name = name;
		this.aliases = aliases;
		this.description = description;
		this.allowPrefix = allowPrefix;
		this.options = options;
		this.cooldown = cooldown;
		this.ownerOnly = ownerOnly;
		this.execute = execute;
	}
}
