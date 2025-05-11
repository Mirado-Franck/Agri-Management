from django.db import models
from django.conf import settings
from django.utils import timezone

class Categorie(models.Model):
    nom = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nom

class Produit(models.Model):
    nom_produit = models.CharField(max_length=100)
    categorie_produit = models.ForeignKey('Categorie', on_delete=models.CASCADE, default=1)
    unite = models.CharField(max_length=20)
    date_ajout = models.DateTimeField(default=timezone.now)
    prix_unitaire = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    seuil_alerte = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.nom_produit

class Stock(models.Model):
    produit = models.OneToOneField(Produit, on_delete=models.CASCADE, related_name='stock')
    quantite = models.FloatField(default=0)
    last_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.produit.nom} - {self.quantite} {self.produit.unite}"

class Achat(models.Model):
    date = models.DateField()
    fournisseur = models.CharField(max_length=200)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='achats')
    total = models.FloatField()

    def __str__(self):
        return f"Achat #{self.id} - {self.fournisseur} on {self.date}"

class AchatDetail(models.Model):
    achat = models.ForeignKey(Achat, on_delete=models.CASCADE, related_name='details')
    produit = models.ForeignKey(Produit, on_delete=models.PROTECT)
    quantite = models.FloatField()
    prix_unitaire = models.FloatField()

    def __str__(self):
        return f"{self.produit.nom} x {self.quantite} @ {self.prix_unitaire}"

class Vente(models.Model):
    date = models.DateField()
    client = models.CharField(max_length=200)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='ventes')
    total = models.FloatField()

    def __str__(self):
        return f"Vente #{self.id} - {self.client} on {self.date}"

class VenteDetail(models.Model):
    vente = models.ForeignKey(Vente, on_delete=models.CASCADE, related_name='details')
    produit = models.ForeignKey(Produit, on_delete=models.PROTECT)
    quantite = models.FloatField()
    prix_unitaire = models.FloatField()

    def __str__(self):
        return f"{self.produit.nom} x {self.quantite} @ {self.prix_unitaire}"

