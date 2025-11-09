# Instrucciones para ejecutar y probar la API

## 1. Instala dependencias
```bash
npm install
```

## 2. Ejecuta en modo desarrollo (hot reload con ts-node-dev)
```bash
npm run dev
```
O, si deseas compilar y correr la versión build:
```bash
npm run build
npm start
```

La API quedará disponible en [http://localhost:3000/api](http://localhost:3000/api).

---

## 3. Prueba manual con curl o Postman

### Crear tarea
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Ejemplo título", "description": "Descripción opcional"}'
```

### Listar tareas
```bash
curl http://localhost:3000/api/tasks
```

### Actualizar estado de tarea (requiere ID)
```bash
curl -X PATCH http://localhost:3000/api/tasks/<ID-TAREA> \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}'
```

---

# Ejemplo de pruebas automáticas

Asegúrate de instalar las dependencias de desarrollo para pruebas:
```bash
npm install --save-dev jest supertest @types/jest @types/supertest
```

Agrega este archivo de ejemplo:

````typescript name=src/__tests__/tasks.test.ts
import request from "supertest";
import app from "../app";

describe("Gestor de tareas API", () => {
  let taskId: string;

  it("Crea una tarea válida y la devuelve", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "Test Tarea", description: "Desc de test" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.status).toBe("pending");
    taskId = res.body.id;
  });

  it("Rechaza un título vacío", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "" });
    expect(res.statusCode).toBe(400);
  });

  it("Lista tareas y las ordena por 'created_at' DESC", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("id");
  });

  it("Actualiza el estado permitiendo solo transiciones válidas", async () => {
    // pending -> in_progress
    let res = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .send({ status: "in_progress" });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("in_progress");

    // in_progress -> done
    res = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .send({ status: "done" });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("done");

    // done -> pending (no permitido, error esperado)
    res = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .send({ status: "pending" });
    expect(res.statusCode).toBe(400);
  });
});