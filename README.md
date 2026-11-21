# InsetStock

Application Angular standalone de gestion de produits. L'interface propose les pages Accueil et Produits, ainsi que l'ajout, la modification, la recherche et la suppression de produits.

## Prérequis

- Node.js et npm
- Le backend et Spring Cloud Gateway démarrés, avec la route produits disponible sur `http://localhost:8080/products`

Le contrat produit utilisé par l'interface est `id`, `name`, `price` et `quantity`. L'identifiant est renvoyé par le backend lors de la lecture/création et utilisé dans les routes de mise à jour et de suppression.

## Développement

```bash
npm install
npm start
```

Ouvrez `http://localhost:4200/`.

## Vérification

```bash
npm test -- --watch=false
npm run build
```
