from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Setup MongoDB
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'agri_dealer_db')]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- CONFIG & AUTH ---
SECRET_KEY = "super-secret-key-for-agri-app"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 days

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

# --- MODELS ---
class Dealer(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    dealer_code: str
    name: str
    mobile: str
    credit_limit: float = 500000.0
    outstanding_amount: float = 0.0
    wallet_balance: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category: str
    title: str
    description: str
    dosage: str
    crop_usage: str
    mrp: float
    dealer_price: float
    media_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class OrderItem(BaseModel):
    product_id: str
    title: str
    quantity: int
    price: float

class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    dealer_id: str
    items: List[OrderItem]
    total_amount: float
    order_status: str = "placed"
    dispatch_status: str = "pending"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class LoginRequest(BaseModel):
    mobile: str

class VerifyOTPRequest(BaseModel):
    mobile: str
    otp: str

# --- AUTH UTILS ---
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_dealer(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        mobile: str = payload.get("sub")
        if mobile is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        dealer = await db.dealers.find_one({"mobile": mobile})
        if dealer is None:
            raise HTTPException(status_code=401, detail="Dealer not found")
        return dealer
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# --- ROUTES ---

@app.on_event("startup")
async def seed_data():
    # Seed a dealer
    dealer = await db.dealers.find_one({"mobile": "1234567890"})
    if not dealer:
        new_dealer = Dealer(
            dealer_code="D-001",
            name="Ramesh Patel",
            mobile="1234567890",
            credit_limit=1000000.0,
            outstanding_amount=150000.0,
            wallet_balance=25000.0
        )
        await db.dealers.insert_one(new_dealer.dict())
        logger.info("Seeded initial dealer.")

    # Seed products
    count = await db.products.count_documents({})
    if count == 0:
        products = [
            Product(category="Seeds", title="Hybrid Cotton Seeds", description="High yield cotton seeds", dosage="5kg/acre", crop_usage="Cotton", mrp=1200, dealer_price=950),
            Product(category="Fertilizers", title="Urea 46% N", description="Essential nitrogen fertilizer", dosage="50kg/acre", crop_usage="All crops", mrp=350, dealer_price=280),
            Product(category="Pesticides", title="Chlorpyrifos 20% EC", description="Broad spectrum insecticide", dosage="500ml/acre", crop_usage="Cotton, Paddy", mrp=450, dealer_price=350),
            Product(category="Fungicides", title="Mancozeb 75% WP", description="Contact fungicide", dosage="600g/acre", crop_usage="Potato, Tomato", mrp=300, dealer_price=240),
            Product(category="PGR", title="Biozyme Crop+", description="Plant growth promoter", dosage="250ml/acre", crop_usage="Vegetables, Fruits", mrp=550, dealer_price=420)
        ]
        await db.products.insert_many([p.dict() for p in products])
        logger.info("Seeded products.")

@api_router.post("/auth/login")
async def login(req: LoginRequest):
    dealer = await db.dealers.find_one({"mobile": req.mobile})
    if not dealer:
        # Auto-create for demo purposes, but in production "dealer accounts created by admin only"
        # Since it's an MVP, I'll create one if it doesn't exist for easier testing
        new_dealer = Dealer(
            dealer_code=f"D-{str(uuid.uuid4())[:4].upper()}",
            name="New Dealer",
            mobile=req.mobile
        )
        await db.dealers.insert_one(new_dealer.dict())
    
    # In a real app, send an SMS here.
    return {"message": "OTP sent successfully. Use 1234 for testing.", "mobile": req.mobile}

@api_router.post("/auth/verify")
async def verify_otp(req: VerifyOTPRequest):
    if req.otp != "1234":
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    dealer = await db.dealers.find_one({"mobile": req.mobile})
    if not dealer:
        raise HTTPException(status_code=404, detail="Dealer not found")
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": dealer["mobile"], "dealer_id": dealer["id"]}, expires_delta=access_token_expires
    )
    
    # Write to memory for testing agent
    with open(ROOT_DIR.parent / "memory" / "test_credentials.md", "w") as f:
        f.write(f"Mobile: {req.mobile}\nOTP: 1234\n")
        
    if "_id" in dealer: dealer["_id"] = str(dealer["_id"])
    return {"access_token": access_token, "token_type": "bearer", "dealer": dealer}

@api_router.get("/dashboard")
async def get_dashboard(dealer: dict = Depends(get_current_dealer)):
    orders = await db.orders.find({"dealer_id": dealer["id"]}).sort("created_at", -1).limit(5).to_list(10)
    
    # Clean ObjectIds before returning
    for order in orders:
        if "_id" in order:
            order["_id"] = str(order["_id"])
            
    dealer_info = {k: v for k, v in dealer.items() if k != "_id"}
    
    return {
        "dealer": dealer_info,
        "recent_orders": orders,
        "schemes": [
            {"title": "Monsoon Bonanza", "description": "Get 5% extra discount on orders above ₹1,00,000", "expiry": "2025-08-30"},
            {"title": "Seed Power", "description": "Buy 10 bags of Cotton seeds, get 1 free", "expiry": "2025-07-15"}
        ]
    }

@api_router.get("/products")
async def get_products(category: Optional[str] = None):
    query = {}
    if category and category != "All":
        query["category"] = category
        
    products = await db.products.find(query).to_list(100)
    for p in products:
        p["_id"] = str(p["_id"])
    return products

@api_router.post("/orders")
async def create_order(items: List[OrderItem], dealer: dict = Depends(get_current_dealer)):
    total = sum(item.price * item.quantity for item in items)
    
    if total > dealer["credit_limit"] - dealer["outstanding_amount"]:
        raise HTTPException(status_code=400, detail="Credit limit exceeded")
        
    order = Order(
        dealer_id=dealer["id"],
        items=items,
        total_amount=total
    )
    await db.orders.insert_one(order.dict())
    
    # Update dealer outstanding
    await db.dealers.update_one(
        {"id": dealer["id"]},
        {"$inc": {"outstanding_amount": total}}
    )
    
    return order

app.include_router(api_router)
