import { Course, Booking, Creator } from './types';

export const INITIAL_CREATORS: Creator[] = [
  {
    id: 'inst_all',
    name: 'Main Administrator',
    email: 'charlee19071@gmail.com',
    role: 'admin',
    bio: 'Primary operator of woodworker.org.uk WoodWorker.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop',
    location: 'London'
  },
  {
    id: 'inst_david',
    name: 'David Green',
    email: 'david@woodworker.org.uk',
    role: 'instructor',
    bio: 'Artisan green woodworker specializing in Swedish axe and knife spoon-carving techniques.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
    location: 'Devon'
  },
  {
    id: 'inst_evelyn',
    name: 'Evelyn Wood',
    email: 'evelyn@woodworker.org.uk',
    role: 'instructor',
    bio: 'Fine cabinetry restoration expert with a passion for Japanese waterstones and water-resistant oils.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
    location: 'London'
  },
  {
    id: 'inst_marcus',
    name: 'Marcus Miller',
    email: 'marcus@woodworker.org.uk',
    role: 'instructor',
    bio: 'Historic joinery master. Author of traditional English structural timber-framing blueprints.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop',
    location: 'Yorkshire'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Spoon Carving & Axe Workshop',
    description: 'Learn the ancient art of green woodworking. Master safe axe and knife techniques, understand wood grain, and design your own beautiful hand-carved cherry wood wooden cooking spoon.',
    durationType: 'hourly',
    durationLabel: '3 Hours',
    price: 45,
    capacity: 6,
    instructorId: 'inst_david',
    instructor: 'David Green',
    difficulty: 'Beginner',
    materialsIncluded: true,
    location: 'Devon',
    image: 'spoon_carving',
    timeSlots: ['09:00 - 12:00', '13:30 - 16:30', '18:00 - 21:00']
  },
  {
    id: 'c2',
    title: 'Precision Tool Sharpening & Care',
    description: 'A sharp woodworker is a happy woodworker. Bring your own hand planes, chisels, or carving knives. Learn Japanese waterstone sharpening, leather stropping, and plane iron adjustment.',
    durationType: 'hourly',
    durationLabel: '2 Hours',
    price: 35,
    capacity: 8,
    instructorId: 'inst_evelyn',
    instructor: 'Evelyn Wood',
    difficulty: 'Beginner',
    materialsIncluded: false,
    location: 'Devon',
    image: 'tool_care',
    timeSlots: ['10:00 - 12:00', '14:00 - 16:00']
  },
  {
    id: 'c3',
    title: 'Introduction to Hand-Cut Joinery',
    description: 'Discover the strength and beauty of traditional jointing methods. Spend a day diving into layout layout tools, sawing fine lines, chopping timber, and building a secure housing joint and bridle joint.',
    durationType: 'daily',
    durationLabel: '1 Day',
    price: 135,
    capacity: 5,
    instructorId: 'inst_marcus',
    instructor: 'Marcus Miller',
    difficulty: 'Intermediate',
    materialsIncluded: true,
    location: 'Cornwall',
    image: 'joinery'
  },
  {
    id: 'c4',
    title: 'Rustic Dovetail Keepsafe Box',
    description: 'Craft an elegant heirloom container with through-dovetails from local English Oak and Walnut. Master chiseling wood drawers and fitting brass hinges with millimeter precision.',
    durationType: 'daily',
    durationLabel: '2 Days',
    price: 260,
    capacity: 4,
    instructorId: 'inst_david',
    instructor: 'David Green',
    difficulty: 'Intermediate',
    materialsIncluded: true,
    location: 'Devon',
    image: 'dovetail_box'
  },
  {
    id: 'c5',
    title: 'Fine Furniture Design & Assembly',
    description: 'Our flagship woodworking experience. Plan, select local lumber, prepare surfaces, construct complex joints, apply organic oils, and complete a bespoke hardwood side table from raw boards.',
    durationType: 'weekly',
    durationLabel: '1 Week',
    price: 590,
    capacity: 3,
    instructorId: 'inst_evelyn',
    instructor: 'Evelyn Wood',
    difficulty: 'Advanced',
    materialsIncluded: true,
    location: 'Bristol',
    image: 'furniture'
  },
  {
    id: 'c6',
    title: 'Traditional Tool Chest Build',
    description: 'Construct a sturdy, stylish wall-mounted solid wood cabinet for your cherished tools. Projects cover raised panel doors, slide-out timber tills, and historic finishing wax methods.',
    durationType: 'weekly',
    durationLabel: '1 Week',
    price: 480,
    capacity: 4,
    instructorId: 'inst_marcus',
    instructor: 'Marcus Miller',
    difficulty: 'Advanced',
    materialsIncluded: true,
    location: 'Yorkshire',
    image: 'tool_chest'
  },
  {
    id: 'c7',
    title: 'Woodturning Bowl Masterclass',
    description: 'Master the lathe. Learn to securely mount green timber blanks, select woodturning gouges, apply correct bevel pressure, and safely turn a beautiful spalted birch salad bowl from scratch.',
    durationType: 'hourly',
    durationLabel: '4 Hours',
    price: 75,
    capacity: 4,
    instructorId: 'inst_david',
    instructor: 'David Green',
    difficulty: 'Intermediate',
    materialsIncluded: true,
    location: 'Devon',
    image: 'spoon_carving',
    timeSlots: ['09:00 - 13:00', '14:00 - 18:00']
  },
  {
    id: 'c8',
    title: 'Cabinet Making & Veneer Art',
    description: 'An exploration of decorative surfacing. Learn matching timber veneers, dynamic marquetry knife-cuts, vacuum-press and hide glue clamping, and hand-rubbed shellac French polish finish.',
    durationType: 'daily',
    durationLabel: '3 Days',
    price: 320,
    capacity: 5,
    instructorId: 'inst_evelyn',
    instructor: 'Evelyn Wood',
    difficulty: 'Advanced',
    materialsIncluded: true,
    location: 'Bristol',
    image: 'furniture'
  },
  {
    id: 'c9',
    title: 'Timber Frame Carpentry Basics',
    description: 'Go grand-scale. Work with master-grade Douglas Fir or English Oak beams. Lay out traditional trestle designs, drill oak pegs, and chop massive mortise-and-tenon framing joints safely.',
    durationType: 'daily',
    durationLabel: '2 Days',
    price: 240,
    capacity: 6,
    instructorId: 'inst_marcus',
    instructor: 'Marcus Miller',
    difficulty: 'Beginner',
    materialsIncluded: true,
    location: 'Yorkshire',
    image: 'joinery'
  },
  {
    id: 'c10',
    title: 'Japanese Hand Plane & Joinery',
    description: 'Discover the precision of Kana (planes) and master Japanese traditional joints like the beautiful Kanawa Tsugi. Build pure mechanical joinery without a single metal fastener.',
    durationType: 'daily',
    durationLabel: '1 Day',
    price: 155,
    capacity: 4,
    instructorId: 'inst_evelyn',
    instructor: 'Evelyn Wood',
    difficulty: 'Advanced',
    materialsIncluded: true,
    location: 'Devon',
    image: 'tool_care'
  },
  {
    id: 'c11',
    title: 'Windsor Chair Bench Workshop',
    description: 'Work with steam-bent ash elements and high-tensile hand-carved pine seats. Master the adze, drawknife, and precise compound-angle spindle drilling to complete a sturdy, iconic seat.',
    durationType: 'weekly',
    durationLabel: '1 Week',
    price: 650,
    capacity: 3,
    instructorId: 'inst_david',
    instructor: 'David Green',
    difficulty: 'Advanced',
    materialsIncluded: true,
    location: 'Cornwall',
    image: 'furniture'
  },
  {
    id: 'c12',
    title: 'Introduction to Carving Relief',
    description: 'Beginner-friendly training in wood sculpting. Work with soft lime timber blocks to carve relief patterns, learn grain direction, hold chisels safely, and finish with a coat of beeswax.',
    durationType: 'hourly',
    durationLabel: '3 Hours',
    price: 40,
    capacity: 10,
    instructorId: 'inst_marcus',
    instructor: 'Marcus Miller',
    difficulty: 'Beginner',
    materialsIncluded: true,
    location: 'London',
    image: 'spoon_carving',
    timeSlots: ['10:00 - 13:00', '14:00 - 17:00']
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    courseId: 'c1',
    courseTitle: 'Spoon Carving & Axe Workshop',
    instructorId: 'inst_david',
    durationType: 'hourly',
    customerName: 'Thomas Thorne',
    customerEmail: 'thomas.thorne@example.com',
    customerPhone: '+44 7700 900077',
    bookingDate: '2026-06-12',
    timeSlot: '09:00 - 12:00',
    notes: 'Absolute beginner. Buying as a birthday gift for my wife who loves green wood craft.',
    totalPrice: 45,
    status: 'Confirmed',
    payoutStatus: 'Paid',
    createdAt: '2026-06-05T10:15:00Z',
    skillsLevel: 'Beginner'
  },
  {
    id: 'b2',
    courseId: 'c3',
    courseTitle: 'Introduction to Hand-Cut Joinery',
    instructorId: 'inst_marcus',
    durationType: 'daily',
    customerName: 'Claire Cooper',
    customerEmail: 'claire_coop@outlook.com',
    customerPhone: '+44 7855 123456',
    bookingDate: '2026-06-15',
    notes: 'I have some experience with power tools but want to learn traditional woodworking joints without screaming routers!',
    totalPrice: 135,
    status: 'Confirmed',
    payoutStatus: 'Processing',
    createdAt: '2026-06-07T14:22:30Z',
    skillsLevel: 'Intermediate'
  },
  {
    id: 'b3',
    courseId: 'c5',
    courseTitle: 'Fine Furniture Design & Assembly',
    instructorId: 'inst_evelyn',
    durationType: 'weekly',
    customerName: 'James Sterling',
    customerEmail: 'j.sterling@timberdesign.uk',
    customerPhone: '+44 7911 888222',
    bookingDate: '2026-06-22',
    notes: 'Would love to work with sycamore or walnut. I will bring some of my own specialized visual timber templates to inspect.',
    totalPrice: 590,
    status: 'Pending',
    payoutStatus: 'Not Requested',
    createdAt: '2026-06-08T09:40:00Z',
    skillsLevel: 'Advanced'
  },
  {
    id: 'b4',
    courseId: 'c2',
    courseTitle: 'Precision Tool Sharpening & Care',
    instructorId: 'inst_evelyn',
    durationType: 'hourly',
    customerName: 'Michael Oakwood',
    customerEmail: 'mike@oakwoodbuild.co.uk',
    customerPhone: '+44 7624 555666',
    bookingDate: '2026-06-11',
    timeSlot: '14:00 - 16:00',
    notes: 'Bringing 3 vintage Bailey hand planes and a set of old Sorby bench chisels that need serious restoration.',
    totalPrice: 35,
    status: 'Confirmed',
    payoutStatus: 'Not Requested',
    createdAt: '2026-06-06T11:05:00Z',
    skillsLevel: 'Beginner'
  }
];

export const IMAGE_PRESETS = [
  { key: 'spoon_carving', url: 'https://images.unsplash.com/photo-1590372648787-bf53d7197bba?w=800&auto=format&fit=crop&q=80', label: 'Spoon Carving' },
  { key: 'tool_care', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80', label: 'Tool Care' },
  { key: 'joinery', url: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&auto=format&fit=crop&q=80', label: 'Fine Wood Joinery' },
  { key: 'dovetail_box', url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80', label: 'Dovetail Keepsafe' },
  { key: 'furniture', url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80', label: 'Fine Furniture Design' },
  { key: 'tool_chest', url: 'https://images.unsplash.com/photo-1621259182978-f09e5e2b07ae?w=800&auto=format&fit=crop&q=80', label: 'Traditional Tool Chest' },
];

export const getImagePresetUrl = (key: string) => {
  const match = IMAGE_PRESETS.find(p => p.key === key);
  if (match) return match.url;
  if (key && (key.startsWith('http://') || key.startsWith('https://'))) return key;
  return 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80';
};

