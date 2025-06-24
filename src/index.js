// Entry point

// discord.js 주요 모듈 가져오기
// Client: 디스코드 봇 클라이언트 인스턴스를 생성하는 클래스
// Events: 디스코드 봇에서 발생하는 다양한 이벤트를 정의하는 객체
// GatewayIntentBits: 디스코드 API와의 연결을 위한 권한을 설정하는데 사용되는 비트 플래그
import { Client, Events, GatewayIntentBits } from 'discord.js';

// 모듈 가져오기
import dotenv from 'dotenv';
import { loadHandlers } from './Handlers/mainHandler.js';

// env 파일 로드 및 환경 변수 세팅
dotenv.config({ path: './src/Config/.env' });
const token = process.env.TOKEN;

// Create a new client instance
// Discord.js 클라이언트 인스턴스 생성
// intents는 봇이 디스코드로부터 어떤 이벤트를 받을지 정의함
// GatewayIntentBits.Guilds는 봇이 서버 관련 이벤트를 받을 수 있도록 설정
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// 클라이언트가 준비 되었을 때 실행되는 이벤트 리스너 등록
// 'Events.ClientReady' 이벤트는 클라이언트가 디스코드 API와 연결되고 준비가 완료되었을 때 발생
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// 핸들러 로딩
try {
	await loadInitHandlers(client);
} catch (err) {
	console.error('[index] Init 핸들러 전체 로딩 실패:', err);
	process.exit(1);
}

// 토큰으로 디스코드에 로그인
client.login(token);
