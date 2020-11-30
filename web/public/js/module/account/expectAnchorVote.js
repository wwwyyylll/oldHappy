require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var searchlabel = $(".searchlabel");
    var $sampleTable = $('#sampleTable');
    var $visaPagination = $("#visaPagination");
    var $searchCont = $("#searchCont");
    //按钮组集合
    var comButtons =
            '<button class="btn btn-primary" type="button" data-operate="edit">编辑</button>'+
            '<button class="btn btn-info" type="button" data-operate="look">查看</button>',
        passBouutn =  '<button class="btn btn-primary" type="button" data-operate="pass">审核通过</button>',
        noPassButton = '<button class="btn btn-danger" type="button" data-operate="noPass">审核不通过</button>',
        usedButton = '<button class="btn btn-success" type="button" data-operate="used">收录</button>',
        editButton = '<button class="btn btn-primary" type="button" data-operate="editCnt">编辑</button>',
        userButton = '<button class="btn btn-warning" type="button" data-operate="userLog">投票日志</button>';

    searchlabel.on("click",function(){
        $("#selectsearchlabel").text($(this).text());
        $("#searchCont").val("");
        $("#searchCont").attr("data-id",'');
    });

    //页面操作配置
    var operates = {
        userLog:function($this){
            var id = $this.closest("tr").attr("data-id");
            window.open("@@HOSTview/account/expectAnchorVoteUser.html?id=" + id);
        },
        //编辑
        editCnt:function($this){
            var id = $this.closest("tr").attr("data-id");
            utils.ajaxSubmit(apis.expectAnchorVote.getById, {id: id}, function (data) {
                var getByIdData = {
                    dataArr:data,
                    anchorTagArr:anchorTagArr
                };
                utils.renderModal('编辑', template('modalDiv', getByIdData), function(){
                    if($("#visaPassportForm").valid()) {
                        utils.loading(true);
                        utils.ajaxSubmit(apis.expectAnchorVote.update, $("#visaPassportForm").serialize(), function (data) {
                            utils.loading(false);
                            hound.success("编辑成功", "", 1000);
                            utils.modal.modal('hide');
                            loadData();
                        })
                    }
                }, 'md');
            });
        },
        //查看
        look:function($this){
            var id = $this.closest("tr").attr("data-id");
            utils.ajaxSubmit(apis.expectAnchorVote.getById, {id: id}, function (data) {
                var getByIdData = {
                    dataArr:data
                };
                utils.renderModal('查看淘宝分类', template('modalDiv', getByIdData),'', 'md');
                $("#visaPassportForm").append($("fieldset").prop('disabled', true));
            });
        },
        //无效
        setOff:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认无效吗?', '', function () {
                utils.ajaxSubmit(apis.expectAnchorVote.offById, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        //有效
        setOn:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认有效吗?', '', function () {
                utils.ajaxSubmit(apis.expectAnchorVote.onById, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        pass:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认审核通过吗?', '', function () {
                utils.ajaxSubmit(apis.expectAnchorVote.passById, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        noPass:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认审核不通过吗?', '', function () {
                utils.ajaxSubmit(apis.expectAnchorVote.noPassById, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        used:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认收录吗?', '', function () {
                utils.ajaxSubmit(apis.expectAnchorVote.usedById, {id: id}, function (data) {
                    loadData();
                });
            });
        }
    }

    var param = {
        pageNo: 1,
        pageSize:10,
        status:'',
        name:'',
        orderByCnt:''
    };

    var anchorTagArr;
    function getAnchorTagArr(){
        var anchorTagParam = {
            pageNo: 1,
            pageSize:50000,
            name:'',
            status:''
        };
        utils.ajaxSubmit(apis.tag.getLists, anchorTagParam, function (data) {
            $.each(data.dataArr,function(i,n){
                n.statusText = consts.status.ordinary[n.status];
            });
            anchorTagArr = data.dataArr;
        });
    }
    getAnchorTagArr();

    function loadData() {
        utils.ajaxSubmit(apis.expectAnchorVote.getLists, param, function (data) {
            $.each(data.dataArr,function(i,n){
                n.statusText = consts.status.expectAnchorVote[n.status];
                if(n.status==1){
                    n.materialButtonGroup = editButton + passBouutn + noPassButton ;
                }else if(n.status==2){
                    n.materialButtonGroup = editButton + usedButton + userButton ;
                }else if(n.status==3){
                    n.materialButtonGroup = editButton ;
                }else{
                    n.materialButtonGroup = editButton + userButton;
                }
            });
            data.statusText = listDropDown.statusText;
            data.orderByCntText = listDropDown.orderByCntText;
            $sampleTable.html(template('visaListItem', data));
            utils.bindPagination($visaPagination, param, loadData);
            $visaPagination.html(utils.pagination(parseInt(data.cnt), param.pageNo));
        });
    }
    // 页面首次加载列表数据
    loadData();
    utils.bindList($(document), operates);
    var listDropDown = {
        statusText:'状态',
        orderByCntText:'总投票数'
    };
    $sampleTable.on('click', '#dropStatusOptions a[data-id]', function () {
        param.status = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.statusText = "状态" : listDropDown.statusText = $(this).text();
        param.pageNo = 1;
        loadData();
    }).on('click', '#dropSortOptions a[data-id]', function () {
        param.orderByCnt = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.orderByCntText = "总投票数" : listDropDown.orderByCntText = $(this).text();
        param.pageNo = 1;
        loadData();
    });
    $("#search").on("click",function(){
        param.pageNo = 1;
        param.name = $("#searchCont").val();
        loadData();
    });
    $('#searchCont').on('keypress',function(event){
        if (event.keyCode == 13) {
            $('#search').click();
        }
    });
});