'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbc_categorias extends Model {
    static associate(models) {
      // define association here
    }
  }
  tbc_categorias.init({
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'tbc_categorias',
  });
  tbc_categorias.associate = function(models) {
  tbc_categorias.hasMany(models.tbb_productos,
    {
      as: 'tbb_productos',
      foreignKey: 'id_categoria',
    }
  );

  };
  return tbc_categorias;
};
