export default function Dashboard() {
  return (
    <div className="dashboard bg-gray-900 text-white min-h-screen">
      <header className="p-4 bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </header>
      <main className="p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome to your Dashboard</h2>
        <p className="text-gray-300">Here you can manage your tasks, deadlines, and more.</p>
      </main>
    </div>
  );
}