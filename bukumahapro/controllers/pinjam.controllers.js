import Bukus from "../models/buku.model.js";
import DetailPinjams from "../models/detail_pinjam.model.js";
import Mahasiswas from "../models/mahasiswa.model.js";
import Pinjams from "../models/pinjam.model.js";
import Prodis from "../models/prodi.model.js";
import { Sequelize } from "sequelize";

export const getAllPinjam = async (req, res) => {
  try {
    const data = await Pinjams.findAll({
      include: [
        {
          model: Mahasiswas,
          attributes: ["nama"],
          include: [{ model: Prodis, attributes: ["nama_prodi"] }],
        },
        {
          model: DetailPinjams,
          include: [{ model: Bukus, attributes: ["judul"] }],
        },
      ],
    });
    res.json(data);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const tambahPinjam = async (req, res) => {
  try {
    await Pinjams.create(req.body);
    res.json({ message: "Data Pinjam berhasil disimpan" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const cariPinjamByID = async (req, res) => {
  try {
    const data = await Pinjams.findAll({
      include: [
        { model: Mahasiswas },
        {
          model: DetailPinjams,
          include: [{ model: Bukus, attributes: ["judul"] }],
        },
      ],
      where: {
        nim: req.params.id,
      },
    });
    res.json(data[0]);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const updatePinjam = async (req, res) => {
  try {
    await Pinjams.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.json({ message: "Data Pinjam berhasil diupdate" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const deletePinjam = async (req, res) => {
  try {
    await Pinjams.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json({ message: "Data Pinjam berhasil dihapus" });
  } catch (error) {
    res.json({ message: error.message });
  }
};



export const insertPinjam = async (req, res) => {
  try {
    const pinjam = await Pinjams.create(
      {
        tanggal_pinjam: req.body.tanggal_pinjam,
        tanggal_kembali: req.body.tanggal_kembali,
        nim: req.body.nim,
        pegawai_id: req.body.pegawai_id,
        detail_pinjams: req.body.detail_pinjams,
      },
      {
        include: DetailPinjams,
      }
    );

    if (pinjam && req.body.detail_pinjams) {
      for (let i = 0; i < req.body.detail_pinjams.length; i++) {
        Bukus.decrement(
          {jumlah: req.body.detail_pinjams[i].jml_pinjam},
          {where: {kode_buku: req.body.detail_pinjams[i].buku_id}}
        );
      }
    }

    res.json(pinjam);
  } catch (error) {
    res.json({ message: error.message });
  }
};

// NOMOR 1A
export const cariBukuPinjam = async (req, res) => {
  try {
    const data = await Pinjams.findAll({
      attributes: [],

      where: {
        nim: req.params.nim,
      },

      include: [
        {
          model: Mahasiswas,
          attributes: ["nama"],
        },

        {
          model: DetailPinjams,
          attributes: ["id", "jml_pinjam", "status"],

          where: {
            status: 1,
          },

          include: [
            {
              model: Bukus,
              attributes: ["judul"],
            },
          ],
        },
      ],
    });

    res.json(data);
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

// NOMOR 1B
export const returnBuku = async (req, res) => {
    try {
      // {
      //  "buku_kembali": [
      //    {
      //      "detail_pinjams_id": :id,
      //      "jml_kembali": :int
      //    }
      //  ]
      // }
      for (const item of req.body.buku_kembali) {

        // mencari id dari tabel detail_pinjams
        const detail = await DetailPinjams.findOne({
          where: {
            id: item.detail_pinjam_id,
            status: 1,
          },
        });

        if (!detail) {
          return res.json({
            message: "Data pinjam tidak ditemukan",
          });
        }

        // validasi jumlah
        if (item.jml_kembali > detail.jml_pinjam) {
          return res.json({
            message: "Jumlah kembali melebihi jumlah pinjam",
          });
        }

        // jika kembali semua, langsung dalam 1 row
        if (item.jml_kembali == detail.jml_pinjam) {
          await DetailPinjams.update(
            {
              status: 2,
            },
            {
              where: {
                id: detail.id,
              },
            },
          );
        } else {
          // buat row baru untuk pengembalian buku
          await DetailPinjams.create({
            pinjam_id: detail.pinjam_id,
            buku_id: detail.buku_id,
            jml_pinjam: item.jml_kembali,
            status: 2,
          });

          // update sisa pinjaman dari row pertama
          await DetailPinjams.update(
            {
              jml_pinjam: detail.jml_pinjam - item.jml_kembali,
            },
            {
              where: {
                id: detail.id,
              },
            },
          );
        }

        // tambah stok saat buku dikembalikan
        await Bukus.increment("jumlah", {
          by: item.jml_kembali,
          where: {
            kode_buku: detail.buku_id,
          },
        });
      }

      res.json({
        message: "Pengembalian berhasil",
      });
    } catch (error) {
      res.json({
        message: error.message,
      });
    }
  };

// NOMOR 2
export const laporanReturnBuku = async (req, res) => {
  try {
    const data = await Pinjams.findAll({
      attributes: ["tanggal_pinjam", "tanggal_kembali"],

      include: [
        {
          model: Mahasiswas,
          as: "mahasiswa",
          attributes: ["nama"],
        },

        {
          model: DetailPinjams,
          as: "detail_pinjams",
          where: {
            status: 2,
          },
          attributes: ["jml_pinjam", "updated_at"],

          include: [
            {
              model: Bukus,
              as: "buku",
              attributes: ["judul"],
            },
          ],
        },
      ],
    });

    const hasil = data.map((p) => ({
      nama_mahasiswa: p.mahasiswa?.nama || "-",
      tanggal_pinjam: p.tanggal_pinjam,
      buku: (p.detail_pinjams || []).map((d) => {

        // tanggal batas pengembalian
        const batasKembali = new Date(p.tanggal_kembali);

        // hitung selisih hari
        const tanggalPengembalian = new Date(d.updated_at);

        let terlambat = Math.ceil(
          (tanggalPengembalian - batasKembali) / (1000 * 60 * 60 * 24),
        );

        // jika belum terlambat
        if (terlambat < 0) {
          terlambat = 0;
        }

        return {
          judul_buku: d.buku?.judul || "-",
          jumlah_pinjam: d.jml_pinjam,
          tanggal_pengembalian: d.updated_at,
          jumlah_hari_terlambat: terlambat,
        };
      }),
    }));

    res.json(hasil);
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};