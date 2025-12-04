// /components/LogoutButton.jsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "GET", credentials: "same-origin" });
      if (res.ok) {
        // Redirect to login
        router.push("/admin/login");
      } else {
        console.error("Logout failed");
        setLoading(false);
      }
    } catch (err) {
      console.error("Logout error", err);
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-white text-sm hover:bg-red-700 disabled:opacity-60"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
