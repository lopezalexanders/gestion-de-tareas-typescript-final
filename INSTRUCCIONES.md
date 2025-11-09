# Guía de instalación y uso

## 1. Requisitos previos
- Node.js 18 o superior
- npm 9 o superior

## 2. Instalar dependencias
```bash
npm install
```

## 3. Ejecutar en modo desarrollo
Levanta la API y el frontend con recarga en caliente usando ts-node-dev:
```bash
npm run dev
```
Luego abre [http://localhost:3000](http://localhost:3000) en tu navegador. Desde la interfaz web podrás:
- Crear nuevas tareas.
- Listar las tareas existentes.
- Cambiar el estado entre **Pendiente → En progreso → Completada** siguiendo las reglas de negocio.

La API REST sigue disponible bajo el prefijo [/api](http://localhost:3000/api). Puedes seguir utilizando herramientas como curl o Postman si lo prefieres.

## 4. Compilar y ejecutar la versión compilada
```bash
npm run build
npm start
```
Esto generará los archivos en `dist/` y expondrá tanto la API como el frontend listo para producción.

---

## Anexo: ejemplos de pruebas manuales con curl

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

## Anexo: ejemplo de pruebas automáticas

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
````
