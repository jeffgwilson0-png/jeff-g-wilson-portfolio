"""
CLI Utility to update the Admin login credentials (Email and Password)
Usage:
    python change_admin.py
    python change_admin.py --email mynewemail@example.com --password MyNewPassword123!
"""

import sys
import os
import argparse

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.auth.jwt import get_password_hash

def change_admin_credentials(email: str = None, password: str = None):
    db = SessionLocal()
    try:
        # Find existing superuser
        user = db.query(User).filter(User.is_superuser == True).first()
        if not user:
            # Fallback to first user
            user = db.query(User).first()

        if not user:
            print("[INFO] No admin user found in database. Creating a new admin user...")
            email = email or input("Enter new admin email: ").strip()
            password = password or input("Enter new admin password (min 8 chars): ").strip()
            if not email or not password:
                print("[ERROR] Email and password cannot be empty.")
                return False
            user = User(
                email=email,
                hashed_password=get_password_hash(password),
                is_active=True,
                is_superuser=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"[SUCCESS] Created superuser with email: {user.email}")
            return True

        print(f"[INFO] Current Admin Email: {user.email}")

        new_email = email
        new_password = password

        if not new_email and not new_password:
            prompt_email = input(f"Enter new admin email [Leave blank to keep '{user.email}']: ").strip()
            if prompt_email:
                new_email = prompt_email
            
            prompt_pw = input("Enter new admin password [Leave blank to keep current password]: ").strip()
            if prompt_pw:
                new_password = prompt_pw

        updated = False
        if new_email and new_email != user.email:
            user.email = new_email
            updated = True
            print(f"[OK] Updated admin email to: {new_email}")

        if new_password:
            if len(new_password) < 6:
                print("[ERROR] Password must be at least 6 characters.")
                return False
            user.hashed_password = get_password_hash(new_password)
            updated = True
            print("[OK] Updated admin password successfully.")

        if updated:
            db.commit()
            print("\n==========================================")
            print("  ADMIN CREDENTIALS UPDATED SUCCESSFULLY! ")
            print("==========================================")
            print(f"  Login Email:    {user.email}")
            print(f"  Login URL:      http://localhost:5173/admin/login")
            print("==========================================\n")
        else:
            print("[INFO] No changes were made.")

        return True
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Failed to update admin credentials: {e}")
        return False
    finally:
        db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Update portfolio admin login info")
    parser.add_argument("--email", help="New admin login email")
    parser.add_argument("--password", help="New admin login password")
    args = parser.parse_args()

    change_admin_credentials(args.email, args.password)
