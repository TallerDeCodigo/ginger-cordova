!function(){var a=Handlebars.template,e=Handlebars.templates=Handlebars.templates||{};e["footer"]=a({1:function(a,e,n,l,i){return'class="active"'},compiler:[7,">= 4.0.0"],main:function(a,e,n,l,i){var t,r=null!=e?e:{};return'<footer>\n	<a href="feed.html" '+(null!=(t=n["if"].call(r,null!=e?e.home_active:e,{name:"if",hash:{},fn:a.program(1,i,0),inverse:a.noop,data:i}))?t:"")+'><i class="material-icons home"></i></a>\n	<a href="search.html" '+(null!=(t=n["if"].call(r,null!=e?e.search_active:e,{name:"if",hash:{},fn:a.program(1,i,0),inverse:a.noop,data:i}))?t:"")+'><i class="material-icons search"></i></a>\n	<a class="always_selected" href="direct_photo.html"><i class="material-icons photo_camera invert"></i></a>\n	<a href="map.html" '+(null!=(t=n["if"].call(r,null!=e?e.explore_active:e,{name:"if",hash:{},fn:a.program(1,i,0),inverse:a.noop,data:i}))?t:"")+'><i class="material-icons explore"></i></a>\n	<a href="notifications.html" '+(null!=(t=n["if"].call(r,null!=e?e.notifications_active:e,{name:"if",hash:{},fn:a.program(1,i,0),inverse:a.noop,data:i}))?t:"")+'><i class="material-icons notifications"></i></a>\n</footer>'},useData:!0})}();