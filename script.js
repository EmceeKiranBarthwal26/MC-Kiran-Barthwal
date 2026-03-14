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

    // --- Booking Form Submit ---
    const bookingForm = document.getElementById('bookingForm');
    const formStatus = document.getElementById('formStatus');

    if(bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect form data
            const formData = new FormData(bookingForm);
            const data = Object.fromEntries(formData.entries());
            
            // In a real scenario, this would be an API call (fetch)
            // Simulating a successful submission response:
            
            const btn = bookingForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;

            setTimeout(() => {
                formStatus.innerHTML = `<span style="color: #4CAF50; font-weight: 600;"><i class="fas fa-check-circle"></i> Thank you, ${data.name}! Your inquiry has been sent successfully. I will get back to you shortly.</span>`;
                bookingForm.reset();
                btn.innerHTML = originalText;
                btn.disabled = false;
                
                setTimeout(() => {
                    formStatus.innerHTML = '';
                }, 5000);
            }, 1500);
        });
    }

});
