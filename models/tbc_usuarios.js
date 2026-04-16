'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbc_usuarios extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tbc_usuarios.init({
    nombre:{
      type: DataTypes.STRING(100),
      allowNull:false
    } ,
    direccion: {
      type: DataTypes.STRING(200),
      allowNull:false
    },
    telefono: {
      type: DataTypes.STRING(15),
      allowNull:false
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull:false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull:false
    },
    rol: {
      type: DataTypes.ENUM('admin', 'cliente'),
      allowNull:false,
      defaultValue: 'cliente'
    },
    fecha_registro: {
      type: DataTypes.DATE,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'tbc_usuarios',
  });

  tbc_usuarios.associate = function(models) {
    tbc_usuarios.hasMany(models.tbb_carritos, {
      as: 'carritos',
      foreignKey: 'id_usuario',
    });
  };
  return tbc_usuarios;
};
