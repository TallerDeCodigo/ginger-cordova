// build html for messages
function buildMessageHTML(messageText, messageSenderId, messageDateSent, attachmentFileId, messageId, status){

  var messageAttach;
  // var date = new Date(messageDateSent);
  if(attachmentFileId){
	  messageAttach = '<a href="http://api.quickblox.com/blobs/'+attachmentFileId+'/download.xml?token='+token+'"><img src="http://api.quickblox.com/blobs/'+attachmentFileId+'/download.xml?token='+token+'" alt="attachment" class="attachments img-responsive" /></a>';
  }

	var isMessageSticker = ""; //stickerpipe.isSticker(messageText);

  var delivered = '<img class="icon-small" src="images/delivered.jpg" alt="" id="delivered_'+messageId+'">';
  // var read = '';
  // if(status)
  //   read = (messageDateSent && status) '<i class="material-icons">done</i>';

  console.log("Statuss ::: "+status);
  console.log("Statuss ::: "+messageDateSent);
	var messageTextHtml = messageText;
	if (messageAttach) {
		messageTextHtml = messageAttach;
	} else if (isMessageSticker) {
		messageTextHtml = '<div class="message-sticker-container"></div>';
	}

  var sender = (localStorage.getItem('idSender') == messageSenderId) ? 'outgoing' : 'incoming';  
  console.log('Mensaje ID SENDER: ' + messageSenderId);
  console.log( localStorage.getItem('idSender') );
  console.log(sender);
  var messageHtml = '<div class="list-group-item" id="'+messageId+'" onclick="clickToAddMsg('+"'"+messageId+"'"+')">'+
						'<div class="'+ sender +'">' +
						'<p>' + messageTextHtml + '</p>'+
						'</div>' + 
					'</div>'+
					'<div class="clearfix"></div>';
  return messageHtml;
}


// build html for dialogs
function buildDialogHtml(dialogId, dialogUnreadMessagesCount, dialogIcon, dialogName, dialogLastMessage) {
  // var UnreadMessagesCountShow = '<span class="badge">'+dialogUnreadMessagesCount+'</span>';
  // UnreadMessagesCountHide = '<span class="badge" style="display: none;">'+dialogUnreadMessagesCount+'</span>';

  var UnreadMessagesCountShow = '<div class="no-leido">';
  UnreadMessagesCountHide = '<div class="leido">';

  var isMessageSticker = ""; //stickerpipe.isSticker(dialogLastMessage);

  //var dialogHtml ='<a href="#" class="list-group-item inactive" id='+'"'+dialogId+'"'+' onclick="triggerDialog('+"'"+dialogId+"'"+')">'+(dialogUnreadMessagesCount === 0 ? UnreadMessagesCountHide : UnreadMessagesCountShow)+'<h4 class="list-group-item-heading">'+ dialogIcon+'&nbsp;&nbsp;&nbsp;' +'<span>'+dialogName+'</span>' +'</h4>'+'<p class="list-group-item-text last-message">'+(dialogLastMessage === null ?  "" : (isMessageSticker ? 'Sticker' : dialogLastMessage))+'</p>'+'</a>';
  
  var dialogHtml = '<a href="#" class="list-group-item inactive" id='+'"'+dialogId+'"'+' onclick="triggerDialog('+"'"+dialogId+"'"+');" ><li class="persona"><div class="circle-frame"><img src="images/muestra.png"></div><h5>'+dialogName+'</h5><p>'+(dialogLastMessage === null ?  "" : (isMessageSticker ? 'Sticker' : dialogLastMessage))+'</p>'+(dialogUnreadMessagesCount === 0 ? UnreadMessagesCountHide : UnreadMessagesCountShow)+'12:06</div></li><a/>';
  return dialogHtml;
}

// build html for typing status
function buildTypingUserHtml(userId, userLogin) {
  var typingUserHtml =
	  '<div id="'+userId+'_typing" class="list-group-item typing">'+
		'<time class="pull-right">writing now</time>'+
		'<h4 class="list-group-item-heading">'+ userLogin+'</h4>'+
		'<p class="list-group-item-text"> . . . </p>'+
	  '</div>';

  return typingUserHtml;
}

// build html for users list
function buildUserHtml(userLogin, userId, isNew) {
  var userHtml = "<a href='#' id='" + userId;
  if(isNew){
	userHtml += "_new'";
  }else{
	userHtml += "'";
  }
  userHtml += " class='col-md-12 col-sm-12 col-xs-12 users_form' onclick='";
  userHtml += "clickToAdd";
  userHtml += "(\"";
  userHtml += userId;
  if(isNew){
	userHtml += "_new";
  }
  userHtml += "\")'>";
  userHtml += userLogin;
  userHtml +="</a>";

  return userHtml;
}

/* Hide keyboard on scroll */
$('#messages-list').scroll( function(){
	console.log("scrollin keyboard:: "+window.openKeyboard);
	if(window.openKeyboard) Keyboard.hide();
});
