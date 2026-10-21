# 🌾 Agri-Management

Application web de **gestion d'une activité agricole** : catalogue de produits, suivi des stocks avec alertes de seuil, achats fournisseurs, ventes clients, facturation imprimable, statistiques et gestion des utilisateurs.

Le projet est composé d'une API **Django REST Framework** (authentification JWT) et d'une interface **React** (SPA).

---

## Sommaire

- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#-stack-technique)
- [Architecture du projet](#-architecture-du-projet)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Lancement](#-lancement)
- [Configuration](#-configuration)
- [API REST](#-api-rest)
- [Modèle de données](#-modèle-de-données)
- [Scripts utilitaires](#-scripts-utilitaires)
- [Tests](#-tests)
- [Intégration continue (Jenkins)](#-intégration-continue-jenkins)
- [Dépannage](#-dépannage)
- [Pistes d'amélioration](#-pistes-damélioration)

---

## ✨ Fonctionnalités

| Module | Description |
| --- | --- |
| **Authentification** | Connexion par identifiant / mot de passe, jetons JWT (accès + rafraîchissement), deux rôles : `admin` et `employe` |
| **Tableau de bord** | Vue synthétique des ventes, produits et niveaux de stock |
| **Produits** | CRUD complet : nom, catégorie, unité (kg, litre, pièce…), prix unitaire, seuil d'alerte |
| **Catégories** | Fruits, Légumes, Céréales, Tubercules, Légumineuses, Herbes aromatiques, Produits laitiers, Viandes, Autres |
| **Stocks** | Quantité par produit, date d'entrée / de sortie, état recalculé automatiquement à chaque enregistrement |
| **Achats** | Approvisionnements fournisseurs avec lignes de détail, mise à jour du stock, facture imprimable |
| **Ventes** | Ventes clients avec lignes de détail, contrôle de disponibilité du stock, facture imprimable |
| **Statistiques** | Graphiques (Chart.js) sur l'activité : ventes, achats, produits |
| **Utilisateurs** | Liste, création et activation / désactivation des comptes (réservé à l'administration) |
| **Paramètres** | Préférences d'affichage, thème clair / sombre |

### États de stock

L'état est calculé dans `Stock.update_etat()` (appelé depuis `Stock.save()`), en comparant la quantité au `seuil_alerte` du produit :

| État | Condition |
| --- | --- |
| `rupture` | quantité = 0 |
| `alerte` | quantité < seuil d'alerte |
| `securite` | quantité = seuil d'alerte |
| `disponible` | quantité > seuil d'alerte |

---

## 🧰 Stack technique

**Backend**
- Python 3.11+ · Django 5.2
- Django REST Framework 3.16
- `djangorestframework-simplejwt` (JWT) · `django-cors-headers`
- Base de données SQLite (`backend/db.sqlite3`)

**Frontend**
- React 19 (Create React App / `react-scripts`)
- React Router 6 · Axios
- Material UI · Bootstrap · React Icons
- Chart.js / react-chartjs-2 (graphiques)
- react-to-print (factures) · Sonner (notifications)

**CI/CD**
- Jenkins (`Jenkinsfile`) — pipeline sur poste Windows

---

## 📁 Architecture du projet

```
Agri-Management/
├── backend/                     # API Django
│   ├── backend/                 # Configuration du projet (settings, urls, wsgi/asgi)
│   ├── authentification/        # Utilisateurs, rôles, login JWT
│   ├── gestion_produit/         # Produits, stocks, achats, ventes
│   ├── data.py                  # Jeu de données de démonstration
│   ├── reset_db.py              # Réinitialisation de la base et des migrations
│   ├── db.sqlite3
│   └── manage.py
├── frontend/                    # Interface React
│   ├── public/
│   └── src/
│       ├── components/          # Formulaires, modales, sidebar, factures, recherche…
│       ├── pages/               # Dashboard, Produits, Stocks, Ventes, Achats, Stats, Users, Login
│       ├── assets/
│       ├── axiosInstance.js     # Client HTTP + injection et rafraîchissement du jeton
│       ├── App.js
│       └── index.js
├── Jenkinsfile                  # Pipeline CI/CD
├── requirements.txt             # Dépendances Python
├── structure.txt                # Arborescence (documentation)
└── package.json                 # Dépendance racine (react-toastify)
```

---

## ✅ Prérequis

- **Python 3.11 ou supérieur** (`python --version`)
- **Node.js 18 ou supérieur** et **npm** (`node --version`)
- Ports libres : **8000** (API) et **3000** (frontend)

---

## 🚀 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/Mirado-Franck/Agri-Management.git
cd Agri-Management
```

### 2. Backend

```bash
# Créer et activer un environnement virtuel
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Appliquer les migrations
python backend/manage.py migrate
```

### 3. Frontend

```bash
cd frontend
npm install
cd ..
```

---

## ▶️ Lancement

### Option A — deux terminaux (recommandé)

**Terminal 1 — API Django**

```bash
python backend/manage.py runserver
```
→ http://127.0.0.1:8000 (admin Django : http://127.0.0.1:8000/admin/)

**Terminal 2 — Interface React**

```bash
cd frontend
npm start
```
→ http://localhost:3000

### Option B — une seule commande

Depuis `frontend/`, `npm start` lance les deux processus en parallèle via `concurrently` :

```bash
cd frontend
npm start
```

### Créer un compte administrateur

```bash
python backend/manage.py createsuperuser
```

Le compte créé reçoit automatiquement le rôle `admin` et les droits `is_staff` / `is_superuser`. Les comptes créés depuis l'API (`/api/auth/users/create/`, réservé aux admins) prennent le rôle fourni, `employe` par défaut.

### Données de démonstration (facultatif)

```bash
cd backend
python data.py
```

Insère 9 catégories et une trentaine de produits agricoles (fruits, légumes, céréales, tubercules, légumineuses, herbes, laitiers, viandes, autres) avec prix et seuils d'alerte.

---

## ⚙️ Configuration

| Élément | Emplacement | Valeur par défaut |
| --- | --- | --- |
| URL de l'API (frontend) | `frontend/src/axiosInstance.js` | `http://127.0.0.1:8000/api` |
| URL du login | `frontend/src/pages/Login.jsx` | `http://127.0.0.1:8000/api/auth/login/` |
| Origines CORS autorisées | `backend/backend/settings.py` | `http://localhost:3000` |
| Durée du jeton d'accès | `SIMPLE_JWT` dans `settings.py` | 5 minutes |
| Durée du jeton de rafraîchissement | `SIMPLE_JWT` dans `settings.py` | 1 jour |
| Base de données | `DATABASES` dans `settings.py` | SQLite `backend/db.sqlite3` |

> ℹ️ L'URL du backend est **codée en dur** dans le frontend. Si vous changez de port ou d'hôte, mettez à jour `axiosInstance.js` et `Login.jsx` (et `CORS_ALLOWED_ORIGINS` côté Django).

Le client Axios ajoute automatiquement l'en-tête `Authorization: Bearer <access_token>` et, en cas de réponse **401**, tente de rafraîchir le jeton avec le `refresh_token` stocké dans le `localStorage`. Si le rafraîchissement échoue, la session est vidée et l'utilisateur est renvoyé vers `/login`.

---

## 🔌 API REST

Base : `http://127.0.0.1:8000/api/`

### Authentification — `/api/auth/`

| Méthode | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `POST` | `/login/` | Connexion (renvoie `access` + `refresh`) | Non |
| `GET` | `/me/` | Profil de l'utilisateur courant | Oui |
| `GET` | `/users/` | Liste des utilisateurs | Oui |
| `POST` | `/users/create/` | Créer un utilisateur (rôle `admin` requis) | Oui |
| `PATCH` | `/users/<id>/toggle_active/` | Activer / désactiver un compte (rôle `admin` requis) | Oui |
| `POST` | `/token/` | Obtenir un couple de jetons JWT | Non |
| `POST` | `/token/refresh/` | Rafraîchir le jeton d'accès | Non |
| `POST` | `/token/verify/` | Vérifier la validité d'un jeton | Non |

### Gestion — `/api/produits/`

| Méthode | Endpoint | Description |
| --- | --- | --- |
| CRUD | `/categories/` | Catégories de produits |
| CRUD | `/produits/` | Produits |
| CRUD | `/stocks/` | Stocks |
| CRUD | `/achats-details/` | Lignes d'achat |
| `GET` | `/ventes-details/` | Lignes de vente (lecture seule) |
| `GET` | `/achats/` | Liste des achats |
| `POST` | `/achats/create/` | Créer un achat (met à jour le stock) |
| `GET` | `/ventes/` | Liste des ventes |
| `POST` | `/ventes/create/` | Créer une vente (décrémente le stock) |
| `POST` | `/stocks/<id>/ajouter/` | Ajouter une quantité à un stock |
| `POST` | `/stocks/update/` | Décrémenter les stocks d'une liste de lignes de vente |

> Les endpoints CRUD sont fournis par des `ViewSet` DRF : `GET /…/`, `POST /…/`, `GET|PUT|PATCH|DELETE /…/<id>/`.
> La majorité des écritures exige un jeton JWT valide. Quand `DEBUG = True`, la racine du routeur (`http://127.0.0.1:8000/api/produits/`) offre une vue navigable listant les ressources disponibles.

---

## 🗃️ Modèle de données

```
Categorie (nom)
   └── Produit (nom_produit, categorie, unite, prix_unitaire, seuil_alerte, date_ajout)
          └── Stock (produit, quantite, date_entree, date_sortie, etat)

Achat (date, fournisseur, user, total)
   └── AchatDetail (achat, produit, quantite, prix_unitaire)

Vente (date, client, user, total)
   └── VenteDetail (vente, produit, quantite, prix_unitaire)

User (username, role [admin|employe], is_active, is_staff, created_at)
```

---

## 🛠️ Scripts utilitaires

| Commande | Effet |
| --- | --- |
| `python backend/manage.py migrate` | Applique les migrations |
| `python backend/manage.py createsuperuser` | Crée un administrateur |
| `cd backend && python data.py` | Insère les catégories et produits de démonstration |
| `cd backend && python reset_db.py` | Supprime `db.sqlite3` **et** l'historique des migrations, puis indique les commandes à relancer |

> ⚠️ `reset_db.py` efface toutes les données et toutes les migrations. À n'utiliser qu'en développement.

---

## 🧪 Tests

```bash
python backend/manage.py test
```

```bash
cd frontend && npm test
```

Les fichiers de tests (`backend/*/tests.py`) sont pour l'instant des squelettes : la suite est à compléter.

---

## 🔄 Intégration continue (Jenkins)

Le `Jenkinsfile` déclenche un build à chaque push détecté (polling SCM toutes les minutes) :

1. **Backend** — `pip install -r requirements.txt` puis `python backend/manage.py test`
2. **Frontend** — `cd frontend && npm install` puis `npm run build`
3. **Déploiement** — copie de `frontend/build` vers `C:\agri-deploy` (`xcopy`)

Les scripts utilisent `bat` et `xcopy` : le pipeline est donc prévu pour un agent Jenkins **Windows**. Le build React est également archivé comme artefact en cas de succès.

---

## 🧭 Dépannage

| Symptôme | Piste |
| --- | --- |
| `Erreur de connexion au serveur` sur le login | L'API Django n'est pas démarrée sur `127.0.0.1:8000` |
| Erreur CORS dans la console du navigateur | Ajouter l'origine du frontend dans `CORS_ALLOWED_ORIGINS` (`settings.py`) |
| Déconnexion après ~5 minutes | Le jeton d'accès expire vite ; le rafraîchissement automatique doit renouveler la session (vérifier le `refresh_token` dans le `localStorage`) |
| `no such table` au démarrage | Les migrations n'ont pas été appliquées : `python backend/manage.py migrate` |
| Le frontend appelle le mauvais serveur | Mettre à jour l'URL dans `frontend/src/axiosInstance.js` et `frontend/src/pages/Login.jsx` |
| `ALLOWED_HOSTS` vide | En développement avec `DEBUG = True`, cela fonctionne en local ; à compléter avant tout déploiement |

---

## 🚧 Pistes d'amélioration

- Remplacer l'URL codée en dur par des variables d'environnement (`.env` + `REACT_APP_API_URL`).
- Déplacer `SECRET_KEY` et `DEBUG` vers des variables d'environnement.
- Compléter les tests backend et frontend.
- Ajouter des permissions par rôle côté API (les `ViewSet` sont actuellement accessibles à tout utilisateur authentifié, et certaines vues de stock ne vérifient pas l'authentification).
- Passer à PostgreSQL pour un environnement de production.
- Paginer les listes d'achats / ventes.
- Brancher l'endpoint de changement de mot de passe (`ChangePasswordView`, présent dans `views.py` mais non routé).
- Ajouter un vrai `README` au frontend (actuellement celui de Create React App).

---

## 📄 Licence

Aucune licence n'est définie dans ce dépôt. Tous droits réservés à l'auteur du projet.
