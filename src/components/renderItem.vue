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

// Lista de muebles
const tiposMuebles = reactive([
  { nombre: 'Mueble Bajo de Cocina', ancho: 1.2, alto: 0.9, fondo: 0.6, puertas: 2, cajones: 1, estandar: false },
  { nombre: 'Armario Alto', ancho: 1.2, alto: 2.2, fondo: 0.6, puertas: 2, cajones: 0, estandar: false },
  { nombre: 'Mueble de Baño', ancho: 0.8, alto: 0.8, fondo: 0.5, puertas: 2, cajones: 1, estandar: false },
  { nombre: 'Mueble TV', ancho: 1.5, alto: 0.6, fondo: 0.5, puertas: 2, cajones: 2, estandar: false },
  { nombre: 'Cocina Integral', ancho: 3.0, alto: 2.2, fondo: 0.6, puertas: 6, cajones: 4, estandar: false },
  { nombre: 'Estante Abierto', ancho: 1.2, alto: 2.0, fondo: 0.3, puertas: 0, cajones: 0, estandar: false },
  { nombre: 'Alacena', ancho: 1.5, alto: 2.0, fondo: 0.5, puertas: 4, cajones: 0, estandar: false },

  // 🚿 Modelos de baño bloqueados (Nano, Geg, Boris)
  { nombre: 'Nano', ancho: 0.6, alto: 0.85, fondo: 0.45, puertas: 2, cajones: 0, estandar: true },
  { nombre: 'Greg', ancho: 0.8, alto: 0.85, fondo: 0.45, puertas: 1, cajones: 1, estandar: true },
  { nombre: 'Boris', ancho: 0.46, alto: 0.85, fondo: 0.40, puertas: 4, cajones: 2, estandar: true },
  { nombre: 'Lia', ancho: 0.64, alto: 0.85, fondo: 0.45, puertas: 2, cajones: 0, estandar: true },
  { nombre: 'Reni', ancho: 0.90, alto: 0.85, fondo: 0.45, puertas: 2, cajones: 4, estandar: true },
  { nombre: 'Dany', ancho: 0.63, alto: 0.82, fondo: 0.45, puertas: 0, cajones: 3, estandar: true },
])

let tipoSeleccionado = tiposMuebles[0]
let scene, camera, renderer, controls, muebleActual

// 🎨 Colores disponibles
const colores = ['white', '#fef08a', '#bbf7d0', '#bfdbfe', '#fca5a5']
let colorSeleccionado = 'white'

// Crear mueble
function crearMueble(muebleData) {
  const { ancho, alto, fondo, puertas, cajones, nombre } = muebleData
  const mueble = new THREE.Group()

  // Diseños específicos según el modelo
  if (nombre === 'Nano') {
    return crearNano(ancho, alto, fondo)
  } else if (nombre === 'Greg') {
    return crearGreg(ancho, alto, fondo)
  } else if (nombre === 'Boris') {
    return crearBoris(ancho, alto, fondo)
  } else if (nombre === 'Lia') {
    return crearLia(ancho, alto, fondo)
  } else if (nombre === 'Reni') {
    return crearReni(ancho, alto, fondo)
  } else if (nombre === 'Dany') {
    return crearDany(ancho, alto, fondo)
  }

  // Diseño genérico para otros muebles
  const cuerpoGeo = new THREE.BoxGeometry(ancho, alto, fondo)
  const cuerpoMat = new THREE.MeshStandardMaterial({ color: colorSeleccionado })
  const cuerpo = new THREE.Mesh(cuerpoGeo, cuerpoMat)
  mueble.add(cuerpo)

  // Puertas genéricas
  if (puertas > 0) {
    const puertaAncho = (ancho - 0.02 * (puertas + 1)) / puertas
    const puertaAlto = alto - 0.1
    for (let i = 0; i < puertas; i++) {
      const puertaGeo = new THREE.BoxGeometry(puertaAncho, puertaAlto, 0.02)
      const puertaMat = new THREE.MeshStandardMaterial({ color: 0xdedede })
      const puerta = new THREE.Mesh(puertaGeo, puertaMat)
      puerta.position.set(-ancho / 2 + puertaAncho / 2 + (puertaAncho + 0.02) * i + 0.02, 0, fondo / 2 + 0.011)

      const bordeGeo = new THREE.EdgesGeometry(puertaGeo)
      const bordeMat = new THREE.LineBasicMaterial({ color: 0x333333 })
      const borde = new THREE.LineSegments(bordeGeo, bordeMat)
      puerta.add(borde)

      mueble.add(puerta)
    }
  }

  // Cajones genéricos
  if (cajones > 0) {
    const cajonAncho = ancho - 0.04
    const cajonAlto = 0.25
    for (let i = 0; i < cajones; i++) {
      const cajonGeo = new THREE.BoxGeometry(cajonAncho, cajonAlto, 0.02)
      const cajonMat = new THREE.MeshStandardMaterial({ color: 0xb0b0b0 })
      const cajon = new THREE.Mesh(cajonGeo, cajonMat)
      cajon.position.set(0, -alto / 2 + cajonAlto / 2 + (cajonAlto + 0.02) * i + 0.05, fondo / 2 + 0.011)

      const bordeGeo = new THREE.EdgesGeometry(cajonGeo)
      const bordeMat = new THREE.LineBasicMaterial({ color: 0x333333 })
      const borde = new THREE.LineSegments(bordeGeo, bordeMat)
      cajon.add(borde)

      mueble.add(cajon)
    }
  }

  return mueble
}

// Modelo NANO - mueble blanco con 2 puertas y 1 cajón inferior
function crearNano(ancho, alto, fondo) {
  const mueble = new THREE.Group()
  
  // Cuerpo principal
  const cuerpoGeo = new THREE.BoxGeometry(ancho, alto, fondo)
  const cuerpoMat = new THREE.MeshStandardMaterial({ 
    color: colorSeleccionado,
    roughness: 0.8,
    metalness: 0.1
  })
  const cuerpo = new THREE.Mesh(cuerpoGeo, cuerpoMat)
  mueble.add(cuerpo)

  // Encimera blanca
  const encimeraGeo = new THREE.BoxGeometry(ancho + 0.02, 0.04, fondo + 0.02)
  const encimeramat = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.1
  })
  const encimera = new THREE.Mesh(encimeraGeo, encimeramat)
  encimera.position.set(0, alto/2 + 0.02, 0)
  mueble.add(encimera)

  // Lavabo sobre encimera
  const lavaboGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.06, 16)
  const lavaboMat = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.05
  })
  const lavabo = new THREE.Mesh(lavaboGeo, lavaboMat)
  lavabo.position.set(0, alto/2 + 0.07, 0)
  mueble.add(lavabo)

  // 2 puertas principales
  const puertaAncho = (ancho - 0.02) / 2
  const puertaAlto = alto * 0.7
  
  const puertaGeo = new THREE.BoxGeometry(puertaAncho, puertaAlto, 0.02)
  const puertaMat = new THREE.MeshStandardMaterial({ 
    color: colorSeleccionado,
    roughness: 0.8,
    metalness: 0.1
  })
  
  const puerta1 = new THREE.Mesh(puertaGeo, puertaMat)
  puerta1.position.set(-ancho/4, alto * 0.1, fondo/2 + 0.011)
  mueble.add(puerta1)

  const puerta2 = new THREE.Mesh(puertaGeo, puertaMat)
  puerta2.position.set(ancho/4, alto * 0.1, fondo/2 + 0.011)
  mueble.add(puerta2)

  // 1 cajón en la parte inferior
  const cajonGeo = new THREE.BoxGeometry(ancho - 0.03, 0.18, 0.02)
  const cajonMat = new THREE.MeshStandardMaterial({ 
    color: colorSeleccionado,
    roughness: 0.8,
    metalness: 0.1
  })
  const cajon = new THREE.Mesh(cajonGeo, cajonMat)
  cajon.position.set(0, -alto/2 + 0.12, fondo/2 + 0.011)
  mueble.add(cajon)

  return mueble
}

// Modelo GREG - mueble con lateral abierto, 1 puerta y 1 cajón
function crearGreg(ancho, alto, fondo) {
  const mueble = new THREE.Group()
  
  // Cuerpo principal
  const cuerpoGeo = new THREE.BoxGeometry(ancho, alto, fondo)
  const cuerpoMat = new THREE.MeshStandardMaterial({ 
    color: colorSeleccionado,
    roughness: 0.8,
    metalness: 0.1
  })
  const cuerpo = new THREE.Mesh(cuerpoGeo, cuerpoMat)
  mueble.add(cuerpo)

  // Encimera extendida
  const encimeraGeo = new THREE.BoxGeometry(ancho + 0.15, 0.04, fondo + 0.02)
  const encimeramat = new THREE.MeshStandardMaterial({ 
    color: 0xdeb887,
    roughness: 0.7,
    metalness: 0.1
  })
  const encimera = new THREE.Mesh(encimeraGeo, encimeramat)
  encimera.position.set(0.075, alto/2 + 0.02, 0)
  mueble.add(encimera)

  // Lavabo beige
  const lavaboGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.05, 16)
  const lavaboMat = new THREE.MeshStandardMaterial({ 
    color: 0xe8dcc0,
    roughness: 0.2,
    metalness: 0.05
  })
  const lavabo = new THREE.Mesh(lavaboGeo, lavaboMat)
  lavabo.position.set(0, alto/2 + 0.065, 0)
  mueble.add(lavabo)

  // Lateral izquierdo abierto - solo estantes
  const estante1Geo = new THREE.BoxGeometry(0.15, 0.02, fondo - 0.02)
  const estanteMat = new THREE.MeshStandardMaterial({ 
    color: colorSeleccionado,
    roughness: 0.8,
    metalness: 0.1
  })
  const estante1 = new THREE.Mesh(estante1Geo, estanteMat)
  estante1.position.set(ancho/2 + 0.075, alto/4, 0)
  mueble.add(estante1)

  const estante2 = new THREE.Mesh(estante1Geo, estanteMat)
  estante2.position.set(ancho/2 + 0.075, -alto/4, 0)
  mueble.add(estante2)

  // 1 puerta en la parte derecha
  const puertaGeo = new THREE.BoxGeometry(ancho - 0.02, alto - 0.05, 0.02)
  const puertaMat = new THREE.MeshStandardMaterial({ 
    color: colorSeleccionado,
    roughness: 0.8,
    metalness: 0.1
  })
  const puerta = new THREE.Mesh(puertaGeo, puertaMat)
  puerta.position.set(0, 0, fondo/2 + 0.011)
  mueble.add(puerta)

  // 1 cajón inferior 
  const cajonGeo = new THREE.BoxGeometry(ancho - 0.04, 0.15, 0.02)
  const cajonMat = new THREE.MeshStandardMaterial({ 
    color: colorSeleccionado,
    roughness: 0.8,
    metalness: 0.1
  })
  const cajon = new THREE.Mesh(cajonGeo, cajonMat)
  cajon.position.set(0, -alto/2 + 0.1, fondo/2 + 0.011)
  mueble.add(cajon)

  return mueble
}

// Modelo BORIS - mueble muy estrecho con cajón superior y 2 puertas
function crearBoris(ancho, alto, fondo) {
  const mueble = new THREE.Group()
  
  // Cuerpo principal
  const cuerpoGeo = new THREE.BoxGeometry(ancho, alto, fondo)
  const cuerpoMat = new THREE.MeshStandardMaterial({ 
    color: colorSeleccionado,
    roughness: 0.8,
    metalness: 0.1
  })
  const cuerpo = new THREE.Mesh(cuerpoGeo, cuerpoMat)
  mueble.add(cuerpo)

  // Encimera blanca
  const encimeraGeo = new THREE.BoxGeometry(ancho + 0.02, 0.04, fondo + 0.02)
  const encimeramat = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.1
  })
  const encimera = new THREE.Mesh(encimeraGeo, encimeramat)
  encimera.position.set(0, alto/2 + 0.02, 0)
  mueble.add(encimera)

  // 1 cajón superior (como se ve en la imagen)
  const cajonSuperiorGeo = new THREE.BoxGeometry(ancho - 0.02, 0.15, 0.02)
  const cajonMat = new THREE.MeshStandardMaterial({ 
    color: colorSeleccionado,
    roughness: 0.8,
    metalness: 0.1
  })
  const cajon = new THREE.Mesh(cajonSuperiorGeo, cajonMat)
  cajon.position.set(0, alto/2 - 0.1, fondo/2 + 0.011)
  mueble.add(cajon)

  // 2 puertas principales (no 4 como puse antes)
  const puertaAncho = (ancho - 0.015) / 2
  const puertaAlto = alto * 0.6
  
  const puertaGeo = new THREE.BoxGeometry(puertaAncho, puertaAlto, 0.02)
  const puertaMat = new THREE.MeshStandardMaterial({ 
    color: colorSeleccionado,
    roughness: 0.8,
    metalness: 0.1
  })
  
  const puerta1 = new THREE.Mesh(puertaGeo, puertaMat)
  puerta1.position.set(-ancho/4, -alto/6, fondo/2 + 0.011)
  mueble.add(puerta1)

  const puerta2 = new THREE.Mesh(puertaGeo, puertaMat)
  puerta2.position.set(ancho/4, -alto/6, fondo/2 + 0.011)
  mueble.add(puerta2)

  return mueble
}

// Modelo LIA - mueble con 2 puertas superiores y área abierta inferior
function crearLia(ancho, alto, fondo) {
  const mueble = new THREE.Group()
  
  // Cuerpo principal
  const cuerpoGeo = new THREE.BoxGeometry(ancho, alto, fondo)
  const cuerpoMat = new THREE.MeshStandardMaterial({ 
    color: colorSeleccionado,
    roughness: 0.8,
    metalness: 0.1
  })
  const cuerpo = new THREE.Mesh(cuerpoGeo, cuerpoMat)
  mueble.add(cuerpo)

  // Encimera
  const encimeraGeo = new THREE.BoxGeometry(ancho + 0.02, 0.04, fondo + 0.02)
  const encimeramat = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.1
  })
  const encimera = new THREE.Mesh(encimeraGeo, encimeramat)
  encimera.position.set(0, alto/2 + 0.02, 0)
  mueble.add(encimera)

  // Lavabo
  const lavaboGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.06, 16)
  const lavaboMat = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.05
  })
  const lavabo = new THREE.Mesh(lavaboGeo, lavaboMat)
  lavabo.position.set(0, alto/2 + 0.07, 0)
  mueble.add(lavabo)

  // 2 puertas en la parte superior
  const puertaAncho = (ancho - 0.02) / 2
  const puertaAlto = alto * 0.5
  
  const puertaGeo = new THREE.BoxGeometry(puertaAncho, puertaAlto, 0.02)
  const puertaMat = new THREE.MeshStandardMaterial({ 
    color: colorSeleccionado,
    roughness: 0.8,
    metalness: 0.1
  })
  
  const puerta1 = new THREE.Mesh(puertaGeo, puertaMat)
  puerta1.position.set(-ancho/4, alto/8, fondo/2 + 0.011)
  mueble.add(puerta1)

  const puerta2 = new THREE.Mesh(puertaGeo, puertaMat)
  puerta2.position.set(ancho/4, alto/8, fondo/2 + 0.011)
  mueble.add(puerta2)

  // Estante en área abierta inferior
  const estanteGeo = new THREE.BoxGeometry(ancho - 0.04, 0.02, fondo - 0.02)
  const estanteMat = new THREE.MeshStandardMaterial({ 
    color: colorSeleccionado,
    roughness: 0.8,
    metalness: 0.1
  })
  const estante = new THREE.Mesh(estanteGeo, estanteMat)
  estante.position.set(0, -alto/3, 0)
  mueble.add(estante)

  return mueble
}

// Modelo RENI - con 2 puertas laterales y múltiples cajones centrales
function crearReni(ancho, alto, fondo) {
  const mueble = new THREE.Group()
  
  // Cuerpo principal
  const cuerpoGeo = new THREE.BoxGeometry(ancho, alto, fondo)
  const cuerpoMat = new THREE.MeshStandardMaterial({ 
    color: colorSeleccionado,
    roughness: 0.8,
    metalness: 0.1
  })
  const cuerpo = new THREE.Mesh(cuerpoGeo, cuerpoMat)
  mueble.add(cuerpo)

  // Encimera
  const encimeraGeo = new THREE.BoxGeometry(ancho + 0.02, 0.04, fondo + 0.02)
  const encimeramat = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.1
  })
  const encimera = new THREE.Mesh(encimeraGeo, encimeramat)
  encimera.position.set(0, alto/2 + 0.02, 0)
  mueble.add(encimera)

  // Lavabo
  const lavaboGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.06, 16)
  const lavaboMat = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.05
  })
  const lavabo = new THREE.Mesh(lavaboGeo, lavaboMat)
  lavabo.position.set(0, alto/2 + 0.07, 0)
  mueble.add(lavabo)

  // Puerta izquierda (abierta en la imagen mostrando interior)
  const puertaGeo = new THREE.BoxGeometry(ancho/3, alto * 0.7, 0.02)
  const puertaMat = new THREE.MeshStandardMaterial({ 
    color: colorSeleccionado,
    roughness: 0.8,
    metalness: 0.1
  })
  const puertaIzq = new THREE.Mesh(puertaGeo, puertaMat)
  puertaIzq.position.set(-ancho/2 + 0.05, -alto/8, fondo/2 + 0.011)
  puertaIzq.rotation.y = Math.PI/3 // Puerta abierta
  mueble.add(puertaIzq)

  // Puerta derecha
  const puertaDer = new THREE.Mesh(puertaGeo, puertaMat)
  puertaDer.position.set(ancho/2 - 0.05, -alto/8, fondo/2 + 0.011)
  mueble.add(puertaDer)

  // 4 cajones centrales apilados
  const cajonAncho = ancho/2
  const cajonAlto = 0.12
  const cajonGeo = new THREE.BoxGeometry(cajonAncho, cajonAlto, 0.02)
  const cajonMat = new THREE.MeshStandardMaterial({ 
    color: colorSeleccionado,
    roughness: 0.8,
    metalness: 0.1
  })

  for (let i = 0; i < 4; i++) {
    const cajon = new THREE.Mesh(cajonGeo, cajonMat)
    cajon.position.set(0, alto/2 - 0.2 - (i * 0.14), fondo/2 + 0.011)
    mueble.add(cajon)
  }

  return mueble
}

// Modelo DANY - solo 3 cajones apilados con tiradores horizontales
function crearDany(ancho, alto, fondo) {
  const mueble = new THREE.Group()
  
  // Cuerpo principal
  const cuerpoGeo = new THREE.BoxGeometry(ancho, alto, fondo)
  const cuerpoMat = new THREE.MeshStandardMaterial({ 
    color: colorSeleccionado,
    roughness: 0.8,
    metalness: 0.1
  })
  const cuerpo = new THREE.Mesh(cuerpoGeo, cuerpoMat)
  mueble.add(cuerpo)

  // Encimera
  const encimeraGeo = new THREE.BoxGeometry(ancho + 0.02, 0.04, fondo + 0.02)
  const encimeramat = new THREE.MeshStandardMaterial({ 
    color: 0xe8dcc0,
    roughness: 0.7,
    metalness: 0.1
  })
  const encimera = new THREE.Mesh(encimeraGeo, encimeramat)
  encimera.position.set(0, alto/2 + 0.02, 0)
  mueble.add(encimera)

  // Lavabo beige
  const lavaboGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.05, 16)
  const lavaboMat = new THREE.MeshStandardMaterial({ 
    color: 0xe8dcc0,
    roughness: 0.2,
    metalness: 0.05
  })
  const lavabo = new THREE.Mesh(lavaboGeo, lavaboMat)
  lavabo.position.set(0, alto/2 + 0.065, 0)
  mueble.add(lavabo)

  // 3 cajones apilados
  const cajonAncho = ancho - 0.04
  const cajonAlto = 0.18
  const cajonGeo = new THREE.BoxGeometry(cajonAncho, cajonAlto, 0.02)
  const cajonMat = new THREE.MeshStandardMaterial({ 
    color: colorSeleccionado,
    roughness: 0.8,
    metalness: 0.1
  })

  // Cajón superior
  const cajon1 = new THREE.Mesh(cajonGeo, cajonMat)
  cajon1.position.set(0, alto/2 - 0.15, fondo/2 + 0.011)
  mueble.add(cajon1)

  // Cajón medio
  const cajon2 = new THREE.Mesh(cajonGeo, cajonMat)
  cajon2.position.set(0, alto/2 - 0.35, fondo/2 + 0.011)
  mueble.add(cajon2)

  // Cajón inferior
  const cajon3 = new THREE.Mesh(cajonGeo, cajonMat)
  cajon3.position.set(0, -alto/2 + 0.12, fondo/2 + 0.011)
  mueble.add(cajon3)

  // Tiradores horizontales negros
  const tiradorGeo = new THREE.BoxGeometry(0.2, 0.015, 0.01)
  const tiradorMat = new THREE.MeshStandardMaterial({ 
    color: 0x333333,
    roughness: 0.3,
    metalness: 0.7
  })
  
  const tirador1 = new THREE.Mesh(tiradorGeo, tiradorMat)
  tirador1.position.set(0, alto/2 - 0.15, fondo/2 + 0.025)
  mueble.add(tirador1)

  const tirador2 = new THREE.Mesh(tiradorGeo, tiradorMat)
  tirador2.position.set(0, alto/2 - 0.35, fondo/2 + 0.025)
  mueble.add(tirador2)

  const tirador3 = new THREE.Mesh(tiradorGeo, tiradorMat)
  tirador3.position.set(0, -alto/2 + 0.12, fondo/2 + 0.025)
  mueble.add(tirador3)

  return mueble
}

// Render
function renderMueble() {
  if (muebleActual) scene.remove(muebleActual)
  muebleActual = crearMueble(tipoSeleccionado)
  scene.add(muebleActual)
}

// Montar escena
onMounted(() => {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0f0f0)

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(5, 3, 6)

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