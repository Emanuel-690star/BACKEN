const { verifyToken, isAdmin } = require('../middleware/auth');
const categoriaController = require('../controller/controller_categoria');

module.exports = (app) => {
    app.get('/api/categorias', categoriaController.list);
    app.get('/api/categorias/:nombre', verifyToken, categoriaController.find);
    app.post('/api/categorias', verifyToken, categoriaController.create);
    app.delete('/api/categorias/:id', verifyToken, isAdmin, categoriaController.delete);
    app.put('/api/categorias/:id', verifyToken, isAdmin, categoriaController.update);
};
