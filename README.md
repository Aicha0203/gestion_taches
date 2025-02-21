### 📌 **Mise à Jour du `README.md` - Ajouts d'hier et d'aujourd'hui**  

---

# 📌 **Gestion des Tâches Collaboratives - Semaine 1**

## 📝 **Description**
Cette application Django permet de gérer des tâches collaboratives entre étudiants et enseignants.  
Elle comprend l'API pour **les utilisateurs, projets, tâches**, la gestion des **notifications**, et l'**authentification (JWT)**.

---

## 🟠 **Objectifs de la Semaine 1 :**
- ✅ Développement des **modèles**, **vues**, et **routes API** pour :
  - `Utilisateurs` (`/api/users/`)
  - `Projets` (`/api/projects/`)
  - `Tâches` (`/api/tasks/`)
- ✅ Mise en place de l'**authentification** avec **JWT** (`/api/token/`)
- ✅ Application des **permissions** selon les rôles (`Étudiant`, `Professeur`)
- ✅ **Ajout du module de notifications** (`utilisateurs/notifications`)
- ✅ **Gestion des couleurs et emoji des projets**
- ✅ **Ajout du rappel automatique des tâches**
- ✅ **Création dynamique des tâches dans le formulaire**
- ✅ **Dashboard Étudiant & Professeur**
- ✅ **Correction des erreurs liées à la sauvegarde des projets et tâches**
- ✅ **Mise à jour de la gestion des formulaires (`projets/forms.py`)**
- ✅ **Ajout du champ `emoji`, `rappel`, `heure_rappel`, et `couleur_projet` dans les modèles**
- ✅ **Amélioration des interactions utilisateur et corrections des problèmes d'affichage**
- ✅ **Intégration des graphiques pour les statistiques des tâches et évaluations**
- ✅ **Correction des problèmes de migrations et enregistrement des tâches liées à un projet**
- ✅ **Ajout de la gestion des tâches dans le dashboard professeur (assignation, modification)**

---

## ⚙️ **Installation**

### 1️⃣ **Cloner le dépôt :**
```bash
git clone https://github.com/Aicha0203/gestion_taches.git
cd gestion_taches
```

### 2️⃣ **Créer l'environnement et installer les dépendances :**
```bash
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

### 3️⃣ **Effectuer les migrations :**
```bash
python manage.py makemigrations
python manage.py migrate
```

### 4️⃣ **Créer un superutilisateur :**
```bash
python manage.py createsuperuser
```

### 5️⃣ **Lancer le serveur :**
```bash
python manage.py runserver
```

---

## 🚀 **API Endpoints (Postman) :**

### 📌 **Authentification (JWT) :**
- `POST /api/token/` : Obtenir `access` et `refresh` tokens
- `POST /api/token/refresh/` : Rafraîchir le token
- `POST /api/token/verify/` : Vérifier un token

### 📌 **Gestion des Utilisateurs (`/api/users/`) :**
- `GET /api/users/` : Liste des utilisateurs (profil personnel)
- `PUT /api/users/<id>/` : Modifier son profil

### 📌 **Gestion des Projets (`/api/projects/`) :**
- `POST /api/projects/` : Créer un projet
- `GET /api/projects/` : Lister ses projets
- `PUT /api/projects/<id>/` : Modifier son projet
- `DELETE /api/projects/<id>/` : Supprimer son projet

### 📌 **Gestion des Tâches (`/api/tasks/`) :**
- `POST /api/tasks/` : Créer une tâche pour un projet
- `GET /api/tasks/` : Voir ses tâches ou celles de ses projets
- `PUT /api/tasks/<id>/` : Modifier une tâche (par l’assigné ou le créateur)
- `DELETE /api/tasks/<id>/` : Supprimer une tâche (par le créateur du projet)

---

## 🛡️ **Permissions :**
- **Utilisateurs** : Accès restreint à leur profil (`/api/users/`).
- **Projets** : Seul le créateur peut modifier ou supprimer ses projets (`/api/projects/`).
- **Tâches** :  
  - L’**assigné** ou le **créateur du projet** peut modifier une tâche.  
  - **Seul le créateur du projet** peut supprimer la tâche.  
- **Notifications** : Chaque utilisateur reçoit des **alertes automatiques** en fonction des rappels définis.
- **JWT** obligatoire pour tous les endpoints (`Authorization: Bearer <token>`).

---

## 📑 **Fichiers et Fonctionnalités Ajoutées Hier et Aujourd’hui :**
### **📂 Mise à jour du module de gestion des projets :**
- **`projets/models.py`** : 
  - Ajout des champs `emoji`, `couleur_projet`, `rappel`, `heure_rappel`
  - Correction du problème de `date_creation`
- **`projets/views.py`** : 
  - Correction de la sauvegarde des projets
  - Ajout de la sauvegarde des tâches liées à un projet
  - Gestion améliorée des rappels et des couleurs
- **`projets/forms.py`** :
  - Mise à jour du formulaire pour inclure les champs `emoji`, `couleur_projet`, et `rappel`

### **📂 Mise à jour du module de gestion des tâches :**
- **`taches/models.py`** :
  - Relation **Projet ↔ Tâches** ajoutée
  - Ajout du champ `assigne_a` et correction de la gestion des statuts
- **`taches/views.py`** :
  - Modification de la logique d’affectation et des statuts des tâches
  - Ajout d’un filtre pour récupérer les tâches assignées à l’utilisateur

### **📂 Nouveau module de notifications :**
- **`utilisateurs/models.py`** :
  - Ajout du modèle `Notification`
- **`utilisateurs/views.py`** :
  - Vue pour afficher les notifications des utilisateurs
- **`utilisateurs/templates/notifications.html`** :
  - Ajout d’une page pour voir les rappels

### **📂 Mise à jour des Dashboards Étudiant & Professeur**
- **`utilisateurs/templates/dashboard_etudiant.html`** :
  - 📊 **Ajout des statistiques de progression**
  - 📌 **Affichage des tâches assignées**
  - 📅 **Liste des projets et échéances**
- **`utilisateurs/templates/dashboard_professeur.html`** :
  - 🔎 **Vue globale des projets gérés**
  - 🏆 **Système d’évaluation et d’attribution des primes**
  - 📬 **Gestion de la communication avec les étudiants**
  - ✏️ **Modification et assignation des tâches aux étudiants**

### **📂 Styles et Templates Améliorés**
- **`static/css/projet.css`** :
  - 🎨 **Amélioration du design du formulaire de création de projet**
  - 🌈 **Ajout du choix des couleurs et des emojis**
- **`static/css/dashboard.css`** :
  - 📊 **Intégration des graphiques pour la progression des tâches**
  - 🧑‍🏫 **Ajout du tableau des étudiants pour les professeurs**


---

