//"use strict";

var currentUser;

function connectToChat(user) {

	// Create session and connect to chat
	QB.createSession({ email: user.login, password: user.pass }, function(err, res) {

		currentUser = user;
		if (res) {

			token = res.token;
			console.log("Token :: "+token);
			user.id = res.user_id;
			console.log("Userid :: "+user.id);

			mergeUsers([{user: user}]);

			QB.chat.connect({userId: user.id, password: user.pass}, function(err, roster) {

				app.keeper.setItem('idSender', user.id);
				if (err) {
					console.log(err);
				} else {

					console.log("roster "+roster);

					retrieveChatDialogs();

					setupAllListeners();

					setupMsgScrollHandler();

					app.hideLoader();
				}
			});
		}
	});
};

function setupAllListeners() {
	QB.chat.onDisconnectedListener    = onDisconnectedListener;
	QB.chat.onReconnectListener       = onReconnectListener;
	QB.chat.onMessageListener         = onMessage;
	QB.chat.onSystemMessageListener   = onSystemMessageListener;
	QB.chat.onDeliveredStatusListener = onDeliveredStatusListener;
	QB.chat.onReadStatusListener      = onReadStatusListener;
	setupIsTypingHandler();
};

// reconnection listeners
function onDisconnectedListener(){
	console.log("onDisconnectedListener");
};

function onReconnectListener(){
	console.log("onReconnectListener");
};