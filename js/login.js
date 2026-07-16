// CONFIG SUPABASE
const SUPABASE_URL = 'https://vmdgeyownoctshmamljy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_44jDjXt4IBWFF_QmTPOviw_Owdd1kUl';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('✅ Supabase initialisé');

// TABS
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// LOGIN
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        const errorDiv = document.getElementById('loginError');
        
        console.log('🔐 Login avec:', email);
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) {
                console.error('❌ Erreur:', error.message);
                errorDiv.textContent = '❌ Email ou mot de passe incorrect';
                errorDiv.style.display = 'block';
                return;
            }
            
            console.log('✅ Connexion réussie !');
            window.location.href = 'dashboard.html';
            
        } catch (err) {
            console.error('❌ Exception:', err);
            errorDiv.textContent = '❌ Erreur serveur';
            errorDiv.style.display = 'block';
        }
    });
}

// SIGNUP
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value.trim();
        const confirm = document.getElementById('signupConfirm').value.trim();
        const errorDiv = document.getElementById('signupError');
        
        console.log('📝 Inscription avec:', email);
        
        if (password !== confirm) {
            errorDiv.textContent = '❌ Les mots de passe ne correspondent pas';
            errorDiv.style.display = 'block';
            return;
        }
        
        if (password.length < 6) {
            errorDiv.textContent = '❌ Le mot de passe doit faire au moins 6 caractères';
            errorDiv.style.display = 'block';
            return;
        }
        
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password
            });
            
            if (error) {
                console.error('❌ Erreur:', error.message);
                errorDiv.textContent = '❌ ' + error.message;
                errorDiv.style.display = 'block';
                return;
            }
            
            console.log('✅ Inscription réussie ! Vérifiez votre email');
            errorDiv.textContent = '✅ Inscription réussie ! Vérifiez votre email';
            errorDiv.style.color = '#28a745';
            errorDiv.style.display = 'block';
            
            // Vider les champs
            signupForm.reset();
            
        } catch (err) {
            console.error('❌ Exception:', err);
            errorDiv.textContent = '❌ Erreur serveur';
            errorDiv.style.display = 'block';
        }
    });
}