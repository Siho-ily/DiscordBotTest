# 🚀 슬래시 명령어 등록 / 배포

슬래시 명령어는 Discord 서버 또는 글로벌에 등록해야 사용할 수 있습니다.

---

## 🔧 배포 스크립트 실행

```bash
node deploy-commands.js
```

> 📌 기본적으로 `commands/` 폴더의 `.data` 구조를 읽어서 등록합니다.

---

## ✅ 등록 전략

| 유형 | 설명 |
|------|------|
| **Guild 등록** | 빠르게 반영됨 (테스트용) |
| **Global 등록** | 전 서버 적용, 반영에 최대 1시간 소요 |

---

## ⚠️ 자주 발생하는 에러

### `DiscordAPIError[50035]`

- Invalid Form Body
- 옵션 구조가 잘못되었거나, 서브커맨드/옵션 혼합 불가

### 해결 팁

- Subcommand Group (`type: 2`) 안에는 오직 Subcommand (`type: 1`)만 올 수 있음
- Subcommand/Group과 일반 옵션은 동시에 쓸 수 없음
