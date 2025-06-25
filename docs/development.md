# 🔧 개발 가이드

이 문서는 디버깅, 리로드, 테스트 방법 등 개발 중 유용한 팁을 정리한 문서입니다.

---

## 🧪 빠른 테스트 방법

### 슬래시 명령어 등록
```bash
node deploy-commands.js
```

### 명령어 리로드 (봇 실행 중)
```
/reload test
```

---

## 🧰 개발 편의 기능

- `/reload` 명령어로 실행 중 명령어 핫리로드
- 명령어 폴더 구조는 `commands/`에 모듈별 분리
- `CommandContext`를 통해 인터랙션/메시지 공통 처리

---

## 🐛 디버깅 팁

- `console.log(context.options.data)` → 전달된 옵션 구조 확인
- 오류 발생 시 Discord API 응답 메시지를 확인 (특히 `50035` 코드)

---

## 📦 개발에 자주 쓰는 명령어 예시

```js
/test group1 sub1 option:hello
/user ban user:@someone reason:"스팸"
```
