const Sequelize = require('sequelize');
const usuario = require('../models').tbc_usuarios;
const jwt = require('jsonwebtoken');

module.exports = {

    // CREAR USUARIO
    create(req, res){
        return usuario
        .create({
            nombre: req.body.nombre,
            direccion: req.body.direccion,
            telefono: req.body.telefono,
            email: req.body.email,
            password: req.body.password,
            rol: req.body.rol,
            fecha_registro: req.body.fecha_registro || new Date(),
        })
        .then(usuarioItem => res.status(200).send(usuarioItem))
        .catch(error => res.status(400).send(error));
    },

    // LISTAR USUARIOS
    list(_, res){
        return usuario.findAll()
        .then(usuarios => res.status(200).send(usuarios))
        .catch(error => res.status(400).send(error));
    },

    // BUSCAR USUARIO
    find(req, res){

        const id = req.params.id;
        const email = req.params.email || req.query.email;

        if (id) {
            return usuario.findByPk(id)
            .then(usuarioItem => {

                if (!usuarioItem) {
                    return res.status(404).send({
                        message: 'Usuario no encontrado'
                    });
                }

                return res.status(200).send(usuarioItem);

            })
            .catch(error => res.status(400).send(error));
        }

        if (email) {

            return usuario.findAll({
                where: { email }
            })
            .then(usuarios => res.status(200).send(usuarios))
            .catch(error => res.status(400).send(error));

        }

        return res.status(400).send({
            message: 'Debe proporcionar id o email para buscar'
        });

    },

    // ACTUALIZAR USUARIO
    update(req, res){

        const id = req.params.id;

        return usuario.findByPk(id)
        .then(usuarioItem => {

            if (!usuarioItem) {
                return res.status(404).send({
                    message: 'Usuario no encontrado'
                });
            }

            return usuarioItem.update({

                nombre: req.body.nombre,
                direccion: req.body.direccion,
                telefono: req.body.telefono,
                email: req.body.email,
                password: req.body.password,
                rol: req.body.rol,
                fecha_registro: req.body.fecha_registro || usuarioItem.fecha_registro,

            })
            .then(updated => res.status(200).send(updated))
            .catch(error => res.status(400).send(error));

        })
        .catch(error => res.status(400).send(error));

    },

    // ELIMINAR USUARIO
    delete(req, res){

        const id = req.params.id;

        return usuario.findByPk(id)
        .then(usuarioItem => {

            if (!usuarioItem) {
                return res.status(404).send({
                    message: 'Usuario no encontrado'
                });
            }

            return usuarioItem.destroy()
            .then(() => res.status(200).send({
                message: 'Usuario eliminado'
            }))
            .catch(error => res.status(400).send(error));

        })
        .catch(error => res.status(400).send(error));

    },

    // LOGIN USUARIO (JWT)
    login(req, res){

        const { email, password } = req.body;

        // validar campos
        if (!email || !password) {
            return res.status(400).send({
                message: "Email y password son obligatorios"
            });
        }

        // buscar usuario en BD
        return usuario.findOne({
            where: { email: email }
        })
        .then(usuarioItem => {

            // si no existe usuario
            if (!usuarioItem) {
                return res.status(404).send({
                    message: "Usuario no encontrado"
                });
            }

            // validar password
            if (usuarioItem.password !== password) {
                return res.status(401).send({
                    message: "Password incorrecto"
                });
            }

            // generar token
            const token = jwt.sign(
                {
                    id: usuarioItem.id,
                    email: usuarioItem.email,
                    rol: usuarioItem.rol
                },
                "mi_clave_super_secreta",
                {
                    expiresIn: "2h"
                }
            );

            return res.status(200).send({
                token: token
            });

        })
        .catch(error => res.status(400).send(error));

    }

};