var JSRSS = function() {
    'use strict';

    this.entries = [];
    this._process = [];

    this.loadXML = function(str) {
        var xhr = new XMLHttpRequest();
        /*xhr.addEventListener('loadend', function(){
	    if(xhr.status === 200){
		console.log(xhr.response);
	    }else{
		console.error(xhr.status+' '+xhr.statusText);
	    }
	    });*/
        xhr.open('GET', str, true);
        xhr.send();
        var self = this;
        /*xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                self.loadXMLfromString(this.responseText);
            } else {
                console.log("XMLHttpRequest.readyState = " + this.readyState + " status = " + this.status);
            }
        }*/
        xhr.onprogress = function() {
          console.log("Downloading...");
        }
        xhr.onload = function() {
          console.log("DownLoad finished");
        }
        xhr.onloadend = function() {
          console.log("Download completed");
          self.loadXMLfromString(this.responseText);
        }

        return this;
    }

    this.loadXMLfromArray = function(arr) {
        console.log("loadXMLfromArray");
        for (var i = 0; i < arr.length; i ++) {
            this.loadXML(arr[i]);
        }
        return this;
    }

    this.loadXMLfromString = function(str) {
	console.log("loadXMLfromString");
        var dp = new DOMParser();
        var rss = dp.parseFromString(str, 'text/xml');
        var linksInRSS = rss.getElementsByTagName('link');
        var author_name = rss.getElementsByTagName('author')[0].getElementsByTagName('name')[0].textContent;
        var rssurl = linksInRSS[0].getAttribute('href');
        var entries_dom = rss.getElementsByTagName('entry');
        var entries = [];
        
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
        this.entries = this._mergeEntries(this.entries, entries);
	 
	/*
	console.log("document.readyState");
	console.log(document.readyState);
        if (document.readyState === 'interactive') {
            this.update();
        } else {
            var self = this;
            this._loadEventUpdate = true;

            if (!this._loadEventUpdate) {
                window.addEventListener('load', function() {
                    this.update();
                });
            }
        }
	*/
        return this;
    }

    this.update = function() {
        for (var i = 0; i < this._process.length; i ++) {
            this._process[i].call(this, this.entries);
        }
        return this;
    }

    this.process = function(fn) {
	/*
        if (!this._process) {
            this._process = [];
        }
	*/
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