// /app/admin/dashboard/page.jsx
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Artwork from "@/models/Artwork";
import LogoutButton from "@/components/LogoutButton";
import ArtworkAdminCard from "@/components/ArtworkAdminCard"; // client component
import { cookies } from "next/headers";
import { verifyToken, getCookieName } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  // server-side cookie retrieval (await required)
  const cookieStore = await cookies();
  const token = cookieStore.get(getCookieName())?.value;
  if (!token) return redirect("/admin/login");
  try {
    verifyToken(token);
  } catch (err) {
    return redirect("/admin/login");
  }

  await connectDB();
  const artworks = await Artwork.find().sort({ createdAt: -1 }).lean();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-6">
        <header className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Manage artworks — add, edit or remove.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/artworks/new" className="rounded bg-indigo-600 px-3 py-2 text-white text-sm hover:bg-indigo-700">
              + Add Artwork
            </Link>
            <LogoutButton />
          </div>
        </header>

        <section className="mt-6">
          {artworks.length === 0 ? (
            <div className="p-6 text-gray-600">No artworks found. Add your first artwork.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {artworks.map((a) => (
                // pass only serializable data (no functions)
                <ArtworkAdminCard key={a._id} artwork={a} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
