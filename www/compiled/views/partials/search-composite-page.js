!function(){var n=Handlebars.template,l=Handlebars.templates=Handlebars.templates||{};l["search-composite-page"]=n({1:function(n,l,a,e,r){var i,t,s=null!=l?l:{},u=a.helperMissing,c="function",o=n.escapeExpression;return'		<a href="detail.html?id='+o((t=null!=(t=a.ID||(null!=l?l.ID:l))?t:u,typeof t===c?t.call(s,{name:"ID",hash:{},data:r}):t))+'" class="small link">\n			<img src="'+o((t=null!=(t=a.thumb_url||(null!=l?l.thumb_url:l))?t:u,typeof t===c?t.call(s,{name:"thumb_url",hash:{},data:r}):t))+'">\n			<div>\n'+(null!=(i=a["if"].call(s,null!=(i=null!=l?l.designer_brand:l)?i.profile_pic:i,{name:"if",hash:{},fn:n.program(2,r,0),inverse:n.program(4,r,0),data:r}))?i:"")+"				<h1>"+o((t=null!=(t=a.product_title||(null!=l?l.product_title:l))?t:u,typeof t===c?t.call(s,{name:"product_title",hash:{},data:r}):t))+"</h1>\n				<span>"+o(n.lambda(null!=(i=null!=l?l.designer_brand:l)?i.name:i,l))+"</span>\n				<h2>$ "+o((t=null!=(t=a.price||(null!=l?l.price:l))?t:u,typeof t===c?t.call(s,{name:"price",hash:{},data:r}):t))+"</h2>\n			</div>\n		</a>\n"},2:function(n,l,a,e,r){var i;return'					<img src="'+n.escapeExpression(n.lambda(null!=(i=null!=l?l.designer_brand:l)?i.profile_pic:i,l))+'" class="profile_pic round" />\n'},4:function(n,l,a,e,r){return'					<i class="material-icons account_circle invert" ></i>\n'},6:function(n,l,a,e,r){return'		<p class="message big">There are no products in this category</p>\n'},compiler:[7,">= 4.0.0"],main:function(n,l,a,e,r){var i,t=null!=l?l:{};return"<section>\n\n"+(null!=(i=a.each.call(t,null!=(i=null!=l?l.data:l)?i.pool:i,{name:"each",hash:{},fn:n.program(1,r,0),inverse:n.noop,data:r}))?i:"")+"\n"+(null!=(i=(a.if_eq||l&&l.if_eq||a.helperMissing).call(t,0,null!=(i=null!=l?l.data:l)?i.count:i,{name:"if_eq",hash:{},fn:n.program(6,r,0),inverse:n.noop,data:r}))?i:"")+"\n</section>"},useData:!0})}();