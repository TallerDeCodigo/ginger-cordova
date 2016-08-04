$(window).on("load resize",function(){
	var autocompleta = $("#inferior1 a").first().html();
	var autourl = $("#inferior1 a").first().attr("href");
	var autocompleta1 = $("#inferior1 a:nth-child(2)").html();
	var autourl1 = $("#inferior1 a:nth-child(2)").attr("href");
	var autocompleta2 = $("#inferior1 a:nth-child(3)").html();
	var autourl2 = $("#inferior1 a:nth-child(3)").attr("href");

/*
	MANUEL
			*/

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




/*
	END MANUEL
				*/



	$( ".fotos" ).each(function() {
			if ($(this).attr('id') != "superior1" && $(this).find("a").length < 4) {
				if ($(this).find("a").length == 3) {
					$(this).append( '<a class="small link" href="'+autourl+'">'+autocompleta+'</a>' );
				} 
				if ($(this).find("a").length == 2) {
					$(this).append( '<a class="small link" href="'+autourl1+'">'+autocompleta1+'</a> <a class="small link" href="'+autourl2+'">'+autocompleta2+'</a>' );
				}
				if ($(this).find("a").length == 1) {
					$(this).append( '<a class="small link" href="'+autourl+'">'+autocompleta+'</a> <a class="small link" href="'+autourl1+'">'+autocompleta1+'</a> <a class="small link" href="'+autourl2+'">'+autocompleta2+'</a>' );
				}
			}
	});
	$( ".section" ).each(function() {
			if ($(this).attr('id') != "section1" && $(this).find("a").length < 7) {
				if ($(this).find("a").length == 3 || $(this).find("a").length == 7) {
					$(this).append( '<a class="replica sml" href="'+autourl+'"></a>' );
				} 
				if ($(this).find("a").length == 2 || $(this).find("a").length == 6) {
					$(this).append( '<a class="replica sml" href="'+autourl1+'"></a><a class="replica sml" href="'+autourl2+'"></a>' );
				}
				if ($(this).find("a").length == 1 || $(this).find("a").length == 5) {
					$(this).append( '<a class="replica sml" href="'+autourl+'"></a><a class="replica sml" href="'+autourl1+'"></a><a class="replica sml" href="'+autourl2+'"></a>' );
				}
			}
			if ($(this).find("a").length == 4) {
				var linksextras = $("#section1").html();
				linksextras = linksextras.substring(linksextras.indexOf("</a>") + 4);
				$(this).append( linksextras );
			}
	});
	if ($(".abajo").length < $(".arriba").length) {
		var paginaextra = $("#inferior1").html();
		$("#static").append('<div id="inferior'+$(".arriba").length+'" class="abajo fotos">'+paginaextra+'</div>');
	}
	var pathname = window.location.href;
	var ancho = document.documentElement.clientWidth;
	var alto = document.documentElement.clientHeight;
	var altfull = alto-156 + "px";
	var altfull2 = alto-56 + "px";
	var altfull25 = alto-104 + "px";
	var altfull1 = alto-104 + "px";
	$("#principalf").css("height", ancho);
	$("#static").css("height", altfull1);
	$(".pages").css("height", altfull);
	$(".upload_options").css("height", altfull25);
	$(".pages.search_results").css("height", altfull1);
	$(".pages.not_that_much").css("height", altfull1);
	$(".pagina").css("height", altfull);
	var totitems = $('.actions').length;
	totitems = totitems + " ITEMS";
	$("#items").html( totitems );
	pathname = pathname.substring(pathname.indexOf("=") + 1);
	var pathname1 = "images/" + pathname + "/";
	pathname = "images/" + pathname + ".png";
	$(".define").attr("src",pathname);
	/*
	$(".define").each(function(index) {
		var file = index+1;
		var finalpath = pathname1 + "/" + file + ".png";
		$(this).attr("src",finalpath);
	});
	*/
	var numcats = $('.cats').length;
	var total_length = 0;
	$('.cats').each(function(){
		total_length += $(this).width();
		total_length += 20;
	});
	$("#swipper div").css("width", total_length);

	var grd = $('.bigg').height();
	$('.grd').css('height', grd);
	var smler = $('.abajo a').height();
	$('.sml').css('height', smler);
	if (alto < 500) {
		$('.footer').css('bottom', '-150px');
	} else {
		$('.footer').css('bottom', '0px');
	}

});

$(window).load(function(){
	$(function() {



/*
	MANUEL
*/
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




/*
	END MANUEL
*/





		$("#account1").click(function(){
			$(".wrapper").show();
			setTimeout(function() {$("#user").animate({"right":"0%"}, 300)}, 10);
		});

		$(".separate").click(function(){
			$("#user").animate({"right":"-85%"}, 300);
			setTimeout(function() {$(".wrapper").hide()}, 300);
		});

		$(".element").click(function(){
			if ($(this).css('left') != '0px') {
				$(this).animate({"left":"0px"}, 200);
			}
		});

		$.fn.digits = function(){ 
			return this.each(function(){ 
				$(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") ); 
			})
		}

		$(".mas").click(function(){
			var cantidad = parseInt($(this).parent().find( ".cantidad" ).html(), 10);
			var multip = parseInt($(this).parent().find( ".cantis" ).html().replace(/,/g, ''), 10);
			multip = (multip/cantidad)*(cantidad+1);
			++cantidad;
			$(this).parent().find( ".cantidad" ).html( cantidad );
			$(this).parent().find( ".cantis" ).html( multip );
			$(this).parent().find( ".cantis" ).digits();
		});

		$(".menos").click(function(){
			var cantidad = parseInt($(this).parent().find( ".cantidad" ).html(), 10);
			var multip = parseInt($(this).parent().find( ".cantis" ).html().replace(/,/g, ''), 10);
			multip = (multip/cantidad)*(cantidad-1);
			--cantidad;
			if (cantidad <= 0) {
				$(this).parent().animate({"left":"-75px"}, 200);
			} else {
				$(this).parent().find( ".cantidad" ).html( cantidad );
				$(this).parent().find( ".cantis" ).html( multip );
				$(this).parent().find( ".cantis" ).digits();
			}
		});

		$(".close").click(function(){
			$(this).parent().animate({"left":"-75px"}, 200);
		});

		$(".fotel").click(function(){
			$(this).parent().animate({"left":"75px"}, 200);
		});

		$(".right").click(function(){
			$(this).parent().remove();
			var totitems = $('.actions').length;
			totitems = totitems + " ITEMS";
			$("#items").html( totitems ) ;
		});

		$(".shipp").click(function(){
			$(".shipp i").html( "panorama_fish_eye" );
			$(this).find( "i" ).html( "adjust" );
		});

		$(".paym").click(function(){
			$(".paym i").html( "panorama_fish_eye" );
			$(this).find( "i" ).html( "adjust" );
		});

		$(".bots").click(function(){
			$(".bots").removeClass( "active" );
			$(this).addClass( "active" );
			if( $(this).data('source') == 'gallery' ){
				
				return;
			}
		});

		$(".cats").click(function(){
			var sufix = $(this).data('id');
			$(".cats").removeClass( "select" );
			$(this).addClass( "select" );
			$(".submenus").hide();
			if ($("#subcats"+sufix).find(".sucats").length && $('#barra').css('display')!='none') {
				$("#photo-btn").hide();
				$("#no-cat").hide();
				$("#barra").hide();
				$(".sucats").removeClass( "select" );
				$("#subcats a").first().addClass( "select" );
				$("#swipper").animate({"top":"-50px"}, 200);
				setTimeout(function() {
					$("#subcats"+sufix).show();
					if ($("#subcats"+sufix).find(".sucats").length>2) {
						$("#subcats"+sufix).find(".swipper1 div").addClass("scrolleado");
						var total_sub = 0;
						$("#subcats"+sufix).find(".sucats").each(function(){
							total_sub += $(this).outerWidth();
							total_sub += 3.5;
						});
						console.log("ancho-sin: "+total_sub+"ancho-tot: "+$("#subcats"+sufix).find(".swipper1").width());
						if (total_sub+30 > $("#subcats"+sufix).find(".swipper1").width()) {
							$("#subcats"+sufix).find(".scrolleado").css("width", total_sub);
						} else {
							$("#subcats"+sufix).find(".swipper1 div").removeClass("scrolleado");
						}
					}
				}, 200);
				$("#subcats"+sufix).find(".swipper1").scrollLeft("0px");
				$("#subcats"+sufix).find(".swipper1 div .sucats:first-of-type").trigger( "click" );
			} else if ($("#subcats"+sufix).find(".sucats").length && $('#barra').css('display')=='none') {
				$("#subcats"+sufix).show();
				if ($("#subcats"+sufix).find(".sucats").length>2) {
					$("#subcats"+sufix).find(".swipper1 div").addClass("scrolleado");
					var total_sub = 0;
					$("#subcats"+sufix).find(".sucats").each(function(){
						total_sub += $(this).outerWidth();
						total_sub += 3.5;
					});
					console.log("ancho-sin: "+total_sub+"ancho-tot: "+$("#subcats"+sufix).find(".swipper1").width());
					if (total_sub+30 > $("#subcats"+sufix).find(".swipper1").width()) {
						$("#subcats"+sufix).find(".scrolleado").css("width", total_sub);
					} else {
						$("#subcats"+sufix).find(".swipper1 div").removeClass("scrolleado");
					}
				}
				$("#subcats"+sufix).find(".swipper1").scrollLeft("0px");
				$("#subcats"+sufix).find(".swipper1 div .sucats:first-of-type").trigger( "click" );
			} else if ($("#subcats"+sufix).find(".sucats").length==0 && $('#barra').css('display')=='none') {
				$("#swipper").animate({"top":"0px"}, 200);
				$(".sucats").removeClass( "select" );
				setTimeout(function() {
					$("#no-cat").show();
					$("#barra").show();
					$("#photo-btn").show();
				}, 150);
			}
		});

		$(".cats1").click(function(){
			$(".cats1").removeClass( "select" );
			$(this).addClass( "select" );
		});

		$(".sucats").click(function(){
			app.showLoader();
			$(".sucats").removeClass( "select" );
			$(this).addClass( "select" );
			/* the trigger directs here by its class */
			app.render_taxonomy( $(this).data('id'), "category", ".inject", "search-composite-page" );
		});

		$("#check").click(function(){
			var sumatoria = 0;
			$(".mas").hide();
			$(".menos").hide();
			$(".close").hide();
			$(".cuenta").show();
			$(".detalles").show();
			$( ".cantis" ).each(function() {
				var acanti = parseInt($(this).html().replace(/,/g, ''), 10);
				sumatoria = sumatoria + acanti;
			});
			$("#sumar").html( sumatoria );
			$("#sumar").digits();
		});

		$("#items").click(function(){
			$(".mas").show();
			$(".menos").show();
			$(".close").show();
			$(".cuenta").hide();
			$(".detalles").hide();
		});

		$(".return").click(function(){
			$(".submenus").hide();
			$("#swipper").animate({"top":"0px"}, 200);
			$(".cats").removeClass( "select" );
			$(".sucats").removeClass( "select" );
			setTimeout(function() {
				$("#no-cat").show();
				$("#barra").show();
				$("#photo-btn").show();
			}, 150);
		});

		$("#primero").click(function(){
			var extra = '<a href="#">Lorem</a><a href="#">Ipsum</a><a href="#">Dolor</a><a href="#">Sit</a><a href="#">Amet</a><a href="#">Consectetur</a><a href="#">Adipiscing</a>';
			$("#dashboard1").append(extra);
			$("#dashboard1 a").addClass( "choosed" );
		});


		$(".techBtn").click(function(){
			var topAdjusted = $('#technical').position().top;
			$("body").animate({scrollTop: topAdjusted-50}, 400);
		});

		// if(typeof(device) != 'undefined' && device.platform == "iOS"){
		// 	$("body").addClass("iOS");
		// }

		/** Show prompt to upload **/
		$("#add_photo_appear").on('click', function(){
			$('.upload_options').fadeIn().removeClass('hidden');
		});

		/** Close prompt on touch **/
		$(".close_on_touch").on('click', function(e){
			if( !$(e.target).hasClass('dont_close') )
				$(this).fadeOut().addClass('hidden');
		});
	});
});



/***** EVENTS *****/


	/* Log In with a regular ol' account */
	$('#login_form').submit(function(e){
		app.showLoader();
		e.preventDefault();
		var data_login      = app.getFormData('#login_form');
		var responsedata    = apiRH.loginNative(data_login);
		if(responsedata) {
			console.log(responsedata);
			apiRH.save_user_data_clientside(responsedata);
			window.location.assign('feed.html');
			return;
		}
		app.toast('Tu email o contraseña no son válidos.');
	});

	/** Login with events **/
	$(document).on('click', '.login_button', function(){
		
		var provider = $(this).data('provider');
		if(provider == 'facebook')
			apiRH.loginOauth(provider, apiRH.loginCallbackFB);
		if(provider == 'google')
			apiRH.loginOauth(provider, apiRH.loginCallbackGP);
	});

	/* Log In with a regular ol' account */
	$('#create_account_form').submit(function(e){
		e.preventDefault();
		app.showLoader();
		var data_login      = app.getFormData('#create_account_form');
		var responsedata    = apiRH.registerNative(data_login);
		if(responsedata) {
			app.toast('Welcome to 3Dedalo');
			apiRH.save_user_data_clientside(responsedata);
			window.location.assign('feed.html?filter_feed=all');
			app.hideLoader();
			return;
		}
		app.toast('Sorry, we couldn\'t create your account, please try again.');
		// app.hideLoader();
		return;
	});

	/* Further search send form */
	$('#further_search #send_form').on("click", function(e){
		e.preventDefault();
		app.showLoader();
		var data_adv_search = app.getFormData('#further_search');
		console.log("Further search"+ JSON.stringify(data_adv_search));
		/*** Initialize upload action ***/
		app.toast('Uploading files to server...');
		apiRH.initializeSearchFileTransfer(data_adv_search);
		return;
	});
	
	/* Category follow events */
	$(document).on('click', '.follow_category', function(e){
		e.preventDefault();
		var $context    = $(this);
		var cat_id      = $(this).data('id');
		var response    = apiRH.makeRequest(user+'/categories/follow/', {'cat_id': cat_id});
		e.stopPropagation();
		if(response.success){
			e.stopPropagation();
			$context.removeClass('follow_category').addClass('unfollow_category choosed');
			return  app.toast('Category followed');
		}
		return app.toast('Oops! something happened');
	});

	$(document).on('click', '.unfollow_category', function(e){
		e.preventDefault();
		var $context    = $(this);
		var cat_id      = $(this).data('id');
		var response    = apiRH.makeRequest(user+'/categories/unfollow/', {'cat_id': cat_id});
		e.stopPropagation();
		if(response.success){
			e.stopPropagation();
			$context.removeClass('unfollow_category choosed').addClass('follow_category');
			return app.toast('Category unfollowed');
		}
		return app.toast('Oops! something happened');
	});

	/*** User follow events ***/
	$('body').on('click', '.follow_user', function(){
		var user_id = $(this).data('id');
		var response = apiRH.makeRequest(user+'/follow', {'user_id': user_id});
		if(response.success){
			$(this).removeClass('follow_user').addClass('unfollow_user following');
			app.toast("You are now following this maker");
			return;
		}
	});

	$('body').on('click', '.unfollow_user', function(){
		var user_id = $(this).data('id');
		var response = apiRH.makeRequest(user+'/unfollow', {'user_id': user_id});
		if(response.success){
			$(this).removeClass('unfollow_user following').addClass('follow_user');
			return;
		}
	});

   

	$('#get_pic_gallery').on('click', function(e){
		app.get_file_from_device('search', 'gallery');
	});

	$('#get_pic_camera').on('click', function(e){
		app.get_file_from_device('search', 'camera');
	});



	/*** Settings form ***/
	if($('#settings_form').length){
		window.printer = {};
		window.scanner = {};
		window.printer.justmodified = false;
		window.scanner.justmodified = false;
		/*
		 * Update user profile
		 */
		$('body').on('submit', '#settings_form', function(e){
			e.preventDefault();
			/* IMPORTANT! getFormData returns an array, we have to parse into a JSON object before making the PUT call */
			var data = app.getFormData('#settings_form');
			if( data.become_printer || data.become_scanner ){
				data.just_modified = (window.printer.justmodified || window.scanner.justmodified) ? true : false;
				/*** Get geolocation ***/
				console.log(data);
				if(data.just_modified)
					app.toast("Please set the location of your printing device");
			}
			var response = apiRH.makeRequest('user/'+user+'/' , data);
			if(response.success)
				app.toast('Profile updated successfully');
			return;
		});

		$('#become_printer').on('click', function(){
			if($('#become_printer').prop('checked')){
				var $become_printer_details = $(this).parent().siblings('.form_part');
				$become_printer_details.removeClass('hidden');
				/*** Update specifics from the hardware ***/
				window.printer.justmodified = true;
				return;
			}
			$(this).parent().siblings('.form_part').addClass('hidden');
		});
			$('#printer_brand').on("change", function(){
				var selected_index = $('#printer_brand option:selected').text();
				var Obj_length = Object.keys(window.printers_global[selected_index]).length;
				var html = "";
				html += "<option value=''>Model</option>";
				for(var i = 0; i< Obj_length; i++){
					var name = window.printers_global[selected_index][i];
					html += "<option value='"+i+"'>"+name+"</option>";
				}
				$('#printer_model').html(html);
			});

			$('#locate_new_printer').on("click", function(){
				console.log("locate new printer");
				app.showLoader();
				app.locate_printer_here();
			});

		$('#become_scanner').on('click', function(){
			if($('#become_scanner').prop('checked')){
				var $become_scanner_details = $(this).parent().siblings('.form_part');
				$become_scanner_details.removeClass('hidden');
				/*** Update specifics from the hardware ***/
				window.scanner.justmodified = true;
				return;
			}
			$(this).parent().siblings('.form_part').addClass('hidden');
		});

	}

	/*** Password change form ***/
	if($('#save_password').length){
		
		$('body').on('submit', '#save_password', function(e){
			e.preventDefault();
			var data = app.getFormData('#save_password');
			if(data.user_pwd && data.user_pwd !== ''){
				if(data.user_pwd == data.user_rpt_pwd){
					var response = apiRH.makeRequest('user/'+user+"/password/" , data);
					console.log(response);
					if(!response.success){
						app.toast('Sorry, There was an error saving your password');
						return false;
					}
					app.toast('Password changed successfully');
					return;
				}
				app.toast('Both passwords must match!');
			}
		});
	}

