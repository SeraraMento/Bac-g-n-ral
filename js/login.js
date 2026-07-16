// LOGIN
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('identifiant').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('error');
        
        console.log('🔐 Tentative login avec:', email);
        
        try {
            // Vérifie que c'est un email valide
            if (!email.includes('@')) {
                errorDiv.style.display = 'block';
                errorDiv.textContent = '❌ Veuillez entrer un email valide';
                return;
            }
            
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password.trim()
            });
            
            if (error) {
                console.error('❌ Erreur login:', error);
                errorDiv.style.display = 'block';
                errorDiv.textContent = '❌ Email ou mot de passe incorrect';
                return;
            }
            
            console.log('✅ Connexion réussie !', data);
            window.location.href = 'dashboard.html';
            
        } catch (err) {
            console.error('❌ Exception:', err);
            errorDiv.style.display = 'block';
            errorDiv.textContent = '❌ Erreur serveur';
        }
    });
}