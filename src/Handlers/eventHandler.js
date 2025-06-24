import { readdirSync } from 'node:fs';

export default async function eventHandler(client) {
	const eventsPath = './src/Events';
	const eventFiles = readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

	for (const file of eventFiles) {
		const filePath = `../Events/${file}`;
		const event = (await import(filePath))?.event;

		if (!event) {
			console.warn(`[Events]: 이벤트 모듈이 올바르게 정의되지 않았습니다. 경로: '${filePath}'`);
			continue;
		}
		if (!event.name) {
			console.warn(`[Events]: 이벤트 이름이 정의되지 않았습니다. 경로: '${filePath}'`);
			continue;
		}
		if (typeof event.execute !== 'function') {
			console.warn(`[Events]: 이벤트 실행 함수가 정의되지 않았습니다. 경로: '${filePath}'`);
			continue;
		}

		try {
			if (event.once) {
				client.once(event.name, (...args) => event.execute(...args));
			} else {
				client.on(event.name, (...args) => event.execute(...args));
			}
		} catch (error) {
			console.error(`[Events]: 이벤트 핸들러 등록 중 오류가 발생했습니다. 경로: '${filePath}'`, error);
		}
	}
}
