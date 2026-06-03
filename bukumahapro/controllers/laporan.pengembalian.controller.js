import DetailPinjams from "../models/detail_pinjam.model.js";
import Pinjams from "../models/pinjam.model.js";
import Mahasiswas from "../models/mahasiswa.model.js";
import Bukus from "../models/buku.model.js";

export const laporanPengembalian = async (req, res) => {

  try {

    const data = await DetailPinjams.findAll({

      where: {
        status: 2
      },

      include: [

        {
          model: Pinjams,

          include: [
            {
              model: Mahasiswas,
              attributes: ["nama"]
            }
          ]

        },

        {
          model: Bukus,
          attributes: ["kode_buku", "judul"]
        }

      ]

    });

    // hitung keterlambatan
    for (let i = 0; i < data.length; i++) {

      const pinjam = data[i].pinjam;

      // cek data pinjam ada atau tidak
      if (!pinjam) {

        data[i].dataValues.jumlah_hari_terlambat = 0;
        continue;

      }

      // tanggal batas kembali
      const batasKembali = new Date(
        pinjam.tanggal_kembali
      );

      // tanggal pengembalian
      const tanggalPengembalian = new Date(
        data[i].updated_at
      );

      batasKembali.setHours(0, 0, 0, 0);
      tanggalPengembalian.setHours(0, 0, 0, 0);

      // hitung selisih hari
      const selisihHari =
        (tanggalPengembalian - batasKembali) /
        (1000 * 60 * 60 * 24);

      data[i].dataValues.jumlah_hari_terlambat =
        selisihHari > 0
          ? selisihHari + " hari"
          : "0 hari";

    }

    res.status(200).json(data);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};