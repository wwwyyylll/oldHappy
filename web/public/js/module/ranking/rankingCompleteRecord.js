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
            hound.confirm('确认完成吗?', '', function () {
                utils.ajaxSubmit(apis.rankingCompleteRecord.save, {id: id}, function (data) {
                    hound.success("操作成功", "", 1000);
                    loadData();
                });
            });

        }
    };

    var param = {
        pageNo: 1,
        pageSize:10,
        status:'',
        date:'',
        rankingName:''
    };

    function loadData() {
        utils.ajaxSubmit(apis.rankingCompleteRecord.getLists, param, function (data) {
            $.each(data.dataArr,function(i,n){
                n.statusText = consts.status.isBind[n.status];
                (n.status=="2")? n.materialButtonGroup = completeButton : n.materialButtonGroup = "<span style='color: orangered'>--------</span>";
            });
            data.statusText = listDropDown.statusText;
            $sampleTable.html(template('visaListItem', data));
            utils.bindPagination($visaPagination, param, loadData);
            $visaPagination.html(utils.pagination(parseInt(data.cnt), param.pageNo));
        });
    }
    // 页面首次加载列表数据
    loadData();
    utils.bindList($(document), operates);
    //列表筛选事件绑定
    var listDropDown = {
        statusText:'是否已完成'
    };
    $sampleTable.on('click', '#dropStatusOptions a[data-id]', function () {
        param.status = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.statusText = "是否已完成" : listDropDown.statusText = $(this).text();
        param.pageNo = 1;
        loadData();
    });
    $("#search").on("click",function(){
        param.pageNo = 1;
        param.rankingName = $("#searchCont").val();
        loadData();
    });
    $('#searchCont').on('keypress',function(event){
        if (event.keyCode == 13) {
            $('#search').click();
        }
    });
});