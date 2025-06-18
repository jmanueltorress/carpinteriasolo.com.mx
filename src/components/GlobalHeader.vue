<template>
  <div :class="['navMenu', { scrolled, hidden: hideHeader }]">
    <!-- Mobile header -->
    <div class="mobile-header">
      <img :src="logoSrc" alt="Logo" class="mobile-logo" />
      <button 
        class="hamburger-btn" 
        @click="toggleMobileMenu"
        :class="{ active: mobileMenuOpen }"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- Desktop navigation -->
    <nav class="navbar desktop-nav">
      <img :src="logoSrc" alt="Logo" class="desktop-logo" />
      <div class="links-1">
        <router-link to="/">Inicio</router-link>
        <router-link to="/About">Nosotros</router-link>
        <router-link to="/contact">Contáctanos</router-link>
      </div>
      
    </nav>

    <!-- Mobile navigation menu -->
    <nav class="mobile-nav" :class="{ open: mobileMenuOpen }">
      <div class="mobile-links">
        <router-link to="/" @click="closeMobileMenu">Inicio</router-link>
        <router-link to="/About" @click="closeMobileMenu">Nosotros</router-link>
        <router-link to="/contact" @click="closeMobileMenu">Contáctanos</router-link>
        
      </div>
    </nav>

    <!-- Mobile menu overlay -->
    <div 
      class="mobile-overlay" 
      :class="{ active: mobileMenuOpen }"
      @click="closeMobileMenu"
    ></div>
  </div>
</template>

<script>
import logoDark from '@/assets/logo-dark.png';
import logoLight from '@/assets/logo-dark.png';


export default {
  name: 'navMenu',
  data() {
    return {
      scrolled: false,
      hideHeader: false,
      observer: null,
      mobileMenuOpen: false,
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);

    this.$nextTick(() => {
      const footer = document.querySelector('footer');
      if (footer) {
        this.observer = new IntersectionObserver(
          ([entry]) => {
            this.hideHeader = entry.isIntersecting;
          },
          { threshold: 0.1 }
        );
        this.observer.observe(footer);
      }
    });
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    if (this.observer) this.observer.disconnect();
  },
  methods: {
    handleScroll() {
      this.scrolled = window.scrollY > 0;
    },
    handleResize() {
      if (window.innerWidth > 768 && this.mobileMenuOpen) {
        this.closeMobileMenu();
      }
    },
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
      document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
    },
    closeMobileMenu() {
      this.mobileMenuOpen = false;
      document.body.style.overflow = '';
    }
  },
  computed: {
    logoSrc() {
      return this.scrolled ? logoLight : logoDark;
    },
    loginIcon() {
      return loginIcon;
    },
    shopIcon() {
      return shopIcon;
    }
  }
};
</script>

<style scoped>
.navMenu {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--main-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.4s ease;
  width: 100%;
  height: 100px;
  transform: translateY(0);
}

.navMenu.scrolled {
  background: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.navMenu.hidden {
  transform: translateY(-100%);
}

/* Mobile header - hidden on desktop */
.mobile-header {
  display: none;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 2rem;
}

.mobile-logo {
  height: 90px;
}

/* Desktop navigation */
.desktop-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  box-sizing: border-box;
}

.desktop-logo {
  padding-left: 0px;
  height: 70px;
  margin-top: -12px;
  transition: height 0.3s ease;
}

.links-1,
.links-2 {
  display: flex;
  gap: 1rem;
}

.links-2 a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.links-2 a img {
  height: auto;
  opacity: 1;
  vertical-align: middle;
}

/* Hamburger button */
.hamburger-btn {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 30px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.hamburger-btn span {
  width: 30px;
  height: 3px;
  background: var(--text-color);
  border-radius: 2px;
  transition: all 0.3s linear;
  position: relative;
  transform-origin: 1px;
}

.navMenu.scrolled .hamburger-btn span {
  background: var(--main-dark);
}

.hamburger-btn.active span:first-child {
  transform: rotate(45deg);
}

.hamburger-btn.active span:nth-child(2) {
  opacity: 0;
  transform: translateX(20px);
}

.hamburger-btn.active span:nth-child(3) {
  transform: rotate(-45deg);
}

/* Mobile navigation */
.mobile-nav {
  display: none;
  position: fixed;
  top: 100px;
  right: -100%;
  width: 300px;
  height: calc(100vh - 100px);
  background: var(--main-dark);
  transition: right 0.3s ease;
  z-index: 999;
}

.navMenu.scrolled .mobile-nav {
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
}

.mobile-nav.open {
  right: 0;
}

.mobile-links {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  height: 100%;
}

.mobile-links > a {
  padding: 1rem 0;
  color: var(--text-color);
  text-decoration: none;
  font-family: var(--global-font-family);
  font-size: 1.1rem;
  font-weight: 500;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: color 0.3s ease;
}

.navMenu.scrolled .mobile-links > a {
  color: var(--main-dark);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.mobile-links > a:hover,
.mobile-links > a.router-link-active {
  color: rgb(184, 181, 181);
}

.mobile-actions {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.navMenu.scrolled .mobile-actions {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.mobile-actions a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.8rem 0;
  color: var(--text-color);
  text-decoration: none;
  font-family: var(--global-font-family);
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.navMenu.scrolled .mobile-actions a {
  color: var(--main-dark);
}

.mobile-actions a:hover {
  color: var(--brand);
}

.mobile-actions a img {
  width: 20px;
  height: 20px;
}

/* Mobile overlay */
.mobile-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.mobile-overlay.active {
  opacity: 1;
}

/* Estilo base para todos los links del desktop */
.navbar a {
  padding: 0.5rem 1rem;
  color: var(--text-color);
  text-decoration: none;
  font-family: var(--global-font-family);
  font-size: var(--nav-bar-fontsz-desktop);
  font-weight: bold;
  white-space: nowrap;
  transition: color 0.3s;
}

/* Estilo para router-links en links-1 con subrayado suave */
.navbar .links-1 a {
  position: relative;
  font-weight: 500;
}

.navbar .links-1 a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 100%;
  background-color: var(--brand);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease-in-out;
}

.navbar .links-1 a.router-link-active::after,
.navbar .links-1 a.router-link-exact-active::after {
  font-weight: 800;
  transform: scaleX(1);
}

.navbar .links-1 a:hover::after {
  transform: scaleX(1);
}
/* Color de la línea cuando el fondo es oscuro (modo inicial) */
.navMenu:not(.scrolled) .navbar .links-1 a::after {
  background-color: white; /* o el color claro que desees */
}

.navMenu:not(.scrolled) .navbar .links-1 a.router-link-active,
.navMenu:not(.scrolled) .navbar .links-1 a.router-link-exact-active,
.navMenu:not(.scrolled) .navbar .links-1 a:hover {
  color: white;
}

.navMenu.scrolled .navbar a {
  color: var(--main-dark);
}

/* Media queries */
@media (max-width: 768px) {
  body {
    overflow-x: hidden;
  }

  .navMenu {
    height: 80px;
  }

  /* Mostrar el encabezado móvil y ocultar el de escritorio */
  .mobile-header {
    display: flex;
  }

  .desktop-nav {
    display: none;
  }

  /* Mostrar menú móvil y overlay */
  .mobile-nav {
    display: block;
    position: fixed;
    top: 80px;
    right: 0;
    transform: translateX(100%);
    width: 100%;
    max-width: 300px;
    height: calc(100vh - 80px);
    background: var(--main-dark);
    transition: transform 0.3s ease;
    z-index: 999;
    overflow-y: auto;
  }

  .mobile-nav.open {
    transform: translateX(0);
  }

  .mobile-overlay {
    display: block;
  }

  .mobile-nav .mobile-links {
    padding: 2rem;
    height: 100%;
  }
}


@media (max-width: 480px) {
  
  .mobile-nav {
    width: 100%;
    right: -100%;
  }

  .mobile-links {
    padding: 1.5rem;
  }
}
</style>