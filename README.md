
# 📌 Gestion des Tâches Collaboratives - Semaine 1

## 📝 Description
Cette application Django permet de gérer des tâches collaboratives entre étudiants et enseignants.  
Elle comprend l'API pour les **utilisateurs**, **projets**, **tâches** et l'**authentification (JWT)**.

---

## 🟠 Objectifs de la Semaine 1 :
- ✅ Développement des **modèles**, **vues**, et **routes API** pour :
  - `Utilisateurs` (`/api/users/`)
  - `Projets` (`/api/projects/`)
  - `Tâches` (`/api/tasks/`)
- ✅ Mise en place de l'**authentification** avec **JWT** (`/api/token/`)
- ✅ Application des **permissions** selon les rôles (`Etudiant`, `Professeur`)

---

## ⚙️ Installation

### 1️⃣ Cloner le dépôt :
```bash
git clone https://github.com/Aicha0203/gestion_taches.git
cd gestion_taches
```

### 2️⃣ Créer l'environnement et installer les dépendances :
```bash
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

### 3️⃣ Effectuer les migrations :
```bash
python manage.py makemigrations
python manage.py migrate
```

### 4️⃣ Créer un superutilisateur :
```bash
python manage.py createsuperuser
```

### 5️⃣ Lancer le serveur :
```bash
python manage.py runserver
```

---

## 🚀 API Endpoints (Postman) :

### 📌 Authentification (JWT) :
- `POST /api/token/` : Obtenir `access` et `refresh` tokens
- `POST /api/token/refresh/` : Rafraîchir le token
- `POST /api/token/verify/` : Vérifier un token

### 📌 Gestion des Utilisateurs (`/api/users/`):
- `GET /api/users/` : Liste des utilisateurs (profil personnel)
- `PUT /api/users/<id>/` : Modifier son profil

### 📌 Gestion des Projets (`/api/projects/`):
- `POST /api/projects/` : Créer un projet
- `GET /api/projects/` : Lister ses projets
- `PUT /api/projects/<id>/` : Modifier son projet
- `DELETE /api/projects/<id>/` : Supprimer son projet

### 📌 Gestion des Tâches (`/api/tasks/`):
- `POST /api/tasks/` : Créer une tâche pour un projet
- `GET /api/tasks/` : Voir ses tâches ou celles de ses projets
- `PUT /api/tasks/<id>/` : Modifier une tâche (par l’assigné ou le créateur)
- `DELETE /api/tasks/<id>/` : Supprimer une tâche (par le créateur du projet)

---

## 🛡️ Permissions :
- **Utilisateurs** : Accès restreint à leur profil (`/api/users/`).
- **Projets** : Seul le créateur peut modifier ou supprimer ses projets (`/api/projects/`).
- **Tâches** :  
  - L’**assigné** ou le **créateur du projet** peut modifier une tâche.  
  - **Seul le créateur du projet** peut supprimer la tâche.  
- **JWT** obligatoire pour tous les endpoints (`Authorization: Bearer <token>`).

---

## 📑 Fichiers Principaux :
- 📂 `utilisateurs/` : Modèles et API pour les utilisateurs
- 📂 `projets/` : Modèles et API pour les projets
- 📂 `taches/` : Modèles et API pour les tâches
- 📂 `permissions.py` : Règles d’accès
- 📂 `urls.py` : Routes principales
- 📂 `settings.py` : Configuration Django & DRF

---

## 📂 Livrables pour la Semaine 1 :
- ✅ **Code source complet** (`utilisateurs/`, `projets/`, `taches/`)  
- ✅ **Documentation API (`README.md`)**  
- ✅ **Collection Postman (`gestion_taches_api_postman.json`)**  
- ✅ **Permissions (`permissions.py`)**  
- ✅ **Tests via Postman (OK)**  

---

## 📌 Prochaine étape (Semaine 2) :
- 🟡 Création des **Templates Django** (`signup.html`, `login.html`, `profile.html`)

---

✨ Bon développement ! 🚀  
