# Next.js dengan autentikasi

## Changelog

### Form Login dan Sign Up

- Membuat laman form `/login` dan `/signup` dengan fungsionalitas sampai mencetak data ke _Console_
- Pada `/signup` menambahkan validasi kecocokkan kata sandi di sisi _client_

### Fungsionalitas Sign Up

- Memvalidasi tiap data yang dikirim oleh form dan menampilkan pesan _error_-nya
- Memvalidasi apakah email sudah terdaftar atau belum
- Menggunakan [bcryptjs](https://www.npmjs.com/package/bcryptjs) untuk _hashing_ kata sandi sebelum disimpan
- Menyimpan data ke [Firebase Realtime Database](https://console.firebase.google.com/)
- Mengalihkan laman ke `/login` setelah pendaftaran berhasil

### Fungsionalitas Login

- Instal `next-auth` dan menulis konfigurasi sesuai [dokumentasinya](https://next-auth.js.org/getting-started/example)
- Pada `[...nextauth].js` memvalidasi tiap data yang dikirim oleh form `/login`
- Mengalihkan laman ke `/` setelah login berhasil
- Menggunakan _session_ untuk menampilkan nama akun dan tombol _logout_
- Mengalihkan laman `/login` dan `/signup` ke `/` ketika memiliki _session_

### Verifikasi akun

- Menggunakan [Nodemailer](https://nodemailer.com/about/) untuk mengirim email verifikasi akun
