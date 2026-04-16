const Sequelize = require('sequelize');
const carritoDetalle = require('../models').tbd_carrito_detalle;

module.exports = {
    create(req, res){
        return carritoDetalle
        .create({
            precio_unitario: req.body.precio_unitario,
            cantidad: req.body.cantidad,
            id_carrito: req.body.id_carrito,
            id_producto: req.body.id_producto,
        })
        .then(detalle => res.status(200).send(detalle))
        .catch(error => res.status(400).send(error));
    },
    list(_, res){
        return carritoDetalle.findAll()
        .then(detalles => res.status(200).send(detalles))
        .catch(error => res.status(400).send(error));
    },
    find(req, res){
        const id = req.params.id;

        if (id) {
            return carritoDetalle.findByPk(id)
            .then(detalle => {
                if (!detalle) {
                    return res.status(404).send({message: 'Detalle de carrito no encontrado'});
                }
                return res.status(200).send(detalle);
            })
            .catch(error => res.status(400).send(error));
        }

        return res.status(400).send({message: 'Debe proporcionar id para buscar'});
    },
    update(req, res){
        const id = req.params.id;
        return carritoDetalle.findByPk(id)
        .then(detalle => {
            if (!detalle) {
                return res.status(404).send({message: 'Detalle de carrito no encontrado'});
            }
            return detalle.update({
                precio_unitario: req.body.precio_unitario,
                cantidad: req.body.cantidad,
                id_carrito: req.body.id_carrito,
                id_producto: req.body.id_producto,
            })
            .then(updated => res.status(200).send(updated))
            .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
    },
    delete(req, res){
        const id = req.params.id;
        return carritoDetalle.findByPk(id)
        .then(detalle => {
            if (!detalle) {
                return res.status(404).send({message: 'Detalle de carrito no encontrado'});
            }
            return detalle.destroy()
            .then(() => res.status(200).send({message: 'Detalle de carrito eliminado'}))
            .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
    },
};
