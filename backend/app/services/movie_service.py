from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc, or_, func
from app.models.db_models import Movie, Genre, MovieGenre, MovieCast, MovieDirector, MovieKeyword, Rating, Like, Watchlist
from app.schemas.movie import MovieSummarySchema, MovieDetailSchema, MovieListResponse, MovieFilterParams
from app.services.tmdb_service import tmdb_service
from app.core.errors import AppException
from fastapi import status

# Fallback in-memory catalog in case DB is being initialized
DEFAULT_CATALOG = [
    {
        "id": 157336,
        "title": "Interstellar",
        "original_title": "Interstellar",
        "overview": "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.",
        "release_date": "2014-11-05",
        "poster_path": "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        "backdrop_path": "/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
        "vote_average": 8.4,
        "vote_count": 34500,
        "popularity": 145.8,
        "runtime": 169,
        "tagline": "Mankind was born on Earth. It was never meant to die here.",
        "trailer_url": "https://www.youtube.com/watch?v=zSWdZVtXT7E",
        "genres": [{"id": 12, "name": "Adventure"}, {"id": 18, "name": "Drama"}, {"id": 878, "name": "Science Fiction"}],
        "directors": [{"name": "Christopher Nolan"}],
        "cast": [{"name": "Matthew McConaughey", "character": "Cooper"}, {"name": "Anne Hathaway", "character": "Brand"}]
    },
    {
        "id": 27205,
        "title": "Inception",
        "original_title": "Inception",
        "overview": "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life.",
        "release_date": "2010-07-15",
        "poster_path": "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
        "backdrop_path": "/8ZTVqvKDQ8emSGUEMjsR4umUMRP.jpg",
        "vote_average": 8.4,
        "vote_count": 35900,
        "popularity": 138.2,
        "runtime": 148,
        "tagline": "Your mind is the scene of the crime.",
        "trailer_url": "https://www.youtube.com/watch?v=YoHD9XEInc0",
        "genres": [{"id": 28, "name": "Action"}, {"id": 878, "name": "Science Fiction"}, {"id": 12, "name": "Adventure"}],
        "directors": [{"name": "Christopher Nolan"}],
        "cast": [{"name": "Leonardo DiCaprio", "character": "Cobb"}, {"name": "Joseph Gordon-Levitt", "character": "Arthur"}]
    },
    {
        "id": 155,
        "title": "The Dark Knight",
        "original_title": "The Dark Knight",
        "overview": "Batman raises the stakes in his war on crime. With the help of allies Lt. Jim Gordon and DA Harvey Dent, Batman sets out to dismantle the remaining criminal organizations.",
        "release_date": "2008-07-16",
        "poster_path": "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        "backdrop_path": "/dqK9Hag1054tghRQSqLSfrkvQnA.jpg",
        "vote_average": 8.5,
        "vote_count": 32100,
        "popularity": 125.4,
        "runtime": 152,
        "tagline": "Why so serious?",
        "trailer_url": "https://www.youtube.com/watch?v=EXeTwQWrcwY",
        "genres": [{"id": 18, "name": "Drama"}, {"id": 28, "name": "Action"}, {"id": 80, "name": "Crime"}],
        "directors": [{"name": "Christopher Nolan"}],
        "cast": [{"name": "Christian Bale", "character": "Bruce Wayne"}, {"name": "Heath Ledger", "character": "Joker"}]
    },
    {
        "id": 329865,
        "title": "Arrival",
        "original_title": "Arrival",
        "overview": "Taking place after alien crafts land around the world, an expert linguist is recruited by the military to determine whether they come in peace or are a threat.",
        "release_date": "2016-11-10",
        "poster_path": "/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
        "backdrop_path": "/y2nn5bH38zC41yZ9R11WdC9k5V6.jpg",
        "vote_average": 7.9,
        "vote_count": 17200,
        "popularity": 78.5,
        "runtime": 116,
        "tagline": "Why are they here?",
        "trailer_url": "https://www.youtube.com/watch?v=tFMo3UJ4B4g",
        "genres": [{"id": 18, "name": "Drama"}, {"id": 878, "name": "Science Fiction"}, {"id": 9648, "name": "Mystery"}],
        "directors": [{"name": "Denis Villeneuve"}],
        "cast": [{"name": "Amy Adams", "character": "Dr. Louise Banks"}, {"name": "Jeremy Renner", "character": "Ian Donnelly"}]
    },
    {
        "id": 335984,
        "title": "Blade Runner 2049",
        "original_title": "Blade Runner 2049",
        "overview": "Thirty years after the events of the first film, a new blade runner LAPD Officer K unearths a long-buried secret that has the potential to plunge what's left of society into chaos.",
        "release_date": "2017-10-04",
        "poster_path": "/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
        "backdrop_path": "/ilRyASDvt7vzgqP3bVpMhQh96zp.jpg",
        "vote_average": 7.5,
        "vote_count": 13400,
        "popularity": 89.2,
        "runtime": 164,
        "tagline": "The key to the future is finally unearthed.",
        "trailer_url": "https://www.youtube.com/watch?v=gCcx85zbxz4",
        "genres": [{"id": 878, "name": "Science Fiction"}, {"id": 18, "name": "Drama"}],
        "directors": [{"name": "Denis Villeneuve"}],
        "cast": [{"name": "Ryan Gosling", "character": "K"}, {"name": "Harrison Ford", "character": "Rick Deckard"}]
    },
    {
        "id": 438631,
        "title": "Dune",
        "original_title": "Dune",
        "overview": "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe.",
        "release_date": "2021-09-15",
        "poster_path": "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
        "backdrop_path": "/lzWHmYdfeFiMIY4JaMmtR7GEli3.jpg",
        "vote_average": 7.8,
        "vote_count": 11200,
        "popularity": 110.6,
        "runtime": 155,
        "tagline": "Beyond fear, destiny awaits.",
        "trailer_url": "https://www.youtube.com/watch?v=8g18jFHCLXk",
        "genres": [{"id": 878, "name": "Science Fiction"}, {"id": 12, "name": "Adventure"}],
        "directors": [{"name": "Denis Villeneuve"}],
        "cast": [{"name": "Timothée Chalamet", "character": "Paul Atreides"}, {"name": "Zendaya", "character": "Chani"}]
    },
    {
        "id": 872585,
        "title": "Oppenheimer",
        "original_title": "Oppenheimer",
        "overview": "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
        "release_date": "2023-07-19",
        "poster_path": "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
        "backdrop_path": "/rLb2cw69P71pmv01pL8R46o9m9M.jpg",
        "vote_average": 8.1,
        "vote_count": 8900,
        "popularity": 160.7,
        "runtime": 180,
        "tagline": "The world forever changes.",
        "trailer_url": "https://www.youtube.com/watch?v=uYPbbksJxIg",
        "genres": [{"id": 18, "name": "Drama"}, {"id": 36, "name": "History"}],
        "directors": [{"name": "Christopher Nolan"}],
        "cast": [{"name": "Cillian Murphy", "character": "J. Robert Oppenheimer"}, {"name": "Emily Blunt", "character": "Katherine"}]
    },
    {
        "id": 496243,
        "title": "Parasite",
        "original_title": "Gisaengchung",
        "overview": "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
        "release_date": "2019-05-30",
        "poster_path": "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
        "backdrop_path": "/hiKmpZMGZsrkA3cdFiRrlCwPuMl.jpg",
        "vote_average": 8.5,
        "vote_count": 17800,
        "popularity": 95.3,
        "runtime": 133,
        "tagline": "Act like you own the place.",
        "trailer_url": "https://www.youtube.com/watch?v=5xH0hhJpxvI",
        "genres": [{"id": 35, "name": "Comedy"}, {"id": 53, "name": "Thriller"}, {"id": 18, "name": "Drama"}],
        "directors": [{"name": "Bong Joon-ho"}],
        "cast": [{"name": "Song Kang-ho", "character": "Kim Ki-taek"}]
    },
    {
        "id": 545611,
        "title": "Everything Everywhere All at Once",
        "original_title": "Everything Everywhere All at Once",
        "overview": "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what is important to her by connecting with the lives she could have led in other universes.",
        "release_date": "2022-03-24",
        "poster_path": "/w3LxiVYPq6ABGj9Cg5nQfXzNf9F.jpg",
        "backdrop_path": "/7ZO959ZCRedEycbJJ097c0x08w.jpg",
        "vote_average": 7.8,
        "vote_count": 6200,
        "popularity": 84.1,
        "runtime": 139,
        "tagline": "The universe is so much bigger than you realize.",
        "trailer_url": "https://www.youtube.com/watch?v=wxN1T1uxQ2g",
        "genres": [{"id": 28, "name": "Action"}, {"id": 12, "name": "Adventure"}, {"id": 878, "name": "Science Fiction"}],
        "directors": [{"name": "Daniel Kwan"}, {"name": "Daniel Scheinert"}],
        "cast": [{"name": "Michelle Yeoh", "character": "Evelyn Wang"}, {"name": "Ke Huy Quan", "character": "Waymond Wang"}]
    },
    {
        "id": 680,
        "title": "Pulp Fiction",
        "original_title": "Pulp Fiction",
        "overview": "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper.",
        "release_date": "1994-09-10",
        "poster_path": "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
        "backdrop_path": "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
        "vote_average": 8.5,
        "vote_count": 27500,
        "popularity": 115.1,
        "runtime": 154,
        "tagline": "Just because you are a character doesn't mean you have character.",
        "trailer_url": "https://www.youtube.com/watch?v=s7EdQ4FqbhY",
        "genres": [{"id": 53, "name": "Thriller"}, {"id": 80, "name": "Crime"}],
        "directors": [{"name": "Quentin Tarantino"}],
        "cast": [{"name": "John Travolta", "character": "Vincent Vega"}, {"name": "Samuel L. Jackson", "character": "Jules"}]
    },
    {
        "id": 603,
        "title": "The Matrix",
        "original_title": "The Matrix",
        "overview": "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
        "release_date": "1999-03-30",
        "poster_path": "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
        "backdrop_path": "/oK9yLhEwzOszgVj9U7k14W1eJ2w.jpg",
        "vote_average": 8.2,
        "vote_count": 25200,
        "popularity": 98.4,
        "runtime": 136,
        "tagline": "Welcome to the Real World.",
        "trailer_url": "https://www.youtube.com/watch?v=vKQi3bBA1y8",
        "genres": [{"id": 28, "name": "Action"}, {"id": 878, "name": "Science Fiction"}],
        "directors": [{"name": "Lana Wachowski"}, {"name": "Lilly Wachowski"}],
        "cast": [{"name": "Keanu Reeves", "character": "Neo"}, {"name": "Laurence Fishburne", "character": "Morpheus"}]
    },
    {
        "id": 80468,
        "title": "Mirzapur",
        "original_title": "Mirzapur",
        "overview": "The iron-fisted Akhandanand Tripathi is a millionaire carpet exporter and the mafia don of Mirzapur. His ambitious, power-hungry son Munna will stop at nothing to inherit his father's legacy.",
        "release_date": "2018-11-16",
        "poster_path": "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80",
        "backdrop_path": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80",
        "vote_average": 8.6,
        "vote_count": 18400,
        "popularity": 178.5,
        "runtime": 160,
        "tagline": "Rule the kingdom or die trying.",
        "trailer_url": "https://www.youtube.com/watch?v=ZNeGF-PvRHY",
        "genres": [{"id": 80, "name": "Crime"}, {"id": 28, "name": "Action"}, {"id": 18, "name": "Drama"}, {"id": 53, "name": "Thriller"}],
        "directors": [{"name": "Karan Anshuman"}, {"name": "Gurmmeet Singh"}],
        "cast": [{"name": "Pankaj Tripathi", "character": "Kaleen Bhaiya"}, {"name": "Ali Fazal", "character": "Guddu Pandit"}, {"name": "Divyenndu", "character": "Munna Bhaiya"}]
    },
    {
        "id": 991201,
        "title": "Dhurandhar",
        "original_title": "Dhurandhar",
        "overview": "An elite Indian intelligence officer orchestrates a high-stakes undercover global counter-terror operation against a ruthless syndicate spanning cross-border networks.",
        "release_date": "2025-10-02",
        "poster_path": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
        "backdrop_path": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
        "vote_average": 8.4,
        "vote_count": 12800,
        "popularity": 195.4,
        "runtime": 165,
        "tagline": "The ultimate covert tactical strike.",
        "trailer_url": "https://www.youtube.com/watch?v=wxN1T1uxQ2g",
        "genres": [{"id": 28, "name": "Action"}, {"id": 53, "name": "Thriller"}, {"id": 80, "name": "Crime"}],
        "directors": [{"name": "Aditya Dhar"}],
        "cast": [{"name": "Ranveer Singh", "character": "Special Agent"}, {"name": "Sanjay Dutt", "character": "Antagonist"}, {"name": "R. Madhavan", "character": "Intelligence Chief"}, {"name": "Akshaye Khanna", "character": "Strategist"}]
    },
    {
        "id": 15301,
        "title": "Dhoom 2",
        "original_title": "Dhoom 2",
        "overview": "ACP Jai Dixit and his sidekick Ali team up with a mysterious undercover cop to track down Mr. A, a master of disguise and fearless high-tech thief.",
        "release_date": "2006-11-24",
        "poster_path": "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",
        "backdrop_path": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
        "vote_average": 7.6,
        "vote_count": 9200,
        "popularity": 110.2,
        "runtime": 152,
        "tagline": "Back in Action with Style.",
        "trailer_url": "https://www.youtube.com/watch?v=S2fFv3K4X_w",
        "genres": [{"id": 28, "name": "Action"}, {"id": 53, "name": "Thriller"}, {"id": 80, "name": "Crime"}],
        "directors": [{"name": "Sanjay Gadhvi"}],
        "cast": [{"name": "Hrithik Roshan", "character": "Aryan (Mr. A)"}, {"name": "Abhishek Bachchan", "character": "ACP Jai Dixit"}, {"name": "Aishwarya Rai", "character": "Sunehri"}]
    },
    {
        "id": 115004,
        "title": "Gangs of Wasseypur",
        "original_title": "Gangs of Wasseypur",
        "overview": "A multi-generational blood feud between three crime families in the coal-rich town of Wasseypur spirals into relentless violence, political corruption, and vengeance.",
        "release_date": "2012-06-22",
        "poster_path": "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=800&q=80",
        "backdrop_path": "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80",
        "vote_average": 8.4,
        "vote_count": 16500,
        "popularity": 135.0,
        "runtime": 321,
        "tagline": "Revenge is the only currency that matters.",
        "trailer_url": "https://www.youtube.com/watch?v=j-XF_59ke8U",
        "genres": [{"id": 80, "name": "Crime"}, {"id": 18, "name": "Drama"}, {"id": 28, "name": "Action"}],
        "directors": [{"name": "Anurag Kashyap"}],
        "cast": [{"name": "Manoj Bajpayee", "character": "Sardar Khan"}, {"name": "Nawazuddin Siddiqui", "character": "Faizal Khan"}, {"name": "Richa Chadha", "character": "Nagma Khatoon"}]
    },
    {
        "id": 536343,
        "title": "Tumbbad",
        "original_title": "Tumbbad",
        "overview": "A mythological horror tale revolving around a cursed ancient family mansion and the monstrous, forbidden gold of the demon Hastar in 19th-century Maharashtra.",
        "release_date": "2018-10-12",
        "poster_path": "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80",
        "backdrop_path": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
        "vote_average": 8.5,
        "vote_count": 14200,
        "popularity": 148.0,
        "runtime": 104,
        "tagline": "Fear the endless greed of Hastar.",
        "trailer_url": "https://www.youtube.com/watch?v=sN75MPxgvX8",
        "genres": [{"id": 27, "name": "Horror"}, {"id": 14, "name": "Fantasy"}, {"id": 9648, "name": "Mystery"}, {"id": 18, "name": "Drama"}],
        "directors": [{"name": "Rahi Anil Barve"}, {"name": "Anand Gandhi"}],
        "cast": [{"name": "Sohum Shah", "character": "Vinayak Rao"}, {"name": "Jyoti Malshe", "character": "Vinayak's Mother"}]
    },
    {
        "id": 579974,
        "title": "RRR",
        "original_title": "RRR",
        "overview": "A fictional story about two legendary Indian revolutionaries, Alluri Sitarama Raju and Komaram Bheem, and their epic battle against the British Raj in the 1920s.",
        "release_date": "2022-03-24",
        "poster_path": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
        "backdrop_path": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
        "vote_average": 8.3,
        "vote_count": 24000,
        "popularity": 182.0,
        "runtime": 187,
        "tagline": "Rise, Roar, Revolt.",
        "trailer_url": "https://www.youtube.com/watch?v=NgBoAM8pE3w",
        "genres": [{"id": 28, "name": "Action"}, {"id": 18, "name": "Drama"}, {"id": 12, "name": "Adventure"}],
        "directors": [{"name": "S.S. Rajamouli"}],
        "cast": [{"name": "N.T. Rama Rao Jr.", "character": "Komaram Bheem"}, {"name": "Ram Charan", "character": "Alluri Sitarama Raju"}, {"name": "Alia Bhatt", "character": "Sita"}]
    },
    {
        "id": 584440,
        "title": "K.G.F: Chapter 2",
        "original_title": "K.G.F: Chapter 2",
        "overview": "The blood-soaked land of Kolar Gold Fields has a new overlord: Rocky. While his allies look up to him, the government sees him as a threat to law and order.",
        "release_date": "2022-04-14",
        "poster_path": "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80",
        "backdrop_path": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80",
        "vote_average": 8.2,
        "vote_count": 19800,
        "popularity": 168.0,
        "runtime": 168,
        "tagline": "Violence violence violence... I don't like it, I avoid. But violence likes me!",
        "trailer_url": "https://www.youtube.com/watch?v=JKa05nyUmuQ",
        "genres": [{"id": 28, "name": "Action"}, {"id": 80, "name": "Crime"}, {"id": 18, "name": "Drama"}],
        "directors": [{"name": "Prashanth Neel"}],
        "cast": [{"name": "Yash", "character": "Rocky Bhai"}, {"name": "Sanjay Dutt", "character": "Adheera"}, {"name": "Raveena Tandon", "character": "Ramika Sen"}]
    },
    {
        "id": 20453,
        "title": "3 Idiots",
        "original_title": "3 Idiots",
        "overview": "Two friends embark on a quest for a lost buddy. On this journey, they reminisce about their college days and their friend who inspired them to think differently.",
        "release_date": "2009-12-25",
        "poster_path": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80",
        "backdrop_path": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
        "vote_average": 8.5,
        "vote_count": 29000,
        "popularity": 142.0,
        "runtime": 170,
        "tagline": "Don't chase success, chase excellence and success will follow.",
        "trailer_url": "https://www.youtube.com/watch?v=K0eDlFX9GMc",
        "genres": [{"id": 35, "name": "Comedy"}, {"id": 18, "name": "Drama"}],
        "directors": [{"name": "Rajkumar Hirani"}],
        "cast": [{"name": "Aamir Khan", "character": "Rancho"}, {"name": "R. Madhavan", "character": "Farhan"}, {"name": "Sharman Joshi", "character": "Raju"}]
    },
    {
        "id": 781732,
        "title": "Animal",
        "original_title": "Animal",
        "overview": "The hardened son of a powerful industrialist returns home after years abroad and unleashes an unrelenting violent rampage against anyone threatening his father's life.",
        "release_date": "2023-12-01",
        "poster_path": "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80",
        "backdrop_path": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80",
        "vote_average": 7.9,
        "vote_count": 15800,
        "popularity": 188.0,
        "runtime": 201,
        "tagline": "A father-son bond that turned ferocious.",
        "trailer_url": "https://www.youtube.com/watch?v=DydmpkhEvVk",
        "genres": [{"id": 28, "name": "Action"}, {"id": 18, "name": "Drama"}, {"id": 80, "name": "Crime"}],
        "directors": [{"name": "Sandeep Reddy Vanga"}],
        "cast": [{"name": "Ranbir Kapoor", "character": "Ranvijay Singh"}, {"name": "Anil Kapoor", "character": "Balbir Singh"}, {"name": "Bobby Deol", "character": "Abrar Haque"}]
    },
    {
        "id": 1111873,
        "title": "Stree 2",
        "original_title": "Stree 2: Sarkate Ka Aatank",
        "overview": "The town of Chanderi is haunted once again, this time by a headless entity named Sarkata that abducts modern women. Vicky and his loyal gang must unite with Stree to save the town.",
        "release_date": "2024-08-15",
        "poster_path": "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80",
        "backdrop_path": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
        "vote_average": 8.0,
        "vote_count": 13500,
        "popularity": 192.0,
        "runtime": 149,
        "tagline": "O Stree, Raksha Karna.",
        "trailer_url": "https://www.youtube.com/watch?v=KVn7QvA2_oU",
        "genres": [{"id": 35, "name": "Comedy"}, {"id": 27, "name": "Horror"}, {"id": 14, "name": "Fantasy"}],
        "directors": [{"name": "Amar Kaushik"}],
        "cast": [{"name": "Rajkummar Rao", "character": "Vicky"}, {"name": "Shraddha Kapoor", "character": "The Girl with No Name"}, {"name": "Pankaj Tripathi", "character": "Rudra"}]
    }
]

class MovieService:
    def get_all_movies(self, db: Session) -> List[Dict[str, Any]]:
        """Retrieve all movies from DB or fallback dataset."""
        try:
            movies = db.query(Movie).options(
                joinedload(Movie.genres),
                joinedload(Movie.cast),
                joinedload(Movie.directors),
                joinedload(Movie.keywords)
            ).all()
            if movies:
                results = []
                for m in movies:
                    results.append({
                        "id": m.id,
                        "title": m.title,
                        "original_title": m.original_title,
                        "overview": m.overview,
                        "release_date": m.release_date,
                        "poster_path": m.poster_path,
                        "backdrop_path": m.backdrop_path,
                        "vote_average": float(m.vote_average or 0.0),
                        "vote_count": m.vote_count or 0,
                        "popularity": float(m.popularity or 0.0),
                        "runtime": m.runtime,
                        "tagline": m.tagline,
                        "trailer_url": m.trailer_url,
                        "genres": [{"id": g.id, "name": g.name} for g in m.genres],
                        "directors": [{"name": d.name, "profile_path": d.profile_path} for d in m.directors],
                        "cast": [{"name": c.name, "character": c.character, "profile_path": c.profile_path, "cast_order": c.cast_order} for c in m.cast],
                        "keywords": [k.keyword for k in m.keywords]
                    })
                return results
        except Exception:
            pass
        return DEFAULT_CATALOG

    def get_movie_by_id(self, db: Session, movie_id: int, user_id: Optional[str] = None) -> Dict[str, Any]:
        """Fetch full movie details with user interaction state."""
        try:
            m = db.query(Movie).options(
                joinedload(Movie.genres),
                joinedload(Movie.cast),
                joinedload(Movie.directors),
                joinedload(Movie.keywords)
            ).filter(Movie.id == movie_id).first()
            if m:
                # Check user specific state
                user_rating = None
                is_liked = None
                is_watchlist = False

                if user_id:
                    r = db.query(Rating).filter(Rating.user_id == user_id, Rating.movie_id == movie_id).first()
                    if r:
                        user_rating = float(r.rating)
                    l = db.query(Like).filter(Like.user_id == user_id, Like.movie_id == movie_id).first()
                    if l:
                        is_liked = l.is_like
                    w = db.query(Watchlist).filter(Watchlist.user_id == user_id, Watchlist.movie_id == movie_id).first()
                    if w:
                        is_watchlist = True

                return {
                    "id": m.id,
                    "title": m.title,
                    "original_title": m.original_title,
                    "overview": m.overview,
                    "release_date": m.release_date,
                    "poster_path": m.poster_path,
                    "backdrop_path": m.backdrop_path,
                    "vote_average": float(m.vote_average or 0.0),
                    "vote_count": m.vote_count or 0,
                    "popularity": float(m.popularity or 0.0),
                    "runtime": m.runtime,
                    "tagline": m.tagline,
                    "status": m.status or "Released",
                    "trailer_url": m.trailer_url,
                    "budget": m.budget or 0,
                    "revenue": m.revenue or 0,
                    "genres": [{"id": g.id, "name": g.name} for g in m.genres],
                    "directors": [{"name": d.name, "profile_path": d.profile_path} for d in m.directors],
                    "cast": [{"name": c.name, "character": c.character, "profile_path": c.profile_path, "cast_order": c.cast_order} for c in m.cast],
                    "keywords": [k.keyword for k in m.keywords],
                    "user_rating": user_rating,
                    "is_liked": is_liked,
                    "is_in_watchlist": is_watchlist
                }
        except Exception:
            pass

        # Fallback search in memory catalog
        match = next((m for m in DEFAULT_CATALOG if m["id"] == movie_id), None)
        if match:
            return {
                **match,
                "status": "Released",
                "budget": 0,
                "revenue": 0,
                "keywords": [],
                "user_rating": None,
                "is_liked": None,
                "is_in_watchlist": False
            }

        raise AppException(
            code="MOVIE_NOT_FOUND",
            message=f"Movie with ID {movie_id} was not found.",
            status_code=status.HTTP_404_NOT_FOUND
        )

    def search_movies(self, db: Session, query: str, genre_id: Optional[int] = None, page: int = 1, page_size: int = 20) -> Dict[str, Any]:
        """Search across title, actor, director, or genre."""
        all_movies = self.get_all_movies(db)
        q = query.lower().strip() if query else ""

        filtered = []
        for m in all_movies:
            title_match = q in m["title"].lower() if q else True
            actor_match = any(q in c.get("name", "").lower() for c in m.get("cast", [])) if q else False
            director_match = any(q in d.get("name", "").lower() for d in m.get("directors", [])) if q else False
            genre_match = any(g["id"] == genre_id for g in m.get("genres", [])) if genre_id else True

            if (title_match or actor_match or director_match) and genre_match:
                filtered.append(m)

        total = len(filtered)
        start = (page - 1) * page_size
        end = start + page_size
        items = filtered[start:end]

        return {
            "items": items,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": max(1, (total + page_size - 1) // page_size)
        }

movie_service = MovieService()
