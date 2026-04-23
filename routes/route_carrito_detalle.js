const carritoDetalleController = require('../controller/controller_carrito_detalle');

module.exports = (app) => {
    app.get('/api/carrito-detalle', carritoDetalleController.list);
    app.get('/api/carrito-detalle/:id', carritoDetalleController.find);
    app.post('/api/carrito-detalle', carritoDetalleController.create);
    app.put('/api/carrito-detalle/:id', carritoDetalleController.update);
    app.delete('/api/carrito-detalle/:id', carritoDetalleController.delete);
};