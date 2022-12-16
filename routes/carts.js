const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartTemplate = require('../views/carts/show');

const router = express.Router();

router.post('/cart/products', async (req, res) => {
    let cart;
    if(!req.session.cartId) {
        cart = await cartsRepo.create({ items: [] });
        req.session.cartId = cart.id;
    } else {
        cart = await cartsRepo.getOne(req.session.cartId);
    }

    const existingitem = cart.items.find(item => item.id === req.body.productId);
    if (existingitem) {
        existingitem.quantity ++;
    } else {
        cart.items.push({ id: req.body.productId, quantity: 1 });
    }

    await cartsRepo.update(cart.id, {
        items: cart.items
    });

    res.send('Product added to cart');
});

router.get('/cart', async (req,res) => {
    if (!req.session.cartId) {
        return res.redirect('/');
    }

    const cart = await cartsRepo.getOne(req.session.cartId);

    for (let item of cart.items) {
        const product = await productsRepo.getOne(item.id);

        item.product = product
    } 

    res.send(cartTemplate({ items: cart.items }));
});

router.post('/cart/products/delete', async (req, res) => {
    const { deleteItem } = req.body;
    const cart = await cartsRepo.getOne(req.session.cartId);

    const items = cart.items.filter(item => item.id !== deleteItem);
    await cartsRepo.update(req.session.cartId, { items });

    res.redirect('/cart');
});

module.exports = router;