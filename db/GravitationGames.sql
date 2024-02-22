CREATE TABLE public.Games(
	game_id SERIAL PRIMARY KEY,
	player1_id INT NOT NULL,
	player2_id INT NOT NULL,
	winner_id INT NOT NULL,
	game_end TIMESTAMP WITH TIME ZONE NOT NULL
)