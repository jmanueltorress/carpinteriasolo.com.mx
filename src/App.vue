<script setup>
import { RouterView } from 'vue-router'
import GlobalHeader from './components/GlobalHeader.vue'
</script>

<template>
  <!-- Global header visible en todas las rutas -->
  <GlobalHeader />

  <!-- Página actual según la ruta -->
  <RouterView />
</template>

<style scoped>
/* ... (CSS ) */
</style>
