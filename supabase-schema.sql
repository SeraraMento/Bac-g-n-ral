-- ============================================
--  BAC-GÉNÉRAL — Schéma Supabase (SQL)
--  À exécuter dans : Supabase → SQL Editor
-- ============================================

-- 1. TABLE PROFILES (extension de auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  role text default 'student',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Créer un profil automatiquement à chaque inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. TABLE FICHES
create table if not exists public.fiches (
  id uuid default gen_random_uuid() primary key,
  titre text not null,
  matiere text not null,
  contenu text,
  tags text[],
  publiee boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);


-- 3. TABLE QCM
create table if not exists public.qcm (
  id uuid default gen_random_uuid() primary key,
  titre text not null,
  matiere text not null,
  questions jsonb not null default '[]',
  -- Format questions : [{ question, options: [], correct_index, explication }]
  publie boolean default true,
  created_at timestamptz default now()
);


-- 4. TABLE ANNALES
create table if not exists public.annales (
  id uuid default gen_random_uuid() primary key,
  titre text not null,
  matiere text not null,
  annee int,
  type_epreuve text,       -- ex: "Métropole", "Antilles-Guyane"
  sujet_url text,          -- lien PDF sujet
  correction_url text,     -- lien PDF correction
  publiee boolean default true,
  created_at timestamptz default now()
);


-- 5. TABLE RESSOURCES
create table if not exists public.ressources (
  id uuid default gen_random_uuid() primary key,
  titre text not null,
  matiere text not null,
  type text,               -- "video", "article", "site"
  url text not null,
  description text,
  publiee boolean default true,
  created_at timestamptz default now()
);


-- 6. TABLE PROGRESSION (fiches lues par élève)
create table if not exists public.progression (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  fiche_id uuid references public.fiches on delete cascade not null,
  read_at timestamptz default now(),
  unique(user_id, fiche_id)
);


-- 7. TABLE QCM RESULTS
create table if not exists public.qcm_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  qcm_id uuid references public.qcm on delete cascade not null,
  score int not null,
  total int not null,
  completed_at timestamptz default now()
);


-- ============================================
--  ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activer RLS sur toutes les tables
alter table public.profiles enable row level security;
alter table public.fiches enable row level security;
alter table public.qcm enable row level security;
alter table public.annales enable row level security;
alter table public.ressources enable row level security;
alter table public.progression enable row level security;
alter table public.qcm_results enable row level security;

-- PROFILES : chaque user voit son propre profil
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- FICHES, QCM, ANNALES, RESSOURCES : tout le monde peut lire les contenus publiés
create policy "Public read fiches"
  on public.fiches for select using (publiee = true);
create policy "Public read qcm"
  on public.qcm for select using (publie = true);
create policy "Public read annales"
  on public.annales for select using (publiee = true);
create policy "Public read ressources"
  on public.ressources for select using (publiee = true);

-- PROGRESSION : chaque élève gère sa propre progression
create policy "Users manage own progression"
  on public.progression for all using (auth.uid() = user_id);

-- QCM RESULTS : chaque élève gère ses propres résultats
create policy "Users manage own qcm results"
  on public.qcm_results for all using (auth.uid() = user_id);

-- ADMIN : accès complet (à faire via Supabase Dashboard → service_role key côté backend)
-- Pour les politiques admin, utilise une fonction qui vérifie l'email :
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'admin'
  );
$$ language sql security definer;

-- Admin peut tout faire sur les contenus
create policy "Admin full access fiches"
  on public.fiches for all using (public.is_admin());
create policy "Admin full access qcm"
  on public.qcm for all using (public.is_admin());
create policy "Admin full access annales"
  on public.annales for all using (public.is_admin());
create policy "Admin full access ressources"
  on public.ressources for all using (public.is_admin());
create policy "Admin read all profiles"
  on public.profiles for select using (public.is_admin());


-- ============================================
--  POUR PASSER UN UTILISATEUR EN ADMIN :
--  UPDATE public.profiles SET role = 'admin'
--  WHERE email = 'ton@email.fr';
-- ============================================
