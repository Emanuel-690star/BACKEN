'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbb_carritos extends Model {
    static associate(models) {
      // define association here
    }
  }
  tbb_carritos.init({
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'tbb_carritos',
  });

  tbb_carritos.associate = function(models) {
    tbb_carritos.belongsTo(models.tbc_usuarios, {
      as: 'usuario',
      foreignKey: 'id_usuario',
    });

    tbb_carritos.hasMany(models.tbd_carrito_detalle, {
      as: 'detalles',
      foreignKey: 'id_carrito',
    });
  };
  return tbb_carritos;
};
