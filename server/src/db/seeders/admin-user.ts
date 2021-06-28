"use strict";

import { QueryInterface } from "sequelize";

import { hashPassword } from "../../utils/crypto";

module.exports = {
  up: async (queryInterface: QueryInterface, _) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const password = await hashPassword("vote");
    await queryInterface.bulkInsert("users", [{
      username: "root",
      email: "root@sparcs.org",
      fullName: "root",
      password,
      createdAt: new Date(),
      sparcsId: "staff",
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
