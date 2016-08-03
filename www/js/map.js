(function() {
	window.initMakersMap = function(){

			var map;
			var mapOptions = {
				zoom: 16,
				disableDefaultUI: true,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			
			map = new google.maps.Map(document.getElementById('map'), mapOptions);
			navigator.geolocation.getCurrentPosition(function(position) {
				var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				var printer = [];
				var scanner = [];
				var witship = [];
			
				var marker1 = [];
				var marker2 = [];
				var marker3 = [];

				var infowindow = new google.maps.InfoWindow({
					map: map,
					position: geolocate,
					content: '<h2>'+user_display+'</h2>',
					buttons: { close: { visible: false } }
				});

				var image = 'images/marker.svg';

				// for (var i = 0; i < printer.length; i++) { marker1[i] = new google.maps.Marker({ position: printer[i], map: map, icon: image }) }
				// for (var i = 0; i < scanner.length; i++) { marker2[i] = new google.maps.Marker({ position: scanner[i], map: map, icon: image }) }
				// for (var i = 0; i < witship.length; i++) { marker3[i] = new google.maps.Marker({ position: witship[i], map: map, icon: image }) }

				var allBtn = document.getElementById("allBtn");
				var printBtn = document.getElementById("printBtn");
				var scanBtn = document.getElementById("scanBtn");
				var shipBtn = document.getElementById("shipBtn");

				google.maps.event.addDomListener(printBtn, "click", onlyprint);
				google.maps.event.addDomListener(scanBtn, "click", onlyscan);
				google.maps.event.addDomListener(shipBtn, "click", onlyship);
				google.maps.event.addDomListener(allBtn, "click", showall);

				for (var i = 0; i < marker1.length; i++) { marker1[i].addListener('click', function() { $("#info-maker").show() }) }
				for (var i = 0; i < marker2.length; i++) { marker2[i].addListener('click', function() { $("#info-maker").show() }) }
				for (var i = 0; i < marker3.length; i++) { marker3[i].addListener('click', function() { $("#info-maker").show() }) }

				map.setCenter(geolocate);

				function onlyprint() {
					app.showLoader();
					$.getJSON(api_base_url+'around/'+user+'/makers/printer'+'?@='+position.coords.latitude+','+position.coords.longitude , function(response){
					})
					 .fail(function(err){
						console.log(JSON.stringify(err));
						app.hideLoader();
						app.toast("Failed connecting to our servers, please check your Internet connection.")
					})
					 .done(function(response){
						console.log(JSON.stringify(response));
						for(var i = 0; i<response.count; i++){
							printer[] = new google.maps.LatLng(response.pool[i].latitude, 
																response.pool[i].longitude);
							marker1[] = new google.maps.Marker({ position: printer[i], map: map, icon: image });
						}
						console.log(marker1);
						// var data = app.gatherEnvironment(response);
						//     data.home_active = true;
						//     console.log(data);
						// var source   = $("#feed_template").html();
						// var template = Handlebars.compile(source);
						// $('.main').html( template(data) );
						setTimeout(function(){
						    app.hideLoader();
						}, 2000);
						// for (var i = 0; i < marker1.length; i++) { marker1[i].setVisible(true) }
						// for (var i = 0; i < marker2.length; i++) { marker2[i].setVisible(false) }
						// for (var i = 0; i < marker3.length; i++) { marker3[i].setVisible(false) }
						$("#info-maker").hide();
					});
				}

				function onlyscan() {
					app.showLoader();
					$.getJSON(api_base_url+'around/'+user+'/makers/scanner/'+'?@='+position.coords.latitude+','+position.coords.longitude , function(response){
					})
					 .fail(function(err){
						console.log(JSON.stringify(err));
						app.hideLoader();
						app.toast("Failed connecting to our servers, please check your Internet connection.")
					})
					 .done(function(response){
						console.log(JSON.stringify(response));
						for(var i = 0; i<response.count; i++){
							scanner[] = new google.maps.LatLng(response.pool[i].latitude, 
																response.pool[i].longitude);
							marker2[] = new google.maps.Marker({ position: scanner[i], map: map, icon: image }) 
						}
						console.log(marker2);
						// var data = app.gatherEnvironment(response);
						//     data.home_active = true;
						//     console.log(data);
						// var source   = $("#feed_template").html();
						// var template = Handlebars.compile(source);
						// $('.main').html( template(data) );
						setTimeout(function(){
						    app.hideLoader();
						}, 2000);
						// for (var i = 0; i < marker1.length; i++) { marker1[i].setVisible(false) }
						// for (var i = 0; i < marker2.length; i++) { marker2[i].setVisible(true) }
						// for (var i = 0; i < marker3.length; i++) { marker3[i].setVisible(false) }
						$("#info-maker").hide();
					});
				}

				function onlyship() {
					for (var i = 0; i < marker1.length; i++) { marker1[i].setVisible(false) }
					for (var i = 0; i < marker2.length; i++) { marker2[i].setVisible(false) }
					for (var i = 0; i < marker3.length; i++) { marker3[i].setVisible(true) }
					$("#info-maker").hide();
				}

				function showall() {
					for (var i = 0; i < marker1.length; i++) { marker1[i].setVisible(true) }
					for (var i = 0; i < marker2.length; i++) { marker2[i].setVisible(true) }
					for (var i = 0; i < marker3.length; i++) { marker3[i].setVisible(true) }
					$("#info-maker").hide();
				}

			});  
		
	};

})();