"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('Failed to submit email:', result);
        alert(result.error || 'Failed to join waitlist. Please try again.');
        return;
      }

      setSubmitted(true);
      setTimeout(() => {
        setEmail("");
        setShowForm(false);
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting email:', error);
      alert('Failed to join waitlist. Please try again.');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Grain overlay */}
      <div className="grain-overlay"></div>
      
      <div className="max-w-4xl w-full text-center space-y-8 animate-fade-in relative z-10">
        {/* Main heading */}
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
          PLAY TO FEEL
        </h1>
        
        {/* Tagline */}
        <p className="text-xl md:text-2xl text-muted max-w-2xl mx-auto font-light">
          A card game designed to explore and share emotions through play
        </p>

        {/* CTA section */}
        <div className="pt-4 space-y-4">
          {!showForm ? (
            <button 
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Join the Waitlist
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-3 animate-fade-in">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                disabled={submitted}
              />
              <button 
                type="submit"
                className="btn-submit"
                disabled={submitted}
              >
                {submitted ? "Thanks!" : "Submit"}
              </button>
            </form>
          )}
          <p className="text-sm text-muted-dark">
            Coming soon
          </p>
        </div>
      </div>
    </main>
  );
}
