import express from "express";
import taskRoutes from "./routes/taskRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", taskRoutes);

app.get("/", (_req, res) => {
  res.send("MVP Gestor de Tareas DevPro Bolivia - API funcionando.");
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});