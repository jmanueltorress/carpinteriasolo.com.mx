<template>
 <div class="contact-container">
  <!-- COLUMNA 1: VIDEO (TikTok) -->
  <div class="col">
    <div class="tiktok">
      <blockquote
        class="tiktok-embed"
        cite="https://www.tiktok.com/@carpinteriasolo/video/7525189836119084295"
        data-video-id="7525189836119084295"
        data-embed-from="oembed"
        style="max-width: 100%; min-width: 100%"
      >
        <section>
          <a target="_blank" title="@carpinteriasolo" href="https://www.tiktok.com/@carpinteriasolo?refer=embed">@carpinteriasolo</a>
          <p>
            Diseñamos contigo, para ti y pensando en tu espacio. Cada proyecto para nosotros es tan especial como para ti.
            Tu espacio merece algo bien hecho. ¡SOLO CARPINTERIA LO HACE POSIBLE!
            <a title="solocarpintería" target="_blank" href="https://www.tiktok.com/tag/solocarpinter%C3%ADa?refer=embed">#SoloCarpintería</a>
            ...
          </p>
          <a target="_blank" title="♬ sonido original - Carpintería SOLO" href="https://www.tiktok.com/music/sonido-original-7525189881690114832?refer=embed">♬ sonido original - Carpintería SOLO</a>
        </section>
      </blockquote>
    </div>
  </div>

  <!-- COLUMNA 2: FORMULARIO -->
  <div class="col">
    <div class="formulario">
      <h2>ESCRÍBENOS!</h2>
      <p>TE RESPONDEREMOS CON GUSTO.</p>
      <form @submit.prevent="enviarFormulario">
        <input type="text" v-model="nombre" name="Nombre" placeholder="Nombre" required />
        <input type="text" v-model="empresa" name="Empresa" placeholder="Empresa" />
        <input type="tel" v-model="telefono" name="Telefono" placeholder="Número de Contacto" required />
        <textarea v-model="mensaje" name="Mensaje" placeholder="Mensaje" rows="4" required></textarea>

        <!-- AVISO DE PRIVACIDAD -->
        <label class="aviso">
          <input type="checkbox" v-model="avisoPrivacidad" name="AvisoPrivacidad" required />
          He leído y acepto el <router-link to="/avisoPrivacy">Aviso de Privacidad.</router-link>
        </label>

        <button type="submit">Enviar</button>
      </form>
    </div>
  </div>

  <!-- COLUMNA 3: MAPA -->
  <div class="col">
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
  </div>
</div>

</template>

<script setup>
import { onMounted } from 'vue'
import { ref } from 'vue'

const nombre = ref('')
const empresa = ref('')
const telefono = ref('')
const mensaje = ref('')
const avisoPrivacidad = ref(false) // ✅ Checkbox

const youtubeURL = "https://www.youtube.com/embed/YOUTUBE_ID"
const mapURL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3734.427208524124!2d-101.2187871!3d21.4734973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842b03682df8d70f%3A0x11fc3f6fddec48a5!2sCarpinteria%20SOLO!5e0!3m2!1ses-419!2smx!4v1719513580000!5m2!1ses-419!2smx"

const enviarFormulario = async () => {
  const formData = new FormData()
  formData.append('Nombre', nombre.value)
  formData.append('Empresa', empresa.value)
  formData.append('Telefono', telefono.value)
  formData.append('Mensaje', mensaje.value)
  formData.append('AvisoPrivacidad', avisoPrivacidad.value ? 'Aceptado' : 'No aceptado')

  try {
    const response = await fetch('https://formspree.io/f/xblybggg', {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    })

    if (response.ok) {
      alert('¡Mensaje enviado correctamente!')
      nombre.value = ''
      empresa.value = ''
      telefono.value = ''
      mensaje.value = ''
      avisoPrivacidad.value = false
    } else {
      alert('Hubo un problema al enviar el formulario.')
    }
  } catch (error) {
    console.error('Error al enviar formulario:', error)
    alert('Ocurrió un error de red. Intenta más tarde.')
  }
}
// tiktockEmbed
onMounted(() => {
  const script = document.createElement('script')
  script.setAttribute('src', 'https://www.tiktok.com/embed.js')
  script.setAttribute('async', '')
  script.onerror = () => {
    const fallbackScript = document.createElement('script')
    fallbackScript.src = 'https://iframely.net/files/tiktok-embed.js'
    document.body.appendChild(fallbackScript)
  }
  document.body.appendChild(script)
})
</script>


<style scoped>
.tiktok {
  width: 100%;
  display: flex;
  justify-content: center;
}

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
.aviso {
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.aviso a {
  color: #007BFF;
  text-decoration: underline;
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
<!-- estilos--safari nav -->
 <style scoped>
@media not all and (min-resolution: 0.001dpcm) {
  @supports (-webkit-appearance: none) {
    .contact-container {
      flex-direction: column;
      align-items: center;
    }

    .logo img {
      max-width: 280px; /* Ajuste por si Safari rompe escalado */
    }

    .formulario input,
    .formulario textarea {
      font-size: 1.05rem;
    }

    .formulario button {
      background-color: #222; /* Asegura contraste si Safari interpreta distinto */
    }

    .redes a {
      font-size: 1.6rem;
    }
  }
}
</style>