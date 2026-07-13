# La Table d'Or — Restaurant Pro

Refonte complète du projet : identité visuelle, dashboard admin, et corrections de sécurité côté backend.

## Ce qui a changé

**Design**
- Site client : identité "restaurant gastronomique" (encre/ivoire/bronze, typographie Fraunces + Inter), carte présentée par catégories avec numérotation en chiffres romains.
- Admin : dashboard avec sidebar, cards de statistiques, tableau des plats, modale d'ajout/édition — cohérent avec l'identité du site client.

**Sécurité backend**
- Le login renvoie maintenant un vrai token JWT (avant : aucune session n'était créée).
- Les routes de création/modification/suppression de plats sont protégées par ce token (avant : n'importe qui pouvait ajouter un plat sans se connecter).
- Secret JWT et URI MongoDB déplacés dans `.env` (avant : en dur dans le code).
- Upload d'image limité à 5 Mo et aux formats jpg/png/webp.
- Ajout des routes `PUT` et `DELETE` pour gérer les plats depuis l'admin.

**Nettoyage**
- Suppression de 3 fichiers morts/cassés (`config/upload.js`, `routes/deliveryRoutes.js`, `routes/analyticsRoutes.js`) qui référençaient des variables jamais importées.
- Correction d'une erreur dans `models/Order.js` (`mongoose.model.Order` → `mongoose.models.Order`).
- Ajout d'un `.gitignore` (`node_modules`, `.env`, uploads utilisateurs).

## Lancer le projet

```bash
cd backend
npm install
cp .env.example .env   # puis éditez JWT_SECRET et MONGO_URI si besoin
npm start
```

Le serveur démarre sur `http://localhost:5004` (configurable via `.env`).

Ouvrez ensuite `frontend/index.html` (site client) et `admin/index.html` (back-office) dans un navigateur. En production, remplacez la constante `API` en haut de chaque `script.js` par l'URL réelle de votre API.

## Créer le premier compte admin

Il n'y a pas encore d'interface d'inscription (volontaire, pour ne pas exposer la création de comptes admin publiquement). Un script est fourni pour créer le premier compte :

```bash
cd backend
node scripts/createAdmin.js admin "un-mot-de-passe-solide"
```

Le mot de passe est haché automatiquement (bcrypt) avant l'enregistrement.
