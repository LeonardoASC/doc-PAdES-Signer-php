const sidebar = document.querySelector('[data-sidebar]');
const menuButton = document.querySelector('[data-menu]');
const searchInput = document.querySelector('[data-search]');
const sections = Array.from(document.querySelectorAll('.doc-section'));
const navLinks = Array.from(document.querySelectorAll('.nav-link'));

menuButton?.addEventListener('click', () => {
    document.body.classList.toggle('sidebar-open');
});

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        document.body.classList.remove('sidebar-open');
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === '/' && document.activeElement !== searchInput) {
        event.preventDefault();
        searchInput?.focus();
    }

    if (event.key === 'Escape') {
        document.body.classList.remove('sidebar-open');
        searchInput?.blur();
    }
});

document.querySelectorAll('.copy').forEach((button) => {
    button.addEventListener('click', async () => {
        const code = button.parentElement?.querySelector('code')?.innerText ?? '';

        try {
            await navigator.clipboard.writeText(code);
            button.textContent = 'Copiado';
            window.setTimeout(() => {
                button.textContent = 'Copiar';
            }, 1200);
        } catch {
            button.textContent = 'Erro';
            window.setTimeout(() => {
                button.textContent = 'Copiar';
            }, 1200);
        }
    });
});

searchInput?.addEventListener('input', () => {
    const query = normalize(searchInput.value);

    sections.forEach((section) => {
        const haystack = normalize(`${section.dataset.title ?? ''} ${section.innerText}`);
        section.classList.toggle('hidden', query !== '' && !haystack.includes(query));
    });

    navLinks.forEach((link) => {
        const target = document.querySelector(link.getAttribute('href'));
        link.hidden = Boolean(target?.classList.contains('hidden'));
    });
});

const observer = new IntersectionObserver((entries) => {
    const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) {
        return;
    }

    navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`);
    });
}, {
    rootMargin: '-72px 0px -68% 0px',
    threshold: [0.08, 0.2, 0.4],
});

sections.forEach((section) => observer.observe(section));

document.addEventListener('click', (event) => {
    if (!document.body.classList.contains('sidebar-open')) {
        return;
    }

    if (sidebar?.contains(event.target) || menuButton?.contains(event.target)) {
        return;
    }

    document.body.classList.remove('sidebar-open');
});

function normalize(value) {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}
