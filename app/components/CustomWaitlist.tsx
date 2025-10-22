"use client";

import { useState } from "react";

export default function CustomWaitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Thanks! You're on the waitlist 🎉");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Failed to join waitlist. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
        <h2 className="text-2xl font-bold mb-2 text-center">Join the Waitlist</h2>
        <p className="text-gray-300 text-center mb-6">
          Be the first to know when we launch
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={status === "loading"}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 
                       focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-3 px-4 bg-white text-black font-semibold rounded-lg
                     hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all
                     transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {status === "loading" ? "Joining..." : "Join Waitlist"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded-lg text-center text-sm ${
              status === "success"
                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                : "bg-red-500/20 text-red-300 border border-red-500/30"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}


