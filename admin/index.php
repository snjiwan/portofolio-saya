<?php session_start();

$password = 'admin123'; // Ganti dengan password yang diinginkan

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    if ($_POST['password'] === $password) {
        $_SESSION['admin_logged_in'] = true;
    } else {
        $error = 'Password salah!';
    }
}

if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: index.php');
    exit;
}

$loggedIn = isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - AKSAN KURAJI DERMAWAN</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            background: #0a0a0f;
            color: #e2e8f0;
            min-height: 100vh;
        }
        .container { max-width: 900px; margin: 0 auto; padding: 40px 24px; }
        h1 { font-size: 28px; margin-bottom: 32px; }
        h1 span { background: linear-gradient(135deg, #7c3aed, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .btn {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 12px 28px; border-radius: 50px; font-size: 14px; font-weight: 600;
            text-decoration: none; cursor: pointer; border: none; font-family: inherit;
            transition: 0.3s;
        }
        .btn-primary { background: linear-gradient(135deg, #7c3aed, #06b6d4); color: #fff; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(124,58,237,0.3); }
        .btn-danger { background: #ef4444; color: #fff; }
        .btn-danger:hover { background: #dc2626; }
        .btn-outline { background: transparent; color: #e2e8f0; border: 1px solid rgba(255,255,255,0.15); }
        .btn-outline:hover { border-color: #7c3aed; }
        .btn-sm { padding: 8px 16px; font-size: 12px; }
        .card {
            background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
            border-radius: 16px; padding: 24px; margin-bottom: 24px;
        }
        .card h2 { font-size: 18px; margin-bottom: 16px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px; color: #94a3b8; }
        .form-group input,
        .form-group textarea {
            width: 100%; padding: 12px 16px; border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.05);
            color: #fff; font-size: 14px; font-family: inherit; outline: none; transition: 0.3s;
        }
        .form-group input:focus,
        .form-group textarea:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.15); }
        .form-group input[type="file"] { padding: 10px; }
        .form-group input[type="file"]::file-selector-button {
            padding: 8px 16px; border-radius: 6px; border: none;
            background: rgba(124,58,237,0.2); color: #a78bfa; font-weight: 500; cursor: pointer;
        }
        .alert { padding: 12px 16px; border-radius: 10px; margin-bottom: 16px; font-size: 14px; }
        .alert-success { background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); color: #34d399; }
        .alert-error { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #f87171; }
        .login-box {
            max-width: 400px; margin: 120px auto; text-align: center;
        }
        .login-box .card { text-align: left; }
        .login-box h1 { margin-bottom: 8px; }
        .login-box p { color: #94a3b8; margin-bottom: 24px; font-size: 14px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .award-item {
            background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
            border-radius: 10px; padding: 12px; display: flex; align-items: center; gap: 12px;
        }
        .award-item img { width: 60px; height: 60px; border-radius: 8px; object-fit: cover; }
        .award-item .info { flex: 1; }
        .award-item .info h4 { font-size: 14px; }
        .award-item .info p { font-size: 12px; color: #64748b; }
        .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .top-bar a { color: #94a3b8; text-decoration: none; font-size: 14px; }
        .top-bar a:hover { color: #fff; }
        .message { position: fixed; top: 20px; right: 20px; z-index: 999; }
        @media (max-width: 640px) {
            .grid-2 { grid-template-columns: 1fr; }
            .container { padding: 24px 16px; }
        }
    </style>
</head>
<body>

<?php if ($loggedIn): ?>

    <div class="container">
        <div class="top-bar">
            <h1>Admin <span>Panel</span></h1>
            <div>
                <a href="../" class="btn btn-outline btn-sm"><i class="fas fa-arrow-left"></i> Lihat Portfolio</a>
                <a href="?logout=1" class="btn btn-danger btn-sm"><i class="fas fa-sign-out-alt"></i> Logout</a>
            </div>
        </div>

        <?php if (isset($_GET['upload']) && $_GET['upload'] === 'cv_ok'): ?>
            <div class="alert alert-success">CV berhasil diupload!</div>
        <?php endif; ?>
        <?php if (isset($_GET['upload']) && $_GET['upload'] === 'award_ok'): ?>
            <div class="alert alert-success">Penghargaan berhasil diupload!</div>
        <?php endif; ?>
        <?php if (isset($_GET['delete']) && $_GET['delete'] === 'ok'): ?>
            <div class="alert alert-success">Penghargaan berhasil dihapus!</div>
        <?php endif; ?>
        <?php if (isset($_GET['error'])): ?>
            <div class="alert alert-error"><?= htmlspecialchars($_GET['error']) ?></div>
        <?php endif; ?>

        <!-- Upload Foto Profil -->
        <div class="card">
            <h2><i class="fas fa-user" style="color: #a78bfa;"></i> Upload Foto Profil</h2>
            <div style="display:flex;align-items:center;gap:20px;margin-bottom:16px;flex-wrap:wrap;">
                <div id="profilePreview" style="width:100px;height:100px;border-radius:50%;overflow:hidden;background:rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:center;border:2px solid rgba(255,255,255,0.1);flex-shrink:0;">
                    <i class="fas fa-user" style="font-size:36px;color:#64748b;"></i>
                </div>
                <p style="font-size:13px;color:#94a3b8;">Foto akan muncul di halaman portfolio setelah diupload.</p>
            </div>
            <form action="../php/upload_profile.php" method="post" enctype="multipart/form-data" id="profileForm">
                <div class="form-group">
                    <label>File Gambar (JPG/PNG/GIF/WebP, max 5MB)</label>
                    <input type="file" name="profile_file" accept=".jpg,.jpeg,.png,.gif,.webp" required>
                </div>
                <button type="submit" class="btn btn-primary"><i class="fas fa-upload"></i> Upload Foto</button>
            </form>
        </div>

        <!-- Upload CV -->
        <div class="card">
            <h2><i class="fas fa-file-pdf" style="color: #a78bfa;"></i> Upload CV</h2>
            <form action="../php/upload_cv.php" method="post" enctype="multipart/form-data" id="cvForm">
                <div class="form-group">
                    <label>File CV (PDF/DOC/DOCX, max 5MB)</label>
                    <input type="file" name="cv_file" accept=".pdf,.doc,.docx" required>
                </div>
                <button type="submit" class="btn btn-primary"><i class="fas fa-upload"></i> Upload CV</button>
            </form>
        </div>

        <!-- Upload Award -->
        <div class="card">
            <h2><i class="fas fa-trophy" style="color: #f59e0b;"></i> Upload Penghargaan</h2>
            <form action="../php/upload_award.php" method="post" enctype="multipart/form-data" id="awardForm">
                <div class="form-group">
                    <label>Judul Penghargaan *</label>
                    <input type="text" name="title" placeholder="Contoh: Juara 1 Hackathon 2024" required>
                </div>
                <div class="form-group">
                    <label>Deskripsi (opsional)</label>
                    <textarea name="description" rows="2" placeholder="Deskripsi singkat"></textarea>
                </div>
                <div class="form-group">
                    <label>File Gambar (JPG/PNG/GIF/WebP, max 5MB)</label>
                    <input type="file" name="award_file" accept=".jpg,.jpeg,.png,.gif,.webp" required>
                </div>
                <button type="submit" class="btn btn-primary"><i class="fas fa-upload"></i> Upload Penghargaan</button>
            </form>
        </div>

        <!-- Daftar Awards -->
        <div class="card">
            <h2><i class="fas fa-list" style="color: #a78bfa;"></i> Daftar Penghargaan</h2>
            <div id="awardList">
                <p style="color: #64748b; font-size: 14px;">Memuat...</p>
            </div>
        </div>
    </div>

    <script>
    async function loadProfilePreview() {
        try {
            const res = await fetch('../php/get_profile.php');
            const data = await res.json();
            if (data.success && data.has_photo) {
                document.getElementById('profilePreview').innerHTML = `<img src="${data.url}?t=${Date.now()}" style="width:100%;height:100%;object-fit:cover;">`;
            }
        } catch (err) {}
    }
    loadProfilePreview();

    document.getElementById('profileForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const form = this;
        const formData = new FormData(form);
        const btn = form.querySelector('button');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengupload...';
        btn.disabled = true;

        try {
            const res = await fetch(form.action, { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) {
                await loadProfilePreview();
                alert('Foto profil berhasil diupload!');
                form.reset();
            } else {
                alert('Error: ' + data.message);
            }
        } catch (err) {
            alert('Gagal mengupload foto');
        }
        btn.innerHTML = '<i class="fas fa-upload"></i> Upload Foto';
        btn.disabled = false;
    });

    document.getElementById('cvForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const form = this;
        const formData = new FormData(form);
        const btn = form.querySelector('button');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengupload...';
        btn.disabled = true;

        try {
            const res = await fetch(form.action, { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) {
                window.location.href = '?upload=cv_ok';
            } else {
                alert('Error: ' + data.message);
                btn.innerHTML = '<i class="fas fa-upload"></i> Upload CV';
                btn.disabled = false;
            }
        } catch (err) {
            alert('Gagal mengupload CV');
            btn.innerHTML = '<i class="fas fa-upload"></i> Upload CV';
            btn.disabled = false;
        }
    });

    document.getElementById('awardForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const form = this;
        const formData = new FormData(form);
        const btn = form.querySelector('button');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengupload...';
        btn.disabled = true;

        try {
            const res = await fetch(form.action, { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) {
                window.location.href = '?upload=award_ok';
            } else {
                alert('Error: ' + data.message);
                btn.innerHTML = '<i class="fas fa-upload"></i> Upload Penghargaan';
                btn.disabled = false;
            }
        } catch (err) {
            alert('Gagal mengupload');
            btn.innerHTML = '<i class="fas fa-upload"></i> Upload Penghargaan';
            btn.disabled = false;
        }
    });

    async function loadAwards() {
        try {
            const res = await fetch('../php/get_awards.php');
            const data = await res.json();
            const list = document.getElementById('awardList');

            if (data.success && data.awards.length > 0) {
                list.innerHTML = '<div class="grid-2">' + data.awards.map(a => `
                    <div class="award-item">
                        <img src="${a.file_url}" alt="${a.title}" onerror="this.style.display='none'">
                        <div class="info">
                            <h4>${a.title}</h4>
                            <p>${a.description || 'Tidak ada deskripsi'}</p>
                        </div>
                        <form method="post" action="../php/delete_award.php" onsubmit="return confirm('Hapus penghargaan ini?')">
                            <input type="hidden" name="id" value="${a.id}">
                            <button type="submit" class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
                        </form>
                    </div>
                `).join('') + '</div>';
            } else {
                list.innerHTML = '<p style="color: #64748b; font-size: 14px;">Belum ada penghargaan. Upload sekarang!</p>';
            }
        } catch (err) {
            document.getElementById('awardList').innerHTML = '<p style="color: #f87171; font-size: 14px;">Gagal memuat data.</p>';
        }
    }

    loadAwards();
    </script>

<?php else: ?>

    <!-- Login -->
    <div class="login-box">
        <h1>Admin <span>Panel</span></h1>
        <p>Masukkan password untuk mengelola portfolio</p>
        <?php if (isset($error)): ?>
            <div class="alert alert-error"><?= $error ?></div>
        <?php endif; ?>
        <div class="card">
            <form method="post">
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" name="password" placeholder="Masukkan password" required autofocus>
                </div>
                <button type="submit" name="login" class="btn btn-primary btn-block"><i class="fas fa-lock"></i> Masuk</button>
            </form>
        </div>
        <a href="../" style="color: #64748b; font-size: 14px; text-decoration: none;">&larr; Kembali ke Portfolio</a>
    </div>

<?php endif; ?>
</body>
</html>
