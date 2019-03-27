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