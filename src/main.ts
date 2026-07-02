import { initializeApp } from 'firebase/app';
// Kita tambahkan fitur query, where, dan getDocs untuk mencari data
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore'; 

// 1. MASUKKAN KONFIGURASI ASLI ANDA DI SINI
const firebaseConfig = {
  apiKey: "ISI_API_KEY_ANDA",
  authDomain: "ISI_PROJECT_ID.firebaseapp.com",
  projectId: "ISI_PROJECT_ID",
  storageBucket: "ISI_PROJECT_ID.appspot.com",
  messagingSenderId: "ISI_SENDER_ID",
  appId: "ISI_APP_ID"
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