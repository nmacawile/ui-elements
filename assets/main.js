const classToggler = (function() {
  const Toggler = function(toggler) {    
    const generate = function(customTarget, customClass) {      
      const target = customTarget || document.querySelector(toggler.dataset.target);
      const toggleClass = customClass || toggler.dataset.toggleClass;
      if (target && toggleClass) {        
        toggler.addEventListener('click', function() {
          target.classList.toggle(toggleClass);
        });
      }
    };
    return { generate };
  };

  document.querySelectorAll('.nav-toggle').forEach(toggler => {
    Toggler(toggler).generate();
  });

  document.querySelectorAll('.dropdown-toggle').forEach(toggler => {
    const target = toggler.parentElement.querySelector('.nav-dropdown-menu');
    if (target) Toggler(toggler).generate(target, 'dropdown-collapsed');
  });
})();


const simpleCarousel = (function() {
  
  const Carousel = function(carousel, options = {}) {
    const defaults = {
      slideType: 'bg',
      autoplay: true,
      swipe: true,
    };

    const config = { ...defaults, ...options };
    config.autoplay = parseInt(config.autoplay);

    const slider = carousel.querySelector('.carousel-slider');
    const slides = slider.querySelectorAll('.carousel-slide');
    const dotContainer = carousel.querySelector('.nav-dots');
    const navPrev = carousel.querySelector('.nav-prev');
    const navNext = carousel.querySelector('.nav-next');
    const transitionValue = slider.style.transition;
    let transitioning = false;
    let slideCount = 0;
    let touchStartX;
    let touchFinalX;
    let touchDetected = false;

    const generateTextElement = function(text) {
      const textElement = document.createElement('div');
      const textContent = document.createTextNode(text);
      textElement.className = 'slide-text'
      textElement.appendChild(textContent);
      return textElement;
    }

    const generateLinkElement = function(imgSrc, href) {
      const linkElement = document.createElement('a');      
      linkElement.href = href;
      linkElement.className = 'slide-link';

      if (config.slideType === 'img') {
        const imgElement = document.createElement('img');
        imgElement.className = 'slide-img';
        imgElement.src = imgSrc;
        linkElement.appendChild(imgElement);
      } else {
        linkElement.style['background-image'] = `url(${imgSrc})`;
      }

      return linkElement;
    };

    const generateSlideContent = function(slide) {
      const linkElement = generateLinkElement(slide.dataset.src, slide.dataset.href);
      if (slide.dataset.text)
        linkElement.appendChild(generateTextElement(slide.dataset.text));
      slide.appendChild(linkElement);
    };

    const generateDot = function(slideIndex) {
      const dot = document.createElement('a');
      dot.href = '#';
      dot.className = 'nav-dot';
      dot.dataset.slideIndex = slideIndex;
      dotContainer.appendChild(dot);
    };

    const createWrapAroundSlides = function() {
      const firstSlideClone = slider.firstElementChild.cloneNode(true);
      const lastSlideClone = slider.lastElementChild.cloneNode(true);
      slider.appendChild(firstSlideClone);
      slider.prepend(lastSlideClone);
    }

    const getSliderOffset = function() {
      const currentOffset = slider.style.transform || 'translateX(-100%)';
      const captureRegExp = /(?:translateX\()(-?\d+)%(?:\))/;
      return parseInt(captureRegExp.exec(currentOffset)[1]);
    };

    const markActiveDot = function() {
      const activeIndex = (getSliderOffset() / -100) - 1;
      dotContainer.querySelectorAll('.nav-dot').forEach(dot => {
        if (dot.dataset.slideIndex == activeIndex) { dot.classList.add('active-dot'); }
        else { dot.classList.remove('active-dot'); }
      });
    };

    const translateX = function(value, unit = '%') { 
      return `translateX(${value}${unit})`; 
    };

    const moveSlider = function(value) {
      if (!transitioning) {
        slider.style.transition = transitionValue;
        transitioning = true;
        slider.style.transform = translateX(value);
      }
    };

    const moveSliderPositionBy = function(offset, resetSlideshow = true) {
      moveSlider(getSliderOffset() + 100 * offset);
      if (resetSlideshow) resetSlideshowTiming();
    };

    const moveSliderPositionTo = function(position, resetSlideshow = true) {
      moveSlider(100 * position);
      if (resetSlideshow) resetSlideshowTiming();
    };

    const nextSlide = function(resetSlideshow = true) {
      moveSliderPositionBy(-1, resetSlideshow);
    };

    const prevSlide = function(resetSlideshow = true) {
      moveSliderPositionBy(1, resetSlideshow);
    };

    const snapToCurrentSlide = function() {
      if (slider.style.transform !== translateX(getSliderOffset())) {
        moveSliderPositionBy(0);
        transitioning = false;
      }
    };

    const offsetMin = function() { return -100 * (slideCount + 1); };

    const outOfNormalRange = function(num) {
      return num <= offsetMin() || num >= 0;
    };

    const adjustSliderPosition = function() {
      const offset = getSliderOffset();
      slider.style.transition = 'none';
      if (offset <= offsetMin()) { slider.style.transform = translateX(-100); }
      else if (offset >= 0) { slider.style.transform = translateX(-100 * slideCount); }  
    };

    const touchDifference = function(absolute = false) {
      const result = touchFinalX - touchStartX;
      if (absolute) return Math.abs(result);
      return result;
    };

    const touchDetect = function(evt) {
      touchDetected = true;
      touchStartX = evt.touches[0].pageX;
      touchFinalX = touchStartX;
    };

    const touchDrag = function(evt) {
      touchFinalX = evt.touches[0].pageX;
      slider.style.transform = translateX(getSliderOffset()) + ' ' + translateX(touchDifference(), 'px');
    };

    const touchLift = function() {
      touchDetected = false;
      const satisfiesThreshold = (touchDifference(true) > 70)
      if (satisfiesThreshold && touchDifference() > 0) prevSlide();
      else if (satisfiesThreshold && touchDifference() < 0) nextSlide();
      else snapToCurrentSlide();
    };

    const slideshowFunction = function() { if (!touchDetected) nextSlide(false); };

    const slideShowDelay = function() {
      const autoplayValue = config.autoplay;
      if (!isNaN(autoplayValue))
        return autoplayValue * 1000;
      return 4000;
    };

    let slideshow = config.autoplay ? setInterval(slideshowFunction, slideShowDelay()) : null;
    
    const resetSlideshowTiming = function() {
      if (config.autoplay) {
        clearInterval(slideshow);
        slideshow = setInterval(slideshowFunction, slideShowDelay());
      }
    };

    if (navPrev) navPrev.onclick = function(evt) { prevSlide(); };
    if (navNext) navNext.onclick = function(evt) { nextSlide(); };

    slider.addEventListener('transitionend', function() {
      if (outOfNormalRange(getSliderOffset())) adjustSliderPosition();
      markActiveDot();
      transitioning = false;
    });

    dotContainer.onclick = function(evt) {
      if (evt && evt.target.classList.contains('nav-dot')) {
        evt.preventDefault();
        const target = evt.target;
        const position = -1 * (parseInt(target.dataset.slideIndex) + 1);
        if (getSliderOffset() !== 100 * position) {
          moveSliderPositionTo(position);
        }
      }
    };

    if (config.swipe == true) {
      carousel.addEventListener('touchstart', touchDetect);
      carousel.addEventListener('touchmove', touchDrag);
      carousel.addEventListener('touchend', touchLift);
    }

    const generate = function() {
      slides.forEach(slide => {
        const slideIndex = slideCount ++;
        slide.dataset.index = slideIndex;
        generateSlideContent(slide);
        generateDot(slideIndex);
      });
      createWrapAroundSlides();
      markActiveDot();
    };

    return { generate }
  };

  const init = function(carousel, options = {}) {
    return Carousel(carousel, options);
  };

  document.querySelectorAll('.carousel').forEach(carousel => {
    init(carousel, carousel.dataset).generate();
  });

  return { init };
})();