export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-10">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">
        Tailwind is Working! 🎉
      </h1>

      <button className="px-6 py-3 bg-black text-white rounded-xl shadow hover:bg-gray-800 transition">
        Test Button
      </button>

      <p className="mt-6 text-gray-600">
        If this text is styled, Tailwind is correctly configured.
      </p>
    </main>
  );
}
