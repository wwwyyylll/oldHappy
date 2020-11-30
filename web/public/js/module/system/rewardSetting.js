require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var searchlabel = $(".searchlabel");
    var $addModal = $("#addModal");
    var $sampleTable = $('#sampleTable');
    var $visaPagination = $("#visaPagination");
    //按钮组集合
    var comButtons = '<button class="btn btn-info" type="button" data-operate="look">查看明细</button>',
        startBouutn =  '<button class="btn btn-primary" type="button" data-operate="setOn">有效</button>',
        stopButton = '<button class="btn btn-danger" type="button" data-operate="setOff">无效</button>',
        continuityLoginButton = '<button class="btn btn-primary" type="button" data-operate="continuityLogin">连续登录奖励</button>',
        itemEditButton = '<button class="btn btn-primary" type="button" data-operate="itemEdit">编辑</button>',
        itemStartButton = '<button class="btn btn-primary" type="button" data-operate="itemStart">有效</button>',
        itemStopButton = '<button class="btn btn-danger" type="button" data-operate="itemStop">无效</button>',
        continueLoginEditButton = '<button class="btn btn-primary" type="button" data-operate="continueLoginEdit">编辑</button>',
        continueLoginStartButton = '<button class="btn btn-primary" type="button" data-operate="continueLoginStart">有效</button>',
        continueLoginStopButton = '<button class="btn btn-danger" type="button" data-operate="continueLoginStop">无效</button>';

    searchlabel.on("click",function(){
        $("#selectsearchlabel").text($(this).text());
        $("#searchCont").val("");
        $("#searchCont").attr("data-id",'');
    })

    //页面操作配置
    var operates = {
        //编辑明细
        itemEdit:function($this){
            var tr = $this.closest("tr");
            var tdAll = tr.find("td");
            var id = tr.attr("data-id");
            var reward = tdAll.eq(2).text();
            var rewardInput = $("<input type='text' class='form-control' placeholder='请输入能量值' name='reward' value='"+ reward +"'>");
            tdAll.eq(2).html(" ");
            tdAll.eq(2).html(rewardInput);
            var buttonArr = tdAll.eq(tdAll.length-1).html();
            tdAll.eq(tdAll.length-1).html(" ");
            tdAll.eq(tdAll.length-1).html(
                '<input type="button" class="btn btn-primary btn-sm hoc-btn-sm saveInput" style="outline:none;margin: 2px;" value="保存">'+
                '<input type="button" class="btn btn-success btn-sm hoc-btn-sm cancelEdit" style="outline:none;margin: 2px;" value="返回">'
            );
            $(".saveInput").on("click",function(){
                var rewardInput = tdAll.eq(2).find("input").val();
                var data = {
                    id:id,
                    reward:rewardInput
                };
                if(rewardInput!=""){
                    utils.ajaxSubmit(apis.rewardSetting.item_updateById, data, function (data) {
                        hound.success("编辑成功", "", 1000);
                        tdAll.eq(2).html(" ");
                        tdAll.eq(2).text(rewardInput);
                        tdAll.eq(tdAll.length-1).html("");
                        tdAll.eq(tdAll.length-1).html(buttonArr);
                        //loadData();
                    })
                }else{
                    hound.error("请填写能量值");
                }
            });
            $(".cancelEdit").on("click",function(){
                tdAll.eq(2).html(" ");
                tdAll.eq(2).text(reward);
                tdAll.eq(tdAll.length-1).html("");
                tdAll.eq(tdAll.length-1).html(buttonArr);
            });
        },
        //编辑连续登录能量
        continueLoginEdit:function($this){
            var tr = $this.closest("tr");
            var tdAll = tr.find("td");
            var id = tr.attr("data-id");
            var reward = tdAll.eq(3).text();
            var rewardInput = $("<input type='text' class='form-control' placeholder='请输入能量值' name='reward' value='"+ reward +"'>");
            tdAll.eq(3).html(" ");
            tdAll.eq(3).html(rewardInput);
            var buttonArr = tdAll.eq(tdAll.length-1).html();
            tdAll.eq(tdAll.length-1).html(" ");
            tdAll.eq(tdAll.length-1).html(
                '<input type="button" class="btn btn-primary btn-sm hoc-btn-sm saveInput" style="outline:none;margin: 2px;" value="保存">'+
                '<input type="button" class="btn btn-success btn-sm hoc-btn-sm cancelEdit" style="outline:none;margin: 2px;" value="返回">'
            );
            $(".saveInput").on("click",function(){
                var rewardInput = tdAll.eq(3).find("input").val();
                var data = {
                    id:id,
                    reward:rewardInput
                };
                if(rewardInput!=""){
                    utils.ajaxSubmit(apis.rewardSetting.continuityLoginEnergy_updateById, data, function (data) {
                        hound.success("编辑成功", "", 1000);
                        tdAll.eq(3).html(" ");
                        tdAll.eq(3).text(rewardInput);
                        tdAll.eq(tdAll.length-1).html("");
                        tdAll.eq(tdAll.length-1).html(buttonArr);
                        //loadData();
                    })
                }else{
                    hound.error("请填写能量值");
                }
            });
            $(".cancelEdit").on("click",function(){
                tdAll.eq(3).html(" ");
                tdAll.eq(3).text(reward);
                tdAll.eq(tdAll.length-1).html("");
                tdAll.eq(tdAll.length-1).html(buttonArr);
            });
        },
        continuityLogin:function($this){
            var id = $this.closest("tr").attr("data-id");
            continueLoginLoadData();
        },
        //查看明细---无效
        continueLoginStop:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认无效吗?', '', function () {
                utils.ajaxSubmit(apis.rewardSetting.continuityLoginEnergy_offById, {id: id}, function (data) {
                    continueLoginLoadData();
                });
            });
        },
        //查看明细---有效
        continueLoginStart:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认有效吗?', '', function () {
                utils.ajaxSubmit(apis.rewardSetting.continuityLoginEnergy_onById, {id: id}, function (data) {
                    continueLoginLoadData();
                });
            });
        },
        //查看明细
        look:function($this){
            var id = $this.closest("tr").attr("data-id");
            itemLoadData(id);
        },
        //查看明细---无效
        itemStop:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认无效吗?', '', function () {
                utils.ajaxSubmit(apis.rewardSetting.item_offById, {id: id}, function (data) {
                    itemLoadData(id);
                });
            });
        },
        //查看明细---有效
        itemStart:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认有效吗?', '', function () {
                utils.ajaxSubmit(apis.rewardSetting.item_onById, {id: id}, function (data) {
                    itemLoadData(id);
                });
            });
        },
        //无效
        setOff:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认无效吗?', '', function () {
                utils.ajaxSubmit(apis.rewardSetting.offById, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        //有效
        setOn:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认有效吗?', '', function () {
                utils.ajaxSubmit(apis.rewardSetting.onById, {id: id}, function (data) {
                    loadData();
                });
            });
        }
    }

    var param = {
        pageNo: 1,
        pageSize:10,
        status:''
    };

    function itemLoadData(id){
        utils.ajaxSubmit(apis.rewardSetting.item_getListsByRewardSettingId, {rewardSettingId: id}, function (data) {
            //根据状态值显示对应的状态文字 + 显示 有效/无效按钮
            $.each(data,function(i,n){
                n.statusText = consts.status.predict[n.status];
                (n.status=="1")? n.materialButtonGroup = itemEditButton + itemStopButton : n.materialButtonGroup = itemEditButton + itemStartButton;
            })
            var getByIdData = {
                dataArr:data
            };
            utils.renderModal('查看明细', template('listItem', getByIdData),'', 'lg');
        });
    }
    function continueLoginLoadData(id){
        utils.ajaxSubmit(apis.rewardSetting.continuityLoginEnergy_getLists, '', function (data) {
            //根据状态值显示对应的状态文字 + 显示 有效/无效按钮
            $.each(data,function(i,n){
                n.statusText = consts.status.predict[n.status];
                (n.status=="1")? n.materialButtonGroup = continueLoginEditButton + continueLoginStopButton : n.materialButtonGroup = continueLoginEditButton + continueLoginStartButton;
            })
            var getByIdData = {
                dataArr:data
            };
            utils.renderModal('连续登陆奖励', template('listContinueLogin', getByIdData),'', 'lg');
        });
    }
    function loadData() {
        utils.ajaxSubmit(apis.rewardSetting.getLists, param, function (data) {
            //根据状态值显示对应的状态文字 + 显示 有效/无效按钮  置顶/取消置顶按钮
            $.each(data.dataArr,function(i,n){
                n.statusText = consts.status.predict[n.status];
                (n.status=="1")? n.materialButtonGroup = comButtons + stopButton : n.materialButtonGroup = comButtons + startBouutn;
                (n.continuityLoginButton=="1")? n.materialButtonGroup = n.materialButtonGroup + continuityLoginButton : n.materialButtonGroup = n.materialButtonGroup;
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
        statusText:'状态',
    };
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