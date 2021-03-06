$(function(){
    var id = getQueryVariable("id");
    console.log("文章ID为: "+id);
    getArticleById(id);
    editormd.markdownToHTML("content", {//注意：这里是上面DIV的id
        htmlDecode: "style,script,iframe",
        emoji: true,
        taskList: true,
        tex: true, // 默认不解析
        flowChart: true, // 默认不解析
        sequenceDiagram: true, // 默认不解析
        codeFold: true,
    });
    getSiteInfo();
});

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}

function getArticleById(id) {
    $.ajax({
        type: "GET",
        url: "/articleWrapDetail",
        async: false,
        data: {id:id},
        success: function (data) {

           if(data == "") {
               alert("该文章不存在！");
               history.back(-1);
           } else {
               var categories = "";
               var Original = data.isOriginal;
               var labels = "";
               var articleId = data.articleInfoId;
               var title = data.title;
               var author = data.author;
               var url = data.url;

               setArticleLink(articleId,Original,author,url);

               var original = isOriginal(Original);

               $("#title").html(data.title);
               $("#here").val(data.articleContent.content);

               categories =
                   /*'<span class="am-badge am-badge-success am-radius">'+ original +'</span>&#8194;'+*/
                                                                    original +
                   '<span class="glyphicon glyphicon-time">&#8197;'+data.createBy+'&#8197;&#8197;</span>'+
                   '<span class="glyphicon glyphicon-user">&#8197;' + author + '&#8197;&#8197;</span>'+
                   '<span class="glyphicon glyphicon-tag">&#8197;'+data.category.name+'</span>';
               $("#category").html(categories);
               addShare(articleId,title);
           }
        }, error: function () {
            alert("数据加载错误");
        }
    });
}


function addShare(id,title) {
    $('#share').append('<div class="social-share" data-initialized="true" data-url="http://www.baidurex.com/article.html?id='+ id +'" data-title="'+ title +'">'+
        /*'        <a href="#" class="social-share-icon icon-qq" data-am-popover="{content: \'分享到QQ\', trigger: \'hover focus\'}"></a>'+*/
        '        <a href="#" class="social-share-icon icon-wechat"></a>'+
        '        <a href="#" class="social-share-icon icon-douban" data-am-popover="{content: \'分享至豆瓣\', trigger: \'hover focus\'}"></a>'+
        '        <a href="#" class="social-share-icon icon-qzone" data-am-popover="{content: \'分享至QQ空间\', trigger: \'hover focus\'}"></a>'+
        '        <a href="#" class="social-share-icon icon-weibo" data-am-popover="{content: \'分享至微博\', trigger: \'hover focus\'}"></a>'+
        '    </div>'
    );
}

//侧边栏网站信息
function getSiteInfo() {

    $.ajax({
        type: 'GET',
        url: '/getSiteInfo',
        dataType: 'json',
        data: {
        },
        success: function (data) {
            // 侧边栏
            $('#slideArticleNum').html(data.articleNum);
            $('#slideCategoryNum').html(data.categoryNum);
            $('#slideLabelNum').html(data.labelNum);
        },
        error: function () {
            alert("获取网站信息失败！");
        }
    });

}

function isOriginal(isOriginal) {

    var original;

    if(isOriginal == '1')
    {
        //original = "原创";
        original = '<span class="am-badge am-badge-success am-radius">'+ '原创' +'</span>&#8194;'
    } else if (isOriginal == '0') {
        //original = "转载";
        original = '<span class="am-badge am-badge-secondary am-radius">'+ '转载' +'</span>&#8194;'
    }

    return original;
}

function setArticleLink(id, original,author, url) {
    var link;
    if(original == 1) {
        link = 'https://www.baidurex.com/article.html?id=' + id;
    } else if(original == 0) {
        link = url;
    }
    $('#authorFooter').text(author);
    $('#articleLink').attr('href',link);
    $('#articleLink').text(link);
}