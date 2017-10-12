// JavaScript Document
jQuery.extend(jQuery.easing,{	
	backIn: function(x,t,b,c,d,s){
		if (typeof s=='undefined'){s=1.70158;}
		return c*(t/=d)*t*((s+1)*t-s)+b;
	},
	bounceOut: function(x, t, b, c, d){
		if((t/=d) < (1/2.75)){
			return c*(7.5625*t*t) + b;
		}else if(t < (2/2.75)){
			return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
		}else if(t < (2.5/2.75)){
			return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
		}
		return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
	}
});
$(function(){
	var opt={
			off:true,
			liShunXu:[],										//li的位置顺序
			liLeftTop:[],										//li的left、top值,格式为[{left:0,top:0},{left:1,top:1}]
			liSize:110,											//li的大小+20，默认宽高都90
			ziDong:true,										//图标自动排列开关，默认true
			icon:true,											//图标显示隐藏
			tolls:true											//桌面工具显示隐藏
		},
		$window=$(window),										//window
		$document=$(document),									//document
		$desktop=$('#desktop'),									//大父级
		$iconWrap=$('#icon_wrap'),								//图标列表ul的外层
		$iconList=$('#icon_list'),								//图标外层ul
		$iconLi=$iconList.find('li'),							//图标li
		$iconLiLen=$iconLi.length,								//图标个数
		$tool=$('#tool'),										//桌面工具父级
		$startBar=$('#start_bar'),								//底部开始栏最外层
		$startToorL=$startBar.find('.start_toor_l'),			//底部开始栏左边按钮
		$startToorR=$startBar.find('.start_toor_r'),			//底部开始栏右边按钮
		$startToorMain=$startBar.find('.start_toor_main'),		//底部开始栏主要层
		$startToorCon=$startBar.find('.start_toor_con'),		//底部开始栏ul层，包对应的li栏
		$startToorConWid=0,										//底部开始栏ul层的宽度
		timer=0,												//定时器引用
		timer2=0,												//延时器引用
		zIndex=3;												//全局z-index
	
	//初始化位置	
	function chuShiData(num){
		if(opt.off){
			var iconH=Math.floor($iconList.innerHeight()/opt.liSize);
			for(var i=0;i<$iconLiLen;i++){				
				var liL=Math.floor(i/iconH)*opt.liSize;
				var liT=i%iconH*opt.liSize;
				opt.liShunXu[i]=$iconLi.eq(i);
				opt.liLeftTop[i]={left:liL,top:liT};
			}
		}
		var z=0;
		timer=setInterval(function(){
			$iconLi.eq(z).animate({
				left:opt.liLeftTop[z].left,
				top:opt.liLeftTop[z].top,
				opacity:1
			}).attr('key',z);
			z++;
			z==$iconLiLen&&(clearInterval(timer));
		},num);
	}
	//chuShiData(66);
	
	//窗口改变
	function resetWeiZhi(){
		var iconH=Math.floor($iconList.innerHeight()/opt.liSize);
		for(var i=0;i<$iconLiLen;i++){
			var liL=Math.floor(i/iconH)*opt.liSize;
			var liT=i%iconH*opt.liSize;
			opt.liShunXu[i].stop().animate({left:liL,top:liT},300);
			opt.liLeftTop[opt.liShunXu[i].attr('key')]={left:liL,top:liT};
		}
	}
	$window.on('resize',function(){
		clearTimeout(timer2);
		timer2=setTimeout(resetWeiZhi,100);
	});
	
	//图标相碰且最短相关函数
	function zdLi(obj){
		//Math.min.apply({},[1,3,4,5]);
		var value=Number.POSITIVE_INFINITY;//最大数值
		var index=-1;
		for(var i=0;i<$iconLiLen;i++){
			if(obj!=$iconLi[i]&&pz(obj,$iconLi[i])){
				var a=jl(obj,$iconLi[i]);
				a<value&&(value=a,index=i);
			}
		}
		return index==-1?null:$iconLi.eq(index);
	}
	function pz(obj1,obj2){
		return !(obj1.getBoundingClientRect().bottom<obj2.getBoundingClientRect().top||obj1.getBoundingClientRect().left>obj2.getBoundingClientRect().right||obj1.getBoundingClientRect().top>obj2.getBoundingClientRect().bottom||obj1.getBoundingClientRect().right<obj2.getBoundingClientRect().left);
	}
	function jl(obj1,obj2){
		var a=obj1.getBoundingClientRect().left-obj2.getBoundingClientRect().left;
		var b=obj1.getBoundingClientRect().top-obj2.getBoundingClientRect().top;
		return Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
	}
	
	//桌面图标拖拽
	Drag.iconLiZD=null;//存放碰到最短图标节点
	Drag({
		id:$iconList,
		tagName:'li',
		fnDown:function(This,e){
			This.css('z-index',++zIndex).stop();
			e.button!=2&&ctrlIcon(e,This,$iconList);
			noneFn();//菜单隐藏
		},
		fnMove:function(This){
			if(!opt.ziDong)return;
			Drag.iconLiZD&&Drag.iconLiZD.css('opacity',1);
			var tempZdLi=zdLi(This[0]);
			if(tempZdLi){				
				tempZdLi.css('opacity',0.4);
				Drag.iconLiZD=tempZdLi;
			}
		},
		fnUp:function(This){
			if(!opt.ziDong)return;
			Drag.iconLiZD&&Drag.iconLiZD.css('opacity',1);
			Drag.iconLiZD=null;			
			if(zdLi(This[0])){
				$paiXuMenuDd.removeClass('icon');		//将排序中的"勾"去除
				var cpLi=zdLi(This[0]).attr('key');		//碰撞最短li的key值
				var iNowLi=This.attr('key');			//当前li的key值
				This.animate({
					left:opt.liLeftTop[cpLi].left,
					top:opt.liLeftTop[cpLi].top
				},260).attr('key',cpLi);
				zdLi(This[0]).animate({
					left:opt.liLeftTop[iNowLi].left,
					top:opt.liLeftTop[iNowLi].top
				},260).attr('key',iNowLi).css('z-index',++zIndex);
				opt.liShunXu[cpLi]=This;
				opt.liShunXu[iNowLi]=zdLi(This[0]);
			}else{
				This.animate({
					left:opt.liLeftTop[This.attr('key')].left,
					top:opt.liLeftTop[This.attr('key')].top
				});
			}
		}
	});
	
	//桌面图标双击弹出窗口
	var htmlJson={
		shouye:'<iframe width="100%" height="100%" name="in" frameborder="0" scrolling="yes" src="mede2.html"></iframe>',
		huishouzhan:'<div class="huishouzhan"><ul id="hsz_list"></ul></div>',
		lunbotu1:'<iframe width="100%" height="100%" name="in" frameborder="0" scrolling="yes" src="lunbotu/lunbotu1.html"></iframe>',
		lunbotu2:'<iframe width="100%" height="100%" name="in" frameborder="0" scrolling="yes" src="lunbotu/lunbotu2.html"></iframe>',
		lunbotu3:'<iframe width="100%" height="100%" name="in" frameborder="0" scrolling="yes" src="lunbotu/lunbotu3.html"></iframe>',
		lunbotu4:'<iframe width="100%" height="100%" name="in" frameborder="0" scrolling="yes" src="lunbotu/lunbotu4.html"></iframe>',
		lunbotu5:'<iframe width="100%" height="100%" name="in" frameborder="0" scrolling="yes" src="lunbotu/lunbotu5.html"></iframe>',
		lunbotu6:'<iframe width="100%" height="100%" name="in" frameborder="0" scrolling="yes" src="lunbotu/lunbotu6.html"></iframe>',
		lunbotu7:'<iframe width="100%" height="100%" name="in" frameborder="0" scrolling="yes" src="lunbotu/lunbotu7.html"></iframe>'
	};
	$iconList.on('dblclick','li',function(e){
		if(e.ctrlKey)return;
		var This=$(this);
		This.removeClass('now');
		iconFn(This);
	}).on('click','li',function(){
		return false;
	});
	function iconFn(This){
		var titHtml=This.find('h4').html();
		cWin({
			id:This.attr('inow'),
			title:titHtml,
			changeWin:true,
			html:htmlJson[This.attr('inow')],
			fnClose:function(){
				$('#'+This.attr('inow')).removeAttr('kai');
				$('#'+This.attr('inow')+'a2').remove();
			},
			fnXiaoWin:function(obj){
				return $('#'+This.attr('inow')+'a2').offset().left+70;
			}
		});
		//底部栏创建对应的栏目
		if(!$('#'+This.attr('inow')+'a2')[0]){
			var $li='<li id="'+This.attr('inow')+'a2"><i><img src="'+This.attr('img')+'"></i><h5>'+titHtml+'</h5></li>';
			$startToorCon.append($li);				
			$startToorConWid=$startToorCon.find('li').length*147;
		}
		//删除桌面图标往回收站添加
		if(deleteIcon.btn&&$('#huishouzhan')[0]){
			deleteIcon.btn=false;
			deleteIcon();
		}
		//回收站窗口里的还原处理
		if(hszHuanYuan.btn&&$('#huishouzhan')[0]){
			hszHuanYuan.btn=false;
			hszHuanYuan();
		}
	}
	
	//桌面图标右键菜单
	var $iconMenu=$('#icon_menu');
	var $createMenu=null;//存桌面多选右键菜单
	$iconMenu.on('contextmenu',function(){return false;});
	$iconList.on('contextmenu','li',function(e){
		noneFn({iM:true});//菜单隐藏
		var gdLiEle=$iconList.find('.now');
		var gdLiLen=gdLiEle.length;		
		if(gdLiLen>1&&$(this).attr('ctrlkey')){
			$createMenu=$('<ul class="common-menu"><li now="dakai">打开</li><li now="shanchu">删除</li></ul>');
			setMenuWeiZhi($createMenu,e);
			$createMenu.on('contextmenu',function(){return false;});
			$createMenu.on('click','li',function(){
				switch($(this).attr('now')){
					case 'dakai'://打开所有选中图标窗口
						for(var i=0;i<gdLiLen;i++){
							iconFn(gdLiEle.eq(i));
						}
						break;
					case 'shanchu'://删除所有选中桌面图标
						setTimeout(function(){
							for(var i=0;i<gdLiLen;i++){
								if(gdLiEle.eq(i).attr('inow')=='huishouzhan'){
									alert('选项中包含回收站，无法删除!');
									return;
								}
								if($('#'+gdLiEle.eq(i).attr('inow')).attr('kai')=='zhe'){
									alert('选项中有窗口处于打开状态，无法删除!');
									return;
								}
							}
							if(confirm('确实要将这'+gdLiLen+'项移动到回收站吗？')){
								gdLiEle.remove();
								for(var i=0;i<gdLiLen;i++){
									deleteIcon.html+=gdLiEle.eq(i).prop('outerHTML');
								}
								deleteIcon();//将图标往回收站添加	
								for(var i=0;i<gdLiLen;i++){
									for(var k=0;k<opt.liShunXu.length;k++){
										if(opt.liShunXu[k].attr('key')==gdLiEle.eq(i).attr('key')){
											opt.liShunXu.splice(k,1);
										}
									}
								}
								$iconLi=$iconList.find('li');
								$iconLiLen=$iconLi.length;
								for(var k=0;k<$iconLiLen;k++){
									opt.liShunXu[k].attr('key',k);
								}
								resetWeiZhi();
							}else{
								gdLiEle.addClass('now').attr('ctrlkey','ctrl');
							}
						},30);
						break;
				}
			});
			$desktop.append($createMenu);
		}else{
			setMenuWeiZhi($iconMenu,e);//菜单位置并显示
			$(this).addClass('now').siblings().removeClass('now').removeAttr('ctrlkey');//选中当前，去除其它
		}
		e.stopPropagation();
	});
	
	/*回收站窗口里的还原处理*/
	function hszHuanYuan(){
		var $hszUl=$('#hsz_list');
		var $hszUlParent=$hszUl.parent();
		$hszUl.on('contextmenu','li',function(e){
			var This=$(this);
			var gdLiEle=$hszUl.find('.now');
			var gdLiLen=gdLiEle.length;
			noneFn();//菜单隐藏
			delClassAttr();//去除选中图标class和attr
			hszHuanYuan.liNode=$('<ul class="common-menu"><li now="huanyuan">还原</li><li now="shanchu">删除</li></ul>');
			setMenuWeiZhi(hszHuanYuan.liNode,e);
			hszHuanYuan.liNode.on('contextmenu',function(){return false;});
			//右键菜单相关点击操作
			hszHuanYuan.liNode.on('click','li',function(){
				aa=!(gdLiLen>1&&This.attr('ctrlkey'))?1:gdLiLen;
				if($(this).attr('now')=='huanyuan'){//还原图标
					var huanLi='';				
					if(aa==1){
						huanLi=This.prop('outerHTML');
						This.remove();
					}else{
						for(var i=0;i<gdLiLen;i++){
							huanLi+=gdLiEle.eq(i).prop('outerHTML');
						}
						gdLiEle.remove();
					}
					$iconList.append(huanLi);
					var prevLiLen=$iconLiLen;//未还原之前的length;
					$iconLi=$iconList.find('li');
					$iconLiLen=$iconLi.length;
					if(opt.liSize==80){
						$iconLi.attr('class','small');
					}else if(opt.liSize==110){
						$iconLi.attr('class','center');
					}else if(opt.liSize==140){
						$iconLi.attr('class','big');
					}
					for(var i=prevLiLen;i<$iconLiLen;i++){
						opt.liShunXu.push($iconLi.eq(i));
					}
					for(var k=0;k<$iconLiLen;k++){
						opt.liShunXu[k].attr('key',k);
					}
					resetWeiZhi();
					deleteIcon.html=$hszUl.html();//贮存剩余的图标
				}else if($(this).attr('now')=='shanchu'){//彻底删除图标
					setTimeout(function(){
						if(confirm('确实要永久性删除这 '+aa+' 项吗？')){
							if(aa==1){
								This.remove();
								$('#'+This.attr('inow')).remove();//对应打开的窗口也给永久性删除
							}else{
								gdLiEle.remove();
								for(var i=0;i<gdLiLen;i++){
									$('#'+gdLiEle.eq(i).attr('inow')).remove();//对应打开的窗口也给永久性删除
								}
							}
							deleteIcon.html=$hszUl.html();//贮存剩余的图标
						}
					},30);
				}
			});
			$desktop.append(hszHuanYuan.liNode);
			if(!(gdLiLen>1&&This.attr('ctrlkey'))){
				This.addClass('now').siblings().removeClass('now').removeAttr('ctrlkey');//选中当前，去除其它
			}
			e.stopPropagation();
		}).on('click','li',function(e){
			noneFn();//菜单隐藏
			delClassAttr();//去除选中图标class和attr
			ctrlIcon(e,$(this),$hszUl);
			return false;
		});
		//去除选中的class attr等
		$hszUlParent.on('click contextmenu',function(){
			$hszUl.find('.now').removeClass('now').removeAttr('ctrlkey');
			hszHuanYuan.liNode&&hszHuanYuan.liNode.remove();//回收站图标右键菜单
		});
		//鼠标滑动选中多个
		mouseSelect($hszUlParent,false);
	}
	hszHuanYuan.btn=true;
	hszHuanYuan.liNode=null;
	
	/*鼠标点击选中图标相关函数*/
	function ctrlIcon(e,This,parent){
		if(e.ctrlKey){
			if(This.hasClass('now')){
				This.removeClass('now');
				This.removeAttr('ctrlkey');
			}else{
				This.addClass('now');
				parent.find('.now').attr('ctrlkey','ctrl');//先右键在Ctrl
			}			
		}else{
			This.addClass('now').removeAttr('ctrlkey').siblings().removeClass('now').removeAttr('ctrlkey');
		}
	}
	
	/*鼠标滑动选中图标操作*/
	mouseSelect($iconWrap,true);
	function mouseSelect(objPare,bBtn){
		objPare.on('mousedown',function(e){
			noneFn();//菜单隐藏
			var This=$(this);
			var disX=e.pageX;
			var disY=e.pageY;
			var disL=This.offset().left;
			var disT=This.offset().top;
			var disBtn=true;
			var $div=null;
			var yesClassArr=[];//将有class="now"的放一个数组，没有的放一个数组
			var noClassArr=[];
			if(bBtn){//桌面的
				for(var i=0;i<$iconLiLen;i++){
					if($iconLi.eq(i).hasClass('now')){
						yesClassArr.push($iconLi.eq(i));
					}else{
						noClassArr.push($iconLi.eq(i));
					}			
				}
			}else{//回收站的
				var $hszUlLi=objPare.find('li');
				for(var i=0;i<$hszUlLi.length;i++){
					if($hszUlLi.eq(i).hasClass('now')){
						yesClassArr.push($hszUlLi.eq(i));
					}else{
						noClassArr.push($hszUlLi.eq(i));
					}			
				}
			}			
			var yesClassArrLen=yesClassArr.length;
			var noClassArrLen=noClassArr.length;
			This[0].setCapture&&This[0].setCapture();//ie低版本
			$document.on('mousemove',function(e){
				if(disBtn){
					disBtn=false;
					$div=$('<div class="mousexuan" style="z-index:'+(++zIndex)+';"></div>');
					This.append($div);
				}
				var l=disX-disL,t=disY-disT;
				e.pageX-disX<=0&&(l=e.pageX-disL);
				e.pageY-disY<=0&&(t=e.pageY-disT);
				$div.css({width:Math.abs(e.pageX-disX),height:Math.abs(e.pageY-disY),left:l,top:t});
				if(e.ctrlKey){
					for(var i=0;i<yesClassArrLen;i++){
						if( pz($div[0],yesClassArr[i][0]) ){
							yesClassArr[i].removeClass('now').removeAttr('ctrlkey');
						}else{
							yesClassArr[i].addClass('now').attr('ctrlkey','ctrl');
						}
					}
					for(var i=0;i<noClassArrLen;i++){
						if( pz($div[0],noClassArr[i][0]) ){
							noClassArr[i].addClass('now').attr('ctrlkey','ctrl');
						}else{
							noClassArr[i].removeClass('now').removeAttr('ctrlkey');
						}
					}
				}else{
					if(bBtn){//桌面的
						for(var i=0;i<$iconLiLen;i++){//循环判断是否碰上图标
							if( pz($div[0],$iconLi.eq(i)[0]) ){
								if(!$iconLi.eq(i).hasClass('now')){
									$iconLi.eq(i).addClass('now').attr('ctrlkey','ctrl');
								}
							}else{
								if($iconLi.eq(i).hasClass('now')){
									$iconLi.eq(i).removeClass('now').removeAttr('ctrlkey');
								}							
							}
						}
					}else{//回收站的
						var $hszUlLi=objPare.find('li');
						for(var i=0;i<$hszUlLi.length;i++){//循环判断是否碰上图标
							if( pz($div[0],$hszUlLi.eq(i)[0]) ){
								if(!$hszUlLi.eq(i).hasClass('now')){
									$hszUlLi.eq(i).addClass('now').attr('ctrlkey','ctrl');
								}
							}else{
								if($hszUlLi.eq(i).hasClass('now')){
									$hszUlLi.eq(i).removeClass('now').removeAttr('ctrlkey');
								}							
							}
						}
					}					
				}		
			}).on('mouseup',function(){
				$document.off('mousemove mouseup');
				This[0].releaseCapture&&This[0].releaseCapture();
				$div&&$div.remove();
			});
			e.preventDefault();
		});
	}
		
	/*删除桌面图标相关函数*/
	function deleteIcon(){	
		$('#huishouzhan').find('ul').html(deleteIcon.html);
	}
	deleteIcon.html='';
	deleteIcon.btn=true;
	
	//图标单选右键菜单点击
	$iconMenu.on('click','li',function(){
		var temLi=$iconList.find('.now');
		switch($(this).attr('now')){
			case 'dakai':
				iconFn(temLi);
				break;
			case 'fasongdao':
				
				break;
			case 'jianqie':
				
				break;
			case 'fuzhi':
				
				break;
			case 'shanchu':
				setTimeout(function(){
					if(temLi.attr('inow')=='huishouzhan'){
						alert('该图标为特殊图标不能删除!');
						return;
					}
					if($('#'+temLi.attr('inow')).attr('kai')=='zhe'){						
						alert('该窗口处于打开状态，无法删除!');
						return;
					}
					if(confirm('确实要将此图标放入回收站吗？')){
						temLi.remove();
						deleteIcon.html+=temLi.prop('outerHTML');
						deleteIcon();//将图标往回收站文件夹中添加
						for(var i=0;i<$iconLiLen;i++){
							if(opt.liShunXu[i].attr('key')==temLi.attr('key')){
								opt.liShunXu.splice(i,1);
								break;
							}
						}
						$iconLi=$iconList.find('li');//jq删除节点，只是删除网页的，所以需要重新获取一遍li节点。
						$iconLiLen=$iconLi.length;
						for(var k=0;k<$iconLiLen;k++){
							opt.liShunXu[k].attr('key',k);
						}
						resetWeiZhi();
					}
				},30);
				break;
			case 'chongmingming':
				setTimeout(function(){
					if($('#'+temLi.attr('inow')).attr('kai')=='zhe'){						
						alert('该窗口处于打开状态，请关闭后再修改名称!');
						return;
					}
					var h4=temLi.find('h4');
					cWin({
						id:'chongmingming',
						format:'sz',
						width:300,
						height:100,
						title:'重命名',
						html:'<input type="text" value="'+h4.html()+'">',
						mark:true,
						dblclick:false,
						removeDisplay:true,
						fnClose:function(){
							alert('修改成功')
							temLi.attr('date',new Date().getTime());
							h4.html($('#chongmingming').find('input').val());
						}
					});
					$('#chongmingming').find('input').focus().on('mousedown',function(e){
						e.stopPropagation();
					});
				},30);
				break;
			case 'shuxing':
				
				break;
		}
	});
	
	/*桌面右键菜单*/
	var $rightMenu=$('#right-menu');
	var $rightMenuLi=$rightMenu.find('li');
	var $rightMenuLiA=$rightMenu.find('a');
	$rightMenu.on('contextmenu',function(){return false;});
	$document.on('contextmenu',function(e){
		noneFn({rM:true});//菜单隐藏
		delClassAttr();//去除选中图标class和attr
		setMenuWeiZhi($rightMenu,e);
	});
	$document.on('click',function(e){
		noneFn();//菜单隐藏
		!e.ctrlKey&&delClassAttr();//去除选中图标class和attr
	});
	$rightMenuLi.hover(function(){
		var $menuXia=$(this).find('.menu-xiaji');
		if(!$menuXia[0])return;
		$menuXia.css('display','block');
		if($menuXia.offset().left>$window.width()-$menuXia.outerWidth()){
			$menuXia.css('left','-132px');
		}
	},function(){
		$(this).find('.menu-xiaji').css('display','none').css('left','124px');
	});
	$rightMenuLiA.on('click',function(e){//有二层菜单的阻止掉冒泡
		e.stopPropagation();
	});
	//菜单位置
	function setMenuWeiZhi(obj,e){
		var json={};
		var winW=$window.width();
		var winH=$window.height();
		var objW=obj.width();
		var objH=obj.height();
		if(e.clientX+objW<winW&&e.clientY+objH<winH){
			json.left=e.pageX;
			json.top=e.pageY;
		}else if(e.clientX+objW>winW&&e.clientY+objH<winH){
			json.left=winW-objW;
			json.top=e.pageY;
		}else if(e.clientX+objW>winW&&e.clientY+objH>winH){
			json.left=winW-objW;
			json.top=winH-objH;
		}else{
			json.left=e.pageX;
			json.top=winH-objH;
		}
		obj.css({left:json.left,top:json.top,display:'block'});
		e.preventDefault();
	}
	//菜单隐藏
	function noneFn(opt){
		var opt=opt||{};
		!opt.rM&&$rightMenu.css('display','none');//桌面右键菜单
		!opt.iM&&$iconMenu.css('display','none');//单选图标右键菜单
		!opt.nM&&$createMenu&&$createMenu.remove();//多选图标右键菜单
		!opt.hM&&hszHuanYuan.liNode&&hszHuanYuan.liNode.remove();//回收站图标右键菜单
	}
	//去除选中li的class和attr
	function delClassAttr(){
		$iconLi.removeClass('now').removeAttr('ctrlkey');
	}
	
	
	//查看选项里的相关功能
	var $chaKanMenu=$('#chakan-menu');
	var $chaKanMenuDd=$chaKanMenu.find('dd');
	$chaKanMenu.on('click','dd',function(){
		var This=$(this);
		if(This.index()<3){$chaKanMenuDd.slice(0,3).removeClass('icon');}
		This.toggleClass('icon');
		switch(This.attr('now')){
			case 'da':
				$iconLi.attr('class','big');
				opt.liSize=140;
				resetWeiZhi();
				break;
			case 'zhong':
				$iconLi.attr('class','center');
				opt.liSize=110;
				resetWeiZhi();
				break;
			case 'xiao':
				$iconLi.attr('class','small');
				opt.liSize=80;
				resetWeiZhi();
				break;
			case 'zi':
				opt.ziDong=!opt.ziDong;
				resetWeiZhi();
				break;
			case 'xian1':
				opt.icon=!opt.icon;
				if(!opt.icon){
					$iconList.addClass('icon_none');
				}else{
					$iconList.removeClass('icon_none');
				}
				break;
			case 'xian2':
				opt.tolls=!opt.tolls;
				if(!opt.tolls){
					$tool.addClass('icon_none');
				}else{
					$tool.removeClass('icon_none');
				}
				break;
		}
	});
	//排序选项里相关功能
	var $paiXuMenu=$('#paixu-menu');
	var $paiXuMenuDd=$paiXuMenu.find('dd');
	var tempBtn=true;
	var mingBtn=true;
	var xiuBtn=true;
	$paiXuMenu.on('click','dd',function(){
		var This=$(this);
		var tempArr=[];
		This.addClass('icon').siblings().removeClass('icon');
		switch(This.attr('now')){
			case 'ming':
				var $iconLiH4=$iconList.find('h4');//获取li图标标题h4
				var json={};//空json，去重用
				opt.liShunXu=[];//先清空li图标的顺序
				for(var k=0;k<$iconLiLen;k++){
					if(!json[$iconLiH4.eq(k).html().charAt(0)]){//判断是否有相同的名称
						tempArr.push($iconLiH4.eq(k).html().charAt(0));
						json[$iconLiH4.eq(k).html().charAt(0)]=true;
					}
				}
				if(mingBtn){//排序：拼音首字母顺序
					tempArr.sort(function(str1,str2){return str1.localeCompare(str2);});
				}else{
					tempArr.sort(function(str1,str2){return str1.localeCompare(str2);}).reverse();
				}
				mingBtn=!mingBtn;
				for(var k=0;k<tempArr.length;k++){
					for(var z=0;z<$iconLiLen;z++){
						if($iconLiH4.eq(z).html().charAt(0)==tempArr[k]){
							opt.liShunXu.push($iconLiH4.eq(z).parent());//重新定义li图标的顺序
						}
					}
				}
				for(var k=0;k<$iconLiLen;k++){
					opt.liShunXu[k].attr('key',k);
				}
				resetWeiZhi();
				break;
			case 'sui':
				var keyArr=[];
				for(var k=0;k<$iconLiLen;k++){
					keyArr[k]=k;	
				}
				keyArr.sort(function(){
					return 0.5-Math.random();
				});
				for(var k=0;k<$iconLiLen;k++){
					tempArr[k]=opt.liShunXu[keyArr[k]];					
				}
				for(var k=0;k<$iconLiLen;k++){
					opt.liShunXu[k]=tempArr[k];
					opt.liShunXu[k].attr('key',k);
				}
				resetWeiZhi();
				break;
			case 'da':
				var $iconLiH4=$iconList.find('h4');//获取li图标标题h4
				var json={};//空json，去重用
				opt.liShunXu=[];//先清空li图标的顺序
				for(var k=0;k<$iconLiLen;k++){
					if(!json[$iconLiH4.eq(k).html().length]){//判断是否有相同的length
						tempArr.push($iconLiH4.eq(k).html().length);
						json[$iconLiH4.eq(k).html().length]=true;
					}
				}
				if(tempBtn){//排序：小到大或大到小
					tempArr.sort(function(v1,v2){return v1-v2;});
				}else{
					tempArr.sort(function(v1,v2){return v2-v1;});//reverse();
				}
				tempBtn=!tempBtn;
				for(var k=0;k<tempArr.length;k++){
					for(var z=0;z<$iconLiLen;z++){
						if($iconLiH4.eq(z).html().length==tempArr[k]){
							opt.liShunXu.push($iconLiH4.eq(z).parent());//重新定义li图标的顺序
						}
					}
				}
				for(var k=0;k<$iconLiLen;k++){
					opt.liShunXu[k].attr('key',k);
				}
				resetWeiZhi();
				break;
			case 'xiu':
				opt.liShunXu=[];
				for(var i=0;i<$iconLiLen;i++){
					if($iconLi.eq(i).attr('date')){
						tempArr.push($iconLi.eq(i).attr('date'));
					}else{
						opt.liShunXu.push($iconLi.eq(i));
					}
				}
				if(tempArr.length!=0){
					tempArr.sort(function(v1,v2){return v1-v2;});
					for(var i=0;i<tempArr.length;i++){
						for(var k=0;k<$iconLiLen;k++){
							if($iconLi.eq(k).attr('date')==tempArr[i]){
								opt.liShunXu.push($iconLi.eq(k));
							}
						}
					}
				}
				if(xiuBtn){
					opt.liShunXu.reverse();
				}
				xiuBtn=!xiuBtn;				
				for(var k=0;k<$iconLiLen;k++){
					opt.liShunXu[k].attr('key',k);
				}
				resetWeiZhi();
				break;
		}
	});
	//刷新
	$rightMenu.find('.shuaxin').on('click',function(){
		$iconList.stop().animate({opacity:0},100,'backIn').animate({opacity:1},100,'backIn');
	});
	//个性化
	function geHtml(){
		return ['<div class="szicon_wrap">',
					'<h4 class="szicon_wrap_tit">桌面图标</h4>',
					'<ul class="szicon_wrap_ul">',
						'<li>首页</li>',
						'<li>回收站</li>',
						'<li>图册</li>',
						'<li>邮箱</li>',
						'<li>搜索</li>',
						'<li>文件夹</li>',
						'<li>时钟</li>',
					'</ul>',
				'</div>'].join('');
	}
	function geJs(){
		$('#gexinghua').find('.szicon_wrap_ul').on('click','li',function(){
			$(this).toggleClass('bg');
			//尚未写好
		});
	}
	geJs.btn=true;
	$rightMenu.find('.gexinghua').on('click',function(){
		cWin({
			id:'gexinghua',
			format:'sz',
			width:444,
			height:430,
			title:'设置中心',
			html:geHtml(),
			mark:true,
			dblclick:false
		});
		if(geJs.btn){
			geJs.btn=false;
			geJs();
		}
	});
	//背景更换
	function beijingHtml(){
		return ['<ol class="pifu-con-top">',
					'<li class="active">图片</li>',
					'<li>纯色</li>',
					'<li>收藏</li>',
				'</ol>',
				'<ul class="pifu-con-bot">',
					'<li class="pifu-tupian">',
						'<div class="pifu-tupian-list"></div>',
					'</li>',
					'<li class="pifu-cunse"></li>',
					'<li class="shoucan"></li>',
				'</ul>'
				].join('');
	}
	function beijingJs(){
		var oPiFu=$('#beijing');
		var aPiFuTop=oPiFu.find('.pifu-con-top');
		var aPiFUBot=oPiFu.find('.pifu-con-bot');
		var aPiFuTopLi=aPiFuTop.find('li');
		var aPiFUBotLiTuPian=aPiFUBot.find('.pifu-tupian');
		var aPiFUBotLiCunSe=aPiFUBot.find('.pifu-cunse');
		var liW=aPiFUBotLiCunSe.outerWidth();
		aPiFuTopLi.on('click',function(){
			var $index=$(this).index();
			$(this).addClass('active').siblings().removeClass('active');
			aPiFUBot.stop().animate({left:-$index*liW},300);
		});
		var imageArr=['small-bg1.jpg','small-bg2.jpg'];
		var colorArr=['#e892ca','#cc7eb1','#bc64a4','#aa4c8f','#915c8b','#8a4d80','#9e8b8e','#71686c','#59b9c6','#2ca9e1','#2792c3','#5383c3','#507ea4','#2a83a2','#007bbb','#4c6cb3','#b0ca71','#aacf53','#99ab4e','#a1a46d','#8c8861','#928c36','#69821b','#726d40','#f5b199','#ee827c','#ec6d71','#cd5c5c','#fa8072','#e7609e','#c85179','#c85554','#ebb471','#e8b647','#d0af4c','#d9a62e','#b68e55','#cb8347','#c37854','#b77b57','#83ccd2','#84b9cb','#80aba9','#00a497','#38b48b','#00a381','#698aab','#5c9291','#a99e93','#a58f86','#887f7a','#b4866b','#b28c6e','#9f6f55','#8c6450','#6b6f59'];
		var imageHtml='';
		var colorHtml='';
		for(var i=0;i<imageArr.length;i++){
			imageHtml+='<span bgkey="1" bg="'+imageArr[i]+'"><img src="img/'+imageArr[i]+'"></span>';
		}
		for(var i=0;i<colorArr.length;i++){
			colorHtml+='<span bg="'+colorArr[i]+'" style="background-color:'+colorArr[i]+';"></span>';
		}
		var tuThis=null;
		var seThis=null;
		var loadBtn=true;
		//背景图片设置
		aPiFUBotLiTuPian.find('.pifu-tupian-list').html(imageHtml);
		aPiFUBotLiTuPian.find('span').on('click',function(){
			if(loadBtn){
				loadBtn=false;
				tuThis=$(this);
				seThis&&seThis.removeClass('icon');
				tuThis.addClass('icon').siblings().removeClass('icon');
				var imgSrc='img/'+tuThis.attr('bg').replace('small','big');
				if(tuThis.attr('bgkey')){
					tuThis.css('background','url(img/loading.gif) no-repeat center');
					var tempImg=new Image();
					tempImg.src=imgSrc;
					tempImg.onload=function(){							
						loadBtn=true;
						tuThis.css('background','none').removeAttr('bgkey');
						$desktop.css('background','url('+tempImg.src+') no-repeat center');
					};
					tempImg.onerror=function(){
						loadBtn=true;
						tuThis.css('background','none').removeAttr('bgkey');
						alert('图片加载失败');
					}
				}else{
					loadBtn=true;
					$desktop.css('background','url('+imgSrc+') no-repeat center');
				}
			}
		});
		//背景纯色设置
		aPiFUBotLiCunSe.html(colorHtml);
		aPiFUBotLiCunSe.find('span').on('click',function(){
			seThis=$(this);
			tuThis&&tuThis.removeClass('icon');
			seThis.addClass('icon').siblings().removeClass('icon');
			$desktop.css('background',seThis.attr('bg'));
		});
	}
	beijingJs.oBtn=true;
	$rightMenu.find('.beijing').on('click',function(){
		cWin({
			id:'beijing',
			format:'sz',
			width:570,
			height:440,
			title:'背景皮肤',
			html:beijingHtml(),
			mark:true,
			dblclick:false
		});
		if(beijingJs.oBtn){
			beijingJs.oBtn=false;
			beijingJs();
		}		
	});
	//恢复默认
	$rightMenu.find('.huifumoren').on('click',function(){
		setTimeout(function(){
			var tem=confirm('你确定要恢复默认？该操作不可返回。');
			if(tem){
				opt.off=true;
				opt.liSize=110;
				opt.ziDong=true;
				opt.icon=true;
				opt.tolls=true;
				$tool.removeClass('icon_none');
				$iconList.removeClass('icon_none');
				$iconLi.attr('class','center');
				$chaKanMenuDd.removeClass('icon').filter('.moren').addClass('icon');
				chuShiData(1);
			}	
		},30);
	});
	//新建
	$('#xinjian-menu dd').on('click',function(e){
		switch($(this).attr('now')){
			case 'wenjianjia':
				createElement('img/3.png','新建文件夹'+createElement.i++,'xinwenjian'+(createElement.i-1));
				break;
			case 'wendang':
				createElement('img/6.png','新建文档'+createElement.z++,'xinwendang'+(createElement.z-1));
				break;
		}
	});
	function createElement(url,name,id){
		var iconH=Math.floor($iconList.innerHeight()/opt.liSize);
		var liL=Math.floor($iconLiLen/iconH)*opt.liSize;
		var liT=$iconLiLen%iconH*opt.liSize;
		var $newLi=$('<li inow='+id+' key='+$iconLiLen+' img="'+url+'" date="'+new Date().getTime()+'"><div><img src="'+url+'"></div><span></span><h4>'+name+'</h4></li>');
		if(opt.liSize==80){
			$newLi.attr('class','small');
		}else if(opt.liSize==110){
			$newLi.attr('class','center');
		}else if(opt.liSize==140){
			$newLi.attr('class','big');
		}
		$iconList.append($newLi);
		$newLi.animate({left:liL,top:liT,opacity:1});
		opt.liShunXu[$iconLiLen]=$newLi;
		opt.liLeftTop[$iconLiLen]={left:liL,top:liT};		
		$iconLiLen++;
		$iconLi=$iconList.find('li');
	}
	createElement.i=1;
	createElement.z=1;
	
	//桌面时钟html/js
	function clockHtml(){
		return ['<div id="clock">',
					'<div class="second"></div>',
					'<div class="minute"></div>',
					'<div class="hour"></div>', 
					'<div class="icon1"></div>',
					'<div class="icon2"></div>',
					'<div class="icon3"></div>',
					'<div class="icon4"></div>',
				'</div>'].join('');
	}
	function clockJs(){
		var oClock=$('#clock');
		if(oClock[0].style.transform===undefined){//ie低版本
			function ieTime(){
				var oDate=new Date();
				oClock.html(buZero(oDate.getHours())+':'+buZero(oDate.getMinutes())+':'+buZero(oDate.getSeconds()));
			}
			ieTime();	
			setInterval(ieTime,1000);
			function buZero(num){
				return str=num<10?'0'+num:num;
			}
		}else{//高级浏览器
			var html='';
			for(var i=0;i<60;i++){
				html+='<span style="-webkit-transform:rotate('+i*6+'deg);-moz-transform:rotate('+i*6+'deg);transform:rotate('+i*6+'deg);"></span>';
			}
			oClock.html(oClock.html()+html);
			for(var k=0;k<12;k++){
				$('#clock span').eq(k*5).attr('content',k==0?12:k);
			}
			var oSecond=$('.second');
			var oMinute=$('.minute');
			var oHour=$('.hour');
			var timer=0;
			function toTime(){
				var oDate=new Date();	
				var iSecond=oDate.getSeconds();
				var iMinute=oDate.getMinutes()+iSecond/60;
				var iHour=oDate.getHours()+iMinute/60;
				oSecond.css({
					WebkitTransform:'rotate('+iSecond*6+'deg)',
					MozTransform:'rotate('+iSecond*6+'deg)',
					transform:'rotate('+iSecond*6+'deg)'
				});	
				oMinute.css({
					WebkitTransform:'rotate('+iMinute*6+'deg)',
					MozTransform:'rotate('+iMinute*6+'deg)',
					transform:'rotate('+iMinute*6+'deg)'
				});
				oHour.css({
					WebkitTransform:'rotate('+iHour*30+'deg)',
					MozTransform:'rotate('+iHour*30+'deg)',
					transform:'rotate('+iHour*30+'deg)'
				});
			}
			toTime();
			setInterval(toTime,1000);
		}
		//时钟拖拽
		Drag({
			id:oClock,
			xz:true,
			resize:true,
			fnDown:function(This){
				This.css('z-index',++zIndex);
			}
		});
	}
	//桌面拼图html/js
	function puzzleHtml(){
		return ['<div id="puzzle_wrap">',
					'<div class="puzzle_start">开始</div>',
					'<div class="puzzle_bushu">步数：<span>0</span></div>',
					'<div class="puzzle_jishi">秒数：<span>0</span></div>',
					'<div class="puzzle_success"></div>',
					'<div class="puzzle_shuzi" title="方块显示顺序数字"></div>',
					'<div class="puzzle_guize">?</div>',
					'<div class="puzzle_guize_lan">',
						'<h6>游戏规则</h6>',
						'<p>1、点击开始会打乱方块，将方块移到初始图状态则游戏过关；</p>',
						'<p>2、移动的步数超过300步算输；</p>',
						'<p>3、所用的时间超过200秒算输；</p>',
						'<p>4、点击投降并确定算输。</p>',
						'<span>提示：鼠标移出游戏可关闭规则界面</span>',
					'</div>',
					'<ul class="puzzle_list">',
						'<li>1</li>',
						'<li>2</li>',
						'<li>3</li>',
						'<li>4</li>',
						'<li>5</li>',
						'<li>6</li>',
						'<li>7</li>',
						'<li>8</li>',
						'<li>9</li>',
						'<li>10</li>',
						'<li>11</li>',
						'<li>12</li>',
						'<li>13</li>',
						'<li>14</li>',
						'<li>15</li>',
						'<li class="wutu"></li>',
					'</ul>',
					'<div class="puzzle_tx">',
						'<p>确定投降吗?</p>',
						'<button class="but1">取消</button>',
						'<button class="but2">确定</button>',
					'</div>',
				'</div>'].join('');
	}
	function puzzleJs(){
		var $puzzle=$('#puzzle_wrap');
		var $puzzleStart=$puzzle.find('.puzzle_start');
		var $puzzleBushu=$puzzle.find('.puzzle_bushu');
		var $puzzleJishi=$puzzle.find('.puzzle_jishi');
		var $puzzleSuccess=$puzzle.find('.puzzle_success');
		var $puzzleShuzi=$puzzle.find('.puzzle_shuzi');
		var $puzzleGuize=$puzzle.find('.puzzle_guize');
		var $puzzleGuizeLan=$puzzle.find('.puzzle_guize_lan');
		var $puzzleTx=$puzzle.find('.puzzle_tx');
		var $puzzleButton=$puzzleTx.find('button');
		var $puzzleUl=$puzzle.find('.puzzle_list');
		var $puzzleLi=$puzzleUl.find('li');
		var $puzzleLiLen=$puzzleLi.length;
		var $gap=$puzzleLi.eq($puzzleLiLen-1);
		var puzzleLiWz=[];
		var puzzlePd=[];
		var puzzleBtn=true;
		var puzzleLiClick=false;
		var $bushu=1;
		var $bushuBtn=false;
		var timer=0;
		var luanLi=[//开始打乱位置
				{left:50,top:150},
				{left:100,top:100},
				{left:0,top:50},
				{left:150,top:100},						
				{left:100,top:0},
				{left:100,top:150},
				{left:0,top:100},
				{left:150,top:0},					
				{left:150,top:50},
				{left:50,top:100},
				{left:50,top:0},
				{left:150,top:150},					
				{left:0,top:0},
				{left:100,top:50},
				{left:0,top:150},
				{left:50,top:50}
			];
		for(var i=0;i<$puzzleLiLen;i++){//贮存正确位置及设置初始位置
			var l=i%4*50;
			var t=Math.floor(i/4)*50;
			puzzleLiWz.push({left:l,top:t});
			puzzlePd.push({left:l,top:t});
			$puzzleLi.eq(i).css({left:l,top:t,backgroundPosition:'-'+l+'px -'+t+'px'});
		}
		//小块是否有数字提示
		$puzzleShuzi.on('click',function(){
			$(this).toggleClass('puzzle_on');
			if($(this).hasClass('puzzle_on')){
				$puzzleUl.css('font-size',16);
			}else{
				$puzzleUl.css('font-size',0);
			}		
		});
		//规则说明
		$puzzleGuize.on('mouseover',function(){
			$puzzleGuizeLan.animate({top:0},300);
		});
		$puzzleGuizeLan.on('mouseleave',function(){
			$puzzleGuizeLan.stop().css('top',310);
		});
		//点击开始
		$puzzleStart.on('click',function(){
			if(puzzleBtn){//开始、重来（随机打乱）
				puzzleBtn=false;
				puzzleLiClick=true;
				$bushu=1;
				$bushuBtn=false;
				//console.log($bushu)
				for(var i=0;i<$puzzleLiLen;i++){//打乱第一次
					$puzzleLi.eq(i).css({left:luanLi[i].left,top:luanLi[i].top});
				}
				for(var i=0;i<30;i++){//打乱第二次
					suiji($puzzleLi.eq(Math.floor(Math.random()*15)));
				}
				$puzzleStart.html('投降');
				$puzzleSuccess.html('游戏进行中...');
				$puzzleBushu.html('步数：0');
				$puzzleJishi.html('秒数：0');	
				$bushuBtn=true;		
				var i=0;
				timer=setInterval(function(){
					$puzzleJishi.html('秒数：'+(++i));
					if(i==200){
						commJieShuFn('时间到，游戏失败!');
					}
				},1000);
			}else{//是否投降
				$puzzleTx.stop().animate({top:0},600,'bounceOut');
				$puzzleButton.on('click',function(){
					if($(this).text()=='确定'){
						clearInterval(timer);
						quedingFn();
					}
					$puzzleTx.css('top',-311);
				});
			}
		});
		//图标点击
		$puzzle.on('click','li',function(){
			if(puzzleLiClick){
				if($(this)[0]==$gap[0])return;
				suiji($(this));
				for(var i=0;i<$puzzleLiLen;i++){
					if(puzzleLiWz[i].left!==puzzlePd[i].left||puzzleLiWz[i].top!==puzzlePd[i].top){
						break;
					}
				}
				if(i==16){
					clearInterval(timer);
					$puzzleSuccess.html('恭喜，拼图成功 ^_^ ');
					$puzzleStart.html('重来');
					puzzleBtn=true;
					puzzleLiClick=false;
				}
			}
		});
		function quedingFn(){//重新开始调的
			$puzzleBushu.html('步数：0');
			$puzzleJishi.html('秒数：0');
			$puzzleStart.html('开始');
			for(var i=0;i<$puzzleLiLen;i++){
				$puzzleLi.eq(i).css({left:puzzleLiWz[i].left,top:puzzleLiWz[i].top});
			}
			$puzzleSuccess.html('');
			puzzleLiClick=false;
			puzzleBtn=true;
		}
		function commJieShuFn(str){//游戏失败调的
			clearInterval(timer);
			var $tempNode=$('<div class="puzzle_shu"><p>'+str+'</p><button>重头再来</button></div>');
			$tempNode.find('button').on('click',function(){
				quedingFn();
				$tempNode.remove();
			});
			$puzzle.append($tempNode);
			$puzzleTx.css('top',-311);
		}
		function suiji(This){//判断是否能移动
			var l=$gap.position().left;
			var t=$gap.position().top;
			var r=l+$gap.outerWidth();
			var b=t+$gap.outerHeight();
			var L=This.position().left;
			var T=This.position().top;
			var R=This.position().left+This.outerWidth();
			var B=This.position().top+This.outerHeight();
			if((L==l||T==t)&&(T==b||B==t||L==r||R==l)){
				$gap.css({left:L,top:T});
				This.css({left:l,top:t});
				puzzlePd.splice(This.index(),1,{left:l,top:t});
				puzzlePd.splice($gap.index(),1,{left:L,top:T});
				if($bushuBtn){
					$puzzleBushu.html('步数：'+$bushu++);
					if($bushu==301)commJieShuFn('步数到，游戏失败!');
				}			
			}
		}
		//拼图拖拽
		Drag({
			id:$puzzle,
			xz:true,
			resize:true,
			fnDown:function(This){
				This.css('z-index',++zIndex);
			}
		});
		var stopPropagation=function(e){e.stopPropagation();}
		$puzzleStart.on('mousedown',stopPropagation);
		$puzzleUl.on('mousedown',stopPropagation);
	}
	
	//桌面日历html/js
	function riliHtml(){
		return ['<div id="rili">',
					'<div class="rili-nianfen">',
						'<ul class="rili-nianfen-ul">',
							'<li class="rili-li1"><span></span><em></em><i></i></li>',
							'<li class="rili-li2">年</li>',
							'<li class="rili-li3"><span></span><em></em><i></i></li>',
							'<li class="rili-li2">月</li>',
							'<li class="rili-li3"><span></span><em></em><i></i></li>',
							'<li class="rili-li2">日</li>',
						'</ul>',
					'</div>',
					'<div class="rili-tiaozhuang">',
						'<input type="text" placeholder="日期格式：2017-9-10" class="text">',
						'<input type="button" value="跳转" class="button">',
						'<button>此年月份</button>',
						'<button>时钟</button>',
						'<button>返回今天</button>',
					'</div>',
					'<div class="rili-shizhong">',
						'<a href="javascript:;" class="close">×</a>',
						'<div class="clock"></div>',
					'</div>',
					'<div class="rili-yuefen">',
						'<a href="javascript:;" class="close">返回</a>',
					'</div>',
				'</div>'].join('');
	}
	function riliJs(){
		var oRili=document.getElementById('rili');
		var oRiliUl=getClass(oRili,'rili-nianfen-ul','ul')[0];
		var oRiliUlSpan=oRiliUl.getElementsByTagName('span');
		var oRiliUlLi=oRiliUl.getElementsByTagName('li');
		var oRiliUlEm=oRiliUl.getElementsByTagName('em');
		var oRiliUlI=oRiliUl.getElementsByTagName('i');
		var oRiliTiaoZhuang=getClass(oRili,'rili-tiaozhuang','div')[0];
		var oRiliText=oRiliTiaoZhuang.getElementsByTagName('input');
		var oRiliButton=oRiliTiaoZhuang.getElementsByTagName('button');
		var oRiliShiZhong=getClass(oRili,'rili-shizhong','div')[0];
		var oRiliClose=getClass(oRiliShiZhong,'close','a')[0];
		var oRiliClock=getClass(oRiliShiZhong,'clock','div')[0];
		var oRiliYueFen=getClass(oRili,'rili-yuefen','div')[0];
		var oRiliYueFenClose=getClass(oRiliYueFen,'close','a')[0];
		var iNowDay=null;//保存今天的节点
		//获取时间对象(服务器返回的时间，这里用本地的)
		var oDate=new Date();
		var year=oDate.getFullYear();
		var month=oDate.getMonth()+1;
		var day=oDate.getDate();
		var year2=year;
		var month2=month;
		var day2=day;
		//给前六个按钮加事件
		for(var i=0;i<oRiliUlEm.length;i++){
			oRiliUlEm[i].index=i;
			oRiliUlI[i].index=i;
			oRiliUlEm[i].onclick=function(){
				if(this.index==0){
					year++;
				}else if(this.index==1){
					if(month==12){
						month=1;
						year++;
					}else{
						month++;
					}
				}else if(this.index==2){
					if(day==isMonthDay(year,month)){
						if(month==12){
							month=1;
							year++;
						}else{
							month++;
						}	
						day=1;
					}else{
						day++;
					}
				}
				setYTD(year,month,day);
			};
			oRiliUlI[i].onclick=function(){
				if(this.index==0){
					if(year==1){
						alert('不能再减啦!!')
					}else{
						year--;
					}				
				}else if(this.index==1){
					if(month==1){
						if(year==1){
							alert('不能再减啦!!')
						}else{						
							month=12;
							year--;
						}
					}else{
						month--;
					}
				}else if(this.index==2){
					if(day==1){
						if(year==1&&month==1){
							alert('不能再减啦!!')
						}else{
							if(month==1){
								month=12;
								year--;
							}else{
								month--;
							}
							day=isMonthDay(year,month);
						}					
					}else{
						day--;
					}				
				}
				setYTD(year,month,day);
			};
		}
		//给后四个按钮加事件
		oRiliText[1].onclick=function(){
			var value=oRiliText[0].value.replace(/^\s*|\s*$/g,'');
			var re=/^\d{1,4}-\d{1,2}-\d{1,2}$/;
			if(re.test(value)){
				var arr=value.split('-');
				if(arr[1]<1||arr[1]>12||arr[2]<1||arr[2]>isMonthDay(arr[0],arr[1])){
					alert('请输入正确的日期格式!!')
				}else{
					setYTD(arr[0],arr[1],arr[2],tBodyTd);
					year=arr[0];
					month=arr[1];
					day=arr[2];
				}		
			}else{
				alert('请输入正确的日期格式!!')
			}
		};
		var prevYear=0;
		oRiliButton[0].onclick=function(){//此年月份
			oRiliYueFen.style.display='block';
			if(oRiliYueFen.children.length==1){
				var tableArr2=['日','一','二','三','四','五','六'];
				for(var i=0;i<12;i++){
					createTable(tableArr2,oRiliYueFen,oRiliYueFenClose);
				}
				oRiliYueFenClose.onclick=function(){
					oRiliYueFen.style.display='none';
				};
			}
			if(prevYear!=year){
				function setYuefen(year,month,tBodyTd){
					//清空单元格的文字
					for(var i=0;i<tBodyTd.length;i++){
						tBodyTd[i].innerHTML='';
					}
					//设置年月日
					var oDate=new Date()
					oDate.setFullYear(year);
					oDate.setMonth(month-1);
					oDate.setDate(1);
					//给td添加号数		
					for(var i=0;i<isMonthDay(year,month);i++){
						tBodyTd[i+oDate.getDay()].innerHTML=i+1;
					}
				}
				for(var i=0;i<12;i++){
					var tBodyTd=oRiliYueFen.getElementsByTagName('table')[i].getElementsByTagName('td');
					setYuefen(year,i+1,tBodyTd);
				}
			}
			prevYear=year;
		};
		oRiliButton[1].onclick=function(){//时钟
			oRiliShiZhong.style.display='block';
			if(!oRiliClock.children.length){
				oRiliClose.onclick=function(){
					oRiliShiZhong.style.display='none';
				};
				if(oRiliClock.style.transform===undefined)return;
				var htmlClock='<div class="second"></div><div class="minute"></div><div class="hour"></div><div class="icon1"></div>';
				for(var i=0;i<60;i++){
					htmlClock+='<span style="-webkit-transform:rotate('+i*6+'deg);-moz-transform:rotate('+i*6+'deg);transform:rotate('+i*6+'deg);"></span>';
				}
				oRiliClock.innerHTML+=htmlClock;
				var oRiliClockSecond=getClass(oRiliClock,'second','div')[0];
				var oRiliClockMinute=getClass(oRiliClock,'minute','div')[0];
				var oRiliClockHour=getClass(oRiliClock,'hour','div')[0];
				function toTime(){
					var oDate=new Date();	
					var iSecond=oDate.getSeconds();
					var iMinute=oDate.getMinutes()+iSecond/60;
					var iHour=oDate.getHours()+iMinute/60;
					oRiliClockSecond.style.transform='rotate('+iSecond*6+'deg)';
					oRiliClockMinute.style.transform='rotate('+iMinute*6+'deg)';
					oRiliClockHour.style.transform='rotate('+iHour*30+'deg)';
				}
				toTime();
				setInterval(toTime,1000);
			}
		};
		oRiliButton[2].onclick=function(){//返回今天
			setYTD(year2,month2,day2);
			year=year2;
			month=month2;
			day=day2;
		};
		//创建表格
		var tableArr=['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
		createTable(tableArr,oRili,oRiliTiaoZhuang);
		function createTable(tableArr,parent,prevElem){
			var table=document.createElement('table');
			addClass(table,'rili-table');
			var tHead=table.createTHead();
			var tBody=document.createElement('tBody');
			var tHeadTr=tHead.insertRow(0);		
			for(var i=0;i<7;i++){		
				var tHeadTrTh=document.createElement('th');
				tHeadTrTh.innerHTML=tableArr[i];
				if(i==0){
					addClass(tHeadTrTh,'rili-t-color');
				}else if(i==6){
					addClass(tHeadTrTh,'rili-b-color');
				}
				tHeadTr.appendChild(tHeadTrTh);
			}
			for(var i=0;i<6;i++){
				var tBodyTr=document.createElement('tr');
				for(var j=0;j<7;j++){
					var tBodyTrTd=document.createElement('td');
					if(j==0){
						addClass(tBodyTrTd,'rili-t-color');
					}else if(j==6){
						addClass(tBodyTrTd,'rili-b-color');
					}
					tBodyTr.appendChild(tBodyTrTd);
				}
				tBody.appendChild(tBodyTr);
			}
			table.appendChild(tBody);
			parent.insertBefore(table,prevElem);
		}
		//获取所有tBody里的td
		var tBodyTd=oRili.getElementsByTagName('table')[0].getElementsByTagName('td');
		//放置每月天数到单元格里
		setYTD(year,month,day);
		function setYTD(year,month,day){
			//清空单元格的文字和今天的class
			for(var i=0;i<tBodyTd.length;i++){
				tBodyTd[i].innerHTML='';
			}
			iNowDay&&removeClass(iNowDay,'rili-bg-color');	
			//当月天数		
			var dayNum=isMonthDay(year,month);
			//设置年月日
			var oDate2=new Date()
			oDate2.setFullYear(year);
			oDate2.setMonth(month-1);
			oDate2.setDate(1);
			//给td添加号数		
			for(var i=0;i<dayNum;i++){
				tBodyTd[i+oDate2.getDay()].innerHTML=i+1;
				if(i+1==day){//给当前日加颜色
					iNowDay=tBodyTd[i+oDate2.getDay()];
					addClass(iNowDay,'rili-bg-color');
				}
			}
			//给span添加年月日
			oRiliUlSpan[0].innerHTML=year;
			oRiliUlSpan[1].innerHTML=month;
			oRiliUlSpan[2].innerHTML=day;
		}
		//一个月有几天
		function isMonthDay(year,month){
			var dayNum=0;
			if(month==1||month==3||month==5||month==7||month==8||month==10||month==12){
				dayNum=31;
			}else if(month==4||month==6||month==9||month==11){
				dayNum=30;
			}else if(month==2&&(year%4==0&&year%100!=0||year%400==0)){
				dayNum=29;
			}else{
				dayNum=28;
			}
			return dayNum;
		}
		
		//日历拖拽
		Drag({
			id:$('#rili'),
			xz:true,
			resize:true,
			fnDown:function(This){
				This.css('z-index',++zIndex);
			}
		});
		$(oRiliTiaoZhuang).on('mousedown',function(e){e.stopPropagation();});
		
		/*class相关操作，如果用jq，可以删除*/
		function getClass(parent,sClass,tagName){
			var arr=[];
			if(parent.getElementsByClassName){
				arr=parent.getElementsByClassName(sClass);
			}else{
				var result=parent.getElementsByTagName(tagName);
				for(var i=0;i<result.length;i++){
					if(new RegExp('\\b'+sClass+'\\b').test(result[i].className)){
						arr.push(result[i]);
					}
				}
			}
			return arr;
		}
		function addClass(elem,sClass){
			if(elem.className==''){
				elem.className=sClass;
			}else{
				var aClass=sClass.split(' ');
				for(var i=0;i<aClass.length;i++){
					if(elem.className.search(new RegExp("\\b"+aClass[i]+"\\b"))==-1){
						elem.className+=' '+aClass[i];
					}
				}
			}
		}
		function removeClass(elem,sClass){
			var aClass=sClass.split(' ');
			if(elem.className!=''){
				for(var i=0;i<aClass.length;i++){
					elem.className=elem.className.replace(new RegExp('\\s*\\b'+aClass[i]+'\\b','g'),'');
				}
			}
		}		
	}
	
	//桌面贪吃蛇html/js
	function snakeHtml(){
		return ['<div id="panel">',
					'<div id="ss-option">',
						'<h3 id="ss-title">贪吃蛇</h3>',
						'<p id="ss-start">开始</p>',
						'<p id="ss-menu">设置</p>',
						'<p id="ss-rule">规则</p>',
						'<div class="ss-comm ss-mode">',
							'<h4>请选择模式</h4>',
							'<i class="ss-close">×</i>',
							'<span>经典模式</span>',
							'<span>算数模式</span>',
							'<span>关卡模式</span>',
						'</div>',
						'<div class="ss-comm ss-set">',
							'<i class="ss-close">×</i>',
							'<div class="ss-set-speed">',
								'<span>经典模式<i></i></span>',
								'<ul>',
									'<li>经典模式</li>',
									'<li>算数模式</li>',
									'<li>关卡模式</li>',
								'</ul>',
							'</div>',
							'<ul class="ss-set-gexiang" style="display:block;">',
								'<li>',
									'<label>蛇爬行速度：</label>',
									'<select class="ss-set-select">',
										'<option value="1">1</option>',
										'<option value="2">2</option>',
										'<option value="3">3</option>',
										'<option value="4" selected>4</option>',
										'<option value="5">5</option>',
									'</select>',
								'</li>',
							'</ul>',
							'<ul class="ss-set-gexiang">',
								'<li>',
									'<label>蛇爬行速度：</label>',
									'<select class="ss-set-select">',
										'<option value="1">1</option>',
										'<option value="2">2</option>',
										'<option value="3">3</option>',
										'<option value="4" selected>4</option>',
										'<option value="5">5</option>',
									'</select>',
								'</li>',
							'</ul>',
							'<ul class="ss-set-gexiang">',
								'<li>',
									'<label>蛇爬行速度：</label>',
									'<select class="ss-set-select">',
										'<option value="1">1</option>',
										'<option value="2">2</option>',
										'<option value="3" selected>3</option>',
										'<option value="4">4</option>',
										'<option value="5">5</option>',
									'</select>',
								'</li>',
							'</ul>',
						'</div>',
						'<div class="ss-comm ss-introduce">',
							'<i class="ss-close">×</i>',
							'<ul>',
								'<li>经典模式：四面不可穿过，蛇占满全屏游戏过关。</li>',
								'<li>算数模式：四面不可穿过</li>',
								'<li>关卡模式：四面可穿过，通过最后一关卡游戏过关。</li>',
							'</ul>',
						'</div>',
					'</div>',
					'<div id="ss-interface">',
						'<h4></h4>',
						'<p>分数：<span>0</span></p>',
						'<ul id="snake"></ul>',
					'</div>',
				'</div>'].join('');
	}
	function snakeJs(){
		var oPanel=document.getElementById('panel');
		var oOption=document.getElementById('ss-option');
		var aP=oOption.getElementsByTagName('p');
		var aDiv=getClass(oOption,'ss-comm','div');
		var aClose=getClass(oOption,'ss-close','i');
		var aStartSpan=aDiv[0].getElementsByTagName('span');
		var oInterface=document.getElementById('ss-interface')	
		var aH4=oInterface.getElementsByTagName('h4')[0];
		var oSetSpeed=getClass(oPanel,'ss-set-speed','div');
		var aSetSpeedSpan=oSetSpeed[0].getElementsByTagName('span')[0];
		var aSetSpeedUl=oSetSpeed[0].getElementsByTagName('ul')[0];
		var aSetSpeedUlLi=aSetSpeedUl.getElementsByTagName('li');
		var aSetGexiang=getClass(oPanel,'ss-set-gexiang','ul');
		var aSetSelect=getClass(oPanel,'ss-set-select','select');
		var aSetOptions=oPanel.getElementsByTagName('option');	
		var aSpan=oInterface.getElementsByTagName('span')[0];
		var oSnake=document.getElementById('snake');
		var row=15;//地图多少行
		var col=30;//地图多少列
		var num=3;//蛇的初始长度
		var iSpeed=150;//蛇的运动速度
		var dir='l';//蛇的运动方向左
		var aSnake=[];//保存蛇每一节信息
		var iNow=0;//食物计数
		var gameMode=0;//游戏模式
		var timer=null;//引用定时器
		oSnake.style.cssText='width:'+col*20+'px;height:'+row*20+'px;';
		//界面三个按钮
		for(var i=0;i<aP.length;i++){
			aP[i].index=i;
			aClose[i].index=i;
			aP[i].onclick=function(){
				aDiv[this.index].style.display='block';
			};
			aClose[i].onclick=function(){
				aDiv[this.index].style.display='none';
			};
		}
		//开始选择模式
		for(var i=0;i<aStartSpan.length;i++){
			aStartSpan[i].type=i;
			aStartSpan[i].onclick=function(){
				gameMode=this.type;
				aH4.innerHTML=this.innerHTML;
				oOption.style.display='none';
				startFn();
				//速度控制
				switch(aSetSelect[gameMode].value){
					case '1':
						iSpeed=300;
						break;
					case '2':
						iSpeed=200;
						break;
					case '3':
						iSpeed=150;
						break;
					case '4':
						iSpeed=100;
						break;
					case '5':
						iSpeed=50;
						break;
				}
			};
		}
		//设置相关
		var bBtnUl=true;
		aSetSpeedSpan.onclick=function(){
			if(bBtnUl){
				aSetSpeedUl.style.display='block';
				this.style.borderRadius='6px 6px 0 0';
			}else{
				aSetSpeedUl.style.display='none';
				this.style.borderRadius='6px';
			}
			bBtnUl=!bBtnUl;	
		};
		for(var i=0;i<aSetSpeedUlLi.length;i++){
			aSetSpeedUlLi[i].index=i;
			aSetSpeedUlLi[i].onclick=function(){
				aSetSpeedSpan.innerHTML=this.innerHTML+'<i></i>';
				aSetSpeedUl.style.display='none';
				aSetSpeedSpan.style.borderRadius='6px';
				bBtnUl=true;
				for(var i=0;i<aSetSpeedUlLi.length;i++){
					aSetGexiang[i].style.display='none';
				}
				aSetGexiang[this.index].style.display='block';
			}
		}
		//生产蛇
		function createSnake(){
			for(var i=0;i<num;i++){
				var oLi=document.createElement('li');
				aSnake[i]={
					elem:oLi,
					dir:dir,
					l:Math.round((col-num)/2)+i,
					t:Math.round((row-1)/2)			
				};
				setPos(aSnake[i]);
				oSnake.appendChild(oLi);
			}
			aSnake[0].elem.className='st stl';
			aSnake[aSnake.length-1].elem.className='sw swl';
		}
		//生产吃的
		function createFood(num,bColor){
			if(typeof num!=='number'&&num){
				bColor=num;
			}else{
				num=num||1;
			}		
			createFood.node=[];
			while(createFood.node.length<num){
				var l=parseInt(Math.random()*col);
				var t=parseInt(Math.random()*row);
				var bBtn=true;
				var bgc=bColor?'ff2f20':randomColor();
				for(var i=0;i<aSnake.length;i++){		//蛇
					l==aSnake[i].l&&t==aSnake[i].t&&(bBtn=false);
				}
				for(var i=0;i<createFood.node.length;i++){		//食物
					l==createFood.node[i].l&&t==createFood.node[i].t&&(bBtn=false);
				}
				if(gameMode==2){	//关卡障碍物
					for(var i=0;i<map[map.guanCount].length;i++){
						l==map[map.guanCount][i].l&&t==map[map.guanCount][i].t&&(bBtn=false);
					}
				}
				if(bBtn){
					var oLi=document.createElement('li');
					oLi.style.cssText='left:'+l*20+'px;top:'+t*20+'px;background:#'+bgc+';';
					oLi.className='boxshadow';
					oSnake.appendChild(oLi);
					createFood.node.push({l:l,t:t,elem:oLi});
				}
			}
		}
		//食物添加随机符号和数字
		function randomRount(obj){
			var symbolArr=['+','-','='];
			var randomArr=[];
			while(randomArr.length<6){
				var bBtn=true;
				var iRandom=parseInt(Math.random()*9)+1;
				for(var i=0;i<randomArr.length;i++){
					randomArr[i]==iRandom&&(bBtn=false);
				}
				bBtn&&randomArr.push(iRandom);
			}
			var newArr=symbolArr.concat(randomArr);
			for(var i=0;i<obj.length-1;i++){			
				obj[i].elem.innerHTML=newArr[i];
			}
			switch(symbolArr[parseInt(Math.random()*2)]){
				case '+':
					obj[obj.length-1].elem.innerHTML=randomArr[0]+randomArr[1];
					break;
				case '-':
					obj[obj.length-1].elem.innerHTML=randomArr[0]-randomArr[1];
					break;
			}		
		}
		var map={
			1:[
				{l:13,t:8},
				{l:13,t:9},
				{l:13,t:10},
				{l:13,t:11},
				{l:13,t:12},
				{l:13,t:13},
				{l:13,t:14},
				{l:16,t:8},
				{l:16,t:9},
				{l:16,t:10},
				{l:16,t:11},
				{l:16,t:12},
				{l:16,t:13},
				{l:16,t:14},
				{l:3,t:12},
				{l:4,t:12},
				{l:5,t:12},
				{l:6,t:12},
				{l:7,t:12},
				{l:8,t:12},
				{l:9,t:12}
			],
			2:[
				{l:0,t:0},
				{l:1,t:0},
				{l:2,t:0},
				{l:3,t:0},
				{l:4,t:0},
				{l:5,t:0},
				{l:6,t:0},
				{l:0,t:1},
				{l:0,t:2},
				{l:0,t:3},
				{l:23,t:0},
				{l:24,t:0},
				{l:25,t:0},
				{l:26,t:0},
				{l:27,t:0},
				{l:28,t:0},
				{l:29,t:0},
				{l:29,t:1},
				{l:29,t:2},
				{l:29,t:3},
				{l:0,t:11},
				{l:0,t:12},
				{l:0,t:13},
				{l:0,t:14},
				{l:1,t:14},
				{l:2,t:14},
				{l:3,t:14},
				{l:4,t:14},
				{l:5,t:14},
				{l:6,t:14},
				{l:23,t:14},
				{l:24,t:14},
				{l:25,t:14},
				{l:26,t:14},
				{l:27,t:14},
				{l:28,t:14},
				{l:29,t:14},
				{l:29,t:13},
				{l:29,t:12},
				{l:29,t:11}
			],
			3:[
				{l:0,t:0},
				{l:0,t:1},
				{l:0,t:2},
				{l:0,t:3},
				{l:0,t:4},
				{l:0,t:5},
				{l:0,t:9},
				{l:0,t:10},
				{l:0,t:11},
				{l:0,t:12},
				{l:0,t:13},
				{l:0,t:14},			
				{l:1,t:0},
				{l:2,t:0},
				{l:3,t:0},
				{l:4,t:0},
				{l:5,t:0},
				{l:6,t:0},
				{l:7,t:0},
				{l:8,t:0},
				{l:9,t:0},
				{l:10,t:0},
				{l:11,t:0},
				{l:12,t:0},
				{l:13,t:0},
				{l:16,t:0},
				{l:17,t:0},
				{l:18,t:0},
				{l:19,t:0},
				{l:20,t:0},
				{l:21,t:0},
				{l:22,t:0},
				{l:23,t:0},
				{l:24,t:0},
				{l:25,t:0},
				{l:26,t:0},
				{l:27,t:0},
				{l:28,t:0},
				{l:29,t:0},
				{l:29,t:1},
				{l:29,t:2},
				{l:29,t:3},
				{l:29,t:4},
				{l:29,t:5},
				{l:29,t:9},
				{l:29,t:10},
				{l:29,t:11},
				{l:29,t:12},
				{l:29,t:13},
				{l:29,t:14},			
				{l:28,t:14},
				{l:27,t:14},
				{l:26,t:14},
				{l:25,t:14},
				{l:24,t:14},
				{l:23,t:14},
				{l:22,t:14},
				{l:21,t:14},
				{l:20,t:14},
				{l:19,t:14},
				{l:18,t:14},
				{l:17,t:14},
				{l:16,t:14},
				{l:13,t:14},
				{l:12,t:14},
				{l:11,t:14},
				{l:10,t:14},
				{l:9,t:14},
				{l:8,t:14},
				{l:7,t:14},
				{l:6,t:14},
				{l:5,t:14},
				{l:4,t:14},
				{l:3,t:14},
				{l:2,t:14},
				{l:1,t:14},
				{l:10,t:6},
				{l:11,t:6},
				{l:12,t:6},
				{l:13,t:6},
				{l:16,t:6},
				{l:17,t:6},
				{l:18,t:6},
				{l:19,t:6},			
				{l:10,t:8},
				{l:11,t:8},
				{l:12,t:8},
				{l:13,t:8},
				{l:16,t:8},
				{l:17,t:8},
				{l:18,t:8},
				{l:19,t:8}
			],
			4:[
				{l:7,t:4},
				{l:7,t:5},
				{l:8,t:4},
				{l:9,t:4},
				{l:10,t:4},
				{l:11,t:4},
				{l:12,t:4},
				{l:13,t:4},
				{l:14,t:4},
				{l:15,t:4},
				{l:16,t:4},
				{l:17,t:4},
				{l:18,t:4},
				{l:19,t:4},
				{l:20,t:4},
				{l:21,t:4},
				{l:22,t:4},
				{l:22,t:5},			
				{l:7,t:9},
				{l:7,t:8},
				{l:7,t:10},
				{l:7,t:11},
				{l:7,t:12},
				{l:7,t:13},
				{l:8,t:9},
				{l:9,t:9},
				{l:10,t:9},
				{l:11,t:9},
				{l:12,t:9},
				{l:13,t:9},
				{l:14,t:9},
				{l:15,t:9},
				{l:16,t:9},
				{l:17,t:9},
				{l:18,t:9},
				{l:19,t:9},
				{l:20,t:9},
				{l:21,t:9},
				{l:22,t:8},
				{l:22,t:9}
			],
			5:[
				{l:3,t:1},
				{l:3,t:2},
				{l:3,t:3},
				{l:3,t:4},
				{l:3,t:5},
				{l:3,t:6},
				{l:3,t:7},
				{l:3,t:8},
				{l:3,t:9},
				{l:3,t:10},
				{l:3,t:11},
				{l:3,t:12},
				{l:3,t:13},
				{l:3,t:14},
				{l:2,t:14},
				{l:1,t:14},
				{l:0,t:14},			
				{l:4,t:1},
				{l:5,t:1},
				{l:6,t:1},
				{l:7,t:1},
				{l:8,t:1},
				{l:9,t:1},
				{l:10,t:1},
				{l:11,t:1},
				{l:12,t:1},
				{l:13,t:1},
				{l:14,t:1},
				{l:15,t:1},
				{l:16,t:1},
				{l:17,t:1},
				{l:18,t:1},
				{l:19,t:1},
				{l:20,t:1},
				{l:21,t:1},
				{l:22,t:1},
				{l:23,t:1},
				{l:24,t:1},
				{l:25,t:1},
				{l:26,t:1},			
				{l:26,t:2},
				{l:26,t:3},
				{l:26,t:4},
				{l:26,t:5},
				{l:26,t:6},
				{l:26,t:7},
				{l:26,t:8},
				{l:26,t:9},
				{l:26,t:10},
				{l:26,t:11},
				{l:26,t:12},
				{l:27,t:12},
				{l:28,t:12},			
				{l:5,t:3},
				{l:5,t:4},
				{l:5,t:5},
				{l:5,t:6},
				{l:5,t:7},
				{l:5,t:8},
				{l:5,t:9},
				{l:5,t:10},
				{l:5,t:11},
				{l:5,t:12},
				{l:5,t:13},			
				{l:24,t:3},
				{l:24,t:4},
				{l:24,t:5},
				{l:24,t:6},
				{l:24,t:7},
				{l:24,t:8},
				{l:24,t:9},
				{l:24,t:10},
				{l:24,t:11},
				{l:24,t:12},
				{l:24,t:13},
				{l:24,t:14},
				{l:25,t:14},
				{l:26,t:14},
				{l:27,t:14},
				{l:28,t:14},
				{l:29,t:14},			
				{l:6,t:3},
				{l:7,t:3},
				{l:8,t:3},
				{l:9,t:3},
				{l:10,t:3},
				{l:11,t:3},
				{l:12,t:3},
				{l:13,t:3},
				{l:14,t:3},
				{l:15,t:3},
				{l:16,t:3},
				{l:17,t:3},
				{l:18,t:3},
				{l:19,t:3},
				{l:20,t:3},
				{l:21,t:3},
				{l:22,t:3},
				{l:23,t:3}
			],
			6:[
				{l:0,t:0},
				{l:1,t:0},
				{l:2,t:0},
				{l:3,t:0},
				{l:4,t:0},
				{l:5,t:0},
				{l:6,t:0},
				{l:7,t:0},
				{l:8,t:0},
				{l:9,t:0},
				{l:10,t:0},
				{l:11,t:0},
				{l:0,t:1},
				{l:0,t:2},
				{l:0,t:3},
				{l:0,t:4},
				{l:0,t:5},
				{l:18,t:0},
				{l:19,t:0},
				{l:20,t:0},
				{l:21,t:0},
				{l:22,t:0},
				{l:23,t:0},
				{l:24,t:0},
				{l:25,t:0},
				{l:26,t:0},
				{l:27,t:0},
				{l:28,t:0},
				{l:29,t:0},
				{l:29,t:1},
				{l:29,t:2},
				{l:29,t:3},
				{l:29,t:4},
				{l:29,t:5},
				{l:0,t:9},
				{l:0,t:10},
				{l:0,t:11},
				{l:0,t:12},
				{l:0,t:13},
				{l:0,t:14},
				{l:1,t:14},
				{l:2,t:14},
				{l:3,t:14},
				{l:4,t:14},
				{l:5,t:14},
				{l:6,t:14},
				{l:7,t:14},
				{l:8,t:14},
				{l:9,t:14},
				{l:10,t:14},
				{l:11,t:14},
				{l:18,t:14},
				{l:19,t:14},
				{l:20,t:14},
				{l:21,t:14},
				{l:22,t:14},
				{l:23,t:14},
				{l:24,t:14},
				{l:25,t:14},
				{l:26,t:14},
				{l:27,t:14},
				{l:28,t:14},
				{l:29,t:14},
				{l:29,t:13},
				{l:29,t:12},
				{l:29,t:11},
				{l:29,t:10},
				{l:29,t:9},			
				{l:3,t:2},
				{l:4,t:2},
				{l:5,t:2},
				{l:6,t:2},
				{l:7,t:2},
				{l:3,t:3},
				{l:4,t:3},
				{l:5,t:3},
				{l:6,t:3},
				{l:7,t:3},
				{l:3,t:4},
				{l:4,t:4},
				{l:5,t:4},
				{l:6,t:4},
				{l:7,t:4},			
				{l:3,t:10},
				{l:4,t:10},
				{l:5,t:10},
				{l:6,t:10},
				{l:7,t:10},
				{l:3,t:11},
				{l:4,t:11},
				{l:5,t:11},
				{l:6,t:11},
				{l:7,t:11},
				{l:3,t:12},
				{l:4,t:12},
				{l:5,t:12},
				{l:6,t:12},
				{l:7,t:12},			
				{l:22,t:10},
				{l:23,t:10},
				{l:24,t:10},
				{l:25,t:10},
				{l:26,t:10},
				{l:22,t:11},
				{l:23,t:11},
				{l:24,t:11},
				{l:25,t:11},
				{l:26,t:11},
				{l:22,t:12},
				{l:23,t:12},
				{l:24,t:12},
				{l:25,t:12},
				{l:26,t:12},			
				{l:22,t:2},
				{l:23,t:2},
				{l:24,t:2},
				{l:25,t:2},
				{l:26,t:2},
				{l:22,t:3},
				{l:23,t:3},
				{l:24,t:3},
				{l:25,t:3},
				{l:26,t:3},
				{l:22,t:4},
				{l:23,t:4},
				{l:24,t:4},
				{l:25,t:4},
				{l:26,t:4},			
				{l:10,t:5},
				{l:11,t:5},
				{l:12,t:5},
				{l:13,t:5},
				{l:14,t:5},
				{l:15,t:5},
				{l:16,t:5},
				{l:17,t:5},
				{l:18,t:5},
				{l:19,t:5},		
				{l:10,t:9},
				{l:11,t:9},
				{l:12,t:9},
				{l:13,t:9},
				{l:14,t:9},
				{l:15,t:9},
				{l:16,t:9},
				{l:17,t:9},
				{l:18,t:9},
				{l:19,t:9}
			],
			7:[
				{l:0,t:0},
				{l:0,t:1},
				{l:0,t:2},
				{l:0,t:3},
				{l:0,t:4},
				{l:1,t:4},
				{l:2,t:4},
				{l:3,t:4},
				{l:3,t:5},
				{l:3,t:6},
				{l:3,t:7},
				{l:3,t:8},
				{l:3,t:9},
				{l:3,t:10},
				{l:2,t:10},
				{l:1,t:10},
				{l:0,t:10},
				{l:0,t:11},
				{l:0,t:12},
				{l:0,t:13},
				{l:0,t:14},			
				{l:1,t:0},
				{l:2,t:0},
				{l:3,t:0},
				{l:4,t:0},
				{l:5,t:0},
				{l:6,t:0},
	
				{l:7,t:0},
				{l:8,t:0},
				{l:9,t:0},
				{l:10,t:0},
				{l:11,t:0},
				{l:11,t:1},
				{l:11,t:2},
				{l:11,t:3},
				{l:12,t:3},
				{l:13,t:3},
				{l:14,t:3},
				{l:15,t:3},
				{l:16,t:3},
				{l:17,t:3},
				{l:18,t:3},
				{l:19,t:3},
				{l:19,t:2},
				{l:19,t:1},
				{l:19,t:0},
				{l:20,t:0},
				{l:21,t:0},
				{l:22,t:0},
				{l:23,t:0},
				{l:24,t:0},
				{l:25,t:0},
				{l:26,t:0},
				{l:27,t:0},
				{l:28,t:0},
				{l:29,t:0},		
				{l:1,t:14},
				{l:2,t:14},
				{l:3,t:14},
				{l:4,t:14},
				{l:5,t:14},
				{l:6,t:14},
				{l:7,t:14},
				{l:8,t:14},
				{l:9,t:14},
				{l:10,t:14},
				{l:11,t:14},
				{l:19,t:14},
				{l:20,t:14},
				{l:21,t:14},
				{l:22,t:14},
				{l:23,t:14},
				{l:24,t:14},
				{l:25,t:14},
				{l:26,t:14},
				{l:27,t:14},
				{l:28,t:14},
				{l:29,t:14},
				{l:29,t:13},
				{l:29,t:12},
				{l:29,t:11},
				{l:29,t:10},
				{l:29,t:4},
				{l:29,t:3},
				{l:29,t:2},
				{l:29,t:1}
			],
			8:[
				{l:0,t:0},
				{l:1,t:0},
				{l:2,t:0},
				{l:3,t:0},
				{l:4,t:0},
				{l:5,t:0},
				{l:6,t:0},
				{l:7,t:0},
				{l:8,t:0},
				{l:9,t:0},
				{l:10,t:0},
				{l:11,t:0},
				{l:12,t:0},
				{l:13,t:0},
				{l:14,t:0},
				{l:15,t:0},
				{l:16,t:0},
				{l:17,t:0},
				{l:18,t:0},
				{l:19,t:0},
				{l:20,t:0},
				{l:21,t:0},
				{l:22,t:0},
				{l:23,t:0},
				{l:24,t:0},
				{l:25,t:0},
				{l:26,t:0},
				{l:27,t:0},
				{l:28,t:0},
				{l:29,t:0},
				{l:29,t:1},
				{l:29,t:2},
				{l:29,t:3},
				{l:29,t:4},
				{l:29,t:5},
				{l:29,t:6},
				{l:29,t:7},
				{l:29,t:8},
				{l:29,t:9},
				{l:29,t:10},
				{l:29,t:11},
				{l:29,t:12},
				{l:29,t:13},
				{l:29,t:14},
				{l:28,t:14},
				{l:27,t:14},
				{l:26,t:14},
				{l:25,t:14},
				{l:24,t:14},
				{l:23,t:14},
				{l:22,t:14},
				{l:21,t:14},
				{l:20,t:14},
				{l:19,t:14},
				{l:18,t:14},
				{l:17,t:14},
				{l:16,t:14},
				{l:15,t:14},
				{l:14,t:14},
				{l:13,t:14},
				{l:12,t:14},
				{l:11,t:14},
				{l:10,t:14},
				{l:9,t:14},
				{l:8,t:14},
				{l:7,t:14},
				{l:6,t:14},
				{l:5,t:14},
				{l:4,t:14},
				{l:3,t:14},
				{l:2,t:14},
				{l:1,t:14},
				{l:0,t:14},
				{l:0,t:13},
				{l:0,t:12},
				{l:0,t:11},
				{l:0,t:10},
				{l:0,t:9},
				{l:0,t:8},
				{l:0,t:7},
				{l:0,t:6},
				{l:0,t:5},
				{l:0,t:4},
				{l:0,t:3},
				{l:0,t:2},
				{l:0,t:1},
				{l:2,t:2},
				{l:2,t:3},
				{l:2,t:4},
				{l:2,t:5},
				{l:2,t:9},
				{l:2,t:10},
				{l:2,t:11},
				{l:2,t:12},
				{l:4,t:2},
				{l:5,t:2},
				{l:6,t:2},
				{l:7,t:2},
				{l:8,t:2},
				{l:9,t:2},
				{l:10,t:2},
				{l:11,t:2},
				{l:12,t:2},
				{l:13,t:2},
				{l:15,t:2},
				{l:16,t:2},
				{l:17,t:2},
				{l:18,t:2},
				{l:19,t:2},
				{l:20,t:2},
				{l:21,t:2},
				{l:22,t:2},
				{l:23,t:2},
				{l:24,t:2},
				{l:25,t:2},
				{l:27,t:2},
				{l:27,t:3},
				{l:27,t:4},
				{l:27,t:5},
				{l:27,t:9},
				{l:27,t:10},
				{l:27,t:11},
				{l:27,t:12},
				{l:25,t:12},
				{l:24,t:12},
				{l:23,t:12},
				{l:22,t:12},
				{l:21,t:12},
				{l:20,t:12},
				{l:19,t:12},
				{l:18,t:12},
				{l:17,t:12},
				{l:16,t:12},
				{l:14,t:12},
				{l:13,t:12},
				{l:12,t:12},
				{l:11,t:12},
				{l:10,t:12},
				{l:9,t:12},
				{l:8,t:12},
				{l:7,t:12},
				{l:6,t:12},
				{l:5,t:12},
				{l:4,t:12},			
				{l:4,t:4},
				{l:4,t:5},			
				{l:4,t:7},
				{l:4,t:8},
				{l:4,t:9},
				{l:4,t:10},
				{l:5,t:10},
				{l:6,t:10},
				{l:7,t:10},
				{l:8,t:10},
				{l:9,t:10},
				{l:10,t:10},
				{l:11,t:10},
				{l:12,t:10},			
				{l:14,t:10},
				{l:15,t:10},
				{l:16,t:10},
				{l:17,t:10},
				{l:18,t:10},
				{l:19,t:10},
				{l:20,t:10},
				{l:21,t:10},
				{l:22,t:10},
				{l:23,t:10},
				{l:24,t:10},
				{l:25,t:10},
				{l:25,t:9},			
				{l:25,t:7},
				{l:25,t:6},
				{l:25,t:5},
				{l:25,t:4},			
				{l:5,t:4},
				{l:6,t:4},
				{l:7,t:4},
				{l:8,t:4},
				{l:9,t:4},
				{l:10,t:4},
				{l:11,t:4},
				{l:12,t:4},
				{l:13,t:4},
				{l:14,t:4},
				{l:15,t:4},
				{l:17,t:4},
				{l:18,t:4},
				{l:19,t:4},
				{l:20,t:4},
				{l:21,t:4},
				{l:22,t:4},
				{l:23,t:4},
				{l:24,t:4}
			],
			length:8,
			guanCount:1,
			foodCount:0
		};
		function createWall(){
			for(var i=0;i<map[map.guanCount].length;i++){
				var oLi=document.createElement('li');
				oLi.style.left=map[map.guanCount][i].l*20+'px';
				oLi.style.top=map[map.guanCount][i].t*20+'px';
				oSnake.appendChild(oLi);
			}
		}
		//设置蛇的位置
		function setPos(obj){
			obj.elem.style.left=obj.l*20+'px';
			obj.elem.style.top=obj.t*20+'px';
		}
		//开始游戏
		function startFn(){
			oSnake.innerHTML='';
			aSnake=[];
			dir='l';
			createSnake();
			(gameMode==0||gameMode==2)&&createFood();
			gameMode==1&&(createFood(10,true),randomRount(createFood.node));
			gameMode==2&&createWall();
			var upDir='';	//保存蛇头上一个方向
			document.onkeydown=function(ev){	//键盘控制蛇方向
				var e=ev||event;
				switch(e.keyCode){
					case 37:		//左
						dir=(dir=='r')?'r':'l';
						break;
					case 38:		//上
						dir=(dir=='b')?'b':'t';	
						break;
					case 39:		//右
						dir=(dir=='l')?'l':'r';	
						break;
					case 40:		//下
						dir=(dir=='t')?'t':'b';	
						break;
				}
				aSnake[0].dir=dir;
				if(dir!=upDir){		//快速按键盘换方向
					clearInterval(timer);
					timer=setInterval(lesgo,iSpeed);
					lesgo();
				}
				upDir=dir;
			};
		}
		//游戏结束
		function gameOver(str){
			var oDiv=document.createElement('div');
			oDiv.innerHTML='<h4>'+str+'</h4><p>得分：'+aSpan.innerHTML+'</p><button>重新开始</button><button>选择模式</button>';
			oDiv.className='game-over';
			oPanel.appendChild(oDiv);
			
			clearInterval(timer);
			document.onkeydown=null;
			aSpan.innerHTML='0';
			iNow=0;
			map.guanCount=1;
			map.foodCount=0;
			
			var aButton=oDiv.getElementsByTagName('button');
			aButton[0].onclick=function(){
				oPanel.removeChild(oDiv);
				startFn();
			};
			aButton[1].onclick=function(){
				oPanel.removeChild(oDiv);
				oOption.style.display='block';
			};
		}
		//主要函数
		function lesgo(){
			//最后一节信息
			var iEndPos={l:aSnake[aSnake.length-1].l,t:aSnake[aSnake.length-1].t,dir:aSnake[aSnake.length-1].dir};
			//把前一节信息给后一节
			for(var i=aSnake.length-1;i>0;i--){
				aSnake[i].l=aSnake[i-1].l;
				aSnake[i].t=aSnake[i-1].t;
				aSnake[i].dir=aSnake[i-1].dir;
			}
			//判断往哪里走
			switch(dir){
				case 'l':
					aSnake[0].l--;
					break;
				case 'r':
					aSnake[0].l++;
					break;			
				case 't':
					aSnake[0].t--;
					break;
				case 'b':
					aSnake[0].t++;
					break;
			}
			//让蛇跑起来
			for(var i=0;i<aSnake.length;i++){		
				setPos(aSnake[i]);
			}
			//改蛇头蛇尾方向
			aSnake[0].elem.className='st st'+dir;
			aSnake[aSnake.length-1].elem.className='sw sw'+aSnake[aSnake.length-1].dir;
			//关卡模式过墙
			if(gameMode==2){
				if(aSnake[0].l==-1){
					aSnake[0].l=29;
				}else if(aSnake[0].t==-1){
					aSnake[0].t=14;
				}else if(aSnake[0].l==30){
					aSnake[0].l=0;
				}else if(aSnake[0].t==15){
					aSnake[0].t=0;
				}
				setPos(aSnake[0]);
			}
			//吃
			for(var i=0;i<createFood.node.length;i++){
				if(aSnake[0].l==createFood.node[i].l&&aSnake[0].t==createFood.node[i].t){
					aSnake.splice(aSnake.length-1,0,createFood.node[i]);
					createFood.node[i].elem.className='';
					aSnake[aSnake.length-2].l=aSnake[aSnake.length-1].l;
					aSnake[aSnake.length-2].t=aSnake[aSnake.length-1].t;
					aSnake[aSnake.length-2].dir=aSnake[aSnake.length-1].dir;
					aSnake[aSnake.length-1].l=iEndPos.l;
					aSnake[aSnake.length-1].t=iEndPos.t;
					aSnake[aSnake.length-1].elem.className='sw sw'+iEndPos.dir;
					setPos(aSnake[aSnake.length-2]);
					setPos(aSnake[aSnake.length-1]);
					(gameMode==0||gameMode==2)&&(aSpan.innerHTML=aSetSelect[gameMode].value*10*++iNow);
					//经典模式过关
					if(gameMode==0&&iNow==row*col-num){
						gameOver('游戏过关!!');
						return false;
					}
					//算数模式
					if(gameMode==1&&aSnake.length==8){
						if(aSnake[aSnake.length-3].elem.innerHTML=='='){
							switch(aSnake[aSnake.length-5].elem.innerHTML){
								case '+':
									if(Number(aSnake[aSnake.length-6].elem.innerHTML)+Number(aSnake[aSnake.length-4].elem.innerHTML)==Number(aSnake[aSnake.length-2].elem.innerHTML)){
										aSpan.innerHTML=Number(aSpan.innerHTML)+Number(aSnake[aSnake.length-2].elem.innerHTML);
									}
									break;
								case '-':
									if(Number(aSnake[aSnake.length-6].elem.innerHTML)-Number(aSnake[aSnake.length-4].elem.innerHTML)==Number(aSnake[aSnake.length-2].elem.innerHTML)){
										aSpan.innerHTML=Number(aSpan.innerHTML)+Number(aSnake[aSnake.length-2].elem.innerHTML);
									}
									break;
							}
						}
						clearInterval(timer);
						document.onkeydown=null;
						startFn();
					}
					//关卡模式过关
					if(gameMode==2&&++map.foodCount==20){
						if(map.guanCount==map.length){
							gameOver('游戏过关!!');
						}else{					
							clearInterval(timer);
							document.onkeydown=null;
							map.guanCount++;
							map.foodCount=0;
							oSnake.innerHTML='第'+map.guanCount+'关';
							oSnake.style.width='100px';
							oSnake.style.lineHeight=row*20+'px';
							animate(oSnake,{width:col*20},1000,'easeIn',function(){
								startFn();
							});
						}
						return false;
					}
					//生产食物
					(gameMode==0||gameMode==2)&&createFood();
				}
			}
			//非关卡模式撞墙死
			if(gameMode==0||gameMode==1){
				if(aSnake[0].l<0||aSnake[0].t<0||aSnake[0].l==col||aSnake[0].t==row){
					gameOver('游戏结束!!');
					return false;
				}
			}		
			//撞自己死
			for(var i=1;i<aSnake.length;i++){			
				if(aSnake[0].l==aSnake[i].l&&aSnake[0].t==aSnake[i].t){
					gameOver('游戏结束!!');
					return false;
				}
			}
			//撞障碍物死(关卡模式)
			if(gameMode==2){
				for(var i=0;i<map[map.guanCount].length;i++){
					if(aSnake[0].l==map[map.guanCount][i].l&&aSnake[0].t==map[map.guanCount][i].t){
						gameOver('游戏结束!!');
						break;
					}
				}			
			}
		}
		//随机颜色值
		function randomColor(){
			var str=Math.ceil(Math.random()*16777215).toString(16);
			while(str.length<6){
				str='0'+str;
			}
			return str;
		}
		//贪吃蛇拖拽
		Drag({
			id:$('#panel'),
			xz:true,
			resize:true,
			fnDown:function(This){
				This.css('z-index',++zIndex);
			}
		});
		
		//获取class
		function getClass(parent,sClass,tag){
			var arr=[];
			if(parent.getElementsByClassName){
				arr=parent.getElementsByClassName(sClass);
			}else{
				var node=parent.getElementsByTagName(tag);
				for(var i=0;i<node.length;i++){
					if(new RegExp('\\b'+sClass+'\\b').test(node[i].className)){
						arr.push(node[i]);
					}				
				}
			}
			return arr;
		}
		//获取style
		function getStyle(obj,attr){
			if(obj.currentStyle){
				return obj.currentStyle[attr];
			}else{
				return getComputedStyle(obj,false)[attr];
			}
		}
		//运动函数
		function animate(obj,json,times,fx,fn){
			var iCur={};
			for(var attr in json){
				iCur[attr]=0;
				if(attr=='opacity'){
					iCur[attr]=Math.round(getStyle(obj,attr)*100);
				}else{
					iCur[attr]=parseInt(getStyle(obj,attr));
				}
			}
			var startTime=now();
			clearInterval(obj.timer);
			obj.timer=setInterval(function(){
				
				var changeTime=now();
				var t=times-Math.max(0,startTime-changeTime+times);
				
				for(var attr in json){
					var value=Tween[fx](t,iCur[attr],json[attr]-iCur[attr],times);
					if(attr=='opacity'){
						obj.style.opacity=value/100;
						obj.style.filter='alpha(opacity:'+value+')';
					}else{
						obj.style[attr]=value+'px';
					}
				}
				if(t==times){
					clearInterval(obj.timer);
					if(fn){
						fn.call(obj);
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
			}
		}
	}
		
	//右侧隐藏栏
	(function($){
		var $rightBar=$('#right-bar');
		var $rightBarTog=$rightBar.find('.right-bar-tog');
		var $rightBarCon=$rightBar.find('.right-bar-con');
		var $rightBarScroll=$rightBar.find('.right-bar-scroll');
		var $rightBarList=$rightBar.find('.right-bar-list');
		var $rightBarTop=$rightBar.find('.right-bar-top');
		var $rightBarBot=$rightBar.find('.right-bar-bot');
		var $Bar=true;		
		$rightBarTog.on('click',function(){
			$Bar?$rightBar.stop().animate({right:0},400,'bounceOut'):$rightBar.stop().animate({right:-80},400,'bounceOut');
			$Bar=!$Bar;
		});
		//滚动区域内容
		$rightBarList.on('mousedown','li',function(e){
			var This=$(this);
			var $tempNode=$('<div class="tooltemp1"></div>');
			$tempNode.css({
				top:This.offset().top+3,
				background:This.css('background')
			});
			$desktop.append($tempNode);
			var sbX=e.pageX;
			var disX=sbX-$tempNode.offset().left;
			var disY=e.pageY-$tempNode.offset().top;
			This[0].setCapture&&This[0].setCapture();
			$document.on('mousemove',function(e){
				$tempNode.css('left',e.pageX-disX).css('top',e.pageY-disY);
			}).on('mouseup',function(e){
				$(this).off('mousemove mouseup');
				This[0].releaseCapture&&This[0].releaseCapture();
				$tempNode.remove();
				if(sbX-e.pageX<78)return;//是否拖出右侧边栏区域				
				var l=e.pageX-150;
				var t=e.pageY-150;
				if(e.pageX-150<0){
					l=0;
				}else if(e.pageX-150>$window.width()-300){
					l=$window.width()-300;
				}
				if(e.pageY-150<0){
					t=0;
				}else if(e.pageY-150>$window.height()-300){
					t=$window.height()-300;
				}
				if(!$('#clock')[0]&&This.attr('now')=='shizhong'){//创建时钟
					$tool.append(clockHtml());
					$('#clock').css({
						left:l,
						top:t
					});
					clockJs();
				}
				if(!$('#puzzle_wrap')[0]&&This.attr('now')=='pintu'){//创建拼图
					$tool.append(puzzleHtml());
					$('#puzzle_wrap').css({
						left:l,
						top:t
					});
					puzzleJs();
				}
				if(!$('#rili')[0]&&This.attr('now')=='rili'){//创建日历
					$tool.append(riliHtml());
					$('#rili').css({
						left:l,
						top:t
					});
					riliJs();
				}
				if(!$('#panel')[0]&&This.attr('now')=='tanchishe'){//创建贪吃蛇
					$tool.append(snakeHtml());
					$('#panel').css({
						left:l,
						top:t
					});
					snakeJs();
				}
			});
			return false;
		});
		//判断是否需要滚动条
		if($rightBarList.outerHeight()<$rightBarCon.outerHeight())return;
		//设置滚动条高度
		$rightBarScroll.height(($rightBarCon.outerHeight()*$rightBarCon.outerHeight())/$rightBarList.outerHeight());
		$rightBarScroll.height()<=40 && $rightBarScroll.height(40);
		//获取滚动比例
		var scale=($rightBarList.outerHeight()-$rightBarCon.outerHeight())/($rightBarCon.outerHeight()-$rightBarScroll.height());
		//滚动条拖拽
		$rightBarScroll.on('mousedown',function(e){
			var This=$(this);
			var disY=e.pageY-This.position().top;
			This[0].setCapture&&This[0].setCapture();
			$document.on('mousemove',function(e){
				var y=e.pageY-disY;
				setTop(y);
			}).on('mouseup',function(){
				$(this).off('mousemove mouseup');
				This[0].releaseCapture&&This[0].releaseCapture();
			});;
			return false;
		});
		function setTop(y){
			if(y<=0){
				y=0;
			}else if(y>=$rightBarCon.outerHeight()-$rightBarScroll.height()){
				y=$rightBarCon.outerHeight()-$rightBarScroll.height();
			}
			$rightBarScroll.css('top',y);
			$rightBarList.css('top',-y*scale);
		}
		var $wheel=true;
		$rightBarCon.on('mousewheel DOMMouseScroll',function(e){
			$wheel=e.originalEvent.wheelDelta?e.originalEvent.wheelDelta>0:e.originalEvent.detail<0;
			var t=$wheel?$rightBarScroll.position().top-100:$rightBarScroll.position().top+100;
			setTop(t)
			return false;
		});
		$rightBarTop.on('click',function(){
			var t=$rightBarScroll.position().top-100;
			setTop(t);
		});
		$rightBarBot.on('click',function(){
			var t=$rightBarScroll.position().top+100;
			setTop(t);
		});
	})(jQuery);
	
	//底部开始菜单栏
	(function($){
		var iNow=0;
		var off=true;
		$startToorL.on('click',function(){
			lesGo(false);
		});
		$startToorR.on('click',function(){
			lesGo(true);
		});
		function lesGo(obj){
			if(off){
				off=false;
				if(obj){					
					if(-$startToorCon.position().left>=$startToorConWid-$startToorMain.width()){
						off=true;
						return;
					}
					iNow++;
				}else{
					if($startToorCon.position().left>=0){
						off=true;
						return;
					}
					iNow--;
				}
				$startToorCon.animate({left:-147*iNow},200,function(){off=true;});
			}	
		}
		//底部对应图标点击
		$startToorCon.on('click','li',function(){
			var $id=$(this).attr('id').replace(/a\d+/g,'');
			var $liEle=$('#'+$id);
			if($liEle.css('visibility')=='visible'){
				$liEle.css('visibility','hidden');
			}else{
				$liEle.css('visibility','visible');
			}
		});
	})(jQuery);
	
	//网页图片进度条
	(function($){
		var $progressBar=$('#progress_bar');
		$progressBar.on('contextmenu',function(){return false;});
		var $progressBarSpan=$progressBar.find('span');
		var $desktop=$('#desktop');
		var $imgArr=['img/1.png','img/3.png','img/6.png','img/4.png','img/5.png','img/menu-right.gif','img/bg_close.png','img/start.png','img/7.png','img/8.png','img/9.png','img/10.png','img/big-bg3.jpg'];
		var tempImg=new Image();
		var iNow=0;
		function imgLoad(){
			tempImg.onload=function(){				
				iNow++;
				if(iNow<$imgArr.length){
					imgLoad();
				}
				$progressBarSpan.html(parseInt(iNow/$imgArr.length*100)+'%');
				if(iNow==$imgArr.length){
					$progressBar.css('display','none');
					chuShiData(66);
				}
			}
			tempImg.src=$imgArr[iNow];
			tempImg.onerror=function(){
				alert('部分图片加载失败，请确定直接进入网站!!');
				$progressBar.css('display','none');
				chuShiData(66);
			}
		}
		imgLoad();
	})(jQuery);
});
