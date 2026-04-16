const db = require('../models');
const categoria = db.tbc_categorias;

module.exports = {
    create(req, res){
        return categoria
        .create({
            nombre: req.body.nombre,
        })
        .then(categoria => res.status(200).send(categoria))
        .catch(error => res.status(400).send(error));
    },
    list(_, res){
        return categoria.findAll()
        .then(categorias => res.status(200).send(categorias))
        .catch(error => res.status(400).send(error));
    },
    find(req, res){
        const id = req.params.id;
        const nombre = req.params.nombre || req.query.nombre;

        if (id) {
            return categoria.findByPk(id)
            .then(categoriaItem => {
                if (!categoriaItem) {
                    return res.status(404).send({message: 'Categoria no encontrada'});
                }
                return res.status(200).send(categoriaItem);
            })
            .catch(error => res.status(400).send(error));
        }

        if (nombre) {
            return categoria.findAll({
                where: { nombre }
            })
            .then(categorias => res.status(200).send(categorias))
            .catch(error => res.status(400).send(error));
        }

        return res.status(400).send({message: 'Debe proporcionar id o nombre para buscar'});
    },
    update(req, res){
        return categoria.update({
            nombre: req.body.nombre,
        }, {
            where: {
                id: req.params.id
            }
        })
        .then(() => res.status(200).send({message: 'Datos Actualizados'}))
        .catch(error => res.status(400).send(error));
    },
    delete(req, res){
        return categoria.destroy({
            where:{
                id: req.params.id
            }
        })
        .then(() => res.status(200).send({message: 'Datos Eliminados'}))
        .catch(error => res.status(400).send(error));
    },
};
