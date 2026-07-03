-- Create RPC function to update student profile including auth.users password
CREATE OR REPLACE FUNCTION public.update_student_profile(
  p_student_id uuid,
  p_full_name text,
  p_target text,
  p_color text,
  p_progress integer,
  p_week_start integer,
  p_username text,
  p_plain_password text,
  p_password_hash text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
declare
  v_email text;
BEGIN
  v_email := p_username || '@rostrumakademi.com';

  -- Update auth.users
  UPDATE auth.users
  SET email = v_email,
      encrypted_password = crypt(p_plain_password, gen_salt('bf', 10)),
      updated_at = now()
  WHERE id = p_student_id;

  -- Update public.users
  UPDATE public.users
  SET full_name = p_full_name,
      target = p_target,
      color = p_color,
      progress = p_progress,
      week_start = p_week_start,
      username = p_username,
      email = v_email,
      password_hash = p_password_hash,
      updated_at = now()
  WHERE id = p_student_id;
END;
$$;
