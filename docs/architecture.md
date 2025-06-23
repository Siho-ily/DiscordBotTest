---
title: Project Architecture
created: 2025-06-24
modified: 2025-06-24
author: Siho
---

# Project Architecture

이 문서는 프로젝트의 전반적인 구조와 각 디렉토리의 역할에 대해 설명합니다.
해당 문서는 예시용으로 이후에

## 📂 디렉토리 구조

project-root/
├── src/ # 주요 소스 코드
│ ├── commands/ # 명령어 핸들러 (Discord 봇용)
│ ├── events/ # 이벤트 리스너 (on message, interaction 등)
│ ├── config/ # 설정 파일 (env, constants 등)
│ ├── utils/ # 유틸 함수들
│ └── index.ts|js # 진입점
├── docs/ # 문서 파일 모음
├── .prettierrc # 코드 포매터 설정
├── .eslintrc # 린트 설정
├── .gitignore
├── README.md
└── package.json

## ⚙️ 기술 스택

-   **언어**: Node.js (JavaScript)
-   **Discord 라이브러리**: discord.js
-   **개발 도구**:
    -   ESLint / Prettier
    -   Dotenv (.env)
    -   Git / GitHub

## 📡 봇 구조 흐름 ( `src/...` 생략)

1. `index.js` → 봇 클라이언트 생성
2. `Commands/` → 각 슬래시 명령 처리
3. `Events/` → ready, interactionCreate 등 이벤트 등록
4. `Handlers` → 핸들러 처리
5. `Config/` → 토큰, 설정 값 관리
6. `Utils/` → 반복되는 기능 분리

## ✅ 규칙 및 권장 사항

-   모든 파일은 ES 모듈 기준으로 작성
-   유틸 함수는 가능한 pure function으로 설계
-   커맨드는 기능별로 분리해서 관리
-   보안 환경 변수는 `Config/.env`에 저장
-   일반 환경 변수는 `Config/config.json`에 저장

## 🗂 문서 연관

-   [`git-branch-naming-guide.md`](./guide/git-branch-naming-guide.md): 깃 브랜치 네이밍 가이드
-   [`git-commit-massage-guide.md](./guide/git-commit-massage-guide.md): 깃 커밋 메세지 가이드
-   [`markdown-guide.md`](./guide/markdown-guide.md): 마크다운 문법 가이드
