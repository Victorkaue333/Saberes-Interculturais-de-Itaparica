// Inicializa os ícones da biblioteca Lucide
lucide.createIcons();

// Rolagem suave para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});

// Menu Mobile Toggle
const mobileToggle = document.getElementById('mobile-toggle');
const navLinks = document.querySelector('.nav-links');

mobileToggle.addEventListener('click', () => {
    if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '70px';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.backgroundColor = 'var(--color-palha)';
        navLinks.style.padding = '2rem';
        navLinks.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
    }
});

// Funcionalidade do Modal da Galeria
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');

document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => {
        modal.style.display = 'flex';
        modalImg.src = img.src;
    });
});

// Fechar modal ao clicar fora
modal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Efeito de rolagem no cabeçalho
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.padding = '0.5rem 0';
        header.style.borderBottom = '4px solid var(--color-urucum)';
    } else {
        header.style.padding = '1.2rem 0';
    }
});
