# 🧩 CommandContext 구조

CommandContext는 `interaction` 또는 `message`를 추상화한 통합 응답 핸들러입니다.

---

## 🧱 생성 방식

```js
const context = new CommandContext({ interaction });
```

또는

```js
const context = new CommandContext({ message });
```

---

## 🧰 주요 메서드

| 메서드 | 설명 |
|--------|------|
| `reply(content)` | 최초 응답 또는 메시지 전송 |
| `editReply(content)` | 기존 응답 수정 |
| `deferReply(content?)` | 응답 지연 (슬래시 전용) |
| `options.getString(name)` | 슬래시 옵션 가져오기 |
| `user`, `member`, `guild` | 호출자 정보 |

---

## ✅ 예시

```js
await context.deferReply();
const user = context.options.getUser('target');
await context.editReply(`유저: ${user.username}`);
```
