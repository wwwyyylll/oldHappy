/**
 * Created by wangyali on 2020/5/29.
 */
require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var searchlabel = $(".searchlabel");
    var $addModal = $("#addModal");
    var $sampleTable = $('#sampleTable');
    var $visaPagination = $("#visaPagination");
    //按钮组集合
    var comButtons = '<button class="btn btn-info" type="button" data-operate="look">查看明细</button>';

    searchlabel.on("click",function(){
        $("#selectsearchlabel").text($(this).text());
        $("#searchCont").val("");
        $("#searchCont").attr("data-id",'');
    })

    //新增
    $addModal.on("click",function(){
        var initialData = {
            itemArr:[{}],
            dataArr:{}
        };
        utils.renderModal('新增', template('modalDiv',initialData), function(){
            utils.reInputName($(".singItem"));
            if($("#visaPassportForm").valid()){
                utils.ajaxSubmit(apis.financialPackage.create,$("#visaPassportForm").serialize(),function(data){
                    hound.success("添加成功","",1000);
                    utils.modal.modal('hide');
                    loadData();
                })
            }
        }, 'lg');
    })
    var itemParam = {
        pageNo: 1,
        pageSize:10,
        id:''
    };
    //页面操作配置
    var operates = {
        //编辑
        edit:function($this){
            var id = $this.closest("tr").attr("data-id");
            utils.ajaxSubmit(apis.financialPackage.getById, {id: id}, function (data) {
                var getByIdData = {
                    dataArr:data
                };
                utils.renderModal('编辑', template('modalDiv', getByIdData), function(){
                    if($("#visaPassportForm").valid()) {
                        utils.ajaxSubmit(apis.financialPackage.updateById, $("#visaPassportForm").serialize(), function (data) {
                            hound.success("编辑成功", "", 1000);
                            utils.modal.modal('hide');
                            loadData();
                        })
                    }
                }, 'lg');
                $(".ruleTitleKey").on("input",function(){
                    var param = {
                        pageNo: 1,
                        pageSize:20,
                        title:$(this).val()
                    };
                    utils.ajaxSubmit(apis.digitalKingdomRule.getLists, param, function (data) {
                        if(data.dataArr.length!=0){
                            var $economyAbilityItem = ''
                            $.each(data.dataArr, function (i, v) {
                                $economyAbilityItem += '<div data-id="'+ v.id +'" class="economy-ability-item">'+ v.title +'</div>'
                            })
                            $('.ability-list').remove();
                            var $abilityList = '<div class="ability-list">'+ $economyAbilityItem +'</div>';
                            $(".ruleTitleKey").closest('.economy-wards').append($abilityList)

                            $('.economy-ability-item').click(function(){
                                $('.ability-list').remove();
                                var $index = $(this).index();
                                $('.ruleTitleKey').val(data.dataArr[$index].title);
                                $("input[name=ruleId]").val(data.dataArr[$index].id);
                            });
                        }
                    });
                })
            });
        },
        //查看
        look:function($this){
            var id = $this.closest("tr").attr("data-id");
            itemParam.pageNo = 1;
            itemParam.id = id;
            itemLoadData();
        },
        //无效
        setOff:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认无效吗?', '', function () {
                utils.ajaxSubmit(apis.financialPackage.setOff, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        //有效
        setOn:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认有效吗?', '', function () {
                utils.ajaxSubmit(apis.financialPackage.setOn, {id: id}, function (data) {
                    loadData();
                });
            });
        }
    }

    var param = {
        pageNo: 1,
        pageSize:10,
        userId:'',
        financialPackageTitle:''
    };

    function itemLoadData(){
        utils.ajaxSubmit(apis.financialPackage.getBuyItemLists, itemParam, function (data) {
            //根据结算状态值显示对应的结算状态文字
            $.each(data.dataArr,function(i,n){
                n.settlementText = consts.status.top[n.isSettlement];
            })
            var getByIdData = {
                dataArr:data.dataArr
            };
            utils.renderModal('查看明细', template('modalDiv', getByIdData),'', 'lg');
            utils.bindPagination($("#itemPagination"), itemParam, itemLoadData);
            $("#itemPagination").html(utils.pagination(parseInt(data.cnt), itemParam.pageNo));
        });
    }

    function loadData() {
        utils.ajaxSubmit(apis.financialPackage.getBuyLists, param, function (data) {
            $.each(data.dataArr,function(i,n){
                n.materialButtonGroup = comButtons;
            })
            $sampleTable.html(template('visaListItem', data));
            utils.bindPagination($visaPagination, param, loadData);
            $visaPagination.html(utils.pagination(parseInt(data.cnt), param.pageNo));
            $sampleTable.find('#date').val(param.date);
        });
    }
    // 页面首次加载列表数据
    loadData();
    utils.bindList($(document), operates);
    //列表筛选事件绑定
    $sampleTable.on('click', '#dropStatusOptions a[data-id]', function () {
        param.status = $(this).data('id');
        loadData();
        var titleText = "";
        ($(this).text()=="所有") ? titleText = "状态" : titleText = $(this).text();
        setTimeout(function(){
            $("#dropStatus").text(titleText);
        },300)
    });
    setInterval(function () {
        var $date = $sampleTable.find('#date');
        if ($date.length === 1) {
            if ($date.val() !== param.date) {
                param.date = $date.val();
                loadData();
            }
        }
    },500);
    $("#searchCont").on("input",function(){
        var selectsearchLabel = $("#selectsearchlabel").text();
        if(selectsearchLabel!="标题"){
            var param = {
                pageNo: 1,
                pageSize:20,
                status:'',
                mobile:'',
                nickName:$("#searchCont").val()
            };
            utils.ajaxSubmit(apis.user.getLists, param, function (data) {
                if(data.dataArr.length!=0){
                    var $economyAbilityItem = ''
                    $.each(data.dataArr, function (i, v) {
                        $economyAbilityItem += '<div data-id="'+ v.id +'" class="economy-ability-item">'+ v.nickName +'</div>'
                    })
                    $('.ability-list').remove();
                    var $abilityList = '<div class="ability-list">'+ $economyAbilityItem +'</div>';
                    $("#searchCont").closest('.economy-wards').append($abilityList);

                    $('.economy-ability-item').click(function(){
                        $('.ability-list').remove();
                        var $index = $(this).index();
                        $("#searchCont").val(data.dataArr[$index].nickName);
                        $("#searchCont").attr("data-id",data.dataArr[$index].id);
                    });
                }else{
                    $('.ability-list').remove();
                    var $abilityList = '<div class="ability-list">'+
                        '<div data-id="-1" class="economy-ability-item">无数据</div>'
                        +'</div>';
                    $("#searchCont").closest('.economy-wards').append($abilityList);

                    $('.economy-ability-item').click(function(){
                        $('.ability-list').remove();
                        var $index = $(this).index();
                        $("#searchCont").val("无数据");
                        $("#searchCont").attr("data-id","-1");
                    });
                }
            });
        }
    })
    $("#search").on("click",function(){
        param.pageNo = 1;
        //判断是标题搜索还是用户昵称搜索
        var selectsearchLabel = $("#selectsearchlabel").text();
        if(selectsearchLabel=="标题"){
            param.financialPackageTitle = $("#searchCont").val();
            param.userId = '';
            loadData();
        }else{
            param.financialPackageTitle = '';
            if($("#searchCont").val()==''){
                param.userId = '';
            }else{
                param.userId = $("#searchCont").attr("data-id");
            }
            loadData();
        }
    });
    $('#searchCont').on('keypress',function(event){
        if (event.keyCode == 13) {
            $('#search').click();
        }
    });
    $(document).on("click",function(){
        $('.ability-list').remove();
    })
});