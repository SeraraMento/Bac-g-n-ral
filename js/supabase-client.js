// =============================================
// SUPABASE CLIENT CONFIGURATION
// =============================================

// Configuration (REMPLACE PAR TES VRAIES CLÉS!)
const SUPABASE_URL = 'https://ton-project.supabase.co';
const SUPABASE_ANON_KEY = 'ta-cle-anonyme-ici';

// Crée le client Supabase
let supabaseClient = null;

async function initSupabase() {
    if (supabaseClient) return supabaseClient;
    
    if (!window.supabase) {
        console.error('❌ Supabase JS non chargé!');
        return null;
    }
    
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return supabaseClient;
}

// Initialise Supabase
const supabase = await initSupabase();

console.log('✅ Supabase initialisé');