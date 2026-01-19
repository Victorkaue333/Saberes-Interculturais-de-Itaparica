// Inicializa os ícones da biblioteca Lucide
lucide.createIcons();

// ====================
// ROLAGEM SUAVE PARA LINKS INTERNOS
// ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Scroll suave com offset para compensar header fixo
            const headerOffset = 100;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Fechar menu mobile após clicar (Bootstrap)
            const navbarCollapse = document.getElementById('navbarNav');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: true
                });
            }
        }
    });
});

// ====================
// BOTÃO VOLTAR AO TOPO
// ====================
const btnVoltarTopo = document.getElementById('btnVoltarTopo');

// Mostrar/ocultar botão baseado no scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        btnVoltarTopo.classList.add('show');
    } else {
        btnVoltarTopo.classList.remove('show');
    }
    
    // Efeito de rolagem no cabeçalho
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Ação do botão voltar ao topo
btnVoltarTopo.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ====================
// MODAL DA GALERIA
// ====================
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');

// Abrir modal ao clicar em imagens da galeria
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => {
        modal.style.display = 'flex';
        modalImg.src = img.src;
    });
});

// Fechar modal ao clicar fora
if (modal) {
    modal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// ====================
// ANIMAÇÕES AO SCROLL (Interseção Observer)
// ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observar seções para animação
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// ====================
// MENU ATIVO BASEADO NA SEÇÃO VISÍVEL
// ====================

/**
 * Sistema de detecção de seção ativa:
 * - Detecta qual seção está mais próxima do topo da viewport
 * - Aplica a classe 'btn-nav' ao link correspondente à seção ativa
 * - Atualiza dinamicamente conforme o usuário faz scroll
 */

// Função para atualizar o menu ativo
function atualizarMenuAtivo() {
    const scrollPos = window.scrollY + 150; // Offset do header fixo
    
    // Obtém todas as seções
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    
    // Encontra qual seção está atualmente visível
    let secaoAtiva = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        // Verifica se a posição do scroll está dentro desta seção
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            secaoAtiva = section.getAttribute('id');
        }
    });
    
    // Se chegou ao final da página, ativa a última seção
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        const ultimaSecao = sections[sections.length - 1];
        secaoAtiva = ultimaSecao.getAttribute('id');
    }
    
    // Remove btn-nav de todos os links
    navLinks.forEach(link => {
        link.classList.remove('btn-nav');
    });
    
    // Adiciona btn-nav ao link ativo
    if (secaoAtiva) {
        const linkAtivo = document.querySelector(`.nav-link[data-section="${secaoAtiva}"]`);
        if (linkAtivo) {
            linkAtivo.classList.add('btn-nav');
        }
    }
}

// Atualiza o menu ao fazer scroll
window.addEventListener('scroll', atualizarMenuAtivo);

// Define o menu ativo ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    atualizarMenuAtivo();
});
