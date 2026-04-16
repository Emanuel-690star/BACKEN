'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbb_productos extends Model {
    static associate(models) {
      // define association here
    }
  }
  tbb_productos.init({
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    direccion: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: true
    },
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'tbb_productos',
  });

  tbb_productos.associate = function(models) {
    tbb_productos.belongsTo(models.tbc_categorias,
    {
      as: 'tbc_categorias',
      foreignKey: 'id_categoria',
    }
  );

    tbb_productos.hasMany(models.tbd_carrito_detalle, {
      as: 'detalles_carrito',
      foreignKey: 'id_producto',
    });

  };
  return tbb_productos;
};
