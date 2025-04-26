from flask import Flask, jsonify, render_template
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
