CREATE TABLE public.Players(
	user_id SERIAL PRIMARY KEY,
	user_name VARCHAR(30) NOT NULL,
	user_email VARCHAR(50) NOT NULL,
	user_password VARCHAR(80) NOT NULL,
	user_rating INT NOT NULL,
	user_friends INT[]
)