$(function () {
    $(window).on("load",function(){

        grecaptcha.render('captcha_request', {
            'sitekey':  $("#captcha-site-key").val(),
            'theme': 'light'
        });
    });

    $(document).on("click", ".btn-submit input", function (e) {
        e.preventDefault();

        var obj = $(this);
        var wrapper = obj.closest(".popup");
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
            RECAPTCHA: wrapper.find("textarea.g-recaptcha-response").val(),
            LANG: wrapper.find("input[name=langId]").val()
        };


        wrapper.load(
            address,
            data,
            function (res) {

                //$('input, select').styler({selectSearch: true});
                $(document).on("click",'.popup .btn-close, .btn_bottom_close',function(eventObject){
                    $(".popup").css('left','-9999px');
                    $(".bg-popup").css('left','-9999px');
                    eventObject.preventDefault();
                });

                if(wrapper.find(".success").length){

                    var successMess = wrapper.find(".success").val();
                    if(successMess.indexOf("success")!=-1){
                        wrapper.addClass("popupMessage");
                    }
                }else{
                    grecaptcha.render('captcha_request', {
                        'sitekey':  $("#captcha-site-key").val(),
                        'theme': 'light'
                    });
                }

            }
        );

    });
});