"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewArtworkPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imagesText, setImagesText] = useState(""); // comma separated urls
  const [status, setStatus] = useState("for-sale");
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!title || !description || !imagesText.trim()) {
      setError("Title, description and at least one image URL are required.");
      return;
    }
    const images = imagesText.split(",").map(s => s.trim()).filter(Boolean);
    setLoading(true);

    try {
      const res = await fetch("/api/artworks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, description, images, status, featured }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Create failed");
        setLoading(false);
        return;
      }
      // success: redirect to dashboard
      router.push("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-bold mb-3">Add New Artwork</h1>
        {error && <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Title</label>
            <input value={title} onChange={(e)=>setTitle(e.target.value)} className="mt-1 w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm">Description</label>
            <textarea value={description} onChange={(e)=>setDescription(e.target.value)} className="mt-1 w-full p-2 border rounded" rows={4} />
          </div>

          <div>
            <label className="block text-sm">Image URLs (comma separated)</label>
            <input value={imagesText} onChange={(e)=>setImagesText(e.target.value)} className="mt-1 w-full p-2 border rounded" placeholder="https://..., https://..." />
          </div>

          <div className="flex gap-4 items-center">
            <div>
              <label className="block text-sm">Status</label>
              <select value={status} onChange={(e)=>setStatus(e.target.value)} className="mt-1 p-2 border rounded">
                <option value="for-sale">For Sale</option>
                <option value="sold">Sold</option>
                <option value="not-for-sale">Not for Sale</option>
              </select>
            </div>

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={featured} onChange={(e)=>setFeatured(e.target.checked)} />
              <span className="text-sm">Featured on home</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded">
              {loading ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={()=>router.push("/admin/dashboard")} className="px-4 py-2 border rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
