# 이기심 · 리더스클럽 6기 (9월 발제문 웹앱)

참가자가 URL로 열어 6개 질문에 서술형으로 답하는 웹 폼. 답변은 Supabase 저장, 진행자는 비밀번호로 대시보드 열람.

- 참가자 페이지: `/` (index.html) — 로그인 없음, 이름/닉네임만 입력
- 진행자 대시보드: `/dashboard.html` — 4자리+ 비밀번호
- 백엔드: Supabase (Postgres) / 배포: Vercel

---

## 폴더 구조
```
index.html          참가자 폼
dashboard.html      진행자 대시보드
config.js           공개 설정(SUPABASE_URL, anon key, ROUND)  ← anon 키는 공개용이라 OK
api/responses.js    Vercel 서버함수(대시보드 조회 전용, service_role 사용)
assets/style.css    테마(진한 와인/흰 세리프/진녹색 포인트)
assets/app.js       참가자 로직
assets/dashboard.js 대시보드 로직
assets/materials/   자료(📎) 이미지 자리 → q1.jpg ~ q5.jpg (진행자가 직접 넣기)
supabase_setup.sql  테이블 + RLS
```

---

## 셋업 (순서대로)

### 1. Supabase 프로젝트 만들기
1. supabase.com 에서 **새 프로젝트** 생성.
2. 좌측 **SQL Editor** → `supabase_setup.sql` 내용 통째로 붙여넣고 **RUN**.
3. **Project Settings → API** 에서 아래 3개 복사:
   - `Project URL`
   - `anon public` 키
   - `service_role` 키  ← **비밀. 절대 프론트/깃허브에 올리지 말 것**

### 2. config.js 채우기
```js
window.RC_CONFIG = {
  SUPABASE_URL: "https://xxxx.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGci...(anon)",
  ROUND: "2026-09"
};
```
> config.js에는 **anon 키만**. service_role 키는 여기 넣지 않는다.

### 3. Vercel 배포
1. 이 폴더를 GitHub 저장소에 올리고 Vercel에서 **Import** (또는 `vercel` CLI).
2. Vercel **Settings → Environment Variables** 에 3개 등록:
   | 이름 | 값 |
   |---|---|
   | `SUPABASE_URL` | Project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | service_role 키 |
   | `DASHBOARD_PASSWORD` | 대시보드 비밀번호(원하는 숫자, 예: `2026`) |
3. 배포. 별도 빌드 설정 없이 정적 파일 + `/api` 자동 인식.

### 4. 자료(📎) 이미지 넣기
- `assets/materials/` 에 `q1.jpg`~`q5.jpg` 로 저장(진행자가 직접 촬영/업로드).
- 없으면 그 자리에 "자료 이미지가 아직 없습니다" 안내만 뜨고 앱은 정상 동작.
- Q6은 자료 없음(확산 질문).

### 5. 공유
- 참가자에게: 배포주소 (예: `https://xxx.vercel.app/`)
- 진행자만: `https://xxx.vercel.app/dashboard.html` + 비밀번호

---

## 동작 규칙
- **한 화면 한 질문**, 뒤로/앞으로 상시 이동.
- 각 질문에 **답을 쓴 뒤 '다음'** 을 누르면 자료가 그 자리에 자동 노출 → 다시 '다음' 으로 이동.
- 작성 중 답은 **참가자 기기에 자동 저장**(localStorage). URL 다시 열면 이어서 수정 가능.
- **제출할 때마다 새 행**이 쌓이고, 대시보드는 **이름별 가장 최근 제출**만 최종으로 표시. → "마지막 제출이 최종".

## 보안 메모 (솔직하게)
- anon 키는 공개돼도 되지만, RLS로 **INSERT만** 허용돼 있어 남의 답을 읽거나 지울 수 없음.
- 대시보드 조회는 오직 `/api/responses` (service_role, 서버 전용) + 비밀번호로만 가능.
- **4자리 비밀번호는 이론상 무차별 대입에 약함**(1만 가지). 6명 모임 + 조용한 URL이면 실무상 충분하지만, 더 안전하게 가려면 `DASHBOARD_PASSWORD`를 6자리 이상으로.
- 이름이 같은 참가자가 둘이면 최신 것만 남으니, 닉네임 겹치지 않게 안내.
