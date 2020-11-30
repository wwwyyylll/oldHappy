require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var searchlabel = $(".searchlabel");
    var $sampleTable = $('#sampleTable');
    var $visaPagination = $("#visaPagination");
    var $searchCont = $("#searchCont");

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
        userId:'',
        orderByNewUserCnt:'',
        orderByNewUserTotalCnt:''
    };

    function loadData() {
        utils.ajaxSubmit(apis.cutGrouper.getLists, param, function (data) {
            data.newUserCntText = listDropDown.newUserCntText;
            data.newUserTotalCntText = listDropDown.newUserTotalCntText;
            $sampleTable.html(template('visaListItem', data));
            utils.bindPagination($visaPagination, param, loadData);
            $visaPagination.html(utils.pagination(parseInt(data.cnt), param.pageNo));
        });
    }
    loadData();

    utils.bindList($(document), operates);
    var listDropDown = {
        newUserCntText:'拉新人数',
        newUserTotalCntText:'拉新总人数'
    };
    $sampleTable.on('click', '#dropNewUserCntOptions a[data-id]', function () {
        param.orderByNewUserCnt = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.newUserCntText = "拉新人数" : listDropDown.newUserCntText = $(this).text();
        param.pageNo = 1;
        param.orderByNewUserTotalCnt = '';
        listDropDown.newUserTotalCntText = '拉新总人数';
        loadData();
    }).on('click', '#dropNewUserTotalCntOptions a[data-id]', function () {
        param.orderByNewUserTotalCnt = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.newUserTotalCntText = "拉新总人数" : listDropDown.newUserTotalCntText = $(this).text();
        param.pageNo = 1;
        param.orderByNewUserCnt = '';
        listDropDown.newUserCntText = '拉新人数';
        loadData();
    });
    $("#search").on("click",function(){
        param.pageNo = 1;
        var selectSearchLabel = $("#selectsearchlabel").text();
        if(selectSearchLabel=="团主会员Id"){
            param.userId = $("#searchCont").val();
            loadData();
        }
    });
    $('#searchCont').on('keypress',function(event){
        if (event.keyCode == 13) {
            $('#search').click();
        }
    });
});