var TUMBLP = TUMBLP || {};
TUMBLP.Content = TUMBLP.Content || {};

$(document).ready(function(){
	TUMBLP.Content.Program.init();
});

(function (exports){

	var Program = exports.Program = {};
	
	Program.init = (function(){
		exports.PageHandler.init();
		exports.Message.init();
	});
	
})(TUMBLP.Content);

(function (exports){

	var Post = exports.Post = {};
	
	Post.init = (function(){
	});
	
	function extractPostElements(postHtml){
		/*
		 * 必要なもの
		post_avatar_image
		post_header	（post_heade>post_info>aを除く）
		post_content
			post_media	(post_media>scriptを除く)
			post_title
			post_body
		post_footer
			post_notes
			(post_controls)要アイコン対応
		 */
		
		var doc = document.implementation.createHTMLDocument();
		var container = document.createElement('div');
		container.innerHTML = postHtml;
		doc.body.appendChild(container);
		
		var post = document.createElement('div');
		
		var postAvatar = document.createElement('div');
		$(postAvatar).attr('class','post_avatar');
		$(postAvatar).append($(doc).find('.post_avatar_image'));
		post.appendChild(postAvatar);
		
		$(doc).find('.post_info > a').remove();
		var postHeader = $(doc).find('.post_header');
		$(post).append(postHeader);
		
		if($(doc).find('.post_media')){
			$(doc).find('.post_media > script').remove();
		}
		var postContent = $(doc).find('.post_content');
		$(post).append(postContent);
		
		$(doc).find('.post_controls').remove();
		var postFooter = $(doc).find('.post_footer');
		$(post).append(postFooter);
			
		return $(post).html();
	}
	
	Post.lastPostId;
	
	Post.getLastPostHtml = (function(){
		var postHtml = extractPostElements($("#"+Post.lastPostId).html());
		return postHtml;
	});
	
})(TUMBLP.Content);

(function (exports){

	var Gif = exports.Gif = {};
	
	Gif.init = (function(){
	});
	
	Gif.url;
	
})(TUMBLP.Content);

(function (exports){
	
	var Message = exports.Message = {};
	
	Message.init = (function(){
		chrome.runtime.onMessage.addListener(
			function(request, sender, sendResponse){
				if(request.req) {
					switch(request.req) {
						//ポストのDOMのリクエストを受信	
						case "HTML" :
							sendResponse({result : exports.Post.getLastPostHtml()});
							break;
						//GIFのURLのリクエストを受信	
						case "GIF" :
							sendResponse({url : exports.Gif.url});
							break;
					}
				}
			}
		);
	});
	
})(TUMBLP.Content);

(function (exports){

	var PageHandler = exports.PageHandler = {};
	
	PageHandler.init = (function(){
		//ポスト上でマウスダウン時にポストIDを取得
		$(document).on('mousedown', '.post_container', 
			(function(event) {		
				exports.Post.lastPostId = $(this).children("div").attr("id");
				// console.debug('Clicked post: ' + exports.Post.lastPostId);
			})
		);
		//TODO 画像の場合は常にURLを取得する
		$(document).on('mousedown', '.post_container img',
			(function(event) {		
				exports.Gif.url = $(this).attr("src");
				// console.debug('Clicked element: ' + this);
			})
		);
	});
	
})(TUMBLP.Content);