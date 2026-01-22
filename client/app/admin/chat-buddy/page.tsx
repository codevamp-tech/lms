"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

/* ---------------- TYPES ---------------- */
type ChatBuddy = {
  _id: string;
  name: string;
  bio?: string;
  status: "online" | "offline" | "busy";
  photo?: string;
};

export default function ChatBuddyPage() {
  /* ---------------- STATE ---------------- */
  const [buddies, setBuddies] = useState<ChatBuddy[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalBuddies, setTotalBuddies] = useState(0);

  const [form, setForm] = useState({
    name: "",
    bio: "",
    status: "offline",
  });

  /* ---------------- FETCH LIST ---------------- */
  const fetchChatBuddies = async () => {
    try {
      const skip = (currentPage - 1) * itemsPerPage;
      const res = await fetch(
        `${API_URL}/chat-buddy?skip=${skip}&limit=${itemsPerPage}`
      );
      const data = await res.json();
      setBuddies(data.buddies || data);
      setTotalBuddies(data.total || data.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatBuddies();
  }, [currentPage]);

  /* ---------------- RESET FORM ---------------- */
  const resetForm = () => {
    setForm({ name: "", bio: "", status: "offline" });
    setPhoto(null);
    setEditingId(null);
    setShowForm(false);
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("bio", form.bio);
    formData.append("status", form.status);
    if (photo) formData.append("photo", photo);

    const url = editingId
      ? `${API_URL}/chat-buddy/${editingId}`
      : `${API_URL}/chat-buddy`;

    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, { method, body: formData });

    if (!res.ok) {
      alert("Something went wrong");
      return;
    }

    resetForm();
    fetchChatBuddies();
    setCurrentPage(1);
  };

  /* ---------------- EDIT ---------------- */
  const handleEdit = (buddy: ChatBuddy) => {
    setEditingId(buddy._id);
    setForm({
      name: buddy.name,
      bio: buddy.bio || "",
      status: buddy.status,
    });
    setShowForm(true);
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this chat buddy?");
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_URL}/chat-buddy/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      // Update the UI without refetching
      setBuddies((prev) => prev.filter((buddy) => buddy._id !== id));
      setTotalBuddies((prev) => prev - 1);
    } catch (err) {
      console.error(err);
      alert("Failed to delete buddy");
    }
  };

  const handleRemoveSlot = async (id: string) => {
    const confirmed = confirm("Remove one booked slot?");
    if (!confirmed) return;

    try {
      const res = await fetch(
        `${API_URL}/chat-buddy/${id}/remove-slot`,
        { method: "PATCH" }
      );

      if (!res.ok) throw new Error("Failed");

      fetchChatBuddies();
    } catch (err) {
      console.error(err);
      alert("Failed to remove slot");
    }
  };

  const SlotTicks = ({
    bookedSlots,
    maxSlots,
  }: {
    bookedSlots: number;
    maxSlots: number;
  }) => {
    return (
      <div className="flex gap-1 mt-2">
        {Array.from({ length: maxSlots }).map((_, i) => (
          <span
            key={i}
            className={`w-4 h-4 rounded-full border flex items-center justify-center
            ${i < bookedSlots
                ? "bg-green-500 border-green-500"
                : "bg-gray-100 border-gray-300"
              }`}
          >
            {i < bookedSlots && (
              <span className="text-white text-xs">✓</span>
            )}
          </span>
        ))}
      </div>
    );
  };



  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Chat Buddies</h2>

        <Button
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
        >
          {showForm ? "Close Form" : "Add Chat Buddy"}
        </Button>
      </div>

      {/* ================= FORM ================= */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow space-y-4"
        >
          <h3 className="text-xl font-semibold">
            {editingId ? "Edit Chat Buddy" : "Add Chat Buddy"}
          </h3>

          <Input
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <textarea
            className="w-full border rounded px-3 py-2"
            placeholder="Bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />

          {/* <select
            className="w-full border rounded px-3 py-2"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="busy">Busy</option>
          </select> */}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
          />

          <div className="flex gap-3">
            <Button type="submit">
              {editingId ? "Update Buddy" : "Create Buddy"}
            </Button>
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* ================= LIST ================= */}
      <div className="space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : buddies.length === 0 ? (
          <p>No chat buddies found</p>
        ) : (
          buddies.map((buddy) => (
            <div
              key={buddy._id}
              className="bg-white rounded-lg shadow p-4 flex gap-4"
            >
              <img
                src={buddy.photo || "/placeholder-avatar.png"}
                className="w-14 h-14 rounded-full object-cover"
                alt={buddy.name}
              />

              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{buddy.name}</h3>
                  <span className="text-xs px-2 py-1 rounded bg-gray-100">
                    {buddy.status}
                  </span>
                </div>

                {buddy.bio && (
                  <p className="text-sm text-gray-600 mt-1">
                    {buddy.bio}
                  </p>
                )}

                <SlotTicks
                  bookedSlots={buddy.bookedSlots}
                  maxSlots={buddy.maxSlots}
                />

                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(buddy)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(buddy._id)}
                  >
                    Delete
                  </Button>
                  {buddy.bookedSlots > 0 && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleRemoveSlot(buddy._id)}
                    >
                      Remove Slot
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= PAGINATION ================= */}
      {buddies.length > 0 && (
        <div className="flex justify-center items-center gap-3">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
          >
            Previous
          </Button>

          <div className="flex gap-1">
            {Array.from({
              length: Math.ceil(totalBuddies / itemsPerPage),
            }).map((_, index) => (
              <Button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                variant={currentPage === index + 1 ? "default" : "outline"}
                size="sm"
              >
                {index + 1}
              </Button>
            ))}
          </div>

          <Button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(
                  prev + 1,
                  Math.ceil(totalBuddies / itemsPerPage)
                )
              )
            }
            disabled={
              currentPage === Math.ceil(totalBuddies / itemsPerPage)
            }
            variant="outline"
          >
            Next
          </Button>

          <span className="text-sm text-gray-600 ml-2">
            Page {currentPage} of {Math.ceil(totalBuddies / itemsPerPage)} |
            Total: {totalBuddies}
          </span>
        </div>
      )}
    </div>
  );
}
