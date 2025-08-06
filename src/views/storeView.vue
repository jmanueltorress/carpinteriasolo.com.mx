<template>
  <div class="container">
    <div class="header-section">
      <!-- <h1>SOLO Carpintería</h1> -->
      <div class="company-info">
        <div class="manufacturing-badge">
          <span class="badge-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-tools">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M3 21h4l13 -13a1.5 1.5 0 0 0 -4 -4l-13 13v4" />
              <path d="M14.5 5.5l4 4" />
              <path d="M12 8l-5 -5l-4 4l5 5" />
              <path d="M7 8l-1.5 1.5" />
              <path d="M16 12l5 5l-4 4l-5 -5" />
              <path d="M16 17l-1.5 1.5" />
            </svg>
          </span>
          <div class="badge-text">
            <strong>Fabricación Directa</strong>
            <small>San Felipe, Guanajuato</small>
          </div>
        </div> 
      <!-- <div class="manufacturing-badge" style="display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
  <span class="badge-icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-tools">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M3 21h4l13 -13a1.5 1.5 0 0 0 -4 -4l-13 13v4" />
      <path d="M14.5 5.5l4 4" />
      <path d="M12 8l-5 -5l-4 4l5 5" />
      <path d="M7 8l-1.5 1.5" />
      <path d="M16 12l5 5l-4 4l-5 -5" />
      <path d="M16 17l-1.5 1.5" />
    </svg>
  </span>
  <div class="badge-text">
    <strong>Fabricación Directa</strong><br />
    <small>San Felipe, Guanajuato</small>
  </div>

  <a href="#" class="local-store-link" style=" color: #fff; text-decoration: none; font-weight: 600;">
    Ir a tienda local
  </a>
</div> -->

      </div>
    </div>

    <p>Selecciona tu ciudad para obtener información de entrega y tu vendedor asignado:</p>

    <!-- Checkbox horizontal para ciudades -->
    <div class="city-select">
      <label v-for="city in cities" :key="city.name" class="city-checkbox">
        <input
          type="radio"
          name="city"
          :value="city"
          v-model="selectedCity"
          @change="scrollToForm"
        />
        {{ city.name }}
      </label>
    </div>

    <!-- Formulario de cotización -->
    <div class="form-section" ref="formSection" v-if="selectedCity">
      <div class="form-container" :class="selectedCity.theme">
        <h2>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-world-pin">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M20.972 11.291a9 9 0 1 0 -8.322 9.686" />
            <path d="M3.6 9h16.8" />
            <path d="M3.6 15h8.9" />
            <path d="M11.5 3a17 17 0 0 0 0 18" />
            <path d="M12.5 3a16.986 16.986 0 0 1 2.578 9.018" />
            <path d="M21.121 20.121a3 3 0 1 0 -4.242 0c.418 .419 1.125 1.045 2.121 1.879c1.051 -.89 1.759 -1.516 2.121 -1.879z" />
            <path d="M19 18v.01" />
          </svg>
          {{ selectedCity.name }}
        </h2>

        <!-- Distribuidor asignado (siempre visible) -->
        <p><strong>Distribuidor asignado:</strong> {{ selectedCity.vendedor }}</p>

        <!-- Botón para mostrar/ocultar info adicional -->
        <button @click="showDistributorInfo = !showDistributorInfo" class="toggle-distributor-btn">
          {{ showDistributorInfo ? 'Ver menos' : 'Ver más' }}
        </button>

        <!-- Info adicional visible solo si showDistributorInfo es true -->
        <div v-if="showDistributorInfo" class="city-info">
          <p><strong>Dirección:</strong> {{ selectedCity.direccion }}</p>
          <p>
            <strong>Teléfono:</strong>
            <a :href="`tel:${selectedCity.telefono.replace(/\s+/g, '')}`" style="color:#fff; text-decoration: underline;">
              {{ selectedCity.telefono }}
            </a>
          </p>
        </div>

        <form @submit.prevent="submitForm">
          <div>
            <label>Nombre:</label><br />
            <input v-model="form.name" type="text" required />
          </div>
          <div>
            <label>Correo:</label><br />
            <input v-model="form.email" type="email" required />
          </div>
          <div>
            <label>Modelo de mueble:</label><br />
            <select v-model="form.modelo" required>
              <option disabled value="">Selecciona un modelo</option>
              <option v-for="model in modelos" :key="model" :value="model">{{ model }}</option>
            </select>
          </div>
          <div>
            <label>Color del mueble:</label><br />
            <select v-model="form.color" required>
              <option disabled value="">Selecciona un color</option>
              <option v-for="color in colores" :key="color" :value="color">{{ color }}</option>
            </select>
          </div>
          <div>
            <label>Detalles adicionales:</label><br />
            <textarea v-model="form.detalles" placeholder="Escribe aquí..."></textarea>
          </div>

          <button type="submit">Enviar cotización</button>
        </form>

        <div class="manufacturing-footer">
          <!-- Footer content, if any -->
        </div>
      </div>
    </div>
  </div>

  <div v-if="showPopup" class="popup-overlay">
    <div class="popup-content">
      <h2>¿Eres de San Felipe, Gto.?</h2>
      <p>
        Si eres de San Felipe, puedes hacer tu compra directa desde nuestra tienda online.<br />
        Si eres de otra ciudad, te conectaremos con nuestro distribuidor para atenderte mejor.
      </p>
      <div class="popup-buttons">
        <button @click="handleSanFelipeResponse(true)">Sí</button>
        <button @click="handleSanFelipeResponse(false)">No</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';

const cities = [
  {
    name: "León",
    vendedor: "Distribuidor Guanajuato",
    direccion: "Calle Ejemplo 1, León",
    telefono: "477 666 6666",
    theme: "graphite",
    deliveryTime: "1-2 días",
    shippingCost: "$180"
  },
  {
    name: "Ciudad de México",
    vendedor: "Distribuidor Central",
    direccion: "Calle Ejemplo 2, Col. Imaginaria, CDMX",
    telefono: "55 5555 5555",
    theme: "dark-blue",
    deliveryTime: "3-5 días",
    shippingCost: "$350"
  },
  {
    name: "Guadalajara",
    vendedor: "Distribuidor Occidente",
    direccion: "Calle Ejemplo 3, Guadalajara",
    telefono: "33 4444 4444",
    theme: "charcoal",
    deliveryTime: "2-4 días",
    shippingCost: "$280"
  },
  {
    name: "Monterrey",
    vendedor: "Distribuidor Norte",
    direccion: "Calle Ejemplo 4, Monterrey",
    telefono: "81 3333 3333",
    theme: "steel-gray",
    deliveryTime: "4-6 días",
    shippingCost: "$420"
  },
  {
    name: "Puebla",
    vendedor: "Distribuidor Angelópolis",
    direccion: "Calle Ejemplo 5, Puebla",
    telefono: "222 222 2222",
    theme: "deep-black",
    deliveryTime: "3-5 días",
    shippingCost: "$320"
  },
  {
    name: "Cancún",
    vendedor: "Distribuidor Caribe",
    direccion: "Calle Ejemplo 6, Cancún",
    telefono: "998 999 9999",
    theme: "dark-green",
    deliveryTime: "5-8 días",
    shippingCost: "$650"
  },
  {
    name: "Mérida",
    vendedor: "Distribuidor Yucatán",
    direccion: "Calle Ejemplo 7, Mérida",
    telefono: "777 777 7777",
    theme: "midnight",
    deliveryTime: "5-7 días",
    shippingCost: "$580"
  },
];

const modelos = ["Nano", "Greg", "Boris", "Lia", "Reni", "Dani"];
const colores = ["Nogal", "Blanco", "Gris", "Caoba", "Wengué"];

const selectedCity = ref(null);
const showDistributorInfo = ref(false);

const form = ref({
  name: "",
  email: "",
  modelo: "",
  color: "",
  detalles: "",
});

const formSection = ref(null);

function scrollToForm() {
  nextTick(() => {
    formSection.value?.scrollIntoView({ behavior: "smooth" });
  });
}

function submitForm() {
  alert(
    `Cotización enviada:\nCiudad: ${selectedCity.value.name}\nVendedor: ${selectedCity.value.vendedor}\nNombre: ${form.value.name}\nCorreo: ${form.value.email}\nModelo: ${form.value.modelo}\nColor: ${form.value.color}\nDetalles: ${form.value.detalles}`
  );
  selectedCity.value = null;
  showDistributorInfo.value = false;
}

// popup-question.
const showPopup = ref(true);

function handleSanFelipeResponse(isFromSanFelipe) {
  if (isFromSanFelipe) {
    window.location.href = 'https://tienda.ejemplo.com'; // cambia por tu URL real
  } else {
    showPopup.value = false; // Cierra el popup y muestra la página
  }
}
</script>

<style scoped>
/* popup */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.popup-content {
  background: #111;
  color: #fff;
  padding: 30px 20px;
  border-radius: 10px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

.popup-content h2 {
  margin-bottom: 15px;
}

.popup-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
}

.popup-buttons button {
  background: white;
  color: black;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}

.popup-buttons button:hover {
  background: #ddd;
}

/* container-main */
.container {
  max-width: 1200px;
  margin: 20px auto;
  color: white;
  background-color: black;
  padding: 20px;
  border-radius: 8px;
  font-family: Arial, sans-serif;
  text-align: center;
}

.header-section {
  margin-bottom: 20px;
}

.company-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  margin: 15px 0;
  flex-wrap: wrap;
}

.manufacturing-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #2d5016, #4a7c59);
  padding: 10px 15px;
  border-radius: 20px;
  border: 1px solid #5a9;
}

.badge-icon {
  font-size: 1.2em;
}

.badge-text {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.badge-text strong {
  font-size: 0.9em;
  color: #fff;
}

.badge-text small {
  font-size: 0.75em;
  color: #ccc;
}

.shipping-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ddd;
  font-size: 0.9em;
}

.shipping-icon {
  font-size: 1.1em;
}

.city-select {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
}

.city-checkbox {
  background: #222;
  padding: 10px 15px;
  border-radius: 20px;
  border: 1px solid #fff;
  cursor: pointer;
  color: #fff;
  font-weight: bold;
  user-select: none;
  transition: background 0.3s;
}

.city-checkbox input[type="radio"] {
  margin-right: 8px;
  accent-color: #ff6b35;
}

.city-checkbox:hover {
  background: #333;
}

.form-section {
  
  margin-top: 30px;
  transition: all 0.5s ease-in-out;
}
.form-container {
  width: 90%;             /* Ancho responsive */
  max-width: 600px;       /* O puedes usar 500px, 700px, etc. */
  margin: 0 auto;         /* ¡Esto lo centra! */
  text-align: left;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #333;
  transition: background-color 0.4s ease;
}

/* Temas oscuros para cada ciudad */
.form-container.dark-blue {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-color: #2a3f5f;
}

.form-container.charcoal {
  background: linear-gradient(135deg, #2c2c2c, #1a1a1a);
  border-color: #3c3c3c;
}

.form-container.steel-gray {
  background: linear-gradient(135deg, #36454f, #2f3640);
  border-color: #4a5568;
}

.form-container.deep-black {
  background: linear-gradient(135deg, #000000, #1c1c1c);
  border-color: #2d2d2d;
}

.form-container.dark-green {
  background: linear-gradient(135deg, #0f2027, #203a43);
  border-color: #2d4a52;
}

.form-container.midnight {
  background: linear-gradient(135deg, #2c3e50, #34495e);
  border-color: #4a6278;
}

.form-container.graphite {
  background: linear-gradient(135deg, #3c3c3c, #2a2a2a);
  border-color: #4d4d4d;
}

.city-info {
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 3px solid #fff;
}

.delivery-info {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.delivery-time, .shipping-cost {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9em;
}

.time-icon, .cost-icon {
  font-size: 1em;
}

form div {
  margin-bottom: 15px;
}

input,
textarea,
select {
  width: 100%;
  padding: 8px;
  background: black;
  color: white;
  border: 1px solid white;
  border-radius: 4px;
}

textarea {
  resize: vertical;
  min-height: 60px;
}

button {
  background: white;
  color: black;
  border: none;
  padding: 10px 15px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 4px;
  margin-top: 10px;
}

button:hover {
  background: #eee;
}

.manufacturing-footer {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  font-size: 0.85em;
  color: #ccc;
}

.quality-badge, .warranty-info {
  display: flex;
  align-items: center;
  gap: 5px;
}

@media (max-width: 768px) {
  .company-info {
    flex-direction: column;
    gap: 15px;
  }

  .manufacturing-footer {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }

  .city-select {
    flex-direction: column;
    align-items: center;
  }
}
</style>
