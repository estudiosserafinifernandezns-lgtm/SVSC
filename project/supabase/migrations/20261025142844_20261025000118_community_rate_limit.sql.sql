/*
# Rate-limit bucket table for community versus submissions

1. New Tables
- `rate_limit_buckets`
  - `bucket` (text, primary key) — composite key "ip:minute-window"
  - `requests` (int, default 0) — request count within the bucket window
  - `updated_at` (timestamptz) — last time the bucket was touched

2. Security
- RLS disabled intentionally — this table is only accessed by the
  service role from the submit-versus edge function. We DO NOT grant
  anything to anon/authenticated, so the Data API cannot reach it.
- A SECURITY DEFINER function `check_rate_limit(bucket_name, max_requests)`
  is the only public entry point; it increments atomically and returns
  whether the request is allowed. Revoke EXECUTE from anon so only the
  service role / authenticated edge callers can use it.
*/

CREATE TABLE IF NOT EXISTS rate_limit_buckets (
  bucket text PRIMARY KEY,
  requests int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE rate_limit_buckets ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION check_rate_limit(bucket_name text, max_requests int)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_count int;
BEGIN
  -- Prune buckets older than 10 minutes to keep the table small.
  DELETE FROM rate_limit_buckets WHERE updated_at < now() - interval '10 minutes';

  SELECT requests INTO current_count
  FROM rate_limit_buckets
  WHERE bucket = bucket_name
  FOR UPDATE;

  IF current_count IS NULL THEN
    INSERT INTO rate_limit_buckets (bucket, requests, updated_at)
    VALUES (bucket_name, 1, now());
    RETURN 1 <= max_requests;
  END IF;

  UPDATE rate_limit_buckets
  SET requests = requests + 1, updated_at = now()
  WHERE bucket = bucket_name;

  RETURN (current_count + 1) <= max_requests;
END;
$$;

REVOKE EXECUTE ON FUNCTION check_rate_limit(text, int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION check_rate_limit(text, int) TO authenticated, service_role;
