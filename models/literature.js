'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Literature extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models){
      Literature.belongsTo(models.Category,{
        as:"categoryId",
        foreignKey:{
          name:"category"
        }
      })
      
      Literature.belongsTo(models.User,{
        as:"userId",
        foreignKey:{
          name:"user"
        }
      })
      
    }
  };
  Literature.init({
    title: DataTypes.STRING,
    category:DataTypes.INTEGER,
    user:DataTypes.INTEGER,
    author: DataTypes.STRING,
    publication: DataTypes.INTEGER,
    pages: DataTypes.INTEGER,
    ISBN: DataTypes.INTEGER,
    status:DataTypes.STRING,
    cover:DataTypes.STRING,
    attachment: DataTypes.STRING,
    description:DataTypes.STRING
  }, {
    sequelize,
    tableName:'Literatures',
    modelName:'Literature',
  });
  return Literature;
};