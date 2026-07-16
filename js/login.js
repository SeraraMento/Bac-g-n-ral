// =============================================
// SUPABASE INIT
// =============================================
const SUPABASE_URL = 'https://vmdgeyownoctshmamljy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_44jDjXt4IBWFF_QmTPOviw_Owdd1kUl';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =============================================
// LOGIN HANDLER
// =============================================
document.addEventListener('DOMContentLoaded', async () => {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleLogin(e) {
    e.preventDefault();
    
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = '';
    
    const identifiant = document.getElementById('identifiant')?.value || '';
    const password = document.getElementById('password')?.value || '';
    
    if (!identifiant || !password) {
        errorDiv.textContent = '❌ Veuillez remplir tous les champs';
        return;
    }
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: identifiant + '@monecole.fr',
            password: password
        });
        
        if (error) {
            errorDiv.textContent = '❌ ' + error.message;
            return;
        }
        
        console.log('✅ Connecté !', data);
        window.location.href = 'dashboard.html';
        
    } catch (err) {
        console.error(err);
        errorDiv.textContent = '❌ Erreur : ' + err.message;
    }
}

// =============================================
// REGISTER HANDLER
// =============================================
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
}

async function handleRegister(e) {
    e.preventDefault();
    
    const errorDiv = document.getElementById('register-error') || document.getElementById('error');
    errorDiv.textContent = '';
    
    const email = document.getElementById('reg-email')?.value || '';
    const password = document.getElementById('reg-password')?.value || '';
    const name = document.getElementById('reg-name')?.value || '';
    const role = document.getElementById('reg-role')?.value || 'eleve';
    
    if (!email || !password || !name) {
        errorDiv.textContent = '❌ Veuillez remplir tous les champs';
        return;
    }
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name,
                    role: role
                }
            }
        });
        
        if (error) {
            errorDiv.textContent = '❌ ' + error.message;
            return;
        }
        
        console.log('✅ Inscription réussie !', data);
        errorDiv.className = 'alert alert-success';
        errorDiv.textContent = '✅ Inscription réussie ! Vérifiez votre email.';
        
        registerForm.reset();
        
    } catch (err) {
        console.error(err);
        errorDiv.textContent = '❌ Erreur : ' + err.message;
    }
}