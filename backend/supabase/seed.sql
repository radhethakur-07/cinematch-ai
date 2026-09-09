-- CineMatch AI - Curated Seed Dataset
-- 20240101000000_seed.sql

INSERT INTO public.genres (id, name) VALUES
(28, 'Action'),
(12, 'Adventure'),
(16, 'Animation'),
(35, 'Comedy'),
(80, 'Crime'),
(99, 'Documentary'),
(18, 'Drama'),
(10751, 'Family'),
(14, 'Fantasy'),
(36, 'History'),
(27, 'Horror'),
(10402, 'Music'),
(9648, 'Mystery'),
(10749, 'Romance'),
(878, 'Science Fiction'),
(10770, 'TV Movie'),
(53, 'Thriller'),
(10752, 'War'),
(37, 'Western')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.movies (id, title, original_title, overview, release_date, poster_path, backdrop_path, vote_average, vote_count, popularity, runtime, tagline, trailer_url) VALUES
(157336, 'Interstellar', 'Interstellar', 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.', '2014-11-05', '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', '/xJHokMbljvjADYdit5fK5VQsXEG.jpg', 8.4, 34500, 145.8, 169, 'Mankind was born on Earth. It was never meant to die here.', 'https://www.youtube.com/watch?v=zSWdZVtXT7E'),
(27205, 'Inception', 'Inception', 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: inception, the implantation of another person''s idea into a target''s subconscious.', '2010-07-15', '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg', '/8ZTVqvKDQ8emSGUEMjsR4umUMRP.jpg', 8.4, 35900, 138.2, 148, 'Your mind is the scene of the crime.', 'https://www.youtube.com/watch?v=YoHD9XEInc0'),
(155, 'The Dark Knight', 'The Dark Knight', 'Batman raises the stakes in his war on crime. With the help of allies Lt. Jim Gordon and DA Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.', '2008-07-16', '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', '/dqK9Hag1054tghRQSqLSfrkvQnA.jpg', 8.5, 32100, 125.4, 152, 'Why so serious?', 'https://www.youtube.com/watch?v=EXeTwQWrcwY'),
(329865, 'Arrival', 'Arrival', 'Taking place after alien crafts land around the world, an expert linguist is recruited by the military to determine whether they come in peace or are a threat.', '2016-11-10', '/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg', '/y2nn5bH38zC41yZ9R11WdC9k5V6.jpg', 7.9, 17200, 78.5, 116, 'Why are they here?', 'https://www.youtube.com/watch?v=tFMo3UJ4B4g'),
(335984, 'Blade Runner 2049', 'Blade Runner 2049', 'Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what''s left of society into chaos.', '2017-10-04', '/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg', '/ilRyASDvt7vzgqP3bVpMhQh96zp.jpg', 7.5, 13400, 89.2, 164, 'The key to the future is finally unearthed.', 'https://www.youtube.com/watch?v=gCcx85zbxz4'),
(438631, 'Dune', 'Dune', 'Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family.', '2021-09-15', '/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', '/lzWHmYdfeFiMIY4JaMmtR7GEli3.jpg', 7.8, 11200, 110.6, 155, 'Beyond fear, destiny awaits.', 'https://www.youtube.com/watch?v=8g18jFHCLXk'),
(872585, 'Oppenheimer', 'Oppenheimer', 'The story of J. Robert Oppenheimer''s role in the development of the atomic bomb during World War II.', '2023-07-19', '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', '/rLb2cw69P71pmv01pL8R46o9m9M.jpg', 8.1, 8900, 160.7, 180, 'The world forever changes.', 'https://www.youtube.com/watch?v=uYPbbksJxIg'),
(496243, 'Parasite', 'Gisaengchung', 'All unemployed, Ki-taek''s family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.', '2019-05-30', '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', '/hiKmpZMGZsrkA3cdFiRrlCwPuMl.jpg', 8.5, 17800, 95.3, 133, 'Act like you own the place.', 'https://www.youtube.com/watch?v=5xH0hhJpxvI'),
(545611, 'Everything Everywhere All at Once', 'Everything Everywhere All at Once', 'An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what is important to her by connecting with the lives she could have led in other universes.', '2022-03-24', '/w3LxiVYPq6ABGj9Cg5nQfXzNf9F.jpg', '/7ZO959ZCRedEycbJJ097c0x08w.jpg', 7.8, 6200, 84.1, 139, 'The universe is so much bigger than you realize.', 'https://www.youtube.com/watch?v=wxN1T1uxQ2g'),
(680, 'Pulp Fiction', 'Pulp Fiction', 'A burger-loving hit man, his philosophical partner, a drug-addled gangster''s moll and a washed-up boxer converge in this sprawling, comedic crime caper.', '1994-09-10', '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', '/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg', 8.5, 27500, 115.1, 154, 'Just because you are a character doesn''t mean you have character.', 'https://www.youtube.com/watch?v=s7EdQ4FqbhY'),
(603, 'The Matrix', 'The Matrix', 'Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.', '1999-03-30', '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', '/oK9yLhEwzOszgVj9U7k14W1eJ2w.jpg', 8.2, 25200, 98.4, 136, 'Welcome to the Real World.', 'https://www.youtube.com/watch?v=vKQi3bBA1y8')
ON CONFLICT (id) DO UPDATE SET
title = EXCLUDED.title,
overview = EXCLUDED.overview,
vote_average = EXCLUDED.vote_average,
vote_count = EXCLUDED.vote_count,
popularity = EXCLUDED.popularity;

INSERT INTO public.movie_genres (movie_id, genre_id) VALUES
(157336, 12), (157336, 18), (157336, 878),
(27205, 28), (27205, 878), (27205, 12),
(155, 18), (155, 28), (155, 80), (155, 53),
(329865, 18), (329865, 878), (329865, 9648),
(335984, 878), (335984, 18),
(438631, 878), (438631, 12),
(872585, 18), (872585, 36),
(496243, 35), (496243, 53), (496243, 18),
(545611, 28), (545611, 12), (545611, 878),
(680, 53), (680, 80),
(603, 28), (603, 878)
ON CONFLICT DO NOTHING;
