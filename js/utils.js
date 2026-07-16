function getUser() { return JSON.parse(localStorage.getItem('monecole_user') || 'null'); }
function setUser(u) { localStorage.setItem('monecole_user', JSON.stringify(u)); }
function clearUser() { localStorage.removeItem('monecole_user'); }
function identifiantToEmail(id) { return id + "@monecole.local"; }
function emailToIdentifiant(email) { return email ? email.replace("@monecole.local", "") : ""; }
function showAlert(msg, type = "info") {
    const el = document.getElementById("alert-box");
    if (el) el.remove();
    const div = document.createElement("div");
    div.id = "alert-box";
    div.className = "alert alert-" + type;
    div.textContent = msg;
    (document.querySelector("main") || document.body).prepend(div);
    setTimeout(() => div.remove(), 4000);
}
function formatDate(d) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}
function formatDateTime(d) {
    if (!d) return "";
    return new Date(d).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function goTo(url) { window.location.href = url; }
function logout() { clearUser(); goTo('../index.html'); }
function requireAuth(roles) {
    const user = getUser();
    if (!user) { goTo('../index.html'); return false; }
    if (roles && !roles.includes(user.role)) {
        goTo(user.role === 'prof' ? '../prof/dashboard.html' : user.role === 'eleve' ? '../eleve/dashboard.html' : '../admin/dashboard.html');
        return false;
    }
    return true;
}
function buildNavbar(role, base = "") {
    const nav = document.getElementById("dynamic-nav");
    if (!nav) return;
    const prefix = base || (role === 'admin' ? '' : role + '/');
    const links = {
        admin: [
            { href: prefix + "dashboard.html", label: "Accueil" },
            { href: prefix + "gestion-comptes.html", label: "Comptes" },
            { href: prefix + "gestion-classes.html", label: "Classes" },
            { href: prefix + "gestion-matieres.html", label: "Matières" }
        ],
        prof: [
            { href: prefix + "dashboard.html", label: "Accueil" },
            { href: prefix + "matieres.html", label: "Matières" },
            { href: prefix + "devoirs.html", label: "Devoirs" },
            { href: prefix + "qcm.html", label: "QCM" },
            { href: prefix + "notes.html", label: "Notes" },
            { href: prefix + "agenda.html", label: "Agenda" },
            { href: prefix + "messages.html", label: "Messages" }
        ],
        eleve: [
            { href: prefix + "dashboard.html", label: "Accueil" },
            { href: prefix + "devoirs.html", label: "Devoirs" },
            { href: prefix + "qcm.html", label: "QCM" },
            { href: prefix + "notes.html", label: "Notes" },
            { href: prefix + "agenda.html", label: "Agenda" },
            { href: prefix + "messages.html", label: "Messages" }
        ]
    };
    nav.innerHTML = (links[role] || []).map(l => '<a href="' + l.href + '">' + l.label + '</a>').join('');
}
