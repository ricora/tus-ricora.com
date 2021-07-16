var xhr_news = new XMLHttpRequest();
// xmlへのパス
var log = 'news/news.xml';

function loadXML_news (url,xhr) {
    xhr.open('GET', url, true);
    xhr.send();
    xhr.onprogress = function() {
        console.log("Downloading News Log...");
    }
    xhr.onload = function() {
        console.log("DownLoad of News Log finished");
    }
    xhr.onloadend = function() {
        console.log("Download of News Log completed");
    }
}

function loadXMLfromString_news (str) {
    var items = [];
    var parser = new DOMParser();
    var log = parser.parseFromString(str, 'text/xml');
    var items_dom = log.getElementsByTagName('item');
    for (var i = 0; i < items_dom.length; i++) {
        var item = {};
        item.date          = items_dom[i].getElementsByTagName('date')[0].textContent;
        item.simple_date   = function(fulldate) {
            var date = new Date(fulldate);
            var weekly = ['日', '月', '火', '水', '木', '金', '土'];
            var m = ("0" + (date.getMonth() + 1)).slice(-2);
            var d = ("0" + date.getDate()).slice(-2);
            var w = weekly[date.getDay()];
            return m + "/" + d + "(" + w + ")";
        }.call(this, items_dom[i].getElementsByTagName('date')[0].textContent);
        item.title         = items_dom[i].getElementsByTagName('title')[0].innerHTML;
        item.content       = items_dom[i].getElementsByTagName('content')[0].innerHTML;
        item.state         = function(date1, date2) { return (date1 - date2) / 86400000 > 21 ? "old" : "new" }.call(this, new Date(), new Date(item.date));
        items.push(item);
    }
    return items;
}

function process_news (items) {
    var html = document.getElementById('news').getElementsByClassName('box-scrollbar')[0];
    html.innerHTML = "";
    for (var i = 0; i < items.length; i++ ) {
        var input = document.createElement('input');
        input.id = "ac" + (i + 1);
        input.className = "ac-check";
        input.type = "checkbox";
        var label = document.createElement('label');
        label.className = items[i].state + " ac-label";
        label.htmlFor = input.id;
        label.innerHTML = items[i].simple_date + " " + items[i].title;
        var content = document.createElement('div');
        content.className = "ac-content";
        var p = document.createElement('p');
        p.innerHTML = items[i].content;
        html.appendChild(input);
        html.appendChild(label);
        content.appendChild(p);
        html.appendChild(content);
    }
}

loadXML_news(log, xhr_news);

(function waitLoadXML_news (cnt) {
    if (xhr_news.responseText) {
        process_news(loadXMLfromString_news(xhr_news.responseText));
        return 0;
    }
    if (cnt > 10) {
        console.log("TOO LATE");
	    document.getElementById('news').getElementsByClassName('box-scrollbar')[0].innerHTML = "<center> <p> お知らせが取得できません </p> </center>"
        return 1;
    }
    setTimeout(function(){ waitLoadXML_news(cnt++); },5000);
})(0);
