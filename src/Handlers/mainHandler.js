import commandHandler from './commandHandler.js';
import eventHandler from './eventHandler.js';
// 필요 시 추가 핸들러 import
// import componentHandler from './componentHandler.js';

/**
 * 클라이언트에 필요한 모든 핸들러를 순차적으로 실행합니다.
 * 각 핸들러는 오류 발생 시 개별적으로 처리되며, 전체 로딩에는 영향을 주지 않습니다.
 */
export async function loadInitHandlers(client) {
	const handlers = [
		// { name: '컴포넌트', fn: componentHandler },
		{ name: '명령어', fn: commandHandler },
		{ name: '이벤트', fn: eventHandler },
	];

	for (const { name, fn } of handlers) {
		try {
			await fn(client);
			console.log(`[mainHandler] ${name} 핸들러 로딩 완료`);
		} catch (err) {
			console.error(`[mainHandler] ${name} 핸들러 로딩 실패:`, err);
		}
	}
}
