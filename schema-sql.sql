-- =============================================
-- MON ÉCOLE — Schéma Supabase complet
-- Exécutez ce SQL dans le SQL Editor de Supabase
-- =============================================

-- ── TABLE: profiles (extension de auth.users) ──
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    identifiant TEXT UNIQUE NOT NULL,
    nom TEXT,
    prenom TEXT,
    role TEXT NOT NULL CHECK (role IN ('admin','prof','eleve')),
    classe_id UUID,
    disabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── TABLE: classes ──
CREATE TABLE IF NOT EXISTS classes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom TEXT UNIQUE NOT NULL,
    niveau TEXT,
    annee TEXT DEFAULT '2025-2026',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── TABLE: matieres ──
CREATE TABLE IF NOT EXISTS matieres (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom TEXT UNIQUE NOT NULL,
    couleur TEXT DEFAULT '#3498db',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── TABLE: prof_matieres (assignation prof ↔ matières) ──
CREATE TABLE IF NOT EXISTS prof_matieres (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prof_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    matiere_id UUID REFERENCES matieres(id) ON DELETE CASCADE,
    classe_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    UNIQUE(prof_id, matiere_id, classe_id)
);

-- ── TABLE: eleve_classes ──
CREATE TABLE IF NOT EXISTS eleve_classes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    eleve_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    classe_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    UNIQUE(eleve_id, classe_id)
);

-- ── TABLE: devoirs ──
CREATE TABLE IF NOT EXISTS devoirs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prof_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    matiere_id UUID REFERENCES matieres(id) ON DELETE CASCADE,
    titre TEXT NOT NULL,
    description TEXT,
    date_limite TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── TABLE: devoir_fichiers ──
CREATE TABLE IF NOT EXISTS devoir_fichiers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    devoir_id UUID REFERENCES devoirs(id) ON DELETE CASCADE,
    nom_fichier TEXT NOT NULL,
    url TEXT NOT NULL,
    taille BIGINT,
    type_mime TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── TABLE: qcm ──
CREATE TABLE IF NOT EXISTS qcm (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prof_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    matiere_id UUID REFERENCES matieres(id) ON DELETE CASCADE,
    titre TEXT NOT NULL,
    description TEXT,
    duree_minutes INT DEFAULT 30,
    seuil_reussite INT DEFAULT 50,
    unique_attempt BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── TABLE: qcm_questions ──
CREATE TABLE IF NOT EXISTS qcm_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    qcm_id UUID REFERENCES qcm(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    choix JSONB NOT NULL,
    bonne_reponse INT NOT NULL,
    points INT DEFAULT 1,
    ordre INT DEFAULT 0
);

-- ── TABLE: qcm_resultats ──
CREATE TABLE IF NOT EXISTS qcm_resultats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    qcm_id UUID REFERENCES qcm(id) ON DELETE CASCADE,
    eleve_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    score INT,
    score_max INT,
    pourcentage INT,
    temps_secondes INT,
    reponses JSONB,
    note_sur_20 DECIMAL(4,1),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(qcm_id, eleve_id)
);

-- ── TABLE: notes ──
CREATE TABLE IF NOT EXISTS notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prof_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    matiere_id UUID REFERENCES matieres(id) ON DELETE CASCADE,
    eleve_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    titre TEXT NOT NULL,
    valeur DECIMAL(4,2),
    bareme DECIMAL(4,2) DEFAULT 20,
    remarque TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── TABLE: agenda ──
CREATE TABLE IF NOT EXISTS agenda (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prof_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    titre TEXT NOT NULL,
    description TEXT,
    date_event TIMESTAMPTZ NOT NULL,
    type TEXT DEFAULT 'evenement',
    couleur TEXT DEFAULT '#3498db',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── TABLE: messages ──
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prof_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    destinataire_type TEXT NOT NULL CHECK (destinataire_type IN ('classe','eleve')),
    classe_id UUID REFERENCES classes(id),
    eleve_id UUID REFERENCES profiles(id),
    objet TEXT,
    contenu TEXT NOT NULL,
    lu BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── TABLE: messages_lu ──
CREATE TABLE IF NOT EXISTS messages_lu (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    eleve_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    lu_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(message_id, eleve_id)
);

-- ============================================================
-- INDEX
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_classe ON profiles(classe_id);
CREATE INDEX IF NOT EXISTS idx_devoirs_matiere ON devoirs(matiere_id);
CREATE INDEX IF NOT EXISTS idx_devoirs_date ON devoirs(date_limite);
CREATE INDEX IF NOT EXISTS idx_qcm_prof ON qcm(prof_id);
CREATE INDEX IF NOT EXISTS idx_qcm_questions_qcm ON qcm_questions(qcm_id);
CREATE INDEX IF NOT EXISTS idx_qcm_resultats_eleve ON qcm_resultats(eleve_id);
CREATE INDEX IF NOT EXISTS idx_notes_eleve ON notes(eleve_id);
CREATE INDEX IF NOT EXISTS idx_notes_matiere ON notes(matiere_id);
CREATE INDEX IF NOT EXISTS idx_messages_eleve ON messages(eleve_id);
CREATE INDEX IF NOT EXISTS idx_agenda_date ON agenda(date_event);
CREATE INDEX IF NOT EXISTS idx_prof_matieres_prof ON prof_matieres(prof_id);
CREATE INDEX IF NOT EXISTS idx_eleve_classes_eleve ON eleve_classes(eleve_id);

-- ============================================================
-- STORAGE (bucket pour les fichiers)
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('devoirs_fichiers', 'devoirs_fichiers', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY IF NOT EXISTS "public_read_devoirs"
ON storage.objects FOR SELECT USING (bucket_id = 'devoirs_fichiers');

CREATE POLICY IF NOT EXISTS "public_upload_devoirs"
ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'devoirs_fichiers' AND auth.role() = 'authenticated'
);

-- ============================================================
-- TRIGGER auto-disable pour accounts désactivés
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_disabled_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    IF NEW.disabled = TRUE THEN
        -- Optionnel: révoquer la session active
        -- UPDATE auth.sessions SET not_after = NOW() WHERE instance_id = '00000000-0000-0000-0000-000000000000' AND aud = NEW.id;
        RETURN NEW;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profiles_disabled ON profiles;
CREATE TRIGGER on_profiles_disabled
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_disabled_user();

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matieres ENABLE ROW LEVEL SECURITY;
ALTER TABLE prof_matieres ENABLE ROW LEVEL SECURITY;
ALTER TABLE eleve_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE devoirs ENABLE ROW LEVEL SECURITY;
ALTER TABLE devoir_fichiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE qcm ENABLE ROW LEVEL SECURITY;
ALTER TABLE qcm_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE qcm_resultats ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE agenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages_lu ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles_all_auth" ON profiles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "profiles_select_self" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_self" ON profiles FOR UPDATE USING (auth.uid() = id);

-- classes
CREATE POLICY "classes_select_all" ON classes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "classes_insert_admin" ON classes FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- matieres
CREATE POLICY "matieres_all_auth" ON matieres FOR ALL USING (auth.role() = 'authenticated');

-- prof_matieres
CREATE POLICY "prof_matieres_all_auth" ON prof_matieres FOR ALL USING (auth.role() = 'authenticated');

-- eleve_classes
CREATE POLICY "eleve_classes_all_auth" ON eleve_classes FOR ALL USING (auth.role() = 'authenticated');

-- devoirs
CREATE POLICY "devoirs_select_prof" ON devoirs FOR SELECT USING (
    auth.uid() = prof_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'eleve')
);
CREATE POLICY "devoirs_insert_prof" ON devoirs FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('prof','admin'))
);
CREATE POLICY "devoirs_update_prof" ON devoirs FOR UPDATE USING (auth.uid() = prof_id);
CREATE POLICY "devoirs_delete_prof" ON devoirs FOR DELETE USING (auth.uid() = prof_id);

-- devoir_fichiers
CREATE POLICY "devoirs_fichiers_all" ON devoir_fichiers FOR ALL USING (auth.role() = 'authenticated');

-- qcm
CREATE POLICY "qcm_select_prof" ON qcm FOR SELECT USING (auth.uid() = prof_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'eleve'));
CREATE POLICY "qcm_insert_prof" ON qcm FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('prof','admin')));
CREATE POLICY "qcm_update_prof" ON qcm FOR UPDATE USING (auth.uid() = prof_id);
CREATE POLICY "qcm_delete_prof" ON qcm FOR DELETE USING (auth.uid() = prof_id);

-- qcm_questions
CREATE POLICY "qcm_questions_all" ON qcm_questions FOR ALL USING (auth.role() = 'authenticated');

-- qcm_resultats
CREATE POLICY "qcm_resultats_prof" ON qcm_resultats FOR SELECT USING (
    auth.uid() = prof_id OR auth.uid() = eleve_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "qcm_resultats_insert_eleve" ON qcm_resultats FOR INSERT WITH CHECK (auth.uid() = eleve_id);

-- notes
CREATE POLICY "notes_select" ON notes FOR SELECT USING (
    auth.uid() = prof_id OR auth.uid() = eleve_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "notes_insert_prof" ON notes FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('prof','admin'))
);
CREATE POLICY "notes_update_prof" ON notes FOR UPDATE USING (auth.uid() = prof_id);
CREATE POLICY "notes_delete_prof" ON notes FOR DELETE USING (auth.uid() = prof_id);

-- agenda
CREATE POLICY "agenda_select_all" ON agenda FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "agenda_insert_prof" ON agenda FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('prof','admin'))
);
CREATE POLICY "agenda_update_prof" ON agenda FOR UPDATE USING (auth.uid() = prof_id);
CREATE POLICY "agenda_delete_prof" ON agenda FOR DELETE USING (auth.uid() = prof_id);

-- messages
CREATE POLICY "messages_select" ON messages FOR SELECT USING (
    auth.uid() = prof_id OR auth.uid() = eleve_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "messages_insert_prof" ON messages FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('prof','admin'))
);
CREATE POLICY "messages_update_eleve" ON messages FOR UPDATE USING (auth.uid() = prof_id);

-- messages_lu
CREATE POLICY "messages_lu_all" ON messages_lu FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- Seed données initiales (optionnel)
-- ============================================================
-- IMPORTANT : Créez d'abord le premier compte admin manuellement
-- depuis l'interface Supabase > Authentication > Add User
-- email: admin@monecole.local  /  mot de passe: votrechoix
-- Puis liez-le à la table profiles.
