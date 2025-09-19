$(document).ready(function () {
  // ================== 슬라이더 상태 동적 계산
  const sliderKeys = ['#fullStackWrap', '#webDesignWrap'];
  const sliders = {};
  sliderKeys.forEach((id) => {
    const $c = $(id);
    sliders[id] = {
      currentSlide: Math.max(0, $c.find('.slide').index($c.find('.slide.active'))),
      totalSlides: $c.find('.slide').length,
    };
  });

  // ================== 네비게이션 클릭 시 하이라이트
  function initNavigation() {
    $('nav ul li a').on('click', function () {
      $('nav ul li').removeClass('on');
      $(this).parent().addClass('on');
    });
  }

  // ================== 스무스 스크롤 & 네비게이션 동기화
  function initSmoothScroll() {
    $('a[href^="#"]').on('click', function (e) {
      e.preventDefault();
      const target = this.hash;
      const $targetElement = $(target);
      if ($targetElement.length) {
        const targetTop = $targetElement.offset().top;
        $('html, body').animate({ scrollTop: targetTop }, 500);

        const sections = ['#aboutWrap', '#skillsWrap', '#fullStackWrap', '#webDesignWrap'];
        const idx = sections.indexOf(target);
        if (idx !== -1) {
          $('nav ul li').removeClass('on');
          $('nav ul li').eq(idx).addClass('on');
        }
      }
    });
  }

  // ================== 섹션별 마우스 휠 네비게이션
  function initWheelNavigation() {
    let isScrolling = false;
    const sections = ['aboutWrap', 'skillsWrap', 'fullStackWrap', 'webDesignWrap'];
    let currentSectionIndex = 0;

    function getCurrentSection() {
      const scrollPosition = $(window).scrollTop() + $(window).height() / 2;
      sections.forEach(function (sectionId, index) {
        const $section = $('#' + sectionId);
        if ($section.length) {
          const sectionTop = $section.offset().top;
          const sectionBottom = sectionTop + $section.outerHeight();
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentSectionIndex = index;
          }
        }
      });
    }

    function goToSection(index) {
      if (index >= 0 && index < sections.length) {
        const $targetSection = $('#' + sections[index]);
        if ($targetSection.length) {
          $('html, body').animate({ scrollTop: $targetSection.offset().top }, 500);
          $('nav ul li').removeClass('on');
          $('nav ul li').eq(index).addClass('on');
        }
      }
    }

    window.addEventListener(
      'wheel',
      function (e) {
        if (isScrolling) return;
        isScrolling = true;
        const delta = e.deltaY;
        getCurrentSection();
        let shouldPreventDefault = false;

        if (delta > 0) {
          if (currentSectionIndex < sections.length - 1) {
            goToSection(currentSectionIndex + 1);
            shouldPreventDefault = true;
          }
        } else {
          if (currentSectionIndex > 0) {
            goToSection(currentSectionIndex - 1);
            shouldPreventDefault = true;
          }
        }

        if (shouldPreventDefault) e.preventDefault();
        setTimeout(function () { isScrolling = false; }, 800);
      },
      { passive: false }
    );

    getCurrentSection();
  }

  // ================== 슬라이드 표시
  function showSlide(sliderKey, slideIndex) {
    const $container = $(sliderKey);
    const $slides = $container.find('.slide');
    const $indicators = $container.find('.indicator');

    $slides.removeClass('active').attr({ 'aria-hidden': 'true', tabIndex: -1 });
    $slides.eq(slideIndex).addClass('active').attr({ 'aria-hidden': 'false', tabIndex: 0 });
    $indicators.removeClass('active');
    $indicators.eq(slideIndex).addClass('active');
    sliders[sliderKey].currentSlide = slideIndex;
  }

  // ================== 슬라이드 변경
  function changeSlide(sliderKey, direction) {
    const slider = sliders[sliderKey];
    let newIndex = slider.currentSlide + direction;
    if (newIndex >= slider.totalSlides) newIndex = 0;
    else if (newIndex < 0) newIndex = slider.totalSlides - 1;
    showSlide(sliderKey, newIndex);
  }

  // ================== 컨트롤 버튼
  function initSliderControls() {
    $('.slider-btn').on('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      const $container = $(this).closest('.slider-container');
      const sliderKey = '#' + $container.attr('id');
      const direction = $(this).hasClass('prev-btn') ? -1 : 1;
      changeSlide(sliderKey, direction);
    });

    $('.indicator').on('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      const $container = $(this).closest('.slider-container');
      const sliderKey = '#' + $container.attr('id');
      const slideIndex = parseInt($(this).data('slide'), 10);
      showSlide(sliderKey, slideIndex);
    });
  }

  // ================== 키보드 네비게이션 (좌/우)
  function initKeyboardNavigation() {
    $(document).on('keydown', function (e) {
      const scrollPosition = $(window).scrollTop() + $(window).height() / 2;
      let currentSliderKey = null;

      $('#fullStackWrap, #webDesignWrap').each(function () {
        const sectionTop = $(this).offset().top;
        const sectionBottom = sectionTop + $(this).outerHeight();
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          currentSliderKey = '#' + $(this).attr('id');
          return false;
        }
      });

      if (currentSliderKey) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); changeSlide(currentSliderKey, -1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); changeSlide(currentSliderKey, 1); }
      }
    });
  }

  // ================== 터치/스와이프
  function initTouchSupport() {
    let startX = 0; let isScrolling;
    $('.slider-container').each(function () {
      const element = this;
      element.addEventListener('touchstart', function (e) {
        startX = e.touches[0].pageX; isScrolling = undefined;
      }, { passive: true });
      element.addEventListener('touchmove', function (e) {
        if (e.touches.length > 1) return;
        const currentX = e.touches[0].pageX; const currentY = e.touches[0].pageY;
        if (isScrolling === undefined) { isScrolling = Math.abs(currentY - e.touches[0].pageY) > Math.abs(currentX - startX); }
        if (!isScrolling) { e.preventDefault(); }
      }, { passive: false });
      element.addEventListener('touchend', function (e) {
        if (isScrolling === false) {
          const endX = e.changedTouches[0].pageX; const diff = startX - endX; const threshold = 50;
          if (Math.abs(diff) > threshold) {
            const $container = $(element); const sliderKey = '#' + $container.attr('id'); const direction = diff > 0 ? 1 : -1; changeSlide(sliderKey, direction);
          }
        }
      }, { passive: true });
    });
  }

  // ================== 외부 링크 보안
  function initExternalLinks() {
    $('a[href^="http"]').attr('target', '_blank').attr('rel', 'noopener noreferrer');
  }

  // ================== 초기화 실행
  function init() {
    initNavigation();
    initSmoothScroll();
    initWheelNavigation();
    initSliderControls();
    initKeyboardNavigation();
    initTouchSupport();
    initExternalLinks();
  }

  init();
});