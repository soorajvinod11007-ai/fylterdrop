create table if not exists public.admin_login_rate_limits (
  ip_hash text primary key check (ip_hash ~ '^[a-f0-9]{64}$'),
  window_started_at timestamptz not null default now(),
  attempts integer not null default 0 check (attempts >= 0),
  locked_until timestamptz
);

alter table public.admin_login_rate_limits enable row level security;

create or replace function public.check_admin_login_attempt(p_ip_hash text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  login_attempt public.admin_login_rate_limits%rowtype;
begin
  if p_ip_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'Invalid login address hash';
  end if;

  insert into public.admin_login_rate_limits (ip_hash)
  values (p_ip_hash)
  on conflict (ip_hash) do nothing;

  select *
  into login_attempt
  from public.admin_login_rate_limits
  where ip_hash = p_ip_hash
  for update;

  if login_attempt.locked_until > now() then
    return false;
  end if;

  if login_attempt.window_started_at <= now() - interval '15 minutes' then
    update public.admin_login_rate_limits
    set window_started_at = now(), attempts = 1, locked_until = null
    where ip_hash = p_ip_hash;
    return true;
  end if;

  if login_attempt.attempts >= 5 then
    update public.admin_login_rate_limits
    set locked_until = now() + interval '15 minutes'
    where ip_hash = p_ip_hash;
    return false;
  end if;

  update public.admin_login_rate_limits
  set attempts = attempts + 1
  where ip_hash = p_ip_hash;
  return true;
end;
$$;

create or replace function public.clear_admin_login_attempts(p_ip_hash text)
returns void
language sql
security definer
set search_path = ''
as $$
  delete from public.admin_login_rate_limits
  where ip_hash = p_ip_hash;
$$;

revoke all on function public.check_admin_login_attempt(text) from public, anon, authenticated;
revoke all on function public.clear_admin_login_attempts(text) from public, anon, authenticated;
grant execute on function public.check_admin_login_attempt(text) to service_role;
grant execute on function public.clear_admin_login_attempts(text) to service_role;
