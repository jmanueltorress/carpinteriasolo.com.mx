<template>
  <div id="app" style="display: flex; height: 100vh;">
    <div class="sidebar">
      <h3>Muebles de baño</h3>
      <select v-model="tipoSeleccionado" @change="renderMueble">
        <option v-for="tipo in tiposMuebles" :key="tipo.nombre" :value="tipo">
          {{ tipo.nombre }}
        </option>
      </select>

      <h3>Dimensiones</h3>

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

      <div v-else>
        <p><b>Ancho:</b> {{ tipoSeleccionado.ancho }} m</p>
        <p><b>Alto:</b> {{ tipoSeleccionado.alto }} m</p>
        <p><b>Fondo:</b> {{ tipoSeleccionado.fondo }} m</p>
        <p><b>Puertas:</b> {{ tipoSeleccionado.puertas }}</p>
        <p><b>Cajones:</b> {{ tipoSeleccionado.cajones }}</p>
        <p><b>Estantes:</b> {{ tipoSeleccionado.estantes }}</p>
      </div>

      <h3>Color</h3>
      <div class="color-selector">
        <button
          v-for="c in colores"
          :key="c"
          :style="{ background: c, border: c === colorSeleccionado ? '3px solid #007BFF' : '1px solid #333' }"
          class="color-btn"
          @click="colorSeleccionado = c; renderMueble()"
        ></button>
      </div>

      <button @click="renderMueble">Aplicar Cambios</button>
    </div>

    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { onMounted, ref, reactive } from 'vue'

const canvas = ref(null)

// --- Muebles con dimensiones iniciales ---
// Se mantiene como reactive para contener la lista de objetos
const tiposMuebles = reactive([
  { nombre: 'Nano', ancho: 0.6, alto: 0.85, fondo: 0.45, puertas: 2, cajones: 0, estandar: true, estantes: 1 },
  { nombre: 'Greg', ancho: 0.8, alto: 0.85, fondo: 0.45, puertas: 1, cajones: 0, estandar: true, estantes: 2 },
  { nombre: 'Boris', ancho: 0.60, alto: 0.85, fondo: 0.45, puertas: 1, cajones: 1, estandar: true, estantes: 1 },
  { nombre: 'Lia', ancho: 0.64, alto: 0.85, fondo: 0.45, puertas: 2, cajones: 0, estandar: true, estantes: 1 },
  { nombre: 'Reni', ancho: 0.90, alto: 0.85, fondo: 0.45, puertas: 2, cajones: 4, estandar: true, estantes: 1 },
  { nombre: 'Dany', ancho: 0.63, alto: 0.82, fondo: 0.45, puertas: 0, cajones: 3, estandar: true, estantes: 1 },
])

// 💡 CORRECCIÓN CRUCIAL: Usamos ref() para que Vue rastree el objeto seleccionado
const tipoSeleccionado = ref(tiposMuebles.find(t => t.nombre === 'Boris'))

// Variables globales para Three.js
let scene, camera, renderer, controls, muebleActual

// 🎨 Colores disponibles
const colores = ['#654321', 'white', 'black']
// 💡 CORRECCIÓN CRUCIAL: Usamos ref() para rastrear el color y enlazarlo al HTML
const colorSeleccionado = ref('#654321') // Iniciamos en café

// --- Materiales de Uso Común ---
const matGrifo = new THREE.MeshStandardMaterial({
    color: 0xcccccc, // gris metálico
    metalness: 0.9,
    roughness: 0.2
})
const matMetalBase = new THREE.MeshStandardMaterial({ 
    color: 0xAAAAAA, 
    roughness: 0.3, 
    metalness: 0.7 
})
const matLavaboBlanco = new THREE.MeshStandardMaterial({ 
    color: 0xFFFFFF, 
    roughness: 0.5 
})

// ------------------------------
// 🔽 Funciones de creación de cada modelo (Se actualiza el acceso al color)
// ------------------------------

// NOTA: En las funciones de creación, accedemos a colorSeleccionado.value
function crearNano(ancho, alto, fondo) {
    const group = new THREE.Group()

    // --- Materiales ---
    const matMueble = new THREE.MeshStandardMaterial({ 
      color: colorSeleccionado.value, // ACCESO CORREGIDO
      roughness: 0.6,
      metalness: 0.1
    })
    const matManija = new THREE.MeshStandardMaterial({ 
      color: 0xb0b0b0,
      metalness: 0.7,
      roughness: 0.3
    })
    
    // ... (el resto del modelo Nano se mantiene igual)
    const cuerpo = new THREE.Mesh( new THREE.BoxGeometry(ancho, alto * 0.7, fondo), matMueble )
    cuerpo.position.y = -alto * 0.15
    group.add(cuerpo)
    
    const grosorCubierta = 0.12
    const cubierta = new THREE.Mesh(new THREE.BoxGeometry(ancho, grosorCubierta, fondo), matMueble)
    cubierta.position.y = alto * 0.225
    group.add(cubierta)
    
    const radioLavabo = Math.min(ancho, fondo) * 0.35
    const alturaLavabo = 0.12
    const lavabo = new THREE.Mesh(
      new THREE.CylinderGeometry(radioLavabo, radioLavabo * 0.95, alturaLavabo, 32, 1, true),
      matLavaboBlanco
    )
    lavabo.position.set(0, cubierta.position.y + grosorCubierta/2 + alturaLavabo/2, 0)
    group.add(lavabo)

    const alturaBaseTarja = cubierta.position.y + grosorCubierta / 2;
    const baseGrifo = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 0.15, 16),
        matGrifo
    )
    baseGrifo.position.set(0, alturaBaseTarja + 0.15 / 2 + 0.05, -fondo / 2 + 0.08)
    group.add(baseGrifo)

    const puerta1 = new THREE.Mesh(new THREE.BoxGeometry(ancho / 2 - 0.01, alto * 0.4, 0.02), matMueble)
    puerta1.position.set(-ancho / 4, alto * 0.05, fondo / 2 + 0.01)
    const puerta2 = puerta1.clone()
    puerta2.position.x = ancho / 4
    
    const cajon = new THREE.Mesh(new THREE.BoxGeometry(ancho - 0.02, alto * 0.25, 0.02), matMueble)
    cajon.position.set(0, -alto * 0.275, fondo / 2 + 0.01)
    
    const manijaGeo = new THREE.BoxGeometry(0.008, 0.15, 0.012)
    const manija1 = new THREE.Mesh(manijaGeo, matManija)
    manija1.position.set(-ancho / 8, alto * 0.05, fondo / 2 + 0.025)
    const manija2 = manija1.clone()
    manija2.position.x = ancho / 8
    
    const manijaCajon = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.008, 0.012), matManija)
    manijaCajon.position.set(0, -alto * 0.275, fondo / 2 + 0.025)
    
    const pataGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.08, 16)
    const posicionesPatas = [
        [-ancho/2 + 0.05, -alto/2 - 0.04,  fondo/2 - 0.05],
        [ ancho/2 - 0.05, -alto/2 - 0.04,  fondo/2 - 0.05],
        [-ancho/2 + 0.05, -alto/2 - 0.04, -fondo/2 + 0.05],
        [ ancho/2 - 0.05, -alto/2 - 0.04, -fondo/2 + 0.05],
    ]

    posicionesPatas.forEach(pos => {
      const pata = new THREE.Mesh(pataGeo, matMetalBase)
      pata.position.set(...pos)
      group.add(pata)
    })
    
    group.add(puerta1, puerta2, cajon, manija1, manija2, manijaCajon)
    return group
}


function crearGreg(ancho, alto, fondo) {
    const group = new THREE.Group()

    const matCuerpo = new THREE.MeshStandardMaterial({ color: colorSeleccionado.value }) // ACCESO CORREGIDO
    const matMaderaNogal = new THREE.MeshStandardMaterial({ color: colorSeleccionado.value }) // ACCESO CORREGIDO
    const matPuerta = new THREE.MeshStandardMaterial({ color: 'black' })
    const matCubierta = new THREE.MeshStandardMaterial({ color: '#222' })
    const matLavabo = matLavaboBlanco

    // ... (El resto del modelo Greg se mantiene igual)
    const anchoEstante = ancho * 0.35
    const anchoCuerpo = ancho * 0.65
    const grosor = 0.02
    const altoUtil = alto

    const cuerpo = new THREE.Mesh(new THREE.BoxGeometry(anchoCuerpo, altoUtil, fondo), matCuerpo)
    cuerpo.position.set(ancho * 0.175, 0, 0)
    group.add(cuerpo)

    const marcoIzq = new THREE.Mesh(new THREE.BoxGeometry(grosor, altoUtil, fondo), matMaderaNogal)
    marcoIzq.position.set(-ancho/2 + grosor/2, 0, 0)
    group.add(marcoIzq)

    const marcoCentro = new THREE.Mesh(new THREE.BoxGeometry(grosor, altoUtil, fondo), matMaderaNogal)
    marcoCentro.position.set(-ancho/2 + anchoEstante - grosor/2, 0, 0)
    group.add(marcoCentro)

    const baseInf = new THREE.Mesh(new THREE.BoxGeometry(anchoEstante, grosor, fondo), matMaderaNogal)
    baseInf.position.set(-ancho/2 + anchoEstante/2, -altoUtil/2 + grosor/2, 0)
    group.add(baseInf)
    
    const baseSup = baseInf.clone()
    baseSup.position.y = altoUtil/2 - grosor/2
    group.add(baseSup)

    const estanteMedio = baseInf.clone()
    estanteMedio.position.y = 0
    group.add(estanteMedio)

    const puertaGeo = new THREE.BoxGeometry(anchoCuerpo - 0.02, altoUtil - 0.02, grosor)
    const puerta = new THREE.Mesh(puertaGeo, matPuerta)
    puerta.position.set(ancho * 0.175, 0, fondo/2 + grosor/2)
    group.add(puerta)

    const cubierta = new THREE.Mesh(new THREE.BoxGeometry(ancho + 0.02, 0.03, fondo + 0.02), matCubierta)
    cubierta.position.set(0, alto/2 + 0.02, 0)
    group.add(cubierta)

    const lavabo = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.12, 32, 1, true), matLavabo)
    lavabo.position.set(ancho * 0.175, alto/2 + 0.1, 0) 
    group.add(lavabo)

    const pataGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.08, 16)
    const posicionesPatas = [
        [-ancho/2 + 0.05, -alto/2 - 0.04, fondo/2 - 0.05],
        [ancho/2 - 0.05, -alto/2 - 0.04, fondo/2 - 0.05],
        [-ancho/2 + 0.05, -alto/2 - 0.04, -fondo/2 + 0.05],
        [ancho/2 - 0.05, -alto/2 - 0.04, -fondo/2 + 0.05],
    ]

    posicionesPatas.forEach(pos => {
      const pata = new THREE.Mesh(pataGeo, matMetalBase)
      pata.position.set(...pos)
      group.add(pata)
    })

    return group
}


function crearBoris(ancho, altoTotal, fondo) {
    const group = new THREE.Group();

    const H_PATAS = 0.05;       
    const H_TARJA = 0.03;       
    const H_CAJON_FRONT = 0.10; 
    
    const H_GABINETE_MADERA = altoTotal - H_PATAS - H_TARJA; 
    const H_PUERTA_FRONT = H_GABINETE_MADERA - H_CAJON_FRONT;

    // --- MATERIALES ---
    const materialMadera = new THREE.MeshStandardMaterial({ color: colorSeleccionado.value }); // ACCESO CORREGIDO
    const materialTarja = matLavaboBlanco;
    
    // ... (El resto del modelo Boris se mantiene igual)
    const gabineteInteriorGeo = new THREE.BoxGeometry(ancho, H_GABINETE_MADERA, fondo);
    const gabineteInterior = new THREE.Mesh(gabineteInteriorGeo, materialMadera);
    gabineteInterior.position.set(0, H_PATAS + H_GABINETE_MADERA / 2, 0);
    group.add(gabineteInterior);
    
    const offset = 0.005; 
    const profundidadRelieve = 0.012; 
    const zFrente = fondo / 2 + profundidadRelieve / 2 + 0.001; 

    const cajonGeo = new THREE.BoxGeometry(ancho - offset * 2, H_CAJON_FRONT - offset * 2, profundidadRelieve);
    const frenteCajon = new THREE.Mesh(cajonGeo, materialMadera);
    const posYCajon = H_PATAS + H_GABINETE_MADERA - (H_CAJON_FRONT / 2);
    frenteCajon.position.set(0, posYCajon, zFrente); 
    group.add(frenteCajon);

    const puertaGeo = new THREE.BoxGeometry(ancho - offset * 2, H_PUERTA_FRONT - offset * 2, profundidadRelieve);
    const frentePuerta = new THREE.Mesh(puertaGeo, materialMadera);
    const posYPuerta = H_PATAS + (H_PUERTA_FRONT / 2);
    frentePuerta.position.set(0, posYPuerta, zFrente);
    group.add(frentePuerta);

    const radioPata = 0.02; 
    const pataGeo = new THREE.CylinderGeometry(radioPata, radioPata, H_PATAS, 16);
    const offsetAncho = ancho / 2 - radioPata * 2;
    const offsetFondo = fondo / 2 - radioPata * 2;
    
    [
        new THREE.Vector3(offsetAncho, H_PATAS / 2, offsetFondo),
        new THREE.Vector3(-offsetAncho, H_PATAS / 2, offsetFondo),
        new THREE.Vector3(offsetAncho, H_PATAS / 2, -offsetFondo),
        new THREE.Vector3(-offsetAncho, H_PATAS / 2, -offsetFondo),
    ].forEach(pos => {
        const pata = new THREE.Mesh(pataGeo, matMetalBase);
        pata.position.copy(pos);
        group.add(pata);
    });

    const encimeraGeo = new THREE.BoxGeometry(ancho, H_TARJA, fondo);
    const encimera = new THREE.Mesh(encimeraGeo, materialTarja);
    const posYEncimera = H_PATAS + H_GABINETE_MADERA + H_TARJA / 2;
    encimera.position.set(0, posYEncimera, 0);
    group.add(encimera);

    const ALTURA_TUBO_VERTICAL = 0.15; 
    const TUBO_HORIZONTAL_LARGO = 0.21;
    const Z_POS_GRIFO = fondo / 2 - 0.15; 
    const alturaBaseTarja = posYEncimera + H_TARJA / 2;

    const baseGrifo = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, ALTURA_TUBO_VERTICAL, 16),
        matGrifo
    );
    baseGrifo.position.set(0, alturaBaseTarja + ALTURA_TUBO_VERTICAL / 2, Z_POS_GRIFO); 
    group.add(baseGrifo);

    const tuboGrifo = new THREE.Mesh(
        new THREE.CylinderGeometry(0.01, 0.01, TUBO_HORIZONTAL_LARGO, 16),
        matGrifo
    );
    tuboGrifo.rotation.x = Math.PI / 2;
    tuboGrifo.position.set(0, alturaBaseTarja + ALTURA_TUBO_VERTICAL, Z_POS_GRIFO + TUBO_HORIZONTAL_LARGO / 2);
    group.add(tuboGrifo);

    return group;
}

function crearLia(ancho, alto, fondo) {
    const group = new THREE.Group()

    const matCuerpo = new THREE.MeshStandardMaterial({ color: colorSeleccionado.value }) // ACCESO CORREGIDO
    const matPuerta = new THREE.MeshStandardMaterial({ color: colorSeleccionado.value }) // ACCESO CORREGIDO
    const matTarja = new THREE.MeshStandardMaterial({ color: '#e0e0e0' }) 
    const matPata = matMetalBase

    // ... (El resto del modelo Lia se mantiene igual)
    const grosor = 0.018

    const cuerpoGeo = new THREE.BoxGeometry(ancho, alto, fondo)
    const cuerpo = new THREE.Mesh(cuerpoGeo, matCuerpo)
    group.add(cuerpo)

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

    const franjaGeo = new THREE.BoxGeometry(ancho, 0.04, grosor)
    const franja = new THREE.Mesh(franjaGeo, matCuerpo)
    franja.position.set(0, alto/2 - 0.06, fondo/2 + grosor/2)
    group.add(franja)

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

    const tarjaGeo = new THREE.BoxGeometry(ancho, 0.05, fondo)
    const tarja = new THREE.Mesh(tarjaGeo, matTarja)
    tarja.position.set(0, alto/2 + 0.025, 0)
    group.add(tarja)

    const baseGrifo = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12, 16), matGrifo)
    baseGrifo.position.set(0, alto/2 + 0.1 + 0.06, -fondo/2 + 0.08) 
    group.add(baseGrifo)

    const tuboGrifo = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.18, 16), matGrifo)
    tuboGrifo.rotation.x = Math.PI / 2
    tuboGrifo.position.set(0, alto/2 + 0.18 + 0.06, -fondo/2 + 0.17)
    group.add(tuboGrifo)

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
    const material = new THREE.MeshStandardMaterial({ color: colorSeleccionado.value }) // ACCESO CORREGIDO
    const matPata = matMetalBase

    // ... (El resto del modelo Reni se mantiene igual)
    const cuerpo = new THREE.Mesh(new THREE.BoxGeometry(ancho, alto, fondo), material)
    group.add(cuerpo)

    const puerta = new THREE.Mesh(new THREE.BoxGeometry(ancho / 2 - 0.01, alto - 0.05, 0.02), material)
    puerta.position.set(-ancho / 4, 0, fondo / 2 + 0.01)
    group.add(puerta)

    for (let i = 0; i < 4; i++) {
        const cajon = new THREE.Mesh(new THREE.BoxGeometry(ancho / 2 - 0.03, alto / 4 - 0.02, 0.02), material)
        cajon.position.set(ancho / 4 + 0.01, alto / 2 - (i * (alto / 4) + alto / 8), fondo / 2 + 0.01)
        group.add(cajon)
    }
    
    const pataGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.08, 16)
    const posicionesPatas = [
        [-ancho/2 + 0.05, -alto/2 - 0.04,  fondo/2 - 0.05],
        [ ancho/2 - 0.05, -alto/2 - 0.04,  fondo/2 - 0.05],
        [-ancho/2 + 0.05, -alto/2 - 0.04, -fondo/2 + 0.05],
        [ ancho/2 - 0.05, -alto/2 - 0.04, -fondo/2 + 0.05],
    ]

    posicionesPatas.forEach(pos => {
      const pata = new THREE.Mesh(pataGeo, matPata)
      pata.position.set(...pos)
      group.add(pata)
    })

    return group
}

function crearDany(ancho, alto, fondo) {
    const group = new THREE.Group()
    const material = new THREE.MeshStandardMaterial({ color: colorSeleccionado.value }) // ACCESO CORREGIDO
    const matPata = matMetalBase

    // ... (El resto del modelo Dany se mantiene igual)
    const cuerpo = new THREE.Mesh(new THREE.BoxGeometry(ancho, alto, fondo), material)
    group.add(cuerpo)

    for (let i = 0; i < 3; i++) {
        const cajon = new THREE.Mesh(new THREE.BoxGeometry(ancho - 0.05, alto / 3 - 0.02, 0.02), material)
        cajon.position.set(0, alto / 2 - (i * (alto / 3) + alto / 6), fondo / 2 + 0.01)
        group.add(cajon)
    }

    const pataGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.08, 16)
    const posicionesPatas = [
        [-ancho/2 + 0.05, -alto/2 - 0.04,  fondo/2 - 0.05],
        [ ancho/2 - 0.05, -alto/2 - 0.04,  fondo/2 - 0.05],
        [-ancho/2 + 0.05, -alto/2 - 0.04, -fondo/2 + 0.05],
        [ ancho/2 - 0.05, -alto/2 - 0.04, -fondo/2 + 0.05],
    ]

    posicionesPatas.forEach(pos => {
      const pata = new THREE.Mesh(pataGeo, matPata)
      pata.position.set(...pos)
      group.add(pata)
    })

    return group
}

// 💡 CORRECCIÓN: Ahora recibe el objeto del mueble con .value
function crearMueble(muebleData) {
    const data = muebleData.value || muebleData; // Maneja si viene como ref o como objeto directo
    const { ancho, alto, fondo, nombre } = data;
    
    if (nombre === 'Nano') return crearNano(ancho, alto, fondo)
    if (nombre === 'Greg') return crearGreg(ancho, alto, fondo)
    if (nombre === 'Boris') return crearBoris(ancho, alto, fondo)
    if (nombre === 'Lia') return crearLia(ancho, alto, fondo)
    if (nombre === 'Reni') return crearReni(ancho, alto, fondo)
    if (nombre === 'Dany') return crearDany(ancho, alto, fondo)
    return new THREE.Group()
}

// ------------------------------
// Render y Lógica de Cámara Corregida
// ------------------------------

function renderMueble() {
    if (muebleActual) scene.remove(muebleActual)
    
    // 1. Crear el nuevo mueble (tipoSeleccionado es ref, lo pasamos directamente)
    muebleActual = crearMueble(tipoSeleccionado)
    scene.add(muebleActual)

    // 2. Determinar el centro vertical del mueble actual para centrar la cámara
    let targetY = 0;
    // ACCESO CORREGIDO: Usar .value
    const mitadAlto = tipoSeleccionado.value.alto / 2;
    
    if (tipoSeleccionado.value.nombre === 'Boris') { // ACCESO CORREGIDO
        targetY = mitadAlto; 
    } else {
        targetY = 0; 
    }
    
    // 3. Aplicar el centrado de la cámara
    if (camera) {
        const newTarget = new THREE.Vector3(0, targetY, 0);
        camera.lookAt(newTarget);
        controls.target.copy(newTarget);
        controls.update(); 
    }
}

onMounted(() => {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f0f0)

    // Declaración de 'camera' sin 'const' para que sea la variable global
    camera = new THREE.PerspectiveCamera(45, (window.innerWidth - 200) / window.innerHeight, 0.1, 100);
    camera.position.set(1.5, 1.2, 2.5);
    
    renderer = new THREE.WebGLRenderer({ canvas: canvas.value, antialias: true })
    renderer.setSize(window.innerWidth - 200, window.innerHeight)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    
    // ILUMINACIÓN
    const light = new THREE.DirectionalLight(0xffffff, 2)
    light.position.set(5, 10, 7.5)
    scene.add(light)
    scene.add(new THREE.AmbientLight(0xffffff, 1)) 

    window.addEventListener('resize', () => {
        camera.aspect = (window.innerWidth - 200) / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth - 200, window.innerHeight)
    })

    // Esto llamará a renderMueble, que ajustará la posición de la cámara
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
.sidebar label input {
  margin-top: 2px;
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
  width: 25px; /* Ligeramente más grande */
  height: 25px;
  border: 1px solid #333;
  border-radius: 50%; /* Más estético */
  cursor: pointer;
  transition: all 0.1s ease-in-out;
}
</style>