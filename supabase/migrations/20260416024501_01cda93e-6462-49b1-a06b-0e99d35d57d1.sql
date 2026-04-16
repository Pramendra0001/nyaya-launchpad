
-- Enum for consultation status
CREATE TYPE public.consultation_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- Enum for lawyer specialization
CREATE TYPE public.lawyer_specialization AS ENUM ('criminal', 'civil', 'corporate', 'family', 'property', 'labour', 'tax', 'constitutional');

-- Lawyers table
CREATE TABLE public.lawyers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  specialization public.lawyer_specialization NOT NULL,
  experience_years INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0.0,
  bio TEXT,
  profile_photo_url TEXT,
  consultation_fee NUMERIC(10,2),
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.lawyers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view lawyers" ON public.lawyers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage lawyers" ON public.lawyers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_lawyers_updated_at BEFORE UPDATE ON public.lawyers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Lawyer availability
CREATE TABLE public.lawyer_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lawyer_id UUID NOT NULL REFERENCES public.lawyers(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  time_slots TEXT[] NOT NULL DEFAULT '{}',
  UNIQUE(lawyer_id, day_of_week)
);

ALTER TABLE public.lawyer_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view availability" ON public.lawyer_availability FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage availability" ON public.lawyer_availability FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Consultations table
CREATE TABLE public.consultations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lawyer_id UUID NOT NULL REFERENCES public.lawyers(id) ON DELETE CASCADE,
  consultation_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status public.consultation_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own consultations" ON public.consultations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own consultations" ON public.consultations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can cancel own consultations" ON public.consultations FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Lawyers can view their consultations" ON public.consultations FOR SELECT TO authenticated USING (lawyer_id IN (SELECT id FROM public.lawyers WHERE user_id = auth.uid()));
CREATE POLICY "Lawyers can update their consultations" ON public.consultations FOR UPDATE TO authenticated USING (lawyer_id IN (SELECT id FROM public.lawyers WHERE user_id = auth.uid()));

CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON public.consultations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Consultation messages (chat after booking)
CREATE TABLE public.consultation_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  consultation_id UUID NOT NULL REFERENCES public.consultations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.consultation_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Consultation parties can view messages" ON public.consultation_messages FOR SELECT TO authenticated
  USING (consultation_id IN (
    SELECT id FROM public.consultations WHERE user_id = auth.uid()
    UNION
    SELECT c.id FROM public.consultations c JOIN public.lawyers l ON c.lawyer_id = l.id WHERE l.user_id = auth.uid()
  ));

CREATE POLICY "Consultation parties can send messages" ON public.consultation_messages FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    consultation_id IN (
      SELECT id FROM public.consultations WHERE user_id = auth.uid()
      UNION
      SELECT c.id FROM public.consultations c JOIN public.lawyers l ON c.lawyer_id = l.id WHERE l.user_id = auth.uid()
    )
  );

-- Enable realtime for consultation messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.consultation_messages;

-- Indexes
CREATE INDEX idx_consultations_user_id ON public.consultations(user_id);
CREATE INDEX idx_consultations_lawyer_id ON public.consultations(lawyer_id);
CREATE INDEX idx_consultation_messages_consultation_id ON public.consultation_messages(consultation_id);
CREATE INDEX idx_lawyers_specialization ON public.lawyers(specialization);
