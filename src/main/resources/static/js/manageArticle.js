var articleSum;

$(function(){
    LoadPage(1);
    getArticleSum();
});

function LoadPage(page) {
    $.ajax({
        url: "/articleInfoList",
        type: "GET",
        async: false,
        data: {page:page},
        success: function (data) {
            $("#tableType").html("文章列表");
            var content = '<thead>'+
                '                    <tr>'+
                '                        <th>ID</th>'+
                '                        <th>分类</th>'+
                '                        <th>原创</th>'+
                '                        <th>文章名称</th>'+
                '                        <th>阅读量</th>'+
                '                        <th>创建时间</th>'+
                '                        <th>操作</th>'+
                '                    </tr>'+
                '                    </thead>'+
                '                    <tbody>';
            for (var i in data) {
                var id = data[i].articleInfoId;
                var createTime = data[i].createBy;
                var category = data[i].category.name;
                var isOriginal = data[i].isOriginal;
                var title = data[i].title;
                var views = data[i].views;

                var original;

                if(isOriginal == '1')
                {
                    original = "原创";
                } else if (isOriginal == '0') {
                    original = "转载";
                }

                content = content +'<tr>'+
                    '                        <td>'+id+'</td>'+
                    '                        <td>'+category+'</td>'+
                    '                        <td>'+original+'</td>'+
                    '                        <td>'+title+'</td>'+
                    '                        <td>'+views+'</td>'+
                    '                        <td>'+createTime+'</td>'+
                    '<td><button class="btn btn-success btn-xs" onclick="editArticle('+id+')" ><span class="glyphicon glyphicon-pencil"></span> 编辑</button>&#8194;'+
                    '<button class="btn btn-danger btn-xs" onclick="loadModal('+id+')" data-toggle="modal" data-target="#myModal"><span class="glyphicon glyphicon-trash"></span> 删除</button></td>'+
                    '                    </tr>';
                    '                </div>';
                if(i==data.length)
                {
                    content = content + ' </tbody>';
                }
            }
            $("#table").html(content);
        }, error: function () {
            alert("数据加载错误");
        }
    });
}

function writeArticle() {
    window.location.href = "/admin/editArticle.html?edit=false";
}

function deleteArticle(id) {
    $.ajax({
        type: "GET",
        url: "/deleteArticle",
        data: {id:id},
        success: function (data) {
            if(data == true) {
                alert("删除文章成功~");
                document.location.reload();
            }
            else{
                alert(data.msg);
                $('#myModal').modal('hide');
                console.log("返回的信息是："+data.msg);
            }
        }, error: function () {
            alert("删除文章失败！");
        }
    });
}

function loadModal(id) {
    var Buttons = '<button type="button" class="btn btn-primary" onclick="deleteArticle('+id+')">删除</button>' +
        '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>';
    $("#modalFooter").html(Buttons);
}

function editArticle(id) {
    window.location.href="/admin/editArticle.html?"+"id="+id+'&edit=true';
}

function getArticleSum() {
    $.ajax({
        url: "/articleSum",
        type: "GET",
        async: false,
        data: {},
        success: function (data) {
            articleSum = data;
            $("#sum").text(articleSum);
        }, error: function () {
            alert("数据加载错误");
        }
    });
}

function previousPage(){
    var page=$("#page").text();
    page=page-1;
    if(page<1){
        alert("已是第一页");
    }
    else{
        LoadPage(page);
        $("#page").text(page);
    }
}

function nextPage(){
    var page=$("#page").text();
    page=page-0+1;
    if((page-1)*10>=articleSum){
        alert("已是最后一页");
    }
    else{
        LoadPage(page);
        $("#page").text(page);
    }
}