from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ----------------------------------------------------

class StoreItems(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False)
    oz = db.Column(db.Integer, nullable=False)
    image = db.Column(db.String(), nullable=False)       

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
    result = list()
    for item in items:
        result.append({
            'id': item.id,
            'name': item.name,
            'price': item.price,
            'oz': item.oz,
            'image': item.image
        })
    return jsonify(result)


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)



#pythonanywhere test
@app.route("/test")
def test():
    return "<p>Testing if python anywhere works</p>"