<template>
  <div class="products-contain">
    <div class="catalogo-container">
      <!-- CATEGORÍAS PRINCIPALES -->
      <div class="categorias">
        <button v-for="categoria in categorias" :key="categoria" @click="seleccionarCategoria(categoria)"
          :class="{ activo: categoria === categoriaSeleccionada }">
          {{ categoria }}
        </button>

        <!-- BOTÓN SUBCATEGORÍAS -->
        <div class="menu">
          <button @click="toggleMenu" class="menu-button">DECORACIÓN</button>

          <Transition name="slide">
            <div v-show="menuAbierto" class="menu-dropdown">
              <button v-for="sub in categoriasDeco" :key="sub" @click="seleccionarCategoriaDeco(sub)"
                :class="{ activo: sub === categoriasDecoSeleccionada }">
                {{ sub }}
              </button>
            </div>
          </Transition>
        </div>

      </div>

      <div class="contenido animate__fadeIn">
        <aside class="listado-productos">
          <div v-for="(producto, index) in productosMostrados" :key="index" class="producto-thumb"
            :class="{ seleccionado: productoSeleccionado === producto }" @click="seleccionarProducto(producto)">
            <img :src="producto.imagenMiniatura || producto.imagen" alt="Producto" />
          </div>
        </aside>

        <section class="detalle-producto" v-if="productoSeleccionado">
          <div class="detalle-imagen">
            <img :src="productoSeleccionado.imagen" alt="Producto grande" />
          </div>
          <div class="detalle-extra">
            <div class="miniaturas">
              <img :src="productoSeleccionado.imagen2" alt="Mini 1" class="mini" />
              <img :src="productoSeleccionado.imagen3" alt="Mini 2" class="mini" />
            </div>
            <div class="info">
              <h3>{{ productoSeleccionado.nombre }}</h3>
              <p>{{ productoSeleccionado.descripcion }}</p>
              <br />
              <h6><span>Nota: </span>{{ productoSeleccionado.nota }}</h6>
              <a v-if="productoSeleccionado.link" :href="productoSeleccionado.link" target="_blank" class="btn-ml">
                Ver en Mercado Libre
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted, onBeforeUnmount } from 'vue'
const linkMercadoLibre = 'https://listado.mercadolibre.com.mx/_CustId_1231250507'

const menuAbierto = ref(false)
function toggleMenu() {
  menuAbierto.value = !menuAbierto.value
}
function cerrarMenu(event) {
  if (!event.target.closest('.menu')) {
    menuAbierto.value = false
  }
}
onMounted(() => {
  window.addEventListener('click', cerrarMenu)
})
onBeforeUnmount(() => {
  window.removeEventListener('click', cerrarMenu)
})

const categorias = ['PERSONALIZACIÓN', 'MUEBLES PARA BAÑO', 'COCINAS']
const categoriaSeleccionada = ref(categorias[0])
const categoriasDeco = ['ACRILICOS', 'VINIL', 'MDF', 'LAMBRÍN']
const categoriasDecoSeleccionada = ref(null)

const productos = ref([{
  imagenMiniatura: new URL('@/assets/model-1-1.webp', import.meta.url).href,
  categoria: 'MUEBLES PARA BAÑO',
  nombre: 'NANO',
  descripcion: 'Diseño compacto con cajón deslizable y puertas laterales. Máximo aprovechamiento del espacio con lavabo tipo bowl, perfecto para espacios reducidos.',
  nota: 'Todos los modelos están disponibles en 6 acabados de madera (Nogal, Polar, Rivera, Roble Cocoa, Noruego, Tundra) y cuentan con medidas específicas optimizadas para diferentes espacios de baño. El lavabo es opcional en todos los modelos.',
  imagen: new URL('@/assets/nano-model.jpg', import.meta.url).href,
  imagen2: new URL('@/assets/nano-model-2.jpg', import.meta.url).href,
  imagen3: new URL('@/assets/nano-model-3.jpg', import.meta.url).href,
  link: linkMercadoLibre,
},
{
  imagenMiniatura: new URL('@/assets/model-2-1.webp', import.meta.url).href,
  categoria: 'MUEBLES PARA BAÑO',
  nombre: 'GREG',
  descripcion: 'Con puerta lateral y compartimento abierto, perfecto para almacenamiento versátil. Incluye lavabo tipo bowl y acabado en madera natural con detalles modernos.',
  nota: 'Todos los modelos están disponibles en 6 acabados de madera (Nogal, Polar, Rivera, Roble Cocoa, Noruego, Tundra) y cuentan con medidas específicas optimizadas para diferentes espacios de baño. El lavabo es opcional en todos los modelos.',

  imagen: new URL('@/assets/greg-model.jpg', import.meta.url).href,
  imagen2: new URL('@/assets/greg-model-2.jpg', import.meta.url).href,
  imagen3: new URL('@/assets/greg-model-3.jpg', import.meta.url).href,
  link: linkMercadoLibre,
},
{
  imagenMiniatura: new URL('@/assets/model-3-1.webp', import.meta.url).href,
  categoria: 'MUEBLES PARA BAÑO',
  nombre: 'BORIS',
  descripcion: 'Compacto con diseño minimalista y puertas de madera natural. Ideal para baños pequeños con estilo rústico-moderno. ',
  nota: 'Todos los modelos están disponibles en 6 acabados de madera (Nogal, Polar, Rivera, Roble Cocoa, Noruego, Tundra) y cuentan con medidas específicas optimizadas para diferentes espacios de baño. El lavabo es opcional en todos los modelos.',
  imagen: new URL('@/assets/boris-model.jpg', import.meta.url).href,
  imagen2: new URL('@/assets/boris-model-2.jpg', import.meta.url).href,
  imagen3: new URL('@/assets/model-none.jpg', import.meta.url).href,
  link: linkMercadoLibre,
},
{
  imagenMiniatura: new URL('@/assets/model-4-1.webp', import.meta.url).href,
  categoria: 'MUEBLES PARA BAÑO',
  nombre: 'LIA',
  descripcion: 'Diseño con puertas frontales y compartimento inferior abierto. Combina almacenamiento cerrado y exhibición, ideal para baños de estilo industrial-moderno.',
  nota: 'Todos los modelos están disponibles en 6 acabados de madera (Nogal, Polar, Rivera, Roble Cocoa, Noruego, Tundra) y cuentan con medidas específicas optimizadas para diferentes espacios de baño. El lavabo es opcional en todos los modelos.',

  imagen: new URL('@/assets/lia-model.jpg', import.meta.url).href,
  imagen2: new URL('@/assets/lia-model-2.jpg', import.meta.url).href,
  imagen3: new URL('@/assets/model-none.jpg', import.meta.url).href,
  link: linkMercadoLibre,
},
{
  imagenMiniatura: new URL('@/assets/model-5-1.webp', import.meta.url).href,
  categoria: 'MUEBLES PARA BAÑO',
  nombre: 'RENI',
  descripcion: 'El más amplio de la colección con múltiples cajones y compartimentos. Diseño escalonado que maximiza el almacenamiento manteniendo un perfil elegante y funcional.',
  nota: 'Todos los modelos están disponibles en 6 acabados de madera (Nogal, Polar, Rivera, Roble Cocoa, Noruego, Tundra) y cuentan con medidas específicas optimizadas para diferentes espacios de baño. El lavabo es opcional en todos los modelos.',

  imagen: new URL('@/assets/reni-model.jpg', import.meta.url).href,
  imagen2: new URL('@/assets/reni-model-2.jpg', import.meta.url).href,
  imagen3: new URL('@/assets/reni-model-3.jpg', import.meta.url).href,
  link: linkMercadoLibre,
},
{
  imagenMiniatura: new URL('@/assets/model-6-1.webp', import.meta.url).href,
  categoria: 'MUEBLES PARA BAÑO',
  nombre: 'DANY',
  descripcion: 'Diseño funcional y moderno con dos cajones amplios. Estética minimalista que aporta orden y elegancia.',
  nota: 'Todos los modelos están disponibles en 6 acabados de madera (Nogal, Polar, Rivera, Roble Cocoa, Noruego, Tundra) y cuentan con medidas específicas optimizadas para diferentes espacios de baño. El lavabo es opcional en todos los modelos.',

  imagen: new URL('@/assets/dany-model.jpg', import.meta.url).href,
  imagen2: new URL('@/assets/dany-model-2.jpg', import.meta.url).href,
  imagen3: new URL('@/assets/model-none.jpg', import.meta.url).href,
  link: linkMercadoLibre,
},
{
  imagenMiniatura:new URL('@/assets/cocinas-miniatura.jpg', import.meta.url).href,
  categoria: 'COCINAS',
  nombre: 'COCINA INTEGRAL',
  descripcion: 'Cocina integral de madera con acabado tipo nogal. Incluye módulos superiores e inferiores, espacio para estufa y tarja. ',
  
  imagen: new URL('@/assets/modelo-cosina.webp', import.meta.url).href,
  imagen2: new URL('@/assets/model-none.jpg', import.meta.url).href,
  imagen3: new URL('@/assets/model-none.jpg', import.meta.url).href,
  nota: 'No incluye electrodomésticos, tarja ni accesorios, únicamente el mobiliario de madera mostrado. Contactanos para más información.',
  link: null,
},
{
  categoria: 'RECAMARAS',
  nombre: 'Recámara King',
  descripcion: 'Recámara amplia y elegante',
  imagen: 'https://via.placeholder.com/300x200',
  link: '#',
},
//personalizacion
{
  imagenMiniatura: new URL('@/assets/personalizar-miniatura.jpg', import.meta.url).href,
  categoria: 'PERSONALIZACIÓN',
  nombre: 'PERSONALIZACIÓN',
  nota: 'Personaliza tu producto con una amplia variedad de colores, acabados y detalles. Adaptamos cada pieza a tu estilo y necesidades, brindando opciones únicas que reflejan tu gusto. Contactanos para mas información.',
  descripcion: 'Personaliza tus ideas',
  imagen: new URL('@/assets/personalizacion-3.jpg', import.meta.url).href,
  imagen2: new URL('@/assets/model-none.jpg', import.meta.url).href,
  imagen3: new URL('@/assets/model-none.jpg', import.meta.url).href,
  link: null,



},
{
  imagenMiniatura: new URL('@/assets/personalizar-miniatura.jpg', import.meta.url).href,
  categoria: 'PERSONALIZACIÓN',
  nombre: 'PERSONALIZACIÓN',
  nota: 'Personaliza tu producto con una amplia variedad de colores, acabados y detalles. Adaptamos cada pieza a tu estilo y necesidades, brindando opciones únicas que reflejan tu gusto. Contactanos para mas información.',
  descripcion: 'Personaliza tus ideas',
  imagen: new URL('@/assets/personalizacion-4.jpg', import.meta.url).href,
  imagen2: new URL('@/assets/model-none.jpg', import.meta.url).href,
  imagen3: new URL('@/assets/model-none.jpg', import.meta.url).href,
  link: null,



},
{
  imagenMiniatura: new URL('@/assets/personalizar-miniatura.jpg', import.meta.url).href,
  categoria: 'PERSONALIZACIÓN',
  nombre: 'PERSONALIZACIÓN',
  nota: 'Personaliza tu producto con una amplia variedad de colores, acabados y detalles. Adaptamos cada pieza a tu estilo y necesidades, brindando opciones únicas que reflejan tu gusto. Contactanos para mas información.',
  descripcion: 'Personaliza tus ideas',
  imagen: new URL('@/assets/personalizacion-5.jpg', import.meta.url).href,
  imagen2: new URL('@/assets/model-none.jpg', import.meta.url).href,
  imagen3: new URL('@/assets/model-none.jpg', import.meta.url).href,
  link: null,



},
{
  imagenMiniatura: new URL('@/assets/personalizar-miniatura.jpg', import.meta.url).href,
  categoria: 'PERSONALIZACIÓN',
  nombre: 'PERSONALIZACIÓN',
  nota: 'Personaliza tu producto con una amplia variedad de colores, acabados y detalles. Adaptamos cada pieza a tu estilo y necesidades, brindando opciones únicas que reflejan tu gusto. Contactanos para mas información.',
  descripcion: 'Personaliza tus ideas',
  imagen: new URL('@/assets/personalizacion-2.webp', import.meta.url).href,
  imagen2: new URL('@/assets/mdf-use.jpg', import.meta.url).href,
  imagen3: new URL('@/assets/model-none.jpg', import.meta.url).href,
  link: null,



},
{
  imagenMiniatura: new URL('@/assets/personalizar-miniatura.jpg', import.meta.url).href,
  categoria: 'PERSONALIZACIÓN',
  nombre: 'PERSONALIZACIÓN',
  nota: 'Personaliza tu producto con una amplia variedad de colores, acabados y detalles. Adaptamos cada pieza a tu estilo y necesidades, brindando opciones únicas que reflejan tu gusto. Contactanos para mas información.',
  descripcion: 'Personaliza tus ideas',
  imagen: new URL('@/assets/personalizacion-1.webp', import.meta.url).href,
  imagen2: new URL('@/assets/deco-acrilicos-miniatura.jpg', import.meta.url).href,
  imagen3: new URL('@/assets/model-none.jpg', import.meta.url).href,
  link: null,



},

// decoración
//acrilicos
{
  imagenMiniatura: new URL('@/assets/deco-acrilicos-miniatura.jpg', import.meta.url).href,
  categoria: 'DECORACIÓN',
  nombre: 'ACRILICOS',
  nota: 'Letreros Sin Luz en Acrilicos',
  descripcion: 'Ideal para sala o recámara o decoraciones exteriores',
  imagen: new URL('@/assets/model-acrilicos-1.jpg', import.meta.url).href,
  imagen2: new URL('@/assets/corte-laser.jpg', import.meta.url).href,
  imagen3: new URL('@/assets/model-none.jpg', import.meta.url).href,


  link: linkMercadoLibre,
},
{
  imagenMiniatura: new URL('@/assets/deco-acrilicos-miniatura.jpg', import.meta.url).href,
  categoria: 'DECORACIÓN',
  nombre: 'ACRILICOS',
  nota: 'Colores',
  imagen: new URL('@/assets/model-acrilicos-3.jpg', import.meta.url).href,
  imagen2: new URL('@/assets/corte-laser.jpg', import.meta.url).href,
  imagen3: new URL('@/assets/model-none.jpg', import.meta.url).href,
  link: linkMercadoLibre,
},
{
  imagenMiniatura: new URL('@/assets/deco-acrilicos-miniatura.jpg', import.meta.url).href,
  categoria: 'DECORACIÓN',
  nombre: 'ACRILICOS',
  nota: 'Letras personalizadas en MDF o acrílico, ideales para decorar habitaciones, eventos o regalos especiales. Diseño elegante y preciso',
  descripcion: 'Nombres en Corte Laser',
  imagen: new URL('@/assets/model-laser-1.jpg', import.meta.url).href,
  imagen2: new URL('@/assets/corte-laser.jpg', import.meta.url).href,
  imagen3: new URL('@/assets/model-none.jpg', import.meta.url).href,


  link: linkMercadoLibre,
},
{
  imagenMiniatura: new URL('@/assets/deco-acrilicos-miniatura.jpg', import.meta.url).href,
  categoria: 'DECORACIÓN',
  nombre: 'ACRILICOS',
  nota: 'Combinación creativa de MDF y acrílico para lograr piezas decorativas únicas y modernas. Perfectos para muros, letreros, logotipos o detalles personalizados.',
  descripcion: 'Diseños MDF con acrilico',
  imagen: new URL('@/assets/model-acrilicos-4.jpg', import.meta.url).href,
  imagen2: new URL('@/assets/corte-laser.jpg', import.meta.url).href,
  imagen3: new URL('@/assets/mdf-use.jpg', import.meta.url).href,


  link: linkMercadoLibre,
},


// decoración
//vinil
{
  imagenMiniatura: new URL('@/assets/deco-vinil-miniatura.jpg', import.meta.url).href,
  categoria: 'DECORACIÓN',
  nombre: 'VINIL',
  nota: 'Letreros decorativos elaborados en acrílico con vinil autoadherible. Ideales para interiores, brindan una solución estética y económica sin iluminación.',
  descripcion: 'Letreros sin luz en acrilico y vinil',
  imagen: new URL('@/assets/model-vinil-1.jpg', import.meta.url).href,
  imagen2: new URL('@/assets/corte-laser.jpg', import.meta.url).href,
  imagen3: new URL('@/assets/deco-acrilicos-miniatura.jpg', import.meta.url).href,


  link: linkMercadoLibre,
},
{
  imagenMiniatura: new URL('@/assets/deco-vinil-miniatura.jpg', import.meta.url).href,
  categoria: 'DECORACIÓN',
  nombre: 'VINIL',
  nota: 'Letreros decorativos elaborados en acrílico con vinil autoadherible. Ideales para interiores, brindan una solución estética y económica sin iluminación.',
  descripcion: 'Letreros sin luz en acrilico y vinil',
  imagen: new URL('@/assets/model-vinil-2.jpg', import.meta.url).href,
  imagen2: new URL('@/assets/corte-laser.jpg', import.meta.url).href,
  imagen3: new URL('@/assets/deco-acrilicos-miniatura.jpg', import.meta.url).href,


  link: linkMercadoLibre,
},
//MDF
{
  imagenMiniatura: new URL('@/assets/mdf-use.jpg', import.meta.url).href,
  categoria: 'DECORACIÓN',
  nombre: 'MDF',
  nota: 'Decoración personalizada en MDF con detalles en acrílico. Diseños tiernos y coloridos ideales para dar la bienvenida a recién nacidos o decorar espacios infantiles.',
  descripcion: 'Diseños MDF C/ Acrilico - Babys Welcome',
  imagen: new URL('@/assets/model-mdf-1.jpg', import.meta.url).href,
  imagen2: new URL('@/assets/corte-laser.jpg', import.meta.url).href,
  imagen3: new URL('@/assets/mdf-use.jpg', import.meta.url).href,


  link: linkMercadoLibre,
},
{
  imagenMiniatura: new URL('@/assets/mdf-use.jpg', import.meta.url).href,
  categoria: 'DECORACIÓN',
  nombre: 'MDF',
  nota: 'Combinación creativa de MDF y acrílico para lograr piezas decorativas únicas y modernas. Perfectos para muros, letreros, logotipos o detalles personalizados.',
  descripcion: 'Diseños MDF con acrilico',
  imagen: new URL('@/assets/model-acrilicos-4.jpg', import.meta.url).href,
  imagen2: new URL('@/assets/deco-acrilicos-miniatura.jpg', import.meta.url).href,
  imagen3: new URL('@/assets/mdf-use.jpg', import.meta.url).href,


  link: linkMercadoLibre,
},
{
  imagenMiniatura: new URL('@/assets/mdf-use.jpg', import.meta.url).href,
  categoria: 'DECORACIÓN',
  nombre: 'TIPO DE MADERA: MDF',
  nota: 'MEDIDAS ESTANDAR',
  descripcion: 'Diseños MDF',
  imagen: new URL('@/assets/mdf-use-1.jpg', import.meta.url).href,
  imagen2: new URL('@/assets/mdf-use.jpg', import.meta.url).href,
  imagen3: new URL('@/assets/model-none.jpg', import.meta.url).href,



  link: linkMercadoLibre,
},
//Lambrin
{
  imagenMiniatura: new URL('@/assets/deco-lambrin-miniatura.jpg', import.meta.url).href,
  categoria: 'DECORACIÓN',
  nombre: 'LAMBRÍN',
  nota: 'Letreros con o sin luz LED fabricados en lambrín de madera y acrílico, ideales para interiores modernos. Combinan estilo decorativo y funcionalidad para destacar marcas o mensajes.',
  descripcion: 'Letreros de Lambrín con o Sin Luz Led en Acrilico',
  imagen: new URL('@/assets/model-lambrin-1.jpg', import.meta.url).href,
  imagen2: new URL('@/assets/deco-acrilicos-miniatura.jpg', import.meta.url).href,
  imagen3: new URL('@/assets/model-none.jpg', import.meta.url).href,



  link: linkMercadoLibre,
},



]);

const productoSeleccionado = ref(null)
const seleccionarCategoria = (categoria) => {
  categoriaSeleccionada.value = categoria
  categoriasDecoSeleccionada.value = null
  productoSeleccionado.value = null
}
const seleccionarCategoriaDeco = (sub) => {
  categoriasDecoSeleccionada.value = sub
  categoriaSeleccionada.value = 'DECORACIÓN'
  productoSeleccionado.value = null
}
const seleccionarProducto = (producto) => {
  productoSeleccionado.value = producto
}

const productosMostrados = computed(() => {
  return productos.value.filter(p => {
    if (categoriaSeleccionada.value !== 'DECORACIÓN') {
      return p.categoria === categoriaSeleccionada.value
    }
    return p.categoria === 'DECORACIÓN' &&
      (!categoriasDecoSeleccionada.value || p.nombre.toUpperCase().includes(categoriasDecoSeleccionada.value))
  })
})

watchEffect(() => {
  if (!productoSeleccionado.value && productosMostrados.value.length > 0) {
    productoSeleccionado.value = productosMostrados.value[0]
  }
})
</script>

<style scoped>
.catalogo-container {
  background: white;
  padding: 2rem;

  padding-left: 10rem;
}

.categorias {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.categorias button {
  background: none;
  border: 1px solid #000;
  padding: 0.4rem 1rem;
  cursor: pointer;
}

.categorias .activo {
  background: #000;
  color: #fff;
}

.contenido {
  display: flex;
  gap: 2rem;

}

.listado-productos {
  width: 80px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.producto-thumb {
  border: 2px solid transparent;
  transition: border-color 0.2s;
}

.producto-thumb img {
  width: 100%;
  cursor: pointer;
  border-radius: 4px;
}

.producto-thumb.seleccionado {
  border-color: #0000009d;
}

.detalle-producto {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  flex: 1;
}

.detalle-imagen img {
  width: 100%;
  max-width: 600px;
  height: auto;
  border-radius: 8px;
}

.detalle-extra {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

.miniaturas {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.mini {
  width: 100px;
  border-radius: 8px;
  border: 1px solid #cccccc00;
}

.info h3 {
  margin: 1rem 0 0.5rem;
}

.btn-ml {
  display: inline-block;
  background: #f5e400;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: rgb(45 50 119);
  border-radius: 4px;
  margin-top: 1rem;
  font-weight: bold;
}

/**Desplegable */
.menu {
  position: relative;
  display: inline-block;
  text-align: left;

}

.menu-button {}

.menu-button:hover {
  background-color: #f9fafb;
  /* gray-50 */
}

.menu-icon {
  margin-left: 0.5rem;
  /* ml-2 */
  height: 1.25rem;
  /* h-5 */
  width: 1.25rem;
  /* w-5 */
  stroke: currentColor;
}

.menu-dropdown {
  position: absolute;
  display: flex;
  right: 0;
  margin-top: 0.5rem;
  /* mt-2 */

  border-radius: 0.375rem;
  /* rounded-md */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -4px rgba(0, 0, 0, 0.1);
  /* shadow-lg */
  background-color: #ffffff;
  ring: 1px solid rgba(0, 0, 0, 0.05);
  /* ring-1 ring-black ring-opacity-5 */
  z-index: 10;
}

.menu-items {
  padding-top: 0.25rem;
  /* py-1 */
  padding-bottom: 0.25rem;
}

.menu-item {
  display: block;
  padding: 0.5rem 1rem;
  /* px-4 py-2 */
  font-size: 0.875rem;
  /* text-sm */
  color: #374151;
  /* gray-700 */
  text-decoration: none;
}

.menu-item:hover {
  background-color: #f3f4f6;
  /* gray-100 */
}

/* Transición base */
.slide-enter-active,
.slide-leave-active {
  transition: all 300ms ease;
}

/* Animación de entrada (slide up) */
.slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* Animación de salida (slide down) */
.slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}



/* RESPONSIVE */
@media (max-width: 768px) {
  .catalogo-container {

    padding-left: 3rem;
  }

  .contenido {
    flex-direction: column;
  }

  .listado-productos {
    flex-direction: row;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    max-height: none;
    padding-bottom: 1rem;
  }

  .producto-thumb {
    min-width: 60px;
  }

  .detalle-producto {
    flex-direction: column;
    align-items: center;
  }

  .detalle-imagen img {
    width: 100%;
    max-width: 100%;
  }

  .miniaturas {
    justify-content: center;
  }

  .info {
    text-align: center;
  }
}

/* Responsive de dropdown submenu - deco */
@media (max-width: 640px) {
  .menu {
    width: 100%;
  }

  .menu-dropdown {
    display: inline;
    left: 0;
    right: 0;
    max-width: 100%;
    width: 100%;
    margin: 0;
    top: 100%;
    border-radius: 0;
  }

  .menu-dropdown {
    overflow-x: auto;
  }

  .menu-button {
    width: 100%;
    text-align: left;
  }
}

/* Estilo de los items */
.menu-item {
  display: block;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #374151;
  text-decoration: none;
  white-space: nowrap;
}

.menu-item:hover {
  background-color: #f3f4f6;
}
</style>

<!-- estilos--safari nav -->
 <style scoped>
@media not all and (min-resolution: 0.001dpcm) {
  @supports (-webkit-appearance: none) {
    .catalogo-container {
      padding-left: 4rem; /* Mejor ajuste para evitar desbordes horizontales */
    }

    .contenido {
      flex-direction: column;
    }

    .listado-productos {
      flex-direction: row;
      overflow-x: scroll;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      max-height: none;
      padding-bottom: 1rem;
    }

    .producto-thumb {
      min-width: 60px;
    }

    .detalle-producto {
      flex-direction: column;
      align-items: center;
    }

    .detalle-imagen img {
      width: 100%;
      max-width: 100%;
      height: auto;
    }

    .miniaturas {
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.5rem;
    }

    .menu-dropdown {
      width: 100%;
      left: 0 !important;
      right: 0 !important;
      max-width: 100%;
      overflow-x: auto;
    }

    .menu-button {
      width: 100%;
      text-align: left;
    }

    .menu-item {
      white-space: nowrap;
    }
  }
}

</style>