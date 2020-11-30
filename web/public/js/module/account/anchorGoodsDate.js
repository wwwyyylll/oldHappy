require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var searchlabel = $(".searchlabel");
    var $addModal = $("#addModal");
    var $sampleTable = $('#sampleTable');
    var $visaPagination = $("#visaPagination");
    //按钮组集合
    var comButtons =
            '<button class="btn btn-primary" type="button" data-operate="edit">编辑</button>'+
            '<button class="btn btn-info" type="button" data-operate="look">查看</button>',
        startBouutn =  '<button class="btn btn-primary" type="button" data-operate="setOn">有效</button>',
        stopButton = '<button class="btn btn-danger" type="button" data-operate="setOff">无效</button>',
        lookGoodsButton = '<button class="btn btn-info" type="button" data-operate="lookGoods">查看商品</button>',
        sendNoticeButton = '<button class="btn btn-success" type="button" data-operate="sendNotice">发送直播通知</button>',
        saveArticleButton = '<button class="btn btn-primary" type="button" data-operate="saveArticle">生成软文</button>';

    searchlabel.on("click",function(){
        $("#selectsearchlabel").text($(this).text());
        $("#searchCont").val("");
        $("#searchCont").attr("data-id",'');
    })

    //新增
    $addModal.on("click",function(){
        var initialData = {
            dataArr:{},
            anchorArr:anchorArr
        };
        utils.renderModal('新增主播带货日期', template('modalDiv',initialData), function(){
            if($("#visaPassportForm").valid()){
                utils.loading(true);
                utils.ajaxSubmit(apis.anchorGoodsDate.create,$("#visaPassportForm").serialize(),function(data){
                    utils.loading(false);
                    hound.success("添加成功","",1000);
                    utils.modal.modal('hide');
                    param.pageNo = 1;
                    loadData();
                })
            }
        }, 'lg');
    })

    $(document).on("click",function(){
        $('.ability-list').remove();
    })
    //页面操作配置
    var operates = {
        //编辑
        edit:function($this){
            var id = $this.closest("tr").attr("data-id");
            utils.ajaxSubmit(apis.anchorGoodsDate.getById, {id: id}, function (data) {
                var getByIdData = {
                    dataArr:data,
                    anchorArr:anchorArr
                };
                utils.renderModal('编辑主播带货日期', template('modalDiv', getByIdData), function(){
                    if($("#visaPassportForm").valid()) {
                        utils.loading(true);
                        utils.ajaxSubmit(apis.anchorGoodsDate.updateById, $("#visaPassportForm").serialize(), function (data) {
                            utils.loading(false);
                            hound.success("编辑成功", "", 1000);
                            utils.modal.modal('hide');
                            loadData();
                        })
                    }
                }, 'lg');
            });
        },
        //查看
        look:function($this){
            var id = $this.closest("tr").attr("data-id");
            utils.ajaxSubmit(apis.anchorGoodsDate.getById, {id: id}, function (data) {
                var getByIdData = {
                    dataArr:data,
                    anchorArr:anchorArr
                };
                utils.renderModal('查看主播带货日期', template('modalDiv', getByIdData),'', 'lg');
                $("#visaPassportForm").append($("fieldset").prop('disabled', true));
            });
        },
        //无效
        setOff:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认无效吗?', '', function () {
                utils.ajaxSubmit(apis.anchorGoodsDate.offById, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        //有效
        setOn:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认有效吗?', '', function () {
                utils.ajaxSubmit(apis.anchorGoodsDate.onById, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        //发送直播通知
        sendNotice:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认发送直播通知吗?', '', function () {
                utils.ajaxSubmit(apis.anchorGoodsDate.sendNotice, {id: id}, function (data) {
                    hound.success(data,"",'').then(function(){
                        loadData();
                    });
                });
            });
        },
        //生成软文
        saveArticle:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认生成软文吗?', '', function () {
                utils.loading(true);
                utils.ajaxSubmit(apis.taobaoArticle.saveArticle, {id: id,type:1}, function (data) {
                    utils.loading(false);
                    hound.success("操作成功","",'').then(function(){
                        loadData();
                    });
                });
            });
        },
        lookGoods:function($this){
            var id = $this.closest("tr").attr("data-id");
            window.open("@@HOSTview/mall/goods.html?dateId=" + id);
        }
    };

    var param = {
        pageNo: 1,
        pageSize:10,
        status:'',
        title:'',
        date:'',
        anchorId:'',
        id:'',
        orderByGoodsCnt:'',
        isNotice:''
    };

    var anchorArr;
    function getAnchorArr(){
        var aaa = {
            pageNo: 1,
            pageSize:10
        };
        utils.ajaxSubmit(apis.anchor.getAllLists, aaa, function (data) {
            $.each(data,function(i,n){
                $.each(n.anchorArr,function(i,n){
                    n.statusText = consts.status.ordinary[n.status];
                });
            });
            anchorArr = data;
        });
    }
    getAnchorArr();

    function loadData() {
        utils.ajaxSubmit(apis.anchorGoodsDate.getLists, param, function (data) {
            //根据状态值显示对应的状态文字 + 显示对应的 允许登录/禁止登录 按钮
            $.each(data.dataArr,function(i,n){
                n.statusText = consts.status.ordinary[n.status];
                (n.isNotice=='2')? n.noticeText = "<span style='color:red'>未发送</span>" : n.noticeText = "<span style='color:green'>已发送"+ "【" + n.noticeCnt + "个】" +"用户</span>" ;
                (n.status=="1")? n.materialButtonGroup = comButtons + stopButton + lookGoodsButton : n.materialButtonGroup = comButtons + startBouutn + lookGoodsButton ;
                (n.isNotice=='2')? n.materialButtonGroup = n.materialButtonGroup + sendNoticeButton : n.materialButtonGroup = n.materialButtonGroup ;
                n.materialButtonGroup = n.materialButtonGroup + saveArticleButton ;
            });
            data.statusText = listDropDown.statusText;
            data.goodsCntText = listDropDown.goodsCntText;
            data.sendStatusText = listDropDown.sendStatusText;
            $sampleTable.html(template('visaListItem', data));
            utils.bindPagination($visaPagination, param, loadData);
            $visaPagination.html(utils.pagination(parseInt(data.cnt), param.pageNo));
            $sampleTable.find('#date').val(param.date);
        });
    }
    // 页面首次加载列表数据
    var loc = location.href;
    var n1 = loc.length;//地址的总长度
    var n2 = loc.indexOf("=");//取得=号的位置
    var id = decodeURI(loc.substr(n2+1,n1-n2));//从=号后面的内容
    var urlParam = id.split("=");
    if(urlParam[0].indexOf('html')=='-1'){
        param.id = urlParam[0];
    }else{
        param.id = '';
    }

    loadData();
    utils.bindList($(document), operates);
    //列表筛选事件绑定
    var listDropDown = {
        statusText:'状态',
        goodsCntText:'商品总数',
        sendStatusText:'直播通知状态'
    };
    $sampleTable.on('click', '#dropStatusOptions a[data-id]', function () {
        param.status = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.statusText = "状态" : listDropDown.statusText = $(this).text();
        param.pageNo = 1;
        loadData();
    }).on('click', '#dropGoodsCntOptions a[data-id]', function () {
        param.orderByGoodsCnt = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.goodsCntText = "商品总数" : listDropDown.goodsCntText = $(this).text();
        param.pageNo = 1;
        loadData();
    }).on('click', '#dropSendStatusOptions a[data-id]', function () {
        param.isNotice = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.sendStatusText = "直播通知状态" : listDropDown.sendStatusText = $(this).text();
        param.pageNo = 1;
        loadData();
    });
    setInterval(function () {
        var $date = $sampleTable.find('#date');
        if ($date.length === 1) {
            if ($date.val() !== param.date) {
                param.date = $date.val();
                param.pageNo = 1;
                loadData();
            }
        }
    },500);
    $("#searchCont").on("input",function(){
        var selectSearchLabel = $("#selectsearchlabel").text();
        if(selectSearchLabel=="主播"){
            var param = {
                pageNo: 1,
                pageSize:500000,
                name:$("#searchCont").val(),
                status:''
            };
            utils.ajaxSubmit(apis.anchor.getLists, param, function (data) {
                if(data.dataArr.length!=0){
                    var $economyAbilityItem = '';
                    $.each(data.dataArr, function (i, v) {
                        $economyAbilityItem += '<div data-id="'+ v.id +'" class="economy-ability-item">'+ v.name +'</div>'
                    })
                    $('.ability-list').remove();
                    var $abilityList = '<div class="ability-list">'+ $economyAbilityItem +'</div>';
                    $("#searchCont").closest('.economy-wards').append($abilityList);

                    $('.economy-ability-item').click(function(){
                        $('.ability-list').remove();
                        var $index = $(this).index();
                        $("#searchCont").val(data.dataArr[$index].name);
                        $("#searchCont").attr("data-id",data.dataArr[$index].id);
                    });
                }else{
                    $('.ability-list').remove();
                    var $abilityList = '<div class="ability-list">'+
                        '<div data-id="-1" class="economy-ability-item">无数据</div>'
                        +'</div>';
                    $("#searchCont").closest('.economy-wards').append($abilityList);

                    $('.economy-ability-item').click(function(){
                        $('.ability-list').remove();
                        var $index = $(this).index();
                        $("#searchCont").val("无数据");
                        $("#searchCont").attr("data-id","-1");
                    });
                }
            });
        }
    });
    $("#search").on("click",function(){
        param.pageNo = 1;
        //判断是什么条件搜索
        var selectSearchLabel = $("#selectsearchlabel").text();
        if(selectSearchLabel=="主播"){
            //订单号搜索
            if($("#searchCont").val()!=''){
                param.anchorId = $("#searchCont").attr("data-id");
                param.title = '';
                loadData();
            }else{
                param.anchorId = '';
                param.title = '';
                loadData();
            }
        }else if(selectSearchLabel=="标题"){
            //商品标题搜索
            param.title = $("#searchCont").val();
            param.anchorId = '';
            loadData();
        }
    });
    $('#searchCont').on('keypress',function(event){
        if (event.keyCode == 13) {
            $('#search').click();
        }
    });
});