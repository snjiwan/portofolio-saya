document.addEventListener('DOMContentLoaded', function () {

    // ==========================================
    // THREE.JS PARTICLE NETWORK
    // ==========================================
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.getElementById('particles-js').appendChild(renderer.domElement);

    const particlesCount = 2000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 15;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
        const colorType = Math.random();
        if (colorType < 0.3) {
            colors[i * 3] = 0.8 + Math.random() * 0.2;
            colors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
            colors[i * 3 + 2] = 1.0;
        } else if (colorType < 0.6) {
            colors[i * 3] = 1.0;
            colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
            colors[i * 3 + 2] = 0.6 + Math.random() * 0.2;
        } else {
            colors[i * 3] = 0.5 + Math.random() * 0.3;
            colors[i * 3 + 1] = 0.3 + Math.random() * 0.3;
            colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
        }
        sizes[i] = Math.random() * 3 + 0.5;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Star twinkle texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(0.5, 'rgba(200,180,255,0.3)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    const starTexture = new THREE.CanvasTexture(canvas);

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.035,
        map: starTexture,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        sizeAttenuation: true,
        depthWrite: false,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Connection lines
    const connectionMaterial = new THREE.LineBasicMaterial({
        color: 0x7c3aed,
        transparent: true,
        opacity: 0.08,
    });

    const connectionPositions = new Float32Array(particlesCount * 2 * 3);
    const connectionGeometry = new THREE.BufferGeometry();
    connectionGeometry.setAttribute('position', new THREE.BufferAttribute(connectionPositions, 3));
    const connectionLine = new THREE.LineSegments(connectionGeometry, connectionMaterial);
    scene.add(connectionLine);

    camera.position.z = 3.5;

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

    function updateConnections() {
        const pos = particlesGeometry.attributes.position.array;
        const connPos = connectionGeometry.attributes.position.array;
        let idx = 0;
        const connectDist = 0.35;
        const maxLines = 3000;

        for (let i = 0; i < particlesCount && idx < maxLines * 6; i++) {
            for (let j = i + 1; j < particlesCount && idx < maxLines * 6; j++) {
                const dx = pos[i * 3] - pos[j * 3];
                const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
                const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (dist < connectDist) {
                    connPos[idx] = pos[i * 3];
                    connPos[idx + 1] = pos[i * 3 + 1];
                    connPos[idx + 2] = pos[i * 3 + 2];
                    connPos[idx + 3] = pos[j * 3];
                    connPos[idx + 4] = pos[j * 3 + 1];
                    connPos[idx + 5] = pos[j * 3 + 2];
                    idx += 6;
                }
            }
        }
        connectionGeometry.attributes.position.needsUpdate = true;
        connectionGeometry.setDrawRange(0, idx / 3);
    }

    updateConnections();

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        particlesMesh.rotation.y += 0.0002;
        particlesMesh.rotation.x += mouseY * 0.0001;
        particlesMesh.rotation.y += mouseX * 0.0001;
        connectionLine.rotation.copy(particlesMesh.rotation);

        // Star twinkle
        const time = Date.now() * 0.001;
        const size = particlesGeometry.attributes.size;
        if (size) {
            const array = size.array;
            for (let i = 0; i < array.length; i++) {
                array[i] = (sizes[i] * (0.5 + 0.5 * Math.sin(time * 1.5 + i * 0.5)));
            }
            size.needsUpdate = true;
        }

        renderer.render(scene, camera);
    }

    animateParticles();

    // ==========================================
    // POSITION SECTION NODES
    // ==========================================
    function positionNodes() {
        const nodes = document.querySelectorAll('.section-node');
        const sections = document.querySelectorAll('.section, .hero');
        const docHeight = document.documentElement.scrollHeight;

        nodes.forEach((node, i) => {
            const section = sections[i];
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const center = ((sectionTop + sectionHeight / 2) / docHeight) * 100;
                node.style.top = `${center}%`;
                node.style.position = 'absolute';
                node.style.transform = 'translateY(-50%)';
            }
        });
    }

    positionNodes();
    window.addEventListener('resize', positionNodes);

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
        typeSpeed: 50,
        backSpeed: 30,
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
    // SCROLL PROGRESS BAR
    // ==========================================
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
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
    // 3D TILT ON CARDS
    // ==========================================
    const tiltCards = document.querySelectorAll('.project-card, .skill-card, .award-card');

    tiltCards.forEach((card) => {
        card.classList.add('tilt-card');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -8;
            const rotateY = (x - centerX) / centerX * 8;

            card.style.transform =
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            card.style.transition = 'transform 0.1s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            card.style.transition = 'transform 0.5s ease';
        });
    });

    // ==========================================
    // MICRO MAGNETIC HOVER
    // ==========================================
    const magneticElements = document.querySelectorAll('.btn, .social-icon');

    magneticElements.forEach((el) => {
        el.classList.add('ripple-btn');

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });

    // ==========================================
    // RIPPLE EFFECT ON BUTTONS
    // ==========================================
    document.querySelectorAll('.btn').forEach((btn) => {
        btn.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // ==========================================
    // TEXT REVEAL ON SCROLL
    // ==========================================
    function setupTextReveal() {
        const titles = document.querySelectorAll('.section-title');
        titles.forEach((title) => {
            const words = title.textContent.trim().split(/\s+/);
            title.innerHTML = words.map((w) =>
                `<span class="reveal-word" style="display:inline-block">${w}</span>`
            ).join(' ');

            const wordSpans = title.querySelectorAll('.reveal-word');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        wordSpans.forEach((span, i) => {
                            setTimeout(() => {
                                span.classList.add('revealed');
                            }, i * 50);
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(title);
        });
    }

    setupTextReveal();

    // ==========================================
    // NAVBAR SCROLL
    // ==========================================
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const winHeight = window.innerHeight;

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

        // Scroll connector glow position
        const connectorGlow = document.querySelector('.connector-glow');
        if (connectorGlow) {
            const progress = scrollY / docHeight;
            const maxTop = document.documentElement.scrollHeight - 200;
            connectorGlow.style.top = `${scrollY * 0.85}px`;
        }

        // Section nodes & section glows
        const sections = document.querySelectorAll('.section, .hero');
        const navLinks = document.querySelectorAll('.nav-link');
        const nodes = document.querySelectorAll('.section-node');

        sections.forEach((section, index) => {
            const top = section.offsetTop - winHeight * 0.3;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            const inView = scrollY >= top && scrollY <= bottom;

            // Nav links
            if (inView) {
                navLinks.forEach((link) => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }

            // Section nodes
            const node = nodes[index];
            if (node) {
                if (inView) {
                    node.classList.add('active');
                } else {
                    node.classList.remove('active');
                }
            }

            // Section glow reveal
            const glow = section.querySelector('.section-glow');
            if (glow) {
                if (inView) {
                    glow.classList.add('visible');
                } else {
                    glow.classList.remove('visible');
                }
            }

            // Astronaut tracking: find active section
            if (inView) {
                const astronaut = document.getElementById('astronaut');
                if (astronaut) {
                    const sectionCenter = section.offsetTop + section.offsetHeight / 2;
                    const scrollOffset = window.innerHeight * 0.15;
                    const astroY = sectionCenter - scrollOffset;
                    astronaut.style.top = `${astroY}px`;
                }
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
                    container.innerHTML = `<img src="${data.url}?t=${Date.now()}" alt="Aksan Kuraji Dermawan" class="loading-blur" onload="this.classList.add('loaded')">`;
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
