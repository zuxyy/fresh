// page init
jQuery(function(){
	initLayout();
});

// page layout init
function initLayout() {
	jQuery('.main-content').fixedSlideBlock({
		slideBlock: '#nav'
		, extraHeight: 40
	});
	jQuery('#content').fixedSlideBlock({
		slideBlock: '#fixed-example2',
		positionType: 'absolute'
	});
}

// Fixed Slide Block plugin
;(function(){
	jQuery.fn.fixedSlideBlock = function(options) {
		var options = jQuery.extend({
			slideBlock: '#sidebar',
			alwaysStick: true,
			animDelay: 100,
			animSpeed: 250,
			extraHeight: 0,
			positionType: 'auto' // 'fixed', 'absolute'
		}, options);

		return this.each(function(){
			var win = jQuery(window);
			var holder = jQuery(this);
			var fixedBlock = holder.find(options.slideBlock);
			var positionType = options.positionType, timer, d, stayStatic, prevHeight;

			// skip if block does not exists
			if(!fixedBlock.length) {
				return;
			}

			// detect positioning type
			if(positionType === 'auto') {
				positionType = !isFixedPositionSupported || isTouchDevice ? 'absolute' : 'fixed';
			}

			// recalculate all values
			function recalculateDimensions() {
				var origStyle = fixedBlock.attr('style');
				fixedBlock.css({position:'',left:'',top:''});
				d = {
					winHeight: win.height(),
					scrollTop: win.scrollTop(),
					scrollLeft: win.scrollLeft(),
					holderOffset: holder.offset(),
					holderHeight: holder.height(),
					blockPosition: fixedBlock.position(),
					blockOffset: fixedBlock.offset(),
					blockHeight: fixedBlock.outerHeight(true)
				};
				fixedBlock.attr('style',origStyle);

				// check for static position
				if(prevHeight !== d.holderHeight) {
					prevHeight = d.holderHeight;
					stayStatic = checkStaticPosition();
				}
			}

			// dont fix block if content too small
			function checkStaticPosition() {
				var origStyle = fixedBlock.attr('style');
				var origHeight = d.holderHeight;
				fixedBlock.css({position:'absolute'});
				var newHeight = holder.height();
				if(newHeight < origHeight) {
					fixedBlock.css({position:'', top:'', left:''});
					return true;
				} else {
					fixedBlock.attr('style',origStyle);
				}
			}

			function positionFixed() {
				if(d.scrollTop > d.blockOffset.top - options.extraHeight) {
					// check that block fits in holder
					if(d.scrollTop + options.extraHeight - d.holderOffset.top + d.blockHeight > d.holderHeight) {
						fixedBlock.css({position:'absolute', left: d.blockPosition.left, top: d.blockPosition.top + d.holderHeight - d.blockHeight - (d.blockOffset.top - d.holderOffset.top)});
					}
					// set default fixed position
					else {
						fixedBlock.css({position:'fixed', left: d.blockOffset.left - d.scrollLeft, top: options.extraHeight});
					}
				} else {
					// disable sticking
					fixedBlock.css({position:'', top:'', left:''});
				}
			}

			function positionAbsolute(noAnimation) {
				// default top position
				var top = d.blockPosition.top;
				if(d.scrollTop > d.blockOffset.top - options.extraHeight) {
					// check that block fits in holder
					if(d.scrollTop + options.extraHeight - d.holderOffset.top + d.blockHeight > d.holderHeight) {
						top = d.blockPosition.top + d.holderHeight - d.blockHeight - (d.blockOffset.top - d.holderOffset.top);
					}
					// set fixed position
					else {
						top = d.blockPosition.top + d.scrollTop - d.blockOffset.top + options.extraHeight;
					}
				}
				fixedBlock.stop().css({position:'absolute', left: d.blockPosition.left});

				// change block position animation
				if(noAnimation === true) {
					fixedBlock.css({top: top});
				} else {
					fixedBlock.animate({top: top},{duration: options.animSpeed});
				}
			}

			// reposition function
			function reposition(e) {
				// detect behavior
				var noAnimation = (e === true);

				// recalculate size and offsets
				recalculateDimensions();
				if(stayStatic) {
					return;
				}

				// disable when window is smaller then fixed block
				if(!options.alwaysStick && d.winHeight < d.blockHeight) {
					fixedBlock.css({position:'', top:'', left:''});
					return;
				}

				// call position handler
				if(positionType === 'fixed') {
					positionFixed();
				} else {
					if(noAnimation) {
						positionAbsolute(noAnimation);
					}
					clearTimeout(timer);
					timer = setTimeout(positionAbsolute, options.animDelay);
				}
			}

			// add event handlers
			setTimeout(function() {
				reposition(true);
				win.bind('scroll', reposition);
				win.bind('resize orientationchange', function(){
					reposition(true);
				});
			},10);
		});
	};

	// detect device type
	var isTouchDevice = (function() {
		try {
			return ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
		} catch (e) {
			return false;
		}
	}());

	// detect position fixed support
	var isFixedPositionSupported = (function(){
		var supported = false, container = document.createElement('div'), fixedBlock = document.createElement('div');
		container.style.cssText = 'position:absolute;top:9px;left:9px;width:100px;height:100px;background:red;';
		fixedBlock.style.cssText = 'position:fixed;top:7px;width:1px;height:1px;';
		container.appendChild(fixedBlock);
		document.documentElement.insertBefore(container, document.documentElement.childNodes[0]);
		supported = (fixedBlock.offsetTop == 7 || fixedBlock.offsetTop == -2 || (!fixedBlock.offsetWidth && typeof document.documentElement.style.maxHeight !== 'undefined'));
		document.documentElement.removeChild(container);
		fixedBlock = container = null;
		return supported;
	}());
}());