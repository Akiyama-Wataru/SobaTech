// JavaScript Document

function browser_name(){
	var br;
	var ieflag=false;
	var userAgent = window.navigator.userAgent.toLowerCase();
	var appVersion = window.navigator.appVersion.toLowerCase();
	if (userAgent.indexOf("msie") > -1) {
		if (appVersion.indexOf("msie 6.0") > -1) br="ie6";
		else if (appVersion.indexOf("msie 7.0") > -1) br="ie7";
		else if (appVersion.indexOf("msie 8.0") > -1) br="ie8";
		else if (appVersion.indexOf("msie 9.0") > -1) br="ie9";
		else if (appVersion.indexOf("msie 10.0") > -1) br="ie10";
		else br="ie10";
		ieflag=true;
	}else if (userAgent.indexOf("trident/7.0") > -1) br="ie11";
	else if (userAgent.indexOf("firefox") > -1) br="firefox";
	else if (userAgent.indexOf("opera") > -1) br="opera";
	else if (userAgent.indexOf("chrome") > -1) br="chrome";
	else if (userAgent.indexOf("safari") > -1) br="safari";
	else br="browser";
	$("body").addClass(br);
	if(ieflag) $("body").addClass("ie");
}