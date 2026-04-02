document.addEventListener('DOMContentLoaded', () => {

    // --- Security Measures ---

    // Disable right-click context menu
    document.addEventListener('contextmenu', event => {
        event.preventDefault();
        showSecurityWarning();
    });

    // Disable keyboard shortcuts for developer tools (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
    document.addEventListener('keydown', event => {
        if (
            event.key === 'F12' ||
            (event.ctrlKey && event.shiftKey && event.key === 'I') ||
            (event.ctrlKey && event.shiftKey && event.key === 'J') ||
            (event.ctrlKey && event.key === 'U') ||
            (event.ctrlKey && event.key === 'C') // Prevent Copy
        ) {
            event.preventDefault();
            showSecurityWarning();
        }
    });

    function showSecurityWarning() {
        // Optional: Show a brief unobtrusive notification instead of alert
        console.warn("Security Policy: Inspecting or copying code is disabled on this portfolio.");
    }

    // --- UI Interactions ---

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Sticky Navbar & Active Link Update on Scroll
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Navbar glass effect
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 15, 0.9)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.8)';
            navbar.style.boxShadow = 'none';
        }

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('href').includes(current)) {
                li.classList.add('active');
            }
        });
    });

    // --- Intersection Observer for Scroll Animations ---

    // Reveal Elements on scroll
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');

                // If the element has progress bars, animate them
                if (entry.target.classList.contains('skills-container')) {
                    const progressLines = entry.target.querySelectorAll('.progress-line span');
                    progressLines.forEach(line => {
                        const width = line.parentElement.getAttribute('data-width');
                        line.style.width = width;
                    });
                }

                // Animate Counters
                if (entry.target.querySelector('.counter')) {
                    const counters = entry.target.querySelectorAll('.counter');
                    const speed = 200; // lower is slower

                    counters.forEach(counter => {
                        const updateCount = () => {
                            const targetStr = counter.getAttribute('data-target');
                            const target = parseInt(targetStr);
                            const count = +counter.innerText;
                            const inc = target / speed;

                            if (count < target) {
                                counter.innerText = Math.ceil(count + inc);
                                setTimeout(updateCount, 20);
                            } else {
                                counter.innerText = targetStr;
                            }
                        };
                        updateCount();
                    });
                }

                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // --- Optional Particles.js Initialization ---
    if (typeof particlesJS !== 'undefined') {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 40, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#00f0ff" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.3, "random": true },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#00f0ff", "opacity": 0.2, "width": 1 },
                "move": { "enable": true, "speed": 1, "direction": "none", "random": true, "out_mode": "out" }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": false }, "resize": true },
                "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 0.8 } } }
            },
            "retina_detect": true
        });
    }

    // Form Submission using EmailJS
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerHTML;

            // Revert changes temporarily to indicate loading
            btn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

            // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual EmailJS IDs
            emailjs.sendForm('service_m3z7hip', 'template_fhrb5wc', form)
                .then(() => {
                    btn.innerHTML = '<span>Sent!</span> <i class="fa-solid fa-check"></i>';
                    btn.style.background = '#00ffaa'; // Success color

                    setTimeout(() => {
                        form.reset();
                        btn.innerHTML = originalText;
                        btn.style.background = ''; // Revert to original
                    }, 3000);
                }, (error) => {
                    console.log('FAILED...', error.text);
                    btn.innerHTML = '<span>Failed!</span> <i class="fa-solid fa-xmark"></i>';
                    btn.style.background = '#ff4444'; // Error color

                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.background = ''; // Revert to original
                    }, 3000);
                });
        });
    }
});
