from django.apps import AppConfig

class GestionProduitConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'gestion_produit'

    def ready(self):
        import gestion_produit.signals  # 🔥 Active les signaux au démarrage
