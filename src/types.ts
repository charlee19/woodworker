export type CourseDurationType = 'hourly' | 'daily' | 'weekly';

export interface Creator {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor';
  bio: string;
  avatar: string;
  contactName?: string;
  location?: string;
  bankName?: string;
  bankAccountHolder?: string;
  bankAccountNumber?: string;
  bankSortCode?: string;
  payoutMethod?: 'bank_transfer' | 'cheque';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  durationType: CourseDurationType;
  durationLabel: string; // e.g. "3 Hours", "2 Days", "1 Week"
  price: number;
  capacity: number;
  instructorId: string; // References Creator.id
  instructor: string;   // Display name
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  materialsIncluded: boolean;
  location: string; // e.g., "Devon", "Cornwall", "London", "Yorkshire"
  image: string; // URL or identifier for visual presentation
  images?: string[]; // Up to 4 custom uploaded images
  timeSlots?: string[]; // e.g., ["09:00 - 12:00", "13:00 - 16:00", "17:00 - 20:00"]
  isFeatured?: boolean; // Featured option dynamically purchasable by creator
}

export interface Booking {
  id: string;
  courseId: string;
  courseTitle: string;
  instructorId: string; // References Creator.id
  durationType: CourseDurationType;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: string; // YYYY-MM-DD
  timeSlot?: string; // For hourly
  notes?: string;
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  payoutStatus?: 'Not Requested' | 'Processing' | 'Paid';
  createdAt: string;
  skillsLevel?: string;
}

export interface EmbedConfig {
  theme: 'amber' | 'emerald' | 'stone' | 'slate';
  primaryColor: string;
  font: string;
  customLogoUrl?: string;
  showDifficulty: boolean;
  showInstructor: boolean;
  iframeHeight: number;
}

export interface Message {
  id: string;
  bookingId?: string; // Opt link to booking like Airbnb
  senderId: string; // e.g. student email or inst_david
  senderName: string;
  senderRole: 'student' | 'instructor' | 'admin';
  recipientId: string; // student email or inst_david
  recipientName: string;
  text: string;
  createdAt: string;
  isRead: boolean;
}

export interface Notification {
  id: string;
  userId: string; // creator ID or student email
  title: string;
  content: string;
  type: 'booking_confirmed' | 'booking_cancelled' | 'instructor_alert' | 'automated_reminder' | 'review_request' | 'message';
  createdAt: string;
  isRead: boolean;
  link?: string;
}

export interface EmailLog {
  id: string;
  type: 'booking_confirmation' | 'instructor_notif' | 'automated_reminder_3d' | 'booking_cancellation' | 'review_request';
  toEmail: string;
  toName: string;
  subject: string;
  bodyHtml: string;
  sentAt: string;
  status: 'Delivered' | 'Queued' | 'Sent';
}

