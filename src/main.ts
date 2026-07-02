function prosesLogin() {
  const inputID = (document.getElementById('nim') as HTMLInputElement).value;

  // Cek apakah ID diawali dengan "ADM-"
  if (inputID.startsWith("ADM-")) {
    // Arahkan ke dashboard admin
    window.location.href = "admin_dashboard.html";
  } 
  // Jika bukan admin, arahkan ke absen mahasiswa
  else if (inputID.length > 0) {
    window.location.href = "mahasiswa_absen.html";
  } 
  else {
    alert("Harap masukkan NIM atau ID Admin!");
  }
}