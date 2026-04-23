const { verifyToken, isAdmin } = require('../middleware/auth');

module.exports = (app) => {

    const controllerUsuario = require('../controller/controller_usuarios');

    // crear usuario
    app.post('/api/usuarios', controllerUsuario.create);

    // listar usuarios
    app.get('/api/usuarios', verifyToken, isAdmin, controllerUsuario.list);

    // buscar usuario por id
    app.get('/api/usuarios/:id', verifyToken, controllerUsuario.find);

    // actualizar usuario
    app.put('/api/usuarios/:id', verifyToken, isAdmin, controllerUsuario.update);

    // eliminar usuario
    app.delete('/api/usuarios/:id', verifyToken, isAdmin, controllerUsuario.delete);

    // LOGIN (aquí está lo importante)
    app.post('/api/login', controllerUsuario.login);

};