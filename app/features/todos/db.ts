import { createServerFn } from "@tanstack/start";

export type Todo = { id: string; text: string; completedAt?: Date };

let todos: Todo[] = [];

export const fetchTodos = createServerFn({ method: "GET" }).handler(
  () => todos
);

type AddTodoInputParams = { text: string };
export const addTodo = createServerFn({ method: "POST" })
  .validator((data: AddTodoInputParams) => {
    return data;
  })
  .handler((ctx) => {
    const todo = { id: crypto.randomUUID(), text: ctx.data.text };
    todos = [...todos, todo];
    return todo;
  });

type CompleteTodoInputParams = { id: string };
export const completeTodo = createServerFn({ method: "POST" })
  .validator((data: CompleteTodoInputParams) => {
    return data;
  })
  .handler(({ data }) => {
    const todo = todos.find((t) => t.id === data.id);
    if (!todo) throw Error("Could not find todo");
    todo.completedAt = new Date();
    return todo;
  });

type UncompleteTodoInputParams = { id: string };
export const uncompleteTodo = createServerFn({ method: "POST" })
  .validator((data: UncompleteTodoInputParams) => {
    return data;
  })
  .handler(({ data }) => {
    const todo = todos.find((t) => t.id === data.id);
    if (!todo) throw Error("Could not find todo");
    delete todo.completedAt;
    return todo;
  });
