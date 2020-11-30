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
        stopButton = '<button class="btn btn-danger" type="button" data-operate="setOff">无效</button>';

    searchlabel.on("click",function(){
        $("#selectsearchlabel").text($(this).text());
        $("#searchCont").val("");
        $("#searchCont").attr("data-id",'');
    })

    //新增数字王国
    $addModal.on("click",function(){
        var initialData = {
            itemArr:[{}],
            dataArr:{}
        };
        utils.renderModal('新增', template('modalDiv',initialData), function(){
            utils.reInputName($(".singItem"));
            if($("#visaPassportForm").valid()){
                utils.ajaxSubmit(apis.digitalKingdom.create,$("#visaPassportForm").serialize(),function(data){
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
            utils.ajaxSubmit(apis.digitalKingdom.getById, {id: id}, function (data) {
                var getByIdData = {
                    dataArr:data
                };
                utils.renderModal('编辑数字王国', template('modalDiv', getByIdData), function(){
                    if($("#visaPassportForm").valid()) {
                        utils.ajaxSubmit(apis.digitalKingdom.updateById, $("#visaPassportForm").serialize(), function (data) {
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
            utils.ajaxSubmit(apis.digitalKingdom.getById, {id: id}, function (data) {
                var getByIdData = {
                    dataArr:data
                };
                utils.renderModal('查看数字王国', template('modalDiv', getByIdData),'', 'lg');
                $("#visaPassportForm").append($("fieldset").prop('disabled', true));
            });
        },
        //无效
        setOff:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认无效吗?', '', function () {
                utils.ajaxSubmit(apis.digitalKingdom.setOff, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        //有效
        setOn:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认有效吗?', '', function () {
                utils.ajaxSubmit(apis.digitalKingdom.setOn, {id: id}, function (data) {
                    loadData();
                });
            });
        }
    }

    var param = {
        pageNo: 1,
        pageSize:10,
        status:'',
        date:''
    };

    function loadData() {
        utils.ajaxSubmit(apis.digitalKingdom.getLists, param, function (data) {
            //根据状态值显示对应的状态文字
            $.each(data.dataArr,function(i,n){
                n.statusText = consts.status.predict[n.status];
                n.settlementText = consts.status.top[n.isSettlement];
            })
            //操作按钮 编辑 + 查看 + 有效/无效 + isSettlement（1->结算 2->未结算）==2？"显示结算按钮" :"hide结算按钮"
            $.each(data.dataArr,function(i,n){
                (n.status=="1")? n.materialButtonGroup = comButtons + stopButton : n.materialButtonGroup = comButtons + startBouutn;
                (n.isSettlement=="1")? n.materialButtonGroup = '<button class="btn btn-info" type="button" data-operate="look">查看</button>' : n.materialButtonGroup = n.materialButtonGroup;
            });
            data.statusText = listDropDown.statusText;
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
    var listDropDown = {
        statusText:'状态',
    };
    $sampleTable.on('click', '#dropStatusOptions a[data-id]', function () {
        param.status = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.statusText = "状态" : listDropDown.statusText = $(this).text();
        loadData();
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
    $("#search").on("click",function(){
        param.pageNo = 1;
        param.mobile = $("#searchCont").val();
        loadData();
    });
    $('#searchCont').on('keypress',function(event){
        if (event.keyCode == 13) {
            $('#search').click();
        }
    });
});