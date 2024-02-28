import KanbanBoard from './components/KanbanBoard';

function App() {
  return (
    <div>
      <h1 className="text-center mt-12 -mb-12 text-6xl text-red-500">
        Kanban Board
      </h1>
      <main>
        <KanbanBoard />
      </main>
    </div>
  );
}

export default App;
