<template>
  <div class="not-found-container">
    <h1>404</h1>
    <h2>Página no encontrada</h2>
    <p>Lo sentimos, la página que buscas no existe o ha sido movida.</p>
    <a href="/" class="btn-home">Volver al inicio</a>
  </div>
</template>

<style scoped>
.not-found-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  text-align: center;
  padding: 2rem;

  color: #333;
}

.not-found-container h1 {
  font-size: 8rem;
  margin: 0;
  color: #000000;
  font-weight: bold;
}

.not-found-container h2 {
  font-size: 2rem;
  margin: 0.5rem 0 1.5rem;
}

.not-found-container p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.btn-home {
  background-color: #000000;
  color: white;
  text-decoration: none;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.btn-home:hover {
  background-color: #0056b3;
}
</style>
