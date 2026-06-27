"use client";

import React, { useState } from "react";
import AdminPanel from "@/components/AdminPanel";
import { INITIAL_COURSES } from "@/coursesData";
import { Course, Booking } from "@/types";

export default function AdminPage() {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "b1",
      courseId: "c1",
      courseTitle: "Spoon Carving & Axe Workshop",
      instructorId: "inst_david",
      durationType: "hourly",
      customerName: "Charles Wright",
      customerEmail: "charlee19071@gmail.com",
      customerPhone: "07700 900077",
      bookingDate: "2026-07-11",
      notes: "Sloyd knife enthusiast, looking forward to it!",
      totalPrice: 45,
      status: "Confirmed",
      createdAt: "2026-06-24T18:00:00.000Z"
    },
    {
      id: "b2",
      courseId: "c3",
      courseTitle: "Introduction to Hand-Cut Joinery",
      instructorId: "inst_marcus",
      durationType: "daily",
      customerName: "Eleanor Green",
      customerEmail: "eleanor@example.com",
      customerPhone: "07700 900123",
      bookingDate: "2026-08-05",
      notes: "No woodworking background, hope to learn pull-saw basics.",
      totalPrice: 135,
      status: "Pending",
      createdAt: "2026-06-24T12:00:00.000Z"
    }
  ]);

  const addCourse = (newCourse: Course) => {
    setCourses((prev) => [newCourse, ...prev]);
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const updateBookingStatus = (id: string, status: "Pending" | "Confirmed" | "Cancelled") => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <main className="min-h-screen bg-stone-50 py-10" id="admin-page-wrapper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-500 text-stone-950 px-4 py-3 rounded-2xl mb-6 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2">
          <span>🛡️</span>
          <span>Security Notice: You are accessing the administrative control deck of Woodworker Guild.</span>
        </div>

        <AdminPanel
          courses={courses}
          bookings={bookings}
          addCourse={addCourse}
          deleteCourse={deleteCourse}
          updateBookingStatus={updateBookingStatus}
          deleteBooking={deleteBooking}
        />
      </div>
    </main>
  );
}
