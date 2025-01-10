import mongoose from "mongoose";

const SensorSchema = new mongoose.Schema({
  sensor: { type: String, required: true },
  valores: { type: [Number], required: true }, // Cambié 'valor' a 'valores' como un arreglo de números
  fecha: { type: Date, default: Date.now },
});

const Sensor = mongoose.model("Sensor", SensorSchema,"datos_sensores");

export default Sensor;

