import React, { useState } from 'react';
import { Course, Booking, EmbedConfig, CourseDurationType } from '../types';
import { 
  Calendar, Clock, Award, Hammer, Compass, Users, User, Mail, Phone, 
  ChevronRight, ChevronLeft, ArrowLeft, ShieldCheck, CheckCircle2, ShoppingCart, HelpCircle, AlertTriangle
} from 'lucide-react';

interface BookingFormProps {
  courses: Course[];
  config: EmbedConfig;
  onSubmitBooking: (booking: Booking) => void;
  initialSelectedCourse?: Course | null;
  onBackToDirectory?: () => void;
  bookings?: Booking[];
}

export default function BookingForm({ 
  courses, 
  config, 
  onSubmitBooking, 
  initialSelectedCourse = null, 
  onBackToDirectory,
  bookings = []
}: BookingFormProps) {
  // Booking step process: 'catalog' | 'select-slot' | 'checkout' | 'success'
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(initialSelectedCourse);
  const [selectedDurationType, setSelectedDurationType] = useState<CourseDurationType | 'All'>('All');
  const [step, setStep] = useState<'catalog' | 'select-slot' | 'checkout' | 'success'>(
    initialSelectedCourse ? 'select-slot' : 'catalog'
  );
  
  // Reservation state values
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [seats, setSeats] = useState<number>(1);

  // Attendee/Form Details
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custNotes, setCustNotes] = useState('');
  const [custSkill, setCustSkill] = useState('Beginner');

  // Checkout Payment Simulated Fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastBookingId, setLastBookingId] = useState('');

  // Dynamic sync hook
  React.useEffect(() => {
    if (initialSelectedCourse) {
      setSelectedCourse(initialSelectedCourse);
      setSelectedDate('');
      setSelectedTimeSlot(initialSelectedCourse.timeSlots ? initialSelectedCourse.timeSlots[0] : '');
      setStep('select-slot');
    }
  }, [initialSelectedCourse]);

  // Dynamically cap chosen seats to remaining benches when selected date changes
  React.useEffect(() => {
    if (selectedCourse && selectedDate) {
      const dateBookings = (bookings || []).filter(
        (b) => b.courseId === selectedCourse.id && b.bookingDate === selectedDate && b.status !== 'Cancelled'
      );
      const maxCapacity = Math.max(1, selectedCourse.capacity || 1);
      const remainingBenches = Math.max(1, maxCapacity - dateBookings.length);
      setSeats(prev => prev > remainingBenches ? remainingBenches : prev);
    }
  }, [selectedDate, selectedCourse, bookings]);

  // Calculate high-fidelity calendar month grids for booking up to 3 months (90 days) in advance
  const monthsData = React.useMemo(() => {
    const result = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-11
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    for (let i = 0; i < 4; i++) {
      const targetDate = new Date(currentYear, currentMonth + i, 1);
      const yr = targetDate.getFullYear();
      const mo = targetDate.getMonth();
      
      // Number of days in target month
      const daysInMonth = new Date(yr, mo + 1, 0).getDate();
      
      // First day weekday alignment (0 is Sunday, 1 is Monday ... 6 is Saturday)
      const firstDay = new Date(yr, mo, 1).getDay();
      // Adjustpad index so Monday is 0, Sunday is 6
      const pad = firstDay === 0 ? 6 : firstDay - 1;
      
      const days = [];
      for (let d = 1; d <= daysInMonth; d++) {
        const dString = `${yr}-${String(mo + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        days.push({
          dayNum: d,
          dateStr: dString,
          date: new Date(yr, mo, d)
        });
      }
      
      result.push({
        year: yr,
        monthIndex: mo,
        monthName: monthNames[mo],
        pad,
        days
      });
    }
    return result;
  }, []);

  // Compute boundaries for the 90-day booking window helper
  const dateEligibility = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 90);
    
    return { tomorrow, maxDate };
  }, []);

  const [currentVisibleMonthIndex, setCurrentVisibleMonthIndex] = useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollToMonth = (index: number) => {
    if (scrollContainerRef.current) {
      const children = scrollContainerRef.current.children;
      const child = children[index] as HTMLElement;
      if (child) {
        scrollContainerRef.current.scrollTo({
          left: child.offsetLeft,
          behavior: 'smooth'
        });
        setCurrentVisibleMonthIndex(index);
      }
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const width = scrollContainerRef.current.clientWidth;
      if (width > 0) {
        const index = Math.round(scrollLeft / width);
        if (index >= 0 && index < 4 && index !== currentVisibleMonthIndex) {
          setCurrentVisibleMonthIndex(index);
        }
      }
    }
  };

  // Dynamic Theme Styling mapping corresponding to the config
  const themeStyles = {
    amber: {
      primaryBg: 'bg-amber-800 hover:bg-amber-900',
      activeBorder: 'border-amber-800',
      bgLight: 'bg-amber-50/70',
      textPrimary: 'text-amber-900',
      ring: 'focus:ring-amber-500/20 focus:border-amber-800',
      textAccent: 'text-amber-800 bg-amber-50'
    },
    emerald: {
      primaryBg: 'bg-emerald-800 hover:bg-emerald-900',
      activeBorder: 'border-emerald-800',
      bgLight: 'bg-emerald-50/70',
      textPrimary: 'text-emerald-900',
      ring: 'focus:ring-emerald-500/20 focus:border-emerald-800',
      textAccent: 'text-emerald-800 bg-emerald-50'
    },
    stone: {
      primaryBg: 'bg-stone-800 hover:bg-stone-900',
      activeBorder: 'border-stone-800',
      bgLight: 'bg-stone-50/70',
      textPrimary: 'text-stone-900',
      ring: 'focus:ring-stone-500/20 focus:border-stone-800',
      textAccent: 'text-stone-800 bg-stone-50'
    },
    slate: {
      primaryBg: 'bg-slate-800 hover:bg-slate-900',
      activeBorder: 'border-slate-800',
      bgLight: 'bg-slate-50/70',
      textPrimary: 'text-slate-900',
      ring: 'focus:ring-slate-500/20 focus:border-slate-800',
      textAccent: 'text-slate-800 bg-slate-50'
    }
  }[config.theme] || {
    primaryBg: 'bg-amber-850 hover:bg-amber-900',
    activeBorder: 'border-amber-850',
    bgLight: 'bg-amber-50/50',
    textPrimary: 'text-amber-950',
    ring: 'focus:ring-amber-550/20 focus:border-amber-850',
    textAccent: 'text-amber-900 bg-amber-50'
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setSelectedDate('');
    setSelectedTimeSlot(course.timeSlots ? course.timeSlots[0] : '');
    setStep('select-slot');
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim() || !custEmail.trim() || !custPhone.trim() || !selectedDate || !selectedCourse) return;

    setIsSubmitting(true);
    
    // Simulate high-fidelity secure booking dispatch with Stripe hook verification
    setTimeout(() => {
      const generatedId = 'TMBR-' + Math.floor(100000 + Math.random() * 900000);
      
      const newBooking: Booking = {
        id: generatedId,
        courseId: selectedCourse.id,
        courseTitle: selectedCourse.title,
        instructorId: selectedCourse.instructorId || 'inst_david',
        durationType: selectedCourse.durationType,
        customerName: custName,
        customerEmail: custEmail,
        customerPhone: custPhone,
        bookingDate: selectedDate,
        timeSlot: selectedCourse.durationType === 'hourly' ? selectedTimeSlot : undefined,
        notes: custNotes,
        totalPrice: selectedCourse.price * seats,
        status: 'Confirmed', 
        createdAt: new Date().toISOString(),
        skillsLevel: custSkill
      };

      // Dispatch parent frame notification
      if (typeof window !== 'undefined' && window.parent) {
        window.parent.postMessage({
          action: 'woodworker_stripe_checkout',
          payload: {
            id: generatedId,
            courseTitle: selectedCourse.title,
            amount: selectedCourse.price * seats,
            email: custEmail,
            seats: seats
          }
        }, '*');
      }

      onSubmitBooking(newBooking);
      setLastBookingId(generatedId);
      setIsSubmitting(false);
      setStep('success');
    }, 1200);
  };

  const filteredCatalog = courses.filter(course => {
    return selectedDurationType === 'All' || course.durationType === selectedDurationType;
  });

  // Simple date formatter for human output
  const formatFriendlyDate = (dStr: string) => {
    if (!dStr) return '';
    try {
      const d = new Date(dStr);
      return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
    } catch {
      return dStr;
    }
  };

  return (
    <div className="bg-transparent" id="booking-widget-contain">
      
      {/* STEP A: Catalog of Woodworking Courses */}
      {step === 'catalog' && (
        <div className="space-y-6" id="catalog-view">
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-stone-200 pb-4">
            {(['All', 'hourly', 'daily', 'weekly'] as const).map((type) => (
              <button
                key={type}
                id={`duration-filter-${type}`}
                onClick={() => setSelectedDurationType(type)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedDurationType === type
                    ? `${themeStyles.primaryBg} text-white shadow-sm scale-102`
                    : 'bg-white hover:bg-stone-50 text-stone-600 border border-stone-200'
                }`}
              >
                {type === 'All' ? 'All Workshops' : `${type} courses`}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="courses-grid">
            {filteredCatalog.map((course) => (
              <div 
                key={course.id} 
                className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all h-full"
                id={`course-item-${course.id}`}
              >
                <div className="bg-stone-900 p-5 text-white relative flex flex-col justify-between h-40">
                  <div className="absolute inset-0 bg-linear-to-b from-black/20 to-black/70 pointer-events-none" />
                  
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {course.durationLabel}
                    </span>
                    {config.showDifficulty && (
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${
                        course.difficulty === 'Beginner' 
                          ? 'bg-emerald-500/20 text-emerald-300' 
                          : course.difficulty === 'Intermediate' 
                          ? 'bg-amber-500/20 text-amber-300' 
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {course.difficulty}
                      </span>
                    )}
                  </div>

                  <div className="z-10">
                    <h4 className="font-serif text-lg font-bold tracking-tight text-white line-clamp-1">{course.title}</h4>
                    {config.showInstructor && (
                      <p className="text-[10px] text-stone-300 font-medium">Under artisan woodworker: <span className="text-amber-400 font-semibold">{course.instructor}</span></p>
                    )}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-stone-600 leading-relaxed min-h-12 line-clamp-3">
                    {course.description}
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="flex flex-wrap gap-2 text-[10px] font-medium text-stone-500">
                      {course.materialsIncluded && (
                        <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Wood Stock Included
                        </span>
                      )}
                      <span className="bg-stone-50 text-stone-700 px-2.5 py-1 rounded-md flex items-center gap-1 border border-stone-200/50">
                        <Users className="w-3 h-3 text-stone-400" /> Max {course.capacity} Benches
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      <div>
                        <div className="text-[10px] text-stone-400 font-mono uppercase tracking-wider">Tuition Fees</div>
                        <div className="text-xl font-bold text-stone-900 tracking-tight flex items-baseline">
                          <span className="text-xs font-normal text-stone-400 mr-0.5">£</span>
                          {course.price}
                          <span className="text-[10px] text-stone-500 font-normal font-mono ml-1">/{course.durationType === 'hourly' ? 'ea' : 'course'}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectCourse(course)}
                        id={`book-course-btn-${course.id}`}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white transition-all shadow-xs flex items-center gap-1 cursor-pointer ${themeStyles.primaryBg}`}
                      >
                        Secure Seat <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1 & 2: Select Date & Slot Only (Clean Calendar Wizard) */}
      {step === 'select-slot' && selectedCourse && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-6 text-stone-800 text-left" id="step-select-slot">
          
          {/* Calendar Section */}
          <div className="space-y-4">
            <style dangerouslySetInnerHTML={{__html: `
              #month-scroll-container::-webkit-scrollbar {
                height: 10px !important;
                display: block !important;
              }
              #month-scroll-container::-webkit-scrollbar-track {
                background: #f5f5f4 !important; /* stone-100 */
                border-radius: 9999px !important;
              }
              #month-scroll-container::-webkit-scrollbar-thumb {
                background: #d6d3d1 !important; /* stone-300 */
                border-radius: 9999px !important;
                border: 2px solid #f5f5f4 !important;
              }
              #month-scroll-container::-webkit-scrollbar-thumb:hover {
                background: #a8a29e !important; /* stone-400 */
              }
              #month-scroll-container {
                scrollbar-width: auto !important;
                scrollbar-color: #d6d3d1 #f5f5f4 !important;
              }
            `}} />

            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-stone-400" /> 1. Select Your Booking Date
              </label>
            </div>

            {/* Horizontal Scrollable Months Container - Snaps precisely to show 1 full month at a time */}
            <div 
              id="month-scroll-container"
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
            >
              {monthsData.map((month, mIdx) => (
                <div 
                  key={`${month.monthName}-${month.year}`}
                  className="w-full shrink-0 snap-start flex flex-col"
                >
                  {/* Month Heading */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="font-serif font-black text-stone-900 text-sm">
                      {month.monthName} {month.year}
                    </h3>
                    <span className="text-[9px] font-mono text-stone-400 font-bold bg-stone-50 border border-stone-150 px-2 py-0.5 rounded-md leading-none">
                      Month {mIdx + 1} of 4
                    </span>
                  </div>

                  {/* Weekday Titles */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[10px] font-bold font-mono text-stone-400">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayLabel) => (
                      <span key={dayLabel} className="py-1">{dayLabel}</span>
                    ))}
                  </div>

                  {/* 7-column grid of days */}
                  <div className="grid grid-cols-7 gap-1 bg-stone-50/60 border border-stone-150 p-1.5 rounded-2xl">
                    {/* Month start empty padding */}
                    {Array.from({ length: month.pad }).map((_, padIdx) => (
                      <div key={`pad-${padIdx}`} className="aspect-square bg-transparent" />
                    ))}

                    {/* Month days */}
                    {month.days.map((day) => {
                      const dayDate = new Date(day.date);
                      dayDate.setHours(0, 0, 0, 0);

                      // Calculate current bookings count for selected course on this date
                      const dayBookings = (bookings || []).filter(
                        (b) => b.courseId === selectedCourse!.id && b.bookingDate === day.dateStr && b.status !== 'Cancelled'
                      );
                      const maxCapacity = Math.max(1, selectedCourse!.capacity || 1);
                      const isFullyBooked = dayBookings.length >= maxCapacity;

                      // Check if the instructor is already teaching a different course on this date
                      const bookingForOtherCourse = (bookings || []).find((b) => {
                        if (b.bookingDate !== day.dateStr || b.status === 'Cancelled') return false;
                        if (b.courseId === selectedCourse!.id) return false;
                        if (b.instructorId === selectedCourse!.instructorId) return true;
                        const bCourse = courses.find((c) => c.id === b.courseId);
                        return !!(bCourse && bCourse.instructorId === selectedCourse!.instructorId);
                      });
                      
                      const isTeachingOtherCourse = !!bookingForOtherCourse;
                      const otherCourseTitle = bookingForOtherCourse ? bookingForOtherCourse.courseTitle : 'another course';

                      const isEligible = dayDate >= dateEligibility.tomorrow && 
                                         dayDate <= dateEligibility.maxDate && 
                                         !isFullyBooked && 
                                         !isTeachingOtherCourse;
                      const isSelected = selectedDate === day.dateStr;

                      return (
                        <button
                          key={day.dateStr}
                          type="button"
                          disabled={!isEligible}
                          onClick={() => setSelectedDate(day.dateStr)}
                          className={`aspect-square p-0.5 rounded-xl flex flex-col items-center justify-center border transition-all relative ${
                            !isEligible
                              ? isFullyBooked
                                ? 'border-dashed border-stone-200 bg-stone-100 text-stone-300 cursor-not-allowed text-[10px]'
                                : isTeachingOtherCourse
                                ? 'border-dotted border-amber-200 bg-amber-50/20 text-stone-400 cursor-not-allowed text-[10px]'
                                : 'border-transparent text-stone-300 bg-stone-50/10 cursor-not-allowed text-[10px]'
                              : isSelected
                              ? `${themeStyles.activeBorder} ${themeStyles.bgLight} border-2 text-stone-950 font-bold scale-100 shadow-xs z-10 cursor-pointer`
                              : 'border-stone-100 bg-white hover:border-stone-300 text-stone-700 hover:bg-stone-50/25 cursor-pointer shadow-2xs'
                          }`}
                          title={
                            isFullyBooked 
                              ? 'Fully Booked (All bench spaces occupied)' 
                              : isTeachingOtherCourse 
                              ? `Tutor is already teaching "${otherCourseTitle}" today` 
                              : undefined
                          }
                        >
                          <span className={`relative ${isSelected ? 'text-stone-950 font-black' : !isEligible ? 'text-stone-405 font-medium' : 'text-stone-800'} text-xs font-serif font-extrabold`}>
                            {day.dayNum}
                            {isFullyBooked && (
                              <span className="absolute inset-0 flex items-center justify-center text-red-500/30 font-bold pointer-events-none select-none text-[10px]">✕</span>
                            )}
                            {isTeachingOtherCourse && !isFullyBooked && (
                              <span className="absolute inset-0 flex items-center justify-center text-amber-600/30 font-bold pointer-events-none select-none text-[10px]">busy</span>
                            )}
                          </span>
                          {/* Selected marker dot */}
                          {isSelected && (
                            <span className="absolute bottom-1 w-1 h-1 bg-stone-900 rounded-full" />
                          )}
                          {/* FULL indicator */}
                          {isFullyBooked && (
                            <span className="absolute bottom-0.5 text-[7px] text-stone-400 font-mono font-bold leading-none scale-90">FULL</span>
                          )}
                          {/* BUSY indicator */}
                          {isTeachingOtherCourse && !isFullyBooked && (
                            <span className="absolute bottom-0.5 text-[6px] text-amber-700 font-mono font-extrabold leading-none scale-90 tracking-tighter">BUSY</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time Slot Selection (Shown only when course has custom time slots) */}
          {selectedCourse.timeSlots && selectedCourse.timeSlots.length > 0 && (
            <div className="space-y-3 pt-1 border-t border-stone-100/60 pt-4">
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-stone-400" /> 2. Pick Workshop Hours
              </label>
              
              <div className="grid grid-cols-2 gap-2">
                {selectedCourse.timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer ${
                      selectedTimeSlot === slot
                        ? `${themeStyles.activeBorder} ${themeStyles.bgLight} border-2`
                        : 'border-stone-100 hover:border-stone-200 bg-stone-50/50 hover:bg-white text-stone-600'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Status Alert & Checkout Flow Button */}
          <div className="pt-4 border-t border-stone-100 space-y-4">
            {selectedDate ? (
              <div className="p-3 bg-emerald-50 border border-emerald-100/60 rounded-xl text-emerald-950 flex items-start gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-900">Slot Chosen Successfully</p>
                  <p className="text-[11px] text-emerald-800 font-medium">
                    {formatFriendlyDate(selectedDate)} {selectedCourse.timeSlots && selectedTimeSlot ? `at ${selectedTimeSlot}` : ''}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-stone-400 font-medium flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" /> Focus-pick an available booking square above to proceed.
              </p>
            )}

            <button
              type="button"
              disabled={!selectedDate}
              onClick={() => setStep('checkout')}
              className={`w-full py-3.5 text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                selectedDate ? themeStyles.primaryBg : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              Proceed to Secure Checkout <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Complete Secure Booking & Stripe Gateway Form */}
      {step === 'checkout' && selectedCourse && (
        <form onSubmit={handleBookSubmit} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-5 text-stone-800 text-left" id="step-checkout">
          
          {/* Step Back Navigation Anchor */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <button
              type="button"
              onClick={() => setStep('select-slot')}
              className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 transition-colors font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Change Date/Time
            </button>
            <span className="text-[10px] bg-amber-50 rounded px-2 py-0.5 text-amber-900 font-bold uppercase font-mono">
              Step 3 of 3
            </span>
          </div>

          {/* Mini Chosen Summary Receipt Line */}
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/50 text-xs text-stone-600 space-y-1">
            <div className="flex justify-between">
              <span className="font-medium text-stone-500">Workshop Ticket:</span>
              <span className="font-bold text-stone-900 truncate max-w-[180px]">{selectedCourse.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-stone-500">Scheduled:</span>
              <span className="font-bold text-stone-950">
                {formatFriendlyDate(selectedDate)}
                {selectedCourse.timeSlots && selectedTimeSlot ? ` (${selectedTimeSlot})` : ''}
              </span>
            </div>
          </div>

          {/* Attendees / Bench seats Quantity Counter */}
          {(() => {
            const dateBookings = (bookings || []).filter(
              (b) => b.courseId === selectedCourse.id && b.bookingDate === selectedDate && b.status !== 'Cancelled'
            );
            const maxCapacity = Math.max(1, selectedCourse.capacity || 1);
            const remainingBenches = Math.max(1, maxCapacity - dateBookings.length);
            
            return (
              <div className="p-3 bg-stone-50/50 rounded-xl border border-stone-200/40 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <label className="font-bold text-stone-700 block">Student Benches</label>
                    <span className="text-[10px] text-stone-400 font-medium">
                      {remainingBenches} of {maxCapacity} benches available
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={seats <= 1}
                      onClick={() => setSeats(Math.max(1, seats - 1))}
                      className="w-6 h-6 rounded bg-white border border-stone-200 hover:bg-stone-100 disabled:opacity-40 font-bold text-stone-700 flex items-center justify-center text-xs cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-bold text-stone-900 w-4 text-center">{seats}</span>
                    <button
                      type="button"
                      disabled={seats >= remainingBenches}
                      onClick={() => setSeats(Math.min(remainingBenches, seats + 1))}
                      className="w-6 h-6 rounded bg-white border border-stone-200 hover:bg-stone-100 disabled:opacity-40 font-bold text-stone-700 flex items-center justify-center text-xs cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Attendee Info Inputs */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest flex items-center gap-1.5">
              <User className="w-4 h-4 text-stone-400" /> Woodworker Details
            </label>

            <div className="space-y-2 text-xs">
              <div>
                <input
                  type="text"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="Full Name (e.g. Robin Oak)"
                  className={`w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 ${themeStyles.ring}`}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="email"
                  required
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  placeholder="Email Address"
                  className={`w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 ${themeStyles.ring}`}
                />
                <input
                  type="tel"
                  required
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  placeholder="Phone Number"
                  className={`w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 ${themeStyles.ring}`}
                />
              </div>

              <div className="grid grid-cols-1 gap-1">
                <select
                  value={custSkill}
                  onChange={(e) => setCustSkill(e.target.value)}
                  className={`w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 text-stone-600 ${themeStyles.ring}`}
                >
                  <option value="Beginner">First timer / Beginner level</option>
                  <option value="Intermediate">Comfortable with sharp handtools</option>
                  <option value="Advanced">Advanced cabinetmaker / timber lover</option>
                </select>
              </div>

              <div>
                <input
                  type="text"
                  value={custNotes}
                  onChange={(e) => setCustNotes(e.target.value)}
                  placeholder="Special requests (e.g. left-handed tools)"
                  className={`w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 ${themeStyles.ring}`}
                />
              </div>
            </div>
          </div>

          {/* High-Fidelity Stripe Credit Card Input */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <div className="flex justify-between items-center">
              <label className="block text-[10px] uppercase font-mono font-bold text-stone-500 tracking-wider">
                Stripe Premium Checkout
              </label>
              <span className="text-[8px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-1 rounded font-mono font-bold tracking-tight uppercase">
                PCI Secure
              </span>
            </div>

            <div className="space-y-2 bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs">
              <div className="space-y-1">
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setCardNumber(val.slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '));
                    }}
                    placeholder="4242 4242 4242 4242"
                    className="w-full pl-3 pr-10 py-2 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-805 font-mono text-xs text-stone-900 placeholder-stone-400"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-stone-400 text-[10px] tracking-wide uppercase">
                    Visa
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={cardExpiry}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '');
                    if (val.length > 2) {
                      val = val.slice(0, 2) + '/' + val.slice(2, 4);
                    }
                    setCardExpiry(val.slice(0, 5));
                  }}
                  placeholder="MM/YY"
                  className="w-full px-2 py-2 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-805 text-center font-mono text-xs text-stone-900"
                />
                <input
                  type="text"
                  required
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="CVC"
                  className="w-full px-2 py-2 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-805 text-center font-mono text-xs text-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Pricing detail breakdown row */}
          <div className="pt-2 flex justify-between items-center text-xs">
            <span className="font-semibold text-stone-600">Total Price ({seats} {seats === 1 ? 'bench' : 'benches'}):</span>
            <span className="text-xl font-bold font-sans text-stone-950">
              <span className="text-xs font-normal text-stone-400 mr-0.5">£</span>
              {selectedCourse.price * seats}
            </span>
          </div>

          {/* Submit Trigger Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3.5 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer ${themeStyles.primaryBg}`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Validating with Stripe...
              </>
            ) : (
              <>
                <ShoppingCart className="w-4.5 h-4.5" /> Book via Stripe
              </>
            )}
          </button>
        </form>
      )}

      {/* STEP C: Success state booking code display */}
      {step === 'success' && selectedCourse && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 text-center space-y-6 max-w-xl mx-auto shadow" id="success-screen">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-800 border border-emerald-100">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2 rounded">Booking Secured</span>
            <h3 className="font-serif text-xl font-extrabold text-stone-950">Draft Booking Successful!</h3>
            <p className="text-xs text-stone-500">Reference: <span className="font-mono font-bold text-stone-900">{lastBookingId}</span></p>
          </div>

          {/* Details list receipt */}
          <div className="bg-stone-50 rounded-xl p-4 text-xs text-left text-stone-600 border border-stone-200/50 space-y-2.5">
            <div className="flex justify-between">
              <span className="font-semibold">Bench Class:</span>
              <span className="text-stone-900">{selectedCourse.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Instructor:</span>
              <span className="text-stone-900">{selectedCourse.instructor}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Booking Date:</span>
              <span className="text-stone-900 font-mono font-semibold">
                {formatFriendlyDate(selectedDate)}
              </span>
            </div>
            {selectedCourse.timeSlots && selectedTimeSlot && (
              <div className="flex justify-between">
                <span className="font-semibold">Assigned Time Slot:</span>
                <span className="text-stone-950 bg-amber-50 px-2 rounded">{selectedTimeSlot}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-semibold">Workbench Seats:</span>
              <span className="text-stone-900 font-bold">{seats} Attendees</span>
            </div>
            <div className="border-t border-stone-100 pt-3 flex justify-between items-center text-sm font-semibold text-stone-900">
              <span>Amount Paid:</span>
              <span className="font-bold text-lg text-emerald-700">
                <span className="text-xs font-normal text-emerald-600 mr-0.5">£</span>
                {selectedCourse.price * seats}
              </span>
            </div>
          </div>

          {/* Quick Guidance info */}
          <div className="p-3.5 bg-amber-50/50 border border-amber-800/10 rounded-xl text-[11px] text-amber-950 leading-relaxed text-left">
            🌱 **Preparation Instructions**: Wear stout footwear / leather boots. No loose shirts. All traditional woodworking tools, high-carbon steel wood chisels, block planes, and oiled English walnut/cherry blanks are ready for you at the bench!
          </div>

          <div className="pt-3 border-t border-stone-105 flex gap-3">
            <button
              onClick={() => {
                setStep('catalog');
                setSelectedCourse(null);
                setSeats(1);
              }}
              className={`flex-1 py-2.5 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${themeStyles.primaryBg}`}
            >
              Book Another Lesson
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
