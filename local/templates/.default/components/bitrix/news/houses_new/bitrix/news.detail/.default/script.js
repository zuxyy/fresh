$(function () {
    $("a.btn-bottom3").click(function(e) {
        e.preventDefault();
        var toBlock = '.block-scroll3';
        var scrollTop = $(toBlock).offset().top;
        $('body,html').animate({scrollTop: scrollTop}, 1000);
    });
    $("a.btn-bottom4").click(function(e) {
        e.preventDefault();
        var toBlock = '.block-scroll4';
        var scrollTop = $(toBlock).offset().top;
        $('body,html').animate({scrollTop: scrollTop}, 1000);
    });
    $("a.btn-bottom5").click(function(e) {
        e.preventDefault();
        var toBlock = '.block-scroll5';
        var scrollTop = $(toBlock).offset().top;
        $('body,html').animate({scrollTop: scrollTop}, 1000);
    });
    $("a.btn-bottom6").click(function(e) {
        e.preventDefault();
        var toBlock = '.block-scroll6';
        var scrollTop = $(toBlock).offset().top;
        $('body,html').animate({scrollTop: scrollTop}, 1000);
    });
	$("a.btn-bottom7").click(function(e) {
        e.preventDefault();
        var toBlock = '.block-scroll7';
        var scrollTop = $(toBlock).offset().top;
        $('body,html').animate({scrollTop: scrollTop}, 1000);
    });
	$("a.btn-bottom8").click(function(e) {
        e.preventDefault();
        var toBlock = '.block-scroll8';
        var scrollTop = $(toBlock).offset().top;
        $('body,html').animate({scrollTop: scrollTop}, 1000);
    });
});
