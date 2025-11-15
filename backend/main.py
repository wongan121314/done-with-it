# backend/main.py
import os
import time
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from math import ceil
from db import get_connection

app = Flask(__name__)
CORS(app)

# ---------------- UPLOADS ----------------
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory("uploads", filename)


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
    category = request.args.get("category", "All")
    sort_order = request.args.get("sort", "asc")
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 10))
    search = request.args.get("search", "").strip()

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # Build query
    query = "SELECT * FROM items WHERE 1=1"
    params = []

    if category != "All":
        query += " AND category = %s"
        params.append(category)

    if search:
        query += " AND title LIKE %s"
        params.append(f"%{search}%")

    query += " ORDER BY price " + ("ASC" if sort_order == "asc" else "DESC")

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
    seller_id = request.form.get("seller_id")
    title = request.form.get("title")
    price = request.form.get("price")
    status = request.form.get("status")
    category = request.form.get("category")

    # Handle image
    image = request.files.get("image")
    filename = None
    if image:
        ext = os.path.splitext(image.filename)[1]
        filename = f"{seller_id}_{int(time.time())}{ext}"
        image.save(os.path.join(UPLOAD_FOLDER, filename))

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        INSERT INTO items (title, price, status, category, image, seller_id)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (title, price, status, category, filename, seller_id))
    conn.commit()

    cursor.execute("SELECT * FROM items WHERE id = LAST_INSERT_ID()")
    new_item = cursor.fetchone()

    cursor.close()
    conn.close()
    return jsonify(new_item), 201


@app.route("/api/items/<int:item_id>", methods=["PUT"])
def update_item(item_id):
    # Use multipart/form-data if updating image
    seller_id = request.form.get("seller_id")
    title = request.form.get("title")
    price = request.form.get("price")
    status = request.form.get("status")
    category = request.form.get("category")

    # Handle image
    image = request.files.get("image")
    filename = None
    if image:
        ext = os.path.splitext(image.filename)[1]
        filename = f"{seller_id}_{int(time.time())}{ext}"
        image.save(os.path.join(UPLOAD_FOLDER, filename))

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # Only update image if provided
    if filename:
        cursor.execute("""
            UPDATE items
            SET title=%s, price=%s, status=%s, category=%s, image=%s
            WHERE id=%s
        """, (title, price, status, category, filename, item_id))
    else:
        cursor.execute("""
            UPDATE items
            SET title=%s, price=%s, status=%s, category=%s
            WHERE id=%s
        """, (title, price, status, category, item_id))

    conn.commit()
    cursor.execute("SELECT * FROM items WHERE id=%s", (item_id,))
    updated_item = cursor.fetchone()

    cursor.close()
    conn.close()
    return jsonify({"message": "Item updated", "item": updated_item})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
