require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var searchlabel = $(".searchlabel");
    var $addModal = $("#addModal");
    var $sampleTable = $('#sampleTable');
    var $visaPagination = $("#visaPagination");
    //按钮组集合
    var editButton = '<button class="btn btn-primary" type="button" data-operate="edit">编辑</button>',
        lookButton = '<button class="btn btn-info" type="button" data-operate="look">查看</button>';

    searchlabel.on("click",function(){
        $("#selectsearchlabel").text($(this).text());
    })

    //新增
    $addModal.on("click",function(){
        var initialData = {
            dataArr:{}
        };
        utils.renderModal('新增', template('modalDiv',initialData), function(){
            if($("#visaPassportForm").valid()){
                utils.ajaxSubmit(apis.policeOffice.create,$("#visaPassportForm").serialize(),function(data){
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
            utils.ajaxSubmit(apis.policeOffice.getById, {id: id}, function (data) {
                var getByIdData = {
                    dataArr:data
                };
                utils.renderModal('编辑', template('modalDiv', getByIdData), function(){
                    if($("#visaPassportForm").valid()) {
                        utils.ajaxSubmit(apis.policeOffice.updateById, $("#visaPassportForm").serialize(), function (data) {
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
            utils.ajaxSubmit(apis.policeOffice.getById, {id: id}, function (data) {
                var getByIdData = {
                    dataArr:data
                };
                utils.renderModal('查看', template('modalDiv', getByIdData),'', 'lg');
                $("#visaPassportForm").append($("fieldset").prop('disabled', true));
            });
        },
    }

    // 页面首次加载列表数据
    //打开的对应的页面nav + active属性
    var loc = location.href;
    var n1 = loc.length;//地址的总长度
    var n2 = loc.indexOf("=");//取得=号的位置
    var id = decodeURI(loc.substr(n2+1,n1-n2));//从=号后面的内容
    var urlParam = id.split("=");
    var paramUserId = '';
    var paramUserNickName = '';
    if(urlParam.length!=1){
        paramUserId = parseInt(urlParam[0]);
        paramUserNickName = urlParam[1];
    }else{
        paramUserId = '';
        paramUserNickName = '';
    }
    $("#searchCont").val(paramUserNickName);

    var param = {
        pageNo: 1,
        pageSize:10,
        userId:paramUserId
    };

    function loadData() {
        utils.ajaxSubmit(apis.policeOffice.getLists, param, function (data) {
            //根据状态值显示对应的状态文字 + 显示对应的 允许登录/禁止登录 按钮
            $.each(data.dataArr,function(i,n){
                if(n.canEdit==1){
                    n.materialButtonGroup = editButton + lookButton;
                }else{
                    n.materialButtonGroup = lookButton;
                }
            })
            $sampleTable.html(template('visaListItem', data));
            utils.bindPagination($visaPagination, param, loadData);
            $visaPagination.html(utils.pagination(parseInt(data.cnt), param.pageNo));
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
    $("#searchCont").on("input",function(){
        var selectsearchLabel = $("#selectsearchlabel").text();
        if(selectsearchLabel=="用户昵称"){
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
                }
            });
        }
    })
    $("#search").on("click",function(){
        param.pageNo = 1;
        //判断是标题搜索还是用户昵称搜索
        var selectsearchLabel = $("#selectsearchlabel").text();
        if(selectsearchLabel=="用户昵称"){
            if($("#searchCont").val()!=''){
                param.userId = $("#searchCont").attr("data-id");
                loadData();
            }else{
                param.userId = '';
                loadData();
            }
        }
    });
    $('#searchCont').on('keypress',function(event){
        if (event.keyCode == 13) {
            $('#search').click();
        }
    });
    $(document).click(function(){
        $('.ability-list').remove();
    });
});