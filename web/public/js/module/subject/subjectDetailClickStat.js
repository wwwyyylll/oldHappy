require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var searchlabel = $(".searchlabel");
    var $sampleTable = $('#sampleTable');
    var $visaPagination = $("#visaPagination");

    searchlabel.on("click",function(){
        $("#selectsearchlabel").text($(this).text());
        $("#searchCont").val("");
        $("#searchCont").attr("data-id",'');
    });

    //页面操作配置
    var operates = {

    };

    var param = {
        pageNo: 1,
        pageSize:10,
        time:'',
        subjectTitle:'',
        itemId:''
    };

    function loadData() {
        utils.ajaxSubmit(apis.subjectDetailClickStat.getLists, param, function (data) {
            data.statusText = listDropDown.statusText;
            $sampleTable.html(template('visaListItem', data));
            utils.bindPagination($visaPagination, param, loadData);
            $visaPagination.html(utils.pagination(parseInt(data.cnt), param.pageNo));
            $sampleTable.find('#time').val(param.time);
            $('#time').daterangepicker(null, function(start, end, label) {});
        });
    }
    // 页面首次加载列表数据
    loadData();
    utils.bindList($(document), operates);
    var listDropDown = {
        statusText:'状态'
    };
    $sampleTable.on('click', '#dropStatusOptions a[data-id]', function () {
        param.status = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.statusText = "状态" : listDropDown.statusText = $(this).text();
        param.pageNo = 1;
        loadData();
    });
    setInterval(function () {
        var $time = $sampleTable.find('#time');
        if ($time.length === 1) {
            if ($time.val() !== param.time) {
                param.time = $time.val();
                param.pageNo = 1;
                loadData();
            }
        }
    },500);
    $("#search").on("click",function(){
        param.pageNo = 1;
        var selectSearchLabel = $("#selectsearchlabel").text();
        if(selectSearchLabel=="专题名字"){
            param.subjectTitle = $("#searchCont").val();
            param.itemId = '';
            loadData();
        }else if(selectSearchLabel=="淘宝商品ID"){
            param.subjectTitle = '';
            param.itemId = $("#searchCont").val();
            loadData();
        }
    });
    $('#searchCont').on('keypress',function(event){
        if (event.keyCode == 13) {
            $('#search').click();
        }
    });
});