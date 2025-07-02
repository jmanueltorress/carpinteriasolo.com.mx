<template>
  <section class="hero-container">
    <div class="hero-image"></div>
    <div class="hero-content">
      <h1 class="hero-title">COCINAS Y MUEBLES DE DISEÑO</h1>
      <p class="hero-description">
       En SOLO, transformamos cada pieza de madera en una obra única. Comprometidos con la calidad, la autenticidad y el carácter de cada proyecto.
      </p>
      <p class="hero-description">Fabricamos muebles, estructuras y acabados de madera con precisión, calidad y atención al detalle.</p>
    </div>
  </section>
</template>

<style scoped>
.hero-container {
  display: flex;
  height: 100vh;
  width: 100%;
}

.hero-image {
  flex: 1;
  background-image: url('@/assets/hero-home.webp'); /* Asegúrate de colocar la imagen ahí */
  background-size: cover;
  background-position: center;
}

.hero-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  background-color: #fff;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #222;
}

.hero-description {
  font-size: 1.25rem;
  color: #555;
}
/* Pantalla <= 680px */
@media (max-width: 680px) {
  .hero-title {
    font-size: 2.2rem;
  }
  .hero-description {
    font-size: 1.1rem;
  }
  
}

/* Pantalla <= 540px */
@media (max-width: 540px) {
  .hero-title {
    font-size: 1.8rem;
  }
  .hero-description {
    font-size: 1rem;
  }
}

/* Pantalla <= 420px */
@media (max-width: 420px) {
  .hero-title {
    font-size: 1.5rem;
  }
  .hero-description {
    font-size: 0.9rem;
  }
}

/* Pantalla <= 340px */
@media (max-width: 340px) {
  .hero-title {
    font-size: 1.2rem;
  }
  .hero-description {
    font-size: 0.85rem;
  }
}

</style>
<!-- estilos--safari nav -->
 <style scoped>
 @media not all and (min-resolution: 0.001dpcm) {
  @supports (-webkit-appearance: none) {
    .hero-container {
      flex-direction: column; /* Mejora visual en iOS en pantallas pequeñas */
    }

    .hero-image {
      background-image: url('/assets/hero-home.webp'); /* Ruta compatible con Safari */
      min-height: 300px;
    }

    .hero-content {
      padding: 2rem 1rem;
    }

    .hero-title {
      font-size: 2.2rem;
      line-height: 1.2;
    }

    .hero-description {
      font-size: 1.1rem;
    }
  }
}

</style>