require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var searchlabel = $(".searchlabel");
    var $sampleTable = $('#sampleTable');
    var $visaPagination = $("#visaPagination");
    var $searchCont = $("#searchCont");
    //按钮组集合
    var comButtons =
            '<button class="btn btn-primary" type="button" data-operate="edit">编辑</button>'+
            '<button class="btn btn-info" type="button" data-operate="look">查看</button>',
        startBouutn =  '<button class="btn btn-primary" type="button" data-operate="setOn">有效</button>',
        stopButton = '<button class="btn btn-danger" type="button" data-operate="setOff">无效</button>',
        syncButton = '<button class="btn btn-success" type="button" data-operate="sync">同步商品</button>',
        saveArticleButton = '<button class="btn btn-primary" type="button" data-operate="saveArticle">生成软文</button>';
    searchlabel.on("click",function(){
        $("#selectsearchlabel").text($(this).text());
        $("#searchCont").val("");
        $("#searchCont").attr("data-id",'');
    });

    //页面操作配置
    var operates = {
        add:function(){
            window.location.href = "@@HOSTview/subject/add.html";
        },
        //编辑
        edit:function($this){
            var id = $this.closest("tr").attr("data-id");
            window.location.href = "@@HOSTview/subject/edit.html?id=" + id;
        },
        //查看
        look:function($this){
            var id = $this.closest("tr").attr("data-id");
            window.location.href = "@@HOSTview/subject/look.html?id=" + id;
        },
        //无效
        setOff:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认无效吗?', '', function () {
                utils.ajaxSubmit(apis.subject.offById, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        //有效
        setOn:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认有效吗?', '', function () {
                utils.ajaxSubmit(apis.subject.onById, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        //生成软文
        saveArticle:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认生成软文吗?', '', function () {
                utils.loading(true);
                utils.ajaxSubmit(apis.taobaoArticle.saveArticle, {id: id,type:3}, function (data) {
                    utils.loading(false);
                    hound.success("操作成功","",'').then(function(){
                        loadData();
                    });
                });
            });
        },
        //同步商品
        sync:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认同步商品吗?', '', function () {
                utils.ajaxSubmit(apis.subject.syncById, {id: id}, function (data) {
                    if(data==""){
                        hound.success("同步成功","",'').then(function(){
                            loadData();
                        });
                    }else{
                        hound.error(data,"",'').then(function(){
                            loadData();
                        });
                    }
                });
            });
        }
    };

    var param = {
        pageNo: 1,
        pageSize:10,
        name:'',
        title:'',
        status:'',
        hasGoodsOff:''
    };

    function loadData() {
        utils.ajaxSubmit(apis.subject.getLists, param, function (data) {
            $.each(data.dataArr,function(i,n){
                n.statusText = consts.status.ordinary[n.status];
                (n.status=="1")? n.materialButtonGroup = comButtons + stopButton + syncButton: n.materialButtonGroup = comButtons + startBouutn + syncButton;
                n.materialButtonGroup = n.materialButtonGroup + saveArticleButton ;
            });
            data.statusText = listDropDown.statusText;
            $sampleTable.html(template('visaListItem', data));
            utils.bindPagination($visaPagination, param, loadData);
            $visaPagination.html(utils.pagination(parseInt(data.cnt), param.pageNo));
        });
    }
    // 页面首次加载列表数据
    var loc = location.href;
    var n1 = loc.length;//地址的总长度
    var n2 = loc.indexOf("=");//取得=号的位置
    var id = decodeURI(loc.substr(n2+1,n1-n2));//从=号后面的内容
    var urlParam = id.split("=");
    if(urlParam[0]==1){
        param.hasGoodsOff = 1;
        param.status = 1;
    }else{
        param.hasGoodsOff = '';
        param.status = '';
    }

    loadData();
    utils.bindList($(document), operates);
    var listDropDown = {
        statusText:'状态'
    };
    $sampleTable.on('click', '#dropStatusOptions a[data-id]', function () {
        param.status = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.statusText = "状态" : listDropDown.statusText = $(this).text();
        loadData();
    });
    $("#search").on("click",function(){
        param.pageNo = 1;
        var selectSearchLabel = $("#selectsearchlabel").text();
        if(selectSearchLabel=="专题名字"){
            param.name = $("#searchCont").val();
            param.title = '';
            loadData();
        }else if(selectSearchLabel=="文章标题"){
            param.name = '';
            param.title = $("#searchCont").val();
            loadData();
        }

    });
    $('#searchCont').on('keypress',function(event){
        if (event.keyCode == 13) {
            $('#search').click();
        }
    });
});