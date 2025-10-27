import random
from database import get_db, Car
from sqlalchemy.future import select
from langchain_core.tools import tool
from utils import tool_data
from typing import Optional, Literal,Annotated


@tool
async def get_all_cars():
    """
    Retrieves all cars from the database and returns them as a list of dictionaries.

    If no cars are found, returns a string "No cars found."

    :return: A list of dictionaries or a string
    """
    async for db in get_db():
        stmt = select(Car)
        results = await db.execute(stmt)
        all_cars = results.scalars().all()

        all_cars = [car.as_dict() for car in all_cars]

        tool_data.extend(all_cars)

        if len(all_cars) == 0:
            return "No cars found."
        return all_cars

@tool
async def get_cars_by_feature(
    make:  Annotated[Optional[str], "The make of the car"] = None,
    model: Annotated[Optional[str], "The model of the car"] = None,
    year:  Annotated[Optional[int],  "The year of the car"] = None,
    color: Annotated[Optional[str], "The color of the car"] = None
):
    """
    Retrieves cars from the database that match the given feature.

    If no feature is specified, returns all cars.

    If no cars are found with the specified feature, returns a string "No cars found with the specified feature."

    :return: A list of dictionaries or a string
    """
    
    if make:
        make = make.lower()
        stmt = select(Car).where(Car.make == make)
    if model:
        model = model.lower()
        stmt = select(Car).where(Car.model == model)
    if year:
        stmt = select(Car).where(Car.year == year)
    if color:
        color = color.lower()
        stmt = select(Car).where(Car.color == color)

    async for db in get_db():
        results = await db.execute(stmt)
        filtered_cars = results.scalars().all()

        filtered_cars = [car.as_dict() for car in filtered_cars]

        if len(filtered_cars) == 0:
            return "No cars found with the specified feature."
        return filtered_cars

@tool
async def get_car_by_lower_price(price: float):
    """
    Retrieves cars from the database that are below a certain price.

    If no cars are found below the specified price, returns a string "No cars found below the specified price."

    :return: A list of dictionaries or a string
    """
    async for db in get_db():
        stmt = select(Car).where(Car.base_price < price)
        results = await db.execute(stmt)
        filtered_cars = results.scalars().all()

        filtered_cars = [car.as_dict() for car in filtered_cars]

        if len(filtered_cars) == 0:
            return "No cars found below the specified price."
        return filtered_cars

@tool
async def get_car_by_higher_price(price: float):
    """
    Retrieves cars from the database that are above a certain price.

    If no cars are found above the specified price, returns a string "No cars found above the specified price."

    :return: A list of dictionaries or a string
    """
    async for db in get_db():
        stmt = select(Car).where(Car.base_price > price)
        results = await db.execute(stmt)
        filtered_cars = results.scalars().all()

        filtered_cars = [car.as_dict() for car in filtered_cars]

        if len(filtered_cars) == 0:
            return "No cars found above the specified price."
        return filtered_cars

@tool
async def get_car_by_price_range(min_price: float, max_price: float):
    """
    Retrieves cars from the database that are within a certain price range.

    If no cars are found within the specified price range, returns a string "No cars found within the specified price range."

    :return: A list of dictionaries or a string
    """
    async for db in get_db():
        stmt = select(Car).where(Car.base_price.between(min_price, max_price))
        results = await db.execute(stmt)
        filtered_cars = results.scalars().all()

        filtered_cars = [car.as_dict() for car in filtered_cars]

        if len(filtered_cars) == 0:
            return "No cars found within the specified price range."
        return filtered_cars


@tool
async def get_car_by_year_range(start_year: int, end_year: int):
    """
    Retrieves cars from the database that are within a certain year range.

    If no cars are found within the specified year range, returns a string "No cars found within the specified year range."

    :return: A list of dictionaries or a string
    """
    async for db in get_db():
        stmt = select(Car).where(Car.year.between(start_year, end_year))
        results = await db.execute(stmt)
        filtered_cars = results.scalars().all()

        filtered_cars = [car.as_dict() for car in filtered_cars]

        if len(filtered_cars) == 0:
            return "No cars found within the specified year range."
        return filtered_cars

@tool
async def negotiate_price(car_id: int, user_offer: float):
    """
    Performs a price negotiation for a car.

    :param car_id: The id of the car to negotiate the price for.
    :param user_offer: The user's offer.

    :return: A dictionary with the status of the negotiation and the next price to offer.

    The status can be one of the following:

    - accepted: The user's offer was accepted.
    - rejected: The user's offer was rejected.
    - final_offer: The user's offer was rejected and this is the final price to offer.
    - counter_offer: The user's offer was rejected and a counter-offer is being made.

    If the status is counter_offer, the returned dictionary will contain the key "counter_price"
    with the value of the counter-offer.

    If the status is rejected, the returned dictionary will contain the key "reason" with a message
    explaining why the offer was rejected, and the key "min_acceptable" with the minimum price that
    the seller is willing to accept.

    If the status is final_offer, the returned dictionary will contain the key "price" with the value
    of the final price to offer.

    If the status is accepted, the returned dictionary will contain the key "price" with the value of
    the accepted price.
    """
    print(f"Negotiating price for car_id: {car_id} with user_offer: {user_offer}")
    
    
    try:
        async for db in get_db():
            car = await db.get(Car, car_id)
            if not car:
                return "Car not found."

            if not car.negotiation_enabled:
                return "Negotiation disabled for this car."

            base_price = car.base_price
            min_price = car.min_price
            current_price = car.current_price or base_price
            flexibility = car.negotiation_flexibility

            # Accept if user offers enough
            if user_offer >= current_price:
                return f"Negotiate accepted at {user_offer}"

            # Reject if offer is too low
            if user_offer < min_price:
                return f"Negotiate rejected: Offer too low. Minimum acceptable price is {min_price}."

            # If at final price
            if current_price <= min_price:
                return f"Negotiate final offer: {min_price}."

            # Calculate new counter-offer
            remaining_room = current_price - min_price
            concession = remaining_room * flexibility
            counter_price = current_price - concession
            counter_price -= random.uniform(0, concession * 0.1)
            counter_price = round(counter_price, 2)
            counter_price = max(counter_price, min_price)

            # Update DB
            car.current_price = counter_price
            await db.commit()

            return f"Negotiate counter offer: {counter_price}."
    except Exception as e:
        print(f"Error negotiating price: {str(e)}")
        return {"error": str(e)}
