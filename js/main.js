$(document).ready(function () {

  // 슬라이더 상태 관리
  const sliders = {
    fullStack: {
      currentSlide: 0,
      totalSlides: 2
    },
    webDesign: {
      currentSlide: 0,
      totalSlides: 3
    }
  };

  // 네비게이션 기능
  function initNavigation() {
    $('nav ul li').on('click', function () {
      $(this).addClass('on').siblings().removeClass('on');
    });
  }

  // 즉시 스크롤 기능 (애니메이션 제거)
  function initSmoothScroll() {
    $('a[href^="#"]').on('click', function (e) {
      e.preventDefault();

      const target = this.hash;
      const $targetElement = $(target);

      if ($targetElement.length) {
        const targetTop = $targetElement.offset().top;
        $(window).scrollTop(targetTop);
      }
    });
  }

  // 섹션별 마우스 휠 네비게이션
  function initWheelNavigation() {
    let isScrolling = false;
    const sections = ['profileWrap', 'fullStackWrap', 'webDesignWrap'];
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
          $(window).scrollTop($targetSection.offset().top);

          // 네비게이션 하이라이트 업데이트
          $('nav ul li').removeClass('on');
          $('nav ul li').eq(index + 1).addClass('on');
        }
      }
    }

    // 마우스 휠 이벤트
    $(window).on('wheel', function (e) {
      if (isScrolling) return;

      isScrolling = true;

      const delta = e.originalEvent.deltaY;
      getCurrentSection();

      if (delta > 0) {
        if (currentSectionIndex < sections.length - 1) {
          goToSection(currentSectionIndex + 1);
        }
      } else {
        if (currentSectionIndex > 0) {
          goToSection(currentSectionIndex - 1);
        }
      }

      setTimeout(function () {
        isScrolling = false;
      }, 800);

      e.preventDefault();
    });

    getCurrentSection();
  }

  function showSlide(sliderType, slideIndex) {
    const $container = sliderType === 'fullStack' ? $('#fullStackWrap') : $('#webDesignWrap');
    const $slides = $container.find('.slide');
    const $indicators = $container.find('.indicator');

    $slides.removeClass('active prev');
    $slides.eq(slideIndex).addClass('active');
    $indicators.removeClass('active');
    $indicators.eq(slideIndex).addClass('active');
    sliders[sliderType].currentSlide = slideIndex;
  }

  // 슬라이더 변경 함수
  function changeSlide(sliderType, direction) {
    const slider = sliders[sliderType];
    let newIndex = slider.currentSlide + direction;

    if (newIndex >= slider.totalSlides) {
      newIndex = 0;
    } else if (newIndex < 0) {
      newIndex = slider.totalSlides - 1;
    }

    showSlide(sliderType, newIndex);
  }

  // 슬라이더 컨트롤 초기화
  function initSliderControls() {
    $('.slider-btn').on('click', function () {
      const $container = $(this).closest('.slider-container');
      const isFullStack = $container.attr('id') === 'fullStackWrap';
      const sliderType = isFullStack ? 'fullStack' : 'webDesign';
      const direction = $(this).hasClass('prev-btn') ? -1 : 1;
      changeSlide(sliderType, direction);
    });

    $('.indicator').on('click', function () {
      const $container = $(this).closest('.slider-container');
      const isFullStack = $container.attr('id') === 'fullStackWrap';
      const sliderType = isFullStack ? 'fullStack' : 'webDesign';
      const slideIndex = parseInt($(this).data('slide'));
      goToSlide(sliderType, slideIndex);
    });
  }

  function initKeyboardNavigation() {
    $(document).on('keydown', function (e) {
      const scrollPosition = $(window).scrollTop() + $(window).height() / 2;
      let currentSliderType = null;

      $('#fullStackWrap, #webDesignWrap').each(function () {
        const sectionTop = $(this).offset().top;
        const sectionBottom = sectionTop + $(this).outerHeight();

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          currentSliderType = $(this).attr('id') === 'fullStackWrap' ? 'fullStack' : 'webDesign';
          return false;
        }
      });

      if (currentSliderType) {
        if (e.keyCode === 37) {
          e.preventDefault();
          changeSlide(currentSliderType, -1);
        } else if (e.keyCode === 39) {
          e.preventDefault();
          changeSlide(currentSliderType, 1);
        }
      }
    });
  }

  // 터치/스와이프 지원
  function initTouchSupport() {
    let startX = 0;
    let startY = 0;
    let isScrolling = undefined;

    $('.slider-container').on('touchstart', function (e) {
      startX = e.originalEvent.touches[0].pageX;
      startY = e.originalEvent.touches[0].pageY;
      isScrolling = undefined;
    });

    $('.slider-container').on('touchmove', function (e) {
      if (e.originalEvent.touches.length > 1) return;

      const currentX = e.originalEvent.touches[0].pageX;
      const currentY = e.originalEvent.touches[0].pageY;

      if (isScrolling === undefined) {
        isScrolling = Math.abs(currentY - startY) > Math.abs(currentX - startX);
      }

      if (!isScrolling) {
        e.preventDefault();
      }
    });

    $('.slider-container').on('touchend', function (e) {
      if (isScrolling === false) {
        const endX = e.originalEvent.changedTouches[0].pageX;
        const diff = startX - endX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
          const sliderType = $(this).attr('id') === 'fullStackWrap' ? 'fullStack' : 'webDesign';
          const direction = diff > 0 ? 1 : -1;
          changeSlide(sliderType, direction);
        }
      }
    });
  }

  function initExternalLinks() {
    $('a[target="_blank"]').on('click', function (e) {
    });
  }

  function initImageErrorHandling() {
    $('img').on('error', function () {
      $(this).attr('alt', '이미지를 불러올 수 없습니다.');
    });
  }

  function init() {
    initNavigation();
    initSmoothScroll();
    initWheelNavigation();
    initSliderControls();
    initKeyboardNavigation();
    initTouchSupport();
    initExternalLinks();
    initImageErrorHandling();
  }

  init();

});