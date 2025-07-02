<template>
  <div class="contact-container">
    <!-- LOGO -->
    <!-- <div class="logo">
      <img src="@/assets/logo-dark.png" alt="Logo SOLO" />
    </div> -->

    <!-- FORMULARIO -->
    <div class="formulario">
      <h2>ESCRÍBENOS!</h2>
      <p>TE RESPONDEREMOS CON GUSTO.</p>
      <form @submit.prevent="enviarFormulario">
        <input type="text" v-model="nombre" name="Nombre" placeholder="Nombre" required />
        <input type="text" v-model="empresa" name="Empresa" placeholder="Empresa" />
        <input type="tel" v-model="telefono" name="Telefono" placeholder="Número de Contacto" required />
        <textarea v-model="mensaje" name="Mensaje" placeholder="Mensaje" rows="4" required></textarea>
        <button type="submit">Enviar</button>
      </form>
    </div>



    <!-- MAPA -->
    <div class="mapa">
      <h2>VISÍTANOS!</h2>
      <p>ESTAMOS PARA ATENDERTE</p>
      <iframe
        :src="mapURL"
        width="100%"
        height="250"
        style="border:0;"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
        <!-- VIDEO -->
    <div class="video">
      
      <iframe
        width="100%"
        height="100%"
        :src="youtubeURL"
        title="YouTube video player"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>

    <!-- REDES SOCIALES -->
    <div class="redes">
      <a href="https://www.facebook.com/share/15ZsJWHdT1/?mibextid=wwXIfr" target="_blank"><i class="fab fa-facebook"></i></a>
      <a href="tel:+524826900837"><i class="fas fa-phone"></i></a>
      <a href="mailto:carpinteriasolo@gmail.com"><i class="fas fa-envelope"></i></a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const nombre = ref('')
const empresa = ref('')
const telefono = ref('')
const mensaje = ref('')

const youtubeURL = "https://www.youtube.com/embed/YOUTUBE_ID"
const mapURL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3734.427208524124!2d-101.2187871!3d21.4734973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842b03682df8d70f%3A0x11fc3f6fddec48a5!2sCarpinteria%20SOLO!5e0!3m2!1ses-419!2smx!4v1719513580000!5m2!1ses-419!2smx"

const enviarFormulario = () => {
  console.log('Formulario enviado:', { nombre, empresa, telefono, mensaje })
}
</script>

<style scoped>
.contact-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2.5rem;
  padding: 2.5rem 10%;

  background-color: white;
}

.logo,
.formulario,
.video,
.mapa {
  flex: 1 1 300px;
  max-width: 400px;
  text-align: center;
}

.logo img {
  width: 100%;
  max-width: 300px;
}

.formulario form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.formulario input,
.formulario textarea {
  padding: 0.5rem;
  font-size: 1rem;
}

.formulario button {
  padding: 0.5rem;
  background-color: #333;
  color: white;
  border: none;
  cursor: pointer;
}

.redes {
  width: 100%;
  text-align: center;
  margin-top: 1rem;
}

.redes a {
  margin: 0 0.5rem;
  font-size: 1.5rem;
  color: #333;
}

@media (max-width: 768px) {
  .contact-container {
    flex-direction: column;
    align-items: center;
  }

  .logo,
  .formulario,
  .video,
  .mapa {
    max-width: 100%;
  }
}
</style>
