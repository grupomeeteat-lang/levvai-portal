create table if not exists movimentacoes_estoque (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  produto_id uuid not null references produtos(id) on delete cascade,
  tipo text not null check (tipo in ('ENTRADA', 'SAIDA')),
  quantidade integer not null check (quantidade > 0),
  saldo_apos integer not null,
  obs text,
  responsavel text
);

alter table movimentacoes_estoque enable row level security;
create policy "allow all" on movimentacoes_estoque for all using (true) with check (true);

create index if not exists movimentacoes_estoque_produto_idx on movimentacoes_estoque(produto_id, created_at desc);
