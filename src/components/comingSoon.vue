<template>
  <div class="coming-soon">
    <div class="content">
      <h1>Próximamente venta en línea</h1>
      <p>Estamos trabajando para ofrecerte una nueva experiencia de compra. ¡Muy pronto!</p>
    </div>
  </div>
</template>

<script setup>
// No se requiere lógica por ahora
</script>

<style scoped>
.coming-soon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 1rem;
  background: linear-gradient(135deg, #999999, #000000);
  color: #fff;
  text-align: center;
}

.content {
  max-width: 600px;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
}

@media (max-width: 600px) {
  h1 {
    font-size: 2rem;
  }

  p {
    font-size: 1rem;
  }
}
</style>
<!-- estilos--safari nav -->
 <style scoped>
@media not all and (min-resolution: 0.001dpcm) {
  @supports (-webkit-appearance: none) {
    /* Estilos específicos para Safari */
    .coming-soon {
      background: linear-gradient(135deg, #333333, #000000);
    }

    h1 {
      font-size: 2.4rem;
    }

    p {
      font-size: 1.15rem;
    }
  }
}
</style>