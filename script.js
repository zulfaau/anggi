document.addEventListener('DOMContentLoaded', () => {
    // Referensi elemen DOM yang dibutuhkan
    const carouselTrack = document.getElementById('carouselTrack');
    const prevSlideButton = document.getElementById('prevSlide');
    const nextSlideButton = document.getElementById('nextSlide');
    
    const playPauseButton = document.getElementById('playPauseButton');
    const birthdaySong = document.getElementById('birthdaySong');

    const currentSlideNumberSpan = document.getElementById('currentSlideNumber');
    const totalSlidesSpan = document.getElementById('totalSlides');

    let currentSlideIndex = 0;
    let isPlaying = false;

    // --- Variabel untuk Swipe Gesture ---
    let startX = 0; // Posisi X awal sentuhan
    let endX = 0;   // Posisi X akhir sentuhan
    const threshold = 50; // Jarak minimal geseran (dalam piksel) untuk dianggap sebagai swipe
    let isSwiping = false; // Flag untuk membedakan swipe dari klik/tap

    // --- DATA KARTU ULANG TAHUN DITENTUKAN DI SINI ---
    const slidesData = [
        {
            name: "Anggi",
            image: "foto1.jpg", 
            message: "Halo Anggi, happy birthday!"
        },
        {
            name: "Anggi", 
            image: "foto2.jpg", 
            message: "Pibesday semoga semua impian lu terwujud di tahun ini, sekecil apapun itu harapan lu semoga pelan-pelan tetap tercapai yaa semua wishlist lu, semoga apa yang lagi lu jalanin sekarang semuanya dipermudah. Bahagia selalu Anggi, sehat-sehat yaaaa. 🎉🎂"
        },
        {
            name: "Anggi", 
            image: "foto3.jpg", 
            message: "Maaf yaa anggi agak telat ngasihnya ke lu, pokonya nanti kalau butuh apa-apa bisa chat gua ya. Sekali lagi happy level up day, many happy returns and all the best on your special day."
        }
    ];

    // --- Path Lagu Ulang Tahun Langsung ---
    birthdaySong.src = 'Lagu.m4a'; //
    birthdaySong.load();

    // --- Fungsi untuk Membuat dan Menambahkan Slide ke DOM ---
    function createAndAppendSlides() {
        carouselTrack.innerHTML = '';
        slidesData.forEach((data, index) => {
            const newSlideElement = document.createElement('div');
            newSlideElement.classList.add('carousel-slide', 'birthday-card');
            newSlideElement.setAttribute('data-slide-id', index);
            newSlideElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">
                        <img src="${data.image}" alt="Foto Ulang Tahun" class="birthday-image">
                        <h2 class="birthday-name-placeholder">${data.name}</h2>
                        <p class="message-preview">Ketuk kartu untuk pesan spesial!</p>
                    </div>
                    <div class="card-back">
                        <p class="message-text">${data.message}</p>
                    </div>
                </div>
            `;
            carouselTrack.appendChild(newSlideElement);
        });
        totalSlidesSpan.textContent = slidesData.length;
    }

    // --- Fungsi Helper untuk Update UI Carousel ---
    function updateSlideDisplay() {
        const slides = document.querySelectorAll('.carousel-slide');
        if (slides.length === 0) {
             currentSlideNumberSpan.textContent = 0;
             return;
        }

        carouselTrack.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

        currentSlideNumberSpan.textContent = currentSlideIndex + 1;

        slides.forEach(slide => slide.classList.remove('flipped'));
    }

    // --- Event Listeners ---

    // Navigasi Carousel (Tombol)
    prevSlideButton.addEventListener('click', () => {
        console.log("Tombol PREV diklik!"); // Debugging
        if (slidesData.length <= 1) return;
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            updateSlideDisplay();
        } else {
            currentSlideIndex = slidesData.length - 1;
            updateSlideDisplay();
        }
    });

    nextSlideButton.addEventListener('click', () => {
        console.log("Tombol NEXT diklik!"); // Debugging
        if (slidesData.length <= 1) return;
        if (currentSlideIndex < slidesData.length - 1) {
            currentSlideIndex++;
            updateSlideDisplay();
        } else {
            currentSlideIndex = 0;
            updateSlideDisplay();
        }
    });

    // Flip Kartu saat diklik (desktop & mobile tap)
    carouselTrack.addEventListener('click', (event) => {
        // Hanya flip jika bukan hasil swipe (untuk menghindari flip saat menggeser)
        if (!isSwiping) {
            const clickedCard = event.target.closest('.birthday-card');
            if (clickedCard) {
                console.log("Kartu diklik/tap!"); // Debugging
                clickedCard.classList.toggle('flipped');
            }
        }
        isSwiping = false; // Reset flag
    });

    // Kontrol Musik
    playPauseButton.addEventListener('click', () => {
        if (birthdaySong.src) {
            if (isPlaying) {
                birthdaySong.pause();
                playPauseButton.innerHTML = '<i class="fas fa-play"></i> Putar Musik';
            } else {
                birthdaySong.play().catch(error => {
                    console.error("Gagal memutar musik:", error);
                    alert("Browser Anda mungkin memblokir pemutaran musik otomatis. Silakan coba klik lagi atau interaksi lainnya.");
                });
                playPauseButton.innerHTML = '<i class="fas fa-pause"></i> Jeda Musik';
            }
            isPlaying = !isPlaying;
        } else {
            alert('Lagu belum dimuat. Pastikan path file musik benar di script.js.');
        }
    });

    // --- Tambahan untuk Swipe Gesture ---
    carouselTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX; 
        isSwiping = false; // Reset flag di awal sentuhan
        // console.log('touchstart detected. startX:', startX); // Debugging
    });

    carouselTrack.addEventListener('touchmove', (e) => {
        // Tidak perlu preventDefault di sini agar scroll teks tetap berfungsi
        // Jika Anda ingin menghentikan scroll halaman secara total saat swipe di kartu,
        // aktifkan e.preventDefault(); tapi hati-hati dengan scroll teks.
        // e.preventDefault(); 
        const currentMoveX = e.touches[0].clientX;
        const diffX = startX - currentMoveX;
        // Jika geseran sudah mencapai threshold, anggap sebagai swipe
        if (Math.abs(diffX) > threshold / 2) { // Setengah threshold untuk deteksi awal swipe
            isSwiping = true;
        }
    });

    carouselTrack.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;

        // console.log('touchend detected. diffX:', diffX, 'isSwiping:', isSwiping); // Debugging

        if (slidesData.length <= 1) return;

        if (isSwiping && Math.abs(diffX) > threshold) { // Pastikan ini benar-benar swipe dan melebihi threshold
            if (diffX > 0) { // Swipe ke kiri (maju ke slide berikutnya)
                console.log('Swipe Left (Next Slide)'); // Debugging
                if (currentSlideIndex < slidesData.length - 1) {
                    currentSlideIndex++;
                } else {
                    currentSlideIndex = 0; // Kembali ke slide pertama
                }
            } else { // Swipe ke kanan (mundur ke slide sebelumnya)
                console.log('Swipe Right (Prev Slide)'); // Debugging
                if (currentSlideIndex > 0) {
                    currentSlideIndex--;
                } else {
                    currentSlideIndex = slidesData.length - 1; // Kembali ke slide terakhir
                }
            }
            updateSlideDisplay();
        }
        startX = 0;
        endX = 0;
        isSwiping = false; // Reset flag setelah touchend
    });


    // --- Inisialisasi Awal ---
    createAndAppendSlides();
    updateSlideDisplay();
});