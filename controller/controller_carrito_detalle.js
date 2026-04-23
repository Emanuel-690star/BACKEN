const {
    tbd_carrito_detalle: carritoDetalle,
    tbb_carritos: carrito,
    tbb_productos: producto,
} = require('../models');

async function recalcularTotalCarrito(idCarrito) {
    const detalles = await carritoDetalle.findAll({
        where: { id_carrito: idCarrito },
    });

    const total = detalles.reduce((acumulado, item) => {
        return acumulado + (Number(item.precio_unitario) * Number(item.cantidad));
    }, 0);

    await carrito.update(
        { total: total.toFixed(2) },
        { where: { id: idCarrito } }
    );
}

function validarNumeros(precio_unitario, cantidad, id_carrito, id_producto, res, body) {
    if (precio_unitario === undefined || cantidad === undefined || id_carrito === undefined || id_producto === undefined) {
        res.status(400).send({
            message: 'Faltan campos requeridos en carrito-detalle',
            body,
        });
        return null;
    }

    const precioFloat = parseFloat(precio_unitario);
    const cantidadInt = parseInt(cantidad, 10);
    const idCarritoInt = parseInt(id_carrito, 10);
    const idProductoInt = parseInt(id_producto, 10);

    if (
        Number.isNaN(precioFloat) ||
        Number.isNaN(cantidadInt) ||
        Number.isNaN(idCarritoInt) ||
        Number.isNaN(idProductoInt)
    ) {
        res.status(400).send({
            message: 'Campos invalidos en carrito-detalle',
            body,
        });
        return null;
    }

    if (cantidadInt < 1) {
        res.status(400).send({
            message: 'La cantidad debe ser mayor a 0',
        });
        return null;
    }

    return { precioFloat, cantidadInt, idCarritoInt, idProductoInt };
}

async function obtenerContextoCarrito(idCarritoInt, idProductoInt, res) {
    const carritoExistente = await carrito.findByPk(idCarritoInt);

    if (!carritoExistente) {
        res.status(404).send({ message: 'Carrito no encontrado' });
        return null;
    }

    const productoExistente = await producto.findByPk(idProductoInt);

    if (!productoExistente) {
        res.status(404).send({ message: 'Producto no encontrado' });
        return null;
    }

    return { carritoExistente, productoExistente };
}

function validarStock(productoExistente, cantidadSolicitada, res) {
    if (cantidadSolicitada > Number(productoExistente.stock)) {
        res.status(400).send({
            message: `Stock insuficiente. Disponible: ${productoExistente.stock}`,
        });
        return false;
    }

    return true;
}

const productoInclude = [
    {
        model: producto,
        as: 'producto',
    },
];

module.exports = {
    async create(req, res){
        console.log('POST /api/carrito-detalle body:', req.body);

        const valores = validarNumeros(
            req.body.precio_unitario,
            req.body.cantidad,
            req.body.id_carrito,
            req.body.id_producto,
            res,
            req.body
        );

        if (!valores) {
            return;
        }

        const { precioFloat, cantidadInt, idCarritoInt, idProductoInt } = valores;

        try {
            const contexto = await obtenerContextoCarrito(idCarritoInt, idProductoInt, res);

            if (!contexto) {
                return;
            }

            const { productoExistente } = contexto;

            const detalleExistente = await carritoDetalle.findOne({
                where: {
                    id_carrito: idCarritoInt,
                    id_producto: idProductoInt,
                },
            });

            const cantidadFinal = detalleExistente
                ? Number(detalleExistente.cantidad) + cantidadInt
                : cantidadInt;

            if (!validarStock(productoExistente, cantidadFinal, res)) {
                return;
            }

            let detalleGuardado;

            if (detalleExistente) {
                detalleGuardado = await detalleExistente.update({
                    cantidad: cantidadFinal,
                    precio_unitario: precioFloat,
                });
            } else {
                detalleGuardado = await carritoDetalle.create({
                    precio_unitario: precioFloat,
                    cantidad: cantidadInt,
                    id_carrito: idCarritoInt,
                    id_producto: idProductoInt,
                });
            }

            await recalcularTotalCarrito(idCarritoInt);

            const detalleCompleto = await carritoDetalle.findByPk(detalleGuardado.id, {
                include: productoInclude,
            });

            return res.status(200).send(detalleCompleto);
        } catch (error) {
            console.error('Error en carrito-detalle:', error);
            return res.status(400).send({
                message: error.message,
                errors: error.errors,
            });
        }
    },
    list(_, res){
        return carritoDetalle.findAll({
            include: productoInclude,
            order: [['id', 'ASC']],
        })
        .then(detalles => res.status(200).send(detalles))
        .catch(error => res.status(400).send(error));
    },
    find(req, res){
        const id = req.params.id;

        if (id) {
            return carritoDetalle.findByPk(id, {
                include: productoInclude,
            })
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
        .then(async detalle => {
            if (!detalle) {
                return res.status(404).send({message: 'Detalle de carrito no encontrado'});
            }

            const precio = req.body.precio_unitario ?? detalle.precio_unitario;
            const cantidad = req.body.cantidad ?? detalle.cantidad;
            const idCarrito = req.body.id_carrito ?? detalle.id_carrito;
            const idProducto = req.body.id_producto ?? detalle.id_producto;

            const valores = validarNumeros(precio, cantidad, idCarrito, idProducto, res, req.body);
            if (!valores) {
                return;
            }

            const { precioFloat, cantidadInt, idCarritoInt, idProductoInt } = valores;
            const contexto = await obtenerContextoCarrito(idCarritoInt, idProductoInt, res);

            if (!contexto) {
                return;
            }

            if (!validarStock(contexto.productoExistente, cantidadInt, res)) {
                return;
            }

            const detalleActualizado = await detalle.update({
                precio_unitario: precioFloat,
                cantidad: cantidadInt,
                id_carrito: idCarritoInt,
                id_producto: idProductoInt,
            });

            await recalcularTotalCarrito(detalleActualizado.id_carrito);

            const detalleCompleto = await carritoDetalle.findByPk(detalleActualizado.id, {
                include: productoInclude,
            });

            return res.status(200).send(detalleCompleto);
        })
        .catch(error => res.status(400).send(error));
    },
    delete(req, res){
        const id = req.params.id;
        return carritoDetalle.findByPk(id)
        .then(async detalle => {
            if (!detalle) {
                return res.status(404).send({message: 'Detalle de carrito no encontrado'});
            }

            const idCarrito = detalle.id_carrito;
            await detalle.destroy();
            await recalcularTotalCarrito(idCarrito);

            return res.status(200).send({message: 'Detalle de carrito eliminado'});
        })
        .catch(error => res.status(400).send(error));
    },
};
