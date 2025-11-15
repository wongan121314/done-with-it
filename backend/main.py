from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_connection
from werkzeug.security import generate_password_hash, check_password_hash
from math import ceil

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

    cursor.execute("SELECT id FROM sellers WHERE email=%s", (email,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return jsonify({"message": "Email already exists"}), 400

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
    # Get query parameters
    category = request.args.get("category", "All")
    sort_order = request.args.get("sort", "asc")  # 'asc' or 'desc'
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 10))
    search = request.args.get("search", "").strip()

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # Build base query
    query = "SELECT * FROM items WHERE 1=1"
    params = []

    # Filter by category
    if category != "All":
        query += " AND category = %s"
        params.append(category)

    # Filter by search title
    if search:
        query += " AND title LIKE %s"
        params.append(f"%{search}%")

    # Sorting
    query += " ORDER BY price " + ("ASC" if sort_order == "asc" else "DESC")

    # Pagination
    offset = (page - 1) * per_page
    query += " LIMIT %s OFFSET %s"
    params.extend([per_page, offset])

    cursor.execute(query, params)
    items = cursor.fetchall()

    # Total count for pagination
    count_query = "SELECT COUNT(*) as total FROM items WHERE 1=1"
    count_params = []

    if category != "All":
        count_query += " AND category = %s"
        count_params.append(category)

    if search:
        count_query += " AND title LIKE %s"
        count_params.append(f"%{search}%")

    cursor.execute(count_query, count_params)
    total = cursor.fetchone()["total"]

    cursor.close()
    conn.close()

    return jsonify({
        "items": items,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": ceil(total / per_page)
    })


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
