// 문서가 준비되면 실행
$(document).ready(function() {
  
  // 네비게이션 클릭 이벤트 (기존 코드 정리)
  function initNavigation() {
    $('nav ul li').on('click', function() {
      $(this).addClass('on').siblings().removeClass('on');
    });
  }
  
  // 부드러운 스크롤 기능 추가
  function initSmoothScroll() {
    $('a[href^="#"]').on('click', function(e) {
      e.preventDefault();
      
      const target = this.hash;
      const $targetElement = $(target);
      
      if ($targetElement.length) {
        $('html, body').animate({
          scrollTop: $targetElement.offset().top
        }, 800);
      }
    });
  }
  
  // 스크롤 위치에 따른 네비게이션 하이라이트
  function initScrollSpy() {
    $(window).on('scroll', function() {
      const scrollPosition = $(window).scrollTop() + 100;
      const sections = ['profileWrap', 'javaNyangWrap', 'hdexWrap'];
      
      sections.forEach(function(sectionId, index) {
        const $section = $('#' + sectionId);
        if ($section.length) {
          const sectionTop = $section.offset().top;
          const sectionBottom = sectionTop + $section.outerHeight();
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            $('nav ul li').removeClass('on');
            $('nav ul li').eq(index + 1).addClass('on');
          }
        }
      });
    });
  }
  
  // 외부 링크 안전하게 열기
  function initExternalLinks() {
    $('a[target="_blank"]').on('click', function(e) {
      // 기본 동작을 막지 않고 그대로 실행
      console.log('외부 링크 열기: ' + $(this).attr('href'));
    });
  }
  
  // 버튼 호버 효과 개선
  function initButtonEffects() {
    $('.button li a').on('mouseenter', function() {
      $(this).stop().animate({
        backgroundColor: '#414141',
        color: '#f2f2f2'
      }, 200);
    }).on('mouseleave', function() {
      $(this).stop().animate({
        backgroundColor: 'transparent',
        color: '#414141'
      }, 200);
    });
  }
  
  // 이미지 로딩 에러 처리
  function initImageErrorHandling() {
    $('img').on('error', function() {
      console.log('이미지 로딩 실패: ' + $(this).attr('src'));
      // 대체 이미지나 처리 로직을 여기에 추가할 수 있습니다.
    });
  }
  
  // 페이지 로딩 완료 후 페이드인 효과
  function initPageAnimation() {
    $('body').css('opacity', '0').animate({
      opacity: 1
    }, 1000);
  }
  
  // 모든 초기화 함수 실행
  function init() {
    initNavigation();
    initSmoothScroll();
    initScrollSpy();
    initExternalLinks();
    initButtonEffects();
    initImageErrorHandling();
    initPageAnimation();
    
    console.log('포트폴리오 스크립트 초기화 완료');
  }
  
  // 초기화 실행
  init();
  
});