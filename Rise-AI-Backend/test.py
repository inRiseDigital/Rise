import random
from faker import Faker
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Import your model & Base
from database import Base, Car

# --- Database connection ---
DATABASE_URL = "postgresql+psycopg2://neondb_owner:npg_L2qFgQrxu9fw@ep-billowing-surf-a1id6kbr-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
engine = create_engine(DATABASE_URL, future=True)

SessionLocal = sessionmaker(bind=engine)

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

# Faker instance
fake = Faker()

# Sample car makes and models
makes_models = {
    "toyota": ["corolla", "camry", "yaris", "rav4"],
    "honda": ["civic", "accord", "fit", "cr-v"],
    "ford": ["focus", "fusion", "mustang", "escape"],
    "bmw": ["3 series", "5 series", "x3", "x5"],
    "mercedes": ["c-class", "e-class", "gla", "glc"]
}

colors = ["red", "blue", "black", "white", "silver", "grey", "green"]

def insert_random_cars(count=100):
    db = SessionLocal()
    cars = []

    for _ in range(count):
        make = random.choice(list(makes_models.keys()))
        model = random.choice(makes_models[make])
        year = random.randint(1995, 2024)
        color = random.choice(colors)
        base_price = round(random.uniform(3000, 80000), 2)
        min_price = round(base_price * random.uniform(0.7, 0.9), 2)  # 70%-90% of base_price
        description = fake.sentence(nb_words=10)

        car = Car(
            make=make,
            model=model,
            year=year,
            color=color,
            base_price=base_price,
            min_price=min_price,
            current_price=base_price,  # start with base_price
            negotiation_enabled=True,
            negotiation_flexibility=0.3,
            description=description
        )
        cars.append(car)

    db.bulk_save_objects(cars)
    db.commit()
    db.close()
    print(f"✅ Inserted {count} random cars into the database.")

if __name__ == "__main__":
    insert_random_cars(100)
