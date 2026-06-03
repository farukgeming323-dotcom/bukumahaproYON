import express from "express";

import {
    getAllDetailPinjam,
    tambahDetailPinjam,
    cariDetailByID,
    updateDetailPinjam,
    deleteDetailPinjam
} from "../controllers/detail_pinjam.controllers.js";

const router = express.Router();

router.get("/", getAllDetailPinjam);
router.post("/", tambahDetailPinjam);
router.get("/:id", cariDetailByID);
router.patch("/:id", updateDetailPinjam);
router.delete("/:id", deleteDetailPinjam);

export default router;