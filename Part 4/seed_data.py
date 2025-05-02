# seed_data.py
# Populate the Admin table with starter accounts.
# Run:  python seed_data.py

from app import app, db, Admin   # assumes your main Flask file is named app.py


def to_hex(text: str) -> str:
    """Match the JS toHex() function: concat each char code in hex form."""
    return ''.join(format(ord(ch), 'x') for ch in text)


def main() -> None:
    emails = [
        "RubiMadrid@enmu.edu",
        "curbina@enmu.edu",
        "NarrowPath20@enmu.edu",
        "AyhamAbbad@enmu.edu",
        "admin@enmu.edu",
        "admin1@enmu.edu",
    ]
    encoded_pw = to_hex("Temp2025!")

    with app.app_context():
        db.create_all()          # no harm if tables already exist
        for e in emails:
            if not Admin.query.get(e):              # skip duplicates
                db.session.add(Admin(email=e, password=encoded_pw))
        db.session.commit()
        print("Admin accounts seeded.")


if __name__ == "__main__":
    main()
