	/*      _                                       _                        _       
	 *   __| | ___   ___ _   _ _ __ ___   ___ _ __ | |_   _ __ ___  __ _  __| |_   _ 
	 *  / _` |/ _ \ / __| | | | '_ ` _ \ / _ \ '_ \| __| | '__/ _ \/ _` |/ _` | | | |
	 * | (_| | (_) | (__| |_| | | | | | |  __/ | | | |_  | | |  __/ (_| | (_| | |_| |
	 *  \__,_|\___/ \___|\__,_|_| |_| |_|\___|_| |_|\__| |_|  \___|\__,_|\__,_|\__, |
	 *                                                                         |___/ 
	 */
		
window.initializeEvents = function(){
	
	jQuery(document).ready(function($) {
		console.log("Initializing DocReady");
		
		/* Hook soft links */
		$('.hook').on('click', function(e){
			e.preventDefault();
			app.showLoader();
			if( $(this).data('resource') == "entermode" )
				return app.render_entermode( $(this).attr('href') );
			if( $(this).data('resource') == "login" )
				return app.render_login( $(this).attr('href') );
			if( $(this).data('resource') == "register" )
				return app.render_register( $(this).attr('href') );

			e.stopPropagation();
		});
	});

}
