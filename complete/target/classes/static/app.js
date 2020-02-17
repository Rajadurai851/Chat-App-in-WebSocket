var stompClient = null;
var person;

function init() {
	connect();
}

function setConnected() {
	 person = prompt("Please enter your name", "Harry Potter");
	
	if(!person) {
		person = "Harry Potter";
	}
	$("#userName").html("Logged in as <b>"+person+"!</b>");
}

function connect() {
    var socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/greetings', function (greeting) {
            showGreeting(JSON.parse(greeting.body).content);
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}




function sendName() {
    stompClient.send("/app/hello", {}, JSON.stringify({'name': $("#name").val(),'msg':person}));
}

function showGreeting(message) {
	$("#name").val("");
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
   
    $( "#send" ).click(function() { sendName(); });
});

