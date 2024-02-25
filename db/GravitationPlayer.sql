CREATE TABLE public.Players(
	user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_name VARCHAR(30) NOT NULL,
	user_email VARCHAR(50) NOT NULL,
	user_password TEXT NOT NULL,
	user_rating INT DEFAULT 1000,
	user_friends INT[] DEFAULT {}
)