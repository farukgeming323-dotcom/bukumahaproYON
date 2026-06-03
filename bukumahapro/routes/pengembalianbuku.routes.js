import express from "express";

import {
  pengembalianBuku,
  getBukuDipinjam
} from "../controllers/pegembalianbuku.js";

const router = express.Router();

router.get("/pinjam/:id", getBukuDipinjam);
router.post("/kembali", pengembalianBuku);

export default router;