var TUMBLP = TUMBLP || {};
TUMBLP.Preview = TUMBLP.Preview || {};

$(document).ready(function(){
	TUMBLP.Preview.Program.init();
});

(function (exports){

	var Program = exports.Program = {};
	
	exports.previewType = null;

	//TODO　記述場所
	exports.bg = chrome.extension.getBackgroundPage().TUMBLP.Background;
	
	Program.init = (function(){
		//プレビュータイプを取得
		exports.previewType = exports.bg.PreviewController.getPreviewType();

		switch(exports.previewType){
			case "POST" :
				exports.Post.init();
				break;
			case "GIF" :
				exports.Gif.init();
				break;
			case "GIFDIF" :
				exports.Gif.init();
				break;
		}
		exports.UI.init(exports.previewType);
	});
	
})(TUMBLP.Preview);

(function (exports){
	
	var Post = exports.Post = {};
	
	Post.postsHtml = [];
	
	Post.init = (function(){
		Post.inportAllPostsHtml();
		Post.appendAllPostsHtml();
	});
	
	Post.inportAllPostsHtml = (function(){
		//バックグラウンドページからポストの配列を取得
		Post.postsHtml = chrome.extension.getBackgroundPage().TUMBLP.Background.Post.postsHtml;
	});
	
	Post.appendAllPostsHtml = (function(){
		//配列の内容をすべてDOMに追加
		/*
		for (var i=0; i < Post.postsHtml.length; i++) {
			var element = document.createElement('li');
			$(element).attr('class','post_container');
			element.innerHTML = Post.postsHtml[i];
			
			//単ページ対応
			$(".posts:first").append(element);
		};
		*/
		$.each(Post.postsHtml, function(){
			var element = document.createElement('li');
			$(element).attr('class','post_container');
			element.innerHTML = this;
			
			//単ページ対応
			$(".posts:first").append(element);
		});
	});
})(TUMBLP.Preview);

(function (exports){
	
	var Gif = exports.Gif = {};
	
	var gif = chrome.extension.getBackgroundPage().TUMBLP.GifControler.Control;
	
	Gif.frames;
	var isPersed = false;
	var elm;
	
	Gif.init = (function(){
		elm = $(".posts").get(0);
		waitPerse();
	});
	
	function waitPerse(){
		// var p = 0;
		
		//インジケータ表示
		toggleLoadingUi(elm);
		
		//バックグラウンドページから処理進捗を取得し待機
		var wait = setInterval(function() {
			p = gif.progressPercent;
			// console.log(p+"%");
			// $("#progress").text(p);
			if (p >= 100) {
				if (gif.checkIsPersed()){
					clearInterval(wait);
					afterPerse();
				}
			}
		}, 50);
	};
	
	function afterPerse(){
		Gif.frames = getFrames();
		if(exports.previewType == "GIF"){
			var canvases = createPngs(Gif.frames);
			addFramesToDom(canvases, elm);
		}else if(exports.previewType == "GIFDIF"){
			var canvases = createPngs(Gif.frames,true);
			addFramesToDom(canvases, elm);
		}
		fixLayout(elm, canvases);
		toggleLoadingUi(elm);
		refresh(elm);
	};
	
	function toggleLoadingUi(_elm){
		if($("#loading").hasClass("none")){
			$("#loading").removeClass("none");
		}else{
			$("#loading").addClass("none");
		}
	};
	
	function getFrames(){
		 return gif.frames;
	};
	
	function createCanvases(_frames,isTransparentBg){
		if(typeof isTransparentBg === 'undefined'){
			isTransparentBg = false;
		}
		var frames = _frames;
		var canvases = [];
		if(isTransparentBg){
			frames.forEach(function(e){
				var canvas = makeCanvasFromFrame(frames[0]);
				var context = canvas.getContext('2d');
				context.putImageData(e, 0, 0);
				canvases.push(canvas);
			});
		}else{
			var tmpCanvas = makeCanvasFromFrame(frames[0]);
			var tmpContext = tmpCanvas.getContext('2d');
			var lastCanvas = makeCanvasFromFrame(frames[0]);
			var lastContext = lastCanvas.getContext('2d');
			frames.forEach(function(e){
				var canvas = makeCanvasFromFrame(frames[0]);
				var context = canvas.getContext('2d');
				tmpContext.putImageData(e, 0, 0);
				context.drawImage(lastCanvas,0,0,lastCanvas.width,lastCanvas.height);
				context.drawImage(tmpCanvas,0,0,tmpCanvas.width,tmpCanvas.height);
				lastContext.drawImage(canvas,0,0,canvas.width,canvas.height);
				canvases.push(canvas);
			});
		}
		return canvases;
	};
	
	function createPngs(_frames,isTransparentBg){
		if(typeof isTransparentBg === 'undefined'){
			isTransparentBg = false;
		}
		var frames = _frames;
		var pngs = [];
		if(isTransparentBg){
			frames.forEach(function(e){
				var canvas = makeCanvasFromFrame(frames[0]);
				var context = canvas.getContext('2d');
				context.putImageData(e, 0, 0);
				var img_png_src = canvas.toDataURL("image/png");
				var png = $("<img/>").addClass("frame");;
				png.attr('src', img_png_src);
				pngs.push(png[0]);
			});
		}else{
			var tmpCanvas = makeCanvasFromFrame(frames[0]);
			var tmpContext = tmpCanvas.getContext('2d');
			var lastCanvas = makeCanvasFromFrame(frames[0]);
			var lastContext = lastCanvas.getContext('2d');
			frames.forEach(function(e){
				var canvas = makeCanvasFromFrame(frames[0]);
				var context = canvas.getContext('2d');
				tmpContext.putImageData(e, 0, 0);
				context.drawImage(lastCanvas,0,0,lastCanvas.width,lastCanvas.height);
				context.drawImage(tmpCanvas,0,0,tmpCanvas.width,tmpCanvas.height);
				lastContext.drawImage(canvas,0,0,canvas.width,canvas.height);
				var img_png_src = canvas.toDataURL("image/png");
				var png = $("<img/>").addClass("frame");
				png.attr('src', img_png_src);
				pngs.push(png[0]);
			});
		}
		return pngs;
	};
	
	function makeCanvasFromFrame(frame){
		var canvas = $("<canvas/>").addClass("frame").get(0);
		canvas.width = frame.width;
		canvas.height = frame.height;
		return canvas;
	};
	
	function addFramesToDom(_frames, _elm){
		_frames.forEach(function(e){
			$(_elm).append(e);
		});
	};
	
	function fixLayout(_elm, _canvases){
		/*TODO Enum*/
		// var l = Math.round(Math.sqrt(postEnum.A4VH * postEnum.A4VW / _canvases.length));
		var A4VW = 210;
		var A4VH = 297;
		var w = _canvases[0].width;
		var h = _canvases[0].height;
		var enm = 0.8;
		var l = Math.round(Math.sqrt(A4VH * A4VW / _canvases.length)* enm * 2 * h / (w + h));
		var p = l * 100 / A4VH;
		$(_elm).children(".frame").css("max-height", p + "%");
	};
	
	function refresh(_elm){
		$(_elm).css("visibility","hidden");
		$(_elm).css("visibility","visible");
	};
	
})(TUMBLP.Preview);

(function (exports){
	
	var UI = exports.UI = {};
	
	var printBtn;
	var bgFillRadio = [];
	var bgFillRadioSelected;
	var bgAreaRadio = [];
	var bgAreaRadioSelected;
	
	UI.init = (function(previewType){
		
		var $posts_wrapper = $('.posts_wrapper');
		
		$('body').addClass(previewType.toLowerCase());
		
		printBtn = document.getElementById("printBtn");
		printBtn.addEventListener("click", exports.Action.printPreview);
		
		$('input[name="bg_fill"]:radio').each(function(){
			bgFillRadio.push($(this).val());
		});
		$('input[name="bg_area"]:radio').each(function(){
			bgAreaRadio.push($(this).val());
		});
		$('input[name="bg_fill"]:radio').change(function(){
			bgFillRadioSelected = $(this);
			bgFillRadioSelected.attr("checked", true);
			for(var i=0; i<bgFillRadio.length; i++){
				$posts_wrapper.removeClass(bgFillRadio[i]);
			};
			$posts_wrapper.addClass(bgFillRadioSelected.val());
		});
		$('input[name="bg_area"]:radio').change(function(){
			bgAreaRadioSelected = $(this);
			bgAreaRadioSelected.attr("checked", true);
			for(var i=0; i<bgAreaRadio.length; i++){
				$posts_wrapper.removeClass(bgAreaRadio[i]);
			};
			$posts_wrapper.addClass(bgAreaRadioSelected.val());
		});
		$('input[name="op"]:checkbox').change(function(){
			opCheckboxSelected = $(this);
			if(opCheckboxSelected.attr("checked")){
				opCheckboxSelected.attr("checked", false);
				$posts_wrapper.removeClass(opCheckboxSelected.val());
			}else{
				opCheckboxSelected.attr("checked", true);
				$posts_wrapper.addClass(opCheckboxSelected.val());
			}
		});
		
		/*初期化*/
		$('input[name="bg_fill"]:radio' + '#bg_normal').attr("checked", true);
		$posts_wrapper.addClass("bg_fill_normal");
		
		if(previewType == "POST"){
			$('input[name="bg_area"]:radio' + '#bg_min').attr("checked", true);	
			$('input[name="op"]:checkbox' + '#op_note').attr("checked", true);	
			$('input[name="op"]:checkbox' + '#op_avatar').attr("checked", true);	
			$posts_wrapper.addClass("bg_area_min");
			$posts_wrapper.addClass("op_note");
			$posts_wrapper.addClass("op_avatar");
			$('input[name="op"]:checkbox' + '#op_trim + label').css("display","none");
		}
		if(previewType == "GIF" || previewType == "GIFDIF"){
			$('input[name="bg_area"]:radio' + '#bg_none').attr("checked", true);	
			$posts_wrapper.addClass("bg_area_none");
			$('input[name="op"]:checkbox' + '#op_note + label').css("display","none");
			$('input[name="op"]:checkbox' + '#op_avatar + label').css("display","none");
		}
		
		/*トラッキングコード*/
		/*
		$('input[name="bg_area"]:radio' + '#bg_full').bind("click", function(){
			ga('send', 'event', 'control', previewType + ':bg_area', 'full');
		});
		$('input[name="bg_area"]:radio' + '#bg_min').bind("click", function(){
			ga('send', 'event', 'control', previewType + ':bg_area', 'min');
		});
		$('input[name="bg_area"]:radio' + '#bg_none').bind("click", function(){
			ga('send', 'event', 'control', previewType + ':bg_area', 'none');
		});
		*/
		printBtn.addEventListener("click", function(){
			// ga('send', 'event', 'control', 'print', previewType);
			var c = [];
			$('input:radio:checked', '#controlArea').each(function(){
				c.push($(this).val());
			});
			$('input:checkbox:checked', '#controlArea').each(function(){
				c.push($(this).val());
			});
			ga('send', 'event', previewType, 'print', c.join("-"));
		});
	});

})(TUMBLP.Preview);

(function (exports){
	
	var Action = exports.Action = {};
	
	Action.init = (function(){
	});

	Action.printPreview = (function(){
		TUMBLP.Post.Page.clearStyle();
		window.print();
		//プレビュー終了後の復帰処理  ウィンドウリサイズイベントは再発行されている模様
	});

})(TUMBLP.Preview);