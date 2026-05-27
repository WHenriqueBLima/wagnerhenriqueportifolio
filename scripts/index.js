const navbar = document.querySelector('.navbar');
const mobileNavbar = document.querySelector('.navbar__mobile');
const button = document.querySelector('.burguer');
const mobileLinks = document.querySelectorAll('.mobile__links a');
const projectCarousels = document.querySelectorAll('.project-carousel');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (button && mobileNavbar) {
  button.addEventListener('click', function () {
    mobileNavbar.classList.toggle('active');
  });
}

mobileLinks.forEach(function (link) {
  link.addEventListener('click', function () {
    if (mobileNavbar) mobileNavbar.classList.remove('active');
  });
});

window.addEventListener('scroll', function () {
  if (!navbar) return;
  if (this.window.pageYOffset > 0) return navbar.classList.add('active');
  return navbar.classList.remove('active');
});

projectCarousels.forEach(function (carousel) {
  const gallery = carousel.querySelector('.project-gallery');
  if (!gallery) return;

  const slides = gallery.querySelectorAll('img');
  const prevButton = carousel.querySelector('.project-carousel__button--prev');
  const nextButton = carousel.querySelector('.project-carousel__button--next');
  const dotsContainer = carousel.querySelector('.project-carousel__dots');
  if (slides.length <= 1 || !prevButton || !nextButton || !dotsContainer) return;

  let currentSlide = 0;
  let intervalId;
  let isVisible = true;
  const dots = [];

  slides.forEach(function (_, index) {
    const dot = document.createElement('button');
    dot.className = 'project-carousel__dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Ir para imagem ${index + 1}`);
    dot.addEventListener('click', function () {
      stopAutoScroll();
      goToSlide(index);
      startAutoScroll();
    });
    dotsContainer.appendChild(dot);
    dots.push(dot);
  });

  function updateDots() {
    dots.forEach(function (dot, index) {
      dot.classList.toggle('active', index === currentSlide);
      dot.setAttribute('aria-current', index === currentSlide ? 'true' : 'false');
    });
  }

  function goToSlide(index, behavior = 'smooth') {
    if (index < 0) {
      currentSlide = slides.length - 1;
    } else {
      currentSlide = index >= slides.length ? 0 : index;
    }

    gallery.scrollTo({
      left: gallery.clientWidth * currentSlide,
      behavior: prefersReducedMotion.matches ? 'auto' : behavior,
    });
    updateDots();
  }

  function startAutoScroll() {
    if (prefersReducedMotion.matches || !isVisible) return;

    stopAutoScroll();
    intervalId = window.setInterval(function () {
      goToSlide(currentSlide + 1);
    }, 4000);
  }

  function stopAutoScroll() {
    window.clearInterval(intervalId);
  }

  function realignCurrentSlide() {
    goToSlide(currentSlide, 'auto');
  }

  carousel.addEventListener('mouseenter', stopAutoScroll);
  carousel.addEventListener('mouseleave', startAutoScroll);
  carousel.addEventListener('focusin', stopAutoScroll);
  carousel.addEventListener('focusout', startAutoScroll);
  carousel.addEventListener('pointerdown', stopAutoScroll);
  carousel.addEventListener('pointerup', startAutoScroll);
  carousel.addEventListener('pointercancel', startAutoScroll);

  gallery.addEventListener('scroll', function () {
    currentSlide = Math.min(slides.length - 1, Math.round(gallery.scrollLeft / gallery.clientWidth));
    updateDots();
  });

  prevButton.addEventListener('click', function () {
    stopAutoScroll();
    goToSlide(currentSlide - 1);
    startAutoScroll();
  });

  nextButton.addEventListener('click', function () {
    stopAutoScroll();
    goToSlide(currentSlide + 1);
    startAutoScroll();
  });

  window.addEventListener('resize', realignCurrentSlide);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      isVisible = entries[0].isIntersecting;
      if (isVisible) {
        startAutoScroll();
      } else {
        stopAutoScroll();
      }
    }, { threshold: 0.35 });

    observer.observe(carousel);
  }

  updateDots();
  startAutoScroll();
});
