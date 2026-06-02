/**
 * TRAX-AR ENGINE BACKEND - STABLE RELEASE
 * Cara Eksekusi: node server.js
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'universal_ar_database.json');

app.use(cors({ origin: '*' }));
app.use(express.json());

// Membuat file database otomatis jika kosong
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf8');
}

// Endpoint Ambil Lintasan Lama (GET)
app.get('/api/v1/path', (req, res) => {
    fs.readFile(DB_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ status: "error", message: "Gagal membaca database" });
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(data);
    });
});

// Endpoint Simpan Titik Koordinat Baru (POST)
app.post('/api/v1/path', (req, res) => {
    const { lat, lng, time } = req.body;
    
    if (lat === undefined || lng === undefined) {
        return res.status(400).json({ status: "fail", message: "Parameter tidak lengkap." });
    }

    fs.readFile(DB_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ status: "error" });
        
        const database = JSON.parse(data);
        database.push({
            id: database.length + 1,
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            time: time || Date.now()
        });

        fs.writeFile(DB_FILE, JSON.stringify(database, null, 2), 'utf8', (err) => {
            if (err) return res.status(500).json({ status: "error" });
            console.log(`[TEREKAM] Titik Baru Berhasil Disimpan: ${lat}, ${lng}`);
            res.status(201).json({ status: "success" });
        });
    });
});

app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` 🚀 SERVER DATABASES CORE AR AKTIF DI PORT : ${PORT}`);
    console.log(`====================================================`);
});