var TUMBLP = TUMBLP || {};
TUMBLP.Background = TUMBLP.Background || {};
//var gifControler = TUMBLP.GifControler;

$(document).ready(function() {
	TUMBLP.Background.Program.init();
});

(function(exports) {

	var Program = exports.Program = {};

	Program.init = (function() {
		exports.Message.init();
		exports.Menus.init();
	});

})(TUMBLP.Background);

(function(exports) {

	var Menus = exports.Menus = {};

	Menus.init = (function() {
		create();
	});

	function create() {
		chrome.contextMenus.create({
			"title" : chrome.i18n.getMessage('previewPostPrintMenu'),
			"contexts" : ["all"],
			"onclick" : function(info, tab) {
				
				chrome.tabs.sendMessage(tab.id, {
					//DOMをリクエスト
					req : "HTML"
				}, function(response) {
					//ポストのHTMLを配列に追加
					
					//複数ポストに対応
					//exports.Post.postsHtml.push(postHtml);
					
					//単ポストに対応
					exports.Post.postsHtml[0] = response.result;
					
					//プレビューを開く
					exports.PreviewController.open("POST");
				});
			}
		});
		chrome.contextMenus.create({
			"title" : chrome.i18n.getMessage('sliceGifAnimMenu'),
			"contexts" : ["image"],
			"onclick" : function(info, tab) {
				
				chrome.tabs.sendMessage(tab.id, {
					//GIFのURLをリクエスト
					req : "GIF"
				}, function(response) {
					//GIFのURLを取得し、パース開始
					//TODO gifControler初期化
					if(isGifUrl(response.url)){
						var g = TUMBLP.GifControler;
						g.Control.start(response.url);
						exports.PreviewController.open("GIF");
					}
				});
			}
		});
		chrome.contextMenus.create({
			"title" : chrome.i18n.getMessage('sliceGifAnimDifMenu'),
			"contexts" : ["image"],
			"onclick" : function(info, tab) {
				
				chrome.tabs.sendMessage(tab.id, {
					//GIFのURLをリクエスト
					req : "GIF"
				}, function(response) {
					if(isGifUrl(response.url)){
						var g = TUMBLP.GifControler;
						g.Control.start(response.url);
						exports.PreviewController.open("GIFDIF");
					}
				});
			}
		});
	};
	
	function isGifUrl(_url){
		if(_url.split(".").pop() == "gif"){
			return true;
		}else{
			alert(chrome.i18n.getMessage('notGifFileMessage'));
			return false;
		}
	};
	

})(TUMBLP.Background);

(function(exports) {

	var Message = exports.Message = {};

	Message.init = (function() {
	});

})(TUMBLP.Background);

(function(exports) {

	var Post = exports.Post = {};

	Post.postsHtml = [];

	Post.persedGif = [];

	Post.init = (function() {
	});

})(TUMBLP.Background);

(function(exports) {

	var PreviewController = exports.PreviewController = {};

	var previewType = null;
	var isOpening = false;
	var setting = {
		'POST' : 'width=450, height=600, menubar=no, toolbar=no',
		'GIF' : 'width=450, height=600, menubar=no, toolbar=no',
		'GIFDIF' : 'width=450, height=600, menubar=no, toolbar=no'
	};

	PreviewController.init = (function() {
	});

	PreviewController.open = (function(_type) {
		previewType = _type;
		isOpening = true;
		//chrome.windows.create({'type': 'popup'}, function(window) {});
		var previewWindow = window.open('preview.html', chrome.i18n.getMessage('previewWindowTitle'), setting[previewType]);
	});

	PreviewController.getPreviewType = (function() {
		if (previewType && isOpening) {
			return previewType;
		} else {
			//TODO エラー処理
			return "PreviewType Error.";
		}
	});

})(TUMBLP.Background); 