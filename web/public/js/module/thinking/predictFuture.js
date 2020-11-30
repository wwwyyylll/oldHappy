require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var searchlabel = $(".searchlabel");
    var $addModal = $("#addModal");
    var $sampleTable = $('#sampleTable');
    var $visaPagination = $("#visaPagination");
    //按钮组集合
    var comButtons =
            '<button class="btn btn-primary" type="button" data-operate="edit">编辑</button>'+
            '<button class="btn btn-info" type="button" data-operate="look">查看</button>'
        ,
        startBouutn =  '<button class="btn btn-primary" type="button" data-operate="setOn">有效</button>',
        stopButton = '<button class="btn btn-danger" type="button" data-operate="setOff">无效</button>',
        settlementButton = '<button class="btn btn-primary" type="button" data-operate="settlement">结算</button>',
        topButton = '<button class="btn btn-primary" type="button" data-operate="setTop">置顶</button>',
        cancelTopButton = '<button class="btn btn-danger" type="button" data-operate="cancelTop">取消置顶</button>';

    searchlabel.on("click",function(){
        $("#selectsearchlabel").text($(this).text());
        $("#searchCont").val("");
        $("#searchCont").attr("data-id",'');
    })

    //新增遇见未来
    $addModal.on("click",function(){
        var initialData = {
            itemArr:[{}],
            dataArr:{}
        };
        utils.renderModal('新增预见未来', template('modalDiv',initialData), function(){
            utils.reInputName($(".singItem"));
            if($("#visaPassportForm").valid()){
                utils.ajaxSubmit(apis.predictFuture.create,$("#visaPassportForm").serialize(),function(data){
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
        //新增预见选项
        addSelect:function(){
            $("#itemSelectDiv").append(template('singItemDiv', ''));
        },
        //删除预见选项
        delSelect:function($this){
            var row = $this.closest(".form-row");
            //编辑页面要统计已有ID的预见选项 delItemArr[0][id]
            var delId = row.find("input").eq(0).val();
            if(delId!=""){
                var delItemArr = $("#delItemArr");
                delItemArr.append('<div class="delItemSingle"><input type="hidden" name="delItemArr[][id]" value="'+ delId +'" class="form-control"></div');
            }
            row.remove();
        },
        //编辑
        edit:function($this){
            var id = $this.closest("tr").attr("data-id");
            utils.ajaxSubmit(apis.predictFuture.getById, {id: id}, function (data) {
                var data = {
                    itemArr:(data.itemArr.length!=0)? data.itemArr : [{}],
                    dataArr:data.dataArr
                };
                utils.renderModal('编辑预见未来', template('modalDiv', data), function(){
                    utils.reInputName($(".singItem"));
                    utils.reInputName($(".delItemSingle"));
                    if($("#visaPassportForm").valid()) {
                        utils.ajaxSubmit(apis.predictFuture.updateById, $("#visaPassportForm").serialize(), function (data) {
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
            utils.ajaxSubmit(apis.predictFuture.getById, {id: id}, function (data) {
                var data = {
                    itemArr:(data.itemArr.length!=0)? data.itemArr : [{}],
                    dataArr:data.dataArr
                };
                utils.renderModal('查看预见未来', template('modalDiv', data),'', 'lg');
                $("#visaPassportForm").append($("fieldset").prop('disabled', true));
            });
        },
        setAnswer:function($this){
            hound.confirm('确认设为答案吗?', '', function () {
                var row = $this.closest(".form-row");
                row.find(".col-9").find(".input-group").addClass("singItemSelect");
                row.siblings().find(".col-9").find(".input-group").removeClass("singItemSelect");

                var id = $("#settlementForm").find("input[name=id]").val();
                var itemId = '';
                var itemRow = $(".itemRow");
                for(var i=0;i<itemRow.length;i++){
                    if(itemRow.eq(i).find(".col-9").find(".input-group").hasClass("singItemSelect")){
                        itemId = itemRow.eq(i).find(".itemId").val();
                    }
                }
                var data = {
                    id:id,
                    itemId:itemId
                }
                if(itemId!=''){
                    utils.ajaxSubmit(apis.predictFuture.settlementById,data,function(data){
                        hound.success("设置成功","",1000);
                        utils.modal.modal('hide');
                        loadData();
                    })
                }else{
                    hound.error("请设置答案","","");
                }
            })
        },
        //结算
        settlement:function($this){
            var id = $this.closest("tr").attr("data-id");
            utils.ajaxSubmit(apis.predictFuture.getById, {id: id}, function (data) {
                var data = {
                    itemArr:(data.itemArr.length!=0)? data.itemArr : [{}],
                    dataArr:data.dataArr
                };
                utils.renderModal('结算', template('settlementDiv', data),'', 'md');
            });
        },
        //无效
        setOff:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认无效吗?', '', function () {
                utils.ajaxSubmit(apis.predictFuture.setOff, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        //有效
        setOn:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认有效吗?', '', function () {
                utils.ajaxSubmit(apis.predictFuture.setOn, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        //设为置顶
        setTop:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认设为置顶吗?', '', function () {
                utils.ajaxSubmit(apis.predictFuture.topById, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        //取消置顶
        cancelTop:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认取消置顶吗?', '', function () {
                utils.ajaxSubmit(apis.predictFuture.cancelTopById, {id: id}, function (data) {
                    loadData();
                });
            });
        }
    }

    var param = {
        pageNo: 1,
        pageSize:10,
        category:'',
        source:'',
        isTop:'',
        title:''
    };

    function loadData() {
        utils.ajaxSubmit(apis.predictFuture.getLists, param, function (data) {
            //根据状态值显示对应的状态文字
            $.each(data.dataArr,function(i,n){
                n.statusText = consts.status.predict[n.status];
                n.settlementText = consts.status.top[n.isSettlement];
                n.topText = consts.status.top[n.isTop];
            })
            //操作按钮 编辑 + 查看 + 有效/无效 + isSettlement（1->结算 2->未结算）==2？"显示结算按钮" :"hide结算按钮"
            $.each(data.dataArr,function(i,n){
                (n.status=="1")? n.materialButtonGroup = comButtons + stopButton : n.materialButtonGroup = comButtons + startBouutn;
                (n.settlementButton=="1")? n.materialButtonGroup = n.materialButtonGroup + settlementButton : n.materialButtonGroup = n.materialButtonGroup;
                (n.isTop=="1")? n.materialButtonGroup = n.materialButtonGroup + cancelTopButton : n.materialButtonGroup = n.materialButtonGroup + topButton;
                (n.isSettlement=="1")? n.materialButtonGroup = '<button class="btn btn-info" type="button" data-operate="look">查看</button>' : n.materialButtonGroup = n.materialButtonGroup;
            });
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
        isTopText:'是否置顶'
    };
    $sampleTable.on('click', '#dropStatusOptions a[data-id]', function () {
        param.status = $(this).data('id');
        loadData();
        var titleText = "";
        ($(this).text()=="所有") ? titleText = "状态" : titleText = $(this).text();
        setTimeout(function(){
            $("#dropStatus").text(titleText);
        },300)
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