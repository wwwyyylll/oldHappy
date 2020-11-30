require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var searchlabel = $(".searchlabel");
    var $sampleTable = $('#sampleTable');
    var $visaPagination = $("#visaPagination");
    //按钮组集合
    var comButtons = '<button class="btn btn-primary" type="button" data-operate="reply">回复</button>';

    searchlabel.on("click",function(){
        $("#selectsearchlabel").text($(this).text());
        $("#searchCont").val("");
        $("#searchCont").attr("data-id",'');
    });

    //页面操作配置
    var operates = {
        reply:function($this){
            var id = $this.closest("tr").attr("data-id");
            var tr = $this.closest("tr");
            var nickName = tr.find("td").eq(1).find("a").text();
            var reason = tr.find("td").eq(2).text();
            var otherReason = tr.find("td").eq(3).text();
            var getByIdData = {
                dataArr:{
                    id:id,
                    nickName:nickName,
                    reason:reason,
                    otherReason:otherReason
                }
            };
            utils.renderModal('回复', template('modalDiv', getByIdData), function(){
                if($("#visaPassportForm").valid()) {
                    utils.loading(true);
                    utils.ajaxSubmit(apis.guestbook.replyById, $("#visaPassportForm").serialize(), function (data) {
                        utils.loading(false);
                        hound.success("回复成功", "", 1000);
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
        status:''
    };
    var listDropDown = {
        statusText:'状态'
    };
    function loadData() {
        utils.ajaxSubmit(apis.guestbook.getLists, param, function (data) {
            //根据状态值显示对应的状态文字 + 显示 有效/无效按钮  置顶/取消置顶按钮
            $.each(data.dataArr,function(i,n){
                n.statusText = consts.status.guestBook[n.status];
                n.isReadText = consts.status.isRead[n.isRead];
                (n.status=="1")? n.materialButtonGroup = comButtons: n.materialButtonGroup = '';
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
        param.status = 1;
        listDropDown.statusText = "待回复";
    }else{
        param.status = '';
        listDropDown.statusText = "状态";
    }

    loadData();
    utils.bindList($(document), operates);
    $sampleTable.on('click', '#dropStatusOptions a[data-id]', function () {
        param.status = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.statusText = "状态" : listDropDown.statusText = $(this).text();
        loadData();
    });
    $("#search").on("click",function(){
        param.pageNo = 1;
        param.title = $("#searchCont").val();
        loadData();
    });
    $('#searchCont').on('keypress',function(event){
        if (event.keyCode == 13) {
            $('#search').click();
        }
    });
});