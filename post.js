var TUMBLP = TUMBLP || {};
TUMBLP.Post = TUMBLP.Post || {};

(function (exports){
	var Enum = exports.Enum  = {
		// A4VW : 210,
		A4VH : 297,
		
		//紙は横100として縦との比率を出す
		// R_A4V : (function(){return exports.Enum.A4VH / exports.Enum.A4VW;}),	//1.414285714285714
		
		margin : 100
	};
	
	Enum.init = (function(){
		
	});
	
})(TUMBLP.Post);


$(document).ready(function(){
	
	TUMBLP.Post.Program.init();

});

(function (exports){

	var Program = exports.Program = {};
	
	Program.init = (function(){
		exports.Listener.init();
		exports.Page.init();
	});
	
})(TUMBLP.Post);

(function (exports){

	var Listener = exports.Listener = {};
	
	Listener.init = (function(){
		$(window).resize(function(){
			exports.Page.rescalePages();
		});
	});
	
})(TUMBLP.Post);

(function (exports){

	var Page = exports.Page = {};
	
	var $preview;
	var $pages;
	var $pageContainer;
	
	var scale;
	var lastScale;
	
	Page.init = (function(){
		$preview = $("#preview");
		$pages = $(".pages");
		$pageContainer = $(".page_container");
		
		Page.rescalePages();
		$pageContainer.each(function(){
			Page.evalPostHeight($(this));
		});
	});
	
	Page.rescalePages = (function(){
		var previewW = $preview.width();
		var previewH = $preview.height();
		var pagesW = $pages.width();
		var pagesH = $pages.height();
		var scrTop = $preview.scrollTop();
		
		// var A4VW = exports.Enum.A4VW;
		var A4VH = exports.Enum.A4VH;
		var margin = exports.Enum.margin;
		
		scale = previewH / (A4VH * 0.03937 * 96 + margin);
		var offX = (previewW - pagesW * scale) / 2 - pagesW * (1 - scale) / 2;
		var offY = margin * scale / 2;
		if(previewW <= pagesW * scale){
			offX = -pagesW * (1 - scale) / 2;
		}
		$pages.css("-webkit-transform","translate("+ offX +"px, "+ offY +"px) scale("+ scale +")");
		// $pages.scrollTop(scrTop+pagesH*(lastScale-scale));
		$pageContainer.css("margin-bottom", + offY / scale + "px");
		
		//lastScale = scale;
	});
	
	//1ページに収まらないポストか判別
	Page.evalPostHeight = (function($postContainer){
		if($postContainer.height() > $pageContainer.height()){
			//cssでタイプに応じてポスト拡大率やレイアウトを変更
			$postContainer.addClass("largePost");
		}
	});
	
	Page.clearStyle = (function() {
		$pages.css("-webkit-transform","none");
		$pageContainer.css("margin-bottom", "0");
	});
	
})(TUMBLP.Post);