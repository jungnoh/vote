"use strict";

import { DataTypes, QueryInterface, Sequelize } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
    await queryInterface.createTable("users", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(120),
        allowNull: false
      },
      password: {
        type: DataTypes.STRING(240),
        allowNull: false,
      },
      fullName: {
        type: DataTypes.STRING(32),
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      sparcsId: {
        type: DataTypes.STRING(120),
        allowNull: false,
      }
    });
    await queryInterface.createTable("rooms", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      },
      endedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        onDelete: "SET NULL",
        references: {
          model: "users",
          key: "id"
        }
      }
    });
    await queryInterface.createTable("roomadmins", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "rooms",
          key: "id"
        }
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "users",
          key: "id"
        }
      }
    });
    await queryInterface.createTable("roomjoinlogs", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "rooms",
          key: "id"
        }
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "users",
          key: "id"
        }
      },
      ip: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      joinedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      leavedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    });
    await queryInterface.createTable("votetopics", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "rooms",
          key: "id"
        }
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      openAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    });
    await queryInterface.createTable("votechoices", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      topicId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "votetopics",
          key: "id"
        }
      },
      showOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      }
    });
    await queryInterface.createTable("voteballots", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "users",
          key: "id"
        }
      },
      choiceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "votechoices",
          key: "id"
        }
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    });
  },

  down: async (queryInterface: QueryInterface, Sequelize) => {
    await queryInterface.dropTable("voteballots");
    await queryInterface.dropTable("votechoices");
    await queryInterface.dropTable("votetopics");
    await queryInterface.dropTable("roomjoinlogs");
    await queryInterface.dropTable("roomadmins");
    await queryInterface.dropTable("rooms");
    await queryInterface.dropTable("users");
  }
};
