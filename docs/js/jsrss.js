var JSRSS = function() {

    this.entries = [];

    this.loadXML = function(str) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '../php/translate.php?url=' + encodeURIComponent(str), true);
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