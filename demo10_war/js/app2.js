$(function () {
    // form 태그에서 submit 타입의 이벤트를 처리한다.
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    // connect 버튼 클릭 시 connect() 함수 호출
    $( "#connect" ).click(function() { connect(); });
    // disconnect 버튼 클릭 시 disconnect() 함수 호출
    $( "#disconnect" ).click(function() { disconnect(); });
    // send 버튼 클릭 시 sendName() 함수 호출
    $( "#send" ).click(function() { sendName(); });
});