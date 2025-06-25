# ⚙️ 설정 파일 안내 (config)

이 문서는 봇의 설정 정보를 어디서 정의하고 어떻게 사용하는지 설명합니다.

---

## 📦 기본 설정 구조 (`.env` 또는 `config.json`)

### 예시 `.env`
```
DISCORD_TOKEN=your-bot-token
GUILD_ID=123456789012345678
CLIENT_ID=123456789012345678
DEV_USER_ID=111111111111111111
```

### 예시 `config.json`
```json
{
  "prefix": "!",
  "ownerIds": ["111111111111111111"],
  "logLevel": "debug"
}
```

---

## ✅ 사용 예시

```js
import 'dotenv/config';
const token = process.env.DISCORD_TOKEN;
```

또는

```js
import config from './config.json';
const prefix = config.prefix;
```

---

## 📌 추천 방식

- 민감 정보는 `.env` 파일에 저장하고 `.gitignore` 처리
- 개발자/환경 설정은 `config.json` 등 별도 유지
