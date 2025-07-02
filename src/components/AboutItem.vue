<template>
  <section class="organigrama-container">
    <!-- Encabezado -->
    <div class="top-section">
      <h1>QUIENES SOMOS</h1>
      <p class="intro">
SOLO es una carpintería dedicada a fabricar muebles y trabajos en madera a medida, combinando experiencia y calidad. Con más de 6 años de trayectoria, nos enfocamos en los detalles y en el uso de materiales duraderos para ofrecer resultados que superen tus expectativas. Además, buscamos soluciones que se ajusten a las necesidades y posibilidades de cada cliente. Transformamos la madera en piezas únicas para tu hogar o negocio.       </p>
    </div>

    <!-- Imagen con Organigrama -->
    <!-- <div class="image-section">
      <img src="@/assets/logo-dark.png" alt="Organigrama" class="bg-image" />
      <div class="organigrama-text">ORGANIGRAMA</div>
    </div> -->

    <!-- Botones y cards -->
    <div class="cards-section">
      <div class="buttons">
        <button
          @click="toggleCard('mision')"
          :class="{ active: activeCard === 'mision' }"
        >
          MISIÓN
        </button>
        <button
          @click="toggleCard('vision')"
          :class="{ active: activeCard === 'vision' }"
        >
          VISIÓN
        </button>
        <button
          @click="toggleCard('valores')"
          :class="{ active: activeCard === 'valores' }"
        >
          VALORES
        </button>
      </div>

      <!-- Transición suave deslizante con key única -->
      <transition name="slide-up" mode="out-in">
  <div class="card" v-if="activeCard" :key="activeCard">
    <p v-if="activeCard !== 'valores'">{{ cardText[activeCard] }}</p>
    <ul v-else>
      <li v-for="(valor, index) in cardText.valores" :key="index">{{ valor }}</li>
    </ul>
  </div>
</transition>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

// ✅ Mostrar "MISIÓN" como activa al cargar la vista
const activeCard = ref('mision');

const cardText = {
  mision: 'Crear proyectos de carpintería únicos y funcionales que reflejen el estilo y necesidades de nuestros clientes, utilizando materiales de calidad y técnicas artesanales para garantizar la durabilidad y belleza en cada trabajo.',
  vision: 'Cumplir las expectativas de quienes buscan excelencia y creatividad en trabajos de madera, innovando constantemente y fomentando relaciones duraderas con nuestros clientes y proveedores.',
  valores: [
    'Compromiso',
    'Pasión',
    'Confianza',
    'Creatividad',
    'Respeto'
  ]
};

function toggleCard(card) {
  if (activeCard.value === card) {
    activeCard.value = null;
  } else {
    if (activeCard.value !== null) {
      activeCard.value = null;
      setTimeout(() => {
        activeCard.value = card;
      }, 200); // tiempo sincronizado con la transición CSS
    } else {
      activeCard.value = card;
    }
  }
}
</script>


<style scoped>
.organigrama-container {
  background-color: white;
 
}

/* Encabezado */
.top-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  background-color: #000000; /* color de respaldo si imagen no carga */
  color: white;
  padding: 2rem;
 padding: 5% 25% 10% 25%;
   background: linear-gradient(135deg, rgba(3, 2, 2, 0.959), rgba(53, 36, 33, 0.7)), 
              url('@/assets/textura-madera.webp') center/cover no-repeat;
}




.logo {
  width: 90px;
  flex-shrink: 0;
}

.intro {
  flex: 1;
  font-size: 0.95rem;
  line-height: 1.6;
 
}

/* Imagen + Título */
.image-section {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.bg-image {
  width: 100%;
  height: auto;
  display: block;
}

.organigrama-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  letter-spacing: 2px;
}

/* Botones y Cards */
.cards-section {
  margin-top: -4%;
  text-align: center;
  padding: 2rem;
  min-height: 200px; /* Reserva espacio para evitar saltos de layout */
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.buttons button {
  padding: 0.8rem 1.5rem;
  border: 2px solid #000000;
  background-color: white;
  color: #000000;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.buttons button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s;
}

.buttons button:hover::before {
  left: 100%;
}

.buttons button.active,
.buttons button:hover {
  background-color: #000000;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(27, 24, 24, 0.3);
}

.card {
  max-width: 400px;
  margin: auto;
  background: linear-gradient(135deg, rgba(3, 2, 2, 0.959), rgba(53, 36, 33, 0.7)), 
              url('@/assets/textura-madera.webp') center/cover no-repeat;
  color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.card p {
  margin: 0;
  line-height: 1.6;
  font-size: 1rem;
  text-align: left;
}

/* ANIMACIÓN slide-up mejorada */
.slide-up-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.55, 0.06, 0.68, 0.19);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.slide-up-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.slide-up-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

/* Responsive */
@media (max-width: 768px) {
  .top-section {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }

  .logo {
    margin: auto;
    width: 70px;
  }

  .intro {
    font-size: 0.9rem;
    margin-top: 1rem;
  }

  .organigrama-text {
    font-size: 1.5rem;
    letter-spacing: 1px;
  }

  .buttons {
    flex-direction: column;
    align-items: center;
  }

  .buttons button {
    width: 200px;
    padding: 0.7rem 1.2rem;
  }

  .card {
    max-width: 90%;
    padding: 1.5rem;
  }

  .cards-section {
    padding: 1.5rem;
    min-height: 150px;
    margin-top:0;
  }
}

@media (max-width: 480px) {
  .top-section {
    padding: 1rem;
  }

  .organigrama-text {
    font-size: 1.2rem;
  }

  .buttons button {
    width: 180px;
    font-size: 0.9rem;
  }
}
</style>

<style scoped>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
<!-- estilos--safari nav -->
<style>
@media not all and (min-resolution: 0.001dpcm) {
  @supports (-webkit-appearance: none) {
    /* Estilos solo para Safari */
    .card {
      background-color: rgba(0, 0, 0, 0.5);
      -webkit-backdrop-filter: blur(5px);
      backdrop-filter: blur(5px);
    }

    .buttons button {
      margin: 0.5rem;
      /* Por si no soporta gap en flex */
    }

    .top-section {
      background: linear-gradient(135deg, rgba(3, 2, 2, 0.959), rgba(53, 36, 33, 0.7)),
                  url('/assets/textura-madera.webp') center/cover no-repeat;
    }

    /* Puedes añadir más clases si lo necesitas */
  }
}

</style>