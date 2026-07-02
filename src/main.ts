import { initializeApp } from 'firebase/app';
// Kita menambahkan 'query', 'where', dan 'getDocs' untuk mencari data NIM
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore'; 

// 1. Masukkan konfigurasi Firebase Anda di sini
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

// Variabel untuk mengingat siapa yang sedang login
let mahasiswaAktif = { nama: "", nim: "" };

// Mengambil elemen-elemen dari HTML
const halamanLogin = document.getElementById('halamanLogin');
const halamanAbsen = document.getElementById('halamanAbsen');
const formLogin = document.getElementById('formLogin');
const formAbsen = document.getElementById('formAbsen');
const pesanErrorLogin = document.getElementById('pesanErrorLogin');
const namaMahasiswaTampil = document.getElementById('namaMahasiswaTampil');
const pesanSukses = document.getElementById('pesanSukses');

// 2. SISTEM LOGIN: Mengecek NIM
if (formLogin) {
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault(); // Mencegah reload halaman
    const nimInput = (document.getElementById('nimLogin') as HTMLInputElement).value;
    
    try {
      // Mencari data di Firebase di mana field 'nim' sama dengan yang diketik
      const q = query(collection(db, "mahasiswa"), where("nim", "==", nimInput));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Jika NIM tidak ditemukan di database
        if (pesanErrorLogin) pesanErrorLogin.style.display = 'block';
      } else {
        // Jika NIM ditemukan, sembunyikan pesan error
        if (pesanErrorLogin) pesanErrorLogin.style.display = 'none';
        
        // Ambil nama mahasiswa dari database
        querySnapshot.forEach((doc) => {
          mahasiswaAktif.nama = doc.data().nama;
          mahasiswaAktif.nim = doc.data().nim;
        });

        // Pindah ke Halaman Absen
        if (halamanLogin) halamanLogin.style.display = 'none';
        if (halamanAbsen) halamanAbsen.style.display = 'block';
        if (namaMahasiswaTampil) namaMahasiswaTampil.innerText = `Halo, ${mahasiswaAktif.nama}!`;
      }
    } catch (error) {
      console.error("Error pencarian data:", error);
      alert("Gagal mengecek NIM. Pastikan koneksi internet lancar.");
    }
  });
}

// 3. SISTEM ABSENSI: Menyimpan data setelah login berhasil
if (formAbsen) {
  formAbsen.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = (document.getElementById('status') as HTMLSelectElement).value;

    try {
      // Simpan absen ke koleksi 'data_kehadiran'
      await addDoc(collection(db, "data_kehadiran"), {
        nama: mahasiswaAktif.nama,
        nim: mahasiswaAktif.nim,
        status: status,
        waktu_absen: new Date().toLocaleString("id-ID")
      });
      
      // Tampilkan pesan sukses
      (formAbsen as HTMLFormElement).reset();
      if (pesanSukses) pesanSukses.style.display = 'block';
      
      // Setelah 3 detik, kembalikan mahasiswa ke halaman Login awal
      setTimeout(() => {
        if (pesanSukses) pesanSukses.style.display = 'none';
        if (halamanAbsen) halamanAbsen.style.display = 'none';
        if (halamanLogin) halamanLogin.style.display = 'block';
        (document.getElementById('nimLogin') as HTMLInputElement).value = ""; // Kosongkan input
      }, 3000);

    } catch (error) {
      console.error("Gagal mengirim:", error);
      alert("Terjadi kesalahan sistem.");
    }
  });
}