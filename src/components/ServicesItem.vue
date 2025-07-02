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
//imgs
import banios1 from '@/assets/banios1.webp';
import banios2 from '@/assets/banios2.webp';
import cosina1 from '@/assets/cosina1.webp';
import cosina2 from '@/assets/cosina2.webp';
import recamara1 from '@/assets/recamara1.webp';
import recamara2 from '@/assets/recamara2.webp';
import decoracion1 from '@/assets/decoracion1.webp';
const servicios = [
    {
    nombre: 'BAÑOS',
    descripcion: 'Diseño de baños funcionales con acabados modernos.',
    imagenes: [banios1, banios2]
  },
  {
    nombre: 'COCINAS',
    descripcion: 'Cocinas personalizadas que combinan estilo y eficiencia.',
    imagenes: [cosina1, cosina2]
  },
  {
    nombre: 'RECAMARAS',
    descripcion: 'Ambientes acogedores para un descanso perfecto.',
    imagenes: [recamara1, recamara2]
  },
  {
    nombre: 'DECORACIÓN',
    descripcion: 'Elementos decorativos que transforman tus espacios.',
    imagenes: [decoracion1]
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
<!-- estilos--safari nav -->
 <style scoped>
 @media not all and (min-resolution: 0.001dpcm) {
  @supports (-webkit-appearance: none) {
    .servicios {
      background-color: #fff;
      padding: 1.5rem 0;
    }

    .grid {
      display: block; /* Safari a veces falla con grid en ciertos casos */
      max-width: 100%;
      margin: 0 auto;
    }

    .item {
      height: auto;
      margin-bottom: 1rem;
    }

    .carrusel img {
      object-fit: cover;
      width: 100%;
      height: auto;
    }

    .madera {
      background: url('/src/assets/textura-madera.webp') center center / cover no-repeat;
      -webkit-backface-visibility: hidden; /* mejora rendimiento */
      -webkit-transform: translate3d(0,0,0);
      color: white;
      padding: 1rem;
      text-align: center;
    }

    .madera .contenido {
      background-color: rgba(0, 0, 0, 0.5); /* ligeramente más opaco en Safari */
      padding: 1rem;
      border-radius: 6px;
    }
  }
}

</style>