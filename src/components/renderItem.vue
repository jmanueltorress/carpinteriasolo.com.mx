<template>
  <div class="app">
    <!-- Modal -->
    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal">
        <form @submit.prevent="handleSubmit" class="form">
          <fieldset>
            <legend>Personaliza tu mueble 3D</legend>

            <label class="form-group">
              <span>Tipo de mueble:</span>
              <select v-model="form.tipo" required>
                <option value="banio">🛁 Mueble de baño</option>
                <option value="estante">📚 Estante</option>
                <option value="cocina">🍳 Cocina integral</option>
              </select>
            </label>

            <label class="form-group">
              <span>Ancho (cm):</span>
              <input type="number" v-model.number="form.ancho" min="10" required />
            </label>

            <label class="form-group">
              <span>Alto (cm):</span>
              <input type="number" v-model.number="form.alto" min="10" required />
            </label>

            <label class="form-group">
              <span>Profundidad (cm):</span>
              <input type="number" v-model.number="form.profundidad" min="10" required />
            </label>

            <!-- Selección de color con preview -->
        <label class="form-group color-select">
  <span>Color:</span>
  <select v-model="form.color" required>
    <option value="nogal">Nogal</option>
    <option value="polar">Polar</option>
    <option value="rivera">Rivera Roble Cocoa</option>
    <option value="noruego">Noruego</option>
    <option value="tundra">Tundra</option>
  </select>
  <div class="color-preview" :style="{ backgroundColor: woodColors[form.color] }"></div>
</label>


            <button type="submit" class="btn-primary">Generar mueble</button>
          </fieldset>
        </form>
      </div>
    </div>

    <!-- Botón para reabrir modal -->
    <div v-if="!showModal" class="controls-container">
      <button class="btn-secondary" @click="showModal = true">Volver a generar</button>
    </div>

    <!-- Canvas 3D -->
    <div class="viewer">
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const showModal = ref(true)
const canvas = ref(null)

const woodColors = {
  nogal: '#5C3A21',       // Nogal oscuro marrón
  polar: '#D9D1C7',       // Polar, beige claro
  rivera: '#7E5E3A',      // Rivera Roble Cocoa, marrón medio
  noruego: '#A1836B',     // Noruego, marrón claro tostado
  tundra: '#9C8F82',      // Tundra, gris-marrón pálido
}

const form = reactive({
  tipo: 'banio',
  ancho: 100,
  alto: 80,
  profundidad: 50,
  color: 'nogal',
})

let scene, camera, renderer, controls, muebleGroup, animationId

function initScene() {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 3)

  renderer = new THREE.WebGLRenderer({ canvas: canvas.value, antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.update()

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
  directionalLight.position.set(5, 10, 7)
  scene.add(directionalLight)

  window.addEventListener('resize', onResize)
  animate()
}

function generateModel() {
  if (muebleGroup) {
    scene.remove(muebleGroup)
    muebleGroup.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose())
        else obj.material.dispose()
      }
    })
  }

  muebleGroup = new THREE.Group()

  const w = form.ancho / 100
  const h = form.alto / 100
  const d = form.profundidad / 100

  const material = new THREE.MeshStandardMaterial({
    color: woodColors[form.color],
    roughness: 0.6,
    metalness: 0.2,
  })

  if (form.tipo === 'banio') {
    const boxGeo = new THREE.BoxGeometry(w, h * 0.8, d)
    const boxMesh = new THREE.Mesh(boxGeo, material)
    boxMesh.position.y = h * 0.1
    muebleGroup.add(boxMesh)

    const legGeo = new THREE.BoxGeometry(0.02, h * 0.2, 0.02)
    const legPositions = [
      [-w / 2 + 0.03, -h / 2 + 0.1, -d / 2 + 0.03],
      [w / 2 - 0.03, -h / 2 + 0.1, -d / 2 + 0.03],
      [-w / 2 + 0.03, -h / 2 + 0.1, d / 2 - 0.03],
      [w / 2 - 0.03, -h / 2 + 0.1, d / 2 - 0.03],
    ]
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, material)
      leg.position.set(x, y, z)
      muebleGroup.add(leg)
    })
  } else if (form.tipo === 'estante') {
    const baseGeo = new THREE.BoxGeometry(w, 0.02, d)
    const baseMesh = new THREE.Mesh(baseGeo, material)
    baseMesh.position.y = -h / 2
    muebleGroup.add(baseMesh)

    const sideGeo = new THREE.BoxGeometry(0.02, h, d)
    const sideLeft = new THREE.Mesh(sideGeo, material)
    sideLeft.position.set(-w / 2 + 0.01, 0, 0)
    muebleGroup.add(sideLeft)
    const sideRight = new THREE.Mesh(sideGeo, material)
    sideRight.position.set(w / 2 - 0.01, 0, 0)
    muebleGroup.add(sideRight)

    const shelfCount = Math.max(2, Math.floor(h / 0.3))
    const shelfGeo = new THREE.BoxGeometry(w - 0.04, 0.02, d)
    for (let i = 1; i <= shelfCount; i++) {
      const shelf = new THREE.Mesh(shelfGeo, material)
      shelf.position.y = -h / 2 + (i * h) / (shelfCount + 1)
      muebleGroup.add(shelf)
    }
  } else if (form.tipo === 'cocina') {
    const modules = 3
    const moduleW = w / modules
    const moduleGeo = new THREE.BoxGeometry(moduleW - 0.02, h, d)
    for (let i = 0; i < modules; i++) {
      const moduleMesh = new THREE.Mesh(moduleGeo, material)
      moduleMesh.position.x = -w / 2 + moduleW / 2 + i * moduleW
      muebleGroup.add(moduleMesh)
    }
  }

  // Añadir grupo y ajustar cámara
  scene.add(muebleGroup)

  const maxDim = Math.max(w, h, d)
  camera.position.set(0, 0, maxDim * 2)
  controls.target.set(0, 0, 0)
  controls.update()
}

function animate() {
  animationId = requestAnimationFrame(animate)
  if (muebleGroup) muebleGroup.rotation.y += 0.005
  controls.update()
  renderer.render(scene, camera)
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function handleSubmit() {
  generateModel()
  showModal.value = false
}

function closeModal() {
  showModal.value = false
}

onMounted(() => {
  initScene()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  cancelAnimationFrame(animationId)
  if (renderer) renderer.dispose()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: #f5f5f5;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 320px;
  max-width: 90vw;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

fieldset {
  border: none;
  padding: 0;
  margin: 0;
}

legend {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  font-weight: 600;
  font-size: 0.95rem;
}

.form-group select,
.form-group input {
  margin-top: 0.3rem;
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  border: 1.5px solid #ccc;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group select:focus,
.form-group input:focus {
  outline: none;
  border-color: #7a5700;
}

.color-select {
  flex-direction: row;
  align-items: center;
  gap: 0.7rem;
}

.color-select > span {
  min-width: 60px;
}

.color-select select {
  flex: 1;
}

.color-preview {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  border: 1.5px solid #ccc;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
  transition: background-color 0.3s ease;
}

.btn-primary,
.btn-secondary {
  cursor: pointer;
  padding: 0.6rem 1.2rem;
  font-weight: 700;
  border-radius: 6px;
  border: none;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  user-select: none;
}

.btn-primary {
  background-color: #7a5700;
  color: white;
  margin-top: 1rem;
}

.btn-primary:hover {
  background-color: #7a5700;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #444;
  margin: 1rem auto;
  display: block;
  width: fit-content;
}

.btn-secondary:hover {
  background-color: #dcdcdc;
}

.controls-container {
  padding: 1rem;
  text-align: center;
  background: white;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
}

.viewer {
  flex-grow: 1;
  background: #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
}

canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}

</style>