// JavaScript Document

$(initHome);

function initHome() {
    $(".slick_wrap .slick").setSlick();
}

function initMap() {
    $("#event .gmap").callGoogleMap(".map", map_points);
}

(function ($) {
    let tgt;
    let default_opt = {
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
        arrows: false,
        speed: 300,
        centerMode: true,
        adaptiveHeight: true,
        variableWidth: true,
        autoplay: true,
        autoplaySpeed: 5000
    }
    $.fn.setSlick = function () {
        tgt = $(this);
        tgt.each(function () {
            if ($(this).children().length > 1) {
                let opt = new Object();
                if ($(this).closest(".section").attr("id") == "event") {
                    let event_opt = {
                        centerMode: false
                    }
                    opt = Object.assign(default_opt, event_opt);
                } else opt = Object.assign(default_opt, {});
                $(this).slick(opt);
                $(this).closest(".slick_wrap").find(".controller .btn").each(function () {
                    if ($(this).hasClass("btn_prev")) $(this).on("click", clickPrev);
                    if ($(this).hasClass("btn_next")) $(this).on("click", clickNext);
                    if ($(this).hasClass("btn_play")) $(this).off("click", clickPlay).hide();
                    if ($(this).hasClass("btn_pause")) $(this).on("click", clickPause);
                });
            } else {
                $(this).closest(".slick_wrap").find(".controller").hide();
            }
        });
    }

    function clickPrev(e) {
        let t = $(e.currentTarget);
        let sss = t.closest(".slick_wrap").find(".slick");
        sss.slick("slickPrev");
    }
    function clickNext(e) {
        let t = $(e.currentTarget);
        let sss = t.closest(".slick_wrap").find(".slick");
        sss.slick("slickNext");
    }
    function clickPause(e) {
        let t = $(e.currentTarget);
        let sss = t.closest(".slick_wrap").find(".slick");
        sss.slick("slickPause");
        t.closest(".slick_wrap").find(".controller .btn").each(function () {
            if ($(this).hasClass("btn_play")) $(this).show().off("click", clickPlay).on("click", clickPlay);
            if ($(this).hasClass("btn_pause")) $(this).off("click", clickPause).hide();
        });
    }
    function clickPlay(e) {
        let t = $(e.currentTarget);
        let sss = t.closest(".slick_wrap").find(".slick");
        sss.slick("slickPlay");
        t.closest(".slick_wrap").find(".controller .btn").each(function () {
            if ($(this).hasClass("btn_play")) $(this).off("click", clickPlay).hide();
            if ($(this).hasClass("btn_pause")) $(this).show().off("click", clickPlay).on("click", clickPause);
        });
    }

}($));