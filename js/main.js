// html 문서를 다 읽고나서 script 읽으라고 주문해야 함
// 오프닝 구문 $(document).ready(function(){}) 쓰고 시작해야 함
// 오프닝 구문 축약형 $(function(){});

$(document).ready(function(){
  
//스크롤했을 때 가로로
  let slideCount = $('figure').length;
  let slideWidth = $('figure').width() + 20;

  let totalWidth = slideWidth * slideCount + 800;

  $('section').width(totalWidth);
  $('body').height(totalWidth);

  $(window).on('scroll', function(){
    let scr = $(this).scrollTop();
    $('section').stop().animate({
      left : -scr
    })
  });

  $('.navi li').on('click', function(){
    let i = $(this).index();
    $('html, body').stop().animate({
      scrollTop : slideWidth * 5 * i});
    $(this).addClass('on').siblings().removeClass('on');
  })

  $('figure').on('click', function(){
    $(this).addClass('on').siblings().removeClass('on');
    // $(this).css({backgroundImage : 'url(img/img.jpg)'})
    let _img = $(this).find('img').attr('src');
    $(this).css({backgroundImage : `url(${_img})`})
    .siblings().css({backgroundImage : ``});

    let winWidth = $(window).width();
    let pos = winWidth / 2 - 390;
    let i = $(this).index();
    $('html, body').scrollTop(slideWidth*i-pos);

    // 선택자의 .scrollTop('값') 값을 입력하면 그 위치로 감
    // 비워두면 선택자의 수직스크롤 위치 구하기
    
  });

  $('button').on('click', function(e){
    e.stopPropagation(); // 버튼을 클릭해도 figure 안에 있기 때문에  부모태그(상위요소)인 figure에 removeClass가 전파되지 않게 막아주는 기능
    $(this).parent('figure').removeClass('on');
  });
  




























//오프닝구문
});