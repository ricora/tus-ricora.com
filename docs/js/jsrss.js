var JSRSS = function() {

    this.entries = [];

    this.loadXML = function(str) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '../php/translate.php?url=' + encodeURI(str), true);
        xhr.send();
        var self = this;
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                self.loadXMLfromString(this.responseText);
            } else {
                console.log("status = " + this.status);
            }
        }
        return this;
    }

    this.loadXMLfromArray = function(arr) {
        for (var i = 0; i < arr.length; i ++) {
            this.loadXML(arr[i]);
        }
        return this;
    }

    this.loadXMLfromString = function(str) {
        var dp = new DOMParser();
        var rss = dp.parseFromString(str, 'text/xml');
        var linksInRSS = rss.getElementsByTagName('link');
        var author_name = rss.getElementsByTagName('author')[0].getElementsByTagName('name')[0].textContent;
        var rssurl;
        for (var i = 0; i < linksInRSS.length; i ++) {
            if (linksInRSS[i].getAttribute('rel') === 'self') {
                rssurl = linksInRSS[i].getAttribute('href');
                break;
            }
        }
        var entries_dom = rss.getElementsByTagName('entry');
        var entries = [];
        
        for (var i = 0; i < entries_dom.length; i ++) {
            var entry = {};
            entry.rss       = rssurl;
            entry.title     = entries_dom[i].getElementsByTagName('title')[0].textContent;
            entry.author    = author_name;
            entry.url       = entries_dom[i].getElementsByTagName('id')[0].textContent;
            entry.updated   = new Date(entries_dom[i].getElementsByTagName('updated')[0].textContent);
            entry.published = new Date(entries_dom[i].getElementsByTagName('published')[0].textContent);
            entry.summary   = entries_dom[i].getElementsByTagName('summary')[0].textContent;

            entries.push(entry);
        }
        this.entries = this._mergeEntries(this.entries, entries);

        if (document.readyState === 'complete') {
            this._update();
        } else {
            var self = this;
            this._loadEventUpdate = true;

            if (!this._loadEventUpdate) {
                window.addEventListener('load', function() {
                    this._update();
                });
            }
        }

        return this;
    }

    this._update = function() {
        for (var i = 0; i < this._process.length; i ++) {
            this._process[i].call(this, this.entries);
        }
        return this;
    }

    this.process = function(fn) {
        if (!this._process) {
            this._process = [];
        }
        this._process.push(fn);
        return this;
    }

    this._mergeEntries = function(arr1, arr2) {
        /*
         * 現状マージソートだが、他のソートにするかもしれない
         * arr1, arr2 ともにソート済みであることが前提
         */
        var a = Array.from(arr1);
        var b = Array.from(arr2);
        var c = [];
        while (a.length > 0 && b.length > 0) {
            if (a[0].published > b[0].published) {
                c.push(a.shift());
            } else {
                c.push(b.shift());
            }
        }
        if (a.length === 0) {
            c = c.concat(b);
        } else if (b.length === 0) {
            c = c.concat(a);
        }
        return c;
    }

    return this;
}

var rss1 = 'https://agodoriru.hatenablog.com/feed';
var rss2 = 'http://banboooo.hatenablog.com/feed';

var process = function(entries) {
    // 必ず onload 後に実行される
    var html = document.getElementsByTagName('blog-entries')[0];
    for (var i = 0; i < 3; i ++) {
        var article = document.createElement('article');
        article.className = 'entry';

        // ====== Entry-header Start ======
        var div1 = document.createElement('div');
        div1.className = 'row entry-header';

        var div11 = document.createElement('div');
        div11.className = 'author-image';
        var img = document.createElement('img');
        img.src = 'twitter/KoshStorm.jpg';
        img.alt = entries[i].author;
        div11.appendChild(img);
        div1.appendChild(div11);

        var div12 = document.createElement('div');
        div12.className = 'col g-9 offset-1 entry-title';
        var h3 = document.createElement('h3');
        var title_anchor = document.createElement('a');
        title_anchor.href = entries[i].url;
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
        post_time.innerHTML = '公開日：' + entries[i].published + '\n' + '更新日：' + entries[i].updated;
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
        readmore.href = entries[i].url;
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

var jsrss = new JSRSS()
// 処理を追加
.process(process)
// RSS を読み込む
.loadXMLfromArray([rss1, rss2]);