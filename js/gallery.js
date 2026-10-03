// Eviana Salon — galeri & lightbox
document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById('imageModal');
    if (!modal) return;

    var zoomedImage = document.getElementById('zoomedImage');
    var imageCaption = document.getElementById('imageCaption');
    var closeBtn = modal.querySelector('.close-btn');
    var prevBtn = modal.querySelector('.prev-btn');
    var nextBtn = modal.querySelector('.next-btn');
    var imageCounter = modal.querySelector('.image-counter');
    var galleryItems = Array.prototype.slice.call(document.querySelectorAll('.masonry-item'));

    var currentImageIndex = 0;
    var totalImages = galleryItems.length;
    var lastFocusedElement = null;
    var FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    function itemImage(index) {
        return galleryItems[index].querySelector('img');
    }

    function updateCounter() {
        if (imageCounter) {
            imageCounter.textContent = (currentImageIndex + 1) + ' / ' + totalImages;
        }
    }

    function updateModalImage() {
        var image = itemImage(currentImageIndex);
        if (!image) return;
        zoomedImage.src = image.currentSrc || image.src;
        var desc = image.alt || 'Foto dekorasi pernikahan';
        zoomedImage.alt = desc;
        if (imageCaption) imageCaption.textContent = desc;
        updateCounter();
    }

    function openModal(index) {
        lastFocusedElement = document.activeElement;
        currentImageIndex = index;

        var image = itemImage(index);
        zoomedImage.src = image.currentSrc || image.src;
        var desc = image.alt || 'Foto dekorasi pernikahan';
        zoomedImage.alt = desc;
        if (imageCaption) imageCaption.textContent = desc;
        updateCounter();

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        // Fokus masuk ke dialog (tombol tutup)
        if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        zoomedImage.removeAttribute('src');
        // Kembalikan fokus ke pemicu semula
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    }

    function isOpen() {
        return modal.classList.contains('is-open');
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % totalImages;
        updateModalImage();
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
        updateModalImage();
    }

    // Klik / keyboard pada tiap foto
    galleryItems.forEach(function (item, index) {
        item.addEventListener('click', function () {
            openModal(index);
        });
        item.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                openModal(index);
            }
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (prevBtn) prevBtn.addEventListener('click', showPrevImage);
    if (nextBtn) nextBtn.addEventListener('click', showNextImage);

    // Tutup saat klik area gelap (backdrop)
    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
    });

    // Navigasi keyboard + focus trap
    document.addEventListener('keydown', function (e) {
        if (!isOpen()) return;

        if (e.key === 'Escape') {
            e.preventDefault();
            closeModal();
            return;
        }
        if (e.key === 'ArrowLeft') {
            showPrevImage();
            return;
        }
        if (e.key === 'ArrowRight') {
            showNextImage();
            return;
        }
        if (e.key === 'Tab') {
            var focusable = modal.querySelectorAll(FOCUSABLE);
            if (!focusable.length) return;
            var first = focusable[0];
            var last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            } else if (!modal.contains(document.activeElement)) {
                e.preventDefault();
                first.focus();
            }
        }
    });
});