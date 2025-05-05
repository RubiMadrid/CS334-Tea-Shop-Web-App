from flask import Flask, jsonify, render_template, request, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from flask_cors import CORS

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'cs334'

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'cs334team@gmail.com'
app.config['MAIL_PASSWORD'] = 'vpdnsvqqfsnzcgtp'
app.config['MAIL_DEFAULT_SENDER'] = 'cs334team@gmail.com'

CORS(app)

mail = Mail(app)
db = SQLAlchemy(app)

class StoreItems(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False)
    oz = db.Column(db.Integer, nullable=False)
    image = db.Column(db.String(), nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'oz': self.oz,
            'image': self.image
        }

class Admin(db.Model):
    email = db.Column(db.String, nullable=False, primary_key=True, unique=True)
    password = db.Column(db.String, nullable=False)

class StoreOrder(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customerName = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20))
    teaName = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    total = db.Column(db.Float, nullable=False)
    paymentMethod = db.Column(db.String(50))
    status = db.Column(db.String(20), default='Processing')
    email = db.Column(db.String(100), nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'customerName': self.customerName,
            'address': self.address,
            'phone': self.phone,
            'teaName': self.teaName,
            'quantity': self.quantity,
            'total': self.total,
            'paymentMethod': self.paymentMethod,
            'status': self.status,
            'email' : self.email
        }

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/cart')
def cart():
    return render_template('cart.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/about-us')
def about_us():
    return render_template('about-us.html')

@app.route('/check-out')
def check_out():
    return render_template('check-out.html')

@app.route('/confirmation')
def confirmation():
    return render_template('confirmation.html')

@app.route('/contact-us')
def contact_us():
    return render_template('contact-us.html')

@app.route('/items')
def items():
    return render_template('items-list.html')

@app.route('/item')
def item():
    return render_template('item2-details.html')

@app.route('/admin/items-manager')
def items_manager():
    return render_template('items-manager.html')

@app.route('/admin/orders-manager')
def orders_manager():
    return render_template('orders-manager.html')

# ---------- API Routes ----------

@app.route('/api/storeitems', methods=['GET'])
def get_store_items():
    items = StoreItems.query.all()
    return jsonify([item.serialize() for item in items])

@app.route('/api/storeitems/<int:itemID>', methods=['GET'])
def get_item_by_id(itemID):
    item = db.session.get(StoreItems, itemID)
    if item:
        return jsonify(item.serialize())
    return jsonify({'error': 'Item not found'}), 404

@app.route('/api/storeitems', methods=['POST'])
def add_store_item():
    data = request.get_json()
    new_item = StoreItems(
        name=data['name'],
        price=data['price'],
        oz=data['oz'],
        image=data['image']
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.serialize()), 201

@app.route('/api/storeitems/<int:itemID>', methods=['PUT'])
def update_store_item(itemID):
    item = db.session.get(StoreItems, itemID)
    if not item:
        return jsonify({'error': 'Item not found'}), 404
    data = request.get_json()
    item.name = data.get('name', item.name)
    item.price = data.get('price', item.price)
    item.oz = data.get('oz', item.oz)
    item.image = data.get('image', item.image)
    db.session.commit()
    return jsonify(item.serialize())

@app.route('/api/storeitems/<int:itemID>', methods=['DELETE'])
def delete_store_item(itemID):
    item = db.session.get(StoreItems, itemID)
    if not item:
        return jsonify({'error': 'Item not found'}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': f'Item {itemID} deleted'})

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    email = data.get('email')
    pwd_hex = data.get('password')
    admin = db.session.get(Admin, email)
    if not admin or admin.password != pwd_hex:
        return jsonify({'error': 'Invalid credentials'}), 401
    session['admin_email'] = admin.email
    return redirect(url_for('items_manager'))

@app.route('/api/admin/logout', methods=['POST'])
def admin_logout():
    session.pop('admin_email', None)
    return jsonify({'message': 'Logged out'}), 200

@app.route('/api/check-login')
def check_login():
    return jsonify({'logged_in': 'admin_email' in session})

@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.get_json()
    print("data recieved" + str(data))
    email = data.get('email')
    print("email recived:" + str(email))

    if not email:
        return jsonify({'error': 'Email is required'}), 400                

    order = StoreOrder(
        customerName=data.get('customerName'),
        address=data.get('address'),
        phone=data.get('phone'),
        teaName=data.get('teaName'),
        quantity=data.get('quantity'),
        total=data.get('total'),
        paymentMethod=data.get('paymentMethod'),
        status=data.get('status', 'Processing'),
        email=email
    )
    db.session.add(order)
    db.session.commit()
    try:
        msg = Message(
            "Tea Shop Order Receipt",
            recipients=[email]
        )
        msg.body = (
            f"Hello {order.customerName},\n\n"
            f"Thank you for your order!\n\n"
            f"Tea: {order.teaName}\n"
            f"Quantity: {order.quantity}\n"
            f"Total: ${order.total:.2f}\n"
            f"Payment Method: {order.paymentMethod}\n\n"
            "Your order is being processed.\n\n"
            "- The Tea Shop Team"
        )
        mail.send(msg)
    except Exception as e:
        app.logger.warning("Failed to send email: %s", e)

    return jsonify({'message': 'Order saved', 'order': order.serialize()}), 201

@app.route('/api/orders', methods=['GET'])
def send_orders():
    items = StoreOrder.query.all()
    return jsonify([item.serialize() for item in items])

@app.route('/api/orders/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    order = StoreOrder.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    db.session.delete(order)
    db.session.commit()
    return jsonify({'message': f'Order {order_id} deleted'}), 200

@app.route('/api/orders/<int:order_id>', methods=['PUT'])
def update_order_status(order_id):
    data = request.get_json()
    order = StoreOrder.query.get(order_id)

    if not order:
        return jsonify({'error': 'Order not found'}), 404

    new_status = data.get('status')
    if not new_status:
        return jsonify({'error': 'Missing status'}), 400

    order.status = new_status
    db.session.commit()

    return jsonify({'message': f'Status updated to {new_status}', 'order': order.serialize()}), 200


@app.route("/test")
def test():
    return "<p>Testing if python anywhere works</p>"

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
