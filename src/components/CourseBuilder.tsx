"use client";

import React, { useState, useEffect, useRef } from "react";
import { Course, CourseDurationType, Creator } from "../types";
import { IMAGE_PRESETS, getImagePresetUrl } from "../coursesData";
import {
  Sparkles, Clock, ChevronRight, ChevronLeft,
  Check, Info, Upload, Plus, AlertCircle, Save,
  Coins, ArrowLeft, Trash2
} from "lucide-react";

/**
 * =========================================================
 * DEV MODE (AIStudio SAFE PREVIEW OVERRIDE)
 * =========================================================
 */
const DEV_MODE = true;

// Safe fallback instructor (prevents AIStudio crash)
const DEV_INSTRUCTOR: Creator = {
  id: "dev-user",
  name: "Dev Instructor",
  email: "dev@local.test",
  role: "instructor",
  bio: "Experienced artisan woodworker.",
  avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Dev",
  location: "Devon"
};

interface CourseBuilderProps {
  instructor?: Creator;
  courseToEdit?: Course | null;
  onSave: (courseData: Partial<Course>) => void;
  onCancel: () => void;
}

type StepID = "details" | "dates" | "pricing" | "media" | "location" | "review";

interface Step {
  id: StepID;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  { id: "details", title: "Course Details", description: "Define titles, descriptions, and learning goals" },
  { id: "dates", title: "Dates & Availability", description: "Configure schedules, capacity, and slot durations" },
  { id: "pricing", title: "Pricing & Extras", description: "Set rates, extra amenities, and calculate creator fees" },
  { id: "media", title: "Images & Media", description: "Add your High resolution course images here." },
  { id: "location", title: "Location & Venue", description: "Setup physical workshop addresses and local SEO coordinates" },
  { id: "review", title: "Review & Publish", description: "Verify listing compliance and sync to WordPress live index" },
];

// Pre-defined template data for masterclass inspiration
const TEMPLATES = [
  {
    title: "Swedish Bowl Carving Masterclass",
    description: "Discover the heritage craft of carving bowls from wild logs of green timber. Master the traditional ADZE, side axe, and deep gouges to hollow out gorgeous nested birch bowls. Perfect for woodworking enthusiasts looking for a challenge.",
    difficulty: "Advanced",
    materialsIncluded: true,
    durationType: "daily" as CourseDurationType,
    durationLabel: "2 Days",
    price: 185,
    capacity: 4,
    location: "Devon",
    image: "tool_chest",
    venueName: "Blackwood Coppice Barn",
    address: "Coppice Valley Road, near Totnes, TQ9 5AA",
    skills: ["Adze handling", "Green log cleaving", "Bowl nesting theory", "Swedish oil curing"],
    timeSlots: ["10:00 - 17:00", "10:00 - 16:30"]
  },
  {
    title: "Dovetail Jewelry Box Crafting",
    description: "Learn precise hand-cut joinery. In this weekend workshop, you will practice cutting fine pins and tails, fitting secret mitered shoulders, and finishing with traditional shellac French polish. Invaluable cabinetry foundation module.",
    difficulty: "Intermediate",
    materialsIncluded: true,
    durationType: "weekly" as CourseDurationType,
    durationLabel: "1 Week",
    price: 320,
    capacity: 6,
    location: "London",
    image: "dovetail_box",
    venueName: "Hackney Artisan Joinery",
    address: "Studio 4B, Regent's Wharf, London, E2 8NS",
    skills: ["Precision marking out", "Japanese pull-saw care", "Chisel paring discipline", "Shellac application"],
    timeSlots: ["09:30 - 13:00", "14:00 - 17:30"]
  }
];

export default function CourseBuilder({
  instructor,
  courseToEdit,
  onSave,
  onCancel
}: CourseBuilderProps) {

  const safeInstructor = instructor || DEV_INSTRUCTOR;

  const [activeStep, setActiveStep] = useState<StepID>("details");

  // State for Course Attributes
  const [title, setTitle] = useState(courseToEdit?.title || "");
  const [description, setDescription] = useState(courseToEdit?.description || "");
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">(
    (courseToEdit?.difficulty as any) || "Beginner"
  );
  const [materialsIncluded, setMaterialsIncluded] = useState(courseToEdit?.materialsIncluded ?? true);

  // Time & Duration
  const [durationType, setDurationType] = useState<CourseDurationType>(courseToEdit?.durationType || "hourly");
  const [durationLabel, setDurationLabel] = useState(courseToEdit?.durationLabel || "3 Hours");
  const [capacity, setCapacity] = useState(courseToEdit?.capacity || 6);
  const [timeSlots, setTimeSlots] = useState<string[]>(
    courseToEdit?.timeSlots || ["09:00 - 12:00", "13:30 - 16:30"]
  );
  const [newSlot, setNewSlot] = useState("");

  // Pricing
  const [price, setPrice] = useState(courseToEdit?.price || 75);
  const [isFeatured, setIsFeatured] = useState(courseToEdit?.isFeatured || false);

  // Media / Gallery (up to 4)
  const [images, setImages] = useState<string[]>(
    courseToEdit?.images || (courseToEdit?.image ? [courseToEdit.image] : ["spoon_carving"])
  );
  const [imageInputType, setImageInputType] = useState<"preset" | "custom">("preset");
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [imageError, setImageError] = useState<string | null>(null);

  // Venue & Address
  const [location, setLocation] = useState(courseToEdit?.location || safeInstructor.location || "Devon");
  const [venueName, setVenueName] = useState("Traditional Oak Timber Studio");
  const [address, setAddress] = useState("Old Quarry Lane, Devon, EX6 8ND");

  // Dynamic Skills list
  const [skills, setSkills] = useState<string[]>(
    (courseToEdit as any)?.skillsTaught || ["Marking out raw lumber", "Axe chisel hand-hewing", "Traditional oil polish"]
  );
  const [newSkill, setNewSkill] = useState("");

  // Auto-save simulations
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "idle">("saved");
  const [lastSavedTime, setLastSavedTime] = useState(new Date().toLocaleTimeString());

  // Refs for scroll and auto-saving debounce
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-save triggers on state changes
  useEffect(() => {
    if (!title && !description) return;

    setSaveStatus("saving");
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      setSaveStatus("saved");
      setLastSavedTime(new Date().toLocaleTimeString());
    }, 1200);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [
    title, description, difficulty, materialsIncluded, durationType,
    durationLabel, capacity, price, images, location, venueName,
    address, skills, timeSlots, isFeatured
  ]);

  // Load template helper
  const loadTemplate = (tpl: typeof TEMPLATES[0]) => {
    setTitle(tpl.title);
    setDescription(tpl.description);
    setDifficulty(tpl.difficulty as any);
    setMaterialsIncluded(tpl.materialsIncluded);
    setDurationType(tpl.durationType);
    setDurationLabel(tpl.durationLabel);
    setPrice(tpl.price);
    setCapacity(tpl.capacity);
    setLocation(tpl.location);
    setVenueName(tpl.venueName);
    setAddress(tpl.address);
    setSkills(tpl.skills);
    setTimeSlots(tpl.timeSlots);
    setImages([tpl.image]);
    setImageError(null);
  };

  // Validation helper
  const validateStep = (stepId: StepID): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (stepId === "details") {
      if (!title.trim()) errors.push("Course Title is required.");
      if (title.length < 5) errors.push("Course Title must be at least 5 characters.");
      if (!description.trim()) errors.push("Course Description is required.");
      if (description.length < 20) errors.push("Course Description must be descriptive remember SEO (at least 20 chars).");
    }
    if (stepId === "dates") {
      if (!durationLabel.trim()) errors.push("Duration Label (e.g., '3 Hours') is required.");
      if (capacity < 1) errors.push("Maximum benches must be at least 1.");
      if (timeSlots.length === 0) errors.push("Define at least one session/time slot.");
    }
    if (stepId === "pricing") {
      if (price <= 0) errors.push("Price must be a positive number.");
    }
    if (stepId === "media") {
      if (images.length === 0) errors.push("Please select at least one background showcase image.");
    }
    if (stepId === "location") {
      if (!location.trim()) errors.push("Location Region is required.");
      if (!venueName.trim()) errors.push("Venue name is required.");
      if (!address.trim()) errors.push("Workshop physical address is required.");
    }
    return { valid: errors.length === 0, errors };
  };

  // Step status check
  const getStepStatus = (stepId: StepID) => {
    const valObj = validateStep(stepId);
    if (activeStep === stepId) return "active";
    if (!valObj.valid) return "invalid";
    return "valid";
  };

  // Handlers for lists
  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills(prev => [...prev, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(prev => prev.filter(s => s !== skill));
  };

  const handleAddTimeSlot = () => {
    if (newSlot.trim() && !timeSlots.includes(newSlot.trim())) {
      setTimeSlots(prev => [...prev, newSlot.trim()]);
      setNewSlot("");
    }
  };

  const handleRemoveTimeSlot = (slot: string) => {
    setTimeSlots(prev => prev.filter(s => s !== slot));
  };

  // Preserve selections
  const handleTogglePresetImage = (presetKey: string) => {
    if (images.includes(presetKey)) {
      setImages(prev => prev.filter(img => img !== presetKey));
    } else {
      if (images.length >= 4) {
        setImageError("Maximum 4 images allowed in course gallery.");
        return;
      }
      setImages(prev => [...prev, presetKey]);
      setImageError(null);
    }
  };

  const handleAddCustomImageUrl = () => {
    if (!customImageUrl.trim()) return;
    if (images.length >= 4) {
      setImageError("Maximum 4 images allowed.");
      return;
    }
    setImages(prev => [...prev, customImageUrl.trim()]);
    setCustomImageUrl("");
    setImageError(null);
  };

  // Drag-and-drop simulation
  const handleDragDropImages = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []) as File[];
    if (!files.length) return;

    const slotsLeft = 4 - images.length;
    if (slotsLeft <= 0) {
      setImageError("Maximum gallery limit reached (4 / 4).");
      return;
    }

    const filesToProcess = files.slice(0, slotsLeft);
    let hasError = false;
    const maxSize = 2 * 1024 * 1024; // 2MB

    filesToProcess.forEach((file) => {
      if (file.size > maxSize) {
        setImageError(`Image "${file.name}" exceeds the 2MB size limit.`);
        hasError = true;
      }
    });

    if (hasError) return;
    setImageError(null);

    const readers = filesToProcess.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          }
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((results) => {
      setImages(prev => [...prev, ...results].slice(0, 4));
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (!files.length) return;

    const slotsLeft = 4 - images.length;
    if (slotsLeft <= 0) {
      setImageError("Maximum gallery limit reached (4 / 4).");
      return;
    }

    const filesToProcess = files.slice(0, slotsLeft);
    let hasError = false;
    const maxSize = 2 * 1024 * 1024; // 2MB

    filesToProcess.forEach((file) => {
      if (file.size > maxSize) {
        setImageError(`Image "${file.name}" exceeds the 2MB size limit.`);
        hasError = true;
      }
    });

    if (hasError) return;
    setImageError(null);

    const readers = filesToProcess.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          }
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((results) => {
      setImages(prev => [...prev, ...results].slice(0, 4));
    });
  };

  // Submit trigger
  const handleSubmitPublish = (e: React.FormEvent) => {
    e.preventDefault();

    let allValid = true;
    const allErrors: string[] = [];
    STEPS.forEach(st => {
      const { valid, errors } = validateStep(st.id);
      if (!valid) {
        allValid = false;
        allErrors.push(...errors);
      }
    });

    if (!allValid) {
      alert(`Please fix the following validation errors before publishing:\n\n` + allErrors.join("\n"));
      return;
    }

    const courseData: Partial<Course> & { skillsTaught?: string[] } = {
      title: title.trim(),
      description: description.trim(),
      difficulty,
      materialsIncluded,
      durationType,
      durationLabel: durationLabel.trim(),
      price,
      capacity,
      location: location.trim(),
      image: images[0] || "joinery",
      images: images.length > 0 ? images : undefined,
      timeSlots: timeSlots.length > 0 ? timeSlots : undefined,
      isFeatured,
      instructor: safeInstructor.name,
      instructorId: safeInstructor.id,
      skillsTaught: skills
    };

    onSave(courseData);
  };

  const commissionPercent = 10;
  const commissionFee = price * (commissionPercent / 100);
  const stripeFixedFee = 0.20;
  const stripePercentFee = price * 0.014;
  const stripeTotalFees = stripePercentFee + stripeFixedFee;
  const netEarnings = price - commissionFee - stripeTotalFees;

  return (
    <div className="bg-stone-50 min-h-screen text-stone-800 font-sans antialiased" id="course-builder-dashboard">
      {/* SaaS Dashboard Top Banner */}
      <header className="border-b border-stone-200 bg-white px-6 py-4 sticky top-0 z-50 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={onCancel}
            className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5 flex items-center justify-center" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full font-bold">
                Artisan Marketplace Builder
              </span>
              <span className={`w-2 h-2 rounded-full relative top-px ${saveStatus === "saving" ? "bg-amber-500 animate-ping" : "bg-emerald-500"}`} />
              <span className="text-[9px] font-mono text-stone-400">
                {saveStatus === "saving" ? "Auto-saving draft..." : `Draft saved at ${lastSavedTime}`}
              </span>
            </div>
            <h1 className="font-serif text-xl font-black text-stone-900 leading-tight">
              {courseToEdit ? `Edit Course — ${courseToEdit.title}` : "Interactive woodwork Course Builder"}
            </h1>
          </div>
        </div>

        {/* Quick actions & Templates */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {!courseToEdit && (
            <div className="hidden lg:flex items-center gap-2 bg-stone-150 p-1 rounded-xl border border-stone-200">
              <span className="text-[9px] font-mono text-stone-500 uppercase font-black px-2">Fill Inspiration:</span>
              {TEMPLATES.map((tpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => loadTemplate(tpl)}
                  className="px-2.5 py-1 text-[10px] font-sans font-bold bg-white text-stone-700 hover:text-amber-800 rounded-lg hover:shadow-xs border border-transparent hover:border-amber-900/10 transition-all cursor-pointer"
                >
                  {tpl.title.split(" ")[0]} Style
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 border border-stone-200 hover:bg-stone-100 text-stone-700 hover:text-stone-900 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Cancel Draft
          </button>
          <button
            type="button"
            onClick={handleSubmitPublish}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-850 text-white rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm cursor-pointer font-bold"
          >
            <Check className="w-3.5 h-3.5" /> Save Workshop
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[calc(100vh-77px)]">
        
        {/* LEFT SIDEBAR: Linear Stepper */}
        <aside className="lg:col-span-3 border-r border-stone-200 bg-white p-6 space-y-6 flex flex-col justify-between" id="builder-sidebar">
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-[10px] font-mono text-stone-400 uppercase font-bold tracking-wider">Workflow Progression</h3>
              <p className="text-xs text-stone-500 leading-relaxed">Configure your course, complete all sections, check and publish..EASY!!</p>
            </div>

            {/* Stepper Steps */}
            <nav className="space-y-1">
              {STEPS.map((st, idx) => {
                const status = getStepStatus(st.id);
                const isActive = activeStep === st.id;
                
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setActiveStep(st.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 group relative cursor-pointer ${
                      isActive 
                        ? "bg-amber-50/50 border border-amber-900/10 text-amber-950 font-bold shadow-xs" 
                        : "hover:bg-stone-50 border border-transparent text-stone-600 hover:text-stone-950"
                    }`}
                  >
                    {/* Left Icon-Status Ring */}
                    <div className="mt-0.5 shrink-0">
                      {status === "valid" ? (
                        <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold">
                          ✓
                        </div>
                      ) : status === "invalid" && activeStep !== st.id ? (
                        <div className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold" title="Incomplete required fields">
                          !
                        </div>
                      ) : (
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[9px] font-bold ${
                          isActive ? "border-amber-750 text-amber-750 font-black" : "border-stone-300 text-stone-400"
                        }`}>
                          {idx + 1}
                        </div>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-xs flex items-center gap-1 font-bold">
                        {st.title}
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-600 animate-[pulse_1s_infinite]" />}
                      </div>
                      <span className="text-[10px] text-stone-400 leading-normal block group-hover:text-stone-500 font-medium">
                        {st.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1 px-1.5 text-[8px] font-mono font-bold bg-amber-100 text-amber-900 rounded border border-amber-200">
                SEO METADATA
              </span>
              <span className="text-[10px] font-bold text-stone-700">Marketplace Search API</span>
            </div>
            <p className="text-[10px] text-stone-500 leading-normal font-semibold">
              Dont forget be very clear on your course listing Title and Description. The better it the better it will rank for SEO in google!!
            </p>
          </div>
        </aside>

        {/* MIDDLE COLUMN: Main Config Forms */}
        <main className="lg:col-span-5 p-6 md:p-8 bg-stone-50 border-r border-stone-200 overflow-y-auto max-h-[calc(100vh-77px)] flex flex-col justify-between" id="builder-form-panel">
          <div className="space-y-6">
            
            {/* Header info */}
            <div className="pb-4 border-b border-stone-200 space-y-1">
              <span className="text-[9px] font-mono uppercase text-amber-850 bg-amber-50 px-2 py-0.5 rounded font-black tracking-wide">
                Configuration Phase
              </span>
              <h2 className="text-lg font-serif font-bold text-stone-900">
                {STEPS.find(s => s.id === activeStep)?.title}
              </h2>
              <p className="text-xs text-stone-550">
                {STEPS.find(s => s.id === activeStep)?.description}. Edits saved to workspace cache.
              </p>
            </div>

            {/* Step error list */}
            {validateStep(activeStep).errors.length > 0 && (
              <div className="bg-amber-50/40 border border-amber-200/50 p-3.5 rounded-xl space-y-1.5 animate-[fadeIn_0.15s_ease-out]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-700" /> Required Fields Checklist
                </div>
                <ul className="list-disc list-inside text-[10px] text-amber-900 space-y-0.5 pl-1 font-semibold">
                  {validateStep(activeStep).errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* DETAILS STEP */}
            {activeStep === "details" && (
              <div className="space-y-5 animate-[fadeIn_0.15s_ease-out]">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-mono text-stone-500 uppercase font-bold">
                    <label>Workshop title name</label>
                    <span>{title.length} / 80</span>
                  </div>
                  <input
                    type="text"
                    maxLength={80}
                    placeholder="e.g. Traditional Swiss Spoon Carving Intensive"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl font-bold text-stone-950 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-xs shadow-xs"
                  />
                  <p className="text-[10px] text-stone-400 font-semibold">Descriptive titles including timber types or specific chisels boost search placement.</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-mono text-stone-500 uppercase font-bold">
                    <label>Comprehensive course narrative (WordPress Outline)</label>
                    <span>{description.length} chars</span>
                  </div>
                  <textarea
                    rows={6}
                    placeholder="Describe what students will chisel, tools utilized, wood specimens provided, safety precautions, and traditional history module included..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-850 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-xs leading-relaxed"
                  />
                  <p className="text-[10px] text-stone-400 font-semibold">Keep details helpful and authentic to woodworkers. Ideal length is 60+ words.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-stone-500 uppercase font-bold block">Experience Rank</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-xs font-bold text-stone-800 cursor-pointer"
                    >
                      <option value="Beginner">Beginner Friendly</option>
                      <option value="Intermediate">Intermediate Level</option>
                      <option value="Advanced">Advanced Woodworkers</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-stone-500 uppercase font-bold block">Specimen Materials</label>
                    <div className="flex items-center gap-3 bg-white p-2 border border-stone-200 rounded-xl h-[36px]">
                      <input
                        type="checkbox"
                        id="materialsCheckbox"
                        checked={materialsIncluded}
                        onChange={(e) => setMaterialsIncluded(e.target.checked)}
                        className="w-4 h-4 text-stone-900 focus:ring-stone-500 border-stone-300 rounded cursor-pointer"
                      />
                      <label htmlFor="materialsCheckbox" className="text-xs font-bold text-stone-700 cursor-pointer select-none">
                        Included in booking
                      </label>
                    </div>
                  </div>
                </div>

                {/* Techniques Tag Builder */}
                <div className="space-y-2 bg-white p-4 rounded-2xl border border-stone-200">
                  <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                    <span className="text-[10px] font-mono text-stone-500 uppercase font-bold">Artisan Techniques Covered ({skills.length})</span>
                    <span className="text-[9px] font-mono text-amber-700">Course Highlights</span>
                  </div>
                  
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 py-1">
                      {skills.map((sk) => (
                        <span key={sk} className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-850 text-[10px] font-bold rounded-lg font-mono">
                          {sk}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(sk)}
                            className="text-stone-400 hover:text-red-700 font-bold ml-1 hover:underline cursor-pointer bg-transparent border-none p-0"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Mortise and tenon joinery"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                      className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-stone-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-3 bg-stone-800 hover:bg-stone-950 text-white font-bold text-xs rounded-xl flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* DATES STEP */}
            {activeStep === "dates" && (
              <div className="space-y-5 animate-[fadeIn_0.15s_ease-out]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-stone-500 uppercase font-bold block">Course Duration Type</label>
                    <select
                      value={durationType}
                      onChange={(e) => {
                        const val = e.target.value as CourseDurationType;
                        setDurationType(val);
                        setDurationLabel(val === "hourly" ? "3 Hours" : val === "daily" ? "2 Days" : "1 Week");
                      }}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-xs font-bold text-stone-800 cursor-pointer"
                    >
                      <option value="hourly">Hourly Sessions</option>
                      <option value="daily">Daily Workshops</option>
                      <option value="weekly">Weekly Masterclasses</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-stone-500 uppercase font-bold block">Quick Duration Label</label>
                    <input
                      type="text"
                      placeholder="e.g., 3 Hours, 2 Days"
                      value={durationLabel}
                      onChange={(e) => setDurationLabel(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-xs font-bold text-stone-900 text-center"
                    />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-stone-850 block">Class Bench Capacities</span>
                      <span className="text-[9px] font-mono text-stone-400">Total physical workbenches in shed</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-900">
                      <button
                        type="button"
                        onClick={() => setCapacity(prev => Math.max(1, prev - 1))}
                        className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-xs font-bold font-mono transition-colors border-none cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-bold font-mono">{capacity}</span>
                      <button
                        type="button"
                        onClick={() => setCapacity(prev => prev + 1)}
                        className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-xs font-bold font-mono transition-colors border-none cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-stone-400 font-semibold">
                    Expert recommendation: Woodwork classes recommended between 4 to 8 benches for proper instructor safe proximity.
                  </p>
                </div>

                {/* Session Slots */}
                <div className="space-y-3 bg-white p-4 rounded-2xl border border-stone-200">
                  <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                    <div>
                      <span className="text-xs font-bold text-stone-900 block">Session Hours / Time Slots</span>
                      <span className="text-[9px] font-mono text-stone-400">Daily block allocations</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-900 bg-amber-50 px-2 py-0.5 rounded font-bold">
                      {timeSlots.length} Slots
                    </span>
                  </div>

                  {timeSlots.length > 0 ? (
                    <div className="space-y-2">
                      {timeSlots.map((slot) => (
                        <div key={slot} className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-850">
                          <span className="font-mono font-bold text-stone-800 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-stone-405" />
                            {slot}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTimeSlot(slot)}
                            className="text-[10px] font-mono font-bold text-stone-500 hover:text-red-750 hover:underline cursor-pointer bg-transparent border-none p-0"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl text-center border-dashed border border-stone-200 text-xs text-stone-400 font-medium">
                      ⚠️ No session slots defined. Add time coordinates below.
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 09:00 - 12:00, 13:00 - 17:00"
                      value={newSlot}
                      onChange={(e) => setNewSlot(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTimeSlot())}
                      className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-stone-800"
                    />
                    <button
                      type="button"
                      onClick={handleAddTimeSlot}
                      className="px-4 bg-stone-800 hover:bg-stone-950 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PRICING STEP */}
            {activeStep === "pricing" && (
              <div className="space-y-5 animate-[fadeIn_0.15s_ease-out]">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-stone-500 uppercase font-bold block">Base workshop ticket price (£)</label>
                  <div className="relative shadow-xs rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500 font-bold font-mono text-sm">
                      £
                    </div>
                    <input
                      type="number"
                      min={5}
                      max={1200}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm font-bold text-stone-950 font-mono"
                    />
                  </div>
                  <p className="text-[10px] text-stone-400 font-semibold">Standard spoon woodwork modules average £35-£75; cabinetry suites average £150-£350.</p>
                </div>

                {/* SaaS payout calculations */}
                <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-sm">
                  <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                    <span className="text-xs font-bold text-stone-950 flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-emerald-800" /> Stripe Host Revenue Split
                    </span>
                    <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-2.5 py-0.5 rounded-full font-bold">Earnings estimation</span>
                  </div>

                  <div className="space-y-2 text-xs text-stone-600">
                    <div className="flex justify-between items-center font-medium">
                      <span>Gross ticket rate</span>
                      <strong className="text-stone-900 font-mono font-bold">£{price.toFixed(2)}</strong>
                    </div>
                    <div className="flex justify-between items-center font-medium">
                      <span>Platform Commission ({commissionPercent}%)</span>
                      <span className="text-amber-800 font-mono font-semibold">-£{commissionFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center font-medium">
                      <span>Gate processing (1.4% + 20p)</span>
                      <span className="text-stone-500 font-mono font-semibold">-£{stripeTotalFees.toFixed(2)}</span>
                    </div>
                    <hr className="border-stone-100" />
                    <div className="flex justify-between items-center pt-1 font-bold">
                      <span className="font-bold text-emerald-800">Your direct payout (Bank transfer)</span>
                      <strong className="text-emerald-700 text-sm font-mono font-extrabold">
                        £{netEarnings > 0 ? netEarnings.toFixed(2) : "0.00"}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50/15 rounded-2xl border border-amber-900/10 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-mono text-[8px] font-bold uppercase tracking-wide">Premium boost</span>
                        <span className="text-xs font-bold text-stone-900">Featured Placement</span>
                      </div>
                      <p className="text-[11px] text-stone-500 leading-relaxed font-semibold">
                        Promote this slot on the primary browse pages. Boost organic search views and benchmark conversion rates. Additional £49 one-off premium invoice.
                      </p>
                    </div>
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-4 h-4 text-stone-950 focus:ring-stone-550 border-stone-300 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* IMAGES & MEDIA */}
            {activeStep === "media" && (
              <div className="space-y-5 animate-[fadeIn_0.15s_ease-out]">
                <div className="flex bg-white p-1 rounded-xl border border-stone-200">
                  <button
                    type="button"
                    onClick={() => {
                      setImageInputType("preset");
                      setImageError(null);
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all border-none cursor-pointer ${
                      imageInputType === "preset" ? "bg-stone-900 text-white shadow-xs" : "text-stone-600 hover:text-stone-950"
                    }`}
                  >
                    Select Fine Artisan Presets
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImageInputType("custom");
                      setImageError(null);
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all border-none cursor-pointer ${
                      imageInputType === "custom" ? "bg-stone-900 text-white shadow-xs" : "text-stone-600 hover:text-stone-950"
                    }`}
                  >
                    Custom URL / Drag Files
                  </button>
                </div>

                {imageError && (
                  <p className="p-2 bg-red-50 text-red-750 text-[10px] font-mono border border-red-200 rounded-lg">
                    ⚠️ {imageError}
                  </p>
                )}

                {imageInputType === "preset" ? (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono tracking-wider uppercase text-stone-400 font-bold block">Artisan Image Presets</span>
                    <div className="grid grid-cols-2 gap-3" id="presets-gallery">
                      {IMAGE_PRESETS.map((preset) => {
                        const isSelected = images.includes(preset.key);
                        return (
                          <div
                            key={preset.key}
                            onClick={() => handleTogglePresetImage(preset.key)}
                            className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all h-[95px] flex items-end p-2.5 ${
                              isSelected ? "border-amber-700 ring-2 ring-amber-700/20" : "border-stone-200 hover:border-stone-400"
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.label}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent" />
                            <div className="relative w-full flex items-center justify-between text-white text-[10px] font-bold">
                              <span>{preset.label}</span>
                              {isSelected && (
                                <span className="w-4 h-4 rounded-full bg-amber-700 text-white flex items-center justify-center text-[8px] font-mono font-black border border-white/20">
                                  ✓
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Simulated file upload with Drag & Drop */}
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDragDropImages}
                      className="border-2 border-dashed border-stone-200 hover:border-amber-750 bg-white rounded-2xl p-6 text-center space-y-2 transition-all cursor-pointer relative group"
                    >
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="mx-auto w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-500 group-hover:bg-amber-50 group-hover:text-amber-800 transition-all">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-stone-800">Drag high-resolution workshop photos here</p>
                        <p className="text-[10px] text-stone-400 font-semibold">Multiple file upload supported. Maximum size limit 2MB.</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-wider uppercase text-stone-400 font-bold block">Enter Custom Web Url String</span>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/photo-..."
                          value={customImageUrl}
                          onChange={(e) => setCustomImageUrl(e.target.value)}
                          className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-stone-550"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomImageUrl}
                          className="px-3 bg-stone-850 hover:bg-stone-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Append
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Display active gallery thumbnails */}
                {images.length > 0 && (
                  <div className="bg-white p-3.5 rounded-2xl border border-stone-200 space-y-2.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block">Active Gallery Slides ({images.length} / 4)</span>
                    <div className="flex gap-2.5">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-stone-200">
                          <img
                            src={getImagePresetUrl(img)}
                            alt="thumb"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute -top-1 -right-1 bg-red-650 hover:bg-red-800 text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-mono shadow-md border border-white cursor-pointer"
                            title="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* LOCATION & VENUE */}
            {activeStep === "location" && (
              <div className="space-y-5 animate-[fadeIn_0.15s_ease-out]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-stone-500 uppercase font-bold block">Studio Region</label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-xs font-bold text-stone-800 cursor-pointer"
                    >
                      <option value="Devon">Devon</option>
                      <option value="London">London</option>
                      <option value="Cornwall">Cornwall</option>
                      <option value="Bristol">Bristol</option>
                      <option value="Yorkshire">Yorkshire</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-stone-500 uppercase font-bold block">Venue / Studio Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Traditional Oak Timber Studio"
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      className="w-full px-3 py-1.5.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-xs font-bold text-stone-900"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-stone-500 uppercase font-bold block">Full Physical Street Address &amp; Postcode</label>
                  <input
                    type="text"
                    placeholder="e.g. Old Quarry Lane, near Totnes, Devon, EX6 8ND"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-xs"
                  />
                  <p className="text-[10px] text-stone-400 font-semibold">Directions, parking rules, and train links sync to confirmations automatically.</p>
                </div>
              </div>
            )}

            {/* REVIEW STEP */}
            {activeStep === "review" && (
              <div className="space-y-5 animate-[fadeIn_0.15s_ease-out]">
                <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block">Integrity Compliance Manifest</span>
                  
                  <div className="space-y-2.5">
                    {STEPS.slice(0, 5).map((step) => {
                      const valObj = validateStep(step.id);
                      return (
                        <div key={step.id} className="flex items-center justify-between text-xs pb-1 border-b border-stone-100">
                          <span className="font-bold text-stone-700">{step.title} validation</span>
                          {valObj.valid ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              ✓ Complete &amp; Secure
                            </span>
                          ) : (
                            <span className="text-amber-800 font-bold flex items-center gap-1">
                              ⚠️ Missing required data
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-amber-100/50 border border-amber-900/10 p-4 rounded-xl flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-amber-850 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-amber-950 font-bold text-xs">
                    <p>Ready to Publish to woodworker.org.uk</p>
                    <p className="text-[10px] text-amber-900/80 font-semibold leading-relaxed">
                      Saving registers components directly as Custom CPTs via standard endpoint. Other woodwork masters immediately see slots in admin selectors.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Stepper bottom arrows */}
          <div className="flex justify-between items-center pt-8 border-t border-stone-200">
            <button
              type="button"
              disabled={activeStep === "details"}
              onClick={() => {
                const idx = STEPS.findIndex(s => s.id === activeStep);
                if (idx > 0) setActiveStep(STEPS[idx - 1].id);
              }}
              className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg text-xs font-bold text-stone-700 disabled:opacity-40 transition-all flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous Configuration
            </button>

            {activeStep !== "review" ? (
              <button
                type="button"
                onClick={() => {
                  const idx = STEPS.findIndex(s => s.id === activeStep);
                  if (idx < STEPS.length - 1) setActiveStep(STEPS[idx + 1].id);
                }}
                className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-950 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                Next Section &rarr;
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitPublish}
                className="px-4 py-1.5 bg-amber-850 hover:bg-amber-900 text-white rounded-lg text-xs uppercase tracking-wider font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" /> Publish Course Live
              </button>
            )}
          </div>
        </main>

        {/* RIGHT COLUMN: Real-time Live Preview Card rendering */}
        <aside className="lg:col-span-4 p-6 bg-stone-150/50 flex flex-col justify-start space-y-6 overflow-y-auto max-h-[calc(100vh-77px)]" id="live-card-preview-panel">
          <div className="space-y-1">
            <h3 className="text-[10px] font-mono text-stone-500 uppercase font-black tracking-wider block">Live WordPress Preview</h3>
            <p className="text-xs text-stone-400 font-semibold leading-normal">
              Inspect how this item scales on the master woodwork index view catalog in real-time.
            </p>
          </div>

          <div className="relative shadow-md rounded-2xl overflow-hidden max-w-sm mx-auto bg-white border border-stone-200">
            {/* Image section with fallbacks */}
            <div className="relative h-48 w-full overflow-hidden bg-stone-200">
              <img
                src={getImagePresetUrl(images[0] || "joinery")}
                alt="preview_thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {isFeatured && (
                  <span className="bg-amber-500/90 backdrop-blur-md text-stone-900 text-[10px] font-mono font-black tracking-wide uppercase px-2.5 py-1 rounded-md shadow-xs">
                    ✨ Featured
                  </span>
                )}
                <span className="bg-stone-900/90 backdrop-blur-md text-stone-100 text-[10px] font-mono tracking-wider uppercase font-semibold px-2 px-1 py-0.5 rounded-md inline-block w-max">
                  {difficulty}
                </span>
              </div>
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md text-stone-900 px-3 py-1 rounded-lg text-sm font-semibold border border-stone-100 shadow-sm font-mono leading-none">
                £{price}
              </div>
            </div>

            {/* Content particulars */}
            <div className="p-5 space-y-3.5">
              <div className="flex items-center gap-1.5 text-[10px] text-amber-800 font-bold uppercase tracking-wide">
                <span>🕒 {durationLabel}</span>
                <span className="text-stone-300">&bull;</span>
                <span>📍 {location}</span>
                {materialsIncluded && (
                  <>
                    <span className="text-stone-300">&bull;</span>
                    <span className="text-emerald-800 text-[9px] bg-emerald-50 px-1 inline-block rounded font-mono">Tools supplied</span>
                  </>
                )}
              </div>

              <h4 className="font-serif text-lg text-stone-900 font-black line-clamp-1">
                {title || "Untitled Woodworking Masterclass"}
              </h4>

              <p className="text-stone-500 text-xs leading-relaxed line-clamp-2 font-medium">
                {description || "Provide an engaging summary detailing bench woodwork outcomes, native species carved, and custom chisels."}
              </p>

              {/* Skills summary tags */}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1 leading-none py-1">
                  {skills.slice(0, 3).map((sk) => (
                    <span key={sk} className="text-[8px] uppercase tracking-wider font-mono font-extrabold bg-stone-100 text-stone-500 px-2 py-0.5 rounded border border-transparent">
                      {sk}
                    </span>
                  ))}
                  {skills.length > 3 && (
                    <span className="text-[8px] font-mono text-stone-400 font-bold py-0.5">
                      +{skills.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Card Footer host specifics */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-stone-550">
                <div className="flex items-center gap-2">
                  <img
                    src={safeInstructor.avatar}
                    alt="avatar"
                    className="w-5 h-5 rounded-full object-cover border border-stone-200 shrink-0"
                  />
                  <span className="text-[10px] font-bold text-stone-700">
                    Host: {safeInstructor.name}
                  </span>
                </div>
                <span className="text-[10px] text-amber-800 font-black tracking-wide uppercase hover:underline cursor-pointer">
                  Learn More &rarr;
                </span>
              </div>
            </div>
          </div>

          {/* Quick tips box */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2 max-w-sm mx-auto">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
              <Info className="w-4 h-4 text-stone-400" /> Protip: Multi-day slots
            </div>
            <p className="text-[10px] text-stone-500 leading-normal font-semibold">
              For weekend carving retreats or 1-week cabinetry setups, we recommend pricing between £180–£650.
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
}
