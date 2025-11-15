from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_connection
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

# ---------------- SELLER ROUTES ----------------

@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    hashed_pw = generate_password_hash(password)

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # Check if email exists
    cursor.execute("SELECT id FROM sellers WHERE email=%s", (email,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return jsonify({"message": "Email already exists"}), 400

    # Insert seller
    cursor.execute(
        "INSERT INTO sellers (name, email, password) VALUES (%s, %s, %s)",
        (name, email, hashed_pw)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Seller registered successfully"}), 201


@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM sellers WHERE email=%s", (email,))
    seller = cursor.fetchone()
    cursor.close()
    conn.close()

    if not seller or not check_password_hash(seller["password"], password):
        return jsonify({"message": "Invalid credentials"}), 401

    return jsonify({"id": seller["id"], "name": seller["name"], "email": seller["email"]})


# ---------------- ITEM ROUTES ----------------

@app.route("/api/items", methods=["GET"])
def get_items():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM items")
    items = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(items)


@app.route("/api/items", methods=["POST"])
def add_item():
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO items (title, price, status, category, image, contact, email, address, seller_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        data.get("title"),
        data.get("price"),
        data.get("status"),
        data.get("category"),
        data.get("image"),
        data.get("contact"),
        data.get("email"),
        data.get("address"),
        data.get("seller_id")
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Item added"}), 201


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
