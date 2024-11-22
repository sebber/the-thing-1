import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { addTodo, completeTodo, fetchTodos, Todo, uncompleteTodo } from "./db";

export const todoQueries = {
  listTodos: () =>
    queryOptions({
      queryKey: ["todos"],
      queryFn: () => fetchTodos(),
    }),
};

export function useAddTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { text: string }) => addTodo({ data }),
    onMutate: (variables) => {
      const optimisticId = `_optimistic_${crypto.randomUUID()}`;

      queryClient.setQueryData(
        todoQueries.listTodos().queryKey,
        (old: Todo[] | undefined) => {
          const optimisticTodo = {
            id: optimisticId,
            text: variables.text,
          };
          if (!old) {
            return [optimisticTodo];
          }
          return [...old, optimisticTodo];
        }
      );
    },
  });
}

export function useCompleteTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string }) => completeTodo({ data }),
    onMutate: (variables) => {
      queryClient.setQueryData(
        todoQueries.listTodos().queryKey,
        (old: Todo[] | undefined) => {
          if (!old) {
            return;
          }
          old.map((todo) => {
            if (todo.id === variables.id) {
              todo.completedAt = new Date();
            }
            return todo;
          });
          return old;
        }
      );
    },
  });
}

export function useUncompleteTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string }) => uncompleteTodo({ data }),
    onMutate: (variables) => {
      queryClient.setQueryData(
        todoQueries.listTodos().queryKey,
        (old: Todo[] | undefined) => {
          if (!old) {
            return;
          }
          old.map((todo) => {
            if (todo.id === variables.id) {
              delete todo.completedAt;
            }
            return todo;
          });
          return old;
        }
      );
    },
  });
}
