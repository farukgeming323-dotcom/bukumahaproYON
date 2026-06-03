import { Sequelize } from "sequelize";
import db from "../config/db.config.js";
import Bukus from "./buku.model.js";
import Pinjams from "./pinjam.model.js";

const { DataTypes } = Sequelize;

const DetailPinjams = db.define(
    "detail_pinjams",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        pinjam_id: {
            type: DataTypes.INTEGER,
        },
        buku_id: {
            type: DataTypes.INTEGER,
        },
        jml_pinjam: {
            type: DataTypes.INTEGER,
        },
        status: {
            type: DataTypes.INTEGER,
        },
        created_at: {
            type: DataTypes.DATE,
        },
        updated_at: {
            type: DataTypes.DATE,
        },
    },
    {
        freezeTableName: true,
    }
);

Bukus.hasMany(DetailPinjams, { foreignKey: "buku_id" });
DetailPinjams.belongsTo(Bukus, { foreignKey: "buku_id" });

Pinjams.hasMany(DetailPinjams, { foreignKey: "pinjam_id" });
DetailPinjams.belongsTo(Pinjams, { foreignKey: "pinjam_id" });

export default DetailPinjams;