import random

def negotiate_price(base_price: float, min_price: float, user_offer: float, current_price: float = None, flexibility: float = 0.3):
    """
    Advanced car price negotiation logic without round_num.
    
    :param base_price: Seller's starting price.
    :param min_price: Seller's lowest acceptable price.
    :param user_offer: Buyer's current offer.
    :param current_price: Seller's last counter-offer (if any).
    :param flexibility: Max % of remaining negotiation room conceded per step.
    :return: Dict with status and counter-offer (if any).
    """
    
    # If no current price, start at base_price
    if current_price is None:
        current_price = base_price
    
    # If buyer offers enough, accept
    if user_offer >= current_price:
        return {"status": "accepted", "price": user_offer}
    
    # If offer is too low, reject
    if user_offer < min_price:
        return {"status": "rejected", "reason": "Offer too low", "min_acceptable": min_price}
    
    # If current price is already at min_price, it's the final offer
    if current_price <= min_price:
        return {"status": "final_offer", "price": min_price}
    
    # Calculate new counter-offer
    remaining_room = current_price - min_price
    concession = remaining_room * flexibility
    counter_price = current_price - concession
    
    # Add randomness for realism
    counter_price -= random.uniform(0, concession * 0.1)
    counter_price = round(counter_price, 2)
    
    # Ensure price does not go below min_price
    counter_price = max(counter_price, min_price)
    
    return {
        "status": "counter_offer",
        "counter_price": counter_price
    }

# Example usage
print(negotiate_price(base_price=50000, min_price=42000, user_offer=45000))
print(negotiate_price(base_price=50000, min_price=42000, user_offer=46000, current_price=48000))
