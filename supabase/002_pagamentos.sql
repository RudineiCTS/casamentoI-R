-- =====================================================================
-- Pagamentos dos presentes (Stripe)
-- Rode no SQL Editor DEPOIS do schema.sql. Pode rodar de novo sem problema.
-- =====================================================================

-- Cada pagamento confirmado pelo Stripe vira uma contribuição.
create table if not exists public.gift_contributions (
  id                 uuid primary key default gen_random_uuid(),
  gift_id            uuid references public.gifts (id) on delete set null,
  gift_title         text not null,
  quantity           integer not null default 1 check (quantity > 0),
  amount_cents       integer not null check (amount_cents >= 0),
  guest_name         text,
  guest_email        text,
  message            text,
  payment_method     text,
  stripe_session_id  text not null unique,
  created_at         timestamptz not null default now()
);

create index if not exists gift_contributions_gift_idx on public.gift_contributions (gift_id);
alter table public.gift_contributions enable row level security;

-- Registra um pagamento de forma atômica e idempotente:
--  - se a sessão do Stripe já foi registrada, não faz nada (o webhook pode chegar repetido);
--  - presente com cotas: soma as cotas recebidas (sem passar do total);
--  - presente sem cotas: marca como "recebido".
-- Retorna true se registrou agora, false se já existia.
create or replace function public.register_gift_payment(
  p_session_id   text,
  p_gift_id      uuid,
  p_quantity     integer,
  p_amount_cents integer,
  p_guest_name   text,
  p_guest_email  text,
  p_message      text,
  p_method       text
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_title text;
  v_inserted integer;
begin
  select title into v_title from gifts where id = p_gift_id for update;

  insert into gift_contributions
    (gift_id, gift_title, quantity, amount_cents, guest_name, guest_email, message, payment_method, stripe_session_id)
  values
    (case when v_title is null then null else p_gift_id end, coalesce(v_title, '(presente removido)'),
     greatest(p_quantity, 1), p_amount_cents, p_guest_name, p_guest_email, p_message, p_method, p_session_id)
  on conflict (stripe_session_id) do nothing;

  get diagnostics v_inserted = row_count;
  if v_inserted = 0 or v_title is null then
    return v_inserted > 0;
  end if;

  update gifts
     set quota_given = case when quota_total is null then quota_given
                            else least(quota_total, quota_given + greatest(p_quantity, 1)) end,
         status      = case when quota_total is null then 'recebido' else status end,
         updated_at  = now()
   where id = p_gift_id;

  return true;
end;
$$;

-- Só o servidor (secret key / service_role) pode chamar a função.
revoke all on function public.register_gift_payment(text, uuid, integer, integer, text, text, text, text) from public, anon, authenticated;
grant execute on function public.register_gift_payment(text, uuid, integer, integer, text, text, text, text) to service_role;
