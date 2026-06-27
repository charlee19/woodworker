import { supabase } from "./supabase";
import coursesJson from "../data/courses.json";
import categoriesJson from "../data/categories.json";
import locationsJson from "../data/locations.json";

// Standardized structure matching requirements
export interface DBItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  image?: string | null;
  county?: string | null;
  address?: string | null;
}

export interface DBCourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string | null;
  price: number;
  image: string;
  published: boolean;
  categoryId: string;
  locationId: string;
  capacity?: number | null;
  difficulty?: string | null;
  durationLabel?: string | null;
  instructor?: string | null;
  instructorBio?: string | null;
  instructorAvatar?: string | null;
  skillsTaught: string[];
  materialsIncluded: boolean;
  schedule?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// In-memory backup state for robust offline previews
let mockCategories: DBItem[] = [...categoriesJson].map((cat) => ({
  id: cat.slug,
  name: cat.name,
  slug: cat.slug,
  description: cat.description,
  seoTitle: cat.seoTitle,
  seoDescription: cat.seoDescription,
  image: cat.image,
}));

let mockLocations: DBItem[] = [...locationsJson].map((loc) => ({
  id: loc.slug,
  name: loc.name,
  slug: loc.slug,
  description: loc.description,
  seoTitle: loc.seoTitle,
  seoDescription: loc.seoDescription,
  image: loc.image,
  county: loc.county,
  address: loc.address,
}));

let mockCourses: DBCourse[] = [...coursesJson].map((c) => ({
  id: c.id,
  title: c.title,
  slug: c.slug,
  description: c.description,
  longDescription: c.description,
  price: c.price,
  image: c.image,
  published: true,
  categoryId: c.categorySlug,
  locationId: c.locationSlug,
  capacity: c.capacity || 6,
  difficulty: c.difficulty || "Beginner",
  durationLabel: c.durationLabel || "1 Day",
  instructor: c.instructor || "David Mercer",
  instructorBio: c.instructorBio || "Artisan Joiner",
  instructorAvatar: c.instructorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  skillsTaught: c.skillsTaught || ["Mortise cutting", "Axe hewing"],
  materialsIncluded: true,
  schedule: c.schedule || "Saturdays 09:30 - 16:30",
}));

let isDbHydrated = false;

async function checkAndHydrateDb() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
  if (isDbHydrated) return;

  try {
    const { count, error } = await supabase
      .from('Category')
      .select('*', { count: 'exact', head: true });
      
    if (error) throw error;

    if (count && count > 0) {
      isDbHydrated = true;
      return;
    }

    console.log("[Data Service] Database is empty. Skipping auto-seed. Please run the SQL schema file directly against your Supabase database to set up tables and seed if needed.");
    isDbHydrated = true;
  } catch (err) {
    console.warn("[Data Service] Database is present but not responding yet or table schema is not fully migrated via schema.sql. Falling back to safe memory sandbox.", err);
  }
}

// ==========================================
// COURSE SERVICE METHODS
// ==========================================

export async function getCourses(options?: { categorySlug?: string; locationSlug?: string; publishedOnly?: boolean }) {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      await checkAndHydrateDb();
      let query = supabase.from("Course").select("*").order("createdAt", { ascending: false });

      if (options?.publishedOnly) {
        query = query.eq("published", true);
      }
      if (options?.categorySlug) {
        // Find category id first
        const {data: catData} = await supabase.from('Category').select('id').eq('slug', options.categorySlug).single();
        if(catData) query = query.eq("categoryId", catData.id);
      }
      if (options?.locationSlug) {
        // Find location id first
        const {data: locData} = await supabase.from('Location').select('id').eq('slug', options.locationSlug).single();
        if(locData) query = query.eq("locationId", locData.id);
      }

      const { data: list, error } = await query;
      if (!error && Array.isArray(list) && list.length > 0) return list as DBCourse[];
    } catch {
      // dynamic fallback
    }
  }

  // Fallback in-memory
  let result = [...mockCourses];
  if (options?.publishedOnly) {
    result = result.filter((c) => c.published);
  }
  if (options?.categorySlug) {
    result = result.filter((c) => c.categoryId === options.categorySlug);
  }
  if (options?.locationSlug) {
    result = result.filter((c) => c.locationId === options.locationSlug);
  }
  return result;
}

export async function getCourseBySlug(slug: string) {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      await checkAndHydrateDb();
      const { data: course } = await supabase.from("Course").select("*").eq("slug", slug).single();
      if (course) return course as DBCourse;
    } catch {
      // dynamic fallback
    }
  }

  return mockCourses.find((c) => c.slug === slug || c.id === slug) || null;
}

export async function createCourse(data: Omit<DBCourse, "id" | "createdAt" | "updatedAt">) {
  const id = "course_" + Math.random().toString(36).substring(2, 9);
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { data: dbCourse } = await supabase.from("Course").insert({
        title: data.title,
        slug: data.slug,
        description: data.description,
        longDescription: data.longDescription || data.description,
        price: Number(data.price),
        image: data.image || "https://images.unsplash.com/photo-1453733190148-c44698c26578?w=800",
        published: data.published,
        categoryId: data.categoryId,
        locationId: data.locationId,
        capacity: Number(data.capacity || 6),
        difficulty: data.difficulty || "Beginner",
        durationLabel: data.durationLabel || "1 Day",
        instructor: data.instructor || "David Mercer",
        instructorBio: data.instructorBio || "Artisan Joiner",
        instructorAvatar: data.instructorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
        skillsTaught: data.skillsTaught || ["Woodworking mechanics"],
        materialsIncluded: data.materialsIncluded,
        schedule: data.schedule || "Saturdays 09:30 - 16:30",
      }).select().single();
      if (dbCourse) return dbCourse as DBCourse;
    } catch (e) {
      console.error("[Data Service] Database insert failed, falling back to local list:", e);
    }
  }

  const newCourse: DBCourse = {
    ...data,
    id,
    longDescription: data.longDescription || data.description,
    price: Number(data.price),
    skillsTaught: data.skillsTaught || ["Woodworking mechanics"],
    capacity: Number(data.capacity || 6),
  };
  mockCourses.unshift(newCourse);
  return newCourse;
}

export async function updateCourse(id: string, data: Partial<DBCourse>) {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { data: updated } = await supabase.from("Course").update({
        ...data,
        price: data.price !== undefined ? Number(data.price) : undefined,
        capacity: data.capacity !== undefined ? Number(data.capacity) : undefined,
      }).eq("id", id).select().single();
      
      if (updated) return updated as DBCourse;
    } catch (e) {
      console.error("[Data Service] Database update failed, falling back:", e);
    }
  }

  const index = mockCourses.findIndex((c) => c.id === id);
  if (index !== -1) {
    mockCourses[index] = {
      ...mockCourses[index],
      ...data,
      price: data.price !== undefined ? Number(data.price) : mockCourses[index].price,
      capacity: data.capacity !== undefined ? Number(data.capacity) : mockCourses[index].capacity,
    };
    return mockCourses[index];
  }
  return null;
}

export async function deleteCourse(id: string) {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      await supabase.from("Course").delete().eq("id", id);
      return true;
    } catch (e) {
      console.error("[Data Service] Database delete failed, falling back:", e);
    }
  }

  const initialCount = mockCourses.length;
  mockCourses = mockCourses.filter((c) => c.id !== id);
  return mockCourses.length < initialCount;
}

export async function toggleCoursePublish(id: string) {
  const course = await getCourseById(id);
  if (!course) return null;
  return await updateCourse(id, { published: !course.published });
}

async function getCourseById(id: string): Promise<DBCourse | null> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { data: dbCourse } = await supabase.from("Course").select("*").eq("id", id).single();
      if (dbCourse) return dbCourse as DBCourse;
    } catch {}
  }
  return mockCourses.find((c) => c.id === id) || null;
}

// ==========================================
// CATEGORY SERVICE METHODS
// ==========================================

export async function getCategories() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      await checkAndHydrateDb();
      const { data } = await supabase.from("Category").select("*").order("name", { ascending: true });
      if (data && data.length > 0) return data as DBItem[];
    } catch {
      // fallback
    }
  }
  return mockCategories;
}

export async function createCategory(data: Omit<DBItem, "id">) {
  const id = data.slug;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { data: newCat } = await supabase.from("Category").insert({
        name: data.name,
        slug: data.slug,
        description: data.description,
        seoTitle: data.seoTitle || `${data.name} Masterclasses`,
        seoDescription: data.seoDescription || data.description,
        image: data.image || "https://images.unsplash.com/photo-1540555700478-4be289fbecef",
      }).select().single();
      if (newCat) return newCat as DBItem;
    } catch (e) {
      console.error("[Data Service] Database category creation failed:", e);
    }
  }

  const newCat: DBItem = { id, ...data };
  mockCategories.push(newCat);
  return newCat;
}

export async function updateCategory(id: string, data: Partial<DBItem>) {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { data: updated } = await supabase.from("Category").update(data).eq("id", id).select().single();
      if (updated) return updated as DBItem;
    } catch (e) {
      console.error("[Data Service] Database category update failed:", e);
    }
  }

  const index = mockCategories.findIndex((c) => c.id === id);
  if (index !== -1) {
    mockCategories[index] = { ...mockCategories[index], ...data };
    return mockCategories[index];
  }
  return null;
}

export async function deleteCategory(id: string) {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      await supabase.from("Category").delete().eq("id", id);
      return true;
    } catch (e) {
      console.error("[Data Service] Database category delete failed:", e);
    }
  }

  const initialCount = mockCategories.length;
  mockCategories = mockCategories.filter((c) => c.id !== id);
  return mockCategories.length < initialCount;
}

// ==========================================
// LOCATION SERVICE METHODS
// ==========================================

export async function getLocations() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      await checkAndHydrateDb();
      const { data } = await supabase.from("Location").select("*").order("name", { ascending: true });
      if (data && data.length > 0) return data as DBItem[];
    } catch {
      // fallback
    }
  }
  return mockLocations;
}

export async function createLocation(data: Omit<DBItem, "id">) {
  const id = data.slug;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { data: newLoc } = await supabase.from("Location").insert({
        name: data.name,
        slug: data.slug,
        description: data.description,
        seoTitle: data.seoTitle || `Woodworking Studio in ${data.name}`,
        seoDescription: data.seoDescription || data.description,
        image: data.image || "https://images.unsplash.com/photo-1453733190148-c44698c26578",
      }).select().single();
      if (newLoc) return newLoc as DBItem;
    } catch (e) {
      console.error("[Data Service] Database location creation failed:", e);
    }
  }

  const newLoc: DBItem = { id, ...data };
  mockLocations.push(newLoc);
  return newLoc;
}

export async function updateLocation(id: string, data: Partial<DBItem>) {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { data: updated } = await supabase.from("Location").update(data).eq("id", id).select().single();
      if (updated) return updated as DBItem;
    } catch (e) {
      console.error("[Data Service] Database location update failed:", e);
    }
  }

  const index = mockLocations.findIndex((l) => l.id === id);
  if (index !== -1) {
    mockLocations[index] = { ...mockLocations[index], ...data };
    return mockLocations[index];
  }
  return null;
}

export async function deleteLocation(id: string) {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      await supabase.from("Location").delete().eq("id", id);
      return true;
    } catch (e) {
      console.error("[Data Service] Database location delete failed:", e);
    }
  }

  const initialCount = mockLocations.length;
  mockLocations = mockLocations.filter((l) => l.id !== id);
  return mockLocations.length < initialCount;
}
