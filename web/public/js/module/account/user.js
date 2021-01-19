require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var searchlabel = $(".searchlabel");
    var $addModal = $("#addModal");
    var $sampleTable = $('#sampleTable');
    var $visaPagination = $("#visaPagination");
    //按钮组集合
    var comButtons = '<button class="btn btn-info" type="button" data-operate="look">查看详情</button>',
        setOperatorButton = '<button class="btn btn-primary" type="button" data-operate="setOperator">设为运营者</button>',
        cancelOperatorButton = '<button class="btn btn-danger" type="button" data-operate="cancelOperator">取消运营者</button>';

    searchlabel.on("click",function(){
        $("#selectsearchlabel").text($(this).text());
        $("#searchCont").val("");
        $("#searchCont").attr("data-id",'');
    });

    //上传图片文件
    function blobToDataURL(blob,cb) {
        var reader = new FileReader();
        reader.onload = function (evt) {
            var base64 = evt.target.result;
            cb(base64)
        };
        reader.readAsDataURL(blob);
    }
    function uploadFile(){
        //选择图片文件
        $(".uploadImg").change(function(){
            var uploadFile = $(this).closest(".uploadFile");
            //判断是否支持FileReader
            if (window.FileReader) {
                var reader = new FileReader();
            } else {
                hound.alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
            }
            var file = this.files[0];
            reader.onload = function(e) {
                //获取图片dom
                uploadFile.find(".imgUrl").html('<i class="fa fa-image mr-2"></i>' + file.name)
                if(file.name!=""){
                    uploadFile.find(".avatarUpload").removeAttr("disabled");
                    uploadFile.find(".avatarUpload").removeClass("btn-default");
                    uploadFile.find(".avatarUpload").addClass("btn-primary");
                }
            };
            reader.readAsDataURL(file);

            if(file){
                var url = URL.createObjectURL(file);
                var base64 = blobToDataURL(file,function(base64Url) {
                    uploadFile.find(".temporaryFile").text(base64Url);
                })
            }
        });
        // 上传图片文件
        $('.avatarUpload').click(function () {
            var uploadFile = $(this).closest(".uploadFile");
            $.ajax({
                type:'POST',
                url: "@@API",
                data: {
                    c:"img",
                    a:"uploadForBase64",
                    linkUserName:consts.param.linkUserName,
                    linkPassword:consts.param.linkPassword,
                    signature:consts.param.signature,
                    userToken: $.cookie('userToken'),
                    content:uploadFile.find(".temporaryFile").text()
                },
                dataType: 'json',
                success: function (res) {
                    uploadFile.find(".imgUrl").html("");
                    uploadFile.find(".imgUrl").html("<a target='_blank' href='"+ res.result +"'><img style='display: inline-block;width: 25px;height: 20px' src='"+ res.result +"'></a>");
                    uploadFile.find("input[type=hidden]").val(res.result);
                }
            }).fail(function (jqXHR, textStatus) {
                hound.error('Request failed: ' + textStatus);
            });
        });
    }

    //页面操作配置
    var operates = {
        //编辑
        edit:function($this){
            var id = $this.closest("tr").attr("data-id");
            var nickName = $this.closest("tr").find("td").eq(1).find("a").text();
            var inviteCode = $this.closest("tr").find("td").eq(4).text();
            var alias = "";
            if($this.closest("tr").find("td").eq(1).find("div").length>0){
                alias = $this.closest("tr").find("td").eq(1).find("div").text();
            }else{
                alias = '';
            }
            var avatar = "";
            if($this.closest("tr").find("td").eq(2).find("a").length>0){
                avatar = $this.closest("tr").find("td").eq(2).find("a").attr("href");
            }else{
                avatar = "";
            }
            var getByIdData = {
                dataArr:{
                    id:id,
                    nickName:nickName,
                    alias:alias,
                    inviteCode:inviteCode,
                    avatar:avatar
                }
            };
            utils.renderModal('编辑会员', template('modalDiv', getByIdData), function(){
                if($("#visaPassportForm").valid()) {
                    utils.loading(true);
                    utils.ajaxSubmit(apis.user.updById, $("#visaPassportForm").serialize(), function (data) {
                        utils.loading(false);
                        hound.success("编辑成功", "", 1000);
                        utils.modal.modal('hide');
                        loadData();
                    })
                }
            }, 'md');
            uploadFile();
        },
        //查看
        look:function($this){
            var id = $this.closest("tr").attr("data-id");
            window.location.href = "@@HOSTview/account/userDetailsLook.html?id=" + id;
        },
        //允许登录
        setOperator:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认设为运营者吗?','',function(data){
                utils.ajaxSubmit(apis.user.setOperator, {id: id,operator:1}, function (data) {
                    hound.success("操作成功", "", 1000);
                    loadData();
                });
            })
        },
        //禁止登录
        cancelOperator:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认取消运营者吗?','',function(data){
                utils.ajaxSubmit(apis.user.setOperator, {id: id,operator:-1}, function (data) {
                    hound.success("操作成功", "", 1000);
                    loadData();
                });
            })
        }
    };

    var param = {
        p: 1,
        ps:20,
        operator:'',
        status:''
    };

    function loadData() {
        utils.ajaxSubmit(apis.user.index, param, function (data) {
            //根据状态值显示对应的状态文字 + 显示对应的 允许登录/禁止登录 按钮
            $.each(data.list,function(i,n){
                n.operatorText = consts.status.isNo[n.operator];
                n.statusText = consts.status.adminStatus[n.status];
                (n.operator=="1")? n.materialButtonGroup = cancelOperatorButton : n.materialButtonGroup = setOperatorButton ;
            });
            data.operatorText = listDropDown.operatorText;
            data.statusText = listDropDown.statusText;
            $sampleTable.html(template('visaListItem', data));
            utils.bindPagination($visaPagination, param, loadData);
            $visaPagination.html(utils.pagination(parseInt(data.count), param.p,20));
        });
    }
    // 页面首次加载列表数据
    loadData();
    utils.bindList($(document), operates);
    //列表筛选事件绑定
    var listDropDown = {
        operatorText:'是否运营者',
        statusText:'状态'
    };
    $sampleTable.on('click', '#dropStatusOptions a[data-id]', function () {
        param.status = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.statusText = "状态" : listDropDown.statusText = $(this).text();
        param.p = 1;
        loadData();
    }).on('click', '#dropOperatorOptions a[data-id]', function () {
        param.operator = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.operatorText = "是否运营者" : listDropDown.operatorText = $(this).text();
        param.p = 1;
        loadData();
    });
    $("#search").on("click",function(){
        param.p = 1;
        //判断是手机号搜索还是用户昵称搜索
        var selectsearchLabel = $("#selectsearchlabel").text();
        if(selectsearchLabel=="昵称"){
            param.nickName = $("#searchCont").val();
            param.memberOperationId = '';
            param.id = '';
            loadData();
        }else if(selectsearchLabel=="会员运营Id"){
            param.id = '';
            param.nickName = '';
            param.memberOperationId = $("#searchCont").val();
            loadData();
        }
    });
    $('#searchCont').on('keypress',function(event){
        if (event.keyCode == 13) {
            $('#search').click();
        }
    });
});