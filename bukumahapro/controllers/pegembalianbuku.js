import DetailPinjams from "../models/detail_pinjam.model.js";
import Bukus from "../models/buku.model.js";
import Mahasiswas from "../models/mahasiswa.model.js";
import Pinjams from "../models/pinjam.model.js";

export const pengembalianBuku = async (req, res) => {

  try {

    for (let i = 0; i < req.body.data.length; i++) {

      // cari detail pinjam
      const detail = await DetailPinjams.findOne({
        where: {
          id: req.body.data[i].id_detail_pinjam
        }
      });

      // cek data ada atau tidak
      if (!detail) {

        return res.status(404).json({
          message: "Detail pinjam tidak ditemukan"
        });

      }

      // validasi sudah dikembalikan
      if (detail.status == 2) {

        return res.status(400).json({
          message: "Buku sudah dikembalikan"
        });

      }

      // validasi jumlah kembali
      if (req.body.data[i].jml_kembali > detail.jml_pinjam) {

        return res.status(400).json({
          message: "Jumlah kembali melebihi jumlah pinjam"
        });

      }

      // kembali semua
      if (req.body.data[i].jml_kembali == detail.jml_pinjam) {

        await DetailPinjams.update(
          {
            status: 2
          },
          {
            where: {
              id: detail.id
            }
          }
        );

      }

      // kembali sebagian
      else {

        await DetailPinjams.update(
          {
            jml_pinjam:
              detail.jml_pinjam -
              req.body.data[i].jml_kembali
          },
          {
            where: {
              id: detail.id
            }
          }
        );

        await DetailPinjams.create({

          pinjam_id: detail.pinjam_id,
          buku_id: detail.buku_id,
          jml_pinjam: req.body.data[i].jml_kembali,
          status: 2

        });

      }

      // tambah stok buku
      await Bukus.increment(
        {
          jumlah: req.body.data[i].jml_kembali
        },
        {
          where: {
            kode_buku: detail.buku_id
          }
        }
      );

    }

    res.json({
      message: "Pengembalian berhasil"
    });

  } catch (error) {

    res.json({
      message: error.message
    });

  }

};



// ==========================
// GET BUKU DIPINJAM
// ==========================
export const getBukuDipinjam = async (req, res) => {

  try {

    const data = await Pinjams.findAll({

      where: {
        nim: req.params.id
      },

      include: [

        {
          model: Mahasiswas,
          attributes: ["nama"]
        },

        {
          model: DetailPinjams,

          where: {
            status: 1
          },

          attributes: [
            "id",
            "jml_pinjam",
            "status"
          ],

          include: [
            {
              model: Bukus,
              attributes: ["judul"]
            }
          ]

        }

      ]

    });

    res.json(data);

  } catch (error) {

    res.json({
      message: error.message
    });

  }

};