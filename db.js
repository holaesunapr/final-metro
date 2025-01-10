import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const mongoURI = process.env.DATA_BASE_URI;

async function connectDB() {
  try {
    await mongoose.connect(mongoURI);
    console.log("Conexión exitosa a MongoDB con Mongoose");
    const db = mongoose.connection.db;

    // Listar todas las colecciones
    const colecciones = await db.listCollections().toArray();
    console.log(
      "Colecciones disponibles:",
      colecciones.map((c) => c.name)
    );
  } catch (error) {
    console.error("Error al conectar a MongoDB con Mongoose:", error);
    process.exit(1); // Finaliza el proceso si falla la conexión
  }
}

export default connectDB;
