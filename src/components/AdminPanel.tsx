import React, { useState } from 'react';
import { Course, Booking, CourseDurationType, Creator } from '../types';
import { INITIAL_CREATORS, IMAGE_PRESETS, getImagePresetUrl } from '../coursesData';
import { 
  Users, Calendar, DollarSign, BookOpen, Clock, Tag, Plus, Trash2, 
  CheckCircle, AlertCircle, XCircle, Search, HelpCircle, Save, Filter, Award, Shield, UserCheck, Key, Upload
} from 'lucide-react';

interface AdminPanelProps {
  courses: Course[];
  bookings: Booking[];
  addCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
  updateBookingStatus: (id: string, status: 'Pending' | 'Confirmed' | 'Cancelled') => void;
  deleteBooking: (id: string) => void;
}

export default function AdminPanel({
  courses,
  bookings,
  addCourse,
  deleteCourse,
  updateBookingStatus,
  deleteBooking
}: AdminPanelProps) {
  // Multi-Vendor Active Session State
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>('inst_all');
  const selectedCreator = INITIAL_CREATORS.find(c => c.id === selectedCreatorId) || INITIAL_CREATORS[0];

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [durationFilter, setDurationFilter] = useState<string>('All');

  // New Course Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDurationType, setNewDurationType] = useState<CourseDurationType>('hourly');
  const [newDurationLabel, setNewDurationLabel] = useState('3 Hours');
  const [newPrice, setNewPrice] = useState(50);
  const [newCapacity, setNewCapacity] = useState(6);
  const [newInstructor, setNewInstructor] = useState('David Green');
  const [newDifficulty, setNewDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [newMaterialsIncluded, setNewMaterialsIncluded] = useState(true);
  const [newLocation, setNewLocation] = useState('Devon');
  const [newImage, setNewImage] = useState<string>('');
  const [newImages, setNewImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);

  // Multi-vendor Filtered Sets
  const filteredCoursesList = courses.filter(c => selectedCreatorId === 'inst_all' || c.instructorId === selectedCreatorId);
  const filteredBookingsForStats = bookings.filter(b => selectedCreatorId === 'inst_all' || b.instructorId === selectedCreatorId);

  // Stats calculation based on active Creator Session
  const totalBookingsCount = filteredBookingsForStats.length;
  const confirmedBookings = filteredBookingsForStats.filter(b => b.status === 'Confirmed');
  const totalRevenue = filteredBookingsForStats
    .filter(b => b.status === 'Confirmed' || b.status === 'Pending')
    .reduce((sum, b) => sum + b.totalPrice, 0);
  const averageValue = totalBookingsCount > 0 ? (totalRevenue / totalBookingsCount) : 0;

  // Hourly vs Daily vs Weekly counts
  const hourlyCount = filteredBookingsForStats.filter(b => b.durationType === 'hourly').length;
  const dailyCount = filteredBookingsForStats.filter(b => b.durationType === 'daily').length;
  const weeklyCount = filteredBookingsForStats.filter(b => b.durationType === 'weekly').length;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const assignedInstructorId = selectedCreatorId === 'inst_all' ? 'inst_david' : selectedCreatorId;
    const assignedInstructorName = selectedCreatorId === 'inst_all' ? newInstructor : selectedCreator.name;

    const courseObj: Course = {
      id: 'course_' + Date.now(),
      title: newTitle,
      description: newDesc,
      durationType: newDurationType,
      durationLabel: newDurationLabel,
      price: Number(newPrice),
      capacity: Number(newCapacity),
      instructorId: assignedInstructorId,
      instructor: assignedInstructorName,
      difficulty: newDifficulty,
      materialsIncluded: newMaterialsIncluded,
      location: newLocation.trim() || 'Devon',
      image: newImages[0] || newImage || 'spoon_carving',
      images: newImages.length > 0 ? newImages : (newImage ? [newImage] : []),
      timeSlots: newDurationType === 'hourly' ? ['09:00 - 12:00', '13:00 - 16:00', '17:00 - 20:00'] : undefined
    };

    addCourse(courseObj);
    
    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setNewPrice(50);
    setNewCapacity(6);
    setNewLocation('Devon');
    setNewImage('');
    setNewImages([]);
    setImageError(null);
    setShowAddForm(false);
  };

  // Filter Bookings Ledger list
  const filteredBookings = bookings.filter(b => {
    // Basic structural search & filter
    const matchesSearch = b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesDuration = durationFilter === 'All' || b.durationType === durationFilter;
    
    // Multi-tenant isolation:
    const matchesCreator = selectedCreatorId === 'inst_all' || b.instructorId === selectedCreatorId;

    return matchesSearch && matchesStatus && matchesDuration && matchesCreator;
  });

  return (
    <div className="space-y-8 text-stone-800" id="admin-dashboard-container">
      
      {/* Multi-Vendor Simulator Station (LatePoint Replication API) */}
      <div className="bg-gradient-to-br from-amber-950 via-stone-900 to-stone-950 rounded-2xl p-6 text-stone-100 relative overflow-hidden border border-amber-900/40 shadow-lg" id="vendor-switch-panel">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-800/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/10 font-mono text-[10px] uppercase font-bold tracking-wider">
              <Shield className="w-3.5 h-3.5 text-amber-400" /> LatePoint Multi-Vendor Coexist Engine
            </div>
            <h2 className="font-serif text-xl font-bold tracking-tight text-white">
              Instructor Dashboard Simulator
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed">
              In WordPress, other creators log into their secure WordPress dashboard to manage their woodwork courses. Use this switcher to simulate how instructors view their isolated client booking logs, calculate personal earnings, and publish syllabi.
            </p>
          </div>
          
          {/* Switcher Dropdown and Quick Profile */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-stone-900/95 p-3 rounded-xl border border-stone-800 shrink-0">
            <div className="flex items-center gap-3 px-1">
              <img 
                src={selectedCreator.avatar} 
                alt={selectedCreator.name} 
                className="w-10 h-10 rounded-xl object-cover border border-amber-500/30 shrink-0" 
              />
              <div className="text-left">
                <div className="text-xs font-bold text-white leading-tight flex items-center gap-1.5">
                  {selectedCreator.name}
                  {selectedCreator.role === 'admin' ? (
                    <span className="px-1 text-[8px] uppercase tracking-wide bg-amber-500/20 text-amber-300 rounded font-semibold">Super Admin</span>
                  ) : (
                    <span className="px-1 text-[8px] uppercase tracking-wide bg-blue-500/20 text-blue-300 rounded font-semibold">Instructor</span>
                  )}
                </div>
                <div className="text-[10px] text-stone-400 font-serif italic">{selectedCreator.email}</div>
              </div>
            </div>
            
            <div className="border-t sm:border-t-0 sm:border-l border-stone-800 pt-3 sm:pt-0 sm:pl-3 flex flex-col gap-1.5">
              <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400">Switch Creator View</label>
              <select
                value={selectedCreatorId}
                onChange={(e) => {
                  setSelectedCreatorId(e.target.value);
                  // Ensure if form is open, we prefill name
                  const selectedId = e.target.value;
                  const found = INITIAL_CREATORS.find(c => c.id === selectedId);
                  if (found && found.role !== 'admin') {
                    setNewInstructor(found.name);
                  }
                }}
                className="px-2.5 py-1.5 bg-stone-950 border border-stone-700/60 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-200 font-semibold cursor-pointer"
              >
                {INITIAL_CREATORS.map(creator => (
                  <option key={creator.id} value={creator.id}>
                    {creator.role === 'admin' ? '🔑 ' : '🪵 '} {creator.name} ({creator.role})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Short info bio line */}
        <div className="mt-4 pt-3.5 border-t border-stone-800/80 text-[10px] text-stone-400 font-mono flex flex-wrap gap-x-4 gap-y-1">
          <span><strong>Instructor Profile Bio:</strong> "{selectedCreator.bio}"</span>
        </div>
      </div>

      {/* 1. Header Grid KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="kpi-cards">
        {/* KPI 1 */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider">Projected Revenue</span>
            <div className="text-2xl font-serif font-bold text-stone-900">£{totalRevenue}</div>
            <p className="text-[10px] text-stone-500">Confirmed &amp; pending payments</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-800">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider">Active Bookings</span>
            <div className="text-2xl font-serif font-bold text-stone-900">{totalBookingsCount}</div>
            <div className="flex gap-2 text-[10px] text-stone-500">
              <span>{confirmedBookings.length} Approved</span>
              <span>•</span>
              <span>{bookings.filter(b => b.status === 'Pending').length} Pending</span>
            </div>
          </div>
          <div className="p-3 bg-stone-100 rounded-xl text-stone-700">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider">Active Courses</span>
            <div className="text-2xl font-serif font-bold text-stone-900">{courses.length}</div>
            <p className="text-[10px] text-stone-500">Hourly, daily, and weekly offered</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-800">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider">Bench Occupancy</span>
            <div className="text-2xl font-serif font-bold text-stone-900">78%</div>
            <p className="text-[10px] text-stone-500">Average weekly workshops slots filled</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl text-blue-800">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. Visual Distributions Chart */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-4" id="distribution-row">
        <h3 className="font-serif text-lg font-bold">Booking Distribution BY COURSE FREQUENCY</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Hourly */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-stone-600 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-700" /> Hourly Classes</span>
              <span className="text-stone-900">{hourlyCount} bookings</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-amber-600 h-2.5 rounded-full" 
                style={{ width: `${totalBookingsCount > 0 ? (hourlyCount / totalBookingsCount) * 100 : 0}%` }}
              />
            </div>
            <span className="text-[10px] text-stone-400">e.g. Spoon Carving & Knife Sharpening</span>
          </div>

          {/* Daily */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-stone-600 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-emerald-700" /> Daily Seminars</span>
              <span className="text-stone-900">{dailyCount} bookings</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-emerald-600 h-2.5 rounded-full" 
                style={{ width: `${totalBookingsCount > 0 ? (dailyCount / totalBookingsCount) * 100 : 0}%` }}
              />
            </div>
            <span className="text-[10px] text-stone-400">e.g. Traditional Joinery & Dovetail Box</span>
          </div>

          {/* Weekly */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-stone-600 flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-blue-700" /> Weekly Intensive Courses</span>
              <span className="text-stone-900">{weeklyCount} bookings</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${totalBookingsCount > 0 ? (weeklyCount / totalBookingsCount) * 100 : 0}%` }}
              />
            </div>
            <span className="text-[10px] text-stone-400">e.g. Fine Furniture & traditional cabinet build</span>
          </div>
        </div>
      </div>

      {/* 3. Bookings Ledger & Search */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden" id="bookings-ledger">
        <div className="p-6 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold">Client Booking Logs</h3>
            <p className="text-xs text-stone-500">Review status and confirm client reservations for woodworker.org.uk</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clients, courses..."
                className="pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 w-full sm:w-60"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-800/20 text-stone-600"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Timeframe Filter */}
            <select
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-800/20 text-stone-600"
            >
              <option value="All">All Schedules</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">No reservations match your filters</p>
              <p className="text-xs">Try choosing another query or select 'All Statuses'.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/50 border-b border-stone-100 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Client Info</th>
                  <th className="py-3.5 px-4">Course Info</th>
                  <th className="py-3.5 px-4">Booking Date &amp; Slot</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-stone-50/30 transition-colors" id={`booking-row-${booking.id}`}>
                    <td className="py-4 px-6 space-y-0.5">
                      <div className="font-semibold text-stone-900">{booking.customerName}</div>
                      <div className="text-[10px] text-stone-500">{booking.customerEmail}</div>
                      <div className="text-[10px] text-stone-400 font-mono">{booking.customerPhone}</div>
                      {booking.skillsLevel && (
                        <span className="inline-block mt-1 text-[8px] font-bold px-1.5 py-0.5 bg-stone-100 rounded text-stone-600 uppercase tracking-wider">{booking.skillsLevel} level</span>
                      )}
                    </td>
                    <td className="py-4 px-4 space-y-1">
                      <div className="font-medium text-stone-800">{booking.courseTitle}</div>
                      <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        booking.durationType === 'hourly' 
                          ? 'bg-amber-100 text-amber-800' 
                          : booking.durationType === 'daily' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {booking.durationType}
                      </span>
                    </td>
                    <td className="py-4 px-4 space-y-0.5">
                      <div className="font-semibold font-mono text-stone-800">
                        {new Date(booking.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="text-[10px] text-stone-500 font-medium">
                        {booking.timeSlot ? booking.timeSlot : 'Full Day Reservation'}
                      </div>
                      {booking.notes && (
                        <div className="text-[10px] text-amber-800 max-w-xs truncate italic" title={booking.notes}>
                          "{booking.notes}"
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 font-bold font-serif text-stone-900">
                      £{booking.totalPrice}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        booking.status === 'Confirmed' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : booking.status === 'Pending' 
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse-subtle' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {booking.status === 'Confirmed' ? <CheckCircle className="w-3 h-3" /> : booking.status === 'Pending' ? <AlertCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {booking.status !== 'Confirmed' && (
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'Confirmed')}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Approve Booking"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {booking.status !== 'Cancelled' && (
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'Cancelled')}
                            className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cancel Booking"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteBooking(booking.id)}
                          className="p-1 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 4. Wood Courses Panel Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="course-management-section">
        {/* Left: Active Course Catalog */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg font-bold">Course Offering Catalog</h3>
              <p className="text-xs text-stone-500">Enable, disable, or remove course parameters from your booking widget.</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              id="toggle-add-course-btn"
              className="px-3.5 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-950 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              {showAddForm ? 'Close Editor' : 'Add Course'}
            </button>
          </div>

          <div className="space-y-3.5">
            {filteredCoursesList.map((course) => (
              <div 
                key={course.id} 
                className="p-4 rounded-xl border border-stone-100 hover:border-stone-200 transition-all flex items-start justify-between gap-4 bg-stone-50/50"
                id={`catalog-item-${course.id}`}
              >
                <div className="space-y-1 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      course.durationType === 'hourly' ? 'bg-amber-100 text-amber-800' : course.durationType === 'daily' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {course.durationType} ({course.durationLabel})
                    </span>
                    <span className="text-[10px] text-stone-400 font-semibold">• Instructor: {course.instructor}</span>
                  </div>
                  <h4 className="font-serif text-sm font-bold text-stone-900 leading-snug">{course.title}</h4>
                  <p className="text-[11px] text-stone-500 leading-relaxed text-line-clamp-2">{course.description}</p>
                </div>

                <div className="text-right space-y-1.5 shrink-0">
                  <div className="font-serif text-sm font-extrabold text-stone-950">£{course.price}</div>
                  <div className="text-[9px] text-stone-400">Cap: {course.capacity} benches</div>
                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="p-1 px-2 text-[10px] border border-stone-200 hover:border-red-200 hover:text-red-700 rounded-lg flex items-center gap-1 text-stone-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: New Course Form */}
        <div className="lg:col-span-5">
          {showAddForm ? (
            <form onSubmit={handleFormSubmit} className="bg-white rounded-2xl p-6 border border-amber-800/20 shadow-md space-y-4" id="new-course-form">
              <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-800" /> Construct New Course
              </h3>

              <div className="space-y-4 text-xs">
                {/* Title */}
                <div>
                  <label className="block font-semibold text-stone-700 uppercase tracking-wide text-[10px] mb-1.5">Course Name</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Windsor Chair Bow-Bending Method"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800/20 text-stone-850"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block font-semibold text-stone-700 uppercase tracking-wide text-[10px] mb-1.5">Syllabus Overview</label>
                  <textarea
                    required
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows={3}
                    placeholder="Provide a detailed outline which tools are used and key skills learned."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800/20 text-stone-850"
                  />
                </div>

                {/* Duration Type & Label */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 uppercase tracking-wide text-[10px] mb-1.5">Duration Type</label>
                    <select
                      value={newDurationType}
                      onChange={(e) => {
                        const val = e.target.value as CourseDurationType;
                        setNewDurationType(val);
                        setNewDurationLabel(val === 'hourly' ? '3 Hours' : val === 'daily' ? '2 Days' : '1 Week');
                      }}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800/20 text-stone-700"
                    >
                      <option value="hourly">Hourly slots</option>
                      <option value="daily">Daily seminar</option>
                      <option value="weekly">Weekly intensive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 uppercase tracking-wide text-[10px] mb-1.5">Duration Tag</label>
                    <input
                      type="text"
                      required
                      value={newDurationLabel}
                      onChange={(e) => setNewDurationLabel(e.target.value)}
                      placeholder="e.g. 3 Hours, 2 Days"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800/20 text-stone-850"
                    />
                  </div>
                </div>

                {/* Price & Capacity */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 uppercase tracking-wide text-[10px] mb-1.5">Price (GBP £)</label>
                    <input
                      type="number"
                      required
                      min="5"
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800/20 text-stone-850"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 uppercase tracking-wide text-[10px] mb-1.5">Max Bench Capacity</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="20"
                      value={newCapacity}
                      onChange={(e) => setNewCapacity(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800/20 text-stone-850"
                    />
                  </div>
                </div>

                {/* Difficulty & Instructor */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 uppercase tracking-wide text-[10px] mb-1.5">Difficulty level</label>
                    <select
                      value={newDifficulty}
                      onChange={(e) => setNewDifficulty(e.target.value as any)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800/20 text-stone-700"
                    >
                      <option value="Beginner">Beginner focus</option>
                      <option value="Intermediate">Intermediate skill</option>
                      <option value="Advanced">Advanced master</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 uppercase tracking-wide text-[10px] mb-1.5">Instructor Name</label>
                    <input
                      type="text"
                      required
                      value={selectedCreatorId === 'inst_all' ? newInstructor : selectedCreator.name}
                      onChange={(e) => setNewInstructor(e.target.value)}
                      disabled={selectedCreatorId !== 'inst_all'}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800/20 text-stone-850 disabled:bg-stone-100 disabled:text-stone-400 font-semibold"
                    />
                  </div>
                </div>

                {/* Course Location */}
                <div>
                  <label className="block font-semibold text-stone-700 uppercase tracking-wide text-[10px] mb-1.5">Course Location (UK Region / County)</label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Devon, Cornwall, Yorkshire, Somerset, London"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800/20 text-stone-850 font-semibold"
                  />
                           {/* Course Showcase Image uploader */}
                 <div className="space-y-3">
                   <div className="flex justify-between items-center">
                     <label className="block font-semibold text-stone-700 uppercase tracking-wide text-[10px] mb-1">
                       Course Showcase Images ({newImages.length} / 4)
                     </label>
                     <span className="text-[9px] font-mono text-stone-400">Limit: 2MB per file</span>
                   </div>
                   
                   {/* Grid of uploaded images */}
                   {newImages.length > 0 && (
                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
                       {newImages.map((img, idx) => (
                         <div key={idx} className="relative group rounded-lg overflow-hidden border border-stone-200 shadow-xs bg-white flex flex-col pt-1 px-1 pb-1.5">
                           <div className="relative w-full h-16 rounded-md overflow-hidden bg-stone-100">
                             <img 
                               src={img} 
                               alt={`Course gallery ${idx + 1}`} 
                               className="w-full h-full object-cover"
                               referrerPolicy="no-referrer"
                             />
                             <span className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold leading-none ${idx === 0 ? 'bg-amber-600 text-white' : 'bg-stone-800/80 text-stone-200'}`}>
                               {idx === 0 ? 'Hero' : `#${idx + 1}`}
                             </span>
                           </div>
                           <div className="flex items-center justify-between mt-1 px-1">
                             <span className="text-[8px] font-mono text-stone-400 font-bold">Image {idx + 1}</span>
                             <button
                               type="button"
                               onClick={() => {
                                 setNewImages(prev => prev.filter((_, i) => i !== idx));
                                 setImageError(null);
                               }}
                               className="text-[9px] text-red-650 hover:text-red-850 font-bold hover:underline cursor-pointer bg-transparent border-none p-0"
                               title="Remove image"
                             >
                               Delete
                             </button>
                           </div>
                         </div>
                       ))}
                     </div>
                   )}

                   {/* Dropzone (Only show if newImages.length < 4) */}
                   {newImages.length < 4 ? (
                     <div 
                       className="border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all border-stone-200 hover:border-amber-550 bg-stone-50 hover:bg-amber-50/5"
                       onDragOver={(e) => e.preventDefault()}
                       onDrop={(e) => {
                         e.preventDefault();
                         const files = Array.from(e.dataTransfer.files || []) as File[];
                         if (!files.length) return;
                         
                         // Process up to remaining slots
                         const slotsLeft = 4 - newImages.length;
                         const filesToProcess = files.slice(0, slotsLeft);
                         
                         let hasError = false;
                         const maxSize = 2 * 1024 * 1024; // 2MB
                         
                         filesToProcess.forEach((file: File) => {
                           if (file.size > maxSize) {
                             setImageError(`Image "${file.name}" (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the 2MB size limit.`);
                             hasError = true;
                           }
                         });

                         if (hasError) return;
                         setImageError(null);

                         const readers = filesToProcess.map((file: File) => {
                           return new Promise<string>((resolve) => {
                             const reader = new FileReader();
                             reader.onloadend = () => {
                               if (typeof reader.result === 'string') {
                                 resolve(reader.result);
                               }
                             };
                             reader.readAsDataURL(file);
                           });
                         });

                         Promise.all(readers).then((results) => {
                           setNewImages(prev => {
                             const combined = [...prev, ...results];
                             return combined.slice(0, 4); // strict upper limit
                           });
                         });
                       }}
                     >
                       <label className="cursor-pointer block space-y-2 select-none">
                         <div className="flex justify-center">
                           <div className="p-2.5 bg-amber-50 rounded-full border border-amber-100 text-amber-700">
                             <Upload className="w-5 h-5 mx-auto" />
                           </div>
                         </div>
                         <div className="space-y-1">
                           <p className="text-xs font-bold text-stone-700">
                             Drag & drop course images, or <span className="text-amber-700 hover:underline">browse files</span>
                           </p>
                           <p className="text-[10px] text-stone-550 leading-relaxed font-sans font-medium">
                             Upload up to <strong className="text-stone-700">4 showcase images</strong>. First image acts as the Main Hero header.
                           </p>
                           <p className="text-[9px] text-amber-850 font-bold bg-amber-50/45 py-0.5 px-2 rounded-md inline-block">
                             Maximum size: 2MB per file
                           </p>
                         </div>
                         <input 
                           type="file" 
                           multiple
                           accept="image/*" 
                           className="hidden" 
                           onChange={(e) => {
                             const files = Array.from(e.target.files || []);
                             if (!files.length) return;

                             const slotsLeft = 4 - newImages.length;
                             const filesToProcess = files.slice(0, slotsLeft);
                             
                             let hasError = false;
                             const maxSize = 2 * 1024 * 1024; // 2MB
                             
                             filesToProcess.forEach((file: File) => {
                               if (file.size > maxSize) {
                                 setImageError(`Image "${file.name}" (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the 2MB size limit.`);
                                 hasError = true;
                               }
                             });

                             if (hasError) return;
                             setImageError(null);

                             const readers = filesToProcess.map((file: File) => {
                               return new Promise<string>((resolve) => {
                                 const reader = new FileReader();
                                 reader.onloadend = () => {
                                   if (typeof reader.result === 'string') {
                                     resolve(reader.result);
                                   }
                                 };
                                 reader.readAsDataURL(file);
                               });
                             });

                             Promise.all(readers).then((results) => {
                               setNewImages(prev => {
                                 const combined = [...prev, ...results];
                                 return combined.slice(0, 4);
                               });
                             });
                           }}
                         />
                       </label>
                     </div>
                   ) : (
                     <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 text-center text-xs text-stone-600 font-sans font-bold">
                       ✨ Maximum gallery limit reached (4 / 4). Remove an image to replace.
                     </div>
                   )}
                   
                   {imageError && (
                     <p className="text-[10px] text-red-655 bg-red-50 p-2.5 rounded-lg border border-red-150 font-semibold font-mono leading-tight">
                       ⚠️ {imageError}
                     </p>
                   )}
                 </div>             </div>

                {/* Inclusion check */}
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={newMaterialsIncluded}
                    onChange={(e) => setNewMaterialsIncluded(e.target.checked)}
                    className="w-4 h-4 rounded border-stone-300 text-amber-800 focus:ring-amber-500"
                  />
                  <span className="font-medium text-stone-600">Include all wood stock &amp; timber blanks free of charge</span>
                </label>

                {/* Save button */}
                <button
                  type="submit"
                  id="submit-course-btn"
                  className="w-full py-3 bg-amber-800 hover:bg-amber-950 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow"
                >
                  <Save className="w-4 h-4" /> Construct Course
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200/50 space-y-4 text-center py-12">
              <BookOpen className="w-10 h-10 mx-auto text-amber-800/40" />
              <h3 className="font-serif font-bold text-stone-900">Custom Tooling</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Need to deliver a masterclass, intensive or guest workshop on your woodworker.org.uk school? 
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 rounded-xl bg-amber-800/10 hover:bg-amber-800/20 text-amber-950 text-xs font-bold transition-all border border-amber-800/20 inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Set up Next Course
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
