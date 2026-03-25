document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       STICKY NAVBAR
    ========================================================= */
    const navbar = document.getElementById("navbar");
    const mobileToggle = document.getElementById("mobile-toggle");
    const navLinks = document.getElementById("nav-links");

    /* =========================================================
       STICKY CTA BAR (shows after scrolling past hero)
    ========================================================= */
    const stickyCTABar = document.getElementById("sticky-cta-bar");
    const contactSection = document.getElementById("contact");
    let ctaVisible = false;

    const handleScroll = () => {
        const scrollY = window.scrollY;

        // Navbar
        if (scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

        // Sticky CTA bar — show after 400px, hide when contact section is visible
        if (!stickyCTABar) return;

        const contactTop = contactSection
            ? contactSection.getBoundingClientRect().top
            : Infinity;

        const shouldShow = scrollY > 400 && contactTop > window.innerHeight;

        if (shouldShow && !ctaVisible) {
            stickyCTABar.classList.add("visible");
            stickyCTABar.classList.remove("hidden-bar");
            ctaVisible = true;
        } else if (!shouldShow && ctaVisible) {
            stickyCTABar.classList.remove("visible");
            stickyCTABar.classList.add("hidden-bar");
            ctaVisible = false;
        }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once on load

    /* =========================================================
       MOBILE MENU TOGGLE
    ========================================================= */
    if (mobileToggle) {
        mobileToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("active");
            mobileToggle.querySelector('span').textContent = isOpen ? "✕" : "☰";
            mobileToggle.setAttribute("aria-expanded", isOpen.toString());
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            if (mobileToggle) {
                mobileToggle.querySelector('span').textContent = "☰";
                mobileToggle.setAttribute("aria-expanded", "false");
            }
        });
    });

    /* =========================================================
       STICKY CTA BAR — close button click goes to contact
    ========================================================= */
    const stickyCtaBtn = document.getElementById("sticky-cta-btn");
    if (stickyCtaBtn) {
        stickyCtaBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const target = document.getElementById("contact");
            if (target) {
                const offset = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: offset, behavior: "smooth" });
            }
        });
    }

    /* =========================================================
       SMOOTH SCROLLING FOR ALL ANCHOR LINKS
    ========================================================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (!targetEl) return;

            e.preventDefault();
            const headerOffset = 88;
            const offsetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        });
    });

    /* =========================================================
       CONTACT FORM — inline success message
    ========================================================= */
    const contactForm = document.getElementById("contact-form");
    const formSuccessMsg = document.getElementById("form-success-msg");
    const formSubmitBtn = document.getElementById("form-submit-btn");

    if (contactForm && formSuccessMsg) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const originalText = formSubmitBtn.textContent;
            formSubmitBtn.disabled = true;
            formSubmitBtn.textContent = "Sending...";

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: "POST",
                    body: formData,
                    headers: { "Accept": "application/json" }
                });

                if (response.ok) {
                    // Hide form fields and button, show success
                    contactForm.querySelectorAll(".form-group").forEach(g => g.style.display = "none");
                    formSubmitBtn.style.display = "none";
                    formSuccessMsg.style.display = "block";
                    formSuccessMsg.scrollIntoView({ behavior: "smooth", block: "nearest" });
                } else {
                    alert("There was a problem submitting. Please try again.");
                    formSubmitBtn.disabled = false;
                    formSubmitBtn.textContent = originalText;
                }
            } catch (err) {
                alert("There was a connection issue. Please try again.");
                formSubmitBtn.disabled = false;
                formSubmitBtn.textContent = originalText;
            }
        });
    }

    /* =========================================================
       QUESTIONNAIRE FORM (questionnaire.html only)
    ========================================================= */
    const fileInput = document.getElementById('references');
    if (fileInput) {
        const fileText = fileInput.nextElementSibling;
        fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                fileText.textContent = `${files.length} file(s): ${Array.from(files).map(f => f.name).join(', ')}`;
                fileText.style.color = 'var(--accent-blue)';
            } else {
                fileText.textContent = 'Drag and drop or click to upload (Images, PDFs)';
                fileText.style.color = 'var(--text-secondary)';
            }
        });
    }

    const questionnaireForm = document.getElementById('questionnaire-form');
    const formSuccess = document.getElementById('form-success');

    if (questionnaireForm) {
        questionnaireForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = questionnaireForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            const services = questionnaireForm.querySelectorAll('input[name="services[]"]:checked');
            if (services.length === 0) {
                alert("Please select at least one type of design service.");
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                return;
            }

            const formData = new FormData(questionnaireForm);

            try {
                const response = await fetch("/", { method: 'POST', body: formData });
                if (response.ok) {
                    questionnaireForm.style.display = 'none';
                    if (formSuccess) {
                        formSuccess.style.display = 'block';
                        const scrollTarget = formSuccess.getBoundingClientRect().top + window.pageYOffset - 100;
                        window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
                    }
                } else {
                    alert("Oops! There was a problem. Please try again.");
                }
            } catch (err) {
                alert("Oops! Connection issue. Please check your connection.");
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }

    /* =========================================================
       SCROLL REVEAL
    ========================================================= */
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

    /* =========================================================
       STATS COUNTER ANIMATION
    ========================================================= */
    const counters = document.querySelectorAll('.counter');
    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const prefix = counter.getAttribute('data-prefix') || '';
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 1100;
            let start = null;

            const step = (timestamp) => {
                if (!start) start = timestamp;
                const progress = Math.min((timestamp - start) / duration, 1);
                // ease-out
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.innerText = `${prefix}${Math.floor(eased * target)}${suffix}`;
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    counter.innerText = `${prefix}${target}${suffix}`;
                }
            };
            window.requestAnimationFrame(step);
        });
    };

    const statsSection = document.querySelector('.social-proof');
    if (statsSection && counters.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                statsObserver.unobserve(statsSection);
            }
        }, { threshold: 0.15 });
        statsObserver.observe(statsSection);
    }

    /* =========================================================
       LIGHTBOX (project pages)
    ========================================================= */
    const imagesToPreview = document.querySelectorAll('.gallery-img');
    if (imagesToPreview.length > 0) {
        const lightboxHTML = `
            <div id="lightbox" class="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">
                <span class="lightbox-close" aria-label="Close">&times;</span>
                <span class="lightbox-prev" aria-label="Previous">&#10094;</span>
                <img class="lightbox-content" id="lightbox-img" alt="">
                <span class="lightbox-next" aria-label="Next">&#10095;</span>
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
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                currentIndex = index;
                setTimeout(() => lightbox.classList.add('active'), 10);
            });
        });

        const updateLightboxImage = (index) => {
            if (index < 0) currentIndex = imagesToPreview.length - 1;
            else if (index >= imagesToPreview.length) currentIndex = 0;
            else currentIndex = index;

            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.src = imagesToPreview[currentIndex].src;
                lightboxImg.alt = imagesToPreview[currentIndex].alt;
                lightboxImg.style.opacity = '1';
            }, 180);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            setTimeout(() => { lightbox.style.display = 'none'; }, 300);
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        prevBtn.addEventListener('click', (e) => { e.stopPropagation(); updateLightboxImage(currentIndex - 1); });
        nextBtn.addEventListener('click', (e) => { e.stopPropagation(); updateLightboxImage(currentIndex + 1); });

        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') updateLightboxImage(currentIndex - 1);
                if (e.key === 'ArrowRight') updateLightboxImage(currentIndex + 1);
            }
        });
    }

});
