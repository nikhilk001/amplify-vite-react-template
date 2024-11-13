import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

// Generate the Amplify client for interacting with the schema
const client = generateClient<Schema>();

// Main App component
function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  // Fetch todos and subscribe to updates
  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  // Handle creation of a new Todo
  function createTodo() {
    const content = window.prompt("Enter Todo content");
    if (content) {
      client.models.Todo.create({ content });
    }
  }

  return (
    <main className="app-container">
      <header className="app-header">
        <h1>My Todos</h1>
        <button className="create-todo-button" onClick={createTodo}>
          + New Todo
        </button>
      </header>

      <section className="todos-list">
        {todos.length === 0 ? (
          <p>No todos available. Add a new one!</p>
        ) : (
          <ul>
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

// TodoItem component to render each todo
function TodoItem({ todo }: { todo: Schema["Todo"]["type"] }) {
  return <li className="todo-item">{todo.content}</li>;
}

export default App;
