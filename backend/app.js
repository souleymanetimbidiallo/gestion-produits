const express = require('express');
const mongoose = require('mongoose');

const Product = require('./models/product');

mongoose.connect('mongodb+srv://soulman:GKMtzxOCpWK2CJcZ@cluster0.86b82.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));
    
const app  = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

/**
 * POST: Créera un nouveau produit dans la base de données.
 */
app.post('/api/products', (req, res, next) => {
    delete req.body._id;
    const product = new Product({
        ...req.body
    });
    product.save()
        .then(product => res.status(200).json({product}))
        .catch(error =>res.status(400).json({ error }));
});


/**
 * PUT: Modifiera le produit avec le _id fourni 
 * selon les données envoyées dans le corps de la requête.
 */
app.put('/api/products/:id', (req, res, next) => {
    Product.updateOne({_id: req.params.id}, {...req.body, _id: req.params.id})
        .then(() => res.status(200).json({ message: 'Modified!' }))
        .catch(error => res.status(400).json({ error }));
});

/**
 * DELETE: Supprimera le produit avec le _id fourni.
 */
 app.delete('/api/products/:id', (req, res, next) => {
    Product.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Deleted!' }))
        .catch(error => res.status(400).json({ error }));
});

/**
 * GET: Retournera le produit avec le_id
 */
app.get('/api/products/:id', (req, res, next) => {
    Product.findOne({_id: req.params.id})
    .then(product => res.status(200).json({product}))
    .catch(error => res.status(404).json({ error }));
});

/**
 * GET: Retournera tous les produits
 */
app.use('/api/products', (req, res, next) => {
    Product.find()
        .then(products => res.status(200).json({products}))
        .catch(error => res.status(400).json({error}));
});

module.exports = app;