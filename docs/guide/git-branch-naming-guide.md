---
title: Git 브랜치 네이밍 가이드
created: 2025-06-24
modified: 2025-06-24
author: Siho
---

# 🌿 Git 브랜치 네이밍 가이드

이 문서는 프로젝트 내에서 일관된 Git 브랜치 네이밍 규칙을 정의하고, 각 브랜치 유형별 명명 패턴을 설명합니다.

## 📌 기본 규칙

-   브랜치 이름은 **소문자**, **케밥 케이스(kebab-case)**로 작성  
    예: `feature/login-api`, `fix/user-auth`
-   단어는 **`-`**로 구분
-   **의미 있는 키워드**를 포함할 것
-   이모지는 사용하지 않음

## 📂 브랜치 유형

| 타입        | 용도                      | 예시                        |
| ----------- | ------------------------- | --------------------------- |
| `feature/`  | 새로운 기능 추가          | `feature/user-profile`      |
| `fix/`      | 버그 수정                 | `fix/token-refresh-bug`     |
| `chore/`    | 잡무(빌드, 설정 등)       | `chore/update-deps`         |
| `docs/`     | 문서 작업                 | `docs/add-api-guide`        |
| `test/`     | 테스트 코드 추가/수정     | `test/add-login-tests`      |
| `refactor/` | 리팩토링 (기능 변화 없음) | `refactor/user-service`     |
| `hotfix/`   | 긴급 배포용 수정          | `hotfix/fix-crash-on-start` |

## ✅ 브랜치 생성 예시

```bash
# 새로운 로그인 기능 개발 브랜치
git checkout -b feature/login-endpoint

# ESLint 설정 추가 작업
git checkout -b chore/setup-eslint

# README 업데이트
git checkout -b docs/update-readme
```

## 🛠 기타 권장 사항

-   작업 전 항상 `main` 또는 `develop`에서 브랜치를 생성 (개인 작업은 `main`에서 생성, `develop`사용 안함)
-   이슈 번호가 있다면 이름에 포함해도 좋습니다:  
    예: `feature/123-login-endpoint`

## 💬 브랜치 삭제 시 주의

-   병합된 브랜치는 `git branch -d`로 로컬 삭제
-   원격 삭제는 `git push origin --delete <branch-name>`
