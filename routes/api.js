import express from "express";
import Sensor from "../models/sensores.js";
import connectDB from "../db.js";
import { Console } from "console";
const router = express.Router();

// Ruta POST para insertar datos
router.post("/datos", async (req, res) => {
  const { sensores } = req.body;

  if (!sensores || typeof sensores !== "object") {
    return res.status(400).json({
      error: "Formato de datos inválido. Se esperaba un objeto con arreglos de sensores.",
    });
  }

  try {
    const documentos = Object.entries(sensores).map(([sensor, valores]) => ({
      sensor,
      valores
    }));
    
    console.log(documentos);  // Verifica que los documentos tienen el formato correcto
    
    // Insertar directamente el array de documentos en la base de datos
    const s=await Sensor.insertMany(documentos);
    console.log(s)
    res.json({ message: "Datos registrados correctamente", data: sensores });
  } catch (error) {
    console.error("Error al registrar los datos:", error);
    res.status(500).json({ error: "No se pudo registrar los datos." });
  }
});

// Ruta GET para procesar datos
router.get("/procesar", async (req, res) => {
  try {
    const datos = await Sensor.find();
    console.log(datos);
    
    if (datos.length === 0) {
      return res.json({ message: "No hay datos registrados." });
    }

    const sensores = {};

    // Agrupa los datos por sensor
    datos.forEach(({ sensor, valores }) => { // Ahora accedemos a 'valores' en lugar de 'valor'
      if (!sensores[sensor]) sensores[sensor] = [];
      sensores[sensor].push(...valores); // Usamos el operador spread para agregar todos los valores
      console.log(valores); // Muestra los valores (que es un arreglo)
    });

    const resultados = {};

    // Realiza cálculos por cada sensor
    for (const [sensor, valores] of Object.entries(sensores)) {
      const n = valores.length;
      const promedio = valores.reduce((a, b) => a + b, 0) / n;
      const sumCuadrados = valores.reduce((sum, x) => sum + (x - promedio) ** 2, 0);
      const desviacionEstandar = Math.sqrt(sumCuadrados / n)**2;
      const desviacionCuadraticaMedia = Math.sqrt(sumCuadrados / n);
      const errorProbable = 0.6745 * desviacionEstandar;
      const errorLimite = 0.01 * promedio;

      resultados[sensor] = {
        promedio,
        desviacionEstandar,
        desviacionCuadraticaMedia,
        errorProbable,
        errorLimite,
      };
    }

    console.log(resultados);
    res.json(resultados);
  } catch (error) {
    console.error("Error al procesar datos:", error);
    res.status(500).json({ error: "Error interno al procesar los datos." });
  }
});


export default router;
