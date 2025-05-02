from flask import Flask, jsonify, render_template, request, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'cs334'

db = SQLAlchemy(app)

# ----------------------------------------------------

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
    

# ----------------------------------------------------

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

# ----------------------------------------------------

@app.route('/api/storeitems', methods=['GET'])
def get_store_items():
    items = StoreItems.query.all()
    result = [item.serialize() for item in items]
    return jsonify(result)

@app.route('/api/storeitems/<int:itemID>', methods=['GET'])
def get_item_by_id(itemID):
    item = StoreItems.query.get(itemID)
    if item:
        return jsonify(item.serialize())
    else:
        return jsonify({'error': 'Item not found'}), 404
    
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data     = request.get_json()
    email    = data.get('email')
    pwd_hex  = data.get('password')            # already hex encoded on the client

    admin = Admin.query.get(email)             # primary key lookup
    if not admin or admin.password != pwd_hex:
        return jsonify({'error': 'Invalid credentials'}), 401

    session['admin_email'] = admin.email       # mark session as logged in
    return redirect(url_for('items_manager'))

@app.route('/api/check-login')
def check_login():
    if 'admin_email' in session:
        return jsonify({'logged_in': True})
    return jsonify({'logged_in': False})





if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)



#pythonanywhere test
@app.route("/test")
def test():
    return "<p>Testing if python anywhere works</p>"