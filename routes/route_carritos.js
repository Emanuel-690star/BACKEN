const carritoController = require('../controller/controller_carrito');

module.exports = (app) => {
    app.get('/api/carritos', carritoController.list);
    app.get('/api/carritos/:id', carritoController.find);
    app.post('/api/carritos', carritoController.create);
    app.put('/api/carritos/:id', carritoController.update);
    app.delete('/api/carritos/:id', carritoController.delete);
};
