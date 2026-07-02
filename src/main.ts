import { initializeApp } from 'firebase/app';
// Kita tambahkan fitur query, where, dan getDocs untuk mencari data
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'; 

// 1. MASUKKAN KONFIGURASI ASLI ANDA DI SINI
const firebaseConfig = {
   apiKey: "AIzaSyCLrfjtCMPUdqONvg3uIeHtOm2pejWunVc",
  authDomain: "absen-online-pbk.firebaseapp.com",
  projectId: "absen-online-pbk",
  storageBucket: "absen-online-pbk.firebasestorage.app",
  messagingSenderId: "870885899226",
  appId: "1:870885899226:web:2847c443dab9a3b954dee3",
  measurementId: "G-TKKBLF7V0V"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Tangkap elemen dari HTML
const layarLogin = document.getElementById('layar-login');
const layarAbsen = document.getElementById('layar-absen');
const formLogin = document.getElementById('formLogin');
const nimInput = document.getElementById('nimInput') as HTMLInputElement;
const pesanError = document.getElementById('pesanError');
const namaTampil = document.getElementById('namaTampil');

let dataMahasiswaSementara: any = null;

// 2. LOGIKA SAAT TOMBOL LOGIN DITEKAN
if (formLogin) {
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nimYangDiketik = nimInput.value;

    try {
      // Cari di database: adakah mahasiswa dengan NIM tersebut?
      const q = query(collection(db, "data_mahasiswa"), where("nim", "==", nimYangDiketik));
      const hasilPencarian = await getDocs(q);

      if (!hasilPencarian.empty) {
        // Jika NIM KETEMU!
        hasilPencarian.forEach((doc) => {
          dataMahasiswaSementara = doc.data(); // Simpan data namanya
        });
        
        // Pindah layar
        if (layarLogin && layarAbsen && namaTampil) {
          layarLogin.style.display = 'none'; // Sembunyikan login
          layarAbsen.style.display = 'block'; // Tampilkan absen
          namaTampil.innerText = `Selamat bertugas, ${dataMahasiswaSementara.nama}!`; // Panggil namanya
        }
        if (pesanError) pesanError.style.display = 'none';

      } else {
        // Jika NIM TIDAK DITEMUKAN!
        if (pesanError) pesanError.style.display = 'block';
      }
    } catch (error) {
      console.error("Gagal login:", error);
      alert("Terjadi kesalahan koneksi internet.");
    }
  });
}