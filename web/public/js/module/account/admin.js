require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var searchlabel = $(".searchlabel");
    var $addModal = $("#addModal");
    var $sampleTable = $('#sampleTable');
    var $visaPagination = $("#visaPagination");
    //按钮组集合
    var comButtons =
            '<button class="btn btn-primary" type="button" data-operate="edit">编辑</button>'+
            '<button class="btn btn-info" type="button" data-operate="look">查看</button>';

    searchlabel.on("click",function(){
        $("#selectsearchlabel").text($(this).text());
        $("#searchCont").val("");
        $("#searchCont").attr("data-id",'');
    });

    //新增
    $addModal.on("click",function(){
        var initialData = {
            dataArr:{
                status:1
            }
            //roleArr:roleArr
        };
        utils.renderModal('新增管理员', template('modalDiv',initialData), function(){
            if($("#visaPassportForm").valid()){
                utils.loading(true);
                utils.ajaxSubmit(apis.admin.add,$("#visaPassportForm").serialize(),function(data){
                    utils.loading(false);
                    hound.success("添加成功","",1000);
                    utils.modal.modal('hide');
                    param.p = 1;
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
            var userName = $this.closest("tr").find("td").eq(1).text();
            var realName = $this.closest("tr").find("td").eq(2).text();
            var statusText = $this.closest("tr").find("td").eq(3).text();
            var status = "";
            if(statusText.indexOf("正常")!='-1'){
                status = 1;
            }else if(statusText.indexOf("关闭")!='-1'){
                status = -1;
            }else{
                status = "";
            }
            var getByIdData = {
                dataArr:{
                    id:id,
                    userName:userName,
                    realName:realName,
                    status:status
                }
            };
            utils.renderModal('编辑管理员', template('modalDiv', getByIdData), function(){
                if($("#visaPassportForm").valid()) {
                    utils.loading(true);
                    utils.ajaxSubmit(apis.admin.edit, $("#visaPassportForm").serialize(), function (data) {
                        utils.loading(false);
                        hound.success("编辑成功", "", 1000);
                        utils.modal.modal('hide');
                        loadData();
                    })
                }
            }, 'md');
        },
        //查看
        look:function($this){
            var id = $this.closest("tr").attr("data-id");
            var userName = $this.closest("tr").find("td").eq(1).text();
            var realName = $this.closest("tr").find("td").eq(2).text();
            var statusText = $this.closest("tr").find("td").eq(3).text();
            var status = "";
            if(statusText.indexOf("正常")!='-1'){
                status = 1;
            }else if(statusText.indexOf("关闭")!='-1'){
                status = -1;
            }else{
                status = "";
            }
            var getByIdData = {
                dataArr:{
                    id:id,
                    userName:userName,
                    realName:realName,
                    status:status
                }
            };
            utils.renderModal('查看管理员', template('modalDiv', getByIdData),'', 'md');
            $("#visaPassportForm").append($("fieldset").prop('disabled', true));
        }
    };

    var param = {
        p: 1,
        ps:10,
        status:'',
        userName:''
        //roleId:''
    };
    var roleArr;
    function getRoleArr(){
        var roleParam = {
            p: 1,
            ps:10,
            status:'',
            title:''
        };
        utils.ajaxSubmit(apis.role.getLists, roleParam, function (data) {
            roleArr = data.dataArr;
        });
    }
    //getRoleArr();
    function loadData() {
        utils.ajaxSubmit(apis.admin.index, param, function (data) {
            $.each(data.list,function(i,n){
                n.statusText = consts.status.adminStatus[n.status];
                n.materialButtonGroup = comButtons ;
            });
            data.roleArr = roleArr;
            data.statusText = listDropDown.statusText;
            data.roleText = listDropDown.roleText;
            $sampleTable.html(template('visaListItem', data));
            utils.bindPagination($visaPagination, param, loadData);
            $visaPagination.html(utils.pagination(parseInt(data.count), param.p,20));
        });
    }
    // 页面首次加载列表数据
    //setTimeout(function(){
        loadData();
    //},100);
    utils.bindList($(document), operates);
    //列表筛选事件绑定
    var listDropDown = {
        statusText:'状态',
        roleText:'角色'
    };
    $sampleTable.on('click', '#dropStatusOptions a[data-id]', function () {
        param.status = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.statusText = "状态" : listDropDown.statusText = $(this).text();
        param.p = 1;
        loadData();
    }).on('click', '#dropRoleOptions a[data-id]', function () {
        param.roleId = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.roleText = "角色" : listDropDown.roleText = $(this).text();
        param.p = 1;
        loadData();
    });
    $("#search").on("click",function(){
        param.p = 1;
        param.userName = $("#searchCont").val();
        loadData();
    });
    $('#searchCont').on('keypress',function(event){
        if (event.keyCode == 13) {
            $('#search').click();
        }
    });
});