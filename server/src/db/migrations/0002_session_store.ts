"use strict";

import { DataTypes, QueryInterface, Sequelize } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
    await queryInterface.createTable("sessions", {
      sid: {
        type: DataTypes.STRING(36),
        primaryKey: true,
      },
      expires: DataTypes.DATE,
      data: DataTypes.TEXT,
    });
  },

  down: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
    await queryInterface.dropTable("sessions");
  },
};
