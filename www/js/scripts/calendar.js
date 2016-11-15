
/************************/
/**  DIETA - CALENDAR  **/
/************************/
window.initializeCalendar = function(){
	
	jQuery(document).ready(function($) {

		window._slider = new Swipe( document.getElementById('scroller') );

		// TODO: WTF!!
		$('.platillo').each(function() {
			if ($(this).attr('data') === undefined) {
			  $(this).remove();
			}
		});


		// OBTIENE EL NUMERO DE LA SEMANA EN LA QUE NOS ENCONTRAMOS 
		Date.prototype.getWeek = function() {
			var eneroUno = new Date(this.getFullYear(), 0, 1);
			return Math.ceil((((this - eneroUno) / 86400000) + eneroUno.getDay() + 1) / 7);
		}

		//OBTIENE LA FECHA DE HOY EN FULL FORMAT
		Date.prototype.hoy = function() {
		  var mm = this.getMonth() + 1; // getMonth() is zero-based
		  var dd = this.getDate();

		  return [this.getFullYear(), !mm[1] && '/' + '0', mm, !dd[1] && '/', dd].join('');
		};

		var fecha = new Date();
		var weekNumber = (new Date()).getWeek();
		var meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sept", "Oct", "Nov", "Dic"];
		var dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado","Domingo"];

		//console.log(weekNumber);
		var ano = fecha.getFullYear();
		var mes = meses[fecha.getMonth()];
		//console.log(fecha.hoy());
		mes = mes.slice(0,3);
		/*
			IMPRIME EL MES Y EL ANO EN EL HEADER DE LA PANTALLA
		*/
			$('#month').html(mes);
			$('#year').html(ano);

		function getWeekDays(fromDate){
			var sunday = new Date(fromDate.setDate(fromDate.getDate()-fromDate.getDay())),result = [new Date(sunday)];
			while (sunday.setDate(sunday.getDate()+1) && sunday.getDay()!==0) 
			{
				result.push(new Date(sunday));
			}
			return result;
		}

		var week = new Object();
		var today = fecha.hoy().toString();

		var days = $('.day_of_week');
		var dow = [];
		var str;
		var d = new Date();
		var date_string;

		week = getWeekDays( new Date(today) );

		//console.log("str> "+today);
		var domingo;

		for(var i=0; i<dias.length; i++){
			var masuno = i+1;
			date_string = week[i].toString();    	
			$('tr td.day_of_week:nth-of-type('+masuno+') span').html(date_string.substring(8, 11));
			var dataf = new Date(date_string);
			var mes = "";
			var dia = "";
			if((dataf.getMonth()+1) < 10)
				mes = '0'+(dataf.getMonth()+1);
			else
				mes = (dataf.getMonth()+1);

			if((dataf.getDate()) < 10)
				dia = '0'+(dataf.getDate());
			else
				dia = (dataf.getDate());

			$('#toda_la_dieta li:nth-of-type('+masuno+')').attr('data', dataf.getFullYear()+ '-'+mes+'-'+ dia);

			// console.log(dia);
		}


			var incremento = 168.25;
			var decremento = 167.75;
			var current_day;
			var full_date;
			var left = fecha.hoy().substring(0,8);

			current_day = new Date( + new Date().getTime() + 1 * 60 * 60 * 1000 );
			var dia_semana = current_day.getDay();
			dia_semana++;
			$('tr td.day_of_week:nth-of-type('+dia_semana+')').trigger('click');

			current_day = fecha.hoy().substring(8);
			
			current_day = left + current_day;
			

			$(".nextweek").click(function(){
				week = getWeekDays( new Date( current_day ) );
				full_date = new Date( + new Date( current_day ).getTime() + incremento * 60 * 60 * 1000);
				// console.log(full_date);
				var month = full_date.getMonth();
				
				$('#month').html(meses[month] );
				$('#year').html(full_date.getFullYear());

				for(var i=0; i<dias.length; i++){
					var masuno = i+1;
					date_string = week[i].toString();
					$('tr td.day_of_week:nth-of-type('+masuno+') span').html(date_string.substring(8, 11));
				}
				
				current_day = full_date;
				//console.log("Full date > > "+full_date);
				var week2 = getWeekDays( new Date( "'" + full_date + "'" ) );
				for(var i=0; i<dias.length; i++){
					
					var nuevo = JSON.stringify(week2[i]);
					// console.log("wee ::"+week2[i]);

					dow[i] = nuevo.slice(9, 11);

					var masuno = i+1;
					//console.log(dow[i]);
					$('tr td.day_of_week:nth-of-type('+masuno+') span').html(dow[i]);
					var dataf = new Date(week2[i]);

					var mes = "";
					var dia = "";
					if((dataf.getMonth()+1) < 10)
						mes = '0'+(dataf.getMonth()+1);
					else
						mes = (dataf.getMonth()+1);


					if((dataf.getDate()) < 10)
						dia = '0'+(dataf.getDate());
					else
						dia = (dataf.getDate());

					$('#toda_la_dieta li:nth-of-type('+masuno+')').attr('data', dataf.getFullYear()+ '-'+mes+'-'+ dia );
				}
			});

			$(".lastweek").click(function(){
				week = getWeekDays( new Date( current_day ) );
				full_date = new Date( + new Date( current_day ).getTime() - decremento * 60 * 60 * 1000);
				// console.log(full_date);
				var month = full_date.getMonth();
				
				$('#month').html(meses[month] );
				$('#year').html(full_date.getFullYear());

				for(var i=0; i<dias.length; i++){
					var masuno = i+1;
					date_string = week[i].toString();
					$('tr td.day_of_week:nth-of-type('+masuno+') span').html(date_string.substring(8, 11));
				}
				
				current_day = full_date;
				//console.log("Full date > > "+full_date);
				var week2 = getWeekDays( new Date( "'" + full_date + "'" ) );
				for(var i=0; i<dias.length; i++){
					
					var nuevo = JSON.stringify(week2[i]);
					// console.log("wee ::"+week2[i]);

					dow[i] = nuevo.slice(9, 11);

					var masuno = i+1;
					//console.log(dow[i]);
					$('tr td.day_of_week:nth-of-type('+masuno+') span').html(dow[i]);
					var dataf = new Date(week2[i]);
					var mes = "";
					var dia = "";
					if((dataf.getMonth()+1) < 10)
						mes = '0'+(dataf.getMonth()+1);
					else
						mes = (dataf.getMonth()+1);

					if((dataf.getDate()) < 10)
						dia = '0'+(dataf.getDate());
					else
						dia = (dataf.getDate());
					$('#toda_la_dieta li:nth-of-type('+masuno+')').attr('data', dataf.getFullYear()+ '-'+mes+'-'+dia);
				}
			});

	});

}
