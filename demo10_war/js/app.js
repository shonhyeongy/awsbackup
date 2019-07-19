// stomp client session을 전역 변수로 선언
var stompClient = null;


// 웹소켓 연결 상태에 따라
// connect 버튼과 disconnect 버튼을 활성화/비활성화 한다.
function setConnected(connected) {
    // connect, disconnect 버튼 활성화 비활성화
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);

    // 연결된 상태이면 table show
    // 아니면 table hide
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }

    // table body 초기화
    $("#greetings").html("");
}


// 웹소켓으로 서버에 접속한다.
function connect() {
    // 서버소켓의 endpoint인 "/gs-guide-websocket"로 접속할 클라이언트 소켓 생성
    var socket = new SockJS('/demo10_war/gs-guide-websocket');


    // 전역 변수에 세션 설정
    stompClient = Stomp.over(socket);
    var d = new Date();
    var n = d.getTime();

    stompClient.token = n;

    // STOMP frame : 프레임은 Command로 시작한다.
    // Command의 끝은 캐리지 리턴과 라인피드를 포함하는 EOL(end-of-line)로 구분할 수 있다.
    // 프레임은 <key>:<value> 형식을 따르는 하나 이상의 옵션들을 가질 수 있다.
    // 각 옵션은 EOL로 끝나며, 공백 줄을 하나 더 추가하는 것으로 헤더의 끝을 설정할 수 있다.
    // 데이터는 Body에 위치하는데, 끝은 NULL 문자로 설정한다.
    // The examples in this document will use ^@, control-@ in ASCII, to represent the NULL octet.
    //---------------------
    // COMMAND
    // header1:value1
    // header2:value2
    //
    // Body^@
    //---------------------
    stompClient.connect({token : "AAA"}, function (frame) {
        frame.token = "AAA";
        setConnected(true);

        var data1 = httpGet("/demo10_war/ChatGet");
        data1 = data1.toString();
        console.log(data1);

        var contact = JSON.parse(data1);
        var total = contact[-1];
        for (var a =0 ; a<total; ++a ){
            showGreeting(contact[a]);
        }






        // 콘솔 출력 결과는 다음과 같다.
        // Connected: CONNECTED
        // heart-beat:0,0
        // version:1.1


        // 토픽이 "/topic/greetings"로 수신되는 메시지는 showGreeting 함수로 처리하도록 stompClient에 등록.
        stompClient.subscribe('/topic/greetings', function (message) {
            // 콘솔 출력 결과는 다음과 같다.
            // connect() message: MESSAGE
            // content-length:29
            // message-id:ffeun5xz-0
            // subscription:sub-0
            // content-type:application/json;charset=UTF-8
            // destination:/topic/greetings
            // content-length:29
            //
            // {"content":"Hello, testman!"}
            console.log('connect() message: ' + message);
            // 서버로 부터 수신한 message의 body를 json으로 파싱해서 showGreeting() 함수로 처리한다.
            showGreeting(JSON.parse(message.body).content);
        });
    });
}


// 서버와의 소켓 연결을 끊는다.

function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }

    setConnected(false);
    console.log("Disconnected");
}


// send 버튼을 클릭했을 때 처리할 함수를 정의한다.
function sendName() {
    // 연결된 세션으로 전송한다.
    // 대상 토픽을 "/app/hello"로 정의 했지만 서버에서는 WebSocketConfig.java에 설정된 prefix가 적용되어 "/topic/app/hello"로 처리됨.
    // 'name'은 속성의 key 값으로 HelloMessage.java의 name 필드와 이름을 맞춘것이다.
    // '#name'은 속성의 value 값으로 index.html의 input id="name"과 이름을 맞춘것이다.
    stompClient.send("/app/hello", {}, JSON.stringify({'name': $("#name").val(),'token':stompClient.token}));

    console.log(stompClient.token);


}
// 서버로 부터 수신한 메시지를 웹브라우저에 출력한다.
function showGreeting(message) {
    // '#greetings'는 index.html의 tbody id="greetings"이다.
    // 즉 메시지를 수신할 때마다 테이블의 row가 추가된다.
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}





