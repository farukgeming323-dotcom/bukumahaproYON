import Bukus from "../models/buku.model.js";
import DetailPinjams from "../models/detail_pinjam.model.js";
import Mahasiswas from "../models/mahasiswa.model.js";
import Pinjams from "../models/pinjam.model.js";

export const getAllDetailPinjam = async (req, res) => {
    try {
        const data = await DetailPinjams.findAll({
            include: [{model: Pinjams, include: [{model: Mahasiswas, attributes: ["nama"]}]},
                {model: Bukus, attributes: ["judul"]},
            ],
        });
        res.json(data);
    } catch (error) {
        res.json({ message: error.message });
    }
};

export const tambahDetailPinjam = async (req, res) => {
    try {
        await DetailPinjams.create(req.body);
        res.json({ message: "Detail Pinjam berhasil disimpan" });
    } catch (error) {
        res.json({ message: error.message });
    }
};

export const cariDetailByID = async (req, res) => {
    try {
        const data = await DetailPinjams.findAll({
            include: [{model: Pinjams,
                where: {nim: req.params.id},
                include:{model: Mahasiswas, attributes: ["nama"]}},
            {model: Bukus, attributes: ['judul']}]
        });
        res.json(data[0]);
    } catch (error) {
        res.json({ message: error.message });
    }
};

export const updateDetailPinjam = async (req, res) => {
    try {
        await DetailPinjams.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.json({ message: "Detail Pinjam berhasil diupdate" });
    } catch (error) {
        res.json({ message: error.message });
    }
};

export const deleteDetailPinjam = async (req, res) => {
    try {
        await DetailPinjams.destroy({
            where: {
                id: req.params.id
            }
        });
        res.json({ message: "Detail Pinjam berhasil dihapus" });
    } catch (error) {
        res.json({ message: error.message });
    }
};