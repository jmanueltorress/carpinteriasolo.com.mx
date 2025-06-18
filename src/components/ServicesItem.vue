<template>
  <section class="servicios-desktop servicios">
    <h2 class="titulo">NUESTROS SERVICIOS</h2>
    <div class="grid">
      <template v-for="(servicio, index) in servicios" :key="servicio.nombre">
        <!-- Condicional para alternar carrusel / fondo -->
        <div v-if="index % 2 === 0" class="item carrusel">
          <Swiper
            :modules="[Autoplay]"
            :autoplay="{ delay: 3000, disableOnInteraction: false }"
            :loop="true"
          >
            <SwiperSlide v-for="(img, i) in servicio.imagenes" :key="i">
              <img :src="img" :alt="servicio.nombre" />
            </SwiperSlide>
          </Swiper>
        </div>

        <div v-else class="item madera">
          <div class="contenido">
            <h3>{{ servicio.nombre }}</h3>
            <p>{{ servicio.descripcion }}</p>
          </div>
        </div>

        <!-- Alternar orden en fila siguiente -->
        <div v-if="index % 2 !== 0" class="item carrusel">
          <Swiper
            :modules="[Autoplay]"
            :autoplay="{ delay: 3000, disableOnInteraction: false }"
            :loop="true"
          >
            <SwiperSlide v-for="(img, i) in servicio.imagenes" :key="i">
              <img :src="img" :alt="servicio.nombre" />
            </SwiperSlide>
          </Swiper>
        </div>

        <div v-else class="item madera">
          <div class="contenido">
            <h3>{{ servicio.nombre }}</h3>
            <p>{{ servicio.descripcion }}</p>
          </div>
        </div>
      </template>
    </div>
  </section>
  <section class="servicios-mobil servicios">
    <h2 class="titulo">NUESTROS SERVICIOS</h2>
    <div class="grid">
      <template v-for="(servicio, index) in servicios" :key="servicio.nombre">
        <!-- Condicional para alternar carrusel / fondo -->
        

        <div  class="item madera">
          <div class="contenido">
            <h3>{{ servicio.nombre }}</h3>
            <p>{{ servicio.descripcion }}</p>
          </div>
        </div>

        
      </template>
    </div>
  </section>
</template>

<script setup>
import 'swiper/css';
import 'swiper/css/autoplay';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay } from 'swiper/modules';

const servicios = [
  {
    nombre: 'BAÑOS',
    descripcion: 'Diseño de baños funcionales con acabados modernos.',
    imagenes: ['/src/assets/carousel-services/banios1.webp', '/src/assets/carousel-services/banios2.webp']
  },
  {
    nombre: 'COCINAS',
    descripcion: 'Cocinas personalizadas que combinan estilo y eficiencia.',
    imagenes: ['/src/assets/carousel-services/cosina1.webp', '/src/assets/carousel-services/cosina2.webp']
  },
  {
    nombre: 'RECAMARAS',
    descripcion: 'Ambientes acogedores para un descanso perfecto.',
    imagenes: ['/src/assets/carousel-services/recamara1.webp', '/src/assets/carousel-services/recamara2.webp']
  },
  {
    nombre: 'DECORACIÓN',
    descripcion: 'Elementos decorativos que transforman tus espacios.',
    imagenes: ['/src/assets/carousel-services/decoracion1.webp']
  }
];
</script>

<style scoped>
.servicios {
  text-align: center;
  padding: 2rem 0;
  background-color: white;
}
.titulo {
  background-color: black;
  color: white;
  padding: 0.5rem 1rem;
  display: inline-block;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  letter-spacing: 1px;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  max-width: 600px;
  margin: auto;
}
.item {
  height: 200px;
  overflow: hidden;
  position: relative;
  border-radius: 4px;
}
.carrusel img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.madera {
  background: url('/src/assets/textura-madera.webp') center/cover no-repeat;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  text-align: center;
}
.madera .contenido {
  background-color: rgba(0, 0, 0, 0.4);
  padding: 1rem;
  border-radius: 6px;
}
.madera h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}
.madera p {
  font-size: 0.9rem;
  margin: 0;
}
@media (min-width: 480px) {
  .servicios-mobil{
    display:none;
  }
}
@media (max-width: 480px) {
  .servicios-desktop{
    display:none;
  }
}

</style>
