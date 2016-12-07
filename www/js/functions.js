var gridag;
var minval_age;

var gridej;
var minval_eje;
var anchot = document.documentElement.clientWidth;

$( function() {

	window.fbAsyncInit = function() {
		FB.init({
					appId      : '239633319765955',
					cookie     : true,
					xfbml      : true,
					version    : 'v2.7'
				});
	}

}); // END function


$(window).load(function(){

 

/*
	FEED HTML
*/
		if(app.keeper)
			if( app.keeper.getItem('avatar-admin') ){
				$('.circle-frame').find('img').attr('src', 'http://ginger-admin.cloudapp.net/pictures/' + app.keeper.getItem('avatar-admin'));
			}else{

				if( app.keeper.getItem('avatar') ){
					$('.circle-frame').find('img').attr('src', app.keeper.getItem('avatar') + '?type=large');
				}else{
					$('.circle-frame').find('img').remove();
				}

			}

		// Cambiar coach
		$('.com2send').click(function() {
			$('.comment_pop').show();
			setTimeout(function() {$('.comment_pop').addClass('active');}, 200);
			$('.comment_pop textarea').focus();
		});


		


	}); //END WINDOW LOAD clicks