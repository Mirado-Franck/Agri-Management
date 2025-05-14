from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Produit, Stock
from django.utils import timezone

@receiver(post_save, sender=Produit)
def create_stock_for_new_product(sender, instance, created, **kwargs):
    if created:
        # Ici, on crée un stock avec la quantite par défaut de 0 et date_entree automatique
        Stock.objects.create(
            produit=instance,
            quantite=0,  # Quantité par défaut
            # Date d'entrée sera automatiquement gérée par Django grâce à auto_now_add
        )
