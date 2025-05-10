import os
import shutil

# 1. Supprimer la base de données SQLite
db_path = 'db.sqlite3'
if os.path.exists(db_path):
    os.remove(db_path)
    print(f"[✓] Base de données supprimée : {db_path}")

# 2. Supprimer les fichiers de migration dans les apps (sauf __init__.py)
apps = ['authentification', 'gestion_produit']

for app in apps:
    migrations_path = os.path.join(app, 'migrations')
    if os.path.exists(migrations_path):
        for filename in os.listdir(migrations_path):
            file_path = os.path.join(migrations_path, filename)
            if filename != '__init__.py' and filename.endswith('.py'):
                os.remove(file_path)
            elif filename.endswith('.pyc'):
                os.remove(file_path)
        print(f"[✓] Migrations supprimées dans {app}/migrations/")

print("\n[→] Étape suivante : Recréer les migrations avec:")
print("    python manage.py makemigrations")
print("    python manage.py migrate")
print("\n[💡] Tu peux ensuite créer un superutilisateur avec:")
print("    python manage.py createsuperuser")
