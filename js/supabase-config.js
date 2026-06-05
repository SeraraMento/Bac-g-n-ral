// ============================================
//  Bac-Général — Supabase Config & Auth
// ============================================
//
//  CONFIGURATION : remplace ces deux valeurs
//  par celles de ton projet Supabase
//  (Supabase Dashboard → Project Settings → API)
//

const SUPABASE_URL = 'https://VOTRE_PROJET.supabase.co';
const SUPABASE_ANON_KEY = 'VOTRE_ANON_KEY';

// Importe depuis CDN dans tes pages HTML :
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
// <script src="../js/supabase-config.js"></script>

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Email admin (défini ici côté client, la vraie sécurité est dans les RLS Supabase) ---
const ADMIN_EMAIL = 'admin@bac-general.fr'; // Change avec ton email

// ============================================
//  AUTH HELPERS
// ============================================

/** Inscrit un nouvel élève */
async function signUp(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role: 'student' }
    }
  });
  return { data, error };
}

/** Connexion */
async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

/** Déconnexion */
async function signOut() {
  await supabase.auth.signOut();
  window.location.href = '/index.html';
}

/** Retourne l'utilisateur courant (ou null) */
async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/** Vérifie si l'utilisateur est admin */
function isAdmin(user) {
  return user?.email === ADMIN_EMAIL;
}

/** Redirige vers login si non connecté */
async function requireAuth(redirectTo = '/pages/login.html') {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = redirectTo;
    return null;
  }
  return user;
}

/** Redirige vers accueil si non admin */
async function requireAdmin() {
  const user = await requireAuth('/pages/login.html');
  if (!user || !isAdmin(user)) {
    window.location.href = '/index.html';
    return null;
  }
  return user;
}

// ============================================
//  PROFIL UTILISATEUR
// ============================================

/** Récupère ou crée le profil dans la table `profiles` */
async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

/** Met à jour le profil */
async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() });
  return { data, error };
}

// ============================================
//  PROGRESSION
// ============================================

/** Marque une fiche comme lue */
async function markFicheRead(userId, ficheId) {
  const { data, error } = await supabase
    .from('progression')
    .upsert({
      user_id: userId,
      fiche_id: ficheId,
      read_at: new Date().toISOString()
    }, { onConflict: 'user_id,fiche_id' });
  return { data, error };
}

/** Récupère la progression d'un élève */
async function getProgression(userId) {
  const { data, error } = await supabase
    .from('progression')
    .select('*, fiches(titre, matiere)')
    .eq('user_id', userId);
  return { data, error };
}

/** Sauvegarde un résultat de QCM */
async function saveQcmResult(userId, qcmId, score, total) {
  const { data, error } = await supabase
    .from('qcm_results')
    .insert({
      user_id: userId,
      qcm_id: qcmId,
      score,
      total,
      completed_at: new Date().toISOString()
    });
  return { data, error };
}
