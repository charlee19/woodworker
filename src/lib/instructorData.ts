"use client";

export interface InstructorCourse {
  id: string;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  enrolled: number;
  status: "Active" | "Draft" | "Reviewing";
}

export interface InstructorBooking {
  id: string;
  studentName: string;
  email: string;
  phone: string;
  courseTitle: string;
  date: string;
  slot: string;
  amount: number;
  status: "Pending" | "Confirmed" | "Cancelled";
}

const DEFAULT_COURSES: InstructorCourse[] = [
  { id: "c1", title: "Traditional Mortise & Tenon Joinery Masterclass", category: "Hand-Cut Joinery", difficulty: "Intermediate", price: 125, enrolled: 8, status: "Active" },
  { id: "c2", title: "Swedish Style Spoon Carving & Knife Grip Basics", category: "Green Woodworking", difficulty: "Beginner", price: 45, enrolled: 14, status: "Active" },
  { id: "c3", title: "English Oak Cabinet Drawer Restoration & Oil Polish", category: "Fine Furniture", difficulty: "Advanced", price: 180, enrolled: 3, status: "Reviewing" },
  { id: "c4", title: "Rustic Walnut Live-Edge Dining Table Crafting", category: "Cabinet-Making", difficulty: "Intermediate", price: 450, enrolled: 0, status: "Draft" },
];

const DEFAULT_BOOKINGS: InstructorBooking[] = [
  { id: "b1", studentName: "Arthur Pendelton", email: "arthur.p@cambridge.edu.uk", phone: "07911 542918", courseTitle: "Traditional Mortise & Tenon Joinery Masterclass", date: "2026-07-12", slot: "09:00 - 13:00", amount: 125, status: "Confirmed" },
  { id: "b2", studentName: "Clara Finchley", email: "clara.finch@bathwoodwork.org", phone: "07842 110948", courseTitle: "Swedish Style Spoon Carving & Knife Grip Basics", date: "2026-07-15", slot: "14:00 - 17:00", amount: 45, status: "Pending" },
  { id: "b3", studentName: "Master Joiner Liam", email: "liam.timbercraft@outlook.com", phone: "07700 900077", courseTitle: "English Oak Cabinet Drawer Restoration & Oil Polish", date: "2026-07-19", slot: "10:00 - 16:00", amount: 180, status: "Confirmed" },
  { id: "b4", studentName: "Sarah Jenkins", email: "s.jenkins@londonart.co", phone: "07119 555231", courseTitle: "Traditional Mortise & Tenon Joinery Masterclass", date: "2026-07-22", slot: "09:00 - 13:00", amount: 125, status: "Pending" },
];

export function getCourses(): InstructorCourse[] {
  if (typeof window === "undefined") return DEFAULT_COURSES;
  try {
    const saved = localStorage.getItem("instructor_courses");
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return DEFAULT_COURSES;
}

export function saveCourses(courses: InstructorCourse[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("instructor_courses", JSON.stringify(courses));
  } catch (_) {}
}

export function getBookings(): InstructorBooking[] {
  if (typeof window === "undefined") return DEFAULT_BOOKINGS;
  try {
    const saved = localStorage.getItem("instructor_bookings");
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return DEFAULT_BOOKINGS;
}

export function saveBookings(bookings: InstructorBooking[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("instructor_bookings", JSON.stringify(bookings));
  } catch (_) {}
}
