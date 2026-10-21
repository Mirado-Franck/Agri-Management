# Captures d'écran — Agri-Management

Ce dossier accueille les captures utilisées dans le `README.md` principal.
Dépose les fichiers ici en respectant **exactement** les noms ci-dessous (les préfixes numériques garantissent l'ordre d'affichage).

## Fichiers attendus

| Fichier | Page / écran | Priorité |
| --- | --- | --- |
| `01-dashboard.png` | Tableau de bord, avec données réelles | Obligatoire |
| `02-stocks-alertes.png` | Stocks, avec les différents états visibles (rupture / alerte / disponible) | Obligatoire |
| `03-vente-formulaire.png` | Formulaire de création d'une vente | Recommandé |
| `04-facture.png` | Facture imprimable d'une vente | Recommandé |
| `05-produits.png` | Liste des produits | Optionnel |
| `06-statistiques.png` | Statistiques / graphiques | Optionnel |
| `07-utilisateurs.png` | Gestion des utilisateurs | Optionnel |
| `demo-vente.gif` | GIF du flux : créer une vente → stock décrémenté → facture | Bonus |

## Règles techniques

- **Format** : PNG (ou GIF pour l'animation), **pas** de JPG ni de HEIC.
- **Largeur** : 1440 à 1600 px, hauteur libre.
- **Poids** : < 400 Ko par image (compresser avec TinyPNG ou `pngquant`).
- **Thème** : clair, navigateur en plein écran, sans barre d'onglets personnelle ni marque-pages.
- **Données** : réalistes et anonymisées (clients / fournisseurs fictifs).
- Éviter : captures de terminal, de code, de score Lighthouse, ou maquettes non fonctionnelles.

## Insertion dans le README

Les images sont référencées depuis le README principal avec un chemin relatif :

```markdown
![Tableau de bord](docs/screenshots/01-dashboard.png)
```
