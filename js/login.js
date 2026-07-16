// =============================================
// SUPABASE INIT
// =============================================
const SUPABASE_URL = 'https://vmdgeyownoctshmamljy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_44jDjXt4IBWFF_QmTPOviw_Owdd1kUl';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('✅ Supabase initialisé');

// =============================================
// LOGIN HANDLER
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // LOGIN
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const identifiant = document.getElementById('identifiant').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('error');
            
            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: identifiant,
                    password: password
                });
                
                if (error) {
                    errorDiv.style.display = 'block';
                    errorDiv.textContent = '❌ ' + error.message;
                    return;
                }
                
                console.log('✅ Connexion réussie !', data);
                window.location.href = 'dashboard.html';
                
            } catch (err) {
                console.error(err);
                errorDiv.style.display = 'block';
                errorDiv.textContent = '❌ Erreur : ' + err.message;
            }
        });
    }
    
    // REGISTER
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const name = document.getElementById('reg-name').value;
            const role = document.getElementById('reg-role').value;
            const errorDiv = document.getElementById('register-error');
            
            if (!email || !password || !name) {
                errorDiv.style.display = 'block';
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
                    errorDiv.style.display = 'block';
                    errorDiv.textContent = '❌ ' + error.message;
                    return;
                }
                
                console.log('✅ Inscription réussie !', data);
                errorDiv.className = 'alert alert-success';
                errorDiv.style.display = 'block';
                errorDiv.textContent = '✅ Inscription réussie ! Vérifiez votre email.';
                
                registerForm.reset();
                
            } catch (err) {
                console.error(err);
                errorDiv.style.display = 'block';
                errorDiv.textContent = '❌ Erreur : ' + err.message;
            }
        });
    }
});