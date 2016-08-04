!function(factory){"function"==typeof define&&define.amd&&define.amd.jQuery?define(["jquery"],factory):factory("undefined"!=typeof module&&module.exports?require("jquery"):jQuery)}(function($){"use strict";function init(options){return!options||void 0!==options.allowPageScroll||void 0===options.swipe&&void 0===options.swipeStatus||(options.allowPageScroll=NONE),void 0!==options.click&&void 0===options.tap&&(options.tap=options.click),options||(options={}),options=$.extend({},$.fn.swipe.defaults,options),this.each(function(){var $this=$(this),plugin=$this.data(PLUGIN_NS);plugin||(plugin=new TouchSwipe(this,options),$this.data(PLUGIN_NS,plugin))})}function TouchSwipe(element,options){function touchStart(jqEvent){if(!(getTouchInProgress()||$(jqEvent.target).closest(options.excludedElements,$element).length>0)){var ret,event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent,touches=event.touches,evt=touches?touches[0]:event;return phase=PHASE_START,touches?fingerCount=touches.length:options.preventDefaultEvents!==!1&&jqEvent.preventDefault(),distance=0,direction=null,currentDirection=null,pinchDirection=null,duration=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,pinchDistance=0,maximumsMap=createMaximumsData(),cancelMultiFingerRelease(),createFingerData(0,evt),!touches||fingerCount===options.fingers||options.fingers===ALL_FINGERS||hasPinches()?(startTime=getTimeStamp(),2==fingerCount&&(createFingerData(1,touches[1]),startTouchesDistance=endTouchesDistance=calculateTouchesDistance(fingerData[0].start,fingerData[1].start)),(options.swipeStatus||options.pinchStatus)&&(ret=triggerHandler(event,phase))):ret=!1,ret===!1?(phase=PHASE_CANCEL,triggerHandler(event,phase),ret):(options.hold&&(holdTimeout=setTimeout($.proxy(function(){$element.trigger("hold",[event.target]),options.hold&&(ret=options.hold.call($element,event,event.target))},this),options.longTapThreshold)),setTouchInProgress(!0),null)}}function touchMove(jqEvent){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent;if(phase!==PHASE_END&&phase!==PHASE_CANCEL&&!inMultiFingerRelease()){var ret,touches=event.touches,evt=touches?touches[0]:event,currentFinger=updateFingerData(evt);if(endTime=getTimeStamp(),touches&&(fingerCount=touches.length),options.hold&&clearTimeout(holdTimeout),phase=PHASE_MOVE,2==fingerCount&&(0==startTouchesDistance?(createFingerData(1,touches[1]),startTouchesDistance=endTouchesDistance=calculateTouchesDistance(fingerData[0].start,fingerData[1].start)):(updateFingerData(touches[1]),endTouchesDistance=calculateTouchesDistance(fingerData[0].end,fingerData[1].end),pinchDirection=calculatePinchDirection(fingerData[0].end,fingerData[1].end)),pinchZoom=calculatePinchZoom(startTouchesDistance,endTouchesDistance),pinchDistance=Math.abs(startTouchesDistance-endTouchesDistance)),fingerCount===options.fingers||options.fingers===ALL_FINGERS||!touches||hasPinches()){if(direction=calculateDirection(currentFinger.start,currentFinger.end),currentDirection=calculateDirection(currentFinger.last,currentFinger.end),validateDefaultEvent(jqEvent,currentDirection),distance=calculateDistance(currentFinger.start,currentFinger.end),duration=calculateDuration(),setMaxDistance(direction,distance),ret=triggerHandler(event,phase),!options.triggerOnTouchEnd||options.triggerOnTouchLeave){var inBounds=!0;if(options.triggerOnTouchLeave){var bounds=getbounds(this);inBounds=isInBounds(currentFinger.end,bounds)}!options.triggerOnTouchEnd&&inBounds?phase=getNextPhase(PHASE_MOVE):options.triggerOnTouchLeave&&!inBounds&&(phase=getNextPhase(PHASE_END)),phase!=PHASE_CANCEL&&phase!=PHASE_END||triggerHandler(event,phase)}}else phase=PHASE_CANCEL,triggerHandler(event,phase);ret===!1&&(phase=PHASE_CANCEL,triggerHandler(event,phase))}}function touchEnd(jqEvent){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent,touches=event.touches;if(touches){if(touches.length&&!inMultiFingerRelease())return startMultiFingerRelease(event),!0;if(touches.length&&inMultiFingerRelease())return!0}return inMultiFingerRelease()&&(fingerCount=fingerCountAtRelease),endTime=getTimeStamp(),duration=calculateDuration(),didSwipeBackToCancel()||!validateSwipeDistance()?(phase=PHASE_CANCEL,triggerHandler(event,phase)):options.triggerOnTouchEnd||options.triggerOnTouchEnd===!1&&phase===PHASE_MOVE?(options.preventDefaultEvents!==!1&&jqEvent.preventDefault(),phase=PHASE_END,triggerHandler(event,phase)):!options.triggerOnTouchEnd&&hasTap()?(phase=PHASE_END,triggerHandlerForGesture(event,phase,TAP)):phase===PHASE_MOVE&&(phase=PHASE_CANCEL,triggerHandler(event,phase)),setTouchInProgress(!1),null}function touchCancel(){fingerCount=0,endTime=0,startTime=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,cancelMultiFingerRelease(),setTouchInProgress(!1)}function touchLeave(jqEvent){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent;options.triggerOnTouchLeave&&(phase=getNextPhase(PHASE_END),triggerHandler(event,phase))}function removeListeners(){$element.unbind(START_EV,touchStart),$element.unbind(CANCEL_EV,touchCancel),$element.unbind(MOVE_EV,touchMove),$element.unbind(END_EV,touchEnd),LEAVE_EV&&$element.unbind(LEAVE_EV,touchLeave),setTouchInProgress(!1)}function getNextPhase(currentPhase){var nextPhase=currentPhase,validTime=validateSwipeTime(),validDistance=validateSwipeDistance(),didCancel=didSwipeBackToCancel();return!validTime||didCancel?nextPhase=PHASE_CANCEL:!validDistance||currentPhase!=PHASE_MOVE||options.triggerOnTouchEnd&&!options.triggerOnTouchLeave?!validDistance&&currentPhase==PHASE_END&&options.triggerOnTouchLeave&&(nextPhase=PHASE_CANCEL):nextPhase=PHASE_END,nextPhase}function triggerHandler(event,phase){var ret,touches=event.touches;return(didSwipe()||hasSwipes())&&(ret=triggerHandlerForGesture(event,phase,SWIPE)),(didPinch()||hasPinches())&&ret!==!1&&(ret=triggerHandlerForGesture(event,phase,PINCH)),didDoubleTap()&&ret!==!1?ret=triggerHandlerForGesture(event,phase,DOUBLE_TAP):didLongTap()&&ret!==!1?ret=triggerHandlerForGesture(event,phase,LONG_TAP):didTap()&&ret!==!1&&(ret=triggerHandlerForGesture(event,phase,TAP)),phase===PHASE_CANCEL&&touchCancel(event),phase===PHASE_END&&(touches?touches.length||touchCancel(event):touchCancel(event)),ret}function triggerHandlerForGesture(event,phase,gesture){var ret;if(gesture==SWIPE){if($element.trigger("swipeStatus",[phase,direction||null,distance||0,duration||0,fingerCount,fingerData,currentDirection]),options.swipeStatus&&(ret=options.swipeStatus.call($element,event,phase,direction||null,distance||0,duration||0,fingerCount,fingerData,currentDirection),ret===!1))return!1;if(phase==PHASE_END&&validateSwipe()){if(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),$element.trigger("swipe",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipe&&(ret=options.swipe.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection),ret===!1))return!1;switch(direction){case LEFT:$element.trigger("swipeLeft",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeLeft&&(ret=options.swipeLeft.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case RIGHT:$element.trigger("swipeRight",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeRight&&(ret=options.swipeRight.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case UP:$element.trigger("swipeUp",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeUp&&(ret=options.swipeUp.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case DOWN:$element.trigger("swipeDown",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeDown&&(ret=options.swipeDown.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection))}}}if(gesture==PINCH){if($element.trigger("pinchStatus",[phase,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),options.pinchStatus&&(ret=options.pinchStatus.call($element,event,phase,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData),ret===!1))return!1;if(phase==PHASE_END&&validatePinch())switch(pinchDirection){case IN:$element.trigger("pinchIn",[pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),options.pinchIn&&(ret=options.pinchIn.call($element,event,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData));break;case OUT:$element.trigger("pinchOut",[pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),options.pinchOut&&(ret=options.pinchOut.call($element,event,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData))}}return gesture==TAP?phase!==PHASE_CANCEL&&phase!==PHASE_END||(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),hasDoubleTap()&&!inDoubleTap()?(doubleTapStartTime=getTimeStamp(),singleTapTimeout=setTimeout($.proxy(function(){doubleTapStartTime=null,$element.trigger("tap",[event.target]),options.tap&&(ret=options.tap.call($element,event,event.target))},this),options.doubleTapThreshold)):(doubleTapStartTime=null,$element.trigger("tap",[event.target]),options.tap&&(ret=options.tap.call($element,event,event.target)))):gesture==DOUBLE_TAP?phase!==PHASE_CANCEL&&phase!==PHASE_END||(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),doubleTapStartTime=null,$element.trigger("doubletap",[event.target]),options.doubleTap&&(ret=options.doubleTap.call($element,event,event.target))):gesture==LONG_TAP&&(phase!==PHASE_CANCEL&&phase!==PHASE_END||(clearTimeout(singleTapTimeout),doubleTapStartTime=null,$element.trigger("longtap",[event.target]),options.longTap&&(ret=options.longTap.call($element,event,event.target)))),ret}function validateSwipeDistance(){var valid=!0;return null!==options.threshold&&(valid=distance>=options.threshold),valid}function didSwipeBackToCancel(){var cancelled=!1;return null!==options.cancelThreshold&&null!==direction&&(cancelled=getMaxDistance(direction)-distance>=options.cancelThreshold),cancelled}function validatePinchDistance(){return null!==options.pinchThreshold?pinchDistance>=options.pinchThreshold:!0}function validateSwipeTime(){var result;return result=options.maxTimeThreshold?!(duration>=options.maxTimeThreshold):!0}function validateDefaultEvent(jqEvent,direction){if(options.preventDefaultEvents!==!1)if(options.allowPageScroll===NONE)jqEvent.preventDefault();else{var auto=options.allowPageScroll===AUTO;switch(direction){case LEFT:(options.swipeLeft&&auto||!auto&&options.allowPageScroll!=HORIZONTAL)&&jqEvent.preventDefault();break;case RIGHT:(options.swipeRight&&auto||!auto&&options.allowPageScroll!=HORIZONTAL)&&jqEvent.preventDefault();break;case UP:(options.swipeUp&&auto||!auto&&options.allowPageScroll!=VERTICAL)&&jqEvent.preventDefault();break;case DOWN:(options.swipeDown&&auto||!auto&&options.allowPageScroll!=VERTICAL)&&jqEvent.preventDefault();break;case NONE:}}}function validatePinch(){var hasCorrectFingerCount=validateFingers(),hasEndPoint=validateEndPoint(),hasCorrectDistance=validatePinchDistance();return hasCorrectFingerCount&&hasEndPoint&&hasCorrectDistance}function hasPinches(){return!!(options.pinchStatus||options.pinchIn||options.pinchOut)}function didPinch(){return!(!validatePinch()||!hasPinches())}function validateSwipe(){var hasValidTime=validateSwipeTime(),hasValidDistance=validateSwipeDistance(),hasCorrectFingerCount=validateFingers(),hasEndPoint=validateEndPoint(),didCancel=didSwipeBackToCancel(),valid=!didCancel&&hasEndPoint&&hasCorrectFingerCount&&hasValidDistance&&hasValidTime;return valid}function hasSwipes(){return!!(options.swipe||options.swipeStatus||options.swipeLeft||options.swipeRight||options.swipeUp||options.swipeDown)}function didSwipe(){return!(!validateSwipe()||!hasSwipes())}function validateFingers(){return fingerCount===options.fingers||options.fingers===ALL_FINGERS||!SUPPORTS_TOUCH}function validateEndPoint(){return 0!==fingerData[0].end.x}function hasTap(){return!!options.tap}function hasDoubleTap(){return!!options.doubleTap}function hasLongTap(){return!!options.longTap}function validateDoubleTap(){if(null==doubleTapStartTime)return!1;var now=getTimeStamp();return hasDoubleTap()&&now-doubleTapStartTime<=options.doubleTapThreshold}function inDoubleTap(){return validateDoubleTap()}function validateTap(){return(1===fingerCount||!SUPPORTS_TOUCH)&&(isNaN(distance)||distance<options.threshold)}function validateLongTap(){return duration>options.longTapThreshold&&DOUBLE_TAP_THRESHOLD>distance}function didTap(){return!(!validateTap()||!hasTap())}function didDoubleTap(){return!(!validateDoubleTap()||!hasDoubleTap())}function didLongTap(){return!(!validateLongTap()||!hasLongTap())}function startMultiFingerRelease(event){previousTouchEndTime=getTimeStamp(),fingerCountAtRelease=event.touches.length+1}function cancelMultiFingerRelease(){previousTouchEndTime=0,fingerCountAtRelease=0}function inMultiFingerRelease(){var withinThreshold=!1;if(previousTouchEndTime){var diff=getTimeStamp()-previousTouchEndTime;diff<=options.fingerReleaseThreshold&&(withinThreshold=!0)}return withinThreshold}function getTouchInProgress(){return!($element.data(PLUGIN_NS+"_intouch")!==!0)}function setTouchInProgress(val){$element&&(val===!0?($element.bind(MOVE_EV,touchMove),$element.bind(END_EV,touchEnd),LEAVE_EV&&$element.bind(LEAVE_EV,touchLeave)):($element.unbind(MOVE_EV,touchMove,!1),$element.unbind(END_EV,touchEnd,!1),LEAVE_EV&&$element.unbind(LEAVE_EV,touchLeave,!1)),$element.data(PLUGIN_NS+"_intouch",val===!0))}function createFingerData(id,evt){var f={start:{x:0,y:0},last:{x:0,y:0},end:{x:0,y:0}};return f.start.x=f.last.x=f.end.x=evt.pageX||evt.clientX,f.start.y=f.last.y=f.end.y=evt.pageY||evt.clientY,fingerData[id]=f,f}function updateFingerData(evt){var id=void 0!==evt.identifier?evt.identifier:0,f=getFingerData(id);return null===f&&(f=createFingerData(id,evt)),f.last.x=f.end.x,f.last.y=f.end.y,f.end.x=evt.pageX||evt.clientX,f.end.y=evt.pageY||evt.clientY,f}function getFingerData(id){return fingerData[id]||null}function setMaxDistance(direction,distance){direction!=NONE&&(distance=Math.max(distance,getMaxDistance(direction)),maximumsMap[direction].distance=distance)}function getMaxDistance(direction){return maximumsMap[direction]?maximumsMap[direction].distance:void 0}function createMaximumsData(){var maxData={};return maxData[LEFT]=createMaximumVO(LEFT),maxData[RIGHT]=createMaximumVO(RIGHT),maxData[UP]=createMaximumVO(UP),maxData[DOWN]=createMaximumVO(DOWN),maxData}function createMaximumVO(dir){return{direction:dir,distance:0}}function calculateDuration(){return endTime-startTime}function calculateTouchesDistance(startPoint,endPoint){var diffX=Math.abs(startPoint.x-endPoint.x),diffY=Math.abs(startPoint.y-endPoint.y);return Math.round(Math.sqrt(diffX*diffX+diffY*diffY))}function calculatePinchZoom(startDistance,endDistance){var percent=endDistance/startDistance*1;return percent.toFixed(2)}function calculatePinchDirection(){return 1>pinchZoom?OUT:IN}function calculateDistance(startPoint,endPoint){return Math.round(Math.sqrt(Math.pow(endPoint.x-startPoint.x,2)+Math.pow(endPoint.y-startPoint.y,2)))}function calculateAngle(startPoint,endPoint){var x=startPoint.x-endPoint.x,y=endPoint.y-startPoint.y,r=Math.atan2(y,x),angle=Math.round(180*r/Math.PI);return 0>angle&&(angle=360-Math.abs(angle)),angle}function calculateDirection(startPoint,endPoint){if(comparePoints(startPoint,endPoint))return NONE;var angle=calculateAngle(startPoint,endPoint);return 45>=angle&&angle>=0?LEFT:360>=angle&&angle>=315?LEFT:angle>=135&&225>=angle?RIGHT:angle>45&&135>angle?DOWN:UP}function getTimeStamp(){var now=new Date;return now.getTime()}function getbounds(el){el=$(el);var offset=el.offset(),bounds={left:offset.left,right:offset.left+el.outerWidth(),top:offset.top,bottom:offset.top+el.outerHeight()};return bounds}function isInBounds(point,bounds){return point.x>bounds.left&&point.x<bounds.right&&point.y>bounds.top&&point.y<bounds.bottom}function comparePoints(pointA,pointB){return pointA.x==pointB.x&&pointA.y==pointB.y}var options=$.extend({},options),useTouchEvents=SUPPORTS_TOUCH||SUPPORTS_POINTER||!options.fallbackToMouseEvents,START_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerDown":"pointerdown":"touchstart":"mousedown",MOVE_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerMove":"pointermove":"touchmove":"mousemove",END_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerUp":"pointerup":"touchend":"mouseup",LEAVE_EV=useTouchEvents?SUPPORTS_POINTER?"mouseleave":null:"mouseleave",CANCEL_EV=SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerCancel":"pointercancel":"touchcancel",distance=0,direction=null,currentDirection=null,duration=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,pinchDistance=0,pinchDirection=0,maximumsMap=null,$element=$(element),phase="start",fingerCount=0,fingerData={},startTime=0,endTime=0,previousTouchEndTime=0,fingerCountAtRelease=0,doubleTapStartTime=0,singleTapTimeout=null,holdTimeout=null;try{$element.bind(START_EV,touchStart),$element.bind(CANCEL_EV,touchCancel)}catch(e){$.error("events not supported "+START_EV+","+CANCEL_EV+" on jQuery.swipe")}this.enable=function(){return this.disable(),$element.bind(START_EV,touchStart),$element.bind(CANCEL_EV,touchCancel),$element},this.disable=function(){return removeListeners(),$element},this.destroy=function(){removeListeners(),$element.data(PLUGIN_NS,null),$element=null},this.option=function(property,value){if("object"==typeof property)options=$.extend(options,property);else if(void 0!==options[property]){if(void 0===value)return options[property];options[property]=value}else{if(!property)return options;$.error("Option "+property+" does not exist on jQuery.swipe.options")}return null}}var VERSION="1.6.15",LEFT="left",RIGHT="right",UP="up",DOWN="down",IN="in",OUT="out",NONE="none",AUTO="auto",SWIPE="swipe",PINCH="pinch",TAP="tap",DOUBLE_TAP="doubletap",LONG_TAP="longtap",HORIZONTAL="horizontal",VERTICAL="vertical",ALL_FINGERS="all",DOUBLE_TAP_THRESHOLD=10,PHASE_START="start",PHASE_MOVE="move",PHASE_END="end",PHASE_CANCEL="cancel",SUPPORTS_TOUCH="ontouchstart"in window,SUPPORTS_POINTER_IE10=window.navigator.msPointerEnabled&&!window.navigator.pointerEnabled&&!SUPPORTS_TOUCH,SUPPORTS_POINTER=(window.navigator.pointerEnabled||window.navigator.msPointerEnabled)&&!SUPPORTS_TOUCH,PLUGIN_NS="TouchSwipe",defaults={fingers:1,threshold:75,cancelThreshold:null,pinchThreshold:20,maxTimeThreshold:null,fingerReleaseThreshold:250,longTapThreshold:500,doubleTapThreshold:200,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,pinchIn:null,pinchOut:null,pinchStatus:null,click:null,tap:null,doubleTap:null,longTap:null,hold:null,triggerOnTouchEnd:!0,triggerOnTouchLeave:!1,allowPageScroll:"auto",fallbackToMouseEvents:!0,excludedElements:"label, button, input, select, textarea, a, .noSwipe",preventDefaultEvents:!0};$.fn.swipe=function(method){var $this=$(this),plugin=$this.data(PLUGIN_NS);if(plugin&&"string"==typeof method){if(plugin[method])return plugin[method].apply(this,Array.prototype.slice.call(arguments,1));$.error("Method "+method+" does not exist on jQuery.swipe")}else if(plugin&&"object"==typeof method)plugin.option.apply(this,arguments);else if(!(plugin||"object"!=typeof method&&method))return init.apply(this,arguments);return $this},$.fn.swipe.version=VERSION,$.fn.swipe.defaults=defaults,$.fn.swipe.phases={PHASE_START:PHASE_START,PHASE_MOVE:PHASE_MOVE,PHASE_END:PHASE_END,PHASE_CANCEL:PHASE_CANCEL},$.fn.swipe.directions={LEFT:LEFT,RIGHT:RIGHT,UP:UP,DOWN:DOWN,IN:IN,OUT:OUT},$.fn.swipe.pageScroll={NONE:NONE,HORIZONTAL:HORIZONTAL,VERTICAL:VERTICAL,AUTO:AUTO},$.fn.swipe.fingers={ONE:1,TWO:2,THREE:3,FOUR:4,FIVE:5,ALL:ALL_FINGERS}});

$( function() {

	var minval_age = 0; 
	var maxval_age = 90;
	var rango_age = maxval_age-minval_age; 
	var gridag = ((document.documentElement.clientWidth*0.7)-30)/rango_age;
    $('#age').draggable({ containment:"parent",axis:"x",grid:[gridag,gridag],drag:function(){
    	var percent = (document.documentElement.clientWidth*0.7)-30;
    	var donde = Math.round((($('#age').position().left)*rango_age)/percent);
    	$("#age-filler").css("width",$('#age').position().left+29);
    	$('#age-dato').html(donde);
      }
  	});

  	var minval_eje = 0; 
	var maxval_eje = 7;
	var rango_eje = maxval_eje-minval_eje;
  	var gridej = ((document.documentElement.clientWidth*0.7)-30)/rango_eje;
    $('#ejercicio').draggable({ containment:"parent",axis:"x",grid:[gridej,gridej],drag:function(){
    	var percent = (document.documentElement.clientWidth*0.7)-30;
    	var donde = Math.round((($('#ejercicio').position().left)*rango_eje)/percent);
    	$("#ejercicio-filler").css("width",$('#ejercicio').position().left+29);
    	if (donde>3) {
    		$('#ejercicio-dato').html("4-7");
    	} else {
    		$('#ejercicio-dato').html("0-3");
    	}
      }
  	});

} );

$(window).on("load resize",function(){

	var ancho = document.documentElement.clientWidth;
	var tamano = $('.slide-coach').length;
	var csld = (tamano*ancho*0.8125)+(ancho*0.09375);
	$(".slide-coach").css("width",ancho*0.8125);
	$(".slide-coach:first-of-type").css("margin-left",ancho*0.09375);
	$(".cslider").css("width",csld);

    var IMG_WIDTH = ancho*0.8125;
	var currentImg = 0;
	var maxImages = tamano;
	var speed = 500;

	var imgs;

	var swipeOptions = { triggerOnTouchEnd: true, swipeStatus: swipeStatus, allowPageScroll: "vertical", threshold: 75 };

	$(function createSwipe () {
	    imgs = $(".cslider");
	    imgs.swipe(swipeOptions);
	});

	function swipeStatus(event, phase, direction, distance) {
	    if (phase == "move" && (direction == "left" || direction == "right")) {
	        var duration = 0;

	        if (direction == "left") {
	            scrollImages((IMG_WIDTH * currentImg) + distance, duration);
	            
	        } else if (direction == "right") {
	            scrollImages((IMG_WIDTH * currentImg) - distance, duration);
	        }

	    } else if (phase == "cancel") {
	        scrollImages(IMG_WIDTH * currentImg, speed);
	    } else if (phase == "end") {
	        if (direction == "right") {
	            previousImage();
	        } else if (direction == "left") {
	            nextImage();
	        }
	    }
	}

	function previousImage() {
	    currentImg = Math.max(currentImg - 1, 0);
	    scrollImages(IMG_WIDTH * currentImg, speed);
	}

	function nextImage() {
	    currentImg = Math.min(currentImg + 1, maxImages - 1);
	    scrollImages(IMG_WIDTH * currentImg, speed);
	}

	function scrollImages(distance, duration) {
	    imgs.css("transition-duration", (duration / 1000).toFixed(1) + "s");
	    var value = (distance < 0 ? "" : "-") + Math.abs(distance).toString();
	    imgs.css("transform", "translate(" + value + "px,0)");
	}
	    
});

$(window).load(function(){
	$(function() {

		$(".genre-bt").click(function(){
			$(this).parent().find("a").removeClass('active');
			$(this).addClass('active');
			$(".sector-1").animate({opacity:"0"}, 200);
			setTimeout(function() {
        		$(".sector-1").hide();
        		$(".genre").show();
        		$(".genre").animate({opacity:"1"}, 200);
            }, 210);
		});

		$(".age-bt").click(function(){
			$(this).parent().find("a").removeClass('active');
			$(this).addClass('active');
			$(".sector-1").animate({opacity:"0"}, 200);
			setTimeout(function() {
        		$(".sector-1").hide();
        		$(".age").show();
        		$(".age").animate({opacity:"1"}, 200);
            }, 210);
		});

		$(".zip-bt").click(function(){
			$(this).parent().find("a").removeClass('active');
			$(this).addClass('active');
			$(".sector-1").animate({opacity:"0"}, 200);
			setTimeout(function() {
        		$(".sector-1").hide();
        		$(".zip").show();
        		$(".zip").animate({opacity:"1"}, 200);
        		$(".zip input").focus();
            }, 210);
		});

		$(".mido-bt").click(function(){
			$(this).parent().find("a").removeClass('active');
			$(this).addClass('active');
			$(".sector-2").animate({opacity:"0"}, 200);
			setTimeout(function() {
        		$(".sector-2").hide();
        		$(".mido").show();
        		$(".mido").animate({opacity:"1"}, 200);
            }, 210);
		});

		$(".peso-bt").click(function(){
			$(this).parent().find("a").removeClass('active');
			$(this).addClass('active');
			$(".sector-2").animate({opacity:"0"}, 200);
			setTimeout(function() {
        		$(".sector-2").hide();
        		$(".peso").show();
        		$(".peso").animate({opacity:"1"}, 200);
            }, 210);
		});

		$(".ideal-bt").click(function(){
			$(this).parent().find("a").removeClass('active');
			$(this).addClass('active');
			$(".sector-2").animate({opacity:"0"}, 200);
			setTimeout(function() {
        		$(".sector-2").hide();
        		$(".ideal").show();
        		$(".ideal").animate({opacity:"1"}, 200);
            }, 210);
		});

		$("#hombre").click(function(){
			$(this).attr("src","images/hombreh.svg");
			$('#mujer').attr("src","images/mujer.svg");
			$('.type-def').attr("src","images/hombreh.svg");
		});

		$("#mujer").click(function(){
			$(this).attr("src","images/mujerh.svg");
			$('#hombre').attr("src","images/hombre.svg");
			$('.type-def').attr("src","images/mujerh.svg");
		});

		var timeout;
		var estatura;

		$("#estatura-up").bind('touchstart', function(){
			timeout = setInterval(function(){
				estatura = Number($("#estatura-up").parent().parent().find('input').val());
		        estatura=estatura+0.01;
		        $("#estatura-up").parent().parent().find('input').val(estatura.toFixed(2)); 
		    }, 100);
		    return false;
		});

		$("#estatura-up").bind('touchend', function(){
		    clearInterval(timeout);
		    return false;
		});

		$("#estatura-dw").bind('touchstart', function(){
			timeout = setInterval(function(){
				estatura = Number($("#estatura-dw").parent().parent().find('input').val());
		        estatura=estatura-0.01;
		        $("#estatura-dw").parent().parent().find('input').val(estatura.toFixed(2)); 
		    }, 100);
		    return false;
		});

		$("#estatura-dw").bind('touchend', function(){
		    clearInterval(timeout);
		    return false;
		});

		var peso;

		$("#peso-up").bind('touchstart', function(){
			timeout = setInterval(function(){
				peso = Number($("#peso-up").parent().parent().find('input').val());
				if (peso<99) {
					peso=peso+0.5;
		        	$("#peso-up").parent().parent().find('input').val(peso.toFixed(1)); 
				} else {
					peso=peso+1;
		        	$("#peso-up").parent().parent().find('input').val(peso.toFixed(0));
				}
		    }, 100);
		    return false;
		});

		$("#peso-up").bind('touchend', function(){
		    clearInterval(timeout);
		    return false;
		});

		$("#peso-dw").bind('touchstart', function(){
			timeout = setInterval(function(){
				peso = Number($("#peso-dw").parent().parent().find('input').val());
				if (peso<100.1) {
					peso=peso-0.5;
					$("#peso-dw").parent().parent().find('input').val(peso.toFixed(1));
				} else {
					peso=peso-1;
					$("#peso-dw").parent().parent().find('input').val(peso.toFixed(0));
				}
		    }, 100);
		    return false;
		});

		$("#peso-dw").bind('touchend', function(){
		    clearInterval(timeout);
		    return false;
		});

		var ideal;

		$("#ideal-up").bind('touchstart', function(){
			timeout = setInterval(function(){
				ideal = Number($("#ideal-up").parent().parent().find('input').val());
		        if (ideal<99) {
					ideal=ideal+0.5;
		        	$("#ideal-up").parent().parent().find('input').val(ideal.toFixed(1)); 
				} else {
					ideal=ideal+1;
		        	$("#ideal-up").parent().parent().find('input').val(ideal.toFixed(0));
				} 
		    }, 100);
		    return false;
		});

		$("#ideal-up").bind('touchend', function(){
		    clearInterval(timeout);
		    return false;
		});

		$("#ideal-dw").bind('touchstart', function(){
			timeout = setInterval(function(){
				ideal = Number($("#ideal-dw").parent().parent().find('input').val());
		        if (ideal<100.1) {
					ideal=ideal-0.5;
					$("#ideal-dw").parent().parent().find('input').val(ideal.toFixed(1));
				} else {
					ideal=ideal-1;
					$("#ideal-dw").parent().parent().find('input').val(ideal.toFixed(0));
				}
		    }, 100);
		    return false;
		});

		$("#ideal-dw").bind('touchend', function(){
		    clearInterval(timeout);
		    return false;
		});

		$('#finish1').click(function(){
			$('.aboutyou').animate({opacity:"0",left:"-40px"}, 200);
			$('.bpur').removeClass('active');
			$('.bgre').addClass('active');
			setTimeout(function() {
        		$(".pagina").hide();
        		$(".objetive").show();
        		$(".objetive").css("left","40px");
        		$(".objetive").animate({opacity:"1",left:"0px"}, 200);
            }, 250);
            $(".back").show();
		});

		$('#finish2').click(function(){
			$('.objetive').animate({opacity:"0",left:"-40px"}, 200);
			$('.bgre').removeClass('active');
			$('.bred').addClass('active');
			setTimeout(function() {
        		$(".pagina").hide();
        		$(".exercise").show();
        		$(".exercise").css("left","40px");
        		$(".exercise").animate({opacity:"1",left:"0px"}, 200);
            }, 250);
		});

		$('#finish3').click(function(){
			$('.exercise').animate({opacity:"0",left:"-40px"}, 200);
			$('.bred').removeClass('active');
			$('.borg').addClass('active');
			setTimeout(function() {
        		$(".pagina").hide();
        		$(".restric").show();
        		$(".restric").css("left","40px");
        		$(".restric").animate({opacity:"1",left:"0px"}, 200);
            }, 250);
		});

		$('#finish4').click(function(){
			$('.restric').animate({opacity:"0",left:"-40px"}, 200);
			$('.borg').removeClass('active');
			$('.byel').addClass('active');
			setTimeout(function() {
        		$(".pagina").hide();
        		$(".pcoach1").show();
        		$(".pcoach1").css("left","40px");
        		$(".pcoach1").animate({opacity:"1",left:"0px"}, 200);
            }, 250);
		});

		$('.coach.img-frame').click(function(){
			$('.pcoach1').animate({opacity:"0",left:"-40px"}, 200);
			setTimeout(function() {
        		$(".pagina").hide();
        		$(".bio").show();
        		$(".bio").css("left","40px");
        		$(".bio").animate({opacity:"1",left:"0px"}, 200);
            }, 250);
		});

		$('#finish5').click(function(){
			$('.bio').animate({opacity:"0",left:"-40px"}, 200);
			$('.byel').removeClass('active');
			setTimeout(function() {
        		$(".pagina").hide();
        		$(".discount").show();
        		$(".discount").css("left","40px");
        		$(".discount").animate({opacity:"1",left:"0px"}, 200);
            }, 250);
		});

		$('.btn-pago').click(function(){
			$('.discount').animate({opacity:"0",left:"-40px"}, 200);
			setTimeout(function() {
        		$(".pagina").hide();
        		$(".conekta").show();
        		$(".conekta").css("left","40px");
        		$(".conekta").animate({opacity:"1",left:"0px"}, 200);
            }, 250);
		});

		$('.back').click(function(){
			if($('.objetive').is(':visible')){
				$('.objetive').animate({opacity:"0",left:"40px"}, 200);
				$('.bgre').removeClass('active');
				$('.bpur').addClass('active');
				setTimeout(function() {
	        		$(".pagina").hide();
	        		$(".aboutyou").show();
	        		$(".aboutyou").animate({opacity:"1",left:"0px"}, 200);
	            }, 250);
	            $(".back").hide();
			} else if($('.exercise').is(':visible')){
				$('.exercise').animate({opacity:"0",left:"40px"}, 200);
				$('.bred').removeClass('active');
				$('.bgre').addClass('active');
				setTimeout(function() {
	        		$(".pagina").hide();
	        		$(".objetive").show();
	        		$(".objetive").animate({opacity:"1",left:"0px"}, 200);
	            }, 250);
			} else if($('.restric').is(':visible')){
				$('.restric').animate({opacity:"0",left:"40px"}, 200);
				$('.borg').removeClass('active');
				$('.bred').addClass('active');
				setTimeout(function() {
	        		$(".pagina").hide();
	        		$(".exercise").show();
	        		$(".exercise").animate({opacity:"1",left:"0px"}, 200);
	            }, 250);
			} else if($('.pcoach1').is(':visible')){
				$('.pcoach1').animate({opacity:"0",left:"40px"}, 200);
				$('.byel').removeClass('active');
				$('.borg').addClass('active');
				setTimeout(function() {
	        		$(".pagina").hide();
	        		$(".restric").show();
	        		$(".restric").animate({opacity:"1",left:"0px"}, 200);
	            }, 250);
			} else if($('.bio').is(':visible')){
				$('.bio').animate({opacity:"0",left:"40px"}, 200);
				setTimeout(function() {
	        		$(".pagina").hide();
	        		$(".pcoach1").show();
	        		$(".pcoach1").animate({opacity:"1",left:"0px"}, 200);
	            }, 250);
			} else if($('.discount').is(':visible')){
				$('.discount').animate({opacity:"0",left:"40px"}, 200);
				$('.byel').addClass('active');
				setTimeout(function() {
	        		$(".pagina").hide();
	        		$(".bio").show();
	        		$(".bio").animate({opacity:"1",left:"0px"}, 200);
	            }, 250);
			} else if($('.conekta').is(':visible')){
				$('.conekta').animate({opacity:"0",left:"40px"}, 200);
				setTimeout(function() {
	        		$(".pagina").hide();
	        		$(".discount").show();
	        		$(".discount").animate({opacity:"1",left:"0px"}, 200);
	            }, 250);
			}
		});

		var labelID;

		$('label').click(function() {
	       labelID = 'input[name="'+$(this).attr('for')+'"]';
	       $(labelID).focus();
		});

		$("input").focus(function() {
			labelID = 'label[for="'+$(this).attr('name')+'"]';
			$(labelID).addClass('focused');
		});

		$('.pl-option').click(function() {
			$('.pl-option').each(function() {
			    if ($(this).find('img').attr('src').substr(-5, 1)=="2") {
			      $(this).find('img').attr("src",$(this).find('img').attr('src').slice(0, -5)+".png");
			      $(this).removeClass('active');
			    }
			}); 
			$(this).find('img').attr("src",$(this).find('img').attr('src').slice(0, -4)+"2.png");
			$(this).addClass('active');
		});

		$('.co-option').click(function() {
			$('.co-option').each(function() {
			    if ($(this).find('img:not(.question)').attr('src').substr(-5, 1)=="2") {
			      $(this).find('img:not(.question)').attr("src",$(this).find('img:not(.question)').attr('src').slice(0, -5)+".png");
			      $(this).removeClass('active');
			    }
			}); 
			$(this).find('img:not(.question)').attr("src",$(this).find('img:not(.question)').attr('src').slice(0, -4)+"2.png");
			$(this).addClass('active');
		});

		$('.re-option').click(function() {
			if (!$(this).hasClass('active')) {
				$(this).find('img').attr("src",$(this).find('img').attr('src').slice(0, -4)+"2.png");
				$(this).addClass('active');
			} else {
				$(this).find('img').attr("src",$(this).find('img').attr('src').slice(0, -5)+".png");
				$(this).removeClass('active');
			}
		});

	});

});

(function($){

	"use strict";

	$(function(){

		console.log('hello from functions.js');

		/**
		 * Validación de emails
		 */
		window.validateEmail = function (email) {
			var regExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return regExp.test(email);
		};

		/**
		 * Regresa todos los valores de un formulario como un associative array 
		 */
		window.getFormData = function (selector) {
			var result = [],
				data   = $(selector).serializeArray();

			$.map(data, function (attr) {
				result[attr.name] = attr.value;
			});
			return result;
		}

	});

})(jQuery);