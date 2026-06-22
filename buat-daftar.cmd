@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ===============================================
echo   Membuat daftar foto ^& lagu otomatis...
echo ===============================================

> daftar.js echo /* ===================================================
>> daftar.js echo    DIBUAT OTOMATIS oleh buat-daftar.cmd -- jangan diedit manual.
>> daftar.js echo    Mau ubah foto/lagu? Tinggal tambah/hapus file di folder
>> daftar.js echo    "foto" / "music", lalu klik 2x file ini lagi.
>> daftar.js echo =================================================== */
>> daftar.js echo.
>> daftar.js echo const DAFTAR_FOTO = [

set /a jml_foto=0
for %%F in (foto\*.jpg foto\*.jpeg foto\*.png foto\*.webp foto\*.gif) do (
  if exist "%%F" (
    >> daftar.js echo   "%%~nxF",
    set /a jml_foto+=1
  )
)
>> daftar.js echo ];
>> daftar.js echo.
>> daftar.js echo const DAFTAR_LAGU = [

set /a jml_lagu=0
for %%F in (music\*.mp3 music\*.m4a music\*.ogg music\*.wav) do (
  if exist "%%F" (
    >> daftar.js echo   "%%~nxF",
    set /a jml_lagu+=1
  )
)
>> daftar.js echo ];

echo.
echo SELESAI! Foto ditemukan: %jml_foto% ^| Lagu ditemukan: %jml_lagu%
echo Sekarang refresh web-nya (Ctrl+Shift+R).
echo.
pause
