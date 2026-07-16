document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = '';

    const identifiant = document.getElementById('identifiant').value;
    const password = document.getElementById('password').value;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: identifiant + '@monecole.fr',
            password: password
        });

        if (error) {
            errorDiv.textContent = '❌ ' + error.message;
        } else {
            window.location.href = 'dashboard.html';
        }
    } catch (err) {
        errorDiv.textContent = '❌ Erreur : ' + err.message;
    }
});