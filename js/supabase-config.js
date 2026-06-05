// ============================================
// SUPABASE
// ============================================

const SUPABASE_URL =
'https://mogfxolarfoaltmqornq.supabase.co';

const SUPABASE_ANON_KEY =
'sb_publishable_OCngSeY6-r_A2hKCCQmoQw_6CSZP893';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

window.supabaseClient = supabaseClient;

// ============================================
// AUTH
// ============================================

async function signUp(email, password, fullName) {
  return await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  });
}

async function signIn(email, password) {
  return await supabaseClient.auth.signInWithPassword({
    email,
    password
  });
}

async function signOut() {
  await supabaseClient.auth.signOut();
  window.location.href = "../../index.html";
}

async function getCurrentUser() {
  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  return user;
}

async function getCurrentProfile() {

  const user = await getCurrentUser();

  if (!user) return null;

  const { data } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return data;
}

async function isAdmin() {

  const profile = await getCurrentProfile();

  if (!profile) return false;

  return profile.role === 'admin';
}

async function requireAuth() {

  const user = await getCurrentUser();

  if (!user) {

    window.location.href =
      '../../pages/login.html';

    return null;
  }

  return user;
}

async function requireAdmin() {

  const user = await requireAuth();

  if (!user) return null;

  const admin = await isAdmin();

  if (!admin) {

    window.location.href =
      '../../index.html';

    return null;
  }

  return user;
}

// ============================================
// PROFILE
// ============================================

async function getProfile(userId) {

  return await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
}

async function updateProfile(
  userId,
  updates
) {

  return await supabaseClient
    .from('profiles')
    .update(updates)
    .eq('id', userId);
}

// ============================================
// PROGRESSION
// ============================================

async function markFicheRead(
  userId,
  ficheId
) {

  return await supabaseClient
    .from('progression')
    .upsert({
      user_id: userId,
      fiche_id: ficheId,
      read_at: new Date().toISOString()
    });
}

async function getProgression(
  userId
) {

  return await supabaseClient
    .from('progression')
    .select('*')
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