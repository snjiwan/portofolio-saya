document.addEventListener('DOMContentLoaded', function () {

    // ==========================================
    // THREE.JS PARTICLE BACKGROUND
    // ==========================================
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.getElementById('particles-js').appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
        colorsArray[i] = Math.random() * 0.2 + 0.4;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.01,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 3;

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        particlesMesh.rotation.y += 0.0003;
        particlesMesh.rotation.x += mouseY * 0.0002;
        particlesMesh.rotation.y += mouseX * 0.0002;
        renderer.render(scene, camera);
    }

    animateParticles();

    // ==========================================
    // TYPED.JS
    // ==========================================
    const typed = new Typed('#typed-text', {
        strings: [
            'Fullstack Web Developer',
            'PHP & Laravel Enthusiast',
            'WordPress Developer',
            'UI/UX Design Lover',
            'Sistem Informasi, S.Kom'
        ],
        typeSpeed: 55,
        backSpeed: 35,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|',
    });

    // ==========================================
    // AOS (ANIMATE ON SCROLL)
    // ==========================================
    AOS.init({
        duration: 700,
        easing: 'ease-out-cubic',
        once: true,
        offset: 60,
    });

    // ==========================================
    // CUSTOM CURSOR GLOW
    // ==========================================
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    let cursorTimeout;

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
        cursorGlow.classList.add('show');

        clearTimeout(cursorTimeout);
        cursorTimeout = setTimeout(() => {
            cursorGlow.classList.remove('show');
        }, 2000);
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.classList.remove('show');
    });

    // ==========================================
    // MAGNETIC HOVER
    // ==========================================
    const magneticElements = document.querySelectorAll('.btn, .social-icon, .project-card, .skill-card');

    magneticElements.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });

    // ==========================================
    // NAVBAR SCROLL
    // ==========================================
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }

        const sections = document.querySelectorAll('.section, .hero');
        const navLinks = document.querySelectorAll('.nav-link');

        sections.forEach((section) => {
            const top = section.offsetTop - 200;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY <= bottom) {
                navLinks.forEach((link) => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // ==========================================
    // MOBILE NAV TOGGLE
    // ==========================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });

    // ==========================================
    // SKILLS FILTER
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            skillCards.forEach((card) => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ==========================================
    // SKILL BARS ANIMATION
    // ==========================================
    const skillBars = document.querySelectorAll('.skill-progress');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px',
    };

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const progress = entry.target.dataset.progress;
                entry.target.style.width = `${progress}%`;
            }
        });
    }, observerOptions);

    skillBars.forEach((bar) => skillObserver.observe(bar));

    // ==========================================
    // LOAD PROFILE PHOTO
    // ==========================================
    function loadProfilePhoto() {
        const container = document.getElementById('profilePhoto');
        if (!container) return;

        fetch('php/get_profile.php')
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.has_photo) {
                    container.innerHTML = `<img src="${data.url}?t=${Date.now()}" alt="Aksan Kuraji Dermawan">`;
                }
            })
            .catch(() => {});
    }

    loadProfilePhoto();

    // ==========================================
    // LOAD AWARDS
    // ==========================================
    function loadAwards() {
        const awardsGrid = document.getElementById('awardsGrid');

        fetch('php/get_awards.php')
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.awards.length > 0) {
                    awardsGrid.innerHTML = '';
                    data.awards.forEach((award) => {
                        const card = document.createElement('div');
                        card.className = 'award-card';
                        card.setAttribute('data-aos', 'zoom-in');
                        card.innerHTML = `
                            <div class="award-image">
                                <img src="${award.file_url}" alt="${award.title}">
                            </div>
                            <div class="award-info">
                                <h4>${award.title}</h4>
                                <p>${award.description || ''}</p>
                            </div>
                        `;
                        awardsGrid.appendChild(card);
                    });
                    AOS.refresh();
                }
            })
            .catch(() => {});
    }

    loadAwards();

    // ==========================================
    // DOWNLOAD CV
    // ==========================================
    const downloadBtn = document.getElementById('downloadCvBtn');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', function (e) {
            e.preventDefault();
            fetch('php/get_cv.php')
                .then((res) => res.json())
                .then((data) => {
                    if (data.success && data.url) {
                        window.open(data.url, '_blank');
                    } else {
                        alert('Belum ada CV yang diupload. Silakan hubungi admin.');
                    }
                })
                .catch(() => {
                    alert('Gagal memuat data CV.');
                });
        });
    }

    // ==========================================
    // CONTACT FORM
    // ==========================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Terkirim!';
                btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                this.reset();

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // ==========================================
    // PARALLAX ON SCROLL
    // ==========================================
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroContent = document.querySelector('.hero-content');
        if (heroContent && scrollY < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
            heroContent.style.opacity = `${1 - scrollY / (window.innerHeight * 0.6)}`;
        }
    });

});
