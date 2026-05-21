import { createClient } from '@supabase/supabase-js';

// Supabase 配置
const SUPABASE_URL = 'https://gqsddbnbehenhglsbkwmb.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbXNsa3Rud2N3Y3B0dm15d2VkcyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzc4ODQ5OTQyLCJleHAiOjIwOTQ0MjU5NDJ9.o7o8mqOrZYugDfJHhSdb4Gr9-eZ57gwBghjYtS-8u7o';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 旧代码兼容
export const BASE_URL = SUPABASE_URL;
