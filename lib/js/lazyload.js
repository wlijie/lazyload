/**
 * 基于jQuery或者zeptoJS的惰性加载
 */

var lazyload = {
	init: function(opt) {
		var that = this;
		var op = {
			anim: true
		};
		// 合并对象，已有的{anim:true}+用户自定义对象。也就是op = op + opt
		$.extend(op, opt);
		// 调用lazyload.img.init(op)函数
		that.img.init(op);
	},
	img: {
		init: function(n) {
			var that = this;
			var throttle = function(fn, delay, immediate, debounce) {
				var curr = +new Date(), //当前事件
					last_call = 0,
					last_exec = 0,
					timer = null,
					diff, //时间差
					context, //上下文
					args,
					exec = function() {
						last_exec = curr;
						fn.apply(context, args);
					};
				return function() {
					curr = +new Date();
					context = this,
						args = arguments,
						diff = curr - (debounce ? last_call : last_exec) - delay;
					clearTimeout(timer);
					if (debounce) {
						if (immediate) {
							timer = setTimeout(exec, delay);
						} else if (diff >= 0) {
							exec();
						}
					} else {
						if (diff >= 0) {
							exec();
						} else if (immediate) {
							timer = setTimeout(exec, -diff);
						}
					}
					last_call = curr;
				}
			};
			var debounce = function(fn, delay, immediate) {
				return throttle(fn, delay, immediate, true);
			};
			var scrollRun = debounce(function() {
				$('img.lazy').each(function(index, node) {
					var $this = $(this);
					//不在窗口或者已经加载完成
					if (!inViewport($this) || $this.attr('loaded')) {
						return;
					}
					if (!$this.attr('dataimg')) {
						return;
					}
					//替换图
					act($this);
				})
			}, 150, true);

			// 要加载的图片是不是在指定窗口内
			var inViewport = function(el) {
				var top = window.pageYOffset
				var left = window.pageXOffset
				var btm = top + window.innerHeight
				var rt = left + window.innerWidth
				var elTop = $(el).offset().top;
				var elBtm = elTop + $(el).height();
				var elLeft = $(el).offset().left;
				var elRt = elLeft + $(el).width();
				var tlRun = function() {
					return elTop >= top && elTop <= btm && elLeft >= left && elLeft <= rt;
				}
				var rbRun = function() {
					return elBtm >= top && elBtm <= btm && elRt >= left && elRt <= rt;
				}
				return tlRun() || rbRun();
			}

			// 展示图片
			var act = function(_self) {
					var img = new Image(),
						original = _self.attr('dataimg');
						if(document.body.clientWidth<700){
							original=original.substring(0,original.length-4)+"@1x.jpg"
						}
						// console.log(original);
					// 图片请求完成后的事件，把dataimg指定的图片，放到src里面，浏览器显示
					img.onload = function() {
							_self.attr('src', original).removeClass('lazy').removeAttr('dataimg');
							n.anim && _self.css({
								opacity: .2
							}).animate({
								opacity: 1
							}, 280);
						}
						/*console.log(original)*/
					original && (img.src = original);
					_self.attr('loaded', true);
				}
				// 滚动事件里判断，加载图片
			$(window).bind('scroll', function() {
				scrollRun();
			}).trigger('scroll');
		}
	}
};
$(function() {
		lazyload.init()
	})
	/*window.onload = function(){
		lazyload.init()
	}*/