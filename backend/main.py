# backend/main.py
import os
import time
import json
from math import ceil
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_connection

app = Flask(__name__)
CORS(app)

# ---------------- UPLOAD FOLDER ----------------
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# ---------------- AUTH ROUTES ----------------
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

    cursor.execute("""
        INSERT INTO sellers (name, email, password, phone, location, address)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (name, email, hashed_pw, phone, location, address))
    conn.commit()

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

    if not seller or not check_password_hash(seller["password"], password):
        cursor.close()
        conn.close()
        return jsonify({"message": "Invalid credentials"}), 400

    seller.pop("password", None)
    cursor.close()
    conn.close()
    return jsonify(seller), 200

# ---------------- ITEMS ROUTES ----------------
@app.route("/api/items", methods=["GET"])
def get_items():
    category = request.args.get("category", "All")
    sort_order = request.args.get("sort", "asc")
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 10))
    search = request.args.get("search", "").strip()
    seller_id = request.args.get("seller_id")

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

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

    # JSON decode images list
    for it in items:
        try:
            it["images"] = json.loads(it.get("images") or "[]")
        except:
            it["images"] = []

    # total count
    count_query = "SELECT COUNT(*) as total FROM items WHERE 1=1"
    count_params = []

    if seller_id:
        count_query += " AND seller_id=%s"
        count_params.append(seller_id)
    if category != "All":
        count_query += " AND category=%s"
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
        "page": page,
        "per_page": per_page,
        "total": total,
        "total_pages": ceil(total / per_page)
    })


@app.route("/api/items", methods=["POST"])
def add_item():
    seller_id = request.form.get("seller_id")
    title = request.form.get("title")
    price = request.form.get("price")
    status = request.form.get("status")
    category = request.form.get("category")
    contact = request.form.get("contact")
    email = request.form.get("email")
    address = request.form.get("address")

    # MULTIPLE IMAGES (max 5)
    images = request.files.getlist("images")
    saved_filenames = []

    for img in images[:5]:
        ext = os.path.splitext(img.filename)[1]
        fname = f"{seller_id}_{int(time.time())}_{len(saved_filenames)}{ext}"
        img.save(os.path.join(UPLOAD_FOLDER, fname))
        saved_filenames.append(fname)

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        INSERT INTO items (title, price, status, category, images, contact, email, address, seller_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (title, price, status, category, json.dumps(saved_filenames),
          contact, email, address, seller_id))
    conn.commit()

    cursor.execute("SELECT * FROM items WHERE id = LAST_INSERT_ID()")
    item = cursor.fetchone()
    item["images"] = saved_filenames

    cursor.close()
    conn.close()
    return jsonify(item), 201


@app.route("/api/items/<int:item_id>", methods=["PUT"])
def update_item(item_id):
    seller_id = request.form.get("seller_id")
    title = request.form.get("title")
    price = request.form.get("price")
    status = request.form.get("status")
    category = request.form.get("category")
    contact = request.form.get("contact")
    email = request.form.get("email")
    address = request.form.get("address")

    # If new images uploaded → replace old list
    new_images = request.files.getlist("images")
    saved_files = []

    if new_images:
        for img in new_images[:5]:
            ext = os.path.splitext(img.filename)[1]
            fname = f"{seller_id}_{int(time.time())}_{len(saved_files)}{ext}"
            img.save(os.path.join(UPLOAD_FOLDER, fname))
            saved_files.append(fname)

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    if saved_files:
        cursor.execute("""
            UPDATE items SET title=%s, price=%s, status=%s, category=%s,
            images=%s, contact=%s, email=%s, address=%s
            WHERE id=%s
        """, (title, price, status, category, json.dumps(saved_files),
              contact, email, address, item_id))
    else:
        cursor.execute("""
            UPDATE items SET title=%s, price=%s, status=%s, category=%s,
            contact=%s, email=%s, address=%s
            WHERE id=%s
        """, (title, price, status, category,
              contact, email, address, item_id))

    conn.commit()
    cursor.execute("SELECT * FROM items WHERE id=%s", (item_id,))
    item = cursor.fetchone()

    try:
        item["images"] = json.loads(item["images"] or "[]")
    except:
        item["images"] = []

    cursor.close()
    conn.close()

    return jsonify(item), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
