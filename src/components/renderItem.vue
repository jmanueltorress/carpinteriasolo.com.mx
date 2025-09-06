<template>
  <div id="app" style="display: flex; height: 100vh;">
    <!-- Sidebar -->
    <div class="sidebar">
      <h3>Tipo de Mueble</h3>
      <select v-model="tipoSeleccionado">
        <option v-for="tipo in tiposMuebles" :key="tipo.nombre" :value="tipo">
          {{ tipo.nombre }}
        </option>
      </select>

      <h3>Personalizar</h3>

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
      </div>

      <!-- Mostrar medidas bloqueadas -->
      <div v-else>
        <p><b>Ancho:</b> {{ tipoSeleccionado.ancho }} m</p>
        <p><b>Alto:</b> {{ tipoSeleccionado.alto }} m</p>
        <p><b>Fondo:</b> {{ tipoSeleccionado.fondo }} m</p>
        <p><b>Puertas:</b> {{ tipoSeleccionado.puertas }}</p>
        <p><b>Cajones:</b> {{ tipoSeleccionado.cajones }}</p>
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
  { nombre: 'Nano', ancho: 0.6, alto: 0.85, fondo: 0.45, puertas: 2, cajones: 0, estandar: true },
  { nombre: 'Greg', ancho: 0.8, alto: 0.85, fondo: 0.45, puertas: 1, cajones: 1, estandar: true },
  { nombre: 'Boris', ancho: 0.46, alto: 0.85, fondo: 0.40, puertas: 2, cajones: 1, estandar: true },
  { nombre: 'Lia', ancho: 0.64, alto: 0.85, fondo: 0.45, puertas: 2, cajones: 0, estandar: true },
  { nombre: 'Reni', ancho: 0.90, alto: 0.85, fondo: 0.45, puertas: 2, cajones: 4, estandar: true },
  { nombre: 'Dany', ancho: 0.63, alto: 0.82, fondo: 0.45, puertas: 0, cajones: 3, estandar: true },
])

let tipoSeleccionado = tiposMuebles[0]
let scene, camera, renderer, controls, muebleActual

// 🎨 Colores disponibles
const colores = ['white', '#fef08a', '#bbf7d0', '#bfdbfe', '#fca5a5']
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
  const materialCuerpo = new THREE.MeshStandardMaterial({ color: colorSeleccionado })

  // --- Cuerpo principal ---
  const cuerpo = new THREE.Mesh(new THREE.BoxGeometry(ancho, alto, fondo), materialCuerpo)
  group.add(cuerpo)

  // --- Huecos laterales (3 compartimentos) ---
  const compartimentoAlto = alto / 3
  const huecoGeo = new THREE.BoxGeometry(ancho * 0.35, compartimentoAlto - 0.02, fondo * 0.95)

  for (let i = 0; i < 3; i++) {
    const hueco = new THREE.Mesh(huecoGeo, new THREE.MeshStandardMaterial({ color: '#d1c7b7' })) // tono claro para contraste
    hueco.position.set(-ancho / 2 + (ancho * 0.35) / 2 + 0.01, alto / 2 - compartimentoAlto / 2 - i * compartimentoAlto, 0)
    group.add(hueco)
  }

  // --- Puerta derecha ---
  const puertaGeo = new THREE.BoxGeometry(ancho * 0.6, alto - 0.05, 0.02)
  const puerta = new THREE.Mesh(puertaGeo, new THREE.MeshStandardMaterial({ color: 'black' }))
  puerta.position.set(ancho * 0.2, 0, fondo / 2 + 0.01)
  group.add(puerta)

  // --- Cubierta superior ---
  const cubierta = new THREE.Mesh(new THREE.BoxGeometry(ancho + 0.02, 0.03, fondo + 0.02), new THREE.MeshStandardMaterial({ color: '#222' }))
  cubierta.position.set(0, alto / 2 + 0.02, 0)
  group.add(cubierta)

  // --- Patas metálicas ---
  const pataGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.08, 16)
  const matPata = new THREE.MeshStandardMaterial({ color: '#ccc', metalness: 0.8, roughness: 0.3 })

  const posicionesPatas = [
    [-ancho / 2 + 0.05, -alto / 2 - 0.04, fondo / 2 - 0.05],
    [ancho / 2 - 0.05, -alto / 2 - 0.04, fondo / 2 - 0.05],
    [-ancho / 2 + 0.05, -alto / 2 - 0.04, -fondo / 2 + 0.05],
    [ancho / 2 - 0.05, -alto / 2 - 0.04, -fondo / 2 + 0.05],
  ]

  posicionesPatas.forEach(pos => {
    const pata = new THREE.Mesh(pataGeo, matPata)
    pata.position.set(...pos)
    group.add(pata)
  })

  // --- Lavabo opcional ---
  const lavabo = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.12, 32, 1, true), new THREE.MeshStandardMaterial({ color: 'white' }))
  lavabo.position.set(0, alto / 2 + 0.1, 0)
  group.add(lavabo)

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

function crearLia(ancho, alto, fondo) {
  const group = new THREE.Group();

  // --- Materiales ---
  const matCuerpo = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const matHueco = new THREE.MeshStandardMaterial({ color: 0xf0f0f0 });
  const matPuerta = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const matBorde = new THREE.MeshStandardMaterial({ color: 0x888888 });
  const matPata = new THREE.MeshStandardMaterial({ color: '#cccccc', metalness: 0.8, roughness: 0.3 });

  // --- Cuerpo principal ---
  const cuerpo = new THREE.Mesh(new THREE.BoxGeometry(ancho, alto, fondo), matCuerpo);
  group.add(cuerpo);

  // --- Hueco inferior visible ---
  function crearHuecoInferior(anchoHueco, altoHueco, fondo) {
    const grupo = new THREE.Group();
    const grosor = 0.02;

    // Base
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(anchoHueco, grosor, fondo - grosor),
      matHueco
    );
    base.position.set(0, 0, 0);
    grupo.add(base);

    // Lado izquierdo
    const ladoGeo = new THREE.BoxGeometry(grosor, altoHueco, fondo - grosor);
    const ladoIzq = new THREE.Mesh(ladoGeo, matHueco);
    ladoIzq.position.set(-anchoHueco / 2, altoHueco / 2, 0);
    grupo.add(ladoIzq);

    // Lado derecho
    const ladoDer = new THREE.Mesh(ladoGeo, matHueco);
    ladoDer.position.set(anchoHueco / 2, altoHueco / 2, 0);
    grupo.add(ladoDer);

    // Fondo (opcional: se puede dejar abierto para mayor realismo)
    const fondoMesh = new THREE.Mesh(
      new THREE.BoxGeometry(anchoHueco, altoHueco, grosor),
      matHueco
    );
    fondoMesh.position.set(0, altoHueco / 2, -fondo / 2 + grosor / 2 - 0.001);
    grupo.add(fondoMesh);

    return grupo;
  }

  const huecoInferior = crearHuecoInferior(0.54, 0.35, fondo);
  huecoInferior.position.set(0, -alto / 2 + 0.35 / 2 + 0.01, 0); // ligera elevación para z-fighting
  group.add(huecoInferior);

  // --- Puertas frontales ---
  const puertaAncho = ancho * 0.48;
  const puertaAlto = alto * 0.45;

  function crearPuerta(xPos) {
    const puerta = new THREE.Group();
    const panel = new THREE.Mesh(new THREE.BoxGeometry(puertaAncho, puertaAlto, 0.02), matPuerta);
    puerta.add(panel);

    // Bordes
    const bordeGeoV = new THREE.BoxGeometry(0.01, puertaAlto, 0.021);
    const bordeGeoH = new THREE.BoxGeometry(puertaAncho, 0.01, 0.021);

    const bordeIzq = new THREE.Mesh(bordeGeoV, matBorde);
    bordeIzq.position.set(-puertaAncho / 2, 0, 0.001);
    puerta.add(bordeIzq);

    const bordeDer = bordeIzq.clone();
    bordeDer.position.set(puertaAncho / 2, 0, 0.001);
    puerta.add(bordeDer);

    const bordeSup = new THREE.Mesh(bordeGeoH, matBorde);
    bordeSup.position.set(0, puertaAlto / 2, 0.001);
    puerta.add(bordeSup);

    const bordeInf = bordeSup.clone();
    bordeInf.position.set(0, -puertaAlto / 2, 0.001);
    puerta.add(bordeInf);

    puerta.position.set(xPos, 0, fondo / 2 + 0.011);
    return puerta;
  }

  const puertaIzq = crearPuerta(-puertaAncho / 2 - 0.01);
  const puertaDer = crearPuerta(puertaAncho / 2 + 0.01);
  group.add(puertaIzq, puertaDer);

  // --- Cubierta superior ---
  const cubierta = new THREE.Mesh(
    new THREE.BoxGeometry(ancho + 0.02, 0.04, fondo + 0.02),
    matCuerpo
  );
  cubierta.position.set(0, alto / 2 + 0.02, 0);
  group.add(cubierta);

  // --- Lavabo ---
  const lavabo = new THREE.Mesh(
    new THREE.CylinderGeometry(0.20, 0.20, 0.1, 32),
    matCuerpo
  );
  lavabo.position.set(0, alto / 2 + 0.08, 0);
  group.add(lavabo);

  // --- Grifo ---
  const grifoBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.12, 16),
    new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.3 })
  );
  grifoBase.position.set(0, alto / 2 + 0.14, -0.05);
  group.add(grifoBase);

  const grifoCuello = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.08, 16),
    new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.3 })
  );
  grifoCuello.rotation.x = Math.PI / 2;
  grifoCuello.position.set(0, alto / 2 + 0.14, 0.02);
  group.add(grifoCuello);

  // --- Patas metálicas ---
  const pataGeo = new THREE.CylinderGeometry(0.03, 0.035, 0.12, 16);
  const posicionesPatas = [
    [-ancho / 2 + 0.05, -alto / 2 - 0.06, fondo / 2 - 0.05],
    [ancho / 2 - 0.05, -alto / 2 - 0.06, fondo / 2 - 0.05],
    [-ancho / 2 + 0.05, -alto / 2 - 0.06, -fondo / 2 + 0.05],
    [ancho / 2 - 0.05, -alto / 2 - 0.06, -fondo / 2 + 0.05],
  ];

  posicionesPatas.forEach(pos => {
    const pata = new THREE.Mesh(pataGeo, matPata);
    pata.position.set(...pos);
    group.add(pata);
  });

  return group;
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
