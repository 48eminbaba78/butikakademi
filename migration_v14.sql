-- Add start_time column to tasks for hourly scheduling
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS start_time varchar(5) DEFAULT NULL;

-- Create public.reports table for archiving AI/Coach reports
CREATE TABLE IF NOT EXISTS public.reports (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    coach_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
    type varchar(50) NOT NULL CHECK (type IN ('performance', 'ai_copilot')),
    title varchar(255) NOT NULL,
    content text NOT NULL, -- Stored HTML or text evaluation
    start_date date,
    end_date date,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS for reports table
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Enable policies for student/coach access on reports
DROP POLICY IF EXISTS "Reports are viewable by student and coach" ON public.reports;
CREATE POLICY "Reports are viewable by student and coach" ON public.reports
    FOR SELECT USING (student_id = auth.uid() OR coach_id = auth.uid() OR auth.uid() IN (SELECT id FROM public.users WHERE role = 'developer'));

DROP POLICY IF EXISTS "Reports are manageable by coach" ON public.reports;
CREATE POLICY "Reports are manageable by coach" ON public.reports
    FOR ALL USING (coach_id = auth.uid() OR auth.uid() IN (SELECT id FROM public.users WHERE role = 'developer'));

-- Create public.student_notes table for coach notes about students
CREATE TABLE IF NOT EXISTS public.student_notes (
    coach_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    student_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    notes text NOT NULL,
    updated_at timestamptz DEFAULT now(),
    PRIMARY KEY (coach_id, student_id)
);

-- Enable RLS for student_notes table
ALTER TABLE public.student_notes ENABLE ROW LEVEL SECURITY;

-- Enable policies for student_notes access
DROP POLICY IF EXISTS "Student notes are manageable by coach" ON public.student_notes;
CREATE POLICY "Student notes are manageable by coach" ON public.student_notes
    FOR ALL USING (coach_id = auth.uid() OR auth.uid() IN (SELECT id FROM public.users WHERE role = 'developer'));

DROP POLICY IF EXISTS "Student notes are viewable by student" ON public.student_notes;
CREATE POLICY "Student notes are viewable by student" ON public.student_notes
    FOR SELECT USING (student_id = auth.uid());
