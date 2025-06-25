# 📡 이벤트 흐름 설명 (events)

봇에서 사용하는 주요 Discord 이벤트 흐름입니다.

---

## ✅ `ready`

- 봇이 정상적으로 로그인되었을 때 발생
- 명령어 등록 결과나 부팅 로그 출력

## ✅ `interactionCreate`

- 슬래시 명령어, 버튼, 셀렉트 메뉴 등의 인터랙션 발생 시
- 처리 흐름:
  1. interaction이 명령어일 경우
  2. commandHandler를 통해 명령어 라우팅
  3. 해당 명령어의 `.execute(context)` 실행

## ✅ `messageCreate` (선택적)

- 접두사 명령어 사용 시 트리거
- 프리픽스 명령어 지원 시에만 사용
