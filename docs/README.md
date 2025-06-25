# 🤖 Discord Bot 프로젝트

이 프로젝트는 커스텀 슬래시 명령어와 핸들링 시스템이 내장된 Discord 봇입니다.

---

## 🚀 사용법

### 1. 설치
```bash
npm install
```

### 2. 슬래시 명령어 등록
```bash
node deploy-commands.js
```

### 3. 봇 실행
```bash
node index.js
```

---

## 📦 주요 기능

- 슬래시 명령어 그룹 & 서브커맨드 지원
- interaction과 message 통합 응답 핸들러 (`CommandContext`)
- 커맨드 리로드 시스템 내장 (`/reload`)
- 옵션 처리 유틸리티 포함

---

## 🧱 디렉토리 개요

- `commands/` - 명령어 모듈
- `events/` - Discord 이벤트
- `core/` - 커맨드 핸들러 및 컨텍스트
- `deploy-commands.js` - 슬래시 명령어 등록기

---

## 🙋 도움말

- 명령어 예시: `/test group1 sub1 option:hello`
- 개발용 서버에서 GUILD 등록을 우선 사용
- 슬래시 명령어 관련 에러는 대부분 Discord API 응답을 참고
