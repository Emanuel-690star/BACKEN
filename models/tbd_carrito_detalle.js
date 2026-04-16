'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbd_carrito_detalle extends Model {
    static associate(models) {
      // define association here
    }
  }
  tbd_carrito_detalle.init({
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_carrito: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'tbd_carrito_detalle',
  });

  tbd_carrito_detalle.associate = function(models) {
    tbd_carrito_detalle.belongsTo(models.tbb_carritos, {
      as: 'carrito',
      foreignKey: 'id_carrito',
    });

    tbd_carrito_detalle.belongsTo(models.tbb_productos, {
      as: 'producto',
      foreignKey: 'id_producto',
    });
  };
  return tbd_carrito_detalle;
};
