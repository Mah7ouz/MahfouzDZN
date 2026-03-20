document.addEventListener("DOMContentLoaded", () => {
    // Sticky Navbar
    const navbar = document.getElementById("navbar");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Offset for sticky header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Lightbox Functionality
    const imagesToPreview = document.querySelectorAll('.gallery-img');
    if (imagesToPreview.length > 0) {
        const lightboxHTML = `
            <div id="lightbox" class="lightbox">
                <span class="lightbox-close">&times;</span>
                <span class="lightbox-prev">&#10094;</span>
                <img class="lightbox-content" id="lightbox-img">
                <span class="lightbox-next">&#10095;</span>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);

        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.querySelector('.lightbox-close');
        const prevBtn = document.querySelector('.lightbox-prev');
        const nextBtn = document.querySelector('.lightbox-next');

        let currentIndex = 0;

        imagesToPreview.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                lightbox.style.display = 'flex';
                setTimeout(() => lightbox.classList.add('active'), 10);
                lightboxImg.src = img.src;
                currentIndex = index;
            });
        });

        const updateLightboxImage = (index) => {
            if (index < 0) currentIndex = imagesToPreview.length - 1;
            else if (index >= imagesToPreview.length) currentIndex = 0;
            else currentIndex = index;

            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.src = imagesToPreview[currentIndex].src;
                lightboxImg.style.opacity = '1';
            }, 200);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            setTimeout(() => {
                lightbox.style.display = 'none';
            }, 300);
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            updateLightboxImage(currentIndex - 1);
        });
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            updateLightboxImage(currentIndex + 1);
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') updateLightboxImage(currentIndex - 1);
                if (e.key === 'ArrowRight') updateLightboxImage(currentIndex + 1);
            }
        });
    }
});
