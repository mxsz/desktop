// JavaScript Document
(function(window,undefined){
(function(window){
	var ns=navigator.userAgent;
	var isIe6 = /msie 6/i.test(ns);
	var isIe7 = /msie 7/i.test(ns);
	var isIe8 = /msie 8/i.test(ns);
	var isIe = /msie/i.test(ns);//ie浏览器
	var isFirefox = /Firefox\/\d+\.\d+/i.test(ns);//火狐浏览器
	var isChrome = /Chrome\/\d+\.\d+/i.test(ns);//谷歌浏览器
	var isOpera = /Opera/i.test(ns);//Opera浏览器
	var isSafari = /Safari/i.test(ns);//苹果浏览器
	window.browser={
		Ie:isIe,
		Firefox:isFirefox,
		Chrome:isChrome,
		Opera:isOpera,
		Safari:isSafari,
		version:function(){	//版本号
			switch(true){
				case isIe6:
					return 6;
				case isIe7:
					return 7;
				case isIe8:
					return 8;
			}
		}()
	};
})(window);
var core_version='2016/4/29/23:16';//版本号
var rootjQuery;
var core_strundefined=typeof undefined;
var location=window.location;
var document=window.document;
var docElem=document.documentElement;
var _jQuery=window.jQuery;
var _$=window.$;
var rquickExpr=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
var class2type={};//类型判断需要用到{'[Object String]':'string'}
var core_toString=class2type.toString;
var core_hasOwn=class2type.hasOwnProperty;
var jQuery=function(selector, context){
	return new jQuery.fn.init(selector, context, rootjQuery);
};

jQuery.fn=jQuery.prototype={
	jquery: core_version,
	constructor: jQuery,
	init: function(selector, context, rootjQuery){
		var match, elem;
		if(!selector){
			return this;
		}
		if(typeof selector==='string'){
			if(selector.charAt(0)==='<' && selector.charAt(selector.length-1)==='>' && selector.length>=3){
				match=[null, selector, null];
			}else{
				if(selector.indexOf(' ') !== -1){
					var oChild=selector.split(' ');
					var aParent=[];
					var aNode=[];
					var i=j=k=0;
					for(i=0;i<oChild.length;i++){
						if(aNode.length===0){
							aNode.push(document);
						}
						switch(oChild[i].charAt(0)){
							case '#':
								aParent.push(document.getElementById( oChild[i].substr(1) ));
								aNode=aParent;
								break;
							case '.':
								aParent=[];
								for(j=0;j<aNode.length;j++){
									var newParent=getClass(oChild[i].substr(1),aNode[j]);
									for(k=0;k<newParent.length;k++){
										aParent.push(newParent[k]);
									}
								}
								aNode=aParent;
								break;
							default:
								aParent=[];
								for(j=0;j<aNode.length;j++){
									var newParent=getTagName(oChild[i],aNode[j]);
									for(k=0;k<newParent.length;k++){
										aParent.push(newParent[k]);
									}
								}							
								aNode=aParent;
						}
					}
					addThis(this,aParent);
				}else{
					if(context){
						//尚未处理
					}else{
						switch(selector.charAt(0)){					
							case '#':
								elem=document.getElementById(selector.substring(1));
								this.length=1;
								this[0]=elem;
								break;
							case '.':
								elem=getClass(selector.substring(1));
								addThis(this,elem);
								break;
							default:
								elem=getTagName(selector);
								addThis(this,elem);
						}
					}
				}				
			}
		}else if(typeof selector==='object'){
			this[0]=selector;
			this.length=1;
			return this;
		}else if(typeof selector==='function'){
			DOMContentLoaded(selector);
		}
		
	},
	selector: '',
	length: 0,
	css: function(attr,value){
		for(var i=0;i<this.length;i++){
			if(arguments.length==1){
				if(typeof attr==='object'){
					if(attr.length){
						var json={};
						for(var j=0;j<attr.length;j++){
							json[attr[j]]=getStyle(this[i],attr[j]);
						}
						return json;
					}else{
						for(var k in attr){
							if(k=='opacity'){
								this[i].style[k]=attr[k];
								this[i].style.filter='alpha(opacity:'+(attr[k]*100)+')';
							}else{
								this[i].style[k] = typeof attr[k]==='number' ? attr[k]+'px' : attr[k];	
							}
						}
					}
				}else{
					return getStyle(this[i],attr);
				}
			}else{
				if(typeof value==='function'){
					attr2=getStyle(this[i],attr);
					this[i].style[attr]=value(i,attr2);
				}else{
					if(attr=='opacity'){
						this[i].style[attr]=value;
						this[i].style.filter='alpha(opacity:'+(value*100)+')';
					}else{
						if(typeof value==='number'){
							value=value+'px';
						}
						this[i].style[attr]=value;
					}
				}
			}
		}
		return this;
	},
	html: function(value){
		for(var i=0;i<this.length;i++){
			if(arguments.length==0){
				return this[i].innerHTML;
			}
			this[i].innerHTML=value;
		}
		return this;
	},
	val: function(){
		for(var i=0;i<this.length;i++){
			
		}
		return this;
	},
	text: function(value){
		for(var i=0;i<this.length;i++){
			if(arguments.length==0){
				 return this[i].textContent ? this[i].textContent : this[i].innerText;
			}
			this[i].textContent ? this[i].textContent=value : this[i].innerText=value;
		}
		return this;
	},
	attr: function(attr,value){
		for(var i=0;i<this.length;i++){
			if(arguments.length==1){
				if(typeof attr==='object'){
					for(var a in attr){
						this[i].setAttribute(a,attr[a]);
					}
				}else{
					if(attr=='class'){
						if(this[i].getAttribute(attr)){
							return this[i].getAttribute(attr);
						}else{
							return this[i].getAttribute(attr+'Name');
						}						
					}else{
						return this[i].getAttribute(attr);
					}
				}
			}else{
				if(typeof value==='function'){
					this[i].setAttribute(attr,value());
				}else{
					this[i].setAttribute(attr,value);
					if(attr=='class' && browser.version<8){
						this[i].setAttribute(attr+'Name',value);						
					}
				}
			}
		}
		return this;
	},
	removeAttr: function(attr){
		for(var i=0;i<this.length;i++){
			this[i].removeAttribute(attr);
		}
		return this;
	},
	addClass: function(className){
		for(var i=0;i<this.length;i++){
			if(this[i].className==''){
				this[i].className=className;
			}else{
				var arrClassName=this[i].className.split(' ');
				var _index=arrIndexOf(arrClassName,className);
				if(_index == -1){
					this[i].className += ' '+ className;
				}
			}
		}
		return this;
	},
	removeClass: function(className){
		for(var i=0;i<this.length;i++){
			if(this[i].className != ''){
				var arrClassName=this[i].className.split(' ');
				var _index=arrIndexOf(arrClassName,className);
				if(_index != -1){
					arrClassName.splice(_index,1);
					this[i].className=arrClassName.join(' ');
				}
			}
		}
		return this;
	},
	find: function(str){
		var arr=[];
		for(var i=0;i<this.length;i++){
			switch(str.charAt(0)){
				case '.':
					var temps=getClass(str.substr(1),this[i])
					for(var j=0;j<temps.length;j++){
						arr.push(temps[j]);
					}
					break;
				default:
					var temps=getTagName(str,this[i]);
					for(var j=0;j<temps.length;j++){
						arr.push(temps[j]);
					}
			}
		}
		addThis(this,arr)
		return this;
	},
	eq: function(n){
		return $(this[n]);
	},
	index: function(){
		return getIndex(this[0]);
	},
	size: function(){
		return this.length;
	},
	width: function(value){
		for(var i=0;i<this.length;i++){
			if(arguments.length==0){
				return parseInt(getStyle(this[i],'width'));
			}
			if(typeof value==='function'){
				iwidth=parseInt(getStyle(this[i],'width'));
				value = typeof value()==='number' ? value(i,iwidth)+'px' : value(i,iwidth);
				this[i].style['width']=value;
			}else{
				if(typeof value==='number'){
					value=value+'px';
				}
				this[i].style['width']=value;
			}
		}
		return this;
	},
	height: function(value){
		for(var i=0;i<this.length;i++){
			if(arguments.length==0){
				return parseInt(getStyle(this[i],'height'));
			}
			if(typeof value==='function'){
				iheight=parseInt(getStyle(this[i],'height'));
				value = typeof value()==='number' ? value=value(i,iheight)+'px' : value(i,iheight);
				this[i].style['height']=value;
			}else{
				if(typeof value==='number'){
					value=value+'px';
				}
				this[i].style['height']=value;
			}
		}
		return this;
	},
	innerWidth: function(){
		return this[0].clientWidth;
	},
	innerHeight: function(){
		return this[0].clientHeight;
	},
	outerWidth: function(bool){
		if(!bool){
			return this[0].offsetWidth;
		}else{
			var iMarginLeft=parseInt(getStyle(this[0],'marginLeft'));
			var iMarginRight=parseInt(getStyle(this[0],'marginRight'));
			return this[0].offsetWidth+iMarginLeft+iMarginRight;
		}
	},
	outerHeight: function(bool){
		if(!bool){
			return this[0].offsetHeight;
		}else{
			var iMarginTop=parseInt(getStyle(this[0],'marginTop'));
			var iMarginBottom=parseInt(getStyle(this[0],'marginBottom'));
			return this[0].offsetHeight+iMarginTop+iMarginBottom;
		}
	},
	scrollTop: function(value){
		if(arguments.length==0){
			return document.documentElement.scrollTop||document.body.scrollTop;
		}else{
			document.documentElement.scrollTop=document.body.scrollTop=value;
		}
	},
	scrollLeft: function(){
		return document.documentElement.scrollLeft||document.body.scrollLeft;
	},
	offset: function(){
		for(var i=0;i<this.length;i++){
			var pos={left:0,top:0};
			var obj=this[i];
			while(obj){
				pos.left += obj.offsetLeft;
				pos.top += obj.offsetTop;
				obj=obj.offsetParent;
			}
			return pos;
		}
		return this;
	},
	animate: function(json,times,fx,fn){
		for(var i=0;i<this.length;i++){
			var iCur={};
			for(var attr in json){
				iCur[attr]=0;
				if(attr=='opacity'){
					iCur[attr]=Math.round(getStyle(this[i],attr)*100);
				}else{
					iCur[attr]=parseInt(getStyle(this[i],attr)) || 0;
				}
			}
			var startTime=now();
			clearInterval(this[i].timer);
			var This=this[i];
			this[i].timer=setInterval(function(){
				var changeTime=now();
				var t=times-Math.max(0,startTime-changeTime+times);				
				for(var attr in json){
					var value=Tween[fx](t,iCur[attr],json[attr]-iCur[attr],times);
					if(attr=='opacity'){
						This.style.opacity=value/100;
						This.style.filter='alpha(opacity:'+value+')';
					}else{
						This.style[attr]=value+'px';
					}
				}
				if(t==times){
					clearInterval(This.timer);
					if(fn){
						fn.call(This);
					}
				}
			},13);
			function now(){
				return (new Date()).getTime();
			}
		}
		var Tween = {
			linear: function (t, b, c, d){  //匀速
				return c*t/d + b;
			},
			easeIn: function(t, b, c, d){  //加速曲线
				return c*(t/=d)*t + b;
			},
			easeOut: function(t, b, c, d){  //减速曲线
				return -c *(t/=d)*(t-2) + b;
			},
			elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）弹性运动
				if (t === 0) {
					return b;
				}
				if ( (t /= d) == 1 ) {
					return b+c;
				}
				if (!p) {
					p=d*0.3;
				}
				if (!a || a < Math.abs(c)) {
					a = c;
					var s = p / 4;
				} else {
					var s = p/(2*Math.PI) * Math.asin (c/a);
				}
				return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
			}
		}
		return this;
	},
	hide: function(){
		for(var i=0;i<this.length;i++){
			this[i].style.display='none';
		}
		return this;
	},
	show: function(){
		for(var i=0;i<this.length;i++){
			this[i].style.display='block';
		}
		return this;
	},
	hover: function(fn1,fn2){
		for(var i=0;i<this.length;i++){
			addEvent(this[i],'mouseover',fn1);
			addEvent(this[i],'mouseout',fn2);
		}
		return this;
	},
	toggle: function(){
		var _arguments=arguments;
		for(var i=0;i<this.length;i++){
			addToggle(this[i]);
		}
		function addToggle(obj){
			var count=0;
			addEvent(obj,'click',function(){
				_arguments[count++%_arguments.length].call(obj);
			});
		}
		return this;
	},
	bind: function(type,fn){
		for(var i=0;i<this.length;i++){
			addEvent(this[i],type,fn);
		}
		return this;
	},
	click: function(fn){
		for(var i=0;i<this.length;i++){
			addEvent(this[i],'click',fn);
		}
		return this;
	},
	mousedown: function(fn){
		for(var i=0;i<this.length;i++){
			addEvent(this[i],'mousedown',fn);
		}
		return this;
	},
	mouseup: function(fn){
		for(var i=0;i<this.length;i++){
			addEvent(this[i],'mouseup',fn);
		}
		return this;
	},
	mouseover: function(fn){
		for(var i=0;i<this.length;i++){
			addEvent(this[i],'mouseover',fn);
		}
		return this;
	},
	mouseout: function(fn){
		for(var i=0;i<this.length;i++){
			addEvent(this[i],'mouseout',fn);
		}
		return this;
	},
	mousemove: function(fn){
		for(var i=0;i<this.length;i++){
			addEvent(this[i],'mousemove',fn);
		}
		return this;
	},
	on: function(){
		
	}
};
//jQuery的原型赋值给jQuery原型下面的方法的原型，对象的引用
jQuery.fn.init.prototype=jQuery.fn;
//给addClass和removeClass调用
function arrIndexOf(arr,value){
	for(var i=0;i<arr.length;i++){
		if(arr[i]==value){
			return i;
		}
	}
	return -1;
}
//给index调用
function getIndex(obj){
	var aBrother=obj.parentNode.children;
	var i=0;
	for(i=0;i<aBrother.length;i++){
		if(aBrother[i]==obj){
			return i;
		}
	}
}
//获取class集合
function getClass(className,parent){
	var parent = parent ? parent : document;
	var allChild=parent.getElementsByTagName('*');
	var arr=[];
	var re=RegExp('\\b'+className+'\\b');
	var i=0;
	for(i=0;i<allChild.length;i++){
		if(re.test(allChild[i].className)){
			arr.push(allChild[i]);
		}
	}
	return arr;
}
//获取tagName集合
function getTagName(name,parent){
	var parent = parent ? parent : document;
	return parent.getElementsByTagName(name);
}
function addThis(_this,elem){
	_this.length=elem.length;
	for(var i=0;i<elem.length;i++){
		_this[i]=elem[i];
	}
}
//获取计算后的样式值
function getStyle(element,attr){
	if(window.getComputedStyle){
		return getComputedStyle(element,false)[attr];
	}else{
		return element.currentStyle[attr];
	}
}
//事件绑定
function addEvent(obj,type,fn){
	if(window.addEventListener){
		obj.addEventListener(type,fn,false);
	}else{
		if(!obj.events)obj.events={};
		if(!obj.events[type]){
			obj.events[type]=[];
		} else {
			if ( (function(es,fn){
					for(var i in es){
						if(es[i]==fn)return true;
					}
					return false;
				  })(obj.events[type], fn) ) return false;
		}
		obj.events[type][addEvent.id++]=fn;
		obj['on'+type]=function(){
			for (var i in obj.events[type]){
				obj.events[type][i].call(this,event);
			}
		};
	}
}
addEvent.id=0;
//事件绑定解除
function removeEvent(obj,type,fn){
	if(obj.removeEventListener){
		obj.removeEventListener(type,fn,false);
	}else{
		if (obj.events) {
			for (var i in obj.events[type]) {
				if (obj.events[type][i] == fn) {
					delete obj.events[type][i];
				}
			}
		}
	}
}
//阻止默认行为
function returnValue(e){
	if(e.preventDefault){
		return e.preventDefault();
	}else{
		return e.returnValue=false;
	}
}
//DOM加载
function DOMContentLoaded(fn) {
	var isReady=false;
	var timer=null;
	if(document.addEventListener){//W3C
		addEvent(document,'DOMContentLoaded',function(){
			fn();
			removeEvent(document,'DOMContentLoaded',arguments.callee);
		});
	}else{//IE6-8
		var timer=null;
		timer=setInterval(function(){
			try {
				document.documentElement.doScroll('left');
				doReady();
			}catch(e){};
		},10);
	}
	function doReady(){
		if(timer) clearInterval(timer);
		if(isReady) return;
		isReady=true;
		fn();
	}
}

rootjQuery=jQuery(document);
	
window.$=window.jQuery=jQuery;
	
	
	
	
	
	
})(window,undefined);