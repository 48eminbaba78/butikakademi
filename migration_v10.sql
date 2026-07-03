-- migration_v10.sql
-- Öğrenci başına kaynak (kitap/soru bankası) takip tablosu

create table if not exists student_books (
  id              uuid primary key default gen_random_uuid(),
  student_id      uuid references users(id) on delete cascade,
  coach_id        uuid references users(id) on delete cascade,
  name            text not null,
  total_tests     int  not null default 0,
  completed_tests int  not null default 0,
  created_at      timestamptz default now()
);

alter table student_books enable row level security;
alter table student_books force row level security;

drop policy if exists "sb_select" on student_books;
drop policy if exists "sb_insert" on student_books;
drop policy if exists "sb_update" on student_books;
drop policy if exists "sb_delete" on student_books;

create policy "sb_select" on student_books for select
  using (
    auth.uid() = coach_id
    or auth.uid() = student_id
    or exists (select 1 from users where id = auth.uid() and role = 'developer')
  );

create policy "sb_insert" on student_books for insert
  with check (
    auth.uid() = coach_id
    or exists (select 1 from users where id = auth.uid() and role = 'developer')
  );

create policy "sb_update" on student_books for update
  using (
    auth.uid() = coach_id
    or exists (select 1 from users where id = auth.uid() and role = 'developer')
  );

create policy "sb_delete" on student_books for delete
  using (
    auth.uid() = coach_id
    or exists (select 1 from users where id = auth.uid() and role = 'developer')
  );
