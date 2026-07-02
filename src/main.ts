import { initializeApp } from 'firebase/app';
// Tambahkan collection dan addDoc untuk mengirim data
import { getFirestore, collection, addDoc } from 'firebase/firestore'; 

// 1. Masukkan konfigurasi Firebase Anda di sini
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

// 2. Logika untuk menangani saat formulir dikirim
const form = document.getElementById('formAbsen');
const pesan = document.getElementById('pesanSukses');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Mencegah halaman reload

    // Ambil data yang diketik mahasiswa
    const nama = (document.getElementById('nama') as HTMLInputElement).value;
    const nim = (document.getElementById('nim') as HTMLInputElement).value;
    const status = (document.getElementById('status') as HTMLSelectElement).value;

    try {
      // Kirim data ke koleksi "data_kehadiran" di Firebase
      await addDoc(collection(db, "data_kehadiran"), {
        nama: nama,
        nim: nim,
        status: status,
        waktu_absen: new Date().toLocaleString("id-ID")
      });
      
      // Kosongkan formulir dan tampilkan pesan sukses
      (form as HTMLFormElement).reset();
      if (pesan) pesan.style.display = 'block';
      setTimeout(() => {
        if (pesan) pesan.style.display = 'none';
      }, 3000);

    } catch (error) {
      console.error("Gagal mengirim:", error);
      alert("Terjadi kesalahan. Pastikan internet lancar.");
    }
  });
}