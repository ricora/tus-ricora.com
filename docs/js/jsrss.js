const zip = (array1, array2) => array1.map((_, i) => [array1[i], array2[i]]);

// 表示する記事の最大数
var MAX_ARTICLE = 3;
var xhrArray = [ new XMLHttpRequest() , new XMLHttpRequest() ];
// xmlへのパス
var rssArray = [ './feed' , './feed2' ];

function loadXML (url,xhr) {
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
        entry.published_int = function(date) {
	    var today = new Date();
	    var y = 365 * (today.getFullYear() - date.getFullYear());
	    var m = 30 * (today.getMonth() - date.getMonth());
	    var d = today.getDate() - date.getDate();
	    return y + m + d;
	}.call(this, new Date(entries_dom[i].getElementsByTagName('published')[0].textContent));
        entry.published = function(date) {
	    var weekly = ['日', '月', '火', '水', '木', '金', '土'];
	    var y = date.getFullYear();
	    var m = date.getMonth() + 1;
	    var d = date.getDate();
	    var w = weekly[date.getDay()];

	    return y + "/" + m + "/" + d + "(" + w + ")";
	}.call(this, new Date(entries_dom[i].getElementsByTagName('published')[0].textContent));
        entry.summary = entries_dom[i].getElementsByTagName('summary')[0].textContent;
        entries.push(entry);
    }
    return entries;
}

function process (entries) {
    document.getElementById('blog').getElementsByClassName('blog-entries')[0].innerHTML = "";
    var html = document.getElementById('blog').getElementsByClassName('blog-entries')[0];
    entries.sort(function(entry1,entry2) {
	    if (entry1.published_int <= entry2.published_int) return -1;
	    else return 1;
	});
    var iter_max = Math.min(entries.length,MAX_ARTICLE);
    for (var i = 0; i < iter_max; i++ ) {
        var article = document.createElement('article');
        article.className = 'entry';
    
        // ====== Entry-header Start ======
        var div1 = document.createElement('div');
        div1.className = 'row entry-header';

        var div11 = document.createElement('div');
        div11.className = 'author-image';
        var img = document.createElement('img');
        img.src = 'blog/' + entries[i].author + '.jpg';
        img.alt = entries[i].author;
        div11.appendChild(img);
        div1.appendChild(div11);
    
        var div12 = document.createElement('div');
        div12.className = 'col g-9 offset-1 entry-title';
        var h3 = document.createElement('h3');
        var title_anchor = document.createElement('a');
        title_anchor.href = entries[i].rss;
        title_anchor.innerHTML = entries[i].title;
        h3.appendChild(title_anchor);
        div12.appendChild(h3);
        div1.appendChild(div12);

        var div13 = document.createElement('div');
        div13.className = 'col g-2';
        var post_meta = document.createElement('p');
        post_meta.className = 'post-meta';
        var post_time = document.createElement('time');
        post_time.className = 'post-date';
        post_time.innerHTML = entries[i].published;
        var dauthor = document.createElement('span');
        dauthor.className = 'dauthor';
        dauthor.innerHTML = 'By ' + entries[i].author;
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
        content.innerHTML = entries[i].summary;
        var readmore = document.createElement('a');
        readmore.href = entries[i].rss;
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
}

zip(rssArray,xhrArray).forEach(([rss, xhr]) => loadXML(rss,xhr));

(function waitLoadXML (cnt) {
    if (xhrArray.every(function(value,index,array) { return value.responseText; } )) {
        process( (xhrArray.map(function(value,index,array) { return loadXMLfromString(value.responseText); })).reduce(function(previous, current, index, array){ return previous.concat(current); }) );
        return 0;
    }
    if (cnt > 10) {
        console.log("TOO LATE");
	document.getElementById('blog').getElementsByClassName('blog-entries')[0].innerHTML = "<center> <p> ブログが取得できません </p> </center>"
        return 1;
    }
    setTimeout(function(){ waitLoadXML(cnt++); },5000);
})(0);
