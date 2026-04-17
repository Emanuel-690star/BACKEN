module.exports = (app) => {

    const controllerUsuario = require('../controller/controller_usuarios');

    // crear usuario
    app.post('/api/usuarios', controllerUsuario.create);

    // listar usuarios
    app.get('/api/usuarios', controllerUsuario.list);

    // buscar usuario por id
    app.get('/api/usuarios/:id', controllerUsuario.find);

    // actualizar usuario
    app.put('/api/usuarios/:id', controllerUsuario.update);

    // eliminar usuario
    app.delete('/api/usuarios/:id', controllerUsuario.delete);

    // LOGIN (aquí está lo importante)
    app.post('/api/login', controllerUsuario.login);

};