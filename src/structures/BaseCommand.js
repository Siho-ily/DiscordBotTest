export class BaseCommand {
	constructor({ prefixData, slashData, cooldown = 0, ownerOnly = false, prefixRun, slashRun }) {
		// 최소 하나는 필수
		if (!prefixData && !slashData) {
			throw new Error('BaseCommand는 반드시 prefixData 또는 slashData 중 하나 이상을 포함해야 합니다.');
		}

		// prefixData 검증
		if (prefixData) {
			// name 필수, aliases는 배열이어야 함
			if (!prefixData.name) {
				throw new Error('prefixData.name은 필수입니다.');
			}
			if (typeof prefixData.name !== 'string') {
				throw new Error('prefixData.name은 문자열이여야합니다.');
			}
			if (!prefixData.name.trim()) {
				throw new Error('prefixData.name은 빈 문자열일 수 없습니다.');
			}
			if ('aliases' in prefixData && !Array.isArray(prefixData.aliases)) {
				throw new Error('prefixData.aliases는 반드시 배열이어야 합니다.');
			}
		}
		// slashData 검증
		if (slashData && (typeof slashData.name !== 'string' || typeof slashData.toJSON !== 'function')) {
			throw new Error('slashData는 반드시 SlashCommandBuilder 인스턴스여야 합니다.');
		}
		// cooldown은 숫자여야 하며, 0 이상이여야 함
		if (typeof cooldown !== 'number' || cooldown < 0) {
			throw new Error('cooldown은 반드시 0 이상의 숫자여야 합니다.');
		}
		// ownerOnly는 boolean이어야 함
		if (typeof ownerOnly !== 'boolean') {
			throw new Error('ownerOnly는 반드시 boolean이어야 합니다.');
		}

		// 할당
		this.prefixData = prefixData;
		this.slashData = slashData;
		this.cooldown = cooldown;
		this.ownerOnly = ownerOnly;
		this.prefixRun = prefixRun;
		this.slashRun = slashRun;
	}
}
