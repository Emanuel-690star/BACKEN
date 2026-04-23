const {
    tbb_carritos: carrito,
    tbd_carrito_detalle: carritoDetalle,
    tbb_productos: producto,
} = require('../models');

const carritoInclude = [
    {
        model: carritoDetalle,
        as: 'detalles',
        include: [
            {
                model: producto,
                as: 'producto',
            },
        ],
    },
];

module.exports = {
    create(req, res){
        return carrito
        .create({
            total: req.body.total,
            estado: req.body.estado,
            fecha_creacion: req.body.fecha_creacion || new Date(),
            id_usuario: req.body.id_usuario,
        })
        .then(carritoItem => res.status(200).send(carritoItem))
        .catch(error => res.status(400).send(error));
    },
    list(_, res){
        return carrito.findAll({
            include: carritoInclude,
            order: [['id', 'ASC']],
        })
        .then(carritos => res.status(200).send(carritos))
        .catch(error => res.status(400).send(error));
    },
    find(req, res){
        const id = req.params.id;

        if (id) {
            return carrito.findByPk(id, {
                include: carritoInclude,
            })
            .then(carritoItem => {
                if (!carritoItem) {
                    return res.status(404).send({message: 'Carrito no encontrado'});
                }
                return res.status(200).send(carritoItem);
            })
            .catch(error => res.status(400).send(error));
        }

        return res.status(400).send({message: 'Debe proporcionar id para buscar'});
    },
    update(req, res){
        const id = req.params.id;
        return carrito.findByPk(id)
        .then(carritoItem => {
            if (!carritoItem) {
                return res.status(404).send({message: 'Carrito no encontrado'});
            }
            return carritoItem.update({
                total: req.body.total,
                estado: req.body.estado,
                fecha_creacion: req.body.fecha_creacion || carritoItem.fecha_creacion,
                id_usuario: req.body.id_usuario,
            })
            .then(updated => res.status(200).send(updated))
            .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
    },
    delete(req, res){
        const id = req.params.id;
        return carrito.findByPk(id)
        .then(carritoItem => {
            if (!carritoItem) {
                return res.status(404).send({message: 'Carrito no encontrado'});
            }
            return carritoItem.destroy()
            .then(() => res.status(200).send({message: 'Carrito eliminado'}))
            .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
    },
};
