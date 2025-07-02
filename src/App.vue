<script setup>
import { RouterView } from 'vue-router'
import GlobalHeader from './components/GlobalHeader.vue'
import GlobalFooter from './components/GlobalFooter.vue'
</script>

<template>
  <!-- Global header visible en todas las rutas -->
  <GlobalHeader />

  <!-- Página actual según la ruta -->
  <RouterView />

  <GlobalFooter/>
    <!-- Botón de WhatsApp -->
  <a
    href="https://wa.me/524281033729"
    class="whatsapp-button"
    target="_blank"
    rel="noopener"
  >
    <img src="@/assets/whatsapp-icon.png" alt="WhatsApp" />
  </a>


    
</template>

<style>
.whatsapp-button {
  position: fixed;
  bottom: 20px;
  margin-bottom: 40px;
  right: 20px;
  z-index: 1000;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background-color: #25D366;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}
.whatsapp-button:hover {
  transform: scale(1.1);
}
.whatsapp-button img {
  width: 30px;
  height: 30px;
}
</style>
