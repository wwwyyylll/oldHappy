require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var searchlabel = $(".searchlabel");
    var $addModal = $("#addModal");
    var $sampleTable = $('#sampleTable');
    var $visaPagination = $("#visaPagination");
    //按钮组集合
    var comButtons = '<button class="btn btn-info" type="button" data-operate="look">查看详情</button>',
        allowButton = '<button class="btn btn-primary" type="button" data-operate="allow">允许登录</button>',
        disableButton = '<button class="btn btn-danger" type="button" data-operate="notAllow">禁止登录</button>',
        addDistButton = '<button class="btn btn-primary" type="button" data-operate="addDist">设为分销商</button>',
        bindMemberIdButton = '<button class="btn btn-primary" type="button" data-operate="bindMemberId">绑定会员运营ID</button>',
        canRecommendButton = '<button class="btn btn-primary" type="button" data-operate="canRecommend">设为好物推荐官</button>',
        cancelRecommendButton = '<button class="btn btn-danger" type="button" data-operate="cancelRecommend">取消好物推荐官</button>',
        signUpButton = '<button class="btn btn-primary" type="button" data-operate="signUp">已签约</button>',
        cancelSignUpButton = '<button class="btn btn-danger" type="button" data-operate="cancelSignUp">取消签约</button>';

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
        })
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
        bindMemberId:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.reason('确认绑定会员运营ID吗?','请输入要绑定的会员运营ID',function(data){
                utils.ajaxSubmit(apis.user.bindMemberOperationId, {id: id,memberOperationId:data}, function (data) {
                    hound.success("操作成功", "", 1000);
                    loadData();
                });
            })
        },
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
        allow:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.reason('确认设为允许登录吗?','请输入允许登录原因',function(data){
                utils.ajaxSubmit(apis.user.allowLoginById, {id: id,reason:data}, function (data) {
                    hound.success("操作成功", "", 1000);
                    loadData();
                });
            })
        },
        //禁止登录
        notAllow:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.reason('确认设为禁止登录吗?','请输入禁止登录原因',function(data){
                utils.ajaxSubmit(apis.user.disableLoginById, {id: id,reason:data}, function (data) {
                    hound.success("操作成功", "", 1000);
                    loadData();
                });
            })
        },
        //设为好物推荐官
        canRecommend:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认设为好物推荐官吗?','',function(data){
                utils.ajaxSubmit(apis.user.canRecommendTaobaoItemById, {id: id}, function (data) {
                    hound.success("操作成功", "", 1000);
                    loadData();
                });
            })
        },
        //取消好物推荐官
        cancelRecommend:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认取消好物推荐官吗?','',function(data){
                utils.ajaxSubmit(apis.user.cancelRecommendTaobaoItemById, {id: id}, function (data) {
                    hound.success("操作成功", "", 1000);
                    loadData();
                });
            })
        },
        signUp:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认已签约吗?','',function(data){
                utils.ajaxSubmit(apis.user.signUpById, {id: id}, function (data) {
                    hound.success("操作成功", "", 1000);
                    loadData();
                });
            })
        },
        cancelSignUp:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认取消签约吗?','',function(data){
                utils.ajaxSubmit(apis.user.cancelSignUpById, {id: id}, function (data) {
                    hound.success("操作成功", "", 1000);
                    loadData();
                });
            })
        },
        addDist:function($this){
            var userId = $this.closest("tr").attr("data-id");
            var tr = $this.closest("tr");
            var nickName = tr.find("td").eq(1).find("a").text();

            var initialData = {
                dataArr:{
                    userId:userId,
                    nickName:nickName,
                    name:'',
                    adZoneId:'',
                    content:''
                }
            };
            utils.renderModal('设为分销商', template('addDistDiv',initialData), function(){
                if($("#addDistForm").valid()){
                    utils.loading(true);
                    utils.ajaxSubmit(apis.distributors.create,$("#addDistForm").serialize(),function(data){
                        utils.loading(false);
                        hound.success("设置成功","",1000);
                        utils.modal.modal('hide');
                        loadData();
                    })
                }
            }, 'md');
        }
    };

    // 页面首次加载列表数据
    //打开的对应的页面nav + active属性
    var loc = location.href;
    var n1 = loc.length;//地址的总长度
    var n2 = loc.indexOf("=");//取得=号的位置
    var id = decodeURI(loc.substr(n2+1,n1-n2));//从=号后面的内容
    var urlParam = id.split("=");
    var warnValue = '';
    if(urlParam[0]==1){
        warnValue = urlParam[0];
    }else{
        warnValue = '';
    }

    var param = {
        pageNo: 1,
        pageSize:10,
        status:'',
        isSignUp:'',
        nickName:'',
        memberOperationId:'',
        id:'',
        canRecommendTaobaoItem:'',
        orderByTaobaoCommissionRate:'',
        warn:warnValue
    };

    function loadData() {
        utils.ajaxSubmit(apis.user.getLists, param, function (data) {
            //根据状态值显示对应的状态文字 + 显示对应的 允许登录/禁止登录 按钮
            $.each(data.dataArr,function(i,n){
                n.statusText = consts.status.user[n.status];
                n.isSignUpText = consts.status.isBind[n.isSignUp];
                n.isDistributorsText = consts.status.isBind[n.isDistributors];
                n.canRecommendTaobaoItemText = consts.status.isBind[n.canRecommendTaobaoItem];
                n.sourceText = consts.status.userSource[n.source];
                (n.status=="1")? n.materialButtonGroup = disableButton : n.materialButtonGroup = allowButton  ;
                (n.isDistributors=='1')? n.materialButtonGroup = n.materialButtonGroup : n.materialButtonGroup = n.materialButtonGroup + addDistButton ;
                if(n.memberOperationId=='' || n.memberOperationId==null){
                    n.materialButtonGroup = n.materialButtonGroup + bindMemberIdButton ;
                }else{
                    n.materialButtonGroup = n.materialButtonGroup ;
                }
                if(n.canRecommendTaobaoItem == 1){
                    n.materialButtonGroup = n.materialButtonGroup + cancelRecommendButton ;
                }else if(n.canRecommendTaobaoItem == 2){
                    n.materialButtonGroup = n.materialButtonGroup + canRecommendButton ;
                }
                if(n.isSignUp == 2){
                    n.materialButtonGroup = n.materialButtonGroup + signUpButton ;
                }else{
                    n.materialButtonGroup = n.materialButtonGroup + cancelSignUpButton ;
                }
            });
            data.statusText = listDropDown.statusText;
            data.sourceText = listDropDown.sourceText;
            data.signUpText = listDropDown.signUpText;
            data.canRecommendText = listDropDown.canRecommendText;
            data.taobaoCommissionRateText = listDropDown.taobaoCommissionRateText;
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
        sourceText:'来源',
        signUpText:'已签约',
        canRecommendText:'好物推荐官',
        taobaoCommissionRateText:'佣金率'
    };
    $sampleTable.on('click', '#dropStatusOptions a[data-id]', function () {
        param.status = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.statusText = "状态" : listDropDown.statusText = $(this).text();
        param.pageNo = 1;
        loadData();
    }).on('click', '#dropTopOptions a[data-id]', function () {
        param.source = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.sourceText = "来源" : listDropDown.sourceText = $(this).text();
        param.pageNo = 1;
        loadData();
    }).on('click', '#dropSignUpOptions a[data-id]', function () {
        param.isSignUp = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.signUpText = "已签约" : listDropDown.signUpText = $(this).text();
        param.pageNo = 1;
        loadData();
    }).on('click', '#dropCanRecommendOptions a[data-id]', function () {
        param.canRecommendTaobaoItem = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.canRecommendText = "好物推荐官" : listDropDown.canRecommendText = $(this).text();
        param.pageNo = 1;
        loadData();
    }).on('click', '#dropTaobaoCommissionRateOptions a[data-id]', function () {
        param.orderByTaobaoCommissionRate = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.taobaoCommissionRateText = "佣金率" : listDropDown.taobaoCommissionRateText = $(this).text();
        param.pageNo = 1;
        loadData();
    });
    $("#search").on("click",function(){
        param.pageNo = 1;
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
        }else if(selectsearchLabel=="会员ID"){
            param.nickName = '';
            param.memberOperationId = '';
            param.id = $("#searchCont").val();
            loadData();
        }
    });
    $('#searchCont').on('keypress',function(event){
        if (event.keyCode == 13) {
            $('#search').click();
        }
    });
});