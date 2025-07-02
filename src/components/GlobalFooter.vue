<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="copyright">
        © CARPINTERIA - SOLO - 2025
      </div>
      <div class="social-icons">
        <a href="https://www.facebook.com/share/15ZsJWHdT1/?mibextid=wwXIfr" target="_blank" aria-label="Facebook">
          <i class="fab fa-facebook-f"></i>
        </a>
        <a href="https://www.instagram.com/solo_carpinteriasf?igsh=OGF5M25ueTB5djBl" target="_blank" aria-label="Instagram">
          <i class="fab fa-instagram"></i>
        </a>
        <a href="mailto:carpinteriasolo@gmail.com" aria-label="Correo">
    <i class="fas fa-envelope"></i>
  </a>



        
      </div>
      <p class="copyright-2">
    SITIO WEB DESARROLLADO POR 
    <a href="https://github.com/jmanueltorress"><img src="/images/footer/logo-dev.png" alt="Logo-Developer" class="logo-dev" /></a>
  </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #000;
  color: #fff;
  padding: 1rem;
}

.footer-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-container .copyright {
  font-size: 0.9rem;
}
 .copyright-2 {
  font-size: 0.7rem;
}

.footer-container .social-icons {
  display: flex;
  gap: 1rem;
}

.footer-container .social-icons a {
  color: #fff;
  font-size: 1.2rem;
  text-decoration: none;
}

@media (max-width: 600px) {
  .footer-container {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .footer-container .social-icons {
    flex-direction: row;
  }
}
</style>
<!-- estilos--safari nav -->
 <style scoped>
@media not all and (min-resolution: 0.001dpcm) {
  @supports (-webkit-appearance: none) {
    .footer-container {
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 0.5rem;
    }

    .footer-container .social-icons {
      justify-content: center;
      flex-wrap: wrap;
    }

    .footer-container .social-icons a {
      font-size: 1.3rem;
    }

    .copyright,
    .copyright-2 {
      font-size: 0.85rem;
    }
  }
}

</style>