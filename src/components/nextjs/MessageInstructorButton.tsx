"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { MessageSquare, X, Send, CheckCircle2, User, Mail, FileText } from "lucide-react";

interface MessageInstructorButtonProps {
  instructorName: string;
  courseTitle: string;
  courseId?: string;
}

export default function MessageInstructorButton({
  instructorName,
  courseTitle,
  courseId,
}: MessageInstructorButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  // Ensure portal only runs client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // ESC close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsSuccess(false);
    setError("");
    setName("");
    setEmail("");
    setMessage("");
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return setError("Please enter your name");
    if (!email.trim() || !email.includes("@")) return setError("Please enter a valid email");
    if (!message.trim()) return setError("Please write a message");

    console.log({
      instructorName,
      courseTitle,
      courseId,
      name,
      email,
      message,
    });

    setIsSuccess(true);
  };

  return (
    <>
      {/* BUTTON */}
      <button
        onClick={handleOpen}
        className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-stone-200 shadow-xs cursor-pointer"
      >
        <MessageSquare className="w-3.5 h-3.5 text-stone-600" />
        Contact Instructor
      </button>

      {/* PORTAL MODAL (FIXED) */}
      {isOpen &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[999999] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <div
              ref={modalRef}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-stone-200 overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* CLOSE */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5 hover:bg-stone-100 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>

              {/* HEADER */}
              <div className="bg-stone-950 text-white p-6">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
                  Direct Inquiry
                </span>
                <h3 className="text-lg font-bold mt-1">
                  Message {instructorName}
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  {courseTitle}
                </p>
              </div>

              {/* BODY */}
              <div className="p-6">
                {isSuccess ? (
                  <div className="text-center py-6">
                    <CheckCircle2 className="mx-auto text-emerald-600 w-10 h-10 mb-3" />
                    <h4 className="font-bold mb-2">Message Sent</h4>
                    <p className="text-xs text-stone-500 mb-4">
                      Your message has been logged.
                    </p>
                    <button
                      onClick={handleClose}
                      className="bg-stone-900 text-white px-5 py-2 rounded-xl text-xs"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                        {error}
                      </div>
                    )}

                    <input
                      className="w-full border p-2 rounded-xl text-xs"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />

                    <input
                      className="w-full border p-2 rounded-xl text-xs"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />

                    <textarea
                      className="w-full border p-2 rounded-xl text-xs"
                      placeholder="Message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                    />

                    <button
                      type="submit"
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-xl text-xs font-bold"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}