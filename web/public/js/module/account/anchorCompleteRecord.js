require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var searchlabel = $(".searchlabel");
    var $sampleTable = $('#sampleTable');
    var $visaPagination = $("#visaPagination");
    //按钮组集合
    var completeButton = '<button class="btn btn-primary" type="button" data-operate="complete">完成</button>';

    searchlabel.on("click",function(){
        $("#selectsearchlabel").text($(this).text());
        $("#searchCont").val("");
        $("#searchCont").attr("data-id",'');
    });

    //页面操作配置
    var operates = {
        dateSearch:function(){
            utils.renderModal('历史日期', template('dateSearchDiv',''), function(){
                if($("#dateSearchForm").valid()){
                    var date = $("#date").val();
                    param.date = date;
                    param.pageNo = 1;
                    utils.modal.modal('hide');
                    loadData();
                }
            }, 'md');
        },
        complete:function($this){
            var id = $this.closest("tr").attr("data-id");
            utils.ajaxSubmit(apis.anchorCompleteRecord.getById, {id: id}, function (data) {
                var getByIdData = {
                    dataArr:data
                };
                utils.renderModal('完成', template('modalDiv', getByIdData),function(){
                    if($("#visaPassportForm").valid()) {
                        utils.loading(true);
                        utils.ajaxSubmit(apis.anchorCompleteRecord.save, $("#visaPassportForm").serialize(), function (data) {
                            utils.loading(false);
                            hound.success("操作成功", "", 1000);
                            utils.modal.modal('hide');
                            loadData();
                        });
                    }
                }, 'md');
            });
        }
    };

    var param = {
        pageNo: 1,
        pageSize:10,
        status:'',
        anchorName:'',
        tagId:'',
        date:'',
        hasLiveBroadcast:''
    };

    var tagArr;
    function getTagArr(){
        var tagParam1 = {
            pageNo: 1,
            pageSize:50000,
            name:'',
            status:'',
            type:1
        };
        utils.ajaxSubmit(apis.tag.getLists, tagParam1, function (data) {
            tagArr = data.dataArr;
        });
    }
    getTagArr();
    function loadData() {
        utils.ajaxSubmit(apis.anchorCompleteRecord.getLists, param, function (data) {
            //根据状态值显示对应的状态文字 + 显示对应的 允许登录/禁止登录 按钮
            $.each(data.dataArr,function(i,n){
                n.statusText = consts.status.isBind[n.status];
                n.hasLiveBroadcastText = consts.status.haveCoupon[n.hasLiveBroadcast];
                (n.status=="2")? n.materialButtonGroup = completeButton : n.materialButtonGroup = "<span style='color: orangered'>--------</span>";
            });
            data.tagArr = tagArr;
            data.statusText = listDropDown.statusText;
            data.hasLiveBroadcastText = listDropDown.hasLiveBroadcastText;
            data.TagText = listDropDown.TagText;
            $sampleTable.html(template('visaListItem', data));
            utils.bindPagination($visaPagination, param, loadData);
            $visaPagination.html(utils.pagination(parseInt(data.cnt), param.pageNo));
            //$sampleTable.find('#date').val(param.date);
        });
    }
    // 页面首次加载列表数据
    setTimeout(function(){
        loadData();
    },100);
    utils.bindList($(document), operates);
    //列表筛选事件绑定
    var listDropDown = {
        hasLiveBroadcastText:'是否有直播',
        statusText:'是否已完成',
        TagText:'主播标签'
    };
    $sampleTable.on('click', '#dropStatusOptions a[data-id]', function () {
        param.status = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.statusText = "是否已完成" : listDropDown.statusText = $(this).text();
        param.pageNo = 1;
        loadData();
    }).on('click', '#dropTagOptions a[data-id]', function () {
        param.tagId = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.TagText = "主播标签" : listDropDown.TagText = $(this).text();
        param.pageNo = 1;
        loadData();
    }).on('click', '#dropHasLiveBroadcastOptions a[data-id]', function () {
        param.hasLiveBroadcast = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.hasLiveBroadcastText = "是否有直播" : listDropDown.hasLiveBroadcastText = $(this).text();
        param.pageNo = 1;
        loadData();
    });
    //setInterval(function () {
    //    var $date = $sampleTable.find('#date');
    //    if ($date.length === 1) {
    //        if ($date.val() !== param.date) {
    //            param.date = $date.val();
    //            param.pageNo = 1;
    //            loadData();
    //        }
    //    }
    //},500);
    $("#search").on("click",function(){
        param.pageNo = 1;
        param.anchorName = $("#searchCont").val();
        loadData();
    });
    $('#searchCont').on('keypress',function(event){
        if (event.keyCode == 13) {
            $('#search').click();
        }
    });
});