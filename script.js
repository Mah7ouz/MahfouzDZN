document.addEventListener("DOMContentLoaded", () => {
    // Sticky Navbar
    const navbar = document.getElementById("navbar");
    const mobileToggle = document.getElementById("mobile-toggle");
    const navLinks = document.getElementById("nav-links");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // Mobile Menu Toggle
    if (mobileToggle) {
        mobileToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            mobileToggle.querySelector('span').textContent = navLinks.classList.contains("active") ? "✕" : "☰";
        });
    }

    // Close mobile menu when a link is clicked
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            if (mobileToggle) {
                mobileToggle.querySelector('span').textContent = "☰";
            }
        });
    });

    // Questionnaire File Upload Listener
    const fileInput = document.getElementById('references');
    if (fileInput) {
        const fileText = fileInput.nextElementSibling; // The <p> tag
        fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                fileText.textContent = `${files.length} file(s) selected: ${Array.from(files).map(f => f.name).join(', ')}`;
                fileText.style.color = 'var(--accent-blue)';
            } else {
                fileText.textContent = 'Drag and drop or click to upload (Images, PDFs)';
                fileText.style.color = 'var(--text-secondary)';
            }
        });
    }

    // Questionnaire Form AJAX Submission
    const questionnaireForm = document.getElementById('questionnaire-form');
    const formSuccess = document.getElementById('form-success');

    if (questionnaireForm) {
        questionnaireForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = questionnaireForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            const formData = new FormData(questionnaireForm);

            try {
                const response = await fetch("/", {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    questionnaireForm.style.display = 'none';
                    formSuccess.style.display = 'block';
                    window.scrollTo({ top: formSuccess.offsetTop - 150, behavior: 'smooth' });
                } else {
                    alert("Oops! There was a problem submitting your form. Please try again.");
                }
            } catch (error) {
                alert("Oops! There was a problem submitting your form. Please check your connection.");
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }

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
