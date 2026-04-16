const categoriaController = require('../controller/controller_categoria');

module.exports = (app) => {
    app.get('/api/categorias', categoriaController.list);
    app.get('/api/categorias/:nombre', categoriaController.find);
    app.post('/api/categorias', categoriaController.create);
    app.delete('/api/categorias/:id', categoriaController.delete);
    app.put('/api/categorias/:id', categoriaController.update);
};
