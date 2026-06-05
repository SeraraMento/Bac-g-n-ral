// ============================================
// Bac-Général — Supabase Config & Auth
// ============================================

const SUPABASE_URL = 'https://mogfxolarfoaltmqornq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_OCngSeY6-r_A2hKCCQmoQw_6CSZP893';

// Création du client Supabase
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const ADMIN_EMAIL = 'admin@bac-general.fr';

// ============================================
// AUTH
// ============================================

async function signUp(email, password, fullName) {
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: 'student'
      }
    }
  });

  return { data, error };
}

async function signIn(email, password) {
  const { data, error } =
    await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

  return { data, error };
}

async function signOut() {
  await supabaseClient.auth.signOut();
  window.location.href = '../index.html';
}

async function getCurrentUser() {
  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  return user;
}

function isAdmin(user) {
  return user?.email === ADMIN_EMAIL;
}

async function requireAuth(
  redirectTo = '../pages/login.html'
) {
  const user = await getCurrentUser();

  if (!user) {
    window.location.href = redirectTo;
    return null;
  }

  return user;
}

async function requireAdmin() {
  const user = await requireAuth(
    '../pages/login.html'
  );

  if (!user || !isAdmin(user)) {
    window.location.href = '../index.html';
    return null;
  }

  return user;
}

// ============================================
// PROFIL
// ============================================

async function getProfile(userId) {
  return await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
}

async function updateProfile(userId, updates) {
  return await supabaseClient
    .from('profiles')
    .upsert({
      id: userId,
      ...updates,
      updated_at: new Date().toISOString()
    });
}

// ============================================
// PROGRESSION
// ============================================

async function markFicheRead(userId, ficheId) {
  return await supabaseClient
    .from('progression')
    .upsert(
      {
        user_id: userId,
        fiche_id: ficheId,
        read_at: new Date().toISOString()
      },
      {
        onConflict: 'user_id,fiche_id'
      }
    );
}

async function getProgression(userId) {
  return await supabaseClient
    .from('progression')
    .select('*, fiches(titre,matiere)')
    .eq('user_id', userId);
}

async function saveQcmResult(
  userId,
  qcmId,
  score,
  total
) {
  return await supabaseClient
    .from('qcm_results')
    .insert({
      user_id: userId,
      qcm_id: qcmId,
      score,
      total,
      completed_at: new Date().toISOString()
    });
}