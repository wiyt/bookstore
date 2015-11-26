$(function() {
    var url = decodeURI(location.search);
    var patt = /\?id=(\d+)$/; //详情书籍id，搜索模式
    var keywordPatt = /\?.*keyword=(\S+)/; //搜索关键字，搜索模式
    var bookID = url.match(patt) ? url.match(patt)[1] : null;
    var keyword = url.match(keywordPatt) ? url.match(keywordPatt)[1] : null;
    var bookCache = []; //当前页面书籍缓存变量
    $("#searchBtn").click(function() {
        var keyword = document.getElementById("keyword").value;
        search(keyword, bookCache);
    });
    $("#keyword").bind("input", function() {
        var keyword = this.value;
        search(keyword, bookCache);
    });
    $("#addBook").click(function() {
        $(".content").load("./addform.html", function() {
            $.getJSON("./publish.json", function(data) {
                var publish = data.publish;
                $("#publish").append('<option value=""></option>');
                for (var i = 0; i < publish.length; i++) {
                    $("#publish").append(['<option value="', publish[i], '">', publish[i], '</option>'].join(""));
                }
                checkFormBlur();
            });
            checkFormSubmit();
        });
    });
    $("#home").click(function() {
        addBooksToContent(bookCache);
    });
    if (bookID != null) {
        getBookDetail(bookID);
    } else {
        $.getJSON("./books.json", function(data) {
            var books = data.books;
            // 缓存书籍列表
            if (books.length) {
                bookCache = books;
            }
            addBooksToContent(books);
        });
        if (keyword != null){
            setTimeout(function() {
                $("#keyword").attr("placeholder", keyword);
                search(keyword, bookCache);
            });
        }
    }

    // 向页面中加载书籍
    function addBooksToContent(books) {
        var bookRowID = 0;
        var styleId = 1;
        var html = ['<h3>重磅推荐',
            '<button id="list-style" class="btn btn-default btn-xs">',
            '<span class="glyphicon glyphicon-th-list"></span>',
            '</button>',
            '</h3>',
            '<div class="booksBox">',
            '<ul class="booklist"></ul>',
            '</div>'
        ].join("");
        $(".content").html(html);
        $("#list-style").click(function() {
            $(".booklist").empty();
            var button = $(this);
            var icon = button.children().attr("class");
            if (icon == "glyphicon glyphicon-th-list") {
                button.children().attr("class", "glyphicon glyphicon-th");
                var table = ['<table class="table">',
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
                var booklist = '<ul class="booklist"></ul>';
                $(".booksBox").html(booklist);
                styleId = 1;
                addBooks();
            }
        });
        addBooks();

        function addBooks() {
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
                var bookHtml = '';
                if (styleId == 2) {
                    bookHtml = ["<tr>",
                        '<td>',
                        '<img src="', imgUrl, '">',
                        '<button class="edit btn btn-default btn-xs">',
                        '<span class="glyphicon glyphicon-pencil"></span>',
                        '</button>',
                        '<button class="delete btn btn-default btn-xs">',
                        '<span class="glyphicon glyphicon-minus"></span>',
                        '</button>',
                        '</td>',
                        "<td>",
                        '<a class="booksdetail" href="?id=', bookID, '" bookID="', bookID, '">', bName, '</a>',
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
                    bookHtml = ['<div class="book col-sm-6 col-md-3">',
                        '<div class="b-img">',
                        '<img src="', imgUrl, '" alt=""><br>',
                        '<button class="edit btn btn-default btn-xs">',
                        '<span class="glyphicon glyphicon-pencil"></span>',
                        '</button>',
                        '<button class="delete btn btn-default btn-xs">',
                        '<span class="glyphicon glyphicon-minus"></span>',
                        '</button>',
                        '</div>',
                        '<div class="b-name">',
                        '<a class="booksdetail" href="?id=', bookID, '" bookID="', bookID, '">', bName, '</a>',
                        '</div>',
                        '<div class="b-price">',
                        '<span class="price">¥', bPrice, '</span>',
                        '</div>',
                        '</div>'
                    ].join("");
                    if ((i + 4) % 4 == 0) {
                        bookRowID++;
                        var bookRow = '<li class="row ' + bookRowID + '"></li>'
                        $(".booklist").append(bookRow);
                    }
                    $(".booklist li.row." + bookRowID + "").append(bookHtml);
                }
            }
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
        $.getJSON("books.json", function(data) {
            var books = data.books;

            for (var i = 0; i < books.length; i++) {
                if (bookID == books[i].bookID) {

                    book = books[i];
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
                window.location = "./"
            }
        });

    }

    // 搜索功能
    function search(keyword, bookCache) {
        var booklist;
        var searchResultlist = [];
        var reg = RegExp(keyword, "m");
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
        // });
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
        bookCache.splice(bookID - 1, 1);
    }
    // 编辑书籍
    function editBook(book) {
        var bookID = book.find(".booksdetail").attr("bookID") - 1;
        $(".content").load("./addform.html", function() {
            $("#bookName").val(bookCache[bookID].name);
            $("#author").val(bookCache[bookID].author);
            $.getJSON("./publish.json", function(data) {
                var publish = data.publish;
                $("#publish").append('<option value=""></option>');
                for (var i = 0; i < publish.length; i++) {
                    $("#publish").append(['<option value="', publish[i], '">', publish[i], '</option>'].join(""));
                }
            });
            checkFormSubmit();
            checkFormBlur();
        });
    }
    //表带验证

    function checkFormSubmit() {
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
            var a = [result, bookName, author, publish, img];

            var result = checkForm(e);
            if (a[0])
                addBook(a[1], a[2], a[3], a[4]);
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
            if ($(this).val().length == 0) {
                $("#publish-null").css("display", "block");
            } else {
                $("#publish-null").css("display", "none");
            }
        });
    }
});
