<template>
  <div id="app" style="display: flex; height: 100vh;">
    <!-- Sidebar -->
    <div class="sidebar">
      <h3>Muebles de baño</h3>
      <select v-model="tipoSeleccionado">
        <option v-for="tipo in tiposMuebles" :key="tipo.nombre" :value="tipo">
          {{ tipo.nombre }}
        </option>
      </select>

      <h3>Dimensiones</h3>

      <!-- Inputs dinámicos -->
      <div v-if="!tipoSeleccionado.estandar">
        <label>Ancho:
          <input type="number" v-model.number="tipoSeleccionado.ancho" step="0.1" />
        </label>
        <label>Alto:
          <input type="number" v-model.number="tipoSeleccionado.alto" step="0.1" />
        </label>
        <label>Fondo:
          <input type="number" v-model.number="tipoSeleccionado.fondo" step="0.1" />
        </label>
        <label>Puertas:
          <input type="number" v-model.number="tipoSeleccionado.puertas" min="0" />
        </label>
        <label>Cajones:
          <input type="number" v-model.number="tipoSeleccionado.cajones" min="0" />
        </label>
        <label>Estantes:
          <input type="number" v-model.number="tipoSeleccionado.estantes" min="0" />
        </label>
      </div>

      <!-- Mostrar medidas bloqueadas -->
      <div v-else>
        <p><b>Ancho:</b> {{ tipoSeleccionado.ancho }} m</p>
        <p><b>Alto:</b> {{ tipoSeleccionado.alto }} m</p>
        <p><b>Fondo:</b> {{ tipoSeleccionado.fondo }} m</p>
        <p><b>Puertas:</b> {{ tipoSeleccionado.puertas }}</p>
        <p><b>Cajones:</b> {{ tipoSeleccionado.cajones }}</p>
         <p><b>Estantes:</b> {{ tipoSeleccionado.estantes }}</p>
      </div>

      <!-- Selector de color -->
      <h3>Color</h3>
      <div class="color-selector">
        <button
          v-for="c in colores"
          :key="c"
          :style="{ background: c }"
          class="color-btn"
          @click="colorSeleccionado = c; renderMueble()"
        ></button>
      </div>

      <button @click="renderMueble">Aplicar Cambios</button>
    </div>

    <!-- Lienzo -->
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { onMounted, ref, reactive } from 'vue'

const canvas = ref(null)

// ✅ Solo dejamos Nano, Greg, Boris, Lia, Reni, Dany
const tiposMuebles = reactive([
  { nombre: 'Nano', ancho: 0.6, alto: 0.85, fondo: 0.45, puertas: 2, cajones: 0, estandar: true, estantes: 1 },
  { nombre: 'Greg', ancho: 0.8, alto: 0.85, fondo: 0.45, puertas: 1, cajones: 0, estandar: true, estantes: 2 },
  { nombre: 'Boris', ancho: 0.46, alto: 0.85, fondo: 0.40, puertas: 2, cajones: 1, estandar: true, estantes: 1 },
  { nombre: 'Lia', ancho: 0.64, alto: 0.85, fondo: 0.45, puertas: 2, cajones: 0, estandar: true, estantes: 1 },
  { nombre: 'Reni', ancho: 0.90, alto: 0.85, fondo: 0.45, puertas: 2, cajones: 4, estandar: true, estantes: 1 },
  { nombre: 'Dany', ancho: 0.63, alto: 0.82, fondo: 0.45, puertas: 0, cajones: 3, estandar: true, estantes: 1 },
])

let tipoSeleccionado = tiposMuebles[0]
let scene, camera, renderer, controls, muebleActual

// 🎨 Colores disponibles
const colores = ['white', 'black']
let colorSeleccionado = 'white'

// ------------------------------
// 🔽 funciones de creación de cada modelo
// ------------------------------
function crearNano(ancho, alto, fondo) {
  const group = new THREE.Group()
  const material = new THREE.MeshStandardMaterial({ color: colorSeleccionado })

  const cuerpo = new THREE.Mesh(new THREE.BoxGeometry(ancho, alto, fondo), material)
  group.add(cuerpo)

  // dos puertas frontales
  const puertaGeo = new THREE.BoxGeometry(ancho / 2 - 0.01, alto - 0.05, 0.02)
  const puerta1 = new THREE.Mesh(puertaGeo, new THREE.MeshStandardMaterial({ color: 'gray' }))
  puerta1.position.set(-ancho / 4, 0, fondo / 2 + 0.01)
  const puerta2 = puerta1.clone()
  puerta2.position.set(ancho / 4, 0, fondo / 2 + 0.01)

  group.add(puerta1, puerta2)
  return group
}

function crearGreg(ancho, alto, fondo) {
  const group = new THREE.Group()

  // --- Materiales ---
  const matCuerpo = new THREE.MeshStandardMaterial({ color: colorSeleccionado })
  const matMaderaNogal = new THREE.MeshStandardMaterial({ color: '#8b5e3c' })
  const matPuerta = new THREE.MeshStandardMaterial({ color: 'black' })
  const matCubierta = new THREE.MeshStandardMaterial({ color: '#222' })
  const matLavabo = new THREE.MeshStandardMaterial({ color: 'white' })
  const matPata = new THREE.MeshStandardMaterial({ color: '#cccccc', metalness: 0.8, roughness: 0.3 })

  // --- Medidas ---
  const anchoEstante = ancho * 0.35
  const anchoCuerpo = ancho * 0.65
  const grosor = 0.02
  const altoUtil = alto

  // --- Parte derecha (cuerpo cerrado) ---
  const cuerpo = new THREE.Mesh(new THREE.BoxGeometry(anchoCuerpo, altoUtil, fondo), matCuerpo)
  cuerpo.position.set(ancho * 0.175, 0, 0)
  group.add(cuerpo)

  // --- Estantes izquierdos (dos huecos abiertos con marcos) ---

  // Marco lateral izquierdo
  const marcoIzq = new THREE.Mesh(new THREE.BoxGeometry(grosor, altoUtil, fondo), matMaderaNogal)
  marcoIzq.position.set(-ancho/2 + grosor/2, 0, 0)
  group.add(marcoIzq)

  // Marco central (separa estantes del cuerpo derecho)
  const marcoCentro = new THREE.Mesh(new THREE.BoxGeometry(grosor, altoUtil, fondo), matMaderaNogal)
  marcoCentro.position.set(-ancho/2 + anchoEstante - grosor/2, 0, 0)
  group.add(marcoCentro)

  // Base inferior
  const baseInf = new THREE.Mesh(new THREE.BoxGeometry(anchoEstante, grosor, fondo), matMaderaNogal)
  baseInf.position.set(-ancho/2 + anchoEstante/2, -altoUtil/2 + grosor/2, 0)
  group.add(baseInf)

  // Cubierta superior
  const baseSup = baseInf.clone()
  baseSup.position.y = altoUtil/2 - grosor/2
  group.add(baseSup)

  // Estante intermedio
  const estanteMedio = baseInf.clone()
  estanteMedio.position.y = 0
  group.add(estanteMedio)

  // --- Puerta derecha ---
  const puertaGeo = new THREE.BoxGeometry(anchoCuerpo - 0.02, altoUtil - 0.02, grosor)
  const puerta = new THREE.Mesh(puertaGeo, matPuerta)
  puerta.position.set(ancho * 0.175, 0, fondo/2 + grosor/2)
  group.add(puerta)

  // --- Cubierta superior completa ---
  const cubierta = new THREE.Mesh(new THREE.BoxGeometry(ancho + 0.02, 0.03, fondo + 0.02), matCubierta)
  cubierta.position.set(0, alto/2 + 0.02, 0)
  group.add(cubierta)

  // --- Lavabo (alineado a la derecha, sobre la puerta) ---
  const lavabo = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.12, 32, 1, true), matLavabo)
  lavabo.position.set(ancho * 0.175, alto/2 + 0.1, 0) // centrado en la puerta
  group.add(lavabo)

  // --- Patas metálicas ---
  const pataGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.08, 16)
  const posicionesPatas = [
    [-ancho/2 + 0.05, -alto/2 - 0.04, fondo/2 - 0.05],
    [ancho/2 - 0.05, -alto/2 - 0.04, fondo/2 - 0.05],
    [-ancho/2 + 0.05, -alto/2 - 0.04, -fondo/2 + 0.05],
    [ancho/2 - 0.05, -alto/2 - 0.04, -fondo/2 + 0.05],
  ]

  posicionesPatas.forEach(pos => {
    const pata = new THREE.Mesh(pataGeo, matPata)
    pata.position.set(...pos)
    group.add(pata)
  })

  return group
}


function crearBoris(ancho, alto, fondo) {
  const group = new THREE.Group()
  const material = new THREE.MeshStandardMaterial({ color: colorSeleccionado })

  const cuerpo = new THREE.Mesh(new THREE.BoxGeometry(ancho, alto, fondo), material)
  group.add(cuerpo)

  // 2 puertas pequeñas
  const puertaGeo = new THREE.BoxGeometry(ancho / 2 - 0.01, alto / 2, 0.02)
  const puerta1 = new THREE.Mesh(puertaGeo, new THREE.MeshStandardMaterial({ color: 'gray' }))
  puerta1.position.set(-ancho / 4, -alto / 4, fondo / 2 + 0.01)
  const puerta2 = puerta1.clone()
  puerta2.position.set(ancho / 4, -alto / 4, fondo / 2 + 0.01)

  // 1 cajón arriba
  const cajon = new THREE.Mesh(new THREE.BoxGeometry(ancho - 0.05, alto / 4, 0.02), new THREE.MeshStandardMaterial({ color: 'black' }))
  cajon.position.set(0, alto / 3, fondo / 2 + 0.01)

  group.add(puerta1, puerta2, cajon)
  return group
}
function crearLia(ancho, alto, fondo, color = '#ffffff') {
  const group = new THREE.Group()

  // --- Materiales ---
  const matCuerpo = new THREE.MeshStandardMaterial({ color }) 
  const matPuerta = new THREE.MeshStandardMaterial({ color })
  const matTarja = new THREE.MeshStandardMaterial({ color: '#e0e0e0' }) 
  const matGrifo = new THREE.MeshStandardMaterial({ color: '#cccccc', metalness: 1, roughness: 0.2 })
  const matPata = new THREE.MeshStandardMaterial({ color: '#bbbbbb', metalness: 0.9, roughness: 0.3 })

  const grosor = 0.018

  // --- Cuerpo general ---
  const cuerpoGeo = new THREE.BoxGeometry(ancho, alto, fondo)
  const cuerpo = new THREE.Mesh(cuerpoGeo, matCuerpo)
  group.add(cuerpo)

  // --- Hueco inferior con estante y fondo trasero ---
  const altoHueco = alto * 0.22
  const estanteGeo = new THREE.BoxGeometry(ancho - grosor, grosor, fondo - grosor)
  const estante = new THREE.Mesh(estanteGeo, matCuerpo)
  estante.position.set(0, -alto/2 + altoHueco, 0)
  group.add(estante)

  const paredTrasera = new THREE.Mesh(
    new THREE.BoxGeometry(ancho - grosor, altoHueco, grosor),
    matCuerpo
  )
  paredTrasera.position.set(0, -alto/2 + altoHueco/2, -fondo/2 + grosor/2)
  group.add(paredTrasera)

  // --- Franja superior (delgada, entre tarja y puertas) ---
  const franjaGeo = new THREE.BoxGeometry(ancho, 0.04, grosor)
  const franja = new THREE.Mesh(franjaGeo, matCuerpo)
  franja.position.set(0, alto/2 - 0.06, fondo/2 + grosor/2)
  group.add(franja)

  // --- Puertas (2, sobresalientes ligeramente) ---
  const puertaAncho = (ancho - 0.04) / 2
  const puertaAlto = alto * 0.55
  const puertaGeo = new THREE.BoxGeometry(puertaAncho, puertaAlto, grosor)

  const offsetPuertasY = 0
  const offsetFrontal = grosor / 2 + 0.015

  const puertaIzq = new THREE.Mesh(puertaGeo, matPuerta)
  puertaIzq.position.set(-puertaAncho/2 - 0.01, offsetPuertasY, fondo/2 + offsetFrontal)
  group.add(puertaIzq)

  const puertaDer = new THREE.Mesh(puertaGeo, matPuerta)
  puertaDer.position.set(puertaAncho/2 + 0.01, offsetPuertasY, fondo/2 + offsetFrontal)
  group.add(puertaDer)

  // --- Tarja plana (sobresale un poco) ---
  const tarjaGeo = new THREE.BoxGeometry(ancho, 0.05, fondo)
  const tarja = new THREE.Mesh(tarjaGeo, matTarja)
  tarja.position.set(0, alto/2 + 0.025, 0)
  group.add(tarja)

  // --- Grifo metálico (más atrás) ---
  const baseGrifo = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12, 16), matGrifo)
  baseGrifo.position.set(0, alto/2 + 0.1, -fondo/2 + 0.08) // pegado hacia atrás
  group.add(baseGrifo)

  const tuboGrifo = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.18, 16), matGrifo)
  tuboGrifo.rotation.x = Math.PI / 2
  tuboGrifo.position.set(0, alto/2 + 0.18, -fondo/2 + 0.17)
  group.add(tuboGrifo)

  // --- Patas metálicas ---
  const pataGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.08, 16)
  const posicionesPatas = [
    [-ancho/2 + 0.05, -alto/2 - 0.04, fondo/2 - 0.05],
    [ancho/2 - 0.05, -alto/2 - 0.04, fondo/2 - 0.05],
    [-ancho/2 + 0.05, -alto/2 - 0.04, -fondo/2 + 0.05],
    [ancho/2 - 0.05, -alto/2 - 0.04, -fondo/2 + 0.05],
  ]

  posicionesPatas.forEach(pos => {
    const pata = new THREE.Mesh(pataGeo, matPata)
    pata.position.set(...pos)
    group.add(pata)
  })

  return group
}




function crearReni(ancho, alto, fondo) {
  const group = new THREE.Group()
  const material = new THREE.MeshStandardMaterial({ color: colorSeleccionado })

  const cuerpo = new THREE.Mesh(new THREE.BoxGeometry(ancho, alto, fondo), material)
  group.add(cuerpo)

  // 2 puertas a la izquierda
  const puerta = new THREE.Mesh(new THREE.BoxGeometry(ancho / 2 - 0.01, alto - 0.05, 0.02), new THREE.MeshStandardMaterial({ color: 'gray' }))
  puerta.position.set(-ancho / 4, 0, fondo / 2 + 0.01)

  // 4 cajones a la derecha
  for (let i = 0; i < 4; i++) {
    const cajon = new THREE.Mesh(new THREE.BoxGeometry(ancho / 2 - 0.01, alto / 5, 0.02), new THREE.MeshStandardMaterial({ color: 'black' }))
    cajon.position.set(ancho / 4, alto / 2 - (i + 1) * (alto / 5), fondo / 2 + 0.01)
    group.add(cajon)
  }

  group.add(puerta)
  return group
}

function crearDany(ancho, alto, fondo) {
  const group = new THREE.Group()
  const material = new THREE.MeshStandardMaterial({ color: colorSeleccionado })

  const cuerpo = new THREE.Mesh(new THREE.BoxGeometry(ancho, alto, fondo), material)
  group.add(cuerpo)

  // 3 cajones
  for (let i = 0; i < 3; i++) {
    const cajon = new THREE.Mesh(new THREE.BoxGeometry(ancho - 0.05, alto / 4, 0.02), new THREE.MeshStandardMaterial({ color: 'black' }))
    cajon.position.set(0, alto / 3 - i * (alto / 3), fondo / 2 + 0.01)
    group.add(cajon)
  }

  return group
}

function crearMueble(muebleData) {
  const { ancho, alto, fondo, nombre } = muebleData
  if (nombre === 'Nano') return crearNano(ancho, alto, fondo)
  if (nombre === 'Greg') return crearGreg(ancho, alto, fondo)
  if (nombre === 'Boris') return crearBoris(ancho, alto, fondo)
  if (nombre === 'Lia') return crearLia(ancho, alto, fondo)
  if (nombre === 'Reni') return crearReni(ancho, alto, fondo)
  if (nombre === 'Dany') return crearDany(ancho, alto, fondo)
  return new THREE.Group()
}

// ------------------------------
// Render
// ------------------------------
function renderMueble() {
  if (muebleActual) scene.remove(muebleActual)
  muebleActual = crearMueble(tipoSeleccionado)
  scene.add(muebleActual)
}

onMounted(() => {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0f0f0)

const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.set(0, 1, 2); // altura 1m, distancia 2m
camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ canvas: canvas.value, antialias: true })
  renderer.setSize(window.innerWidth - 200, window.innerHeight)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(5, 5, 5)
  scene.add(light)
  scene.add(new THREE.AmbientLight(0xffffff, 0.5))

  window.addEventListener('resize', () => {
    camera.aspect = (window.innerWidth - 200) / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth - 200, window.innerHeight)
  })

  renderMueble()

  function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()
})
</script>

<style>
body, html, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: sans-serif;
}
.sidebar {
  width: 200px;
  background: #f8f8f8;
  padding: 10px;
  box-sizing: border-box;
  border-right: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.sidebar label, select {
  display: flex;
  flex-direction: column;
  font-size: 14px;
}
button {
  padding: 5px;
  cursor: pointer;
}
.color-selector {
  display: flex;
  gap: 5px;
  margin: 5px 0;
}
.color-btn {
  width: 20px;
  height: 20px;
  border: 1px solid #333;
  cursor: pointer;
}
</style>