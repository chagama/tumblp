var TUMBLP = TUMBLP || {};
TUMBLP.GifControler = TUMBLP.GifControler || {};

(function (exports){
	var Control = exports.Control  = {};
	
	var url;
	
	var stream;
	var handler;
	
	Control.frames  = [];
	Control.progressPercent = 0;
	var canvas = $("<canvas/>").get(0);
	var isPersed = false;
	
	var transparency;
	var disposal_method;
	var context;
	var header;
	
	var perseMode = "FRAME"; /* FRAME or DIF */
	
	Control.start = (function(_url){
		Control.init(_url);
	});
	
	Control.init = (function(_url){
		url = _url;
		
		/*TODO Initialize*/
		canvas = $("<canvas/>").get(0);
		context = null;
		stream = null;
		transparency = null;
		disposal_method = null;
		header = null;
		Control.frames  = [];	//clear cache
		
		handler = {
			hdr: parserHandlers.header,
			gce: parserHandlers.graphicControl,
			img: parserHandlers.image,
			eof: parserHandlers.end
		};
		load(url);
	});
	
	function load(url){
		$.ajax({
			url: url,
			beforeSend: function(req){
				req.overrideMimeType('text/plain; charset=x-user-defined');
			},
			complete: function(req){
				stream = new Stream(req.responseText);
				parseGIF(stream, handler);
			}
		});
	};
	
	function progress(){
		Control.progressPercent = Math.round(stream.pos / stream.data.length * 100);
	};
	
	var parserHandlers = {
		header : (function(_header){
			progress();
			header = _header;
			canvas.width = header.width;
			canvas.height = header.height;
		}),
		graphicControl : function(_gce){
			progress();
			var gce = _gce;
			if(context){
				Control.frames.push(context.getImageData(0,0,header.width,header.height));
			}
			context = null;
			transparency = (function(){
				if(gce.transparencyGiven){
					return gce.transparencyIndex;
				}else{
					return null;
				}
			});
			disposal_method = gce.disposalMethod;
			// console.log("disposal_method: " + disposal_method);
		},
		image : function(_image){
			progress();
			var image = _image;
			if(!context){
				context = canvas.getContext('2d');
			}
			var color_table = (function(){
				if(image.lctFlag){
					return image.lct;
				}else{
					return header.gct;
				}
			})();
			var image_data = context.getImageData(image.leftPos, image.topPos, image.width, image.height);
			$.each(image.pixels, function(index, pixel){
				if(transparency != pixel){
					image_data.data[index * 4 + 0] = color_table[pixel][0];
					image_data.data[index * 4 + 1] = color_table[pixel][1];
					image_data.data[index * 4 + 2] = color_table[pixel][2];
					image_data.data[index * 4 + 3] = 255;
					
					/*TODO Addopt transparent method*/
					if(image_data.data[index * 4 + 0]==0&&image_data.data[index * 4 + 1]==0&&image_data.data[index * 4 + 2]==0){
						/*Set black as transparent*/
						image_data.data[index * 4 + 3] = 0;
					}else if(image_data.data[index * 4 + 0]==255&&image_data.data[index * 4 + 1]==255&&image_data.data[index * 4 + 2]==255){
						/*Set white as transparent*/
						image_data.data[index * 4 + 3] = 0;
					}
					
				}else if(disposal_method == 2 || disposal_method == 3){
					image_data.data[index * 4 + 3] = 0;
				}
			});
			context.putImageData(image_data, image.leftPos, image.topPos);
		},
		end : function(){
			progress();
			if(context){
				Control.frames.push(context.getImageData(0,0,header.width, header.height));
			}
			
			//gifのバイナリデータを破棄？
			stream = null;
			
			isPersed = true;
		}
	};
	
	Control.checkIsPersed = (function(){
		return isPersed;
	});
	
	Control.getPerseMode = (function(){
		return perseMode;
	});
	
})(TUMBLP.GifControler);