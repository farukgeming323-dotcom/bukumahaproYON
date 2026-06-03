import express from "express";

import {
  laporanPengembalian
} from "../controllers/laporan.pengembalian.controller.js";

const router = express.Router();

router.get("/", laporanPengembalian);

export default router;