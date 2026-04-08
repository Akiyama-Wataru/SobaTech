// JavaScript Document

var category, path, page, phase, directory, lang, user;
var erase_array = [];
var new_array = [];
var hash, isTouch, params, loadimgs, isSP;
var hashflag = false;
var nowy = 0;
var scrolly = 0;
var black;

const ie11_flag = checkIE11();
function checkIE11() {
    var userAgent = window.navigator.userAgent.toLowerCase();
    return userAgent.indexOf("trident/7.0") > -1;
}

var endflag = false;

checkTouch();


$(window).on("load", function () {
    //console.log("load!");
    $("body").addClass("loaded");
    setTimeout(function () {
        effectStart();
    }, 200);
});

$(init);

function effectStart() {
    $(document).on("scroll", handler.scroll);
    handler.scroll();
    setIntersectionObserver();
    $(".scroller_wrap").each(function () {
        var scroller = new Scroller($(this), $(this).closest(".section").find(".scroller_control_wrap"));
        scroller.init();
    });
}

function init() {
    hash = location.hash;
    loadimgs = $("img").length;
    if (hash != "") {
        hash = hash.substr(1);
        if (hash.indexOf("?") > 0) hash = hash.split("?")[0];
        $("img").on("load", function () {
            loadimgs--;
            if (loadimgs <= 0 && !hashflag) {
                hashflag = true;
            }
        });
        setTimeout(function () {
            if (!hashflag && category != 'home') {
                hashflag = true;
            }
        }, 50);
    }

    var searchword = location.search;
    if (searchword != "") {
        params = new Object();
        searchword = searchword.substr(1);
        if (searchword.indexOf("#") > 0) searchword = searchword.split("#")[0];
        if (searchword.indexOf("&") > 0) {
            var searcharray = searchword.split("&");
            for (var i = 0, sn = searcharray.length; i < sn; i++) {
                var mysw = searcharray[i];
                var key = mysw.split("=")[0];
                var v = decodeURI(mysw.split("=")[1]).replace(/%2C/g, ",");
                params[key] = v;
            }
        } else {
            var key2 = searchword.split("=")[0];
            var v2 = decodeURI(searchword.split("=")[1]).replace(/%2C/g, ",");
            params[key2] = v2;
        }
    }

    //繝悶Λ繧ｦ繧ｶ繝ｼ繧貞愛螳壹＠縺ｦbody縺ｫclass縺ｨ縺励※霑ｽ蜉 
    browser_name();

    //OS蛻､螳�
    if (navigator.userAgent.toLowerCase().indexOf('win') != -1) {
        $("body").addClass("win");
    } else if (navigator.userAgent.toLowerCase().indexOf('mac') != -1) {
        $("body").addClass("mac");
    }


    //繧ｹ繝槭ヵ繧ｩ縺九ｉ縺ｪ繧�
    if (isTouch) {
        $("body").addClass("touch").removeClass("navi_on");
    }

    $(".navi").checkNavi();


    $("#hamburger").on("click", function () {
        if (!$("body").hasClass("navi_on")) nowy = $(document).scrollTop();
        $("body").toggleClass("navi_on");
        if (!$("body").hasClass("navi_on")) adjustRealY();
    });

    $("a[target='_blank']").each(function () {
        if ($(this).hasClass("to_solution_link")) {
            $(this).attr("rel", "noopener");
        } else {
            $(this).attr("rel", "noopener noreferrer");
        }
    });

    // modal setting
    $(".to_modal").setToModal();

    //sns share URL set
    setShareUrl();

    // cattegory change
    $(".select_wrap.category_wrap select[name='cat']").on("change", function () {
        location.href = $(this).val();
    });

    //accordion{
    $(".accordion").setAccordionWrap();

    // tab change
    if ($(".section .tab_change").length > 0) {
        $(".section").setTabChange();
    }

    $(".category_btns_wrap .now").on("click", function () {
        $(this).closest(".category_btns_wrap").find(".btns").addClass("active");
    });

    $(document).on("click", function (e) {
        if (!$(e.target).closest('.category_btns_wrap').length) {
            $(".category_btns_wrap .btns").removeClass("active");
        }
    });

    $(".copy_link").on("click", function (e) {
        e.preventDefault();
        var t = $(e.currentTarget);
        var url = t.attr("href");
        if (!navigator.clipboard) {
            alert("クリップボードコピーに対応していません...");
            return;
        }
        if (url) {
            navigator.clipboard.writeText(url).then(
                () => {
                    alert('URLをコピーしました');
                },
                () => {
                    alert('URLのコピーに失敗しました');
                }
            );
        }

    });

    /** #headのsearch_wrap */
    $("#head .search .btn_oc").on("click", function () {
        if ($("#head .search").hasClass("active")) $("#head .search").removeClass("active");
        else $("#head .search").addClass("active");
    });
	
	$("#float_banners .banner .btn_close").on("click",function(e){
		$(e.currentTarget).closest(".banner").remove();
	});
}

function adjustRealY() {
    const target = $("body,html");
    target.animate({
        scrollTop: nowy
    }, {
        duration: 0
    });
}

var handler = {
    scroll: function (e) {
        var st = $(document).scrollTop();

        //console.log(st);
        var wh = window.innerHeight;
        var ww = $(window).innerWidth();
        //console.log((st+wh)+":"+Math.floor($("#contents").innerHeight()));
        if (st > 0) $("body").addClass("scrolled");
        else $("body").removeClass("scrolled");

        if (st > wh / 4) {
            $(".over_fv").addClass("active");
            $("body").addClass("scrolled_fv");
        } else {
            $(".over_fv").removeClass("active");
            $("body").removeClass("scrolled_fv");
        }

        var check = Math.abs(window.orientation) === 90 ? (wh * 3 / 4) : (wh * 4 / 5);

        $(".section:not(.show)").each(function () {
            if ($(this).offset().top - check < st) $(this).addClass("show");
        });

        $(".svg:not('.loading')").each(function () {
            if ($(this).offset().top < st + wh || $(this).closest("#foot").length > 0) {
                loadSVG($(this));
            }
        });

        $(".effect-scrolling").each(function () {
            let myy = $(this).offset().top;
            let moveStart = myy - wh * 1.5;
            let moveEnd = myy - wh * 2 / 5;
            let startPos = Number($(this).data("start-pos"));
            let endPos = Number($(this).data("end-pos"));
            let scale = (st - moveStart) / (moveEnd - moveStart);
            let x = 0;
            if (scale < 0) {
                x = startPos;
            } else if (scale > 1) {
                x = endPos;
            } else {
                x = startPos + ((endPos - startPos) * scale)
            }
            $(this).css({
                transform: "translateX(" + x + "vw)"
            });
        });

        scrolly = st;
    },
    wheel: function (e) {

    },
    wheel2: function (e) {
        e.preventDefault();
        console.log(e.originalEvent.deltaY);
        if (e.originalEvent.deltaY < 0) {
            $("#foot").off("wheel", handler.wheel2);
            $("#hamburger").trigger("click");
        }
    },
    touchstart: function (e) {
        var pos = getTouchPosition(e);
    },
    touchmove: function (e) {
        var pos = getTouchPosition(e);
    },
    touchend: function () {
    }
}

function getTouchPosition(e) {
    var pos = {
        x: Math.floor(e.originalEvent.touches[0].pageX),
        y: Math.floor(e.originalEvent.touches[0].pageY)
    }
    return pos;
}

function checkTouch() {
    isTouch = false;
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    var layoute = 'full';

    //繧ｿ繝�メ繝�ヰ繧､繧ｹ蛻､螳�
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('iphone') > 0 ||
        ua.indexOf('ipod') > 0 ||
        (ua.indexOf('ipad') > -1 || ua.indexOf('macintosh') > -1 && 'ontouchend' in document) ||
        ua.indexOf('windows phone') > 0 ||
        ua.indexOf('blackBerry') > 0 ||
        ua.indexOf('android') > 0) {
        isTouch = true;

        if (window.parent.screen.width < 768) isSP = true;
    }
}


function getParam(str) {
    var o = new Object();
    if (str == undefined || str == "" || str == null) return null;
    var array = str.split(",");
    for (var i = 0; i < array.length; i++) {
        var k = array[i].split(":")[0];
        var v = array[i].split(":")[1];
        o[k] = v;
    }
    return o;
};

function getNumberFromProperty(str, _diff) {
    var diff = _diff || 2;
    return Number(str.substr(0, str.length - diff));
}


(function ($) {
    var tgt;
    $.fn.checkNavi = function () {
        tgt = $(this);
        $("body").find(".navi_btn[key='" + category + "']").addClass("here");
        $("body").find(".navi_btn[key='" + category + "'] .navi_btn[key='" + page + "']").addClass("here");

        $("nav .navi > .btn").each(function () {
            if ($(this).find(".sub_navi_wrap").length > 0) {
                $(this).addClass("hasSubnavi").children(".a").on("click", function (e) {
                    e.preventDefault();
                    $(this).closest(".btn").addClass("active");
                    $("nav").addClass("show_subnavi");
                });
            }
        });

        $("nav .navi .navi_btn[key='back']").on("click", function () {
            $("nav").removeClass("show_subnavi");
            $("nav .navi .navi_btn").removeClass("active");
        });

        for (var i = 0, n = erase_array.length; i < n; i++) {
            var key = erase_array[i];
            var t = tgt.find(".navi_btn[key='" + key + "']");
            if (t.length != 0) {
                t.each(function () {
                    var aaa = $("<div />").addClass("a");
                    aaa.append($(this).find("a.a").children());
                    $(this).append(aaa);
                    $(this).find("a").remove();
                });
            }
        }

        for (var i2 = 0, n2 = new_array.length; i2 < n2; i2++) {
            var key2 = new_array[i2];
            var t2 = tgt.find(".navi_btn[key='" + key2 + "']");
            if (t2.length != 0) {
                var span = $("<span />").addClass("new fixed_center");
                t2.find(".a").append(span);
            }
        }
    }
}($));


(function ($) {
    var tgt;
    $.fn.setSlideShow = function () {
        tgt = $(this);
        tgt.each(function () {
            $(this).data("direction");
            arrows = $(this).find(".arrow");
            thumbs = $(this).find(".thumbs");
            if (thumbs.find(".thumb").length <= 1) $(this).addClass("no_thumbs");
            ss = new SlideShow($(this));
            if (category != "home") ss.timerStop();
            ss.init("fade", 7, thumbs);
            arrows.click(function (e) {
                ss.move(Number($(e.currentTarget).attr("key")));
            });
        });
    }
}($));


function loadSVG(tgt) {
    if (!tgt.hasClass("loading") || !tgt.hasClass("loaded")) {
        var src = tgt.data("src");
        if (location.href.indexOf("thesaurus.co.jp") > -1) src = path + src;
        tgt.addClass("loading");
        $.ajax({
            type: 'GET',
            url: src,
        }).done(function (returnData) {
            var svg = $(returnData).find('svg');
            tgt.append(svg).addClass("loaded").trigger("loaded");
        });
    }
}

(function ($) {
    var tgt, black, modal, wrap, closebtn;
    $.fn.setToModal = function () {
        tgt = $(this);
        black = $("<div>").addClass("black fixed_center");
        modal = $("<div>").addClass("modal fixed_center");
        wrap = $("<div>").addClass("modal_inner");
        var inner = $("<div>").addClass("modal_inner_wrap");
        inner.append(wrap);
        closebtn = $("<div>").addClass("btn btn_close fixed_center");
        inner.append(closebtn);
        modal.append(black, inner);
        $("body").append(modal);

        tgt.each(function () {
            switch ($(this).data("modal_style")) {
                case "youtube":
                    var ybid = $(this).data("ybid");
                    var img = "https://i.ytimg.com/vi/" + ybid + "/0.jpg";
                    $(this).find("img").attr({
                        src: img
                    })
                    $(this).find(".photo .bg").css({
                        backgroundImage: "url(" + img + ")"
                    });
                    $(this).on("click", setYoutube);
                    break;
                case "video":
                    $(this).on("click", setVideo);
                    break;
                default:
                    $(this).on("click", setModal);
            }
        });
    }

    function setYoutube(e) {
        var t = $(e.currentTarget);
        var ybid = t.data("ybid");
        var modal_content = '<div class="movie"><iframe class="fixed_center" src="https://www.youtube.com/embed/' + ybid + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
        openModal(modal_content, "youtube");
    }
    function setVideo(e) {
        var t = $(e.currentTarget);
        var source = $("<source>");
        source.attr("src", t.data("ybid"));
        var video = $("<video>").prop("controls", true).append(source);
        var movie = $("<div>").addClass("movie").append(video);
        var modal_content = movie;
        openModal(modal_content, "video");
    }

    function openModal(content, style) {
        wrap.empty().append(content);
        black.addClass("active");
        modal.addClass("active").attr("stl", style);
        closebtn.on("click", closeModal);
    }

    function closeModal() {
        black.removeClass("active");
        modal.removeClass("active").attr("stl", "");
        wrap.empty();
        closebtn.off("click", closeModal);
    }

    function setModal(e) {
        var key = $(e.currentTarget).data("tgt_modal");
        openModalByKey(key);
    }


    function openModalByKey(key) {
        var tgtModal = $(".modal[key='" + key + "']");
        if (tgtModal.length > 0) {
            black.addClass("active");
            if (tgtModal.find(".slick").length > 0) {
                tgtModal.find(".slick").slick("slickGoTo", 0, true);
            }
            tgtModal.addClass("active");
            tgtModal.find(".btn_close").on("click", closeModalByKey);
            tgtModal.find(".modal_black").on("click", closeModalByKey);
        }

    }
    function closeModalByKey(e) {
        black.removeClass("active");
        var tgtModal = $(e.currentTarget).closest(".modal");
        tgtModal.removeClass("active");
        tgtModal.find(".btn_close").off("click", closeModalByKey);
        tgtModal.find(".modal_black").off("click", closeModalByKey);
    }
}($));


function setShareUrl() {
    $(".share .sns,.share_wrap .share,.share_link_wrap .sns").each(function () {
        var myurl = location.href;
        var title = document.title;
        $(this).find(".btn_facebook .a,.btn[key='facebook'] .a").attr({
            href: 'https://www.facebook.com/sharer/sharer.php?u=' + myurl + '&t=' + title,
            target: "_blank",
            rel: "noopener"
        });
        $(this).find(".btn_twitter .a,.btn[key='twitter'] .a,.btn_x .a,.btn[key='x'] .a").attr({
            href: 'https://twitter.com/intent/tweet?url=' + myurl + '&text=' + title,
            target: "_blank",
            rel: "noopener"
        });
        $(this).find(".btn_line .a,.btn[key='line'] .a").attr({
            href: 'http://line.me/R/msg/text/?' + title + '%0A' + myurl,
            target: "_blank",
            rel: "noopener"
        });

        $(this).find(".btn_note .a,.btn[key='note'] .a").attr({
            href: 'https://note.com/intent/post?url=' + myurl,
            target: "_blank",
            rel: "noopener"
        });

        $(this).find(".btn_copy_link .a").on("click", copyUrl);
    });
}

function copyUrl() {
    let url = location.href;
    let element = document.createElement("input");
    element.value = url;
    document.body.appendChild(element);
    element.select();
    document.execCommand("copy");
    document.body.removeChild(element);
    window.alert("記事のURLをコピーしました");
}


function setIntersectionObserver() {
    let tgts = document.querySelectorAll(".animate,.effect,.control,.section");
    const opt = {
        root: null,
        rootMargin: "-25% 0px",
        threshold: 0 // 髢ｾ蛟､縺ｯ0
    }
    const observer = new IntersectionObserver(doWhenIntersect, opt);

    tgts.forEach(tgt => {
        observer.observe(tgt);
    });
}

/**
 * 莠､蟾ｮ縺励◆縺ｨ縺阪↓蜻ｼ縺ｳ蜃ｺ縺咎未謨ｰ
 * @param entries
 */
function doWhenIntersect(entries) {
    // 莠､蟾ｮ讀懃衍繧偵＠縺溘ｂ縺ｮ縺ｮ縺ｪ縺九〒縲（sIntersecting縺荊rue縺ｮDOM繧定牡繧貞､峨∴繧矩未謨ｰ縺ｫ貂｡縺�
    entries.forEach(entry => {
        if ($(entry.target).hasClass("animate")) {
            if (entry.isIntersecting) {
                activateElement($(entry.target));
            }
        } else {
            if (entry.isIntersecting) {
                activateElement($(entry.target));
            } else {
                deactivateElement($(entry.target));
            }
        }

        if ($(entry.target).hasClass("section")) {
            if ($(entry.target).attr("id") == "foot") {
                if (entry.isIntersecting) $("body").addClass("reach_to_foot");
                else $("body").removeClass("reach_to_foot");
            } else {
                if (entry.isIntersecting) {
                    //console.log($(entry.target).data("name"));
                    let nowSection = $(entry.target).data("name") || "ConnectX";
                    $(".section_here_wrap .section_name").text(nowSection);
                }
            }
        }
    });
}

function activateElement(element) {
    if (element.hasClass("control")) element.get(0).play();
    element.addClass("active");
    if (element.hasClass("section")) {
        let key = element.attr("key");
        if (key) {
            $(window).trigger("inSection_" + key);
        }
    }
}
function deactivateElement(element) {
    if (element.hasClass("control")) element.get(0).pause();
    element.removeClass("active");
    if (element.hasClass("section")) {
        let key = element.attr("key");
        if (key) {
            $(window).trigger("outSection_" + key);
        }
    }
}

/*(function($){
    var tgt;
    let observer;
    $.fn.setScrollFitting=function(){
        tgt=$(this);
        const opt={
            root: null,
            rootMargin: "0% 0px 25% 0px",
            threshold: 0 // 髢ｾ蛟､縺ｯ0
        }
        observer=new IntersectionObserver(doWhenIntersect, opt);
        tgt.each(function(i){
            observer.observe(tgt.get(i));
        });
        
    }
    function doWhenIntersect(entries){
        let flag=false;
        entries.forEach(entry => {
            if(entry.isIntersecting){
                flag=true;
                $(entry.target).addClass("active");
            }else{
                $(entry.target).remove("active");
            }
        });
                
        if(flag){
            $(document).on("scroll",scrolling);
        }else{
            $(document).off("scroll",scrolling);
        }
    }
    function scrolling(){
        const st = $(document).scrollTop();
        const wh=window.innerHeight;
        tgt.each(function(){
            //console.log($(this).hasClass("active"));
            if($(this).hasClass("active")){
                const parent = $(this).closest(".section")
                const y = parent.offset().top;
                const h = parent.innerHeight() - wh;
                const cont = $(this).find(".scroller");
                const contw = cont.innerWidth();
                const w = $(this).innerWidth();
                const range = contw - w;

                let scale = ( st - y ) / h;
                if(scale < 0 ) scale=0;
                else if(scale > 1) scale=1;
                let x = -range * scale;
                //console.log(cont);
                cont.attr({
                   style:'transform:matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, calc('+x+'), 0, 0, 1);',
                });
            }
        });
    }
}($));*/

(function ($) {
    var tgt;
    $.fn.setAccordionWrap = function () {
        tgt = $(this);
        tgt.find(".accordion_head").on("click", function (e) {
            $(e.currentTarget).closest(".accordion").toggleClass("active");
        });
    }

}($));

(function ($) {
    var tgt;
    $.fn.setTabChange = function () {
        tgt = $(this);
        tgt.each(function () {
            let tabs = $(this).find(".tab_change");
            tabs.on("click", preChange);
            change($(this), $(tabs.get(0)).attr("key"));
        });
    }

    function preChange(e) {
        e.preventDefault();
        const tgtSection = $(e.currentTarget).closest(".section");
        change(tgtSection, $(e.currentTarget).attr("key"));
    }

    function change(tgtSection, k) {
        if (tgtSection.attr("now") === k) return false;
        const tab_conts = tgtSection.find(".tab_change");
        const tabs = tgtSection.find(".tab_change_tgt");
        tabs.each(function () {
            if ($(this).attr("key") == k) $(this).addClass("active");
            else $(this).removeClass("active");
        });
        tab_conts.each(function () {
            if ($(this).attr("key") == k) $(this).addClass("active");
            else $(this).removeClass("active");
        });
        tgtSection.attr("now", k);
    }
}($));