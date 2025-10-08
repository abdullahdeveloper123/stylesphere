from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_cors import CORS
import sqlite3
from datetime import datetime, timezone
import os
import uuid
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True

# Initialize extensions
bcrypt = Bcrypt(app)
Session(app)
CORS(app, origins=os.environ.get('CORS_ORIGINS', '*').split(','), supports_credentials=True)

# SQLite connection (file-based)
DB_PATH = os.environ.get('SQLITE_PATH', str(ROOT_DIR / 'data.db'))

def get_db_connection():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

conn = get_db_connection()

# Convenience: ensure tables exist
def create_tables():
    cur = conn.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE,
            email TEXT UNIQUE,
            password TEXT,
            full_name TEXT,
            created_at TEXT
        )
    ''')

    cur.execute('''
        CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            name TEXT UNIQUE,
            image_url TEXT,
            created_at TEXT
        )
    ''')

    cur.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT UNIQUE,
            description TEXT,
            price REAL,
            category_id TEXT,
            category_name TEXT,
            image_url TEXT,
            stock INTEGER,
            created_at TEXT
        )
    ''')

    cur.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            product_id TEXT,
            product_name TEXT,
            product_image TEXT,
            quantity INTEGER,
            size TEXT,
            unit_price REAL,
            total_price REAL,
            customer_name TEXT,
            customer_email TEXT,
            customer_phone TEXT,
            shipping_street TEXT,
            shipping_city TEXT,
            shipping_state TEXT,
            shipping_zip_code TEXT,
            shipping_country TEXT,
            payment_method TEXT,
            order_status TEXT,
            payment_status TEXT,
            estimated_delivery TEXT,
            created_at TEXT
        )
    ''')
    conn.commit()

create_tables()

# Initialize sample data
def init_sample_data():
    # Check if categories already exist
    cur = conn.cursor()
    cur.execute('SELECT COUNT(*) as c FROM categories')
    if cur.fetchone()['c'] == 0:
        categories = [
            {
                "id": str(uuid.uuid4()),
                "name": "Men's Wear",
                "image_url": "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxtZW4lMjBmYXNoaW9ufGVufDB8fHx8MTc1OTgzOTI2M3ww&ixlib=rb-4.1.0&q=85",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Women's Wear",
                "image_url": "https://images.unsplash.com/photo-1617922001439-4a2e6562f328?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGZhc2hpb258ZW58MHx8fHwxNzU5ODcwOTg0fDA&ixlib=rb-4.1.0&q=85",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Children's Wear",
                "image_url": "https://images.unsplash.com/photo-1622218286192-95f6a20083c7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxraWRzJTIwY2xvdGhpbmd8ZW58MHx8fHwxNzU5OTE5MjI5fDA&ixlib=rb-4.1.0&q=85",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Underwear",
                "image_url": "https://images.unsplash.com/photo-1568441556126-f36ae0900180?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHw0fHx1bmRlcndlYXJ8ZW58MHx8fHwxNzU5OTE5MjMzfDA&ixlib=rb-4.1.0&q=85",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        for c in categories:
            cur.execute('INSERT INTO categories (id, name, image_url, created_at) VALUES (?, ?, ?, ?)',
                        (c['id'], c['name'], c['image_url'], c['created_at']))
        conn.commit()

    # Check if products already exist
    cur.execute('SELECT COUNT(*) as c FROM products')
    if cur.fetchone()['c'] == 0:
        cur.execute('SELECT id, name FROM categories')
        categories_list = [dict(row) for row in cur.fetchall()]
        products = [
            {
                "id": str(uuid.uuid4()),
                "name": "Classic Cotton T-Shirt",
                "description": "Premium quality cotton t-shirt in multiple colors",
                "price": 29.99,
                "category_id": categories_list[0]["id"],
                "category_name": "Men's Wear",
                "image_url": "https://images.unsplash.com/photo-1562157873-818bc0726f68?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxjbG90aGluZ3xlbnwwfHx8fDE3NTk4NTQyMTN8MA&ixlib=rb-4.1.0&q=85",
                "stock": 100,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Elegant Women's Dress",
                "description": "Beautiful and comfortable dress for all occasions",
                "price": 89.99,
                "category_id": categories_list[1]["id"],
                "category_name": "Women's Wear",
                "image_url": "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxjbG90aGluZ3xlbnwwfHx8fDE3NTk4NTQyMTN8MA&ixlib=rb-4.1.0&q=85",
                "stock": 75,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Trendy Yellow Track Suit",
                "description": "Comfortable and stylish track suit perfect for casual wear",
                "price": 79.99,
                "category_id": categories_list[1]["id"],
                "category_name": "Women's Wear",
                "image_url": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwxfHxmYXNoaW9ufGVufDB8fHx8MTc1OTkxOTI3MHww&ixlib=rb-4.1.0&q=85",
                "stock": 50,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Kids Colorful Collection",
                "description": "Vibrant and comfortable children's clothing collection",
                "price": 39.99,
                "category_id": categories_list[2]["id"],
                "category_name": "Children's Wear",
                "image_url": "https://images.unsplash.com/photo-1622218286192-95f6a20083c7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxraWRzJTIwY2xvdGhpbmd8ZW58MHx8fHwxNzU5OTE5MjI5fDA&ixlib=rb-4.1.0&q=85",
                "stock": 60,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Professional Shirts Collection",
                "description": "High-quality professional shirts for office and formal wear",
                "price": 59.99,
                "category_id": categories_list[0]["id"],
                "category_name": "Men's Wear",
                "image_url": "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjbG90aGluZ3xlbnwwfHx8fDE3NTk4NTQyMTN8MA&ixlib=rb-4.1.0&q=85",
                "stock": 80,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Stylish Outerwear",
                "description": "Trendy coats and jackets for all seasons",
                "price": 149.99,
                "category_id": categories_list[1]["id"],
                "category_name": "Women's Wear",
                "image_url": "https://images.unsplash.com/photo-1571513800374-df1bbe650e56?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwzfHxmYXNoaW9ufGVufDB8fHx8MTc1OTkxOTI3MHww&ixlib=rb-4.1.0&q=85",
                "stock": 40,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        for p in products:
            cur.execute('''INSERT INTO products (id, name, description, price, category_id, category_name, image_url, stock, created_at)
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                        (p['id'], p['name'], p['description'], p['price'], p['category_id'], p['category_name'], p['image_url'], p['stock'], p['created_at']))
        conn.commit()

    # Add additional sample products (up to 20) if not present
    # Ensure we have the categories_list available
    cur.execute('SELECT id, name FROM categories')
    categories_list = [dict(row) for row in cur.fetchall()]
    cur.execute('SELECT name FROM products')
    existing_names = set([row['name'] for row in cur.fetchall()])
    extra_products = [
        {
            "id": str(uuid.uuid4()),
            "name": "Slim Fit Denim Jeans",
            "description": "Comfort stretch slim-fit denim with classic five-pocket styling.",
            "price": 49.99,
            "category_id": categories_list[0]["id"],
            "category_name": "Men's Wear",
            "image_url": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=85",
            "stock": 120,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Casual Linen Shirt",
            "description": "Breathable linen shirt perfect for warm weather and a relaxed look.",
            "price": 39.99,
            "category_id": categories_list[0]["id"],
            "category_name": "Men's Wear",
            "image_url": "https://images.unsplash.com/photo-1520975911473-0f9690f8f3a9?auto=format&fit=crop&w=800&q=85",
            "stock": 80,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Boho Floral Maxi Dress",
            "description": "Flowy maxi dress with bohemian floral prints and adjustable straps.",
            "price": 69.99,
            "category_id": categories_list[1]["id"],
            "category_name": "Women's Wear",
            "image_url": "https://images.unsplash.com/photo-1520975911478-3b0a0f6b7f8f?auto=format&fit=crop&w=800&q=85",
            "stock": 60,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "High Waisted Tailored Trousers",
            "description": "Elegant high-waisted trousers with a tapered leg for a polished look.",
            "price": 69.99,
            "category_id": categories_list[1]["id"],
            "category_name": "Women's Wear",
            "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=85",
            "stock": 45,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Kids Graphic Tee Pack",
            "description": "Soft cotton tee pack featuring playful graphic prints for kids.",
            "price": 29.99,
            "category_id": categories_list[2]["id"],
            "category_name": "Children's Wear",
            "image_url": "https://images.unsplash.com/photo-1541807084-5c52b6b35a2c?auto=format&fit=crop&w=800&q=85",
            "stock": 140,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Comfy Cotton Pajama Set",
            "description": "Lightweight cotton pajama set with elastic waist and soft finish.",
            "price": 34.99,
            "category_id": categories_list[3]["id"],
            "category_name": "Underwear",
            "image_url": "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=800&q=85",
            "stock": 200,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Men's Classic Oxford Shirt",
            "description": "A classic oxford shirt that pairs well with formal and casual outfits.",
            "price": 44.99,
            "category_id": categories_list[0]["id"],
            "category_name": "Men's Wear",
            "image_url": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
            "stock": 90,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Ribbed Knit Sweater",
            "description": "Cozy ribbed sweater with a soft touch knit — perfect for layering.",
            "price": 59.99,
            "category_id": categories_list[1]["id"],
            "category_name": "Women's Wear",
            "image_url": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80",
            "stock": 70,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Outdoor Performance Jacket",
            "description": "Water-resistant lightweight jacket with breathable fabric and zip pockets.",
            "price": 119.99,
            "category_id": categories_list[0]["id"],
            "category_name": "Men's Wear",
            "image_url": "https://images.unsplash.com/photo-1520975911468-1f0a7f4a2f2e?auto=format&fit=crop&w=900&q=80",
            "stock": 35,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Pleated Midi Skirt",
            "description": "Elegant pleated midi skirt with a flattering silhouette.",
            "price": 54.99,
            "category_id": categories_list[1]["id"],
            "category_name": "Women's Wear",
            "image_url": "https://images.unsplash.com/photo-1520975911473-0f9690f8f3a9?auto=format&fit=crop&w=900&q=80",
            "stock": 50,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Athletic Running Shorts",
            "description": "Lightweight running shorts with moisture-wicking fabric and pockets.",
            "price": 24.99,
            "category_id": categories_list[0]["id"],
            "category_name": "Men's Wear",
            "image_url": "https://images.unsplash.com/photo-1520975911478-3b0a0f6b7f8f?auto=format&fit=crop&w=900&q=80",
            "stock": 110,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Soft Terry Hoodie",
            "description": "Super soft terry hoodie with kangaroo pocket and relaxed fit.",
            "price": 49.99,
            "category_id": categories_list[1]["id"],
            "category_name": "Women's Wear",
            "image_url": "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80",
            "stock": 95,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Kids Denim Jacket",
            "description": "Durable denim jacket for kids with button front and comfy lining.",
            "price": 44.99,
            "category_id": categories_list[2]["id"],
            "category_name": "Children's Wear",
            "image_url": "https://images.unsplash.com/photo-1520975911468-1f0a7f4a2f2e?auto=format&fit=crop&w=900&q=80",
            "stock": 65,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Classic Cotton Boxer Briefs (3-pack)",
            "description": "Breathable cotton boxer briefs with supportive fit — 3-pack.",
            "price": 24.99,
            "category_id": categories_list[3]["id"],
            "category_name": "Underwear",
            "image_url": "https://images.unsplash.com/photo-1562887003-7f9c6d9b0b1f?auto=format&fit=crop&w=800&q=85",
            "stock": 300,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Everyday Sports Bra",
            "description": "Light support sports bra with seamless construction and breathable fabric.",
            "price": 29.99,
            "category_id": categories_list[3]["id"],
            "category_name": "Underwear",
            "image_url": "https://images.unsplash.com/photo-1551854838-0c6f0d3c7f36?auto=format&fit=crop&w=800&q=85",
            "stock": 160,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Leather Belt with Silver Buckle",
            "description": "Full-grain leather belt with a brushed silver buckle for everyday wear.",
            "price": 34.99,
            "category_id": categories_list[0]["id"],
            "category_name": "Men's Wear",
            "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=85",
            "stock": 150,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Satin Slip Camisole",
            "description": "Luxurious satin camisole with delicate straps — perfect as a layering piece.",
            "price": 27.99,
            "category_id": categories_list[1]["id"],
            "category_name": "Women's Wear",
            "image_url": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
            "stock": 85,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]

    to_insert = []
    for p in extra_products:
        if p['name'] not in existing_names:
            to_insert.append(p)

    for p in to_insert:
        cur.execute('''INSERT INTO products (id, name, description, price, category_id, category_name, image_url, stock, created_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                    (p['id'], p['name'], p['description'], p['price'], p['category_id'], p['category_name'], p['image_url'], p['stock'], p['created_at']))
    if to_insert:
        conn.commit()

# Routes

@app.route('/api/', methods=['GET'])
@app.route('/api', methods=['GET'])
def root():
    return jsonify({"message": "StyleSphere Fashion API"})

# Authentication Routes
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate input
        if not data.get('username') or not data.get('email') or not data.get('password'):
            return jsonify({"error": "Username, email, and password are required"}), 400
        
        # Check if user already exists (by email or username)
        cur = conn.cursor()
        cur.execute('SELECT id FROM users WHERE email = ?', (data['email'],))
        if cur.fetchone():
            return jsonify({"error": "User with this email already exists"}), 400

        cur.execute('SELECT id FROM users WHERE username = ?', (data['username'],))
        if cur.fetchone():
            return jsonify({"error": "Username already taken"}), 400

        # Hash password and create user
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

        user = {
            "id": str(uuid.uuid4()),
            "username": data['username'],
            "email": data['email'],
            "password": hashed_password,
            "full_name": data.get('full_name', ''),
            "created_at": datetime.now(timezone.utc).isoformat()
        }

        cur.execute('INSERT INTO users (id, username, email, password, full_name, created_at) VALUES (?, ?, ?, ?, ?, ?)',
                    (user['id'], user['username'], user['email'], user['password'], user['full_name'], user['created_at']))
        conn.commit()
        
        # Create session
        session['user_id'] = user['id']
        session['username'] = user['username']
        
        return jsonify({
            "message": "Registration successful",
            "user": {
                "id": user['id'],
                "username": user['username'],
                "email": user['email'],
                "full_name": user['full_name']
            }
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({"error": "Email and password are required"}), 400
        
        # Find user
        cur = conn.cursor()
        cur.execute('SELECT * FROM users WHERE email = ?', (data['email'],))
        row = cur.fetchone()
        if not row or not bcrypt.check_password_hash(row['password'], data['password']):
            return jsonify({"error": "Invalid email or password"}), 401

        # Create session
        session['user_id'] = row['id']
        session['username'] = row['username']

        return jsonify({
            "message": "Login successful",
            "user": {
                "id": row['id'],
                "username": row['username'],
                "email": row['email'],
                "full_name": row['full_name']
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logout successful"}), 200

@app.route('/api/profile', methods=['GET'])
def get_profile():
    if 'user_id' not in session:
        return jsonify({"error": "Not authenticated"}), 401
    cur = conn.cursor()
    cur.execute('SELECT id, username, email, full_name, created_at FROM users WHERE id = ?', (session['user_id'],))
    row = cur.fetchone()
    if not row:
        return jsonify({"error": "User not found"}), 404

    user = dict(row)
    return jsonify({"user": user}), 200

@app.route('/api/profile', methods=['PUT'])
def update_profile():
    if 'user_id' not in session:
        return jsonify({"error": "Not authenticated"}), 401
    
    try:
        data = request.get_json()
        
        # Prepare update data
        update_data = {}
        if 'full_name' in data:
            update_data['full_name'] = data['full_name']
        if 'email' in data:
            # Check if email already exists for another user
            cur = conn.cursor()
            cur.execute('SELECT id FROM users WHERE email = ? AND id != ?', (data['email'], session['user_id']))
            if cur.fetchone():
                return jsonify({"error": "Email already in use"}), 400
            update_data['email'] = data['email']
        
        if update_data:
            set_clause = ', '.join([f"{k} = ?" for k in update_data.keys()])
            values = list(update_data.values())
            values.append(session['user_id'])
            cur.execute(f'UPDATE users SET {set_clause} WHERE id = ?', values)
            conn.commit()

        cur.execute('SELECT id, username, email, full_name, created_at FROM users WHERE id = ?', (session['user_id'],))
        row = cur.fetchone()
        user = dict(row) if row else None
        return jsonify({"user": user}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Product Routes
@app.route('/api/categories', methods=['GET'])
def get_categories():
    try:
        cur = conn.cursor()
        cur.execute('SELECT id, name, image_url, created_at FROM categories')
        categories = [dict(r) for r in cur.fetchall()]
        return jsonify({"categories": categories}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        category_id = request.args.get('category_id')
        
        query = {}
        if category_id:
            query['category_id'] = category_id
        cur = conn.cursor()
        if category_id:
            cur.execute('SELECT id, name, description, price, category_id, category_name, image_url, stock, created_at FROM products WHERE category_id = ?', (category_id,))
        else:
            cur.execute('SELECT id, name, description, price, category_id, category_name, image_url, stock, created_at FROM products')
        products = [dict(r) for r in cur.fetchall()]
        return jsonify({"products": products}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id):
    try:
        cur = conn.cursor()
        cur.execute('SELECT id, name, description, price, category_id, category_name, image_url, stock, created_at FROM products WHERE id = ?', (product_id,))
        row = cur.fetchone()
        if not row:
            return jsonify({"error": "Product not found"}), 404
        product = dict(row)
        return jsonify({"product": product}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/check-auth', methods=['GET'])
def check_auth():
    if 'user_id' in session:
        cur = conn.cursor()
        cur.execute('SELECT id, username, email, full_name, created_at FROM users WHERE id = ?', (session['user_id'],))
        row = cur.fetchone()
        user = dict(row) if row else None
        return jsonify({"authenticated": True, "user": user}), 200
    else:
        return jsonify({"authenticated": False}), 200

# Order Routes
@app.route('/api/orders', methods=['POST'])
def create_order():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['product_id', 'quantity', 'size', 'customer_info', 'shipping_address']
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"{field} is required"}), 400
        
        # Get product details
        cur = conn.cursor()
        cur.execute('SELECT id, name, image_url, price, stock FROM products WHERE id = ?', (data['product_id'],))
        prod = cur.fetchone()
        if not prod:
            return jsonify({"error": "Product not found"}), 404

        if prod['stock'] < int(data['quantity']):
            return jsonify({"error": "Insufficient stock"}), 400

        unit_price = prod['price']
        total_price = unit_price * int(data['quantity'])

        order_id = str(uuid.uuid4())
        created_at = datetime.now(timezone.utc).isoformat()

        cur.execute('''INSERT INTO orders (id, user_id, product_id, product_name, product_image, quantity, size, unit_price, total_price,
                       customer_name, customer_email, customer_phone,
                       shipping_street, shipping_city, shipping_state, shipping_zip_code, shipping_country,
                       payment_method, order_status, payment_status, estimated_delivery, created_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''', (
            order_id,
            session.get('user_id'),
            data['product_id'],
            prod['name'],
            prod['image_url'],
            int(data['quantity']),
            data['size'],
            unit_price,
            total_price,
            data['customer_info']['name'],
            data['customer_info']['email'],
            data['customer_info']['phone'],
            data['shipping_address']['street'],
            data['shipping_address']['city'],
            data['shipping_address']['state'],
            data['shipping_address']['zip_code'],
            data['shipping_address'].get('country', 'India'),
            "Cash on Delivery",
            "confirmed",
            "pending",
            "5-7 business days",
            created_at
        ))

        # Update product stock
        cur.execute('UPDATE products SET stock = stock - ? WHERE id = ?', (int(data['quantity']), data['product_id']))
        conn.commit()

        order = {
            "id": order_id,
            "user_id": session.get('user_id'),
            "product_id": data['product_id'],
            "product_name": prod['name'],
            "product_image": prod['image_url'],
            "quantity": int(data['quantity']),
            "size": data['size'],
            "unit_price": unit_price,
            "total_price": total_price,
            "customer_info": {
                "name": data['customer_info']['name'],
                "email": data['customer_info']['email'],
                "phone": data['customer_info']['phone']
            },
            "shipping_address": {
                "street": data['shipping_address']['street'],
                "city": data['shipping_address']['city'],
                "state": data['shipping_address']['state'],
                "zip_code": data['shipping_address']['zip_code'],
                "country": data['shipping_address'].get('country', 'India')
            },
            "payment_method": "Cash on Delivery",
            "order_status": "confirmed",
            "payment_status": "pending",
            "estimated_delivery": "5-7 business days",
            "created_at": created_at
        }

        return jsonify({
            "message": "Order created successfully",
            "order": order
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/orders', methods=['GET'])
def get_orders():
    try:
        # Get user's orders (if authenticated) or all orders (for admin)
        cur = conn.cursor()
        if 'user_id' in session:
            cur.execute('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', (session['user_id'],))
        else:
            cur.execute('SELECT * FROM orders ORDER BY created_at DESC')
        rows = cur.fetchall()
        orders = []
        for r in rows:
            orders.append({
                key: r[key] for key in r.keys()
            })
        return jsonify({"orders": orders}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/orders/<order_id>', methods=['GET'])
def get_order(order_id):
    try:
        cur = conn.cursor()
        cur.execute('SELECT * FROM orders WHERE id = ?', (order_id,))
        row = cur.fetchone()
        if not row:
            return jsonify({"error": "Order not found"}), 404

        if 'user_id' in session and row['user_id'] != session['user_id']:
            return jsonify({"error": "Access denied"}), 403

        order = {k: row[k] for k in row.keys()}
        return jsonify({"order": order}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Initialize sample data on startup
with app.app_context():
    init_sample_data()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001, debug=True)