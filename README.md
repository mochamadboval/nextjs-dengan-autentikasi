# Next.js dengan autentikasi

## Changelog

### Form Login dan Sign Up

- Membuat laman form `/login` dan `/signup` dengan fungsionalitas sampai mencetak data ke _Console_
- Pada `/signup` menambahkan validasi kecocokkan kata sandi di sisi _client_

### Fungsionalitas Sign Up

- Memvalidasi apakah email sudah terdaftar atau belum dan menampilkan pesan _error_-nya
- Menggunakan [bcryptjs](https://www.npmjs.com/package/bcryptjs) untuk _hashing_ kata sandi sebelum disimpan
- Menyimpan data ke [Firebase Realtime Database](https://console.firebase.google.com/)
