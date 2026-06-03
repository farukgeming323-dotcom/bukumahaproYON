import express from "express";

import {
    getAllPinjam,
    insertPinjam,
    cariPinjamByID,
    deletePinjam,
    cariBukuPinjam,
    returnBuku,
    laporanReturnBuku,
} from "../controllers/pinjam.controllers.js";

const router = express.Router();
router.get("/laporan-return", laporanReturnBuku);
router.get("/dipinjam/:nim",cariBukuPinjam);
router.post("/kembali",returnBuku);

router.get("/", getAllPinjam);
router.post("/", insertPinjam);
router.get("/:id", cariPinjamByID);
router.delete("/:id", deletePinjam);

export default router;