import { Sequelize } from "sequelize-typescript";

export default class Connection {
  private static conn: Sequelize | undefined;
  static db() {
    if (!this.conn) {
      this.conn = new Sequelize({
        username: process.env.DB_USERNAME!,
        password: process.env.DB_PASSWORD!,
        database: process.env.DB_NAME!,
        host: process.env.DB_HOSTNAME!,
        port: parseInt(process.env.DB_PORT ?? "5432"),
        dialect: "postgres",
        models: [__dirname + "/models/*.ts"],
      });
    }
    return this.conn;
  }
}