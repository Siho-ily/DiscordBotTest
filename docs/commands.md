# 📘 명령어 문서 (Commands)

이 문서는 봇에서 지원하는 슬래시 명령어 및 서브커맨드 구조를 설명합니다.

---

## 📋 명령어 예시

### `/user`
- `/user info` → 유저 정보 표시
- `/user ban reason:<string>` → 유저 밴

### `/test`
- `/test subcommand` → 기본 테스트 커맨드
- `/test group1 sub1` → 그룹 내부 서브커맨드 예시

---

## 🔧 공통 옵션 설명

| 이름 | 타입 | 설명 |
|------|------|------|
| `user` | USER | 대상 유저 |
| `reason` | STRING | 사유 |
| `option` | STRING | 테스트용 옵션 값 |

---

## ✅ 구현 시 참고

- 모든 명령은 `.data` (builder 구조)와 `.execute(context)`를 export해야 합니다.
- CommandContext를 통해 옵션은 `context.options.getXxx()` 방식으로 가져옵니다.
