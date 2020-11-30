require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var searchlabel = $(".searchlabel");
    var $sampleTable = $('#sampleTable');
    var $visaPagination = $("#visaPagination");
    var $searchCont = $("#searchCont");
    //按钮组集合
    var lookButton = '<button class="btn btn-info" type="button" data-operate="look">查看</button>',
        deliverButton = '<button class="btn btn-primary" type="button" data-operate="deliver">发货</button>',
        receiveButton = '<button class="btn btn-success" type="button" data-operate="receive">收货</button>';

    searchlabel.on("click",function(){
        $("#selectsearchlabel").text($(this).text());
        $("#searchCont").val("");
        $("#searchCont").attr("data-id",'');
    });

    //页面操作配置
    var operates = {
        //查看
        look:function($this){
            var id = $this.closest("tr").attr("data-id");
            utils.ajaxSubmit(apis.cutReward.getById, {id: id}, function (data) {
                var initialData = {
                    dataArr:data
                };
                initialData.dataArr.statusText = consts.status.expressStatus[initialData.dataArr.status];
                utils.renderModal('查看详情', template('lookModal', initialData), '', 'lg');
            })
        },
        //发货
        deliver:function($this){
            var id = $this.closest("tr").attr("data-id");
            utils.ajaxSubmit(apis.cutReward.getById, {id: id}, function (data) {
                var initialData = {
                    dataArr:data
                };
                utils.renderModal('发货', template('deliverModal', initialData), function(){
                    if($("#deliverForm").valid()) {
                        utils.ajaxSubmit(apis.cutReward.deliveredById, $("#deliverForm").serialize(), function (data) {
                            hound.success("发货成功", "", 1000);
                            utils.modal.modal('hide');
                            loadData();
                        })
                    }
                }, 'md');
                $(".expressCompanyId").on("keyup",function(){
                    var expressParam = {
                        pageNo: 1,
                        pageSize:50000,
                        expName:$(".expressCompanyId").val(),
                        status:1
                    };
                    utils.ajaxSubmit(apis.expressCompany.getLists, expressParam, function (data) {
                        if(data.dataArr.length!=0){
                            var $economyAbilityItem = '';
                            $.each(data.dataArr, function (i, v) {
                                $economyAbilityItem += '<div data-id="'+ v.id +'" class="economy-ability-item">'+ v.expName +'</div>'
                            });
                            $('.ability-list').remove();
                            var $abilityList = '<div class="ability-list">'+ $economyAbilityItem +'</div>';
                            $(".expressCompanyId").closest('.economy-wards').append($abilityList);

                            $('.economy-ability-item').click(function(){
                                $('.ability-list').remove();
                                var $index = $(this).index();
                                $(".expressCompanyId").val(data.dataArr[$index].expName);
                                $("input[name=expressCompanyId]").val(data.dataArr[$index].id);
                            });
                        }
                    });
                });
            });
        },
        //收货
        receive:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认收货吗?', '', function () {
                utils.ajaxSubmit(apis.cutReward.receivedById, {id: id}, function (data) {
                    loadData();
                });
            });
        }
    };

    var param = {
        pageNo: 1,
        pageSize:10,
        title:'',
        status:'',
        userId:''
    };

    var expressCompanyArr;
    function getExpressCompanyLists(){
        var expressCompanyParam = {
            pageNo: 1,
            pageSize:10000,
            expName:'',
            status:''
        };
        utils.ajaxSubmit(apis.expressCompany.getLists, expressCompanyParam, function (data) {
            expressCompanyArr = data.dataArr;
        })
    }
    function loadData() {
        utils.ajaxSubmit(apis.cutReward.getLists, param, function (data) {
            $.each(data.dataArr,function(i,n){
                n.statusText = consts.status.expressStatus[n.status];
                if(n.status==1){
                    n.materialButtonGroup = lookButton + deliverButton
                }else if(n.status==2){
                    n.materialButtonGroup = lookButton + receiveButton
                }else if(n.status==3){
                    n.materialButtonGroup = lookButton
                }
            });
            data.statusText = listDropDown.statusText;
            $sampleTable.html(template('visaListItem', data));
            utils.bindPagination($visaPagination, param, loadData);
            $visaPagination.html(utils.pagination(parseInt(data.cnt), param.pageNo));
        });
    }
    getExpressCompanyLists();
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
    $("#search").on("click",function(){
        param.pageNo = 1;
        var selectSearchLabel = $("#selectsearchlabel").text();
        if(selectSearchLabel=="标题"){
            param.title = $("#searchCont").val();
            param.userId = '';
            loadData();
        }else if(selectSearchLabel=="会员ID"){
            param.userId = $("#searchCont").val();
            param.title = '';
            loadData();
        }
    });
    $('#searchCont').on('keypress',function(event){
        if (event.keyCode == 13) {
            $('#search').click();
        }
    });
});