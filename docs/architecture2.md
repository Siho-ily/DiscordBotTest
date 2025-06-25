# 🧠 프로젝트 아키텍처

이 문서는 이 Discord 봇의 전체 구조와 주요 흐름을 설명합니다.  
핵심 모듈, 디렉토리 역할, 커맨드 처리 과정 등을 이해하는 데 도움이 됩니다.

---

## 📁 디렉토리 구조

```
src/
├─ commands/             # 명령어 파일 (각 커맨드 정의)
│  ├─ user.js
│  └─ test.js
├─ events/               # Discord 이벤트 핸들러
│  ├─ ready.js
│  └─ interactionCreate.js
├─ core/
│  ├─ commandHandler.js  # 명령어 불러오기 및 실행 분기
│  └─ CommandContext.js  # interaction/message를 추상화한 응답 핸들러
├─ deploy-commands.js    # 슬래시 명령어 등록기
└─ index.js              # 봇 진입점
```

---

## 🔄 명령어 처리 흐름

```txt
Discord 슬래시 명령어 입력
        ↓
interactionCreate 이벤트 발생
        ↓
commandHandler.js → 적절한 command 로딩
        ↓
CommandContext 생성
        ↓
명령어.execute(context) 실행
        ↓
context.reply() 또는 context.editReply() 등으로 응답
```

---

## ⚙️ 핵심 모듈 설명

### `commandHandler.js`

-   명령어 파일을 로딩하고 `.data`로 등록용 SlashCommandBuilder 생성
-   `.execute()`로 명령어 로직 실행

### `CommandContext.js`

-   `interaction`과 `message`를 추상화한 컨텍스트
-   `.reply()`, `.deferReply()`, `.editReply()` 제공
-   슬래시/프리픽스 커맨드 모두 동일한 인터페이스로 다룸

---

## 🧩 Slash 명령어 구조

-   하나의 명령어는 다음 구조 중 하나를 가질 수 있습니다:

```
/test subcommand
/test group1 sub1
```

-   `CommandContext`는 `getSubcommand()`, `getSubcommandGroup()`을 통해 구조 파악

---

## 📦 명령어 정의 예시 (`commands/test.js`)

```js
export const data = {
  name: 'test',
  description: '테스트 명령어',
  options: [
    {
      type: 2, // Subcommand Group
      name: 'group1',
      description: '첫 번째 그룹',
      options: [
        {
          type: 1, // Subcommand
          name: 'sub1',
          description: '하위 명령어',
          options: [...]
        }
      ]
    }
  ]
};

export const execute = async (context) => {
  const group = context.options.getSubcommandGroup(false);
  const sub = context.options.getSubcommand(false);

  if (group === 'group1' && sub === 'sub1') {
    const option = context.options.getString('example');
    await context.reply(`받은 값: ${option}`);
  }
};
```

---

## 📌 개발자 참고

-   모든 커맨드는 `.data`와 `.execute()`를 export해야 함
-   슬래시 명령어 등록은 `deploy-commands.js` 실행 시 반영됨
-   명령어 리로드는 `/reload <command>`로 가능 (별도 명령 구현됨)

---

## ✅ 향후 확장 계획

-   커스텀 에러 핸들러
-   자동 슬래시 재등록
-   유저/서버별 권한 분기 처리
