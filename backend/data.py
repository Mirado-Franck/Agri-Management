import os
import django
from django.utils import timezone
from datetime import timedelta
import random

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Importer les modèles
from gestion_produit.models import Categorie, Produit

def populate_db():
    # Vérifier si des catégories existent déjà, sinon les ajouter
    categories = [
        "Fruits",
        "Légumes",
        "Céréales",
        "Tubercules",
        "Légumineuses",
        "Herbes aromatiques",
        "Produits laitiers",
        "Viandes",
        "Autres"
    ]
    
    # Créer les catégories si elles n'existent pas
    for category_name in categories:
        categorie, created = Categorie.objects.get_or_create(nom=category_name)
        if created:
            print(f"Catégorie créée: {categorie.nom}")
        else:
            print(f"Catégorie déjà existante: {categorie.nom}")
    
    # Liste de produits agricoles à insérer
    produits = [
        {"nom_produit": "Pomme", "categorie": "Fruits", "unite": "kg", "prix_unitaire": 2.50, "seuil_alerte": 20},
        {"nom_produit": "Banane", "categorie": "Fruits", "unite": "kg", "prix_unitaire": 1.80, "seuil_alerte": 25},
        {"nom_produit": "Orange", "categorie": "Fruits", "unite": "kg", "prix_unitaire": 2.00, "seuil_alerte": 30},
        {"nom_produit": "Mangue", "categorie": "Fruits", "unite": "kg", "prix_unitaire": 3.00, "seuil_alerte": 15},
        {"nom_produit": "Avocat", "categorie": "Fruits", "unite": "kg", "prix_unitaire": 4.00, "seuil_alerte": 10},
        
        {"nom_produit": "Carotte", "categorie": "Légumes", "unite": "kg", "prix_unitaire": 1.20, "seuil_alerte": 50},
        {"nom_produit": "Tomate", "categorie": "Légumes", "unite": "kg", "prix_unitaire": 1.50, "seuil_alerte": 40},
        {"nom_produit": "Chou", "categorie": "Légumes", "unite": "kg", "prix_unitaire": 0.90, "seuil_alerte": 60},
        {"nom_produit": "Laitue", "categorie": "Légumes", "unite": "pièce", "prix_unitaire": 0.80, "seuil_alerte": 100},
        {"nom_produit": "Aubergine", "categorie": "Légumes", "unite": "kg", "prix_unitaire": 1.30, "seuil_alerte": 30},
        
        {"nom_produit": "Maïs", "categorie": "Céréales", "unite": "kg", "prix_unitaire": 0.80, "seuil_alerte": 70},
        {"nom_produit": "Riz", "categorie": "Céréales", "unite": "kg", "prix_unitaire": 1.10, "seuil_alerte": 50},
        {"nom_produit": "Blé", "categorie": "Céréales", "unite": "kg", "prix_unitaire": 0.75, "seuil_alerte": 100},
        {"nom_produit": "Avoine", "categorie": "Céréales", "unite": "kg", "prix_unitaire": 0.95, "seuil_alerte": 80},
        
        {"nom_produit": "Patate douce", "categorie": "Tubercules", "unite": "kg", "prix_unitaire": 1.20, "seuil_alerte": 50},
        {"nom_produit": "Yam", "categorie": "Tubercules", "unite": "kg", "prix_unitaire": 1.40, "seuil_alerte": 40},
        {"nom_produit": "Pommes de terre", "categorie": "Tubercules", "unite": "kg", "prix_unitaire": 0.90, "seuil_alerte": 60},
        
        {"nom_produit": "Haricot", "categorie": "Légumineuses", "unite": "kg", "prix_unitaire": 1.50, "seuil_alerte": 30},
        {"nom_produit": "Pois chiches", "categorie": "Légumineuses", "unite": "kg", "prix_unitaire": 2.00, "seuil_alerte": 25},
        {"nom_produit": "Lentilles", "categorie": "Légumineuses", "unite": "kg", "prix_unitaire": 1.80, "seuil_alerte": 20},
        
        {"nom_produit": "Basilic", "categorie": "Herbes aromatiques", "unite": "kg", "prix_unitaire": 3.50, "seuil_alerte": 10},
        {"nom_produit": "Menthe", "categorie": "Herbes aromatiques", "unite": "kg", "prix_unitaire": 2.50, "seuil_alerte": 15},
        {"nom_produit": "Romarin", "categorie": "Herbes aromatiques", "unite": "kg", "prix_unitaire": 4.00, "seuil_alerte": 5},
        
        {"nom_produit": "Lait", "categorie": "Produits laitiers", "unite": "litre", "prix_unitaire": 1.00, "seuil_alerte": 100},
        {"nom_produit": "Fromage", "categorie": "Produits laitiers", "unite": "kg", "prix_unitaire": 5.00, "seuil_alerte": 20},
        {"nom_produit": "Beurre", "categorie": "Produits laitiers", "unite": "kg", "prix_unitaire": 3.00, "seuil_alerte": 30},
        
        {"nom_produit": "Poulet", "categorie": "Viandes", "unite": "kg", "prix_unitaire": 7.00, "seuil_alerte": 10},
        {"nom_produit": "Mouton", "categorie": "Viandes", "unite": "kg", "prix_unitaire": 8.00, "seuil_alerte": 8},
        {"nom_produit": "Boeuf", "categorie": "Viandes", "unite": "kg", "prix_unitaire": 9.00, "seuil_alerte": 12},
        
        # Autres produits agricoles
        {"nom_produit": "Miel", "categorie": "Autres", "unite": "kg", "prix_unitaire": 10.00, "seuil_alerte": 5},
        {"nom_produit": "Oeufs", "categorie": "Autres", "unite": "douzaine", "prix_unitaire": 2.50, "seuil_alerte": 20}
    ]
    
    # Ajouter les produits dans la base de données
    for produit_data in produits:
        try:
            categorie = Categorie.objects.get(nom=produit_data["categorie"])  # Récupérer la catégorie par son nom
            produit = Produit.objects.create(
                nom_produit=produit_data["nom_produit"],
                categorie_produit=categorie,
                unite=produit_data["unite"],
                prix_unitaire=produit_data["prix_unitaire"],
                seuil_alerte=produit_data["seuil_alerte"],
                date_ajout=timezone.now() - timedelta(days=random.randint(1, 60)),  # Date d'ajout aléatoire entre 1 et 60 jours
            )
            print(f"Produit créé: {produit.nom_produit}")
        except Categorie.DoesNotExist:
            print(f"Erreur: La catégorie {produit_data['categorie']} n'existe pas.")

if __name__ == '__main__':
    populate_db()
