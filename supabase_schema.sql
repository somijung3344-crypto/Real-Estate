-- 1. bookmarks 테이블 생성 SQL 정의
-- Supabase 대시보드 -> SQL Editor에 복사하여 실행하세요.

CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    apt_id TEXT NOT NULL,
    apt_name TEXT NOT NULL,
    recent_price TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- 동일 사용자가 동일 아파트를 여러 번 북마크하는 것을 방지
    UNIQUE(user_id, apt_id)
);

-- Row Level Security (RLS) 활성화
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- 2. RLS 정책 설정 (사용자는 본인의 북마크 정보만 조회/수정/삭제 가능)

-- 본인 북마크 조회 정책
CREATE POLICY "Users can view their own bookmarks" 
    ON public.bookmarks FOR SELECT 
    USING (auth.uid() = user_id);

-- 본인 북마크 추가 정책
CREATE POLICY "Users can insert their own bookmarks" 
    ON public.bookmarks FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- 본인 북마크 삭제 정책
CREATE POLICY "Users can delete their own bookmarks" 
    ON public.bookmarks FOR DELETE 
    USING (auth.uid() = user_id);
