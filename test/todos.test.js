const BASE_URL = "https://dummyjson.com/todos";

describe("DummyJSON - Todos API", () => {

  test("Deve listar todos os todos", async () => {
    const response = await fetch(BASE_URL);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("todos");
    expect(Array.isArray(data.todos)).toBe(true);
    expect(data.todos.length).toBeGreaterThan(0);
  });

  test("Deve retornar um todo pelo ID", async () => {
    const response = await fetch(`${BASE_URL}/1`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("id", 1);
    expect(data).toHaveProperty("todo");
    expect(data).toHaveProperty("completed");
    expect(data).toHaveProperty("userId");
    expect(typeof data.id).toBe("number");
    expect(typeof data.todo).toBe("string");
    expect(typeof data.completed).toBe("boolean");
  });

  test("Deve retornar 404 para todo inexistente", async () => {
    const response = await fetch(`${BASE_URL}/99999`);

    expect(response.status).toBe(404);
  });

  test("Deve criar um novo todo via POST", async () => {
    const novoTodo = {
      todo: "Estudar para a prova",
      completed: false,
      userId: 1,
    };

    const response = await fetch(`${BASE_URL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoTodo),
    });

    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toHaveProperty("id");
    expect(data.todo).toBe(novoTodo.todo);
    expect(data.completed).toBe(novoTodo.completed);
    expect(data.userId).toBe(novoTodo.userId);
  });

  test("Deve atualizar um todo via PUT", async () => {
    const atualizacao = {
      todo: "Todo atualizado completo",
      completed: true,
    };

    const response = await fetch(`${BASE_URL}/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(atualizacao),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("id");
    expect(data.todo).toBe(atualizacao.todo);
    expect(data.completed).toBe(true);
  });

  test("Deve atualizar apenas o campo completed via PATCH", async () => {
    const response = await fetch(`${BASE_URL}/1`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: true }),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("id");
    expect(data.completed).toBe(true);
    expect(typeof data.todo).toBe("string");
  });

  test("Deve retornar todos com limite via query param", async () => {
    const response = await fetch(`${BASE_URL}?limit=5`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("todos");
    expect(data.todos.length).toBe(5);
    expect(data).toHaveProperty("limit", 5);
  });

  test("Deve retornar todos com skip e limit corretos", async () => {
    const response = await fetch(`${BASE_URL}?limit=3&skip=10`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("todos");
    expect(data.todos.length).toBe(3);
    expect(data).toHaveProperty("skip", 10);
    expect(data).toHaveProperty("total");
    expect(typeof data.total).toBe("number");
  });

  test("Deve retornar todos de um usuário específico", async () => {
    const response = await fetch(`${BASE_URL}/user/1`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("todos");
    expect(Array.isArray(data.todos)).toBe(true);
    expect(data.todos.length).toBeGreaterThan(0);
    data.todos.forEach((todo) => {
      expect(todo.userId).toBe(1);
    });
  });

  test("Deve deletar um todo via DELETE", async () => {
    const response = await fetch(`${BASE_URL}/1`, {
      method: "DELETE",
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("id", 1);
    expect(data).toHaveProperty("isDeleted", true);
    expect(data).toHaveProperty("deletedOn");
  });

});
