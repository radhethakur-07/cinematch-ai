"""
Train and persist the Content-Based TF-IDF Recommendation Model.
"""
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from ml.inference.content_engine import ContentEngine

SAMPLE_MOVIES = [
    {
        "id": 157336,
        "title": "Interstellar",
        "overview": "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.",
        "tagline": "Mankind was born on Earth. It was never meant to die here.",
        "vote_average": 8.4,
        "popularity": 145.8,
        "genres": ["Adventure", "Drama", "Science Fiction"],
        "directors": ["Christopher Nolan"],
        "cast": ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
        "keywords": ["space exploration", "wormhole", "black hole", "relativity", "father daughter"]
    },
    {
        "id": 27205,
        "title": "Inception",
        "overview": "A skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life.",
        "tagline": "Your mind is the scene of the crime.",
        "vote_average": 8.4,
        "popularity": 138.2,
        "genres": ["Action", "Science Fiction", "Adventure"],
        "directors": ["Christopher Nolan"],
        "cast": ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
        "keywords": ["dream", "subconscious", "heist", "mind-bending", "reality"]
    },
    {
        "id": 329865,
        "title": "Arrival",
        "overview": "Taking place after alien crafts land around the world, an expert linguist is recruited by the military to determine whether they come in peace or are a threat.",
        "tagline": "Why are they here?",
        "vote_average": 7.9,
        "popularity": 78.5,
        "genres": ["Drama", "Science Fiction", "Mystery"],
        "directors": ["Denis Villeneuve"],
        "cast": ["Amy Adams", "Jeremy Renner", "Forest Whitaker"],
        "keywords": ["alien contact", "linguistics", "time perception", "first contact"]
    },
    {
        "id": 335984,
        "title": "Blade Runner 2049",
        "overview": "Thirty years after the events of the first film, a new blade runner LAPD Officer K unearths a long-buried secret that has the potential to plunge society into chaos.",
        "tagline": "The key to the future is finally unearthed.",
        "vote_average": 7.5,
        "popularity": 89.2,
        "genres": ["Science Fiction", "Drama"],
        "directors": ["Denis Villeneuve"],
        "cast": ["Ryan Gosling", "Harrison Ford", "Ana de Armas"],
        "keywords": ["cyberpunk", "replicant", "artificial intelligence", "dystopia"]
    },
    {
        "id": 438631,
        "title": "Dune",
        "overview": "Paul Atreides a brilliant and gifted young man born into a great destiny must travel to the most dangerous planet in the universe to ensure the future of his family.",
        "tagline": "Beyond fear, destiny awaits.",
        "vote_average": 7.8,
        "popularity": 110.6,
        "genres": ["Science Fiction", "Adventure"],
        "directors": ["Denis Villeneuve"],
        "cast": ["Timothée Chalamet", "Rebecca Ferguson", "Oscar Isaac", "Zendaya"],
        "keywords": ["desert planet", "spice", "prophecy", "chosen one"]
    },
    {
        "id": 872585,
        "title": "Oppenheimer",
        "overview": "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
        "tagline": "The world forever changes.",
        "vote_average": 8.1,
        "popularity": 160.7,
        "genres": ["Drama", "History"],
        "directors": ["Christopher Nolan"],
        "cast": ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
        "keywords": ["atomic bomb", "manhattan project", "physicist", "biography"]
    },
    {
        "id": 496243,
        "title": "Parasite",
        "overview": "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
        "tagline": "Act like you own the place.",
        "vote_average": 8.5,
        "popularity": 95.3,
        "genres": ["Comedy", "Thriller", "Drama"],
        "directors": ["Bong Joon-ho"],
        "cast": ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
        "keywords": ["social inequality", "class struggle", "deception", "dark comedy"]
    },
    {
        "id": 545611,
        "title": "Everything Everywhere All at Once",
        "overview": "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what is important to her by connecting with the lives she could have led in other universes.",
        "tagline": "The universe is so much bigger than you realize.",
        "vote_average": 7.8,
        "popularity": 84.1,
        "genres": ["Action", "Adventure", "Science Fiction"],
        "directors": ["Daniel Kwan", "Daniel Scheinert"],
        "cast": ["Michelle Yeoh", "Ke Huy Quan", "Stephanie Hsu"],
        "keywords": ["multiverse", "existentialism", "family dynamics", "absurdist"]
    },
    {
        "id": 680,
        "title": "Pulp Fiction",
        "overview": "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper.",
        "tagline": "Just because you are a character doesn't mean you have character.",
        "vote_average": 8.5,
        "popularity": 115.1,
        "genres": ["Thriller", "Crime"],
        "directors": ["Quentin Tarantino"],
        "cast": ["John Travolta", "Samuel L. Jackson", "Uma Thurman"],
        "keywords": ["nonlinear timeline", "hitman", "pop culture", "dark comedy"]
    },
    {
        "id": 603,
        "title": "The Matrix",
        "overview": "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
        "tagline": "Welcome to the Real World.",
        "vote_average": 8.2,
        "popularity": 98.4,
        "genres": ["Action", "Science Fiction"],
        "directors": ["Lana Wachowski", "Lilly Wachowski"],
        "cast": ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
        "keywords": ["simulated reality", "dystopia", "martial arts", "ai rebellion"]
    },
    {
        "id": 804680,
        "title": "Mirzapur: The Film",
        "overview": "The high-octane theatrical cinematic universe debut of Mirzapur. Kaleen Bhaiya, Guddu Pandit, and Munna Bhaiya collide on the big screen in a colossal, all-out war for total supremacy over the Purvanchal throne.",
        "tagline": "Bhowkaal will now explode on the Big Screen.",
        "vote_average": 8.7,
        "popularity": 198.5,
        "genres": ["Crime", "Action", "Drama", "Thriller"],
        "directors": ["Gurmmeet Singh"],
        "cast": ["Pankaj Tripathi", "Ali Fazal", "Divyenndu", "Jitendra Kumar"],
        "keywords": ["mafia", "gangster", "power struggle", "revenge", "crime lord", "theatrical movie", "bhowkaal", "purvanchal"]
    },
    {
        "id": 991201,
        "title": "Dhurandhar",
        "overview": "An elite Indian intelligence officer orchestrates a high-stakes undercover global counter-terror operation against a ruthless syndicate spanning cross-border networks.",
        "tagline": "The ultimate covert tactical strike.",
        "vote_average": 8.4,
        "popularity": 195.4,
        "genres": ["Action", "Thriller", "Crime"],
        "directors": ["Aditya Dhar"],
        "cast": ["Ranveer Singh", "Sanjay Dutt", "R. Madhavan", "Akshaye Khanna"],
        "keywords": ["espionage", "intelligence agent", "counter terrorism", "covert ops", "action"]
    },
    {
        "id": 15301,
        "title": "Dhoom 2",
        "overview": "ACP Jai Dixit and his sidekick Ali team up with a mysterious undercover cop to track down Mr. A, a master of disguise and fearless high-tech thief.",
        "tagline": "Back in Action with Style.",
        "vote_average": 7.6,
        "popularity": 110.2,
        "genres": ["Action", "Thriller", "Crime"],
        "directors": ["Sanjay Gadhvi"],
        "cast": ["Hrithik Roshan", "Abhishek Bachchan", "Aishwarya Rai", "Bipasha Basu"],
        "keywords": ["heist", "high-tech thief", "chase", "undercover cop", "style"]
    },
    {
        "id": 115004,
        "title": "Gangs of Wasseypur",
        "overview": "A multi-generational blood feud between three crime families in the coal-rich town of Wasseypur spirals into relentless violence, political corruption, and vengeance.",
        "tagline": "Revenge is the only currency that matters.",
        "vote_average": 8.4,
        "popularity": 135.0,
        "genres": ["Crime", "Drama", "Action"],
        "directors": ["Anurag Kashyap"],
        "cast": ["Manoj Bajpayee", "Nawazuddin Siddiqui", "Richa Chadha", "Huma Qureshi"],
        "keywords": ["gang war", "coal mafia", "revenge", "family feud", "cult classic"]
    },
    {
        "id": 536343,
        "title": "Tumbbad",
        "overview": "A mythological horror tale revolving around a cursed ancient family mansion and the monstrous, forbidden gold of the demon Hastar in 19th-century Maharashtra.",
        "tagline": "Fear the endless greed of Hastar.",
        "vote_average": 8.5,
        "popularity": 148.0,
        "genres": ["Horror", "Fantasy", "Mystery", "Drama"],
        "directors": ["Rahi Anil Barve", "Anand Gandhi"],
        "cast": ["Sohum Shah", "Jyoti Malshe", "Anita Date"],
        "keywords": ["greed", "curse", "mythology", "demon", "treasure", "period horror"]
    },
    {
        "id": 579974,
        "title": "RRR",
        "overview": "A fictional story about two legendary Indian revolutionaries, Alluri Sitarama Raju and Komaram Bheem, and their epic battle against the British Raj in the 1920s.",
        "tagline": "Rise, Roar, Revolt.",
        "vote_average": 8.3,
        "popularity": 182.0,
        "genres": ["Action", "Drama", "Adventure"],
        "directors": ["S.S. Rajamouli"],
        "cast": ["N.T. Rama Rao Jr.", "Ram Charan", "Alia Bhatt", "Ajay Devgn"],
        "keywords": ["revolution", "brotherhood", "epic battle", "freedom fighter", "blockbuster"]
    },
    {
        "id": 584440,
        "title": "K.G.F: Chapter 2",
        "overview": "The blood-soaked land of Kolar Gold Fields has a new overlord: Rocky. While his allies look up to him, the government sees him as a threat to law and order.",
        "tagline": "Violence violence violence... I don't like it, I avoid. But violence likes me!",
        "vote_average": 8.2,
        "popularity": 168.0,
        "genres": ["Action", "Crime", "Drama"],
        "directors": ["Prashanth Neel"],
        "cast": ["Yash", "Sanjay Dutt", "Raveena Tandon", "Srinidhi Shetty"],
        "keywords": ["gold mines", "gangster", "power", "mass hero", "underworld"]
    },
    {
        "id": 20453,
        "title": "3 Idiots",
        "overview": "Two friends embark on a quest for a lost buddy. On this journey, they reminisce about their college days and their friend who inspired them to think differently.",
        "tagline": "Don't chase success, chase excellence and success will follow.",
        "vote_average": 8.5,
        "popularity": 142.0,
        "genres": ["Comedy", "Drama"],
        "directors": ["Rajkumar Hirani"],
        "cast": ["Aamir Khan", "R. Madhavan", "Sharman Joshi", "Kareena Kapoor"],
        "keywords": ["college life", "engineering", "friendship", "education system", "inspiration"]
    },
    {
        "id": 781732,
        "title": "Animal",
        "overview": "The hardened son of a powerful industrialist returns home after years abroad and unleashes an unrelenting violent rampage against anyone threatening his father's life.",
        "tagline": "A father-son bond that turned ferocious.",
        "vote_average": 7.9,
        "popularity": 188.0,
        "genres": ["Action", "Drama", "Crime"],
        "directors": ["Sandeep Reddy Vanga"],
        "cast": ["Ranbir Kapoor", "Anil Kapoor", "Bobby Deol", "Rashmika Mandanna"],
        "keywords": ["father son", "obsession", "revenge", "gang war", "violence"]
    },
    {
        "id": 1111873,
        "title": "Stree 2",
        "overview": "The town of Chanderi is haunted once again, this time by a headless entity named Sarkata that abducts modern women. Vicky and his loyal gang must unite with Stree to save the town.",
        "tagline": "O Stree kal aana!",
        "vote_average": 8.0,
        "popularity": 192.0,
        "genres": ["Horror", "Comedy", "Fantasy"],
        "directors": ["Amar Kaushik"],
        "cast": ["Rajkummar Rao", "Shraddha Kapoor", "Pankaj Tripathi", "Aparshakti Khurana"],
        "keywords": ["ghost", "horror comedy", "small town", "supernatural", "folklore"]
    },
    {
        "id": 101088,
        "title": "Panchayat",
        "overview": "Abhishek Tripathi, an engineering graduate, navigates the quirky challenges and eccentric politics of rural India as the secretary of a Gram Panchayat in the quiet village of Phulera.",
        "tagline": "Lauki, Chai, aur Phulera ki Siyasat.",
        "vote_average": 8.9,
        "popularity": 198.0,
        "genres": ["Comedy", "Drama"],
        "directors": ["Deepak Kumar Mishra"],
        "cast": ["Jitendra Kumar", "Neena Gupta", "Raghubir Yadav", "Chandan Roy", "Faisal Malik"],
        "keywords": ["village life", "panchayat", "sachiv ji", "rural politics", "phulera", "wholesome comedy", "tvf"]
    },
    {
        "id": 928172,
        "title": "Pritam and Pedro",
        "overview": "A brilliant, sharp-witted young hacker Pritam and an unorthodox, seasoned cop Pedro find themselves forced into an eccentric partnership to crack high-stakes digital heists and dismantle a massive cyber-crime network.",
        "tagline": "Genius Hacker meets Noob Cop.",
        "vote_average": 8.5,
        "popularity": 196.0,
        "genres": ["Crime", "Comedy", "Thriller", "Drama"],
        "directors": ["Rajkumar Hirani"],
        "cast": ["Vikrant Massey", "Arshad Warsi", "Vir Hirani"],
        "keywords": ["cyber crime", "hacker", "cop and criminal", "buddy cop", "digital heist", "comedy thriller"]
    }
]

def train_content_model(movies_data=None, output_path="backend/ml/models/content_model.joblib"):
    print("[ML Pipeline] Training Content-Based Model on full verified catalog...")
    if movies_data is None:
        try:
            from app.services.movie_service import DEFAULT_CATALOG
            movies = DEFAULT_CATALOG
            print(f"[ML Pipeline] Loaded {len(movies)} verified movies and series from DEFAULT_CATALOG.")
        except Exception as e:
            print(f"[ML Pipeline] Fallback to sample movies: {e}")
            movies = SAMPLE_MOVIES
    else:
        movies = movies_data

    engine = ContentEngine()
    engine.fit(movies)
    
    engine.save_model(output_path)
    print(f"[ML Pipeline] Successfully saved model with {len(movies)} items to {output_path}")
    return engine

if __name__ == "__main__":
    train_content_model()
