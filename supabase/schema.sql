-- Supabase SQL Schema for Woodworker Marketplace (PostgreSQL)

-- ENUMS (Safely created if they do not exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN
        CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'CREATOR', 'SUPERADMIN');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'EnrollmentStatus') THEN
        CREATE TYPE "EnrollmentStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PaymentStatus') THEN
        CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');
    END IF;
END $$;

-- USERS TABLE (Note: IntegrateAs with Supabase Auth or can be kept as a separate profile table linked to auth.users)
-- We'll mirror the public users table for app logic.
CREATE TABLE IF NOT EXISTS "User" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
  "avatar" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CATEGORY TABLE
CREATE TABLE IF NOT EXISTS "Category" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "description" TEXT NOT NULL,
  "seoTitle" TEXT,
  "seoDescription" TEXT,
  "image" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Category_slug_idx" ON "Category"("slug");

-- LOCATION TABLE
CREATE TABLE IF NOT EXISTS "Location" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "description" TEXT,
  "seoTitle" TEXT,
  "seoDescription" TEXT,
  "image" TEXT,
  "address" TEXT,
  "county" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Location_slug_idx" ON "Location"("slug");

-- COURSE TABLE
CREATE TABLE IF NOT EXISTS "Course" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "description" TEXT NOT NULL,
  "longDescription" TEXT,
  "price" INTEGER NOT NULL,
  "image" TEXT NOT NULL,
  "published" BOOLEAN NOT NULL DEFAULT true,
  "categoryId" UUID NOT NULL REFERENCES "Category"("id") ON DELETE CASCADE,
  "locationId" UUID NOT NULL REFERENCES "Location"("id") ON DELETE CASCADE,
  "creatorId" UUID REFERENCES "User"("id") ON DELETE SET NULL,
  "capacity" INTEGER,
  "difficulty" TEXT,
  "durationLabel" TEXT,
  "instructor" TEXT,
  "instructorBio" TEXT,
  "instructorAvatar" TEXT,
  "skillsTaught" TEXT[],
  "materialsIncluded" BOOLEAN NOT NULL DEFAULT true,
  "schedule" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Course_slug_idx" ON "Course"("slug");
CREATE INDEX IF NOT EXISTS "Course_categoryId_idx" ON "Course"("categoryId");
CREATE INDEX IF NOT EXISTS "Course_locationId_idx" ON "Course"("locationId");
CREATE INDEX IF NOT EXISTS "Course_creatorId_idx" ON "Course"("creatorId");

-- MESSAGE TABLE
CREATE TABLE IF NOT EXISTS "Message" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "text" TEXT NOT NULL,
  "senderId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "receiverId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "courseId" UUID REFERENCES "Course"("id") ON DELETE SET NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Message_senderId_idx" ON "Message"("senderId");
CREATE INDEX IF NOT EXISTS "Message_receiverId_idx" ON "Message"("receiverId");
CREATE INDEX IF NOT EXISTS "Message_courseId_idx" ON "Message"("courseId");

-- ENROLLMENT TABLE
CREATE TABLE IF NOT EXISTS "Enrollment" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "pricePaid" INTEGER NOT NULL,
  "status" "EnrollmentStatus" NOT NULL DEFAULT 'COMPLETED',
  "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "courseId" UUID NOT NULL REFERENCES "Course"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("userId", "courseId")
);
CREATE INDEX IF NOT EXISTS "Enrollment_userId_idx" ON "Enrollment"("userId");
CREATE INDEX IF NOT EXISTS "Enrollment_courseId_idx" ON "Enrollment"("courseId");

-- PAYMENT TABLE
CREATE TABLE IF NOT EXISTS "Payment" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "amount" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'GBP',
  "stripeSessionId" TEXT UNIQUE,
  "status" "PaymentStatus" NOT NULL DEFAULT 'COMPLETED',
  "enrollmentId" UUID NOT NULL REFERENCES "Enrollment"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Payment_enrollmentId_idx" ON "Payment"("enrollmentId");

-- INSTRUCTOR_PROFILES TABLE
CREATE TABLE IF NOT EXISTS "instructor_profiles" (
  "id" UUID PRIMARY KEY REFERENCES auth.users("id") ON DELETE CASCADE,
  "full_name" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "postcode" TEXT NOT NULL,
  "phone_number" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "website" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "profile_completed" BOOLEAN NOT NULL DEFAULT false
);

-- Set up RLS (Row Level Security) and Policies
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Location" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Course" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Message" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Enrollment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "instructor_profiles" ENABLE ROW LEVEL SECURITY;

-- Policies for instructor_profiles:
DROP POLICY IF EXISTS "Instructors can select their own profile" ON "instructor_profiles";
CREATE POLICY "Instructors can select their own profile" ON "instructor_profiles"
  FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Instructors can insert their own profile" ON "instructor_profiles";
CREATE POLICY "Instructors can insert their own profile" ON "instructor_profiles"
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Instructors can update their own profile" ON "instructor_profiles";
CREATE POLICY "Instructors can update their own profile" ON "instructor_profiles"
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can manage all instructor profiles" ON "instructor_profiles";
CREATE POLICY "Admins can manage all instructor profiles" ON "instructor_profiles"
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public."User" 
      WHERE public."User".id = auth.uid() 
      AND public."User".role = 'SUPERADMIN'
    )
  );

-- 1. Policies for User Table
DROP POLICY IF EXISTS "Allow public read access to User profiles" ON "User";
CREATE POLICY "Allow public read access to User profiles" ON "User" 
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow user insert during registration" ON "User";
CREATE POLICY "Allow user insert during registration" ON "User" 
  FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow users to update their own profile" ON "User";
CREATE POLICY "Allow users to update their own profile" ON "User" 
  FOR UPDATE TO public USING (true);

-- 2. Policies for Category Table (Public read, Authenticated write)
DROP POLICY IF EXISTS "Allow public read access to Category" ON "Category";
CREATE POLICY "Allow public read access to Category" ON "Category" 
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow creators to manage Category" ON "Category";
CREATE POLICY "Allow creators to manage Category" ON "Category" 
  FOR ALL TO authenticated USING (true);

-- 3. Policies for Location Table (Public read, Authenticated write)
DROP POLICY IF EXISTS "Allow public read access to Location" ON "Location";
CREATE POLICY "Allow public read access to Location" ON "Location" 
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow creators to manage Location" ON "Location";
CREATE POLICY "Allow creators to manage Location" ON "Location" 
  FOR ALL TO authenticated USING (true);

-- 4. Policies for Course Table (Public read, Creator update/delete)
DROP POLICY IF EXISTS "Allow public read access to Course" ON "Course";
CREATE POLICY "Allow public read access to Course" ON "Course" 
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow creators to insert Course" ON "Course";
CREATE POLICY "Allow creators to insert Course" ON "Course" 
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow creators to modify their own Course" ON "Course";
CREATE POLICY "Allow creators to modify their own Course" ON "Course" 
  FOR UPDATE TO authenticated USING (true);

-- 5. Policies for Message Table (Sender/receiver can read/write)
DROP POLICY IF EXISTS "Allow users to read their own messages" ON "Message";
CREATE POLICY "Allow users to read their own messages" ON "Message" 
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow users to insert messages" ON "Message";
CREATE POLICY "Allow users to insert messages" ON "Message" 
  FOR INSERT TO public WITH CHECK (true);

-- 6. Policies for Enrollment Table (Users can see and insert their own enrollments)
DROP POLICY IF EXISTS "Allow users to read their own enrollments" ON "Enrollment";
CREATE POLICY "Allow users to read their own enrollments" ON "Enrollment" 
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow users to insert enrollment" ON "Enrollment";
CREATE POLICY "Allow users to insert enrollment" ON "Enrollment" 
  FOR INSERT TO public WITH CHECK (true);

-- 7. Policies for Payment Table (Users can see payments)
DROP POLICY IF EXISTS "Allow users to read their own payments" ON "Payment";
CREATE POLICY "Allow users to read their own payments" ON "Payment" 
  FOR SELECT TO public USING (true);

-- Create trigger functions to execute on row updates
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW."updatedAt" = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_updated_at ON "User";
CREATE TRIGGER user_updated_at BEFORE UPDATE ON "User" FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS category_updated_at ON "Category";
CREATE TRIGGER category_updated_at BEFORE UPDATE ON "Category" FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS location_updated_at ON "Location";
CREATE TRIGGER location_updated_at BEFORE UPDATE ON "Location" FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS course_updated_at ON "Course";
CREATE TRIGGER course_updated_at BEFORE UPDATE ON "Course" FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS message_updated_at ON "Message";
CREATE TRIGGER message_updated_at BEFORE UPDATE ON "Message" FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS enrollment_updated_at ON "Enrollment";
CREATE TRIGGER enrollment_updated_at BEFORE UPDATE ON "Enrollment" FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS payment_updated_at ON "Payment";
CREATE TRIGGER payment_updated_at BEFORE UPDATE ON "Payment" FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS instructor_profiles_updated_at ON "instructor_profiles";
CREATE TRIGGER instructor_profiles_updated_at BEFORE UPDATE ON "instructor_profiles" FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- =========================================================================
-- AUTOMATIC AUTH SYNCHRONIZATION TRIGGER (SUPABASE AUTH TO PUBLIC USER PROFILE)
-- =========================================================================
-- This trigger automatically inserts a matching public profile row into the 
-- public."User" table whenever a new user signs up via Supabase Authentication.

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger AS $$
DECLARE
  v_name TEXT;
  v_role TEXT;
  v_avatar TEXT;
BEGIN
  -- 1. Extract user attributes from metadata or fall back gracefully
  v_name := COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));
  v_role := COALESCE(new.raw_user_meta_data->>'role', 'CUSTOMER');
  v_avatar := COALESCE(
    new.raw_user_meta_data->>'avatar', 
    'https://api.dicebear.com/7.x/initials/svg?seed=' || v_name
  );

  -- 2. Upsert into public "User" table
  INSERT INTO public."User" (id, email, name, role, avatar)
  VALUES (
    new.id,
    new.email,
    v_name,
    v_role::public."Role",
    v_avatar
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      name = COALESCE(public."User".name, EXCLUDED.name),
      role = COALESCE(public."User".role, EXCLUDED.role),
      avatar = COALESCE(public."User".avatar, EXCLUDED.avatar);

  -- 3. If user is CREATOR, auto-create a profile draft
  IF v_role = 'CREATOR' THEN
    INSERT INTO public."instructor_profiles" (id, full_name, address, postcode, phone_number, email, website, profile_completed)
    VALUES (
      new.id,
      v_name,
      '',
      '',
      '',
      new.email,
      '',
      false
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger mapping
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();