// ============================================
//  Bac-Général — JS principal (index.html)
// ============================================

// Anime l'entrée des cartes matière au scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.animationDelay = `${i * 0.06}s`;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.matiere-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  observer.observe(card);
});

// Déclenche l'animation
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.matiere-card').forEach((card, i) => {
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 80);
  });
});

// Script pour le formulaire de contact
document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
      contactForm.reset();
    });
  }

  // Script pour l'admin (simulation)
  const adminLogin = document.getElementById('adminLogin');
  if (adminLogin) {
    adminLogin.addEventListener('submit', function (e) {
      e.preventDefault();
      const username = document.getElementById('admin-username').value;
      const password = document.getElementById('admin-password').value;

      // Simulation de vérification (à remplacer par une vraie auth)
      if (username === 'admin' && password === 'bac2026') {
        alert('Connexion réussie ! (Simulation)');
        // Rediriger vers une vraie page admin ici
      } else {
        alert('Identifiants incorrects. (Simulation)');
      }
    });
  }
});
