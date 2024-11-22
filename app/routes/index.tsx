import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query';
import { todoQueries, useAddTodoMutation, useCompleteTodoMutation, useUncompleteTodoMutation } from '../features/todos/queries';
import { Todo } from '../features/todos/db';

export const Route = createFileRoute('/')({
  component: Home,
  pendingComponent: () => <h1>Loading...</h1>,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(todoQueries.listTodos())
  },
});

function Home() {
  const todosQuery = useSuspenseQuery(todoQueries.listTodos());

  return (
    <div>
      <NewTodo />
      <div>
        {todosQuery.data.map(todo =>
          <TodoItem key={todo.id} todo={todo} />
        )}
      </div>
    </div>
  )
}

function NewTodo() {
  const addTodoMutation = useAddTodoMutation();
  const handleSubmit = async (event) => {
    event.preventDefault()
    if (event.target instanceof HTMLFormElement) {
      const formData = new FormData(event.target)
      const formObject = Object.fromEntries(formData.entries()) as { text: string }
      addTodoMutation.mutate(formObject)
      event.target.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input type="text" name="text" />
        <button type="submit">Add</button>
      </div>
    </form>
  )
}

function TodoItem({ todo }: { todo: Todo }) {
  const uncompleteTodo = useUncompleteTodoMutation();
  const completeTodo = useCompleteTodoMutation();

  const handleToggle = async () => {
    if (todo.completedAt) {
      uncompleteTodo.mutate({ id: todo.id });
    } else {
      completeTodo.mutate({ id: todo.id });
    }
  };

  return (
    <div
      style={{
        borderBottom: '1px solid gray',
        textDecoration: todo.completedAt ? 'line-through' : undefined,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: todo.id.startsWith('_optimistic') ? 'yellow' : undefined,
      }}
      onClick={handleToggle}
    >
      <div style={{ padding: 4, minHeight: 16, width: 16 }}>{todo.completedAt ? 'v' : ''}</div>
      <div style={{ padding: 4, minHeight: 16 }}>{todo.text}</div>
    </div>
  )
}