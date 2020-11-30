require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var searchlabel = $(".searchlabel");
    var $sampleTable = $('#sampleTable');
    var $visaPagination = $("#visaPagination");
    var $searchCont = $("#searchCont");
    //按钮组集合
    var lookButton = '<button class="btn btn-info" type="button" data-operate="look">帮砍记录</button>',
        createJoinerButton = '<button class="btn btn-primary" type="button" data-operate="createJoiner">帮砍</button>';
    searchlabel.on("click",function(){
        $("#selectsearchlabel").text($(this).text());
        $("#searchCont").val("");
        $("#searchCont").attr("data-id",'');
    });

    var joinerParam = {
        pageNo: 1,
        pageSize:10,
        groupId:''
    };

    //页面操作配置
    var operates = {
        //查看
        look:function($this){
            var groupId = $this.closest("tr").attr("data-id");
            joinerParam.groupId = groupId ;
            loadJoinerData();
        },
        createJoiner:function($this){
            var groupId = $this.closest("tr").attr("data-id");
            var initialData = {
                dataArr:{
                    groupId:groupId
                }
            };
            utils.renderModal('帮砍', template('createJoiner',initialData), function(){
                if($("#createJoinerForm").valid()){
                    utils.ajaxSubmit(apis.cutGroup.createJoiner,$("#createJoinerForm").serialize(),function(data){
                        hound.success("帮砍成功","",1000);
                        utils.modal.modal('hide');
                        loadData();
                    })
                }
            }, 'md');
        }
    };

    var param = {
        pageNo: 1,
        pageSize:10,
        title:'',
        status:'',
        userId:'',
        goodsId:'',
        type:'',
        id:''
        //needSuccess:''
    };

    function loadData() {
        utils.ajaxSubmit(apis.cutGroup.getLists, param, function (data) {
            $.each(data.dataArr,function(i,n){
                n.statusText = consts.status.groupStatus[n.status];
                n.typeText = consts.status.groupType[n.type];
                //n.needSuccessText = consts.status.isBind[n.needSuccess];
                n.materialButtonGroup = lookButton;
                (n.canCreateJoiner=='yes')?n.materialButtonGroup = n.materialButtonGroup + createJoinerButton : n.materialButtonGroup = n.materialButtonGroup ;
            });
            data.statusText = listDropDown.statusText;
            data.typeText = listDropDown.typeText;
            //data.needSuccessText = listDropDown.needSuccessText;
            $sampleTable.html(template('visaListItem', data));
            utils.bindPagination($visaPagination, param, loadData);
            $visaPagination.html(utils.pagination(parseInt(data.cnt), param.pageNo));
        });
    }
    function loadJoinerData(){
        utils.ajaxSubmit(apis.cutGroup.getJoinerLists, joinerParam, function (data) {
            utils.renderModal('帮砍记录列表', template('joinerList',data), function(){}, 'lg');
            utils.bindPagination($("#cutPagination"), joinerParam, loadJoinerData);
            $("#cutPagination").html(utils.pagination(parseInt(data.cnt), joinerParam.pageNo));
        });
    }
    //首次加载数据
    var loc = location.href;
    var n1 = loc.length;//地址的总长度
    var n2 = loc.indexOf("=");//取得=号的位置
    var id = decodeURI(loc.substr(n2+1,n1-n2));//从=号后面的内容
    var urlParam = id.split("=");
    if(urlParam[0].indexOf("html")=='-1'){
        param.id = urlParam[0];
    }else{
        param.id = '';
    }
    loadData();

    utils.bindList($(document), operates);
    var listDropDown = {
        statusText:'状态',
        typeText:'团主类型'
        //needSuccessText:'是否必须成功'
    };
    $sampleTable.on('click', '#dropStatusOptions a[data-id]', function () {
        param.status = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.statusText = "状态" : listDropDown.statusText = $(this).text();
        param.pageNo = 1;
        loadData();
    }).on('click', '#dropTypeOptions a[data-id]', function () {
        param.type = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.typeText = "团主类型" : listDropDown.typeText = $(this).text();
        param.pageNo = 1;
        loadData();
    }).on('click', '#dropNeedSuccessOptions a[data-id]', function () {
        param.needSuccess = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.needSuccessText = "是否必须成功" : listDropDown.needSuccessText = $(this).text();
        param.pageNo = 1;
        loadData();
    });
    $("#search").on("click",function(){
        param.pageNo = 1;
        var selectSearchLabel = $("#selectsearchlabel").text();
        if(selectSearchLabel=="标题"){
            param.title = $("#searchCont").val();
            param.userId = '';
            param.goodsId = '';
            loadData();
        }else if(selectSearchLabel=="会员ID"){
            param.userId = $("#searchCont").val();
            param.title = '';
            param.goodsId = '';
            loadData();
        }else if(selectSearchLabel=="商品ID"){
            param.goodsId = $("#searchCont").val();
            param.title = '';
            param.userId = '';
            loadData();
        }
    });
    $('#searchCont').on('keypress',function(event){
        if (event.keyCode == 13) {
            $('#search').click();
        }
    });
});