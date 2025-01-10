async function fetchResults() {
  const resultsElement = document.getElementById("results");
  resultsElement.innerHTML =
    '<div class="sensor-card"><p>Cargando datos...</p></div>';

  try {
    // Hacer la petición GET a la API para obtener los datos procesados
    const response = await fetch("/api/procesar");
    const data = await response.json();
    console.log(data); // Verifica qué está devolviendo el servidor

    let resultHtml = "";

    // Iterar sobre los sensores y generar el HTML con los resultados
    for (const [sensor, resultado] of Object.entries(data)) {
      resultHtml += `
  <div class="sensor-card">
    <h2>${sensor}</h2>
    <ul>
      <li><span>Promedio:</span> ${
        isNaN(resultado.promedio)
          ? "Datos no disponibles"
          : resultado.promedio
      }</li>
      <li><span>Desviación estándar:</span> ${
        isNaN(resultado.desviacionEstandar)
          ? "Datos no disponibles"
          : resultado.desviacionEstandar
      }</li>
      <li><span>Desviación cuadrática media:</span> ${
        isNaN(resultado.desviacionCuadraticaMedia)
          ? "Datos no disponibles"
          : resultado.desviacionCuadraticaMedia
      }</li>
      <li><span>Error probable:</span> ${
        isNaN(resultado.errorProbable)
          ? "Datos no disponibles"
          : resultado.errorProbable
      }</li>
      <li><span>Error límite:</span> ${
        isNaN(resultado.errorLimite)
          ? "Datos no disponibles"
          : resultado.errorLimite
      }</li>
    </ul>
  </div>
`;
    }

    // Mostrar los resultados en la página
    resultsElement.innerHTML = resultHtml;
  } catch (error) {
    resultsElement.innerHTML = `<div class="sensor-card"><p>Error al cargar datos: ${error.message}</p></div>`;
  }
}
