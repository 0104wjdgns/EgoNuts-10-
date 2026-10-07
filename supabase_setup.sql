-- ============================================================
-- 에고너츠 '이기심' 발제문 — Supabase 초기 설정
-- Supabase 대시보드 > SQL Editor 에 통째로 붙여넣고 RUN.
-- ============================================================

create table if not exists public.responses (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  round           text not null default 'egonuts-2026-10',
  participant_name text not null,
  q1   text,
  q2   text,
  q3   text,
  q4   text,
  q5_1 text,   -- Q5 ① 관찰
  q5_2 text,   -- Q5 ② 판단
  q6   text
);

-- RLS 켜기
alter table public.responses enable row level security;

-- 참가자(anon 키): INSERT만 허용. SELECT/UPDATE/DELETE 정책은 두지 않음.
--   -> 공개된 anon 키로는 남의 답을 읽거나 지울 수 없음.
drop policy if exists "anon can insert responses" on public.responses;
create policy "anon can insert responses"
  on public.responses
  for insert
  to anon
  with check (true);

-- 열람(대시보드)은 service_role 키를 쓰는 서버 함수(/api/responses)로만.
-- service_role 은 RLS 를 우회하므로 별도 select 정책이 필요 없음.
-- service_role 키는 절대 프론트엔드에 두지 말 것 (Vercel 환경변수에만).
