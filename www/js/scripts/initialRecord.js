	
window.initializeRecordEvents = function(){
	
	jQuery(document).ready(function($) {

		console.log("Initializing Initial Record events");

		window.init_scripts.push("initial_record");
		/* MEASUREMENT CONTROLS */
		var timeout;
		var estatura;
		var timeoutFlag = null;
		var timer 		= 200;
		var clickTimer 	= null;

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
			console.log('click');
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

		/** SELECT GENDER **/
		$("#hombre").click(function(){
			if ($(this).hasClass('edition')) {
				$('#mujer').attr("src","images/mujere.svg");
				$('#update_sexo').attr("value", '0');

			} else {
				$('#mujer').attr("src","images/mujer.svg");
				$('#mujer').attr("alt","");
			}
			$(this).attr({src: "images/hombreh.svg", alt: "1"});
			$('.type-def').attr("src","images/hombreh.svg");
			$('#update_sexo').attr("value", '1');
		});

 
		$("#mujer").click(function(){
			if ($(this).hasClass('edition')) {
				$('#hombre').attr("src","images/hombree.svg");
				$('#update_sexo').attr("value", '1');
			} else {
				$('#hombre').attr("src","images/hombre.svg");
				$('#hombre').attr("alt","");
			}
			$(this).attr({src: "images/mujerh.svg", alt: "0"});
			$('.type-def').attr("src","images/mujerh.svg");
			$('#update_sexo').attr("value", '0');
		});

		/* RECORD AGE */
		
		var gridag;
		minval_age 		= 15; 
		var maxval_age 	= 90;
		var rango_age 	= maxval_age - minval_age;

		/** Set up initial draggable values **/
		if ($('.pagina').hasClass('aboutyou')) {
			gridag = ((anchot*0.7)-30)/rango_age;
		} else {
			gridag = ($('.age .drag-parent').width()-30)/rango_age;
		}

		/** Set up actual draggable **/
		$('#age').draggable( 
							{ 
								containment:"parent",
								axis:"x",
								grid:[gridag,gridag],
								drag: function(){
									var percent = $('.age .drag-parent').width()-30;
									var donde = Math.round(((($('#age').position().left)*rango_age)/percent)+minval_age);
									$("#age-filler").css("width", $('#age').position().left+20);
									$('#age-dato').html(donde);
									$('#edad_value').attr("value", donde);
									return true;
								}
		});

		/** BINDING STICKY EVENTS **/
		$("#estatura-up").bind('touchstart touchend', apiRH.stickyTouchHandler);

		$("#estatura-up").bind('mousedown', function(e){
			// e.preventDefault();
			if (clickTimer == null) {
	        	clickTimer = setTimeout(function () {
		            clickTimer = null;
		        }, 320)
		    } else {
		        clearTimeout(clickTimer);
		        clickTimer = null;
		        e.preventDefault();
		        e.stopPropagation();
		        console.log("double");
		        return false;
		    }
			timeout = setInterval(function(){
				estatura = Number($("#estatura-up").parent().parent().find('input').val());
				estatura = estatura+0.01;
				$("#estatura-up").parent().parent().find('input').val(estatura.toFixed(2));
				$('input[name="estatura"]').attr( "value", estatura );
				timeoutFlag = true;
			}, timer);
			return false;
		})
		 .bind('mouseup', apiRH.clearTimeoutLogic);
		
		$("#estatura-dw").bind('touchstart touchend', apiRH.stickyTouchHandler);

		$("#estatura-dw").bind('mousedown', function(e){
			e.preventDefault();
			if (clickTimer == null) {
	        	clickTimer = setTimeout(function () {
		            clickTimer = null;
		        }, 320)
		    } else {
		        clearTimeout(clickTimer);
		        clickTimer = null;
		        e.preventDefault();
		        e.stopPropagation();
		        console.log("double");
		        return false;
		    }
			timeout = setInterval(function(){
				estatura = Number($("#estatura-dw").parent().parent().find('input').val());
				estatura=estatura-0.01;
				$("#estatura-dw").parent().parent().find('input').val(estatura.toFixed(2));
				$('input[name="estatura"]').attr("value", estatura);
				// return false;
			}, timer);
			return false;
		})
		 .bind('mouseup', apiRH.clearTimeoutLogic);

		var peso;
		
		$("#peso-up").bind('touchstart touchend', apiRH.stickyTouchHandler);
		$("#peso-up").bind('mousedown', function(e){
			e.preventDefault();
			if (clickTimer == null) {
	        	clickTimer = setTimeout(function () {
		            clickTimer = null;
		        }, 320)
		    } else {
		        clearTimeout(clickTimer);
		        clickTimer = null;
		        e.preventDefault();
		        e.stopPropagation();
		        console.log("double");
		        return false;
		    }
			timeout = setInterval(function(){
				peso = Number($("#peso-up").parent().parent().find('input').val());
				if (peso<99) {
					peso=peso+0.5;
					$("#peso-up").parent().parent().find('input').val(peso.toFixed(1));
					$('input[name="peso"]').attr("value", peso);
				} else {
					peso=peso+1;
					$("#peso-up").parent().parent().find('input').val(peso.toFixed(0));
				}
			}, timer);
			return false;
		})
		 .bind('mouseup', apiRH.clearTimeoutLogic);

		$("#peso-dw").bind('touchstart touchend', apiRH.stickyTouchHandler);
		$("#peso-dw").bind('mousedown', function(e){
			e.preventDefault();
			if (clickTimer == null) {
	        	clickTimer = setTimeout(function () {
		            clickTimer = null;
		        }, 320)
		    } else {
		        clearTimeout(clickTimer);
		        clickTimer = null;
		        e.preventDefault();
		        e.stopPropagation();
		        console.log("double");
		        return false;
		    }
			timeout = setInterval(function(){
				peso = Number($("#peso-dw").parent().parent().find('input').val());
				if (peso<100.1) {
					peso=peso-0.5;
					$("#peso-dw").parent().parent().find('input').val(peso.toFixed(1));
					$('input[name="peso"]').attr("value", peso);
				} else {
					peso=peso-1;
					$("#peso-dw").parent().parent().find('input').val(peso.toFixed(0));
				}
			}, timer);
			return false;
		})
		 .bind('mouseup', apiRH.clearTimeoutLogic);

		var ideal;

		$("#ideal-up").bind('touchstart touchend', apiRH.stickyTouchHandler);
		$("#ideal-up").bind('mousedown', function(e){
			if (clickTimer == null) {
	        	clickTimer = setTimeout(function () {
		            clickTimer = null;
		        }, 320)
		    } else {
		        clearTimeout(clickTimer);
		        clickTimer = null;
		        e.preventDefault();
		        e.stopPropagation();
		        console.log("double");
		        return false;
		    }
			timeout = setInterval(function(){
				ideal = Number($("#ideal-up").parent().parent().find('input').val());
				if (ideal<99) {
					ideal=ideal+0.5;
					$("#ideal-up").parent().parent().find('input').val(ideal.toFixed(1));
					$('input[name="ideal"]').attr("value", ideal);
				} else {
					ideal=ideal+1;
					$("#ideal-up").parent().parent().find('input').val(ideal.toFixed(0));
				} 
			}, timer);
			return false;
		})
		 .bind('mouseup', apiRH.clearTimeoutLogic);

		$("#ideal-dw").bind('touchstart touchend', apiRH.stickyTouchHandler);
		$("#ideal-dw").bind('mousedown', function(e){
			if (clickTimer == null) {
	        	clickTimer = setTimeout(function () {
		            clickTimer = null;
		        }, 320)
		    } else {
		        clearTimeout(clickTimer);
		        clickTimer = null;
		        e.preventDefault();
		        e.stopPropagation();
		        console.log("double");
		        return false;
		    }
			timeout = setInterval(function(){
				ideal = Number($("#ideal-dw").parent().parent().find('input').val());
				if (ideal<100.1) {
					ideal=ideal-0.5;
					$("#ideal-dw").parent().parent().find('input').val(ideal.toFixed(1));
					$('input[name="ideal"]').attr("value", ideal);
				} else {
					ideal=ideal-1;
					$("#ideal-dw").parent().parent().find('input').val(ideal.toFixed(0));
				}
			}, timer);
			return false;
		})
		 .bind('mouseup', apiRH.clearTimeoutLogic);

		/* Next step 1 */
		$('#next_step_one').click(function(){

			if($('#zipInput').val() == ''){
				$('.overscreenzip').show();
				$('.accept.zipcode').click(function(){
					$('.overscreenzip').hide().removeClass('active');;
				});
				setTimeout(function() {$('.overscreenzip').addClass('active');}, 200);
				return;
			}
			$('.aboutyou').animate({opacity:"0",left:"-40px"}, 200);
			$('.bpur').removeClass('active');
			$('.bgre').addClass('active');

			if($('#hombre').attr('alt') == '1' ){
				$('#genre_value').attr('value', 1);
			}else{
				$('#genre_value').attr('value', 0);
			}

			if($('input[name="zipcode"]').val() == '' || $('input[name="zipcode"]').val() == undefined){
				return;
			}
			app.keeper.setItem('zipcode', $('input[name="zipcode"]').val() );
			var _zipcode = app.keeper.getItem('zipcode');

			app.keeper.setItem('genero', $('#genre_value').val() );//hacerlo una condicional
			var _genero = app.keeper.getItem('genero');

			app.keeper.setItem('estatura', $('input[name="estatura"]').val() );
			var _estatura = app.keeper.getItem('estatura');

			app.keeper.setItem('peso', $('input[name="peso"]').val() );
			var _peso = app.keeper.getItem('peso');
			
			app.keeper.setItem('edad', $('#edad_value').val() );
			
			app.keeper.setItem('peso_ideal', $('input[name="ideal"]').val() );
			var _peso_ideal = app.keeper.getItem('peso_ideal');

			setTimeout(function() {
				$(".pagina").hide();
				$(".objetive").show();
				$(".objetive").css("left","40px");
				$(".objetive").animate({opacity:"1",left:"0px"}, 200);
				$("#container").resize();
			}, 250);

			$(".back").show();

		});//END Next step 1

		/*** SELECT OBJECTIVE ***/
		$('.pl-option').click(function() {

			var valor = $(this).find('.type').attr('value');
			$('#plan').attr('value', valor);

			$('.pl-option').each(function() {
				if ($(this).find('img').attr('src').substr(-5, 1) == "2") {
					$(this).find('img').attr("src", $(this).find('img').attr('src').slice( 0, -5 )+".png");
					$(this).removeClass('active');
					$(this).attr("value", "");
				}
			});

			$(this).find('img').attr("src", $(this).find('img').attr('src').slice(0, -4)+"2.png");
			$(this).addClass('active');
			$(this).attr("value", valor);

			switch ( $('#plan').val() ) {
				case 'adelgazar' :
					$('#plan').attr("value", "0");
					break;
				case 'detox':
					$('#plan').attr("value", "1");
					break;
				case 'rendimiento' :
					$('#plan').attr("value", "2");
					break;
				case 'bienestar' :
					$('#plan').attr("value", "3");
					break;
			}
		});

	});

}
