$(function () {
    //Закрытие попапа с успехом
    $(document).on("click",'.popup .btn-close, .btn_bottom_close',function(eventObject){
        $(".popup").css('left','-9999px');
        $(".bg-popup").css('left','-9999px');
        eventObject.preventDefault();
    });

    //подтягивание соответствующих услуг для ЖК
    $(document).on("change", "select[name=apartment_complexes]", function (e) {

        var obj = $(this);
        var wrapper = obj.closest("form");

        var apartmentComplexes = JSON.parse(wrapper.find("input[name=apartmentComplexes]").val());
        var currentAC = obj.find("option:selected").attr("data-id");

        var servicesSelect = wrapper.find("select[name=services]");
        servicesSelect.empty();
        console.log(apartmentComplexes[currentAC].SERVICES);
        $.each(apartmentComplexes[currentAC].SERVICES, function (index, value) {

            servicesSelect.prepend($('<option value=\"' + value.NAME + '\" data-id=\"tabs-' + value.ID +'\"' +(value.CURRENT == 1 ? 'selected' : '')+'>' + value.NAME + '</option>'));
        });
        setTimeout(function () {
            $('input, select').trigger('refresh');
        }, 1)


    });

    //Переключение таба по селекту с услугой
    $(document).on("change", "select[name=services]", function (e) {
        e.preventDefault();

        var obj = $(this);
        var id = obj.find("option:selected").attr("data-id");
        var tabsBlock = obj.closest(".tabs2");
        var tab = tabsBlock.find("a[href=#" + id + "]").closest("li");
        var numb = tabsBlock.find("li").index(tab);
        tabsBlock.tabs("option", "active", numb);


        var tabBlock =  tabsBlock.find("#"+id);
        var optionVal = tabBlock.find("select[name=services] option[data-id=" + id + "]").val();
        if(optionVal) {
            var selectServices = tabBlock.find("select[name=services]");
            selectServices.val(optionVal);
            selectServices.siblings(".jq-selectbox__dropdown").find("ul li").removeClass("sel selected");
            selectServices.siblings(".jq-selectbox__dropdown").find("ul li[data-id=" + id + "]").addClass("sel selected");
            selectServices.siblings(".jq-selectbox__select").find(".jq-selectbox__select-text").text(optionVal);
        }
        setTimeout(function() {
            $('input, select').trigger('refresh');
        }, 1)

    });

    //переключение селекта с услугой по табу
    $(document).on("click", ".tabs2 ul li a", function (e) {
        e.preventDefault();
        var obj = $(this);

        var id = obj.closest("li").attr("aria-controls");
        var tabBlock =  obj.closest(".tabs2").find("#"+id);
        var optionVal = tabBlock.find("select[name=services] option[data-id=" + id + "]").val();
        if(optionVal) {
            var selectServices = tabBlock.find("select[name=services]");
            selectServices.val(optionVal);
            selectServices.siblings(".jq-selectbox__dropdown").find("ul li").removeClass("sel selected");
            selectServices.siblings(".jq-selectbox__dropdown").find("ul li[data-id=" + id + "]").addClass("sel selected");
            selectServices.siblings(".jq-selectbox__select").find(".jq-selectbox__select-text").text(optionVal);
        }

        setTimeout(function() {
            $('input, select').trigger('refresh');
        }, 1)
    });

    //отправка формы в табах
    $(document).on("click", ".btn-submit.tabs input", function (e) {
        e.preventDefault();

        var obj = $(this);
        var wrapper = obj.closest(".b-wrap__form");
        var address = wrapper.find("input[name=ajaxPath]").val();
        var form_description = wrapper.find("input[name=formData]").val();

        wrapper.find(".b-preloader").addClass("active");

        var data = {
            IS_SUBMIT: 1,
            FORM_DATA: form_description,
            NAME: wrapper.find("input[name=name]").val(),
            PHONE: wrapper.find("input[name=phone]").val(),
            EMAIL: wrapper.find("input[name=email]").val(),
            APARTMENT_COMPLEX: wrapper.find("select[name=apartment_complexes]").val(),
            SERVICES: wrapper.find("select[name=services]").val(),
            APARTMENT_NUMBER: wrapper.find("input[name=number]").val(),
            COMMENT: wrapper.find("textarea[name=comment]").val(),
            APARTMENT_COMPLEX_ID: wrapper.find("input[name=apartmentComplexId]").val(),
            SERVICES_ID: wrapper.find("input[name=servicesId]").val(),
            CURRENT_SERVICE_ID: wrapper.find("input[name=currentServiceId]").val(),
            RECAPTCHA: wrapper.find("textarea.g-recaptcha-response").val(),
            LANG: wrapper.find("input[name=langId]").val()
        };


        wrapper.load(
            address,
            data,
            function (res) {

                //$('input, select').styler({selectSearch: true});

                if(wrapper.find(".success").length){

                    var successMess = wrapper.find(".success").val();
                    wrapper.closest(".tabs-form").find("h2").css("display","none");

                }else{
                    grecaptcha.render('captcha_request_tabs_'+ wrapper.find("input[name=currentServiceId]").val(), {
                        'sitekey':  $("#captcha-site-key").val(),
                        'theme': 'light'
                    });
                }
            }
        );

    });

    //Замена текста на форму в табах
    $(document).on("click",".btn_read_more2",function(e){
        e.preventDefault();

        var obj = $(this);
        var contentBlock =  obj.closest(".tabs-form").find(".b-wrap__text");
        var formBlock = obj.closest(".tabs-form").find(".form_page");

        obj.css("display","none");
        contentBlock.css("display","none");
        formBlock.addClass("visible");

        setTimeout(function() {
            $('input, select').trigger('refresh');
        }, 1);

        var mySwiper = $('.js_slider_services .swiper-container')[0].swiper;
        mySwiper.updateSlidesSize()

    })


    var currentCode = $("#currentCode").val();
    var currentBtn = $(".slider_controls a[data-code=" + currentCode + "]");
    if (currentCode && currentBtn.length) {
        $('.slider_controls a').removeClass('selected');
        currentBtn.addClass('selected');
        js_slider_services.slideTo(currentBtn.index());
    }

    var currentId  = $("#currentId").val();
    var tab = $("a[href=#tabs-" + currentId + "]").closest("li");
    var tabsBlock = tab.closest(".tabs2");
    var numb = tabsBlock.find("li").index(tab);
    tabsBlock.tabs("option", "active", numb);


    $(".inputPhone").mask("+7(999) 999-9999");

});