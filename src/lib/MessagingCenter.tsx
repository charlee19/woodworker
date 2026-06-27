import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Send, 
  Check, 
  CheckCheck, 
  Calendar, 
  Clock, 
  Trash2, 
  Database, 
  Inbox, 
  AlertTriangle, 
  X, 
  User, 
  Sparkles, 
  RefreshCw, 
  Sliders,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { Booking, Creator, Message, Notification, EmailLog } from '../types';

// Helper to generate dynamic emails
export const generateEmailHtml = (
  type: EmailLog['type'],
  booking: Booking,
  creator: Creator | null,
  additionalData?: any
): { subject: string; bodyHtml: string } => {
  const hostName = creator?.name || 'David Green';
  const hostEmail = creator?.email || 'david@woodworker.org.uk';
  const skillsText = booking.skillsLevel ? `Skill level specified: ${booking.skillsLevel}` : 'All skill levels welcome';
  const notesText = booking.notes ? `Your notes: "${booking.notes}"` : '';
  const slotText = booking.timeSlot ? ` @ ${booking.timeSlot}` : '';

  switch (type) {
    case 'booking_confirmation':
      return {
        subject: `🪵 Confirmation: Your reservation for ${booking.courseTitle} (ID: ${booking.id})`,
        bodyHtml: `
          <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e0dcd3; border-radius: 16px; background-color: #faf9f6; color: #1c1917;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 32px;">🪵</span>
              <h2 style="font-family: 'DM Serif Display', Georgia, serif; color: #78350f; margin-top: 8px;">WoodWorker Marketplace</h2>
              <p style="text-transform: uppercase; font-size: 10px; letter-spacing: 1.5px; font-weight: bold; color: #a16207; margin-top: -6px;">Bench Reservation Ticket Secures</p>
            </div>
            
            <p>Dear <strong>${booking.customerName}</strong>,</p>
            <p>Your booking was processed. Your bench space is locked in and ready for carving.</p>
            
            <div style="background-color: #ffffff; border: 1px solid #e5e5e0; border-radius: 12px; padding: 16px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
              <h3 style="color: #451a03; margin-top: 0; border-bottom: 2px solid #fef3c7; padding-bottom: 8px;">Workshop Ticket Details</h3>
              <p style="margin: 6px 0; font-size: 14px;"><strong>Course:</strong> ${booking.courseTitle}</p>
              <p style="margin: 6px 0; font-size: 14px;"><strong>Instructor:</strong> ${hostName} (${hostEmail})</p>
              <p style="margin: 6px 0; font-size: 14px;"><strong>Date:</strong> ${booking.bookingDate}${slotText}</p>
              <p style="margin: 6px 0; font-size: 14px;"><strong>Ticket Reference:</strong> <code style="background-color: #f3f3ee; padding: 2px 6px; border-radius: 4px; font-size: 13px;">${booking.id}</code></p>
              <p style="margin: 6px 0; font-size: 14px;"><strong>Amount Secured:</strong> £${booking.totalPrice} (Fully Paid)</p>
            </div>
            
            <p style="font-size: 13px; color: #57534e;">${skillsText}. ${notesText}</p>
            
            <div style="border-top: 1px solid #e5e5e0; margin-top: 24px; padding-top: 20px; font-size: 12px; color: #78716c; text-align: center;">
              <p>Workshops located at verified locations. For directions or coordinates, contact the instructor directly via the Woodworker inbox messaging matrix.</p>
              <p style="margin-top: 10px; font-weight: bold;">Guild Platform Security Certification • Powered by Woodworking Org UK</p>
            </div>
          </div>
        `
      };

    case 'instructor_notif':
      return {
        subject: `🔔 Guild Alert: New artisan booking registered for ${booking.courseTitle}`,
        bodyHtml: `
          <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #78350f; border-radius: 16px; background-color: #ffffff; color: #1c1917;">
            <div style="border-left: 4px solid #b45309; padding-left: 12px; margin-bottom: 20px;">
              <h2 style="font-family: 'DM Serif Display', Georgia, serif; color: #451a03; margin: 0;">New Reservation Secure</h2>
              <p style="text-transform: uppercase; font-size: 9px; letter-spacing: 1px; color: #b45309; margin: 2px 0 0 0;">Instructor Marketplace Notification Matrix</p>
            </div>
            
            <p>Hello <strong>${hostName}</strong>,</p>
            <p>An artisan visitor from the unified guild platform just booked a slot on your upcoming syllabus:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
              <tr style="background-color: #faf9f6; border-bottom: 1px solid #e5e5e0;">
                <td style="padding: 10px; font-weight: bold; width: 35%;">Client Name:</td>
                <td style="padding: 10px;">${booking.customerName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e5e0;">
                <td style="padding: 10px; font-weight: bold;">Client Email:</td>
                <td style="padding: 10px;"><a href="mailto:${booking.customerEmail}" style="color: #b45309; text-decoration: none;">${booking.customerEmail}</a></td>
              </tr>
              <tr style="background-color: #faf9f6; border-bottom: 1px solid #e5e5e0;">
                <td style="padding: 10px; font-weight: bold;">Workshop Class:</td>
                <td style="padding: 10px; font-weight: bold;">${booking.courseTitle}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e5e0;">
                <td style="padding: 10px; font-weight: bold;">Date & Time:</td>
                <td style="padding: 10px; color: #78350f; font-weight: bold;">${booking.bookingDate}${slotText}</td>
              </tr>
              <tr style="background-color: #faf9f6; border-bottom: 1px solid #e5e5e0;">
                <td style="padding: 10px; font-weight: bold;">Net Earnings:</td>
                <td style="padding: 10px; color: #166534; font-weight: bold;">£${(booking.totalPrice * 0.85).toFixed(2)} (85% Net Share Transfer)</td>
              </tr>
            </table>
            
            <p style="font-size: 13px; color: #57534e; font-style: italic;">"${booking.notes || 'No extra requirements specified.'}"</p>
            
            <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 12px; margin-top: 15px;">
              <p style="margin: 0; font-size: 12px; color: #92400e; font-weight: 500;">
                💡 <strong>Action Required:</strong> Log in to your Host Application workspace to initiate internal messaging with the client, coordinating materials or physical workbench directions.
              </p>
            </div>
          </div>
        `
      };

    case 'automated_reminder_3d':
      return {
        subject: `⏳ 3-Day Reminder: Preparing for your ${booking.courseTitle} slot`,
        bodyHtml: `
          <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #d97706; border-radius: 16px; background-color: #fffdfa; color: #1c1917;">
            <div style="text-align: center; margin-bottom: 20px;">
              <div style="display: inline-block; background-color: #fef3c7; padding: 10px; border-radius: 50%; width: 40px; height: 40px; line-height: 40px; text-align: center; font-size: 20px;">⏳</div>
              <h2 style="font-family: 'DM Serif Display', Georgia, serif; color: #451a03; margin: 10px 0 2px 0;">Syllabus Commencing Soon</h2>
              <p style="text-transform: uppercase; font-size: 9px; letter-spacing: 1.5px; color: #d97706; margin: 0;">3 Days Prior Automated Alert Engine</p>
            </div>
            
            <p>Dear <strong>${booking.customerName}</strong>,</p>
            <p>This is your automated guild advisor reminding you that your hands-on class is coming up in exactly 3 days on <strong>${booking.bookingDate}${slotText}</strong> with <strong>${hostName}</strong>.</p>
            
            <div style="border-left: 3px solid #d97706; padding-left: 14px; margin: 18px 0; font-size: 13px; color: #451a03;">
              <p><strong>Reminder Guidelines from the Workbench:</strong></p>
              <ul style="margin: 6px 0; padding-left: 18px;">
                <li>Please wear sturdy, close-toed leather boots (highly important for wood chips & heavy timbers).</li>
                <li>Roll up long sleeves, and tie back long hair securely.</li>
                <li>All masterclass chisels, carving axes, and local timber blanks are pre-arranged and sanitised for your use.</li>
              </ul>
            </div>
            
            <p style="font-size: 13px; color: #57534e;">If you are running late or require additional details regarding physical logistics, select the direct messaging button in your WoodWorker bookings panel.</p>
            
            <div style="text-align: center; margin-top: 25px; border-top: 1px solid #f3f3ee; padding-top: 15px; font-size: 11px; color: #a1a1aa;">
              <p>This automated transaction flow is generated on behalf of the guild registrar. Guild ID: ${booking.id}</p>
            </div>
          </div>
        `
      };

    case 'booking_cancellation':
      return {
        subject: `⚠️ Notice of Cancellation: Slot reservation ${booking.courseTitle}`,
        bodyHtml: `
          <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #ef4444; border-radius: 16px; background-color: #fef2f2; color: #1c1917;">
            <div style="text-align: center; margin-bottom: 18px;">
              <span style="font-size: 32px; color: #ef4444;">⚠️</span>
              <h2 style="font-family: 'DM Serif Display', Georgia, serif; color: #991b1b; margin-top: 6px;">Reservation Void & Cancelled</h2>
              <p style="text-transform: uppercase; font-size: 9px; letter-spacing: 1px; color: #b91c1c; margin-top: -4px;">Booking Transaction Reversed Successfully</p>
            </div>
            
            <p>Dear <strong>${booking.customerName}</strong>,</p>
            <p>We are writing to confirm that your booking for <strong>${booking.courseTitle}</strong> on <strong>${booking.bookingDate}</strong> with <strong>${hostName}</strong> has been cancelled.</p>
            
            <div style="background-color: #ffffff; border: 1px solid #fee2e2; border-radius: 12px; padding: 14px; margin: 15px 0;">
              <p style="margin: 0; font-size: 13px; color: #7f1d1d;">
                <strong>Transaction Status:</strong> Cancelled • 100% Refund Issued back to stripe authorization system. Invoice Code: ${booking.id}
              </p>
            </div>
            
            <p style="font-size: 13px; color: #57534e;">We hope to see you at another woodturning lathe or cabinetry workbench soon. Browse other artisan listings on our public portal.</p>
          </div>
        `
      };

    case 'review_request':
      return {
        subject: `⭐ Share your craftsman story: Review request for ${booking.courseTitle}`,
        bodyHtml: `
          <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #10b981; border-radius: 16px; background-color: #f0fdf4; color: #1c1917;">
            <div style="text-align: center; margin-bottom: 20px;">
              <span style="font-size: 32px;">🌟</span>
              <h2 style="font-family: 'DM Serif Display', Georgia, serif; color: #065f46; margin-top: 6px;">Did the timber design sing?</h2>
              <p style="text-transform: uppercase; font-size: 9px; letter-spacing: 1.5px; color: #047857; margin-top: -4px;">Review Invitation Dispatch</p>
            </div>
            
            <p>Hello <strong>${booking.customerName}</strong>,</p>
            <p>Your class <strong>${booking.courseTitle}</strong> with <strong>${hostName}</strong> is now complete. We hope your fingers are dusty, your timber was fragrant, and your chisel cuts were deep and clean!</p>
            
            <p>To support artisan woodworking across the country, we invite you to write a brief public review. Authentic reviews build high authority for local instructors and guide other timber hobbyists.</p>
            
            <div style="text-align: center; margin: 24px 0;">
              <a href="#" style="background-color: #059669; color: #ffffff; padding: 12px 24px; border-radius: 12px; font-weight: bold; text-decoration: none; display: inline-block;">Leave Workspace Review</a>
            </div>
            
            <p style="font-size: 12px; color: #4b5563; text-align: center;">Feedback is synchronized with local SEO indexing routines inside the WordPress Bricks Builder server page.</p>
          </div>
        `
      };
    default:
      return { subject: 'Notification', bodyHtml: 'No template matched.' };
  }
};

// Initial Messages Seeding
const DEFAULT_MESSAGES: Message[] = [
  {
    id: 'msg_1',
    bookingId: 'b1',
    senderId: 'thomas.thorne@example.com',
    senderName: 'Thomas Thorne',
    senderRole: 'student',
    recipientId: 'inst_david',
    recipientName: 'David Green',
    text: 'Hello David! Very excited about the Spoon Carving class on the 12th. It is a birthday gift for my wife—is there any experience needed or prior axe-handling safety we should read up on?',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true
  },
  {
    id: 'msg_2',
    bookingId: 'b1',
    senderId: 'inst_david',
    senderName: 'David Green',
    senderRole: 'instructor',
    recipientId: 'thomas.thorne@example.com',
    recipientName: 'Thomas Thorne',
    text: "Hi Thomas! What a wonderful birthday gift! Rest assured, absolute beginners are my specialty. We supply all safety materials, gloves, and razor-sharp wood gouges. Just wear comfortable clothes and closed shoes. I'll make sure she has an incredible time woodcarving!",
    createdAt: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true
  },
  {
    id: 'msg_3',
    bookingId: 'b1',
    senderId: 'thomas.thorne@example.com',
    senderName: 'Thomas Thorne',
    senderRole: 'student',
    recipientId: 'inst_david',
    recipientName: 'David Green',
    text: 'Perfect, David. Thank you so much! Should we bring coffee/lunch, or is there a tea kettle on site at Devon?',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: false
  },
  {
    id: 'msg_4',
    bookingId: 'b3',
    senderId: 'j.sterling@timberdesign.uk',
    senderName: 'James Sterling',
    senderRole: 'student',
    recipientId: 'inst_evelyn',
    recipientName: 'Evelyn Wood',
    text: "Morn Evelyn! For the upcoming Furniture masterclass, I was hoping we could work on selecting walnut or native English cherry boards. Is there stock on hand at the Bristol depot or should I coordinate a run?",
    createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true
  }
];

// Initial Notifications Seeding
const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    userId: 'inst_david',
    title: 'New Class Booked! 🪵',
    content: 'Thomas Thorne booked "Spoon Carving & Axe Workshop" for £45.',
    type: 'booking_confirmed',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true
  },
  {
    id: 'notif_2',
    userId: 'thomas.thorne@example.com',
    title: 'Your Workbench Reservation is Confirmed ✔️',
    content: 'Spoon Carving & Axe Workshop booked securely for £45 with David Green.',
    type: 'booking_confirmed',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: false
  },
  {
    id: 'notif_3',
    userId: 'inst_david',
    title: 'Unread Message from Guest 💬',
    content: 'Thomas Thorne sent you a message: "Should we bring coffee/lunch..."',
    type: 'message',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: false
  }
];

export interface MessagingCenterProps {
  activeRole: 'visitor' | 'student' | 'instructor' | 'admin';
  currentInstructorId: string;
  currentStudent: { name: string; email: string } | null;
  creators: Creator[];
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  courses: any[];
  onOpenBookingModal?: () => void;
}

export default function MessagingCenter({
  activeRole,
  currentInstructorId,
  currentStudent,
  creators,
  bookings,
  setBookings,
  courses,
  onOpenBookingModal
}: MessagingCenterProps) {
  // State backing
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('timber_state_messages');
      return saved ? JSON.parse(saved) : DEFAULT_MESSAGES;
    } catch {
      return DEFAULT_MESSAGES;
    }
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem('timber_state_notifications');
      return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  });

  const [emailLogs, setEmailLogs] = useState<EmailLog[]>(() => {
    try {
      const saved = localStorage.getItem('timber_state_emails');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Active chat thread recipient identifier
  const [activeThreadId, setActiveThreadId] = useState<string>('');
  const [typedMessage, setTypedMessage] = useState<string>('');
  
  // Tab within backend hub / simulation modal
  const [activeMgtTab, setActiveMgtTab] = useState<'airbnb_chat' | 'notification_log' | 'outbox' | 'automation_daemon'>('airbnb_chat');
  const [viewingEmailDetail, setViewingEmailDetail] = useState<EmailLog | null>(null);

  // Persistence triggers
  useEffect(() => {
    localStorage.setItem('timber_state_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('timber_state_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('timber_state_emails', JSON.stringify(emailLogs));
  }, [emailLogs]);

  // Handle listening to new external bookings from App to trigger emails & notifications in mock server dispatch
  const prevBookingsCountRef = useRef(bookings.length);
  useEffect(() => {
    if (bookings.length > prevBookingsCountRef.current) {
      // A new booking has been added to the system
      const latestBooking = bookings[0]; // Assuming newest booking is pushed to front
      if (latestBooking) {
        // Trigger simulated emails in backend scheduler
        const instructor = creators.find(c => c.id === latestBooking.instructorId) || creators[0];
        
        // 1. Booking Confirmation Email (Client)
        const clientEmail = generateEmailHtml('booking_confirmation', latestBooking, instructor);
        const log1: EmailLog = {
          id: 'EML-' + Math.floor(100000 + Math.random() * 900000),
          type: 'booking_confirmation',
          toEmail: latestBooking.customerEmail,
          toName: latestBooking.customerName,
          subject: clientEmail.subject,
          bodyHtml: clientEmail.bodyHtml,
          sentAt: new Date().toISOString(),
          status: 'Delivered'
        };

        // 2. Instructor Booking Alert (Host)
        const hostEmail = generateEmailHtml('instructor_notif', latestBooking, instructor);
        const log2: EmailLog = {
          id: 'EML-' + Math.floor(100000 + Math.random() * 900000),
          type: 'instructor_notif',
          toEmail: instructor.email,
          toName: instructor.name,
          subject: hostEmail.subject,
          bodyHtml: hostEmail.bodyHtml,
          sentAt: new Date().toISOString(),
          status: 'Delivered'
        };

        setEmailLogs(prev => [log1, log2, ...prev]);

        // 3. Generate Dashboard Notifications
        const notif1: Notification = {
          id: 'NTF-' + Math.floor(100000 + Math.random() * 900000),
          userId: latestBooking.instructorId,
          title: 'Class Booked! 🪵',
          content: `${latestBooking.customerName} booked "${latestBooking.courseTitle}" for £${latestBooking.totalPrice}. Check inbox threads to correspond.`,
          type: 'instructor_alert',
          createdAt: new Date().toISOString(),
          isRead: false
        };

        const notif2: Notification = {
          id: 'NTF-' + Math.floor(100000 + Math.random() * 900000),
          userId: latestBooking.customerEmail.toLowerCase(),
          title: 'Secure Workbench Slot Acquired 🌟',
          content: `Your class "${latestBooking.courseTitle}" on ${latestBooking.bookingDate} is confirmed. View receipt log in outbox.`,
          type: 'booking_confirmed',
          createdAt: new Date().toISOString(),
          isRead: false
        };

        setNotifications(prev => [notif1, notif2, ...prev]);

        // Seed initial welcoming chat thread
        const welcomeMsg: Message = {
          id: 'msg_welcome_' + Date.now(),
          bookingId: latestBooking.id,
          senderId: latestBooking.instructorId,
          senderName: instructor.name,
          senderRole: 'instructor',
          recipientId: latestBooking.customerEmail.toLowerCase(),
          recipientName: latestBooking.customerName,
          text: `Welcome to the guild, ${latestBooking.customerName}! Your bench reservation for "${latestBooking.courseTitle}" is secured. I am busy preparing lumber blanks. If you have any skill prerequisites, physical requirements, or directions queries, don't hesitate to write directly back here.`,
          createdAt: new Date().toISOString(),
          isRead: false
        };

        setMessages(prev => [welcomeMsg, ...prev]);
      }
    }
    prevBookingsCountRef.current = bookings.length;
  }, [bookings, creators]);

  // Current entity session resolution:
  // Returns appropriate identifier and friendly name for notifications/messages
  const getSessionUser = () : { id: string; name: string; role: 'student' | 'instructor' | 'admin' } => {
    if (activeRole === 'instructor') {
      const cr = creators.find(c => c.id === currentInstructorId) || creators[0];
      return { id: cr.id, name: cr.name, role: 'instructor' };
    } else if (activeRole === 'admin') {
      return { id: './system-operator', name: 'Master Registrar Operator', role: 'admin' };
    } else {
      if (currentStudent) {
        return { id: currentStudent.email.toLowerCase(), name: currentStudent.name, role: 'student' };
      }
      return { id: 'anonymous_visitor@site.com', name: 'Artisan Visitor', role: 'student' };
    }
  };

  const sessionUser = getSessionUser();

  // Filter systems
  const myNotifications = notifications.filter(n => {
    return n.userId.toLowerCase() === sessionUser.id.toLowerCase();
  });

  const unreadNotificationsCount = myNotifications.filter(n => !n.isRead).length;

  // Airbnb style thread aggregation:
  // A thread is defined between two distinct parties (sender/recipient pairs)
  interface ConversationThread {
    partyId: string; // The email or instructor ID representing the other person
    partyName: string;
    partyRole: 'student' | 'instructor' | 'admin';
    latestMessage: Message;
    unreadCount: number;
    courseContext?: string;
  }

  const getThreadList = (): ConversationThread[] => {
    const threadMap: { [key: string]: Message[] } = {};
    const selfId = sessionUser.id.toLowerCase();

    messages.forEach(msg => {
      const sId = msg.senderId.toLowerCase();
      const rId = msg.recipientId.toLowerCase();
      
      if (sId !== selfId && rId !== selfId) return; // not involved
      const otherId = sId === selfId ? rId : sId;

      if (!threadMap[otherId]) {
        threadMap[otherId] = [];
      }
      threadMap[otherId].push(msg);
    });

    return Object.keys(threadMap).map(otherId => {
      const threadMsgs = threadMap[otherId].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const latest = threadMsgs[0];
      
      // Determine other party info from messages
      let name = '';
      let role: 'student' | 'instructor' | 'admin' = 'student';
      
      if (latest.senderId.toLowerCase() === otherId) {
        name = latest.senderName;
        role = latest.senderRole;
      } else {
        name = latest.recipientName;
        role = latest.recipientId.toLowerCase() === 'inst_david' || latest.recipientId.toLowerCase() === 'inst_evelyn' || latest.recipientId.toLowerCase() === 'inst_marcus' ? 'instructor' : 'student';
      }

      const unreadCount = threadMsgs.filter(m => m.recipientId.toLowerCase() === selfId && !m.isRead).length;
      
      // Look up course context if there is a booking linked
      let courseContext = '';
      if (latest.bookingId) {
        const bk = bookings.find(b => b.id === latest.bookingId);
        if (bk) courseContext = bk.courseTitle;
      }

      return {
        partyId: otherId,
        partyName: name,
        partyRole: role,
        latestMessage: latest,
        unreadCount,
        courseContext
      };
    });
  };

  const threads = getThreadList();

  // If no thread selected yet, select the first thread if available
  useEffect(() => {
    if (!activeThreadId && threads.length > 0) {
      setActiveThreadId(threads[0].partyId);
    }
  }, [threads, activeThreadId]);

  // Filter messages for active thread
  const activeConversationMessages = messages
    .filter(msg => {
      const sId = msg.senderId.toLowerCase();
      const rId = msg.recipientId.toLowerCase();
      const selfId = sessionUser.id.toLowerCase();
      const targetId = activeThreadId.toLowerCase();
      return (sId === selfId && rId === targetId) || (sId === targetId && rId === selfId);
    })
    .sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  // Mark messages in active thread as read
  useEffect(() => {
    if (activeThreadId) {
      const selfId = sessionUser.id.toLowerCase();
      let modified = false;
      const updated = messages.map(msg => {
        if (msg.senderId.toLowerCase() === activeThreadId.toLowerCase() && msg.recipientId.toLowerCase() === selfId && !msg.isRead) {
          modified = true;
          return { ...msg, isRead: true };
        }
        return msg;
      });

      if (modified) {
        setMessages(updated);
      }
    }
  }, [activeThreadId, messages, sessionUser.id]);

  // Handle messages dispatch
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeThreadId) return;

    const selfUser = sessionUser;
    
    // Attempt to identify corresponding booking
    const activeBooking = bookings.find(b => 
      b.customerEmail.toLowerCase() === activeThreadId.toLowerCase() || 
      b.customerEmail.toLowerCase() === selfUser.id.toLowerCase()
    );

    const matchParty = threads.find(t => t.partyId === activeThreadId);
    const recipientName = matchParty?.partyName || 'Craftsman Partner';

    const newMsg: Message = {
      id: 'msg_' + Date.now(),
      bookingId: activeBooking?.id,
      senderId: selfUser.id,
      senderName: selfUser.name,
      senderRole: selfUser.role,
      recipientId: activeThreadId,
      recipientName: recipientName,
      text: typedMessage.trim(),
      createdAt: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [...prev, newMsg]);
    setTypedMessage('');

    // Generate Dashboard alert for recipient
    const recipientAlert: Notification = {
      id: 'NTF-' + Math.floor(100000 + Math.random() * 900000),
      userId: activeThreadId,
      title: `✉️ Inbox: Message from ${selfUser.name}`,
      content: `"${typedMessage.trim().substring(0, 50)}..."`,
      type: 'message',
      createdAt: new Date().toISOString(),
      isRead: false
    };

    setNotifications(prev => [recipientAlert, ...prev]);

    // Simulate instant AI Host / Student Reply helper
    if (activeThreadId.startsWith('inst_')) {
      setTimeout(() => {
        const autoReplies = [
          "Absolutely, I have flagged your preference inside the timber allocation register.",
          "Greetings! Thanks for checking in. Yes, my workshop in Devon is stocked full of locally harvested seasoned ash and oak pegs. Feel free to bring any chisels.",
          "I will look into that and update the booking slot reference context.",
          "Looking forward to hearing the ring of axe work next week!"
        ];
        const randomQuote = autoReplies[Math.floor(Math.random() * autoReplies.length)];
        
        const autoMsg: Message = {
          id: 'msg_auto_' + Date.now(),
          bookingId: activeBooking?.id,
          senderId: activeThreadId,
          senderName: recipientName,
          senderRole: 'instructor',
          recipientId: selfUser.id,
          recipientName: selfUser.name,
          text: `[Artisan Auto-System] ${randomQuote}`,
          createdAt: new Date().toISOString(),
          isRead: false
        };
        setMessages(prev => [...prev, autoMsg]);
      }, 1500);
    }
  };

  // Helper actions for notifications center
  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => 
      n.userId.toLowerCase() === sessionUser.id.toLowerCase() ? { ...n, isRead: true } : n
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // AUTOMATION DAEMON & CRM WORKFLOW ACTIONS
  const handleSimulateTimeSkip3Days = () => {
    // Searches bookings, pushes notifications and emails 3-days prior
    let RemindersDrawn = 0;
    const generatedLogs: EmailLog[] = [];
    const generatedNotifs: Notification[] = [];

    bookings.forEach(booking => {
      const instructor = creators.find(c => c.id === booking.instructorId) || creators[0];
      const details = generateEmailHtml('automated_reminder_3d', booking, instructor);
      
      const newMailLog: EmailLog = {
        id: 'EML-CRM-' + Math.floor(100000 + Math.random() * 900000),
        type: 'automated_reminder_3d',
        toEmail: booking.customerEmail,
        toName: booking.customerName,
        subject: details.subject,
        bodyHtml: details.bodyHtml,
        sentAt: new Date().toISOString(),
        status: 'Delivered'
      };
      
      generatedLogs.push(newMailLog);
      RemindersDrawn++;

      // Create booking holder notification
      const customAlert: Notification = {
        id: 'NTF-CRM-' + Math.floor(100000 + Math.random() * 900000),
        userId: booking.customerEmail.toLowerCase(),
        title: '⏳ 3-Day Course Reminder Commencing',
        content: `Your class "${booking.courseTitle}" begins in exactly three days. Clean boots and clothing are reminded. Check outbox for guidance.`,
        type: 'automated_reminder',
        createdAt: new Date().toISOString(),
        isRead: false
      };
      generatedNotifs.push(customAlert);
    });

    if (RemindersDrawn > 0) {
      setEmailLogs(prev => [...generatedLogs, ...prev]);
      setNotifications(prev => [...generatedNotifs, ...prev]);
      alert(`🕒 Cron Scheduler complete! Evaluated ${RemindersDrawn} upcoming reservations. Sent 3-Day Reminders into the dispatcher log.`);
    } else {
      alert("No active reservations detected to dispatch reminders.");
    }
  };

  const handleSimulateCancellation = (bId: string) => {
    const booking = bookings.find(b => b.id === bId);
    if (!booking) return;

    // Toggle confirmed to cancelled
    setBookings(prev => prev.map(b => b.id === bId ? { ...b, status: 'Cancelled' } : b));

    const instructor = creators.find(c => c.id === booking.instructorId) || creators[0];
    const details = generateEmailHtml('booking_cancellation', booking, instructor);

    const log: EmailLog = {
      id: 'EML-' + Math.floor(100000 + Math.random() * 900000),
      type: 'booking_cancellation',
      toEmail: booking.customerEmail,
      toName: booking.customerName,
      subject: details.subject,
      bodyHtml: details.bodyHtml,
      sentAt: new Date().toISOString(),
      status: 'Delivered'
    };

    setEmailLogs(prev => [log, ...prev]);

    // Student Alert
    const clientAlert: Notification = {
      id: 'NTF-' + Math.floor(100000 + Math.random() * 900000),
      userId: booking.customerEmail.toLowerCase(),
      title: '⚠️ Workbench Reservation VOIDED',
      content: `Your slot for "${booking.courseTitle}" has been cancelled. Full Stripe refund issued offline.`,
      type: 'booking_cancelled',
      createdAt: new Date().toISOString(),
      isRead: false
    };

    // Instructor Alert
    const hostAlert: Notification = {
      id: 'NTF-' + Math.floor(100000 + Math.random() * 900000),
      userId: booking.instructorId,
      title: '⚠️ Guest Booking Cancelled',
      content: `${booking.customerName} cancelled their slot for "${booking.courseTitle}". Bench capacity restored.`,
      type: 'booking_cancelled',
      createdAt: new Date().toISOString(),
      isRead: false
    };

    setNotifications(prev => [clientAlert, hostAlert, ...prev]);
    alert("Cancellation email and database status processed master-level.");
  };

  const handleSimulateReviewRequest = (bId: string) => {
    const booking = bookings.find(b => b.id === bId);
    if (!booking) return;

    const instructor = creators.find(c => c.id === booking.instructorId) || creators[0];
    const details = generateEmailHtml('review_request', booking, instructor);

    const log: EmailLog = {
      id: 'EML-REV-' + Math.floor(100000 + Math.random() * 900000),
      type: 'review_request',
      toEmail: booking.customerEmail,
      toName: booking.customerName,
      subject: details.subject,
      bodyHtml: details.bodyHtml,
      sentAt: new Date().toISOString(),
      status: 'Delivered'
    };

    setEmailLogs(prev => [log, ...prev]);

    // Client alert to review
    const customAlert: Notification = {
      id: 'NTF-REV-' + Math.floor(100000 + Math.random() * 900000),
      userId: booking.customerEmail.toLowerCase(),
      title: '🌟 Review Invitation: Share your experience!',
      content: `Please rate your craftsmanship experience under the master supervision of ${instructor.name}. Direct review links provided.`,
      type: 'review_request',
      createdAt: new Date().toISOString(),
      isRead: false
    };

    setNotifications(prev => [customAlert, ...prev]);
    alert("Review Request successfully fired! Formatted HTML mail is available below.");
  };

  const handleAddCustomAlert = () => {
    const title = prompt("Enter Notification Title:", "🚨 Platform System Update");
    const content = prompt("Enter Alert Details:", "The Woodworker network servers will undergo standard Pleks maintenance tonight at 02:00 UTC.");
    if (!title || !content) return;

    const alertNotif: Notification = {
      id: 'NTF-CUST-' + Math.floor(100000 + Math.random() * 900000),
      userId: sessionUser.id,
      title,
      content,
      type: 'instructor_alert',
      createdAt: new Date().toISOString(),
      isRead: false
    };

    setNotifications(prev => [alertNotif, ...prev]);
  };

  return (
    <div className={`${activeRole === 'student' ? 'bg-white' : 'bg-stone-50 border border-stone-200'} rounded-2xl overflow-hidden font-sans text-stone-800`} id="notification-and-messaging-panel">
      {/* Upper Navigation Tabs for the Hub - Hidden for students */}
      {activeRole !== 'student' && (
        <div className="bg-stone-900 text-stone-200 border-b border-stone-850 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-amber-850 text-stone-950 p-1.5 rounded-lg">
              <MessageSquare className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5 font-display">
                Guild Correspondence & Alerts Matrix
                <span className="bg-amber-400 text-stone-950 font-mono text-[9px] font-bold px-1.5 py-0.2 rounded border border-amber-500">Host Engine</span>
              </h3>
              <p className="text-[10px] text-stone-400 font-mono">Simulating Node Express + Latepoint CRM scheduling systems</p>
            </div>
          </div>

          {/* Tab List */}
          <div className="flex items-center gap-1.5 bg-stone-950/60 p-1 rounded-xl border border-stone-800/80">
            <button
              onClick={() => setActiveMgtTab('airbnb_chat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeMgtTab === 'airbnb_chat' 
                  ? 'bg-amber-850 text-white shadow-xs' 
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> Airbnb Messenger
            </button>

            <button
              onClick={() => setActiveMgtTab('notification_log')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer relative ${
                activeMgtTab === 'notification_log' 
                  ? 'bg-amber-850 text-white' 
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Bell className="w-3.5 h-3.5" /> 
              Inbox Notification Center
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveMgtTab('outbox')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeMgtTab === 'outbox' 
                  ? 'bg-amber-850 text-white' 
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" /> SMTP Outbox ({emailLogs.length})
            </button>

            <button
              onClick={() => setActiveMgtTab('automation_daemon')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeMgtTab === 'automation_daemon' 
                  ? 'bg-amber-500 text-stone-950' 
                  : 'text-stone-400 hover:text-stone-200 border-l border-stone-800/80 pl-2'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" /> System Controls
            </button>
          </div>
        </div>
      )}

      {/* RENDER VIEW 1: AIRBNB MESSENGER */}
      {activeMgtTab === 'airbnb_chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]" id="airbnb-messaging-panel">
          
          {/* Threads List Column */}
          <div className="lg:col-span-4 bg-white border-r border-stone-200 flex flex-col justify-between">
            <div className="p-4 border-b border-stone-100 bg-stone-50/50">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-450">Active Threads</span>
                {activeRole !== 'student' && (
                  <span className="text-[10.5px] font-bold text-stone-500 font-mono">Role: {sessionUser.role}</span>
                )}
              </div>
              {activeRole !== 'student' && (
                <div className="px-3 py-2 bg-amber-50/40 border border-amber-900/10 rounded-xl text-left mt-2">
                  <p className="text-[10px] text-amber-900 font-mono leading-relaxed">
                    💡 Logged in as: <strong className="text-stone-900">{sessionUser.name}</strong>. Switch to public workspace / different tutors on sandbox bar to test threads.
                  </p>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-stone-100 max-h-[380px]">
              {threads.length === 0 ? (
                <div className="p-8 text-center text-stone-400 space-y-2">
                  <Inbox className="w-8 h-8 mx-auto text-stone-300" />
                  <p className="text-xs">No active correspondence threads detected.</p>
                  {onOpenBookingModal && (
                    <button 
                      onClick={onOpenBookingModal}
                      className="text-[10px] bg-stone-850 hover:bg-stone-900 text-white font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      Book Class to Begin
                    </button>
                  )}
                </div>
              ) : (
                threads.map(thread => {
                  const isActive = activeThreadId === thread.partyId;
                  return (
                    <div
                      key={thread.partyId}
                      onClick={() => setActiveThreadId(thread.partyId)}
                      className={`p-3.5 text-left cursor-pointer transition-all flex items-start gap-3 relative ${
                        isActive 
                          ? 'bg-amber-50/40 border-l-4 border-amber-850' 
                          : 'hover:bg-stone-50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-stone-800 text-stone-100 flex items-center justify-center font-bold text-xs shrink-0 border border-stone-200">
                        {thread.partyName.slice(0, 2).toUpperCase()}
                      </div>
                      
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif font-bold text-xs text-stone-900 truncate">
                            {thread.partyName}
                          </h4>
                          <span className="text-[9px] text-stone-400 font-mono font-medium">
                            {new Date(thread.latestMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {thread.courseContext && (
                          <div className="text-[9px] font-mono font-bold text-amber-850 truncate max-w-[150px]">
                            {thread.courseContext}
                          </div>
                        )}

                        <p className="text-xs text-stone-500 truncate max-w-[200px] leading-relaxed">
                          {thread.latestMessage.text}
                        </p>
                      </div>

                      {thread.unreadCount > 0 && (
                        <span className="absolute top-1/2 -translate-y-1/2 right-3 w-2.5 h-2.5 bg-amber-600 rounded-full ring-2 ring-white animate-pulse" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Active Conversation Chat Log Column */}
          <div className="lg:col-span-8 bg-stone-50 flex flex-col justify-between min-h-[450px]">
            {activeThreadId ? (
              <>
                {/* Header info */}
                <div className="p-4 bg-white border-b border-stone-200 text-left flex justify-between items-center gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5 justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <div>
                      <h4 className="font-serif font-black text-sm text-stone-900 leading-none">
                        {getThreadList().find(t => t.partyId === activeThreadId)?.partyName || 'Craftsman Partner'}
                      </h4>
                      <p className="text-[10px] text-stone-450 font-mono mt-1">
                        {activeRole === 'student' ? (
                          <span className="text-emerald-600 font-semibold">● Active Host</span>
                        ) : (
                          'Airbnb Shared Hub • End-to-end communication matrix'
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Booking Link block */}
                  {activeRole !== 'student' && (() => {
                    const activeBooking = bookings.find(b => 
                      b.customerEmail.toLowerCase() === activeThreadId.toLowerCase() || 
                      b.customerEmail.toLowerCase() === sessionUser.id.toLowerCase()
                    );
                    if (activeBooking) {
                      return (
                        <div className="px-2.5 py-1 bg-amber-50 border border-amber-250/50 rounded-lg text-right text-[10px] hidden sm:block">
                          <span className="font-mono text-amber-800 font-bold">Ref: {activeBooking.id}</span>
                          <span className="text-stone-400 mx-1">•</span>
                          <span className="text-stone-600 italic">{activeBooking.courseTitle}</span>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>

                {/* Core Messages Display */}
                <div className="flex-1 p-4 overflow-y-auto space-y-2 max-h-[280px]">
                  {activeConversationMessages.map(msg => {
                    const isSelf = msg.senderId.toLowerCase() === sessionUser.id.toLowerCase();
                    return (
                      <div 
                        key={msg.id}
                        className={`flex flex-col max-w-[80%] ${isSelf ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[9px] font-bold text-stone-550">{msg.senderName}</span>
                          <span className="text-[8px] font-mono text-stone-400">
                            {new Date(msg.createdAt).toLocaleDateString([], { day: 'numeric', month: 'short' })} {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          isSelf 
                            ? 'bg-stone-900 text-stone-50 rounded-tr-none' 
                            : 'bg-white text-stone-800 border border-stone-200 shadow-3xs rounded-tl-none'
                        }`}>
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        
                        {isSelf && (
                          <span className="text-[8px] text-stone-405 font-mono italic mt-0.5 flex items-center gap-0.5">
                            {msg.isRead ? <CheckCheck className="w-3 text-emerald-600" /> : <Check className="w-3" />} Sent
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Chat composition block */}
                <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-stone-200 flex items-center gap-3">
                  <input
                    type="text"
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    placeholder="Coordinate woodworking preparations..."
                    className="flex-1 text-xs border border-stone-250 p-2.5 rounded-xl bg-stone-50 focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="w-10 h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-md shrink-0 transition-all focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
                    title="Send message"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-stone-400">
                <MessageSquare className="w-12 h-12 text-stone-250 mb-3" />
                <p className="text-xs font-medium">Select a coordination thread to correspond securely with the artisan host.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RENDER VIEW 2: NOTIFICATION CENTRE */}
      {activeMgtTab === 'notification_log' && (
        <div className="p-6 bg-white space-y-4 text-left" id="notification-center-tab">
          <div className="flex justify-between items-center border-b border-stone-200 pb-3">
            <div>
              <h4 className="font-serif font-black text-sm text-stone-900 flex items-center gap-1.5">
                <Bell className="w-5 h-5 text-amber-800" /> Alert Dispatch Matrix
              </h4>
              <p className="text-[10px] text-stone-400 font-mono mt-0.5">Dashboard notification signals registered for {sessionUser.id}</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleAddCustomAlert}
                className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase border border-stone-250 hover:border-amber-800 rounded-lg text-stone-650 cursor-pointer"
              >
                + Sandbox Trigger Alert
              </button>
              <button
                onClick={markAllNotificationsRead}
                className="px-2.5 py-1 text-[10px] font-mono tracking-wider font-bold bg-amber-50 text-amber-900 rounded-lg cursor-pointer hover:bg-amber-100"
              >
                Mark Account Read
              </button>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {myNotifications.length === 0 ? (
              <div className="py-12 text-center border border-dashed rounded-xl border-stone-200 text-stone-400 space-y-2">
                <Bell className="w-8 h-8 text-stone-300 mx-auto" />
                <p className="text-xs">No notifications correspond to this logged-in account role ({sessionUser.id}) yet.</p>
              </div>
            ) : (
              myNotifications.map(notif => (
                <div 
                  key={notif.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    notif.isRead 
                      ? 'bg-stone-50/60 border-stone-150' 
                      : 'bg-amber-50/15 border-amber-340 shadow-2xs relative'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl shrink-0 mt-0.5">
                      {notif.type === 'message' && '✉️'}
                      {notif.type === 'booking_confirmed' && '✔️'}
                      {notif.type === 'booking_cancelled' && '⚠️'}
                      {notif.type === 'automated_reminder' && '⏳'}
                      {notif.type === 'review_request' && '🌟'}
                      {notif.type === 'instructor_alert' && '🔔'}
                    </span>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-bold text-stone-900 font-sans">{notif.title}</h5>
                        {!notif.isRead && (
                          <span className="bg-red-600 text-white font-bold text-[7px] uppercase tracking-wider px-1 rounded animate-pulse">New</span>
                        )}
                        <span className="text-[9px] text-stone-400 font-mono">
                          {new Date(notif.createdAt).toLocaleDateString([], { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <p className="text-xs text-stone-550 leading-relaxed">{notif.content}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="text-stone-350 hover:text-red-700 p-1 rounded hover:bg-stone-100 transition-colors cursor-pointer"
                    title="Dismiss alert"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* RENDER VIEW 3: OUTBOX EMAIL DELIVERIES PANEL */}
      {activeMgtTab === 'outbox' && (
        <div className="p-6 bg-white space-y-4 text-left font-sans" id="outbox-email-delivery-console">
          <div className="flex justify-between items-center border-b border-stone-200 pb-3">
            <div>
              <h4 className="font-serif font-black text-sm text-stone-900 flex items-center gap-1.5">
                <Mail className="w-5 h-5 text-amber-800" /> Outbound SMTP Mail Controller
              </h4>
              <p className="text-[10px] text-stone-400 font-mono mt-0.5">Mock dispatcher log capturing outbound HTML transactional mailers</p>
            </div>
            {emailLogs.length > 0 && (
              <button
                onClick={() => { setEmailLogs([]); setViewingEmailDetail(null); }}
                className="p-1 px-2.5 text-[9px] text-red-700 hover:bg-red-50 font-bold uppercase rounded cursor-pointer transition-colors"
              >
                Clear Mail Cache
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Outbox List */}
            <div className="lg:col-span-5 space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
              {emailLogs.length === 0 ? (
                <div className="py-20 text-center border border-dashed rounded-xl text-stone-400 text-xs">
                  SMTP outbox completely clean. Book a syllabus to dispatch transaction emails!
                </div>
              ) : (
                emailLogs.map(log => {
                  const isSelected = viewingEmailDetail?.id === log.id;
                  return (
                    <div
                      key={log.id}
                      onClick={() => setViewingEmailDetail(log)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all space-y-1.5 ${
                        isSelected 
                          ? 'bg-amber-50/40 border-amber-850 shadow-3xs' 
                          : 'bg-stone-50/50 hover:bg-stone-50 border-stone-150'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-mono uppercase bg-stone-200 text-stone-800 px-1.5 py-0.2 rounded font-bold">
                          {log.type.replace('_', ' ')}
                        </span>
                        <span className="text-[9px] text-stone-400 font-mono">
                          {new Date(log.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <h5 className="text-[11px] font-bold text-stone-900 truncate">{log.subject}</h5>
                        <p className="text-[9px] text-stone-500 font-mono">To: {log.toName} ({log.toEmail})</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[9.5px] font-mono text-emerald-800 font-bold flex items-center gap-0.5">
                          <Check className="w-3" /> {log.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Email HTML Live Inspect Panel */}
            <div className="lg:col-span-7 bg-stone-100 border border-stone-200 rounded-xl p-4 flex flex-col justify-between max-h-[350px] overflow-hidden">
              {viewingEmailDetail ? (
                <div className="flex flex-col h-full justify-between">
                  {/* Subject and Target Details */}
                  <div className="bg-white p-3 border-b border-stone-200 rounded-t-xl text-left space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-stone-400 font-bold">SMTP Envelope Details:</span>
                      <button 
                        onClick={() => setViewingEmailDetail(null)}
                        className="text-[9px] text-stone-400 hover:text-stone-900"
                      >
                        Close [x]
                      </button>
                    </div>
                    <div className="text-xs font-sans">
                      <div><strong className="text-stone-605">Subject:</strong> {viewingEmailDetail.subject}</div>
                      <div><strong className="text-stone-605">Destination:</strong> {viewingEmailDetail.toName} (<code className="bg-stone-100 px-1 rounded">{viewingEmailDetail.toEmail}</code>)</div>
                    </div>
                  </div>

                  {/* HTML Frame Sandbox */}
                  <div className="flex-1 bg-white p-4 overflow-y-auto border-x border-b border-stone-250 rounded-b-xl my-2 max-h-[220px]">
                    <div dangerouslySetInnerHTML={{ __html: viewingEmailDetail.bodyHtml }} />
                  </div>

                  <span className="text-[9px] text-stone-400 font-mono text-center">
                    📧 Inspecting actual responsive inline styles handled by Express dispatch services.
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-stone-405 text-center p-6 bg-white/50 border border-dashed rounded-xl">
                  <Mail className="w-10 h-10 text-stone-300 mb-2" />
                  <p className="text-xs font-semibold">Live Transactional Mail Inspect Grid</p>
                  <p className="text-[10px] text-stone-500 max-w-xs mt-1">Select any dispatched outbox mailer on the left to review HTML header, subject wrappers, and responsive styling block output.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RENDER VIEW 4: SYSTEM CRM TESTING DAEMON */}
      {activeMgtTab === 'automation_daemon' && (
        <div className="p-6 bg-white space-y-4 text-left" id="crm-sys-controls">
          <div>
            <h4 className="font-serif font-black text-sm text-stone-900 flex items-center gap-1.5 animate-pulse">
              <Sliders className="w-5 h-5 text-amber-500" /> Host CRM Automation Sandbox Controls
            </h4>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              These trigger controls replicate background scheduler crons and node API dispatch routes offline. Test workflows in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Box A - 3 Days Scheduler Trigger */}
            <div className="bg-amber-50/15 border border-amber-250 p-4 rounded-xl text-left space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-850 shrink-0" />
                  <h5 className="text-xs font-black text-stone-900">3-Day Prior Reminder Cron</h5>
                </div>
                <p className="text-[10px] text-stone-500 leading-normal">
                  Fulfilling Latepoint scheduler checks: automates emails for bookings scheduled three days in the future.
                </p>
              </div>
              <button
                onClick={handleSimulateTimeSkip3Days}
                className="w-full py-2 bg-amber-850 hover:bg-amber-900 text-white font-bold text-xs uppercase rounded-xl tracking-wider cursor-pointer shadow-xs transition-colors"
              >
                Trigger 3d Chronos Cron
              </button>
            </div>

            {/* Box B - Booking Completions & Reviews */}
            <div className="bg-emerald-50/10 border border-emerald-250 p-4 rounded-xl text-left space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-800 shrink-0" />
                  <h5 className="text-xs font-black text-stone-950">Review Invitation Cron</h5>
                </div>
                <p className="text-[10px] text-stone-500 leading-normal">
                  Scrapes past completed classes on wordpress calendar database, requesting students leave verified reviews.
                </p>
              </div>

              {bookings.length > 0 ? (
                <div className="space-y-1.5">
                  <span className="text-[8.5px] font-mono text-stone-400">SELECT BOOKING TO COMPLETE:</span>
                  <div className="space-y-1 max-h-[85px] overflow-y-auto border border-stone-200/60 rounded p-1">
                    {bookings.slice(0, 3).map(b => (
                      <button
                        key={b.id}
                        onClick={() => handleSimulateReviewRequest(b.id)}
                        className="w-full text-left text-[9.5px] hover:bg-emerald-50 px-1 py-0.5 rounded text-stone-700 font-medium truncate shrink-0 cursor-pointer flex justify-between gap-1"
                      >
                        <span>{b.customerName} - {b.id}</span>
                        <span className="text-emerald-800 font-bold">Complete & Ask [→]</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  disabled
                  className="w-full py-2 bg-stone-300 text-stone-500 font-bold text-xs rounded-xl cursor-not-allowed"
                >
                  No Registered Bookings
                </button>
              )}
            </div>

            {/* Box C - Cancellation Dispatcher */}
            <div className="bg-red-50/10 border border-red-250 p-4 rounded-xl text-left space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
                  <h5 className="text-xs font-black text-stone-950">Instant Cancellation Matrix</h5>
                </div>
                <p className="text-[10px] text-stone-500 leading-normal">
                  Dumps booking status to Cancelled and triggers immediate refunds, email logs and notification center updates.
                </p>
              </div>

              {bookings.filter(b => b.status !== 'Cancelled').length > 0 ? (
                <div className="space-y-1.5">
                  <span className="text-[8.5px] font-mono text-stone-400">SELECT SECURED RESERVATION to CANCEL:</span>
                  <div className="space-y-1 max-h-[85px] overflow-y-auto border border-stone-200/60 rounded p-1">
                    {bookings.filter(b => b.status !== 'Cancelled').slice(0, 3).map(b => (
                      <button
                        key={b.id}
                        onClick={() => handleSimulateCancellation(b.id)}
                        className="w-full text-left text-[9.5px] hover:bg-red-50 px-1 py-0.5 rounded text-stone-700 font-medium truncate shrink-0 cursor-pointer flex justify-between gap-1"
                      >
                        <span>{b.customerName} ({b.id})</span>
                        <span className="text-red-700 font-bold">Refund [❌]</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-[9.5px] text-stone-400 text-center py-2 border rounded">
                  All active bookings cancelled.
                </div>
              )}
            </div>

          </div>

          {/* Database monitor block */}
          <div className="bg-stone-900 p-4 rounded-xl space-y-2 text-stone-200 border border-stone-800">
            <div className="flex justify-between items-center text-[10.5px]">
              <span className="font-mono text-amber-400 font-bold flex items-center gap-1.5">
                <Database className="w-4 h-4 text-amber-500" /> ACTIVE LATEPOINT MEMORY DATABASE LOGS
              </span>
              <span className="text-stone-500 font-mono">Status: Sync Ok</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono divide-x divide-stone-800">
              <div>
                <div className="text-stone-450 uppercase uppercase">Secured Bookings</div>
                <div className="text-base text-white font-bold mt-0.5">{bookings.length} record(s)</div>
              </div>
              <div>
                <div className="text-stone-450 uppercase uppercase">Email Deliveries</div>
                <div className="text-base text-white font-bold mt-0.5">{emailLogs.length} processed</div>
              </div>
              <div>
                <div className="text-stone-450 uppercase">Inbox Messages</div>
                <div className="text-base text-white font-bold mt-0.5">{messages.length} letters</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
