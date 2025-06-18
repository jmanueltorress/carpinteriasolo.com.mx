<template>
  <section class="carousel-pj">
    <h2 class="titulo">NUESTROS PODUCTOS</h2>
    <v-card class="mx-auto" elevation="24" max-width="444">
      <v-carousel
        :continuous="false"
        :show-arrows="false"
        delimiter-icon="mdi-square"
        height="300"
        hide-delimiter-background
      >
        <v-carousel-item
          v-for="(image, i) in images"
          :key="i"
        >
          <v-img
            :src="image"
            height="100%"
            cover
          />
        </v-carousel-item>
      </v-carousel>
    </v-card>
  </section>
</template>

<script setup>
const images = [
  new URL('@/assets/carousel-projects/banios.jpg', import.meta.url).href,
  new URL('@/assets/carousel-projects/banios2.webp', import.meta.url).href,
  new URL('@/assets/carousel-projects/letreros.jpg', import.meta.url).href,
   new URL('@/assets/carousel-projects/banios3.webp', import.meta.url).href,
  
 
]
</script>


<style scoped>
.carousel-pj {
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
</style>
