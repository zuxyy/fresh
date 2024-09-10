$(function () {
    
    var nav_container = $(".nav-container");
    var nav = $(".sidebar_menu");

    var top_spacing = 15;
    var waypoint_offset = 50;


    var sections = $(".section-menu");
    var navigation_links = $(".sidebar_menu a.scroll");

    sections.waypoint({
        handler: function (event, direction) {

            var active_section;
            active_section = $(this);
			console.log(direction);
           if (direction === "up") active_section = active_section.prev();
			

            var active_link = $('nav a[href="#' + active_section.attr("id") + '"]');
            navigation_links.removeClass("selected");
            active_link.addClass("selected");

        },
        offset: '10%'
    });


    navigation_links.click(function (event) {

        $.scrollTo(
            $(this).attr("href"),
            {
                duration: 200,
                offset: {'left': 0, 'top': -0.15 * $(window).height()}
            }
        );
    });


    /*$('#btn-payment').click(function(eventObject){
     $('#btn-payment').toggleClass("active");
     eventObject.preventDefault();
     });*/

    /*$('#btn-payment').click(function(eventObject){
     $('#payment-drop1').toggleClass("active");
     eventObject.preventDefault();
     });*/
    $('#payment-drop1 .btn-close').click(function (eventObject) {
        /*$('#payment-drop1').toggleClass("active");
         $('#btn-payment').toggleClass("active");*/
        $('#payment-drop1').css("display", "none");
        eventObject.preventDefault();
    });


    $('#payment-drop1').hide();
    $('#btn-payment').click(function (e) {
        var $message = $('#payment-drop1');

        if ($message.css('display') != 'block') {
            $message.fadeIn(400);

            var yourClick = true;
            $(document).bind('click.myEvent', function (e) {
                if (!yourClick && $(e.target).closest('#payment-drop1').length == 0) {
                    $message.fadeOut(400);
                    $(document).unbind('click.myEvent');
                }
                yourClick = false;
            });
        }

        e.preventDefault();
    });


    $(".select").selectmenu();

    $("#files").selectmenu();

    $("#number")
        .selectmenu()
        .selectmenu("menuWidget")
        .addClass("overflow");

    // так инициализируют мудаки
    $("#accordion").accordion({
        collapsible: true,
        active: 0
    });
    $("#accordion2").accordion({
        collapsible: true,
        active: null
    });


    //так инициализируют номральные люди
    $(".ui-accordion").accordion({
        collapsible: true,
        active: null
    });

    $("#tabs").tabs();
    $(".tabs3").tabs();
    $(".tabs2").tabs({
        create: function (event, ui) {

        }
    }).addClass("ui-tabs-vertical ui-helper-clearfix");
    $(".tabs2 li").removeClass("ui-corner-top").addClass("ui-corner-left");

    $('.js-btn-apply-service').click(function (eventObject) {
        $(".popup").css('left', '50%');
        $(".bg-popup").css('left', '0');
        $(".js_popup_form").show();
        $(".js_popup_res").hide();
        $('.popup.service').removeClass('popupMessage');
        eventObject.preventDefault();
    });
    $('.popup .btn-close').click(function (eventObject) {
        $(".popup").css('left', '-9999px');
        $(".bg-popup").css('left', '-9999px');
        eventObject.preventDefault();
    });

    $('.js_close_popup').click(function (eventObject) {
        $(".js_popupMessage").css('left', '-9999px');
        $(".js_popupMessage").prev().css('left', '-9999px');
        eventObject.preventDefault();
    });

    if (typeof $.fn.fancybox === 'function') {
        $('.fancyboxWithThumbs').fancybox({
            prevEffect: 'none',
            nextEffect: 'none',
            padding: '0',
            helpers: {
                overlay: {locked: false},
                thumbs: {width: 125, height: 83},
                title: {type: 'outside'}
            },
            afterLoad: function () {
                if (this.group.length > 1) {
                    this.title = "<b >" + (this.index + 1) + '/' + this.group.length + "</b> " + this.title;
                }
            }
        });

        $('.fancyboxAlone').fancybox();
    }


    // Scroll on services
    (function () {
        if ($("#fade-block_1").length > 0) {
            $(window).load(function () {
                $('html, body').animate({
                    scrollTop: 0
                }, 1);
            });
            var links = ['#fade-block_1', '#fade-block_2', '#fade-block_3'],
                objects = [$(links[0]), $(links[1]), $(links[2])],
                positions = [
                    objects[0].offset().top
                    , objects[1].offset().top
                    , objects[2].offset().top
                    , objects[2].offset().top + objects[2].outerHeight()
                ],
                $content = $('#content'),
                headerHeight = $('.header').outerHeight() + 53 + $('.container > h1').outerHeight(true) - 40;

            $(window).scroll(function () {
                var top = $(window).scrollTop(),
                    wh = $(window).height();


                if (top > positions[0] && top <= positions[3]) {
                    if (!$content.data('wrapper')) {
                        objects[1].addClass('fade-block_hidden');
                        objects[2].addClass('fade-block_hidden');
                        $content.data('wrapper', 'true');
                    }

                    if (top > positions[0] && top <= positions[1]) {
                        objects[0].removeClass('fade-block_hidden');
                        objects[1].addClass('fade-block_hidden');
                        objects[2].addClass('fade-block_hidden');

                        $content.css({
                            'margin-top': top - headerHeight + ((wh - objects[0].find('.fade-block__centered').height()) / 2 - 30) + 'px'
                        });
                    }
                    else if (top > positions[1] && top <= positions[2]) {
                        objects[0].addClass('fade-block_hidden');
                        objects[1].removeClass('fade-block_hidden');
                        objects[2].addClass('fade-block_hidden');

                        $content.css({
                            'margin-top': top - objects[0].outerHeight(true) - headerHeight + ((wh - objects[1].find('.fade-block__centered').outerHeight()) / 2 - 30) + 'px'
                        });
                    }
                    else if (top > positions[2] && top <= positions[3]) {
                        objects[0].addClass('fade-block_hidden');
                        objects[1].addClass('fade-block_hidden');
                        objects[2].removeClass('fade-block_hidden');

                        $content.css({
                            'margin-top': top - objects[0].outerHeight(true) - objects[1].outerHeight(true) - headerHeight + ((wh - objects[2].find('.fade-block__centered').outerHeight()) / 2 - 30) + 'px'
                        });
                    }
                }
                else if (top > positions[3]) {
                    $content.removeAttr('data-wrapper');
                }
                else {
                    objects[0].removeClass('fade-block_hidden');
                    objects[1].removeClass('fade-block_hidden');
                    objects[2].removeClass('fade-block_hidden');
                    $content.removeAttr('data-wrapper').removeAttr('style');
                }
            });
        }
    })();


    $("#nav").on("click", "a.scroll", function (event) {
        //отменяем стандартную обработку нажатия по ссылке
        event.preventDefault();

        //забираем идентификатор бока с атрибута href
        var id = $(this).attr('href'),

        //узнаем высоту от начала страницы до блока на который ссылается якорь
            top = $(id).offset().top;

        //анимируем переход на расстояние - top за 1500 мс
        $('body,html').animate({scrollTop: top}, 1500);
    });


    $('.marker').click(function (eventObject) {
        $('.marker').removeClass('active');
        $(this).addClass('active');
        var id = "#" + $(this).attr('data-tab');
        $('.info-block').removeClass('active');
        $(id).addClass('active');

        eventObject.preventDefault();
    });

    $('.map .info-block h3').click(function (eventObject) {
        $('.map .info-block h3').toggleClass('active');
        eventObject.preventDefault();
		eventObject.stopPropagation();
    });

    $('.map-select a').click(function (eventObject) {
		eventObject.stopPropagation();
        var id2 = "#" + $(this).attr('data-select');
        var classMarker = "." + $(this).attr('data-marker');
        var id = parseInt($(this).data('id'));


        $('.map-select a').removeClass('active');
        $(this).addClass('active');

        $('.info-block').removeClass('active');
        $(id2).addClass('active');

        $('.marker').removeClass('active');
        $(classMarker).addClass('active');

        var k;
        for(k in markers){
            markers[k].setOpacity(.6);
            markers[k].setZIndex(1);
        }
        /*for (var j = 0; j < markers.length; j++) {
            markers[j].setOpacity(.6);
            markers[j].setZIndex(1);
        }*/
        markers[id].setOpacity(1);
        markers[id].setZIndex(100);

        eventObject.preventDefault();
    })
	
	$('body').click(function(e){
		//$('.map-select').removeClass('active');
	})
	
	  $('body, .sub-menu a').click(function(e){
        //e.stopPropagation();
        $('.map-select').removeClass('active');
    })


    js_slider_services = new Swiper('.js_slider_services .swiper-container', {
        autoResize: true,
        spaceBetween: 0,
        slidesPerView: 1,
        speed: 1000,
        effect: 'fade',
        loop: false,
        //direction: 'vertical',
       // mousewheelControl: true,
        mousewheelControl: false,
        //mousewheelReleaseOnEdges: true,
        mousewheelReleaseOnEdges: false,
        simulateTouch: false,
        //mousewheelForceToAxis: true,
        onInit: function () {
            var index = $('.slider_services .swiper-slide-active').index() + 1;
            $('.slider_controls a:nth-child(' + index + ')').addClass('selected');
        },

        onSlideNextStart: function () {
            var index = $('.slider_services .swiper-slide-next').index() + 1;
            $('.slider_controls a').removeClass('selected');
            $('.slider_controls a:nth-child(' + index + ')').addClass('selected');
        },
        onSlideChangeStart: function () {
            var index = $('.slider_services .swiper-slide-active').index() + 1;
            $('.slider_controls a').removeClass('selected');
            $('.slider_controls a:nth-child(' + index + ')').addClass('selected');
        }
    });

    $(document).on("click", '.btn-comment', function (eventObject) {
        eventObject.preventDefault();
        var obj = $(this);
        obj.closest("form").find('.row-textarea').toggleClass("active");
        js_slider_services.update(true);
    });


    $('.slider_controls a').click(function (e) {
        e.preventDefault();
        $('.slider_controls a').removeClass('selected');
        $(this).addClass('selected');
        js_slider_services.slideTo($(this).index());
    });

    $('.js_gotoslide').click(function (e) {
        e.preventDefault();
        var id = $(this).attr('data-slide') - 1;
        js_slider_services.slideTo(id);
        //$('.slider_controls a').removeClass('selected');
        //$('.slider_controls a:nth-child('+index+')').addClass('selected');

    });


 /*   $('.js_order_services').click(function (e) {
        var message = $(this).closest('form').parent().parent().find(".form_message_block");
        $(this).closest('form').parent().fadeOut(300, function () {
            message.fadeIn();
        });
        return false;
    })*/


    /*  $('.js_order').click(function (e) {
     $(".popup").css('left', '-9999px');
     $(".bg-popup").css('left', '-9999px');
     $(".js_popupMessage").css('left', '50%');
     $(".js_popupMessage").prev().css('left', '0');
     return false;
     })*/

    /*-------------end validation-------------------*/
    $;


    // Staff
    (function () {
        var $showMore = $('.btn-expand'),
            $showLess = $('.btn-collapse');

        $showMore.click(function () {
            var $t = $(this),
                $parent = $t.closest('.staff-section__item'),
                $text = $parent.find('.staff-section__item-text');

            $text.slideDown(300);
            $t.hide();
            return false;
        });

        $showLess.click(function () {
            var $t = $(this),
                $parent = $t.closest('.staff-section__item'),
                $text = $parent.find('.staff-section__item-text'),
                $expand = $parent.find('.btn-expand');

            $text.slideUp(300);
            $expand.show();
            return false;
        });

    })();



});

$(window).load(function(){
	$(".preloader_overlay").fadeOut();
	$('.site-wrapper').delay(1000).css('opacity','1');
})
