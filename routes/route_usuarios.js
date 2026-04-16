module.exports = (app) => {

    const controllerUsuario = require('../controller/controller_usuarios');

    // crear usuario
    app.post('/usuarios', controllerUsuario.create);

    // listar usuarios
    app.get('/usuarios', controllerUsuario.list);

    // buscar usuario por id
    app.get('/usuarios/:id', controllerUsuario.find);

    // actualizar usuario
    app.put('/usuarios/:id', controllerUsuario.update);

    // eliminar usuario
    app.delete('/usuarios/:id', controllerUsuario.delete);

    // LOGIN (aquí está lo importante)
    app.post('/login', controllerUsuario.login);

};