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
        stopButton = '<button class="btn btn-danger" type="button" data-operate="setOff">无效</button>';

    searchlabel.on("click",function(){
        $("#selectsearchlabel").text($(this).text());
        $("#searchCont").val("");
        $("#searchCont").attr("data-id",'');
    });

    //新增
    $addModal.on("click",function(){
        var initialData = {
            dataArr:{}
        };
        utils.renderModal('新增级别', template('modalDiv',initialData), function(){
            if($("#visaPassportForm").valid()){
                utils.loading(true);
                utils.ajaxSubmit(apis.mallPopularizeCommission.create,$("#visaPassportForm").serialize(),function(data){
                    utils.loading(false);
                    hound.success("添加成功","",1000);
                    utils.modal.modal('hide');
                    param.pageNo = 1;
                    loadData();
                })
            }
        }, 'md');
    });

    //页面操作配置
    var operates = {
        //编辑
        edit:function($this){
            var id = $this.closest("tr").attr("data-id");
            utils.ajaxSubmit(apis.mallPopularizeCommission.getById, {id: id}, function (data) {
                var getByIdData = {
                    dataArr:data
                };
                utils.renderModal('编辑级别', template('modalDiv', getByIdData), function(){
                    if($("#visaPassportForm").valid()) {
                        utils.loading(true);
                        utils.ajaxSubmit(apis.mallPopularizeCommission.updateById, $("#visaPassportForm").serialize(), function (data) {
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
            utils.ajaxSubmit(apis.mallPopularizeCommission.getById, {id: id}, function (data) {
                var getByIdData = {
                    dataArr:data
                };
                utils.renderModal('查看级别', template('modalDiv', getByIdData),'', 'md');
                $("#visaPassportForm").append($("fieldset").prop('disabled', true));
            });
        },
        //无效
        setOff:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认无效吗?', '', function () {
                utils.ajaxSubmit(apis.mallPopularizeCommission.offById, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        //有效
        setOn:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认有效吗?', '', function () {
                utils.ajaxSubmit(apis.mallPopularizeCommission.onById, {id: id}, function (data) {
                    loadData();
                });
            });
        }
    };

    var param = {
        pageNo: 1,
        pageSize:10,
        status:''
    };

    function loadData() {
        utils.ajaxSubmit(apis.mallPopularizeCommission.getLists, param, function (data) {
            $.each(data.dataArr,function(i,n){
                n.statusText = consts.status.ordinary[n.status];
                n.levelText = consts.status.level[n.level];
                (n.status=="1")? n.materialButtonGroup = comButtons + stopButton : n.materialButtonGroup = comButtons + startBouutn;
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
        statusText:'状态'
    };
    $sampleTable.on('click', '#dropStatusOptions a[data-id]', function () {
        param.status = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.statusText = "状态" : listDropDown.statusText = $(this).text();
        param.pageNo = 1;
        loadData();
    });
    $("#search").on("click",function(){
        param.pageNo = 1;
        param.userName = $("#searchCont").val();
        loadData();
    });
    $('#searchCont').on('keypress',function(event){
        if (event.keyCode == 13) {
            $('#search').click();
        }
    });
});