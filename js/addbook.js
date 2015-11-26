$(function() {
    $.getJSON("./publish.json", function(data) {
        var publish = data.publish;
        $("#publish").append('<option value=""></option>');
        for (var i = 0; i < publish.length; i++) {
            $("#publish").append(['<option value="', publish[i], '">', publish[i], '</option>'].join(""));
        }
    });
    $("form").submit(function(e) {
        e.preventDefault(); //阻止默认事件
        var bookName = $("#bookName").val();
        var author = $("#author").val();
        var publish = $("#publish").val();
        var img = $("img").val();
        var patt = /^\s*$/;
        if (patt.test(bookName)) {
            $("#bkn-null").css("display", "block");
        } else {
            $("#bkn-null").css("display", "none");
        }
        if (bookName.length > 15) {
            $("#bkn-len").css("display", "block");
        } else {
            $("#bkn-len").css("display", "none");
        }
        if (patt.test(author)) {
            $("#auth-null").css("display", "block");
        } else {
            $("#auth-null").css("display", "none");
        }
        if (author.length > 15) {
            $("#auth-len").css("display", "block");
        } else {
            $("#auth-len").css("display", "none");
        }
        if (patt.test(publish)) {
            $("#publish-null").css("display", "block");
        } else {
            $("#publish-null").css("display", "none");
        }
        if (patt.test(img)) {
            $("#img-null").css("display", "block");
        } else {
            $("#img-null").css("display", "none");
        }
    });
});

function checkForm(e) {
    e.preventDefault(); //阻止默认事件
    var bookName = $("#bookName").val();
    var author = $("#author").val();
    var publish = $("#publish").val();
    var img = $("img").val();
    var patt = /^\s*$/;
    if (patt.test(bookName)) {
        $("#bkn-null").css("display", "block");
    } else {
        $("#bkn-null").css("display", "none");
    }
    if (bookName.length > 15) {
        $("#bkn-len").css("display", "block");
    } else {
        $("#bkn-len").css("display", "none");
    }
    if (patt.test(author)) {
        $("#auth-null").css("display", "block");
    } else {
        $("#auth-null").css("display", "none");
    }
    if (author.length > 15) {
        $("#auth-len").css("display", "block");
    } else {
        $("#auth-len").css("display", "none");
    }
    if (patt.test(publish)) {
        $("#publish-null").css("display", "block");
    } else {
        $("#publish-null").css("display", "none");
    }
    if (patt.test(img)) {
        $("#img-null").css("display", "block");
    } else {
        $("#img-null").css("display", "none");
    }
}
