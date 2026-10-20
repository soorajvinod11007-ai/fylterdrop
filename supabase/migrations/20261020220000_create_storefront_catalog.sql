create table if not exists public.storefront_catalog (
  id text primary key check (id = 'main'),
  products jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.storefront_catalog enable row level security;

create or replace function public.set_storefront_catalog_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists storefront_catalog_updated_at on public.storefront_catalog;
create trigger storefront_catalog_updated_at
before update on public.storefront_catalog
for each row execute function public.set_storefront_catalog_updated_at();
