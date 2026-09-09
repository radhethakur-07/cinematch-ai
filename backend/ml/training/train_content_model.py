"""
Train and persist the Content-Based TF-IDF Recommendation Model.
"""
import os
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent.parent.parent))

from backend.ml.inference.content_engine import ContentEngine

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
    }
]

def train_content_model(movies_data=None, output_path="backend/ml/models/content_model.joblib"):
    print("[ML Pipeline] Training Content-Based Model...")
    movies = movies_data if movies_data is not None else SAMPLE_MOVIES
    engine = ContentEngine()
    engine.fit(movies)
    
    engine.save_model(output_path)
    print(f"[ML Pipeline] Successfully saved model to {output_path}")
    return engine

if __name__ == "__main__":
    train_content_model()
