<template>
  <div class="app">
    <!-- Modal Principal con Wizard -->
    <Transition name="fade">
      <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
        <Transition name="slide">
          <div class="modal">
            <!-- Header del Modal -->
            <div class="modal-header">
              <h1>Diseñador de Muebles 3D</h1>
              <div class="step-indicator">
                <div 
                  v-for="(step, index) in wizardSteps" 
                  :key="index"
                  class="step"
                  :class="{
                    active: currentStep === index,
                    completed: currentStep > index
                  }"
                >
                  <span class="step-number">{{ index + 1 }}</span>
                  <span class="step-label">{{ step.label }}</span>
                </div>
              </div>
              <button @click="closeModal" class="close-btn" aria-label="Cerrar modal">&times;</button>
            </div>

            <!-- Contenido del Wizard -->
            <div class="modal-body">
              <form @submit.prevent="handleSubmit" class="wizard-form">
                
                <!-- Paso 1: Selección de Tipo -->
                <div v-if="currentStep === 0" class="wizard-step">
                  <h2>Selecciona el tipo de mueble</h2>
                  <div class="furniture-grid-enhanced">
                    <div
                      v-for="furniture in furnitureOptions"
                      :key="furniture.id"
                      @click="selectFurniture(furniture.id)"
                      class="furniture-card"
                      :class="{ selected: form.tipo === furniture.id }"
                      role="button"
                      tabindex="0"
                      @keydown.enter="selectFurniture(furniture.id)"
                      @keydown.space="selectFurniture(furniture.id)"
                    >
                      <div class="furniture-icon">{{ furniture.icon }}</div>
                      <h3>{{ furniture.name }}</h3>
                      <p>{{ furniture.description }}</p>
                      <div class="furniture-preview">
                        <span>{{ furniture.defaultDims.ancho }}×{{ furniture.defaultDims.alto }}×{{ furniture.defaultDims.profundidad }}cm</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Paso 2: Dimensiones -->
                <div v-if="currentStep === 1" class="wizard-step">
                  <h2>Ajusta las dimensiones</h2>
                  <div class="dimensions-grid">
                    <div class="dimension-group">
                      <label>
                        <span class="dimension-icon">↔️</span>
                        <span>Ancho</span>
                        <strong>{{ form.ancho }}cm</strong>
                      </label>
                      <div class="dimension-control-enhanced">
                        <input
                          type="range"
                          :min="dimensionLimits.ancho.min"
                          :max="dimensionLimits.ancho.max"
                          v-model.number="form.ancho"
                          class="dimension-slider"
                        />
                        <input
                          type="number"
                          :min="dimensionLimits.ancho.min"
                          :max="dimensionLimits.ancho.max"
                          v-model.number="form.ancho"
                          class="dimension-input"
                        />
                      </div>
                    </div>

                    <div class="dimension-group">
                      <label>
                        <span class="dimension-icon">↕️</span>
                        <span>Alto</span>
                        <strong>{{ form.alto }}cm</strong>
                      </label>
                      <div class="dimension-control-enhanced">
                        <input
                          type="range"
                          :min="dimensionLimits.alto.min"
                          :max="dimensionLimits.alto.max"
                          v-model.number="form.alto"
                          class="dimension-slider"
                        />
                        <input
                          type="number"
                          :min="dimensionLimits.alto.min"
                          :max="dimensionLimits.alto.max"
                          v-model.number="form.alto"
                          class="dimension-input"
                        />
                      </div>
                    </div>

                    <div class="dimension-group">
                      <label>
                        <span class="dimension-icon">⬆️</span>
                        <span>Profundidad</span>
                        <strong>{{ form.profundidad }}cm</strong>
                      </label>
                      <div class="dimension-control-enhanced">
                        <input
                          type="range"
                          :min="dimensionLimits.profundidad.min"
                          :max="dimensionLimits.profundidad.max"
                          v-model.number="form.profundidad"
                          class="dimension-slider"
                        />
                        <input
                          type="number"
                          :min="dimensionLimits.profundidad.min"
                          :max="dimensionLimits.profundidad.max"
                          v-model.number="form.profundidad"
                          class="dimension-input"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Vista previa de dimensiones -->
                  <div class="dimension-preview">
                    <div class="preview-box" :style="previewBoxStyle">
                      <span>{{ ((form.ancho / 100) * (form.profundidad / 100)).toFixed(2) }} m²</span>
                    </div>
                  </div>
                </div>

                <!-- Paso 3: Configuración Específica -->
                <div v-if="currentStep === 2" class="wizard-step">
                  <h2>🔧 Personaliza tu {{ currentFurniture?.name }}</h2>
                  <div class="specific-config">
                    
                    <!-- Configuración para Escritorio -->
                    <div v-if="form.tipo === 'escritorio'" class="config-section">
                      <div class="config-grid">
                        <div class="config-item">
                          <label>📦 Número de cajones</label>
                          <div class="number-selector">
                            <button type="button" @click="decrementValue('cajones')" :disabled="form.config.cajones <= 0">-</button>
                            <span>{{ form.config.cajones }}</span>
                            <button type="button" @click="incrementValue('cajones')" :disabled="form.config.cajones >= 6">+</button>
                          </div>
                        </div>
                        
                        <div class="config-item">
                          <label>🔒 Cerradura en cajones</label>
                          <div class="toggle-switch">
                            <input type="checkbox" v-model="form.config.cerradura" id="cerradura">
                            <label for="cerradura" class="switch"></label>
                          </div>
                        </div>

                        <div class="config-item">
                          <label>🔌 Gestión de cables</label>
                          <div class="toggle-switch">
                            <input type="checkbox" v-model="form.config.gestionCables" id="cables">
                            <label for="cables" class="switch"></label>
                          </div>
                        </div>

                        <div class="config-item">
                          <label>🎯 Tipo de superficie</label>
                          <select v-model="form.config.superficie" class="select-enhanced">
                            <option value="lisa">Lisa</option>
                            <option value="antideslizante">Antideslizante</option>
                            <option value="cristal">Cristal</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <!-- Configuración para Estante -->
                    <div v-if="form.tipo === 'estante'" class="config-section">
                      <div class="config-grid">
                        <div class="config-item">
                          <label>📚 Número de estantes</label>
                          <div class="number-selector">
                            <button type="button" @click="decrementValue('estantes')" :disabled="form.config.estantes <= 1">-</button>
                            <span>{{ form.config.estantes }}</span>
                            <button type="button" @click="incrementValue('estantes')" :disabled="form.config.estantes >= 10">+</button>
                          </div>
                        </div>
                        
                        <div class="config-item">
                          <label>🔄 Estantes ajustables</label>
                          <div class="toggle-switch">
                            <input type="checkbox" v-model="form.config.ajustables" id="ajustables">
                            <label for="ajustables" class="switch"></label>
                          </div>
                        </div>

                        <div class="config-item">
                          <label>🚪 Puertas</label>
                          <div class="number-selector">
                            <button type="button" @click="decrementValue('puertas')" :disabled="form.config.puertas <= 0">-</button>
                            <span>{{ form.config.puertas }}</span>
                            <button type="button" @click="incrementValue('puertas')" :disabled="form.config.puertas >= 4">+</button>
                          </div>
                        </div>

                        <div v-if="form.config.puertas > 0" class="config-item">
                          <label>🔍 Tipo de puertas</label>
                          <select v-model="form.config.tipoPuertas" class="select-enhanced">
                            <option value="opacas">Opacas</option>
                            <option value="cristal">Cristal</option>
                            <option value="rejilla">Rejilla</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <!-- Configuración para Mesa -->
                    <div v-if="form.tipo === 'mesa'" class="config-section">
                      <div class="config-grid">
                        <div class="config-item">
                          <label>🦵 Tipo de patas</label>
                          <select v-model="form.config.tipoPatas" class="select-enhanced">
                            <option value="cilindrica">Cilíndricas</option>
                            <option value="cuadrada">Cuadradas</option>
                            <option value="cruz">Tipo Cruz</option>
                            <option value="trestle">Caballete</option>
                          </select>
                        </div>

                        <div class="config-item">
                          <label>⚡ Mesa extensible</label>
                          <div class="toggle-switch">
                            <input type="checkbox" v-model="form.config.extensible" id="extensible">
                            <label for="extensible" class="switch"></label>
                          </div>
                        </div>

                        <div class="config-item">
                          <label>📦 Cajón central</label>
                          <div class="toggle-switch">
                            <input type="checkbox" v-model="form.config.cajonCentral" id="cajonCentral">
                            <label for="cajonCentral" class="switch"></label>
                          </div>
                        </div>

                        <div class="config-item">
                          <label>🎯 Forma del tablero</label>
                          <select v-model="form.config.formaTablero" class="select-enhanced">
                            <option value="rectangular">Rectangular</option>
                            <option value="ovalada">Ovalada</option>
                            <option value="redonda">Redonda</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <!-- Configuración para Armario -->
                    <div v-if="form.tipo === 'armario'" class="config-section">
                      <div class="config-grid">
                        <div class="config-item">
                          <label>🚪 Número de puertas</label>
                          <div class="number-selector">
                            <button type="button" @click="decrementValue('puertas')" :disabled="form.config.puertas <= 1">-</button>
                            <span>{{ form.config.puertas }}</span>
                            <button type="button" @click="incrementValue('puertas')" :disabled="form.config.puertas >= 6">+</button>
                          </div>
                        </div>

                        <div class="config-item">
                          <label>👔 Barras para colgar</label>
                          <div class="number-selector">
                            <button type="button" @click="decrementValue('barras')" :disabled="form.config.barras <= 0">-</button>
                            <span>{{ form.config.barras }}</span>
                            <button type="button" @click="incrementValue('barras')" :disabled="form.config.barras >= 4">+</button>
                          </div>
                        </div>

                        <div class="config-item">
                          <label>📦 Cajones internos</label>
                          <div class="number-selector">
                            <button type="button" @click="decrementValue('cajones')" :disabled="form.config.cajones <= 0">-</button>
                            <span>{{ form.config.cajones }}</span>
                            <button type="button" @click="incrementValue('cajones')" :disabled="form.config.cajones >= 8">+</button>
                          </div>
                        </div>

                        <div class="config-item">
                          <label>🔍 Espejo interior</label>
                          <div class="toggle-switch">
                            <input type="checkbox" v-model="form.config.espejo" id="espejo">
                            <label for="espejo" class="switch"></label>
                          </div>
                        </div>

                        <div class="config-item">
                          <label>💡 Iluminación LED</label>
                          <div class="toggle-switch">
                            <input type="checkbox" v-model="form.config.iluminacion" id="iluminacion">
                            <label for="iluminacion" class="switch"></label>
                          </div>
                        </div>

                        <div class="config-item">
                          <label>🚪 Tipo de puertas</label>
                          <select v-model="form.config.tipoPuertas" class="select-enhanced">
                            <option value="batiente">Batiente</option>
                            <option value="corredera">Corredera</option>
                            <option value="plegable">Plegable</option>
                          </select>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <!-- Paso 4: Material y Acabado -->
                <div v-if="currentStep === 3" class="wizard-step">
                  <h2>🎨 Elige material y acabado</h2>
                  <div class="material-section">
                    <div class="color-grid">
                      <div
                        v-for="(colorData, colorKey) in woodColors"
                        :key="colorKey"
                        @click="form.color = colorKey"
                        class="color-option"
                        :class="{ selected: form.color === colorKey }"
                        role="button"
                        tabindex="0"
                        @keydown.enter="form.color = colorKey"
                        @keydown.space="form.color = colorKey"
                      >
                        <div 
                          class="color-swatch" 
                          :style="{ backgroundColor: colorData.color }"
                        ></div>
                        <div class="color-info">
                          <h4>{{ colorData.name }}</h4>
                          <p>{{ colorData.description }}</p>
                          <div class="material-props">
                            <span>Rugosidad: {{ Math.round(colorData.roughness * 100) }}%</span>
                            <span>Brillo: {{ Math.round(colorData.metalness * 100) }}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Acabados adicionales -->
                    <div class="finish-options">
                      <h3>✨ Acabados adicionales</h3>
                      <div class="finish-grid">
                        <div class="finish-item">
                          <label>🌟 Barniz protector</label>
                          <div class="toggle-switch">
                            <input type="checkbox" v-model="form.config.barniz" id="barniz">
                            <label for="barniz" class="switch"></label>
                          </div>
                        </div>
                        
                        <div class="finish-item">
                          <label>🔥 Tratamiento ignífugo</label>
                          <div class="toggle-switch">
                            <input type="checkbox" v-model="form.config.ignifugo" id="ignifugo">
                            <label for="ignifugo" class="switch"></label>
                          </div>
                        </div>

                        <div class="finish-item">
                          <label>💧 Resistente al agua</label>
                          <div class="toggle-switch">
                            <input type="checkbox" v-model="form.config.resistenteAgua" id="resistenteAgua">
                            <label for="resistenteAgua" class="switch"></label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Botones de navegación -->
                <div class="wizard-navigation">
                  <button 
                    type="button" 
                    @click="previousStep" 
                    v-if="currentStep > 0"
                    class="btn-nav prev"
                  >
                    ← Anterior
                  </button>
                  
                  <button 
                    type="button" 
                    @click="nextStep" 
                    v-if="currentStep < wizardSteps.length - 1"
                    class="btn-nav next"
                  >
                    Siguiente →
                  </button>
                  
                  <button 
                    type="submit" 
                    v-if="currentStep === wizardSteps.length - 1"
                    class="btn-nav generate"
                  >
                    🚀 Generar Mueble
                  </button>
                </div>

              </form>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Controles flotantes cuando el modal está cerrado -->
    <Transition name="slide">
      <div v-if="!showModal" class="floating-controls">
        <button @click="openModal" class="btn-floating main">
          🎛️ <span class="btn-text">Personalizar</span>
        </button>
        <button @click="generateRandomFurniture" class="btn-floating new-furniture" :disabled="isGenerating">
          🎲 <span class="btn-text">{{ isGenerating ? 'Generando...' : 'Nuevo Mueble' }}</span>
        </button>
        <button @click="resetCamera" class="btn-floating secondary">
          🔄 <span class="btn-text">Reset Vista</span>
        </button>
        <button @click="toggleWireframe" class="btn-floating secondary">
          {{ wireframeMode ? '🎨' : '📐' }} <span class="btn-text">{{ wireframeMode ? 'Sólido' : 'Wireframe' }}</span>
        </button>
        <button @click="downloadFurnitureData" class="btn-floating download">
          📥 <span class="btn-text">Descargar</span>
        </button>
      </div>
    </Transition>

    <!-- Canvas 3D -->
    <div class="viewer">
      <canvas ref="canvas"></canvas>
      
      <!-- Panel de información mejorado -->
      <Transition name="fade">
        <div v-if="!showModal && !isMobileView" class="info-panel-enhanced">
          <div class="info-header">
            <h3>📊 {{ currentFurniture?.name || 'Mueble' }}</h3>
            <div class="info-status" :class="{ loading: isGenerating }">
              {{ isGenerating ? '⚡ Generando...' : '✅ Listo' }}
            </div>
          </div>
          
          <div class="info-content">
            <div class="info-section">
              <h4>📏 Dimensiones</h4>
              <div class="info-row">
                <span>Ancho:</span><strong>{{ form.ancho }}cm</strong>
              </div>
              <div class="info-row">
                <span>Alto:</span><strong>{{ form.alto }}cm</strong>
              </div>
              <div class="info-row">
                <span>Profundidad:</span><strong>{{ form.profundidad }}cm</strong>
              </div>
            </div>

            <div class="info-section">
              <h4>🎨 Material</h4>
              <div class="info-row">
                <span>Tipo:</span><strong>{{ materialName }}</strong>
              </div>
            </div>

            <div class="info-section">
              <h4>📦 Especificaciones</h4>
              <div v-if="form.tipo === 'escritorio'" class="spec-list">
                <div class="spec-item">📦 Cajones: {{ form.config.cajones }}</div>
                <div class="spec-item" v-if="form.config.cerradura">🔒 Con cerradura</div>
                <div class="spec-item" v-if="form.config.gestionCables">🔌 Gestión cables</div>
              </div>
              
              <div v-if="form.tipo === 'estante'" class="spec-list">
                <div class="spec-item">📚 Estantes: {{ form.config.estantes }}</div>
                <div class="spec-item" v-if="form.config.puertas > 0">🚪 Puertas: {{ form.config.puertas }}</div>
                <div class="spec-item" v-if="form.config.ajustables">🔄 Ajustables</div>
              </div>
              
              <div v-if="form.tipo === 'armario'" class="spec-list">
                <div class="spec-item">🚪 Puertas: {{ form.config.puertas }}</div>
                <div class="spec-item">📦 Cajones: {{ form.config.cajones }}</div>
                <div class="spec-item">👔 Barras: {{ form.config.barras }}</div>
                <div class="spec-item" v-if="form.config.espejo">🔍 Con espejo</div>
              </div>
            </div>

            <div class="info-section">
              <div class="info-row volume">
                <span>📏 Área:</span>
                <strong>{{ ((form.ancho / 100) * (form.profundidad / 100)).toFixed(2) }} m²</strong>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Controles de ayuda mejorados -->
      <Transition name="fade">
        <div v-if="!showModal && !isMobileView" class="controls-help-enhanced">
          <div class="help-item">
            <span class="help-icon">🖱️</span>
            <span><strong>Arrastrar:</strong> Rotar modelo</span>
          </div>
          <div class="help-item">
            <span class="help-icon">🎡</span>
            <span><strong>Rueda:</strong> Zoom in/out</span>
          </div>
          <div class="help-item">
            <span class="help-icon">⚡</span>
            <span><strong>Cambios:</strong> Tiempo real</span>
          </div>
        </div>
      </Transition>

      <!-- Mobile Info Panel -->
      <Transition name="fade">
        <div v-if="!showModal && isMobileView" class="mobile-info-panel">
          <div class="mobile-info-header" @click="toggleMobileInfo">
            <h3>{{ currentFurniture?.name || 'Mueble' }} - {{ form.ancho }}×{{ form.alto }}×{{ form.profundidad }}cm</h3>
            <button class="mobile-toggle">{{ showMobileInfo ? '−' : '+' }}</button>
          </div>
          <div v-if="showMobileInfo" class="mobile-info-content">
            <div class="mobile-specs">
              <span>Material: {{ materialName }}</span>
              <span>Área: {{ ((form.ancho / 100) * (form.profundidad / 100)).toFixed(2) }} m²</span>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as THREE from 'three'

// Estados reactivos
const showModal = ref(true)
const canvas = ref(null)
const currentStep = ref(0)
const isGenerating = ref(false)
const wireframeMode = ref(false)
const isMobileView = ref(false)
const showMobileInfo = ref(false)

// Detectar dispositivos móviles
const checkMobileView = () => {
  isMobileView.value = window.innerWidth < 768 || 'ontouchstart' in window
}

// Pasos del wizard
const wizardSteps = [
  { label: 'Tipo' },
  { label: 'Dimensiones' },
  { label: 'Configuración' },
  { label: 'Material' }
]

// Form reactivo con configuraciones específicas
const form = reactive({
  tipo: 'escritorio',
  ancho: 120,
  alto: 80,
  profundidad: 50,
  color: 'nogal',
  config: {
    // Escritorio
    cajones: 2,
    cerradura: false,
    gestionCables: true,
    superficie: 'lisa',
    
    // Estante
    estantes: 3,
    ajustables: true,
    puertas: 0,
    tipoPuertas: 'opacas',
    
    // Mesa
    tipoPatas: 'cilindrica',
    extensible: false,
    cajonCentral: false,
    formaTablero: 'rectangular',
    
    // Armario
    barras: 1,
    espejo: false,
    iluminacion: false,
    
    // Acabados
    barniz: true,
    ignifugo: false,
    resistenteAgua: false
  }
})

// Referencias de Three.js
let scene, camera, renderer, controls, muebleGroup, animationId

// Colores de madera mejorados
const woodColors = {
  nogal: { 
    color: '#4A2C17', 
    roughness: 0.7, 
    metalness: 0.1,
    name: 'Nogal Clásico',
    description: 'Elegante y tradicional'
  },
  polar: { 
    color: '#F5F1E8', 
    roughness: 0.8, 
    metalness: 0.05,
    name: 'Polar Nórdico',
    description: 'Minimalista y moderno'
  },
  rivera: { 
    color: '#8B4513', 
    roughness: 0.6, 
    metalness: 0.15,
    name: 'Rivera Roble',
    description: 'Cálido y acogedor'
  },
  noruego: { 
    color: '#DEB887', 
    roughness: 0.7, 
    metalness: 0.1,
    name: 'Noruego',
    description: 'Natural y versátil'
  },
  tundra: { 
    color: '#A0826D', 
    roughness: 0.65, 
    metalness: 0.12,
    name: 'Tundra',
    description: 'Sofisticado y neutro'
  },
  cerezo: { 
    color: '#722F37', 
    roughness: 0.5, 
    metalness: 0.2,
    name: 'Cerezo',
    description: 'Luxurioso y cálido'
  },
  caoba: { 
    color: '#C04000', 
    roughness: 0.6, 
    metalness: 0.15,
    name: 'Caoba',
    description: 'Clásico y prestigioso'
  },
  pino: { 
    color: '#FFA500', 
    roughness: 0.8, 
    metalness: 0.05,
    name: 'Pino Natural',
    description: 'Fresco y juvenil'
  }
}

// Opciones de muebles
const furnitureOptions = ref([
  { 
    id: 'escritorio', 
    icon: '🖥️', 
    name: 'Escritorio', 
    description: 'Perfecto para trabajar y estudiar',
    defaultDims: { ancho: 120, alto: 75, profundidad: 60 }
  },
  { 
    id: 'estante', 
    icon: '📚', 
    name: 'Estante', 
    description: 'Organiza tus libros y objetos',
    defaultDims: { ancho: 80, alto: 180, profundidad: 30 }
  },
  { 
    id: 'mesa', 
    icon: '🍽️', 
    name: 'Mesa', 
    description: 'Para comidas y reuniones',
    defaultDims: { ancho: 160, alto: 75, profundidad: 90 }
  },
  { 
    id: 'armario', 
    icon: '👗', 
    name: 'Armario', 
    description: 'Guarda tu ropa con estilo',
    defaultDims: { ancho: 120, alto: 200, profundidad: 60 }
  },
  { 
    id: 'banco', 
    icon: '🪑', 
    name: 'Banco', 
    description: 'Asiento cómodo y práctico',
    defaultDims: { ancho: 100, alto: 45, profundidad: 40 }
  },
  { 
    id: 'silla', 
    icon: '💺', 
    name: 'Silla', 
    description: 'Comodidad para el día a día',
    defaultDims: { ancho: 45, alto: 85, profundidad: 50 }
  }
])

// Computed properties
const currentFurniture = computed(() => {
  return furnitureOptions.value.find(f => f.id === form.tipo)
})

const materialName = computed(() => {
  return woodColors[form.color]?.name || form.color
})

const dimensionLimits = computed(() => {
  const limits = {
    escritorio: { ancho: {min: 80, max: 200}, alto: {min: 60, max: 90}, profundidad: {min: 40, max: 80} },
    estante: { ancho: {min: 40, max: 150}, alto: {min: 100, max: 250}, profundidad: {min: 20, max: 50} },
    mesa: { ancho: {min: 80, max: 300}, alto: {min: 60, max: 90}, profundidad: {min: 60, max: 150} },
    armario: { ancho: {min: 60, max: 200}, alto: {min: 150, max: 250}, profundidad: {min: 40, max: 80} },
    banco: { ancho: {min: 60, max: 150}, alto: {min: 30, max: 60}, profundidad: {min: 30, max: 60} },
    silla: { ancho: {min: 35, max: 60}, alto: {min: 70, max: 120}, profundidad: {min: 35, max: 60} }
  }
  return limits[form.tipo] || { ancho: {min: 50, max: 300}, alto: {min: 50, max: 250}, profundidad: {min: 20, max: 100} }
})

const previewBoxStyle = computed(() => {
  const scale = 0.5
  const maxWidth = 120
  const maxHeight = 80
  
  const width = Math.min((form.ancho / 300) * maxWidth, maxWidth) * scale
  const height = Math.min((form.alto / 250) * maxHeight, maxHeight) * scale
  
  return {
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: woodColors[form.color]?.color || '#4A2C17'
  }
})

// Control de cámara mejorado con anti-blur
class AdvancedControls {
  constructor(camera, domElement) {
    this.camera = camera
    this.domElement = domElement
    this.isMouseDown = false
    this.mouseX = 0
    this.mouseY = 0
    this.targetRotationX = 0
    this.targetRotationY = 0
    this.rotationX = 0
    this.rotationY = 0
    this.targetDistance = 4
    this.currentDistance = 4
    
    this.minDistance = 1.5
    this.maxDistance = 8
    this.rotationSpeed = 0.008
    this.zoomSpeed = 0.08
    this.dampingFactor = 0.12

    this.bindEvents()
  }

  bindEvents() {
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onWheel = this.onWheel.bind(this)

    this.domElement.addEventListener('mousedown', this.onMouseDown)
    this.domElement.addEventListener('mousemove', this.onMouseMove)
    this.domElement.addEventListener('mouseup', this.onMouseUp)
    this.domElement.addEventListener('wheel', this.onWheel, { passive: false })
    
    // Touch events for mobile
    this.domElement.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false })
    this.domElement.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false })
    this.domElement.addEventListener('touchend', this.onTouchEnd.bind(this))
  }

  onMouseDown(event) {
    event.preventDefault()
    this.isMouseDown = true
    this.mouseX = event.clientX
    this.mouseY = event.clientY
  }

  onMouseMove(event) {
    if (!this.isMouseDown) return
    event.preventDefault()
    
    const deltaX = event.clientX - this.mouseX
    const deltaY = event.clientY - this.mouseY
    this.targetRotationY += deltaX * this.rotationSpeed
    this.targetRotationX += deltaY * this.rotationSpeed
    this.targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.targetRotationX))
    this.mouseX = event.clientX
    this.mouseY = event.clientY
  }

  onMouseUp(event) {
    event.preventDefault()
    this.isMouseDown = false
  }

  onWheel(event) {
    event.preventDefault()
    this.targetDistance += event.deltaY * this.zoomSpeed * 0.01
    this.targetDistance = Math.max(this.minDistance, Math.min(this.maxDistance, this.targetDistance))
  }

  onTouchStart(event) {
    event.preventDefault()
    if (event.touches.length === 1) {
      this.isMouseDown = true
      this.mouseX = event.touches[0].clientX
      this.mouseY = event.touches[0].clientY
    } else if (event.touches.length === 2) {
      // Pinch to zoom
      const touch1 = event.touches[0]
      const touch2 = event.touches[1]
      this.lastTouchDistance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      )
    }
  }

  onTouchMove(event) {
    event.preventDefault()
    if (event.touches.length === 1 && this.isMouseDown) {
      const deltaX = event.touches[0].clientX - this.mouseX
      const deltaY = event.touches[0].clientY - this.mouseY
      this.targetRotationY += deltaX * this.rotationSpeed * 1.5
      this.targetRotationX += deltaY * this.rotationSpeed * 1.5
      this.targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.targetRotationX))
      this.mouseX = event.touches[0].clientX
      this.mouseY = event.touches[0].clientY
    } else if (event.touches.length === 2) {
      // Pinch to zoom
      const touch1 = event.touches[0]
      const touch2 = event.touches[1]
      const currentDistance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      )
      
      if (this.lastTouchDistance) {
        const deltaDistance = this.lastTouchDistance - currentDistance
        this.targetDistance += deltaDistance * 0.01
        this.targetDistance = Math.max(this.minDistance, Math.min(this.maxDistance, this.targetDistance))
      }
      this.lastTouchDistance = currentDistance
    }
  }

  onTouchEnd(event) {
    event.preventDefault()
    this.isMouseDown = false
    this.lastTouchDistance = null
  }

  reset() {
    this.targetRotationX = 0
    this.targetRotationY = 0
    this.targetDistance = 4
  }

  update() {
    // Smooth rotation
    this.rotationX += (this.targetRotationX - this.rotationX) * this.dampingFactor
    this.rotationY += (this.targetRotationY - this.rotationY) * this.dampingFactor
    
    // Smooth zoom
    this.currentDistance += (this.targetDistance - this.currentDistance) * this.dampingFactor
    
    if (muebleGroup) {
      muebleGroup.rotation.x = this.rotationX
      muebleGroup.rotation.y = this.rotationY
    }
    
    this.camera.position.z = this.currentDistance
  }

  dispose() {
    this.domElement.removeEventListener('mousedown', this.onMouseDown)
    this.domElement.removeEventListener('mousemove', this.onMouseMove)
    this.domElement.removeEventListener('mouseup', this.onMouseUp)
    this.domElement.removeEventListener('wheel', this.onWheel)
    this.domElement.removeEventListener('touchstart', this.onTouchStart)
    this.domElement.removeEventListener('touchmove', this.onTouchMove)
    this.domElement.removeEventListener('touchend', this.onTouchEnd)
  }
}

// Función para crear material de madera
const createWoodMaterial = (colorKey, wireframe = false) => {
  const wood = woodColors[colorKey]
  const material = new THREE.MeshStandardMaterial({
    color: wood.color,
    roughness: wood.roughness,
    metalness: wood.metalness,
    wireframe: wireframe
  })
  
  if (form.config.barniz) {
    material.roughness *= 0.5
  }
  
  return material
}

// Funciones para crear diferentes tipos de muebles
const createEscritorio = (group, w, h, d, material) => {
  // Tablero principal
  const topGeo = new THREE.BoxGeometry(w, 0.03, d)
  const top = new THREE.Mesh(topGeo, material)
  top.position.y = h - 0.015
  group.add(top)

  // Panel izquierdo
  const leftPanelGeo = new THREE.BoxGeometry(0.03, h - 0.03, d * 0.95)
  const leftPanel = new THREE.Mesh(leftPanelGeo, material)
  leftPanel.position.set(-w/2 + 0.015, (h-0.03)/2, 0)
  group.add(leftPanel)

  // Cajonera derecha
  const drawerUnitWidth = 0.4
  const drawerUnitDepth = d * 0.95
  const drawerUnitGeo = new THREE.BoxGeometry(drawerUnitWidth, h - 0.03, drawerUnitDepth)
  const drawerUnit = new THREE.Mesh(drawerUnitGeo, material)
  drawerUnit.position.set(w/2 - drawerUnitWidth/2, (h-0.03)/2, 0)
  group.add(drawerUnit)

  // Cajones individuales
  const numDrawers = Math.max(1, form.config.cajones)
  const drawerHeight = (h - 0.05) / numDrawers - 0.02
  for (let i = 0; i < numDrawers; i++) {
    const drawerGeo = new THREE.BoxGeometry(drawerUnitWidth * 0.9, drawerHeight, drawerUnitDepth * 0.9)
    const drawer = new THREE.Mesh(drawerGeo, material)
    const yPos = h - 0.05 - drawerHeight/2 - i * (drawerHeight + 0.01)
    drawer.position.set(w/2 - drawerUnitWidth/2, yPos, 0)
    group.add(drawer)

    // Manija
    const handleGeo = new THREE.BoxGeometry(0.15, 0.02, 0.02)
    const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.2 })
    const handle = new THREE.Mesh(handleGeo, handleMaterial)
    handle.position.set(w/2 - drawerUnitWidth/2, yPos, drawerUnitDepth/2 - 0.02)
    group.add(handle)
  }
}

const createEstante = (group, w, h, d, material) => {
  // Laterales
  const sideGeo = new THREE.BoxGeometry(0.03, h, d)
  const sideLeft = new THREE.Mesh(sideGeo, material)
  sideLeft.position.set(-w/2 + 0.015, h/2, 0)
  group.add(sideLeft)
  
  const sideRight = new THREE.Mesh(sideGeo, material)
  sideRight.position.set(w/2 - 0.015, h/2, 0)
  group.add(sideRight)

  // Fondo
  const backGeo = new THREE.BoxGeometry(w - 0.06, h, 0.02)
  const back = new THREE.Mesh(backGeo, material)
  back.position.set(0, h/2, -d/2 + 0.01)
  group.add(back)

  // Estantes
  const shelfGeo = new THREE.BoxGeometry(w - 0.06, 0.03, d)
  
  // Estante inferior
  const bottomShelf = new THREE.Mesh(shelfGeo, material)
  bottomShelf.position.y = 0.015
  group.add(bottomShelf)

  // Estantes configurables
  const numShelves = Math.max(1, form.config.estantes)
  const shelfSpacing = h / (numShelves + 1)
  for (let i = 1; i <= numShelves; i++) {
    const shelf = new THREE.Mesh(shelfGeo, material)
    shelf.position.y = i * shelfSpacing
    group.add(shelf)
  }

  // Puertas si están configuradas
  if (form.config.puertas > 0) {
    const doorWidth = (w - 0.1) / form.config.puertas
    const doorHeight = h * 0.8
    
    for (let i = 0; i < form.config.puertas; i++) {
      let doorMaterial = material
      
      if (form.config.tipoPuertas === 'cristal') {
        doorMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xffffff, 
          transparent: true, 
          opacity: 0.3, 
          metalness: 0.1, 
          roughness: 0.0 
        })
      }
      
      const doorGeo = new THREE.BoxGeometry(doorWidth - 0.02, doorHeight, 0.02)
      const door = new THREE.Mesh(doorGeo, doorMaterial)
      door.position.set(-w/2 + doorWidth/2 + i * doorWidth, doorHeight/2 + 0.1, d/2 + 0.01)
      group.add(door)

      // Manija de la puerta
      const handleGeo = new THREE.SphereGeometry(0.015)
      const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9 })
      const handle = new THREE.Mesh(handleGeo, handleMaterial)
      handle.position.set(door.position.x + doorWidth/3, door.position.y, door.position.z + 0.02)
      group.add(handle)
    }
  }
}

const createMesa = (group, w, h, d, material) => {
  // Tablero
  let topGeo
  if (form.config.formaTablero === 'redonda') {
    const radius = Math.min(w, d) / 2
    topGeo = new THREE.CylinderGeometry(radius, radius, 0.08, 32)
  } else {
    topGeo = new THREE.BoxGeometry(w, 0.08, d)
  }
  
  const top = new THREE.Mesh(topGeo, material)
  top.position.y = h - 0.04
  group.add(top)

  // Patas según el tipo
  const legHeight = h - 0.08
  
  if (form.config.tipoPatas === 'cilindrica') {
    const legGeo = new THREE.CylinderGeometry(0.03, 0.03, legHeight)
    const legPositions = [
      [-w/2 + 0.15, legHeight/2, -d/2 + 0.15],
      [w/2 - 0.15, legHeight/2, -d/2 + 0.15],
      [-w/2 + 0.15, legHeight/2, d/2 - 0.15],
      [w/2 - 0.15, legHeight/2, d/2 - 0.15]
    ]
    
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, material)
      leg.position.set(x, y, z)
      group.add(leg)
    })
  }
}

const createArmario = (group, w, h, d, material) => {
  // Estructura principal
  const frameGeo = new THREE.BoxGeometry(w, h, d)
  const frame = new THREE.Mesh(frameGeo, material)
  frame.position.y = h/2
  group.add(frame)

  // Interior del armario
  const interiorGeo = new THREE.BoxGeometry(w - 0.05, h - 0.05, d - 0.05)
  const interiorMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f5f5 })
  const interior = new THREE.Mesh(interiorGeo, interiorMaterial)
  interior.position.y = h/2
  group.add(interior)

  // Puertas
  const doorWidth = (w - 0.1) / Math.max(1, form.config.puertas)
  const doorHeight = h - 0.1
  
  for (let i = 0; i < Math.max(1, form.config.puertas); i++) {
    const doorGeo = new THREE.BoxGeometry(doorWidth, doorHeight, 0.03)
    const door = new THREE.Mesh(doorGeo, material)
    door.position.set(-w/2 + doorWidth/2 + i * doorWidth, h/2, d/2 + 0.015)
    group.add(door)
  }
}

const createBanco = (group, w, h, d, material) => {
  // Asiento
  const seatGeo = new THREE.BoxGeometry(w, 0.08, d)
  const seat = new THREE.Mesh(seatGeo, material)
  seat.position.y = h - 0.04
  group.add(seat)

  // Base
  const baseGeo = new THREE.BoxGeometry(w - 0.1, h - 0.08, d - 0.1)
  const base = new THREE.Mesh(baseGeo, material)
  base.position.y = (h - 0.08) / 2
  group.add(base)
}

const createSilla = (group, w, h, d, material) => {
  // Asiento
  const seatGeo = new THREE.BoxGeometry(w, 0.05, d)
  const seat = new THREE.Mesh(seatGeo, material)
  seat.position.y = h * 0.5
  group.add(seat)

  // Respaldo
  const backrestGeo = new THREE.BoxGeometry(w, h * 0.4, 0.05)
  const backrest = new THREE.Mesh(backrestGeo, material)
  backrest.position.set(0, h * 0.7, -d/2 + 0.025)
  group.add(backrest)

  // Patas
  const legGeo = new THREE.CylinderGeometry(0.02, 0.02, h * 0.5)
  const legPositions = [
    [-w/2 + 0.05, h * 0.25, d/2 - 0.05],
    [w/2 - 0.05, h * 0.25, d/2 - 0.05],
    [-w/2 + 0.05, h * 0.45, -d/2 + 0.05],
    [w/2 - 0.05, h * 0.45, -d/2 + 0.05]
  ]
  
  legPositions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(legGeo, material)
    leg.position.set(x, y, z)
    group.add(leg)
  })
}

// Generar modelo 3D
const generateModel = async () => {
  isGenerating.value = true
  
  await nextTick()
  
  if (muebleGroup) {
    scene.remove(muebleGroup)
    muebleGroup.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose())
        } else {
          obj.material.dispose()
        }
      }
    })
  }

  muebleGroup = new THREE.Group()
  const { ancho, alto, profundidad, color, tipo } = form
  const w = ancho / 100
  const h = alto / 100
  const d = profundidad / 100
  const material = createWoodMaterial(color, wireframeMode.value)

  const furnitureCreators = {
    escritorio: createEscritorio,
    estante: createEstante,
    mesa: createMesa,
    armario: createArmario,
    banco: createBanco,
    silla: createSilla
  }

  const createFurniture = furnitureCreators[tipo]
  if (createFurniture) {
    createFurniture(muebleGroup, w, h, d, material)
  }

  muebleGroup.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })

  scene.add(muebleGroup)

  // Ajustar cámara según el tamaño
  const maxDim = Math.max(w, h, d)
  const targetDistance = Math.max(2.5, maxDim * 2 + 1)
  if (controls) {
    controls.targetDistance = targetDistance
    controls.currentDistance = targetDistance
  }
  
  isGenerating.value = false
}

// Generar mueble aleatorio
const generateRandomFurniture = async () => {
  if (isGenerating.value) return
  
  isGenerating.value = true
  
  // Seleccionar tipo aleatorio
  const randomFurniture = furnitureOptions.value[Math.floor(Math.random() * furnitureOptions.value.length)]
  selectFurniture(randomFurniture.id)
  
  // Dimensiones aleatorias dentro de límites
  const limits = dimensionLimits.value
  form.ancho = Math.floor(Math.random() * (limits.ancho.max - limits.ancho.min) + limits.ancho.min)
  form.alto = Math.floor(Math.random() * (limits.alto.max - limits.alto.min) + limits.alto.min)
  form.profundidad = Math.floor(Math.random() * (limits.profundidad.max - limits.profundidad.min) + limits.profundidad.min)
  
  // Color aleatorio
  const colorKeys = Object.keys(woodColors)
  form.color = colorKeys[Math.floor(Math.random() * colorKeys.length)]
  
  // Configuración aleatoria
  if (form.tipo === 'escritorio') {
    form.config.cajones = Math.floor(Math.random() * 4) + 1
    form.config.cerradura = Math.random() > 0.5
    form.config.gestionCables = Math.random() > 0.3
  }
  
  await generateModel()
}

// Descargar datos del mueble
const downloadFurnitureData = () => {
  const furnitureData = {
    tipo: form.tipo,
    nombre: currentFurniture.value?.name,
    dimensiones: {
      ancho: form.ancho,
      alto: form.alto,
      profundidad: form.profundidad,
      area: ((form.ancho / 100) * (form.profundidad / 100)).toFixed(2)
    },
    material: {
      tipo: form.color,
      nombre: materialName.value,
      propiedades: woodColors[form.color]
    },
    configuracion: form.config,
    fechaCreacion: new Date().toISOString(),
    version: '1.0'
  }

  // Descargar JSON
  const dataStr = JSON.stringify(furnitureData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `mueble-${form.tipo}-${Date.now()}.json`
  link.click()
  URL.revokeObjectURL(url)

  // Capturar imagen del canvas
  if (canvas.value) {
    try {
      canvas.value.toBlob((blob) => {
        if (blob) {
          const imgUrl = URL.createObjectURL(blob)
          const imgLink = document.createElement('a')
          imgLink.href = imgUrl
          imgLink.download = `mueble-${form.tipo}-${Date.now()}.png`
          imgLink.click()
          URL.revokeObjectURL(imgUrl)
        }
      })
    } catch (error) {
      console.warn('No se pudo capturar la imagen:', error)
    }
  }
}

// Inicializar escena 3D mejorada
const initScene = () => {
  if (!canvas.value) return

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x2c3e50)

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(2, 2, 4)

  renderer = new THREE.WebGLRenderer({ 
    canvas: canvas.value, 
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
    preserveDrawingBuffer: true // Para capturas de pantalla
  })
  
  // Configuración anti-blur mejorada
  const pixelRatio = Math.min(window.devicePixelRatio, 2)
  renderer.setPixelRatio(pixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.physicallyCorrectLights = true
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.8
  renderer.outputEncoding = THREE.sRGBEncoding

  controls = new AdvancedControls(camera, canvas.value)

  // Iluminación optimizada
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
  directionalLight.position.set(10, 10, 5)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  directionalLight.shadow.camera.near = 0.5
  directionalLight.shadow.camera.far = 50
  directionalLight.shadow.camera.left = -10
  directionalLight.shadow.camera.right = 10
  directionalLight.shadow.camera.top = 10
  directionalLight.shadow.camera.bottom = -10
  scene.add(directionalLight)

  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6)
  scene.add(hemisphereLight)

  // Suelo
  const floorGeometry = new THREE.PlaneGeometry(20, 20)
  const floorMaterial = new THREE.MeshLambertMaterial({ 
    color: 0x666666,
    transparent: true,
    opacity: 0.5
  })
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -1
  floor.receiveShadow = true
  scene.add(floor)

  animate()
  generateModel()
}

// Animación optimizada
const animate = () => {
  animationId = requestAnimationFrame(animate)
  
  if (controls) controls.update()
  
  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

// Redimensionar mejorado
const handleResize = () => {
  checkMobileView()
  
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    
    const pixelRatio = Math.min(window.devicePixelRatio, 2)
    renderer.setPixelRatio(pixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

// Métodos del wizard y UI
const selectFurniture = (furnitureId) => {
  const furniture = furnitureOptions.value.find(f => f.id === furnitureId)
  if (furniture) {
    form.tipo = furnitureId
    form.ancho = furniture.defaultDims.ancho
    form.alto = furniture.defaultDims.alto
    form.profundidad = furniture.defaultDims.profundidad
    
    // Resetear configuraciones específicas
    form.config = {
      // Escritorio
      cajones: furnitureId === 'escritorio' ? 2 : 0,
      cerradura: false,
      gestionCables: furnitureId === 'escritorio',
      superficie: 'lisa',
      
      // Estante
      estantes: furnitureId === 'estante' ? 3 : 0,
      ajustables: true,
      puertas: 0,
      tipoPuertas: 'opacas',
      
      // Mesa
      tipoPatas: 'cilindrica',
      extensible: false,
      cajonCentral: false,
      formaTablero: 'rectangular',
      
      // Armario
      barras: furnitureId === 'armario' ? 1 : 0,
      espejo: false,
      iluminacion: false,
      
      // Acabados
      barniz: true,
      ignifugo: false,
      resistenteAgua: false
    }
  }
}

const incrementValue = (key) => {
  if (key === 'cajones') {
    const max = form.tipo === 'armario' ? 8 : 6
    if (form.config[key] < max) form.config[key]++
  } else if (key === 'estantes' && form.config[key] < 10) {
    form.config[key]++
  } else if (key === 'puertas') {
    const max = form.tipo === 'armario' ? 6 : 4
    if (form.config[key] < max) form.config[key]++
  } else if (key === 'barras' && form.config[key] < 4) {
    form.config[key]++
  }
}

const decrementValue = (key) => {
  const min = key === 'estantes' || (key === 'puertas' && form.tipo === 'armario') ? 1 : 0
  if (form.config[key] > min) form.config[key]--
}

const nextStep = () => {
  if (currentStep.value < wizardSteps.length - 1) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const handleSubmit = async (e) => {
  e.preventDefault()
  await generateModel()
  showModal.value = false
  currentStep.value = 0
}

const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const resetCamera = () => {
  if (controls) {
    controls.reset()
  }
}

const toggleWireframe = () => {
  wireframeMode.value = !wireframeMode.value
  generateModel()
}

const toggleMobileInfo = () => {
  showMobileInfo.value = !showMobileInfo.value
}

// Watchers optimizados
watch([
  () => form.ancho, 
  () => form.alto, 
  () => form.profundidad, 
  () => form.color, 
  () => form.tipo,
  () => form.config
], () => {
  if (scene && renderer && camera && !showModal.value) {
    generateModel()
  }
}, { deep: true })

// Lifecycle hooks
onMounted(() => {
  checkMobileView()
  initScene()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (controls) {
    controls.dispose()
  }
  if (renderer) {
    renderer.dispose()
  }
  if (scene) {
    scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose()
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose())
        } else {
          object.material.dispose()
        }
      }
    })
  }
})
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.modal {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 24px;
  width: 95vw;
  max-width: 900px;
  max-height: 95vh;
  overflow: hidden;
  box-shadow: 0 32px 64px rgba(0,0,0,0.3);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  flex-direction: column;
}

.modal-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 1.5rem;
  text-align: center;
  position: relative;
}

.modal-header h1 {
  font-size: clamp(1.2rem, 4vw, 2rem);
  margin-bottom: 1rem;
  font-weight: 700;
}

.step-indicator {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.step {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  font-size: clamp(0.7rem, 2vw, 0.9rem);
}

.step.active {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.step.completed {
  background: rgba(46, 213, 115, 0.3);
}

.step-number {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.7rem;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(231, 76, 60, 0.8);
  transform: rotate(90deg);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.wizard-step {
  min-height: 300px;
}

.wizard-step h2 {
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
}

/* Paso 1: Selección de Muebles */
.furniture-grid-enhanced {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.furniture-card {
  background: white;
  border: 3px solid rgba(102, 126, 234, 0.2);
  border-radius: 20px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  min-height: 44px;
}

.furniture-card:hover {
  transform: translateY(-4px);
  border-color: #667eea;
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2);
}

.furniture-card.selected {
  border-color: #e74c3c;
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.1), rgba(231, 76, 60, 0.05));
  transform: translateY(-2px);
}

.furniture-icon {
  font-size: clamp(2rem, 6vw, 3rem);
  margin-bottom: 0.5rem;
  display: block;
}

.furniture-card h3 {
  font-size: clamp(0.9rem, 2.5vw, 1.2rem);
  color: #2c3e50;
  margin-bottom: 0.3rem;
}

.furniture-card p {
  color: #7f8c8d;
  font-size: clamp(0.7rem, 2vw, 0.9rem);
  margin-bottom: 0.5rem;
}

.furniture-preview {
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  padding: 0.3rem;
  font-size: clamp(0.6rem, 1.8vw, 0.8rem);
  color: #667eea;
  font-weight: 600;
}

/* Dimensiones */
.dimensions-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
}

.dimension-group {
  background: white;
  border-radius: 16px;
  padding: 1.2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.dimension-group label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
}

.dimension-control-enhanced {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dimension-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 12px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 6px;
  outline: none;
  cursor: pointer;
}

.dimension-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 28px;
  height: 28px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  border: 3px solid #667eea;
  transition: all 0.2s ease;
}

.dimension-input {
  padding: 0.8rem;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  text-align: center;
  font-weight: 600;
  transition: all 0.3s ease;
  min-height: 44px;
}

.dimension-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.dimension-preview {
  text-align: center;
  margin-top: 1.5rem;
}

.preview-box {
  margin: 0 auto;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: clamp(0.7rem, 2vw, 0.9rem);
  min-width: 60px;
  min-height: 40px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

/* Configuración */
.config-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
}

.config-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.config-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  flex-wrap: wrap;
  gap: 0.5rem;
  min-height: 44px;
}

.config-item label {
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(0.8rem, 2.2vw, 1rem);
  flex: 1;
  min-width: 120px;
}

.number-selector {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: white;
  border-radius: 12px;
  padding: 0.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.number-selector button {
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.number-selector button:hover:not(:disabled) {
  background: #5a67d8;
  transform: scale(1.05);
}

.number-selector button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
}

.toggle-switch {
  position: relative;
}

.toggle-switch input[type="checkbox"] {
  display: none;
}

.switch {
  display: block;
  width: 56px;
  height: 32px;
  background: #bdc3c7;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.switch::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 26px;
  height: 26px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

.toggle-switch input:checked + .switch {
  background: #27ae60;
}

.toggle-switch input:checked + .switch::after {
  transform: translateX(24px);
}

.select-enhanced {
  background: white;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 8px;
  padding: 0.6rem;
  font-weight: 600;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  font-size: clamp(0.8rem, 2.2vw, 1rem);
  min-height: 44px;
}

.select-enhanced:focus {
  outline: none;
  border-color: #667eea;
}

/* Material */
.color-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.color-option {
  background: white;
  border: 3px solid transparent;
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 44px;
}

.color-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.color-option.selected {
  border-color: #e74c3c;
  transform: translateY(-2px);
}

.color-swatch {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  flex-shrink: 0;
}

.color-info h4 {
  font-size: clamp(0.9rem, 2.5vw, 1.2rem);
  margin-bottom: 0.3rem;
  color: #2c3e50;
}

.color-info p {
  font-size: clamp(0.7rem, 2vw, 0.9rem);
  color: #7f8c8d;
  margin-bottom: 0.5rem;
}

.material-props {
  display: flex;
  gap: 1rem;
  font-size: clamp(0.6rem, 1.8vw, 0.8rem);
  color: #95a5a6;
  flex-wrap: wrap;
}

.finish-options {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
}

.finish-options h3 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: clamp(1rem, 2.8vw, 1.3rem);
}

.finish-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.finish-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  min-height: 44px;
}

.finish-item label {
  font-weight: 600;
  color: #2c3e50;
  font-size: clamp(0.8rem, 2.2vw, 1rem);
}

/* Navigation */
.wizard-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 2px solid rgba(102, 126, 234, 0.1);
  flex-wrap: wrap;
  gap: 1rem;
}

.btn-nav {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: clamp(0.8rem, 2.2vw, 1rem);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 44px;
  flex: 1;
  justify-content: center;
}

.btn-nav.prev {
  background: #95a5a6;
  color: white;
}

.btn-nav.prev:hover {
  background: #7f8c8d;
}

.btn-nav.next {
  background: #3498db;
  color: white;
}

.btn-nav.next:hover {
  background: #2980b9;
}

.btn-nav.generate {
  background: linear-gradient(45deg, #e74c3c, #c0392b);
  color: white;
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  padding: 1rem 2rem;
}

.btn-nav.generate:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(231, 76, 60, 0.4);
}

/* Floating Controls */
.floating-controls {
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 100;
}

.btn-floating {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0.8rem 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-weight: 600;
  white-space: nowrap;
  font-size: clamp(0.7rem, 2vw, 0.9rem);
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-floating:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-floating.main {
  background: linear-gradient(45deg, #667eea, #764ba2);
}

.btn-floating.new-furniture {
  background: linear-gradient(45deg, #2ecc71, #27ae60);
}

.btn-floating.download {
  background: linear-gradient(45deg, #f39c12, #e67e22);
}

.btn-floating.secondary {
  background: rgba(52, 73, 94, 0.8);
}

.btn-floating:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
}

.btn-text {
  display: inline;
}

/* Viewer */
.viewer {
  flex-grow: 1;
  background: radial-gradient(ellipse at center, #34495e 0%, #2c3e50 100%);
  position: relative;
  overflow: hidden;
}

canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
  touch-action: none;
}

/* Info Panel Desktop */
.info-panel-enhanced {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  border-radius: 16px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 320px;
  overflow: hidden;
}

.info-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.info-header h3 {
  font-size: clamp(0.9rem, 2.5vw, 1.2rem);
  margin: 0;
}

.info-status {
  font-size: clamp(0.7rem, 2vw, 0.9rem);
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
}

.info-status.loading {
  background: rgba(241, 196, 15, 0.3);
  animation: pulse 1.5s infinite;
}

.info-content {
  padding: 1rem;
}

.info-section {
  margin-bottom: 1rem;
}

.info-section:last-child {
  margin-bottom: 0;
}

.info-section h4 {
  color: #3498db;
  font-size: clamp(0.8rem, 2.2vw, 1rem);
  margin-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.3rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.3rem;
  font-size: clamp(0.7rem, 2vw, 0.9rem);
  flex-wrap: wrap;
  gap: 0.3rem;
}

.info-row.volume {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 0.5rem;
  margin-top: 0.5rem;
  font-size: clamp(0.8rem, 2.2vw, 1rem);
}

.spec-list {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.spec-item {
  background: rgba(52, 152, 219, 0.1);
  padding: 0.4rem;
  border-radius: 6px;
  font-size: clamp(0.7rem, 2vw, 0.8rem);
  border-left: 3px solid #3498db;
}

/* Mobile Info Panel */
.mobile-info-panel {
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  border-radius: 12px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.mobile-info-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 0.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.mobile-info-header h3 {
  font-size: clamp(0.8rem, 2.2vw, 1rem);
  margin: 0;
}

.mobile-toggle {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-info-content {
  padding: 0.8rem;
}

.mobile-specs {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: clamp(0.7rem, 2vw, 0.8rem);
}

/* Controls Help */
.controls-help-enhanced {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 12px;
  padding: 0.8rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.help-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.4rem;
  font-size: clamp(0.7rem, 2vw, 0.8rem);
}

.help-item:last-child {
  margin-bottom: 0;
}

.help-icon {
  font-size: 1rem;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from {
  transform: translateY(-30px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}

/* Animations */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Mobile Responsive Design */
@media (max-width: 768px) {
  .floating-controls {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    top: auto;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.5rem;
  }
  
  .btn-floating {
    flex: 1;
    min-width: 0;
    padding: 0.6rem 0.4rem;
    font-size: 0.7rem;
  }
  
  .btn-text {
    display: none;
  }
  
  .viewer {
    padding-bottom: 80px;
  }
  
  .info-panel-enhanced {
    display: none;
  }
  
  .controls-help-enhanced {
    display: none;
  }
  
  .modal {
    width: 98vw;
    max-width: none;
    margin: 0;
    border-radius: 16px;
  }
  
  .modal-header {
    padding: 1rem;
  }
  
  .step-indicator {
    gap: 0.3rem;
  }
  
  .step {
    padding: 0.3rem 0.5rem;
    font-size: 0.7rem;
  }
  
  .furniture-grid-enhanced {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
  }
  
  .furniture-card {
    padding: 0.8rem;
  }
  
  .config-item {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
    gap: 0.8rem;
  }
  
  .config-item label {
    justify-content: center;
    margin-bottom: 0;
  }
  
  .wizard-navigation {
    flex-direction: column;
    gap: 0.8rem;
  }
  
  .btn-nav {
    width: 100%;
  }
  
  .color-option {
    padding: 0.8rem;
  }
  
  .color-swatch {
    width: 50px;
    height: 50px;
  }
  
  .material-props {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .furniture-grid-enhanced {
    grid-template-columns: 1fr;
  }
  
  .dimensions-grid {
    gap: 1rem;
  }
  
  .dimension-group {
    padding: 1rem;
  }
  
  .floating-controls {
    gap: 0.3rem;
  }
  
  .btn-floating {
    padding: 0.5rem 0.3rem;
    font-size: 0.6rem;
  }
}

/* Touch-friendly adjustments */
@media (hover: none) and (pointer: coarse) {
  .furniture-card,
  .color-option,
  .btn-nav,
  .btn-floating,
  .number-selector button,
  .dimension-input,
  .select-enhanced {
    min-height: 48px;
  }
  
  .dimension-slider {
    height: 16px;
  }
  
  .dimension-slider::-webkit-slider-thumb {
    width: 32px;
    height: 32px;
  }
  
  .switch {
    width: 60px;
    height: 36px;
  }
  
  .switch::after {
    width: 30px;
    height: 30px;
    top: 3px;
    left: 3px;
  }
  
  .toggle-switch input:checked + .switch::after {
    transform: translateX(24px);
  }
  
  .close-btn {
    width: 44px;
    height: 44px;
    font-size: 1.5rem;
  }
  
  .mobile-toggle {
    width: 44px;
    height: 44px;
  }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  canvas {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .modal {
    background: rgba(45, 55, 72, 0.98);
    color: white;
  }
  
  .wizard-step h2,
  .config-item label,
  .dimension-group label,
  .furniture-card h3,
  .color-info h4,
  .finish-item label {
    color: white;
  }
  
  .furniture-card,
  .color-option,
  .config-section,
  .finish-options,
  .dimension-group {
    background: rgba(68, 80, 102, 0.8);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .dimension-input,
  .select-enhanced,
  .number-selector {
    background: rgba(68, 80, 102, 0.8);
    color: white;
    border-color: rgba(255, 255, 255, 0.2);
  }
}

/* Focus states for accessibility */
.furniture-card:focus,
.color-option:focus,
.btn-nav:focus,
.btn-floating:focus,
.dimension-input:focus,
.select-enhanced:focus,
.switch:focus {
  outline: 3px solid rgba(102, 126, 234, 0.5);
  outline-offset: 2px;
}

/* Loading spinner */
.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
}

/* Custom scrollbar */
.modal-body::-webkit-scrollbar {
  width: 4px;
}

.modal-body::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.1);
}

.modal-body::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.3);
  border-radius: 2px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.5);
}

/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Print styles */
@media print {
  .modal-backdrop,
  .floating-controls,
  .controls-help-enhanced {
    display: none;
  }
  
  .viewer {
    height: 100vh;
  }
  
  .info-panel-enhanced {
    position: static;
    background: white;
    color: black;
    border: 1px solid black;
    margin: 1rem;
  }
}
</style>