alter table public.storefront_catalog enable row level security;
alter table public.admin_login_rate_limits enable row level security;

revoke all privileges on table
  public.storefront_catalog,
  public.admin_login_rate_limits
from public, anon, authenticated, service_role;

grant select, insert, update, delete on table
  public.storefront_catalog
to service_role;

revoke all privileges on function public.check_admin_login_attempt(text)
from public, anon, authenticated;
revoke all privileges on function public.clear_admin_login_attempts(text)
from public, anon, authenticated;

grant execute on function public.check_admin_login_attempt(text) to service_role;
grant execute on function public.clear_admin_login_attempts(text) to service_role;
