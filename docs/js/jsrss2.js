
var xhr = new XMLHttpRequest();
var rss1 = './feed';
var rss2 = './feed2';

function loadXML (url) {
    xhr.open('GET', url, true);
    xhr.send();
    xhr.onprogress = function() {
        console.log("Downloading...");
    }
    xhr.onload = function() {
        console.log("DownLoad finished");
    }
    xhr.onloadend = function() {
        console.log("Download completed");
    }
}

function loadXMLfromArray (arr) {
    console.log("loadXMLfromArray");
    arr.map(loadXML);
}

function loadXMLfromString (str) {
    var entries = [];
    var parser = new DOMParser();
    var rss = parser.parseFromString(str, 'text/xml');
    var linksInRSS = rss.getElementsByTagName('link');
    var author_name = rss.getElementsByTagName('author')[0].getElementsByTagName('name')[0].textContent;
    var rssurl = linksInRSS[0].getAttribute('href');
    var entries_dom = rss.getElementsByTagName('entry');
    for (var i = 0; i < entries_dom.length; i ++) {
	var entry = {};
	entry.rss       = rssurl;
	entry.title     = entries_dom[i].getElementsByTagName('title')[0].textContent;
	entry.author    = author_name; 
	entry.published = function(date) {
	    var weekly = ['日', '月', '火', '水', '木', '金', '土'];
	    var y = date.getFullYear();
	    var m = date.getMonth() + 1;
	    var d = date.getDate();
	    var w = weekly[date.getDay()];

	    return y + "/" + m + "/" + d + "(" + w + ")";
	}.call(this, new Date(entries_dom[i].getElementsByTagName('published')[0].textContent));

	entry.summary   = entries_dom[i].getElementsByTagName('summary')[0].textContent;
	entries.push(entry);
    }
    return entries;
}

function process (entries) {
    console.log("process");
    var html = document.getElementById('blog').getElementsByClassName('blog-entries')[0];
    var article = document.createElement('article');
    article.className = 'entry';
    
    // ====== Entry-header Start ======
    var div1 = document.createElement('div');
    div1.className = 'row entry-header';

    var div11 = document.createElement('div');
    div11.className = 'author-image';
    var img = document.createElement('img');
    img.src = 'blog/' + entries[0].author + '.jpg';
    img.alt = entries[0].author;
    div11.appendChild(img);
    div1.appendChild(div11);
    
    var div12 = document.createElement('div');
    div12.className = 'col g-9 offset-1 entry-title';
    var h3 = document.createElement('h3');
    var title_anchor = document.createElement('a');
    title_anchor.href = entries[0].rss;
    title_anchor.innerHTML = entries[0].title;
    h3.appendChild(title_anchor);
    div12.appendChild(h3);
    div1.appendChild(div12);

    var div13 = document.createElement('div');
    div13.className = 'col g-2';
    var post_meta = document.createElement('p');
    post_meta.className = 'post-meta';
    var post_time = document.createElement('time');
    post_time.className = 'post-date';
    post_time.innerHTML = entries[0].published;
    var dauthor = document.createElement('span');
    dauthor.className = 'dauthor';
    dauthor.innerHTML = 'By ' + entries[0].author;
    post_meta.appendChild(post_time);
    post_meta.appendChild(dauthor);
    div13.appendChild(post_meta);
    div1.appendChild(div13);
    // ====== Entry-header End ======

    // ====== Content Start ======
    var div2 = document.createElement('div');
    div2.className = 'row';
    var div21 = document.createElement('div');
    div21.className = 'col g-9 offset-1 post-content';
    var content = document.createElement('p');
    content.innerHTML = entries[0].summary;
    var readmore = document.createElement('a');
    readmore.href = entries[0].rss;
    readmore.className = 'more-link';
    readmore.innerHTML = 'Read More'
	var icon = document.createElement('i');
    icon.className = 'icon-angle-right';
    readmore.appendChild(icon);
    content.appendChild(readmore);
    div21.appendChild(content);
    div2.appendChild(div21);
    // ====== Content End ======

    article.appendChild(div1);
    article.appendChild(div2);
    
    html.appendChild(article);
}

loadXMLfromArray([rss1, rss2]);
(function waitLoadXML (cnt) {
    if (xhr.responseText) {
        process(loadXMLfromString(xhr.responseText));
        return 0;
    }
    if (cnt > 10) {
        console.log("TOO LATE");
        return 1;
    }
    setTimeout(function(){ waitLoadXML(cnt++); },5000);
})(0);