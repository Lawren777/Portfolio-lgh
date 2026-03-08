/* ════════════════════════════════════════════════════════
   LAWRENCE GIRARD-HODGES — Portfolio JS
   ════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Navigation scroll ─── */
  const nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ─── Burger menu mobile ─── */
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen);
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        burger.setAttribute('aria-expanded', false);
      });
    });
  }

  /* ─── Filtres grille travaux ─── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workItems = document.querySelectorAll('.work-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      workItems.forEach(item => {
        item.style.display = (filter === 'all' || item.dataset.category === filter) ? 'block' : 'none';
      });
    });
  });

  /* ─── Scroll reveal ─── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  /* ─── Lightbox ─── */
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    let currentImages = [], currentIndex = 0;

    const open = (src, images, index) => {
      lightboxImg.src = src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      currentImages = images;
      currentIndex = index;
    };
    const close = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => { lightboxImg.src = ''; }, 300);
    };

    const galleryImgs = document.querySelectorAll('.gallery-item img, .sub-grid figure img, .bcd-split-img img');
    const imgArray = Array.from(galleryImgs);
    galleryImgs.forEach((img, idx) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => open(img.src, imgArray, idx));
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      lightboxImg.src = currentImages[currentIndex].src;
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % currentImages.length;
      lightboxImg.src = currentImages[currentIndex].src;
    });
    if (closeBtn) closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') { currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length; lightboxImg.src = currentImages[currentIndex].src; }
      if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % currentImages.length; lightboxImg.src = currentImages[currentIndex].src; }
    });
  }

  /* ─── Video Lightbox (clic sur miniatures vidéo de l'index) ─── */
  const videoItems = document.querySelectorAll('.work-item[data-video-src]');
  if (videoItems.length > 0) {
    // Créer le lightbox vidéo dynamiquement
    const vLightbox = document.createElement('div');
    vLightbox.id = 'videoLightbox';
    vLightbox.style.cssText = `
      position:fixed;inset:0;z-index:2000;
      background:rgba(0,0,0,0.95);
      display:none;align-items:center;justify-content:center;
      cursor:pointer;
    `;
    vLightbox.innerHTML = `
      <button style="position:absolute;top:2rem;right:2rem;background:none;border:1px solid rgba(201,168,76,0.4);color:var(--accent);font-family:var(--font-mono);font-size:0.55rem;letter-spacing:0.15em;padding:0.6rem 1.2rem;cursor:pointer" id="vLightboxClose">ESC · FERMER</button>
      <video id="vLightboxVideo" controls style="max-width:90vw;max-height:85vh;display:block;outline:none" playsinline></video>
    `;
    document.body.appendChild(vLightbox);

    const vVideo = document.getElementById('vLightboxVideo');
    const vClose = document.getElementById('vLightboxClose');

    const openVideo = (src) => {
      vVideo.src = src;
      vLightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      vVideo.play().catch(() => {});
    };
    const closeVideo = () => {
      vLightbox.style.display = 'none';
      document.body.style.overflow = '';
      vVideo.pause();
      vVideo.src = '';
    };

    videoItems.forEach(item => {
      item.addEventListener('click', () => openVideo(item.dataset.videoSrc));
    });
    vClose.addEventListener('click', (e) => { e.stopPropagation(); closeVideo(); });
    vLightbox.addEventListener('click', (e) => { if (e.target === vLightbox) closeVideo(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && vLightbox.style.display === 'flex') closeVideo();
    });
  }


  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = href.split('#')[0];
    if (linkPath && path.endsWith(linkPath) && linkPath !== '') {
      link.classList.add('active');
    }
  });

});
