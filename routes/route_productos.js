const { verifyToken, isAdmin } = require('../middleware/auth');
const productoController = require('../controller/controller_producto');

module.exports = (app) => {
    app.get('/api/productos', productoController.list);
    app.get('/api/productos/:id', verifyToken, productoController.find);
    app.post('/api/productos', verifyToken, productoController.create);
    app.put('/api/productos/:id', verifyToken, isAdmin, productoController.update);
    app.delete('/api/productos/:id', verifyToken, isAdmin, productoController.delete);
};
