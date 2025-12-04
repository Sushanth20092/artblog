"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * ArtworkAdminCard
 * - props.artwork: plain object (serializable) with fields used below
 * - handles Delete (calls protected API) and triggers UI reload via router.refresh() or location.reload()
 */
export default function ArtworkAdminCard({ artwork }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this artwork?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/artworks/${artwork._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Delete failed");
        setDeleting(false);
        return;
      }
      // refresh the page or dashboard list
      // router.refresh() works in Next 13/14 for server components; fallback to reload if not available
      if (router && router.refresh) {
        router.refresh();
      } else {
        location.reload();
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
      setDeleting(false);
    }
  }

  return (
    <div className="border rounded-lg p-3 bg-white shadow-sm">
      <div className="h-44 w-full bg-gray-100 flex items-center justify-center overflow-hidden rounded">
        {artwork.images && artwork.images[0] ? (
          <img src={artwork.images[0]} alt={artwork.title} className="object-cover w-full h-full" />
        ) : (
          <div className="text-gray-400">No image</div>
        )}
      </div>

      <div className="mt-3 flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{artwork.title}</h3>
          <p className="text-xs text-gray-500">{new Date(artwork.createdAt).toLocaleString()}</p>
        </div>

        <div className="text-sm">
          <Link href={`/originals/${artwork.slug}`} className="text-indigo-600 mr-2">View</Link>
          <Link href={`/admin/artworks/${artwork._id}`} className="text-gray-700 mr-2">Edit</Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-600 disabled:opacity-60"
            aria-label={`Delete ${artwork.title}`}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <div className="mt-2">
        <span className={`inline-block text-xs px-2 py-1 rounded ${artwork.status === "for-sale" ? "bg-green-100 text-green-800" : artwork.status === "sold" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-700"}`}>
          {artwork.status}
        </span>
        {artwork.featured && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Featured</span>}
      </div>
    </div>
  );
}
