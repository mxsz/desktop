// JavaScript Document
(function(){
	var $window=$(window),
		$document=$(document),
		Drag=function(obj){
			return new Drag.prototype.init(obj);
		};
	Drag.prototype={
		constructor:Drag,
		init:function(obj){
			var This=this;
			this.disX=0;
			this.disY=0;
			this.disL=0;
			this.disT=0;			
			this.elem=obj.id;//拖拽的元素
			this.xz=obj.xz;//限制范围
			this.rs=obj.resize;//元素超出可视区纠正
			this.fnDown=obj.fnDown;//元素按下回调函数
			this.fnMove=obj.fnMove;//元素移动回调函数
			this.fnUp=obj.fnUp;//元素抬起回调函数
			obj.id.on('mousedown',obj.tagName?obj.tagName:'',function(e){
				This.elem=$(this);
				This.dragDown(e);
				This.elem[0].setCapture&&This.elem[0].setCapture();//ie低版本阻止默认行为
				return false;//高级浏览器阻止默认行为
			});
			if(this.rs){
				$window.on('resize',function(){
					This.dragResize();
				});
			}
		},
		dragResize:function(){
			if(this.elem.offset().left>$window.width()-this.elem.outerWidth()){
				this.elem.css('left',$window.width()-this.elem.outerWidth());
			}else if(this.elem.offset().left<0){
				this.elem.css('left',0);
			}
			if(this.elem.offset().top>$window.height()-this.elem.outerHeight()){
				this.elem.css('top',$window.height()-this.elem.outerHeight());
			}else if(this.elem.offset().top<0){
				this.elem.css('top',0);
			}
		},
		dragDown:function(e){
			this.disX=e.pageX;
			this.disY=e.pageY;
			this.disL=this.elem.position().left;
			this.disT=this.elem.position().top;
			var This=this;
			$document.on('mousemove',function(e){
				This.dragMove(e);
			});
			$document.on('mouseup',function(){
				This.dragUp(e);
			});
			this.fnDown&&this.fnDown(this.elem,e);
		},
		dragMove:function(e){
			var l=e.pageX-this.disX+this.disL;
			var t=e.pageY-this.disY+this.disT;
			if(this.xz){
				if(l<0){
					l=0;
				}else if(l>$window.width()-this.elem.outerWidth()){
					l=$window.width()-this.elem.outerWidth();
				}
				if(t<0){
					t=0;
				}else if(t>$window.height()-this.elem.outerHeight()){
					t=$window.height()-this.elem.outerHeight();
				}			
			}
			this.elem.css({left:l,top:t});
			this.fnMove&&this.fnMove(this.elem);
		},
		dragUp:function(e){
			$document.off('mousemove mouseup');
			this.elem[0].releaseCapture&&this.elem[0].releaseCapture();
			this.fnUp&&this.fnUp(this.elem);
		}
	};
	Drag.prototype.init.prototype=Drag.prototype;
	if(typeof window==="object"&&typeof window.document==="object")window.Drag=Drag;
})();