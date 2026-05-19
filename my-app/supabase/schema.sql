-- Pehle purani table drop karo (agar hai toh)
DROP TABLE IF EXISTS user_profiles;

-- Nai table banao
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  nickname TEXT,
  age INTEGER,
  height INTEGER,
  gender TEXT,
  body_type TEXT,
  style_preferences TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS enable karo
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Sirf apna data insert kar sake
CREATE POLICY "insert_own" ON user_profiles FOR INSERT
WITH CHECK (auth.jwt() ->> 'sub' = user_id);

-- Sirf apna data dekh sake
CREATE POLICY "select_own" ON user_profiles FOR SELECT
USING (auth.jwt() ->> 'sub' = user_id);

-- Sirf apna data update kar sake
CREATE POLICY "update_own" ON user_profiles FOR UPDATE
USING (auth.jwt() ->> 'sub' = user_id);

-- =============================================
-- PAYMENT TABLES
-- =============================================

-- Subscriptions table
DROP TABLE IF EXISTS subscriptions;
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  plan_id TEXT NOT NULL CHECK (plan_id IN ('free', 'pro', 'premium')),
  provider TEXT NOT NULL CHECK (provider IN ('razorpay', 'stripe')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'expired', 'cancelled', 'pending')),
  provider_subscription_id TEXT,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sub_insert_own" ON subscriptions FOR INSERT
WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "sub_select_own" ON subscriptions FOR SELECT
USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "sub_update_own" ON subscriptions FOR UPDATE
USING (auth.jwt() ->> 'sub' = user_id);

-- Payment events table (webhook audit log)
DROP TABLE IF EXISTS payment_events;
CREATE TABLE payment_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  provider TEXT NOT NULL CHECK (provider IN ('razorpay', 'stripe')),
  event_type TEXT NOT NULL,
  provider_event_id TEXT,
  payload JSONB,
  processed_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_insert_service" ON payment_events FOR INSERT
WITH CHECK (true);

CREATE POLICY "events_select_own" ON payment_events FOR SELECT
USING (auth.jwt() ->> 'sub' = user_id);
