require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var searchlabel = $(".searchlabel");
    var $addModal = $("#addModal");
    var $sampleTable = $('#sampleTable');
    var $visaPagination = $("#visaPagination");
    //按钮组集合
    var editButton = '<button class="btn btn-primary" type="button" data-operate="edit">编辑</button>',
        lookButton = '<button class="btn btn-info" type="button" data-operate="look">查看</button>',
        startBouutn =  '<button class="btn btn-primary" type="button" data-operate="setOn">有效</button>',
        stopButton = '<button class="btn btn-danger" type="button" data-operate="setOff">无效</button>',
        topButton = '<button class="btn btn-primary" type="button" data-operate="setTop">置顶</button>',
        cancelTopButton = '<button class="btn btn-danger" type="button" data-operate="cancelTop">取消置顶</button>';

    searchlabel.on("click",function(){
        $("#selectsearchlabel").text($(this).text());
        $("#searchCont").val("");
        $("#searchCont").attr("data-id",'');
    })

    //新增公告
    $addModal.on("click",function(){
        var initialData = {
            dataArr:{}
        };
        utils.renderModal('新增', template('modalDiv',initialData), function(){
            if($("#visaPassportForm").valid()){
                utils.ajaxSubmit(apis.bulletinBoard.create,$("#visaPassportForm").serialize(),function(data){
                    hound.success("添加成功","",1000);
                    utils.modal.modal('hide');
                    param.pageNo = 1;
                    loadData();
                })
            }
        }, 'lg');
    })

    //页面操作配置
    var operates = {
        //编辑
        edit:function($this){
            var id = $this.closest("tr").attr("data-id");
            utils.ajaxSubmit(apis.bulletinBoard.getById, {id: id}, function (data) {
                var getByIdData = {
                    dataArr:data
                };
                utils.renderModal('编辑公告', template('modalDiv', getByIdData), function(){
                    if($("#visaPassportForm").valid()) {
                        utils.ajaxSubmit(apis.bulletinBoard.updateById, $("#visaPassportForm").serialize(), function (data) {
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
            utils.ajaxSubmit(apis.bulletinBoard.getById, {id: id}, function (data) {
                var getByIdData = {
                    dataArr:data
                };
                utils.renderModal('查看公告', template('modalDiv', getByIdData),'', 'lg');
                $("#visaPassportForm").append($("fieldset").prop('disabled', true));
            });
        },
        //无效
        setOff:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认无效吗?', '', function () {
                utils.ajaxSubmit(apis.bulletinBoard.offById, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        //有效
        setOn:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认有效吗?', '', function () {
                utils.ajaxSubmit(apis.bulletinBoard.onById, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        //设为置顶
        setTop:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认设为置顶吗?', '', function () {
                utils.ajaxSubmit(apis.bulletinBoard.topById, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        //取消置顶
        cancelTop:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认取消置顶吗?', '', function () {
                utils.ajaxSubmit(apis.bulletinBoard.cancelTopById, {id: id}, function (data) {
                    loadData();
                });
            });
        }
    }

    var param = {
        pageNo: 1,
        pageSize:10,
        status:'',
        isTop:''
    };

    function loadData() {
        utils.ajaxSubmit(apis.bulletinBoard.getLists, param, function (data) {
            //根据状态值显示对应的状态文字 + 显示 有效/无效按钮  置顶/取消置顶按钮
            $.each(data.dataArr,function(i,n){
                n.statusText = consts.status.predict[n.status];
                n.topText = consts.status.top[n.isTop];
                if(n.type=="1"){
                    (n.status=="1")? n.materialButtonGroup = editButton + lookButton + stopButton : n.materialButtonGroup = editButton + lookButton + startBouutn;
                }else{
                    n.materialButtonGroup = lookButton ;
                }
                (n.isTop=="1")? n.materialButtonGroup = n.materialButtonGroup + cancelTopButton : n.materialButtonGroup = n.materialButtonGroup + topButton;
            });
            data.statusText = listDropDown.statusText;
            data.isTopText = listDropDown.isTopText;
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
        isTopText:'是否置顶'
    };
    $sampleTable.on('click', '#dropStatusOptions a[data-id]', function () {
        param.status = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.statusText = "状态" : listDropDown.statusText = $(this).text();
        loadData();
    }).on('click', '#dropTopOptions a[data-id]', function () {
        param.isTop = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.isTopText = "是否置顶" : listDropDown.isTopText = $(this).text();
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