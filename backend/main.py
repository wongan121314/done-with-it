# backend/main.py
import os
import time
from math import ceil
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_connection  # your existing db helper (mysql-connector)

app = Flask(__name__)
CORS(app)

# ---------------- UPLOADS ----------------
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


# ---------------- SELLER ROUTES ----------------
@app.route("/api/register", methods=["POST"])
def register():
    data = request.json or {}
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone", "")
    location = data.get("location", "")
    address = data.get("address", "")

    if not (name and email and password):
        return jsonify({"message": "name, email and password are required"}), 400

    hashed_pw = generate_password_hash(password)

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id FROM sellers WHERE email=%s", (email,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return jsonify({"message": "Email already exists"}), 400

    cursor.execute(
        """
        INSERT INTO sellers (name, email, password, phone, location, address)
        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        (name, email, hashed_pw, phone, location, address)
    )
    conn.commit()

    # Return created seller (without password)
    cursor.execute("SELECT id, name, email, phone, location, address FROM sellers WHERE email=%s", (email,))
    seller = cursor.fetchone()

    cursor.close()
    conn.close()
    return jsonify(seller), 201


@app.route("/api/login", methods=["POST"])
def login():
    data = request.json or {}
    email = data.get("email")
    password = data.get("password")

    if not (email and password):
        return jsonify({"message": "email and password required"}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM sellers WHERE email=%s", (email,))
    seller = cursor.fetchone()
    if not seller:
        cursor.close()
        conn.close()
        return jsonify({"message": "User not found"}), 404

    if not check_password_hash(seller["password"], password):
        cursor.close()
        conn.close()
        return jsonify({"message": "Invalid credentials"}), 401

    # remove password before returning
    seller.pop("password", None)
    cursor.close()
    conn.close()
    return jsonify(seller), 200


# ---------------- ITEM ROUTES ----------------
@app.route("/api/items", methods=["GET"])
def get_items():
    # supports optional seller_id, category, sort, page, per_page, search
    category = request.args.get("category", "All")
    sort_order = request.args.get("sort", "asc")
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 10))
    search = request.args.get("search", "").strip()
    seller_id = request.args.get("seller_id")

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # select items joined with seller contact fields
    query = """
        SELECT items.*, sellers.name AS seller_name, sellers.email AS seller_email,
               sellers.phone AS seller_phone, sellers.location AS seller_location,
               sellers.address AS seller_address
        FROM items
        LEFT JOIN sellers ON items.seller_id = sellers.id
        WHERE 1=1
    """
    params = []

    if seller_id:
        query += " AND items.seller_id = %s"
        params.append(seller_id)

    if category != "All":
        query += " AND items.category = %s"
        params.append(category)

    if search:
        query += " AND items.title LIKE %s"
        params.append(f"%{search}%")

    query += " ORDER BY items.price " + ("ASC" if sort_order == "asc" else "DESC")

    offset = (page - 1) * per_page
    query += " LIMIT %s OFFSET %s"
    params.extend([per_page, offset])

    cursor.execute(query, params)
    items = cursor.fetchall()

    # attach seller fields into item keys for convenience
    for it in items:
        it["seller_name"] = it.get("seller_name")
        it["seller_email"] = it.get("seller_email")
        it["seller_phone"] = it.get("seller_phone")
        it["seller_location"] = it.get("seller_location")
        it["seller_address"] = it.get("seller_address")

    # total count
    count_query = "SELECT COUNT(*) as total FROM items WHERE 1=1"
    count_params = []
    if seller_id:
        count_query += " AND seller_id = %s"
        count_params.append(seller_id)
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
    # expects multipart/form-data for image
    seller_id = request.form.get("seller_id")
    title = request.form.get("title")
    price = request.form.get("price")
    status = request.form.get("status")
    category = request.form.get("category")
    contact = request.form.get("contact")  # optional seller contact from frontend
    email = request.form.get("email")
    address = request.form.get("address")
    location = request.form.get("location")

    image = request.files.get("image")
    filename = None
    if image:
        ext = os.path.splitext(image.filename)[1]
        filename = f"{seller_id}_{int(time.time())}{ext}"
        image.save(os.path.join(UPLOAD_FOLDER, filename))

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        INSERT INTO items (title, price, status, category, image, contact, email, address, seller_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (title, price, status, category, filename, contact, email, address, seller_id))
    conn.commit()

    cursor.execute("SELECT items.*, sellers.name AS seller_name, sellers.email AS seller_email, sellers.phone AS seller_phone, sellers.location AS seller_location, sellers.address AS seller_address FROM items LEFT JOIN sellers ON items.seller_id = sellers.id WHERE items.id = LAST_INSERT_ID()")
    new_item = cursor.fetchone()

    cursor.close()
    conn.close()
    return jsonify(new_item), 201


@app.route("/api/items/<int:item_id>", methods=["PUT"])
def update_item(item_id):
    # expects multipart/form-data if updating image
    seller_id = request.form.get("seller_id")
    title = request.form.get("title")
    price = request.form.get("price")
    status = request.form.get("status")
    category = request.form.get("category")
    contact = request.form.get("contact")
    email = request.form.get("email")
    address = request.form.get("address")
    location = request.form.get("location")

    image = request.files.get("image")
    filename = None
    if image:
        ext = os.path.splitext(image.filename)[1]
        filename = f"{seller_id}_{int(time.time())}{ext}"
        image.save(os.path.join(UPLOAD_FOLDER, filename))

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    if filename:
        cursor.execute("""
            UPDATE items
            SET title=%s, price=%s, status=%s, category=%s, image=%s, contact=%s, email=%s, address=%s
            WHERE id=%s
        """, (title, price, status, category, filename, contact, email, address, item_id))
    else:
        cursor.execute("""
            UPDATE items
            SET title=%s, price=%s, status=%s, category=%s, contact=%s, email=%s, address=%s
            WHERE id=%s
        """, (title, price, status, category, contact, email, address, item_id))

    conn.commit()
    cursor.execute("SELECT items.*, sellers.name AS seller_name, sellers.email AS seller_email, sellers.phone AS seller_phone, sellers.location AS seller_location, sellers.address AS seller_address FROM items LEFT JOIN sellers ON items.seller_id = sellers.id WHERE items.id = %s", (item_id,))
    updated_item = cursor.fetchone()

    cursor.close()
    conn.close()
    return jsonify({"message": "Item updated", "item": updated_item}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
