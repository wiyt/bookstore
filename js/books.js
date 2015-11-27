"use strict";
$(function() {
    var url = decodeURI(location.search);
    var patt = /\?id=(\d+)$/; //详情书籍id，搜索模式
    var keywordPatt = /\?.*keyword=(\S+)/; //搜索关键字，搜索模式
    var bookID = url.match(patt) ? url.match(patt)[1] : null;
    var keyword = url.match(keywordPatt) ? url.match(keywordPatt)[1] : null;
    var bookCache = []; //当前页面书籍缓存变量
    $("#searchBtn").click(function() {
        var keyword = document.getElementById("keyword").value;
        search(keyword);
    });
    $("#keyword").bind("input", function() {
        var keyword = this.value;
        search(keyword);
    });
    $("#addBook").click(function() {
        loadForm("add");
    });
    $("#home").click(function() {
        addBooksToContent(bookCache);
    });
    if (bookID !== null) {
        setBookCache();
        getBookDetail(bookID);
    } else {
        setBookCache();
        addBooksToContent(bookCache);
        if (keyword !== null) {
            $("#keyword").attr("placeholder", keyword);
            search(keyword);
        }
    }

    // 设置书籍列表缓存
    function setBookCache() {
        $.ajaxSettings.async = false; //设置ajax同步执行
        $.getJSON("./books.json", function(data) {
            var books = data.books;
            // 缓存书籍列表
            if (books.length) {
                bookCache = books;
            }
        });
        $.ajaxSettings.async = true;
    }

    // 向页面中加载书籍
    function addBooksToContent(books) {
        var styleId = 1;
        var html = ["<h3>重磅推荐",
            "<button id=\"list-style\" class=\"btn btn-default btn-xs\">",
            "<span class=\"glyphicon glyphicon-th-list\"></span>",
            "</button>",
            "</h3>",
            "<div class=\"booksBox\">",
            "<ul class=\"booklist\"></ul>",
            "</div>"
        ].join("");
        $(".content").html(html);
        $("#list-style").click(function() {
            $(".booklist").empty();
            var button = $(this);
            var icon = button.children().attr("class");
            if (icon == "glyphicon glyphicon-th-list") {
                button.children().attr("class", "glyphicon glyphicon-th");
                var table = ["<table class=\"table\">",
                    "<tr>",
                    "<th></th>",
                    "<th>书名</th>",
                    "<th>作者</th>",
                    "<th>类别</th>",
                    "<th>出版社</th>",
                    "<th>出版时间</th>",
                    "<th>价钱</th>",
                    "</tr>",
                    "</table>"
                ].join("");
                $(".booksBox").html(table);
                console.log($(".booksBox").html());
                styleId = 2;
                addBooks();
            } else {
                button.children().attr("class", "glyphicon glyphicon-th-list");
                var booklist = "<ul class=\"booklist\"></ul>";
                $(".booksBox").html(booklist);
                styleId = 1;
                addBooks();
            }
        });
        addBooks();

        function addBooks() {
            var bookRowID = 0;
            for (var i = 0; i < books.length; i++) {
                var bookID = books[i].bookID;
                var imgUrl = books[i]["img-url"];
                var bName = books[i].name;
                var author = books[i].author;
                var content = books[i].intro.content;
                var publish = books[i].publish;
                var pubTime = books[i].pubTime;
                var bPrice = books[i].price;
                var category = books[i].category;
                var bookHtml = "";
                if (styleId == 2) {
                    bookHtml = ["<tr>",
                        "<td>",
                        "<img src=\"", imgUrl, "\">",
                        "<button class=\"edit btn btn-default btn-xs\">",
                        "<span class=\"glyphicon glyphicon-pencil\"></span>",
                        "</button>",
                        "<button class=\"delete btn btn-default btn-xs\">",
                        "<span class=\"glyphicon glyphicon-minus\"></span>",
                        "</button>",
                        "</td>",
                        "<td>",
                        "<a class=\"booksdetail\" href=\"?id=", bookID, "\" bookID=\"", bookID, "\">", bName, "</a>",
                        "</td>",
                        "<td>", author, "</td>",
                        "<td>", category, "</td>",
                        "<td>", publish, "</td>",
                        "<td>", pubTime, "</td>",
                        "<td>", bPrice, "</td>",
                        "</tr>"
                    ].join("");
                    $(".table").append(bookHtml);
                } else if (styleId == 1) {
                    bookHtml = ["<div class=\"book col-sm-6 col-md-3\">",
                        "<div class=\"b-img\">",
                        "<img src=\"", imgUrl, "\" alt=\"\"><br>",
                        "<button class=\"edit btn btn-default btn-xs\">",
                        "<span class=\"glyphicon glyphicon-pencil\"></span>",
                        "</button>",
                        "<button class=\"delete btn btn-default btn-xs\">",
                        "<span class=\"glyphicon glyphicon-minus\"></span>",
                        "</button>",
                        "</div>",
                        "<div class=\"b-name\">",
                        "<a class=\"booksdetail\" href=\"?id=", bookID, "\" bookID=\"", bookID, "\">", bName, "</a>",
                        "</div>",
                        "<div class=\"b-price\">",
                        "<span class=\"price\">¥", bPrice, "</span>",
                        "</div>",
                        "</div>"
                    ].join("");
                    if ((i + 4) % 4 === 0) {
                        bookRowID++;
                        var bookRow = "<li class=\"row r" + bookRowID + "\"></li>";
                        $(".booklist").append(bookRow);
                    }
                    $(".booklist li.r" + bookRowID + "").append(bookHtml);
                }
            }
            // 加载全部书籍之后绑定两个按钮的click事件
            $(".delete").click(function() {
                deleteBook($(this).parent().parent());
            });
            $(".edit").click(function() {
                editBook($(this).parent().parent());
            })
        }
    }

    // 加载书本详细信息
    function getBookDetail(bookID) {
        var book;
        for (var i = 0; i < bookCache.length; i++) {
            if (bookID == bookCache[i].bookID) {
                book = bookCache[i];
            }
        }
        if (book) {
            $(".content").load("./bookdetail.html", function() {
                $(".img").attr("src", book["img-url"]);
                $(".bookName").text(book.name);
                $(".lang").text(book.lang);
                $(".publish").text(book.publish);
                $(".pubTime").text(book.pubTime);
                $(".category").text(book.category);
                $(".price").text(book.price);
                $(".intro .abtract").text(book.intro.abtract);
                $(".intro .content").text(book.intro.content);
                $(".intro .authorintro").text(book.intro.authorintro);
                $(".intro .catalog").text(book.intro.catalog);
            });
        } else {
            window.location = "./";
        }

    }

    // 搜索功能
    function search(keyword) {
        // setBookCache();
        var searchResultlist = [];
        var reg = new RegExp(keyword, "m");
        for (var i = 0; i < bookCache.length; i++) {
            if (reg.test(bookCache[i].name)) {
                searchResultlist.push(bookCache[i]);
                continue;
            }
            if (reg.test(bookCache[i].author)) {
                searchResultlist.push(bookCache[i]);
                continue;
            }
            if (reg.test(bookCache[i].category)) {
                searchResultlist.push(bookCache[i]);
                continue;
            }
            if (reg.test(bookCache[i].publish)) {
                searchResultlist.push(bookCache[i]);
                continue;
            }
        }
        addBooksToContent(searchResultlist);
        $(".content h3").text("搜索结果");
    }

    //添加书籍
    function addBook(bName, author, publish, img) {
        var book = {
            bookID: bookCache.length + 1,
            name: bName,
            author: author,
            "img-url": img,
            intro: ""
        };
        bookCache.push(book);
        addBooksToContent(bookCache);
    }
    //删除书籍
    function deleteBook(book) {
        book.remove();
        var bookID = book.find(".booksdetail").attr("bookID");
        for (var i = 0; i < bookCache.length; i++) {
            if (bookID == bookCache[i].bookID) {
                bookCache.splice(i, 1);
            }
        }
    }
    // 编辑书籍
    function editBook(book) {
        var book = bookCache[book.find(".booksdetail").attr("bookID") - 1];
        loadForm("edit", book);
        $("#bookName").val(book.name);
        $("#author").val(book.author);
        $("#bookName").val(book.name);
        $("#author").val(book.author);
    }
    //加载表单
    function loadForm(sign, book) {
        // var sign = arguments[0];
        // var book = arguments[1];
        $.ajaxSettings.async = false;
        $(".content").load("./form.html", function() {
            $.getJSON("./publish.json", function(data) {
                var publish = data.publish;
                $("#publish").append('<option value=""></option>');
                for (var i = 0; i < publish.length; i++) {
                    $("#publish").append(['<option value="', publish[i], '">', publish[i], '</option>'].join(""));
                }
            });
            checkFormSubmit(sign, book);
            checkFormBlur();
            $("#cancel").click(function(e) {
                e.preventDefault();
                addBooksToContent(bookCache);
            });
        });
        $.ajaxSettings.async = true;
    }
    //表带验证

    function checkFormSubmit(sign, book) {
        $("form").submit(function(e) {
            e.preventDefault(); //阻止默认事件
            var result = true; //验证结果
            var bookName = $("#bookName").val();
            var author = $("#author").val();
            var publish = $("#publish").val();
            var img = $("img").val();
            var patt = /^\s*$/;
            if (patt.test(bookName)) {
                $("#bkn-null").css("display", "block");
                result = false;
            } else {
                $("#bkn-null").css("display", "none");
            }
            if (bookName.length > 15) {
                $("#bkn-len").css("display", "block");
                result = false;
            } else {
                $("#bkn-len").css("display", "none");
            }
            if (patt.test(author)) {
                $("#auth-null").css("display", "block");
                result = false;
            } else {
                $("#auth-null").css("display", "none");
            }
            if (author.length > 15) {
                $("#auth-len").css("display", "block");
                result = false;
            } else {
                $("#auth-len").css("display", "none");
            }
            if (patt.test(publish)) {
                $("#publish-null").css("display", "block");
                result = false;
            } else {
                $("#publish-null").css("display", "none");
            }
            if (patt.test(img)) {
                $("#img-null").css("display", "block");
            } else {
                $("#img-null").css("display", "none");
            }
            result = [result, bookName, author, publish, img];
            if (result[0] && sign === "add")
                addBook(result[1], result[2], result[3], result[4]);
            if (result[0] && sign === "edit") {
                book.name = bookName;
                book.author = author;
                book.publish = publish;
                addBooksToContent(bookCache);
            }
        });
    }

    function checkFormBlur() {
        $("form input").blur(function() {
            var val = $(this).val();
            var alert = $(this).nextAll();
            if (/^\s*$/.test(val)) {
                $(alert[0]).css("display", "block");
            } else {
                $(alert[0]).css("display", "none");
            }
            if (val.length > 15) {
                $(alert[1]).css("display", "block");
            } else {
                $(alert[1]).css("display", "none"); 
            }
        });
        $("form select").blur(function() {
            if ($(this).val().length === 0) {
                $("#publish-null").css("display", "block");
            } else {
                $("#publish-null").css("display", "none");
            }
        });
    }
});
