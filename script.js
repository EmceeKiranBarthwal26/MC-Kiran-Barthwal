document.addEventListener('DOMContentLoaded', () => {
    
    // --- Current Year in Footer ---
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // --- Header Scroll Effect ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // --- Active Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- Intersection Observer for Scroll Animations ---
    const fadeElements = document.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-in');
    
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            
            // If it's the achievements section, trigger counters
            if (entry.target.classList.contains('counter-item')) {
                const counter = entry.target.querySelector('.counter-number');
                startCounter(counter);
            }
            
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    fadeElements.forEach(el => {
        appearOnScroll.observe(el);
    });

    // --- Numbers Counter Animation ---
    function startCounter(counterElement) {
        const target = +counterElement.getAttribute('data-target');
        const duration = 2000; // ms
        const stepTime = Math.abs(Math.floor(duration / target));
        let current = 0;
        
        // Fast counting for large numbers, slow for small
        const increment = target > 50 ? Math.ceil(target / 50) : 1;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counterElement.textContent = target + (target > 10 ? '+' : '');
                clearInterval(timer);
            } else {
                counterElement.textContent = current;
            }
        }, stepTime);
    }

    // --- Gallery Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        });
    });

    // --- Load More Gallery (Simulation logic for remaining extra videos) ---
    const loadMoreBtn = document.getElementById('loadMoreGallery');
    const galleryGrid = document.querySelector('.gallery-grid');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // Simulated adding of the remaining 3 YT Videos from the links provided
            const extraYTLinks = [
                '1zCQMGXdgao',
                'm-xzsti-JNQ',
                'KtaL6nmxpk8'
            ];
            
            extraYTLinks.forEach((id, index) => {
                const a = document.createElement('a');
                a.href = `https://www.youtube.com/embed/${id}`;
                a.className = `gallery-item video popup-youtube scale-in delay-${index % 3}`;
                
                a.innerHTML = `
                    <img src="https://img.youtube.com/vi/${id}/maxresdefault.jpg" alt="Showreel ${index+3}" onerror="this.src='https://img.youtube.com/vi/${id}/hqdefault.jpg'">
                    <div class="gallery-overlay"><i class="fas fa-play"></i></div>
                `;
                
                galleryGrid.appendChild(a);
                // Trigger reflow for animation
                void a.offsetWidth;
                a.classList.add('visible');
                
                // Attach lightbox event to new items
                a.addEventListener('click', lightboxHandler);
            });
            
            loadMoreBtn.style.display = 'none'; // Hide after loading
            
            // Re-apply filter logic if needed
            const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
            if(activeFilter === 'photo') {
                 // Hide the newly added videos if filter is photo
                 document.querySelectorAll('.gallery-item.video').forEach(vid => {
                     vid.style.display = 'none';
                 });
            }
        });
    }

    // --- Lightbox Functionality ---
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.querySelector('.lightbox-content');
    const closeLightbox = document.querySelector('.close-lightbox');

    function lightboxHandler(e) {
        e.preventDefault();
        const target = e.currentTarget;
        const isVideo = target.classList.contains('video');
        const source = target.getAttribute('href');
        
        lightboxContent.innerHTML = ''; // Clear previous
        
        if (isVideo) {
            // Extract standard youtube video ID or use the embed URL directly
            // For shorts converted to embed URLs it looks like: https://www.youtube.com/embed/xxxxxx
            const iframe = document.createElement('iframe');
            iframe.src = source + "?autoplay=1&rel=0";
            iframe.width = "560"; // Default, responsive by CSS
            iframe.height = "315";
            iframe.frameBorder = "0";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            // Setting a 9:16 aspect ratio roughly for Youtube Shorts
            iframe.style.width = '100%';
            iframe.style.maxWidth = '400px';
            iframe.style.height = '70vh';
            
            lightboxContent.appendChild(iframe);
        } else {
            const img = document.createElement('img');
            img.src = source;
            img.alt = "Gallery Image";
            lightboxContent.appendChild(img);
        }
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // Attach to existing gallery items
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', lightboxHandler);
    });

    closeLightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
        lightboxContent.innerHTML = ''; // Stop video playback
        document.body.style.overflow = 'auto'; // Restore scrolling
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            lightboxContent.innerHTML = '';
            document.body.style.overflow = 'auto';
        }
    });

    // --- Testimonial Carousel ---
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('testiPrev');
    const nextBtn = document.getElementById('testiNext');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    if(prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            let next = currentSlide - 1;
            if (next < 0) next = slides.length - 1;
            showSlide(next);
        });

        nextBtn.addEventListener('click', () => {
            let next = currentSlide + 1;
            if (next >= slides.length) next = 0;
            showSlide(next);
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
        });
        
        // Auto slide
        setInterval(() => {
            let next = currentSlide + 1;
            if (next >= slides.length) next = 0;
            showSlide(next);
        }, 8000);
    }

    // =========================================
    // MULTI-STEP BOOKING WIZARD & MODAL ENGINE
    // =========================================
    
    // Set minimum date picker to today
    const todayISO = new Date().toISOString().split('T')[0];
    document.querySelectorAll('.wizard-input-date').forEach(input => {
        input.setAttribute('min', todayISO);
    });

    // Booking Modal Open & Close Triggers
    const bookingModal = document.getElementById('bookingModal');
    const openModalBtns = document.querySelectorAll('.open-booking-modal');
    const closeModalBtn = document.querySelector('.close-booking-modal');

    function openBookingModal() {
        if (!bookingModal) return;
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeBookingModal() {
        if (!bookingModal) return;
        bookingModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openBookingModal();
        });
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeBookingModal);
    }

    if (bookingModal) {
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) {
                closeBookingModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && bookingModal && bookingModal.classList.contains('active')) {
            closeBookingModal();
        }
    });

    // Interactive Pill Selections
    document.querySelectorAll('.select-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const parentGrid = pill.parentElement;
            parentGrid.querySelectorAll('.select-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
        });
    });

    // Currency Toggle Selections
    document.querySelectorAll('.currency-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const parentToggle = btn.parentElement;
            parentToggle.querySelectorAll('.currency-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Wizard Engine Functionality for Inline & Modal Wizards
    const stepTitles = {
        1: "Client Profile & Contact",
        2: "Event Type & Stakeholder Role",
        3: "Date, City & Duration",
        4: "Commercial Proposal & Preferences",
        5: "Booking Request Confirmation"
    };

    const stepPercentages = {
        1: "25%",
        2: "50%",
        3: "75%",
        4: "100%",
        5: "100%"
    };

    function initWizard(wizardId) {
        const container = document.getElementById(wizardId);
        if (!container) return;

        let currentStep = 1;

        const badge = container.querySelector('.step-badge');
        const titleText = container.querySelector('.step-title-text');
        const progressFill = container.querySelector('.wizard-progress-fill');
        const steps = container.querySelectorAll('.wizard-step');
        const nextBtns = container.querySelectorAll('.btn-next-step');
        const prevBtns = container.querySelectorAll('.btn-prev-step');
        const submitBtn = container.querySelector('.btn-submit-wizard');
        const resetBtn = container.querySelector('.btn-reset-wizard');

        function updateStepView(newStep) {
            steps.forEach(stepEl => {
                const stepNum = parseInt(stepEl.getAttribute('data-step'));
                if (stepNum === newStep) {
                    stepEl.classList.add('active');
                } else {
                    stepEl.classList.remove('active');
                }
            });

            currentStep = newStep;
            if (badge) badge.textContent = `Step ${Math.min(currentStep, 4)} of 4`;
            if (titleText) titleText.textContent = stepTitles[currentStep] || '';
            if (progressFill) progressFill.style.width = stepPercentages[currentStep] || '100%';
        }

        function validateStep(stepNum) {
            let isValid = true;
            const currentStepEl = container.querySelector(`.wizard-step[data-step="${stepNum}"]`);
            if (!currentStepEl) return true;

            // Clear previous errors
            currentStepEl.querySelectorAll('input, select').forEach(input => {
                input.style.borderColor = '';
            });

            if (stepNum === 1) {
                const nameInput = currentStepEl.querySelector('.wizard-input-name');
                const phoneInput = currentStepEl.querySelector('.wizard-input-phone');
                const emailInput = currentStepEl.querySelector('.wizard-input-email');

                if (!nameInput.value.trim()) {
                    nameInput.style.borderColor = '#ff4d4d';
                    isValid = false;
                }
                if (!phoneInput.value.trim() || phoneInput.value.trim().length < 7) {
                    phoneInput.style.borderColor = '#ff4d4d';
                    isValid = false;
                }
                if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
                    emailInput.style.borderColor = '#ff4d4d';
                    isValid = false;
                }
            } else if (stepNum === 3) {
                const dateInput = currentStepEl.querySelector('.wizard-input-date');
                const locationInput = currentStepEl.querySelector('.wizard-input-location');

                if (!dateInput.value) {
                    dateInput.style.borderColor = '#ff4d4d';
                    isValid = false;
                }
                if (!locationInput.value.trim()) {
                    locationInput.style.borderColor = '#ff4d4d';
                    isValid = false;
                }
            } else if (stepNum === 4) {
                const budgetInput = currentStepEl.querySelector('.wizard-input-budget');
                if (!budgetInput.value || parseFloat(budgetInput.value) <= 0) {
                    budgetInput.style.borderColor = '#ff4d4d';
                    isValid = false;
                }
            }

            return isValid;
        }

        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (validateStep(currentStep)) {
                    updateStepView(currentStep + 1);
                }
            });
        });

        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (currentStep > 1) {
                    updateStepView(currentStep - 1);
                }
            });
        });

        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (!validateStep(4)) return;

                // Collect full booking data
                const name = container.querySelector('.wizard-input-name').value.trim();
                const countryCode = container.querySelector('.wizard-input-country').value;
                const phone = container.querySelector('.wizard-input-phone').value.trim();
                const email = container.querySelector('.wizard-input-email').value.trim();
                
                const eventTypePill = container.querySelector('.wizard-event-type-pills .select-pill.active');
                const eventType = eventTypePill ? eventTypePill.getAttribute('data-value') : 'Event';
                const eventName = container.querySelector('.wizard-input-eventname').value.trim();
                const role = container.querySelector('.wizard-input-role').value;

                const eventDate = container.querySelector('.wizard-input-date').value;
                const location = container.querySelector('.wizard-input-location').value.trim();
                const durationPill = container.querySelector('.wizard-duration-pills .select-pill.active');
                const duration = durationPill ? durationPill.getAttribute('data-value') : 'Full-Day';

                const currencyBtn = container.querySelector('.currency-btn.active');
                const currency = currencyBtn ? currencyBtn.getAttribute('data-currency') : 'INR';
                const budget = container.querySelector('.wizard-input-budget').value;
                const notes = container.querySelector('.wizard-input-notes').value.trim();

                // Format display text in step 5
                const summaryEvent = container.querySelector('.wizard-summary-event');
                const summaryDate = container.querySelector('.wizard-summary-date');
                if (summaryEvent) summaryEvent.textContent = eventName ? `${eventType} (${eventName})` : eventType;
                if (summaryDate) summaryDate.textContent = eventDate;

                // Build WhatsApp pre-filled text
                const whatsappText = encodeURIComponent(
                    `*NEW BOOKING INQUIRY - MC KIRAN BARTHWAL*\n\n` +
                    `👤 *Client Name:* ${name}\n` +
                    `📞 *Phone:* ${countryCode} ${phone}\n` +
                    `📧 *Email:* ${email}\n\n` +
                    `🎭 *Event Type:* ${eventType}${eventName ? ` (${eventName})` : ''}\n` +
                    `👔 *Representation:* ${role}\n\n` +
                    `📅 *Date:* ${eventDate}\n` +
                    `📍 *Location:* ${location}\n` +
                    `⏱️ *Duration:* ${duration}\n\n` +
                    `💰 *Proposed Budget:* ${currency === 'INR' ? '₹' : '$'}${budget}\n` +
                    `📝 *Special Requests:* ${notes || 'None'}`
                );

                const whatsappBtn = container.querySelector('.wizard-whatsapp-btn');
                if (whatsappBtn) {
                    whatsappBtn.href = `https://wa.me/918328386380?text=${whatsappText}`;
                }

                // Show step 5 success screen
                updateStepView(5);

                // Trigger celebration confetti
                const canvas = container.querySelector('.confetti-canvas');
                if (canvas) {
                    triggerConfetti(canvas);
                }
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                // Reset inputs
                container.querySelectorAll('input').forEach(i => i.value = '');
                container.querySelectorAll('textarea').forEach(t => t.value = '');
                updateStepView(1);
            });
        }
    }

    // Initialize both inline and modal wizards
    initWizard('inlineBookingWizard');
    initWizard('modalBookingWizard');

    // Confetti Animation System
    function triggerConfetti(canvas) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.parentElement.clientWidth || 600;
        canvas.height = canvas.parentElement.clientHeight || 400;

        const particles = [];
        const colors = ['#d4af37', '#f3e5ab', '#ffffff', '#ffd700', '#e0c068'];

        for (let i = 0; i < 60; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                r: Math.random() * 6 + 3,
                d: Math.random() * 60,
                color: colors[Math.floor(Math.random() * colors.length)],
                tilt: Math.floor(Math.random() * 10) - 10,
                tiltAngleIncremental: Math.random() * 0.07 + 0.05,
                tiltAngle: 0
            });
        }

        let animationFrame;
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                ctx.beginPath();
                ctx.lineWidth = p.r;
                ctx.strokeStyle = p.color;
                ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
                ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
                ctx.stroke();
            });
            update();
        }

        function update() {
            particles.forEach((p, i) => {
                p.tiltAngle += p.tiltAngleIncremental;
                p.y += (Math.cos(p.d) + 1 + p.r / 2) / 2;
                p.tilt = Math.sin(p.tiltAngle) * 15;
                if (p.y > canvas.height) {
                    particles[i] = {
                        x: Math.random() * canvas.width,
                        y: -10,
                        r: p.r,
                        d: p.d,
                        color: p.color,
                        tilt: p.tilt,
                        tiltAngleIncremental: p.tiltAngleIncremental,
                        tiltAngle: p.tiltAngle
                    };
                }
            });
        }

        let count = 0;
        function loop() {
            draw();
            count++;
            if (count < 180) {
                animationFrame = requestAnimationFrame(loop);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        loop();
    }

});

