require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var searchlabel = $(".searchlabel");
    var $addModal = $("#addModal");
    var $sampleTable = $('#sampleTable');
    var $visaPagination = $("#visaPagination");
    //按钮组集合
    var comButtons =
            '<button class="btn btn-primary" type="button" data-operate="edit">编辑</button>'+
            '<button class="btn btn-info" type="button" data-operate="look">查看</button>',
        startBouutn =  '<button class="btn btn-primary" type="button" data-operate="setOn">有效</button>',
        stopButton = '<button class="btn btn-danger" type="button" data-operate="setOff">无效</button>',
        upMaxDateButton = '<button class="btn btn-success" type="button" data-operate="upMaxDate">纠正日期</button>';

    searchlabel.on("click",function(){
        $("#selectsearchlabel").text($(this).text());
        $("#searchCont").val("");
        $("#searchCont").attr("data-id",'');
    })

    function blobToDataURL(blob,cb) {
        var reader = new FileReader();
        reader.onload = function (evt) {
            var base64 = evt.target.result
            cb(base64)
        };
        reader.readAsDataURL(blob);
    }

    var picFile = "";
    function uploadFile(){
        //选择图片文件
        $(".uploadImg").change(function(){
            //判断是否支持FileReader
            if (window.FileReader) {
                var reader = new FileReader();
            } else {
                hound.alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
            }
            var file = this.files[0];
            reader.onload = function(e) {
                //获取图片dom
                $(".imgUrl").html('<i class="fa fa-image mr-2"></i>' + file.name)
                if(file.name!=""){
                    $(".avatarUpload").removeAttr("disabled");
                    $(".avatarUpload").removeClass("btn-default");
                    $(".avatarUpload").addClass("btn-primary");
                }
            };
            reader.readAsDataURL(file);

            if(file){
                var url = URL.createObjectURL(file);
                var base64 = blobToDataURL(file,function(base64Url) {
                    picFile = base64Url;
                })
            }
        })
        // 上传图片文件
        $(".uploadFile").find('.avatarUpload').click(function () {
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
                    content:picFile
                },
                dataType: 'json',
                success: function (res) {
                    $(".imgUrl").html("");
                    $(".imgUrl").html("<a target='_blank' href='"+ res.result +"'><img style='display: inline-block;width: 45px;height: 20px' src='"+ res.result +"'></a>");
                    $("input[name=pic]").val(res.result);
                }
            }).fail(function (jqXHR, textStatus) {
                hound.error('Request failed: ' + textStatus);
            });
        });
    }

    var picFile1 = "";
    function uploadFile1(){
        //选择图片文件
        $(".uploadImg1").change(function(){
            //判断是否支持FileReader
            if (window.FileReader) {
                var reader = new FileReader();
            } else {
                hound.alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
            }
            var file = this.files[0];
            reader.onload = function(e) {
                //获取图片dom
                $(".imgUrl1").html('<i class="fa fa-image mr-2"></i>' + file.name)
                if(file.name!=""){
                    $(".avatarUpload1").removeAttr("disabled");
                    $(".avatarUpload1").removeClass("btn-default");
                    $(".avatarUpload1").addClass("btn-primary");
                }
            };
            reader.readAsDataURL(file);

            if(file){
                var url = URL.createObjectURL(file);
                var base64 = blobToDataURL(file,function(base64Url) {
                    picFile1 = base64Url;
                })
            }
        })
        // 上传图片文件
        $(".uploadFile1").find('.avatarUpload1').click(function () {
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
                    content:picFile1
                },
                dataType: 'json',
                success: function (res) {
                    $(".imgUrl1").html("");
                    $(".imgUrl1").html("<a target='_blank' href='"+ res.result +"'><img style='display: inline-block;width: 45px;height: 20px' src='"+ res.result +"'></a>");
                    $("input[name=avatar]").val(res.result);
                }
            }).fail(function (jqXHR, textStatus) {
                hound.error('Request failed: ' + textStatus);
            });
        });
    }
    var picFile2 = "";
    function uploadFile2(){
        //选择图片文件
        $(".uploadImg2").change(function(){
            //判断是否支持FileReader
            if (window.FileReader) {
                var reader = new FileReader();
            } else {
                hound.alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
            }
            var file = this.files[0];
            reader.onload = function(e) {
                //获取图片dom
                $(".imgUrl2").html('<i class="fa fa-image mr-2"></i>' + file.name)
                if(file.name!=""){
                    $(".avatarUpload2").removeAttr("disabled");
                    $(".avatarUpload2").removeClass("btn-default");
                    $(".avatarUpload2").addClass("btn-primary");
                }
            };
            reader.readAsDataURL(file);

            if(file){
                var url = URL.createObjectURL(file);
                var base64 = blobToDataURL(file,function(base64Url) {
                    picFile2 = base64Url;
                })
            }
        })
        // 上传图片文件
        $(".uploadFile2").find('.avatarUpload2').click(function () {
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
                    content:picFile2
                },
                dataType: 'json',
                success: function (res) {
                    $(".imgUrl2").html("");
                    $(".imgUrl2").html("<a target='_blank' href='"+ res.result +"'><img style='display: inline-block;width: 45px;height: 20px' src='"+ res.result +"'></a>");
                    $("input[name=recommendImg]").val(res.result);
                }
            }).fail(function (jqXHR, textStatus) {
                hound.error('Request failed: ' + textStatus);
            });
        });
    }
    var picFile3 = "";
    function uploadFile3(){
        //选择图片文件
        $(".uploadImg3").change(function(){
            //判断是否支持FileReader
            if (window.FileReader) {
                var reader = new FileReader();
            } else {
                hound.alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
            }
            var file = this.files[0];
            reader.onload = function(e) {
                //获取图片dom
                $(".imgUrl3").html('<i class="fa fa-image mr-2"></i>' + file.name)
                if(file.name!=""){
                    $(".avatarUpload3").removeAttr("disabled");
                    $(".avatarUpload3").removeClass("btn-default");
                    $(".avatarUpload3").addClass("btn-primary");
                }
            };
            reader.readAsDataURL(file);

            if(file){
                var url = URL.createObjectURL(file);
                var base64 = blobToDataURL(file,function(base64Url) {
                    picFile3 = base64Url;
                })
            }
        })
        // 上传图片文件
        $(".uploadFile3").find('.avatarUpload3').click(function () {
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
                    content:picFile3
                },
                dataType: 'json',
                success: function (res) {
                    $(".imgUrl3").html("");
                    $(".imgUrl3").html("<a target='_blank' href='"+ res.result +"'><img style='display: inline-block;width: 25px;height: 20px' src='"+ res.result +"'></a>");
                    $("input[name=shareImg]").val(res.result);
                }
            }).fail(function (jqXHR, textStatus) {
                hound.error('Request failed: ' + textStatus);
            });
        });
    }

    //新增
    $addModal.on("click",function(){
        var initialData = {
            dataArr:{
                tagArr:[{},{},{}]
            },
            tagArr1:tagArr1,
            tagArr2:tagArr2
        };
        utils.renderModal('新增主播', template('modalDiv',initialData), function(){
            utils.reInputName($(".singItem"));
            if($("#visaPassportForm").valid()){
                utils.loading(true);
                utils.ajaxSubmit(apis.anchor.create,$("#visaPassportForm").serialize(),function(data){
                    utils.loading(false);
                    hound.success("添加成功","",1000);
                    utils.modal.modal('hide');
                    param.pageNo = 1;
                    loadData();
                })
            }
        }, 'lg');
        uploadFile();
        uploadFile1();
        uploadFile2();
        uploadFile3();
    });

    //页面操作配置
    var operates = {
        //批量纠正日期
        batchUpd:function(){
            hound.confirm('确认批量纠正日期吗?', '', function () {
                utils.ajaxSubmit(apis.anchor.batchUpdMaxGoodsDate, '', function (data) {
                    hound.success("操作成功", "", 1000);
                    loadData();
                });
            });
        },
        //编辑
        edit:function($this){
            var id = $this.closest("tr").attr("data-id");
            utils.ajaxSubmit(apis.anchor.getById, {id: id}, function (data) {
                var getByIdData = {
                    dataArr:data,
                    tagArr1:tagArr1,
                    tagArr2:tagArr2
                };
                utils.renderModal('编辑主播', template('modalDiv', getByIdData), function(){
                    utils.reInputName($(".singItem"));
                    utils.reInputName($(".delItemSingle"));
                    if($("#visaPassportForm").valid()) {
                        utils.loading(true);
                        utils.ajaxSubmit(apis.anchor.updateById, $("#visaPassportForm").serialize(), function (data) {
                            utils.loading(false);
                            hound.success("编辑成功", "", 1000);
                            utils.modal.modal('hide');
                            loadData();
                        })
                    }
                }, 'lg');
                uploadFile();
                uploadFile1();
                uploadFile2();
                uploadFile3();
            });
        },
        addTag:function($this){
            var customTagDiv = $(".customTagDiv");
            customTagDiv.append(template('customTagItem', ''));
            var rowAll = customTagDiv.find(".form-row");
            for(var i=0;i<rowAll.length;i++){
                rowAll.eq(i).find(".tagNumber").text(i+1);
            }
        },
        delTag:function($this){
            var row = $this.closest(".form-row");
            //编辑页面要统计已有ID的预见选项 delItemArr[0][id]
            var delId = row.find("input").eq(0).val();
            if(delId!="0"){
                var delItemArr = $(".delItemArr");
                delItemArr.append('<div class="delItemSingle"><input type="hidden" name="delTag[][id]" value="'+ delId +'" class="form-control"></div');
            }
            row.remove();
            var customTagDiv = $(".customTagDiv");
            var rowAll = customTagDiv.find(".form-row");
            for(var i=0;i<rowAll.length;i++){
                rowAll.eq(i).find(".tagNumber").text(i+1);
            }
        },
        //查看
        look:function($this){
            var id = $this.closest("tr").attr("data-id");
            utils.ajaxSubmit(apis.anchor.getById, {id: id}, function (data) {
                var getByIdData = {
                    dataArr:data,
                    tagArr1:tagArr1,
                    tagArr2:tagArr2
                };
                utils.renderModal('查看主播', template('modalDiv', getByIdData),'', 'lg');
                $("#visaPassportForm").append($("fieldset").prop('disabled', true));
            });
        },
        //无效
        setOff:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认无效吗?', '', function () {
                utils.ajaxSubmit(apis.anchor.offById, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        //有效
        setOn:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认有效吗?', '', function () {
                utils.ajaxSubmit(apis.anchor.onById, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        upMaxDate:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认纠正日期吗?', '', function () {
                utils.ajaxSubmit(apis.anchor.updMaxGoodsDateById, {id: id}, function (data) {
                    loadData();
                });
            });
        }
    };

    var param = {
        pageNo: 1,
        pageSize:10,
        name:'',
        status:'',
        tagId:'',
        orderByDateCnt:'',
        orderByGoodsCnt:'',
        orderByClickCnt:'',
        orderByMaxGoodsDate:''
    };

    var tagArr;
    var tagArr1;
    var tagArr2;
    function getTagArr(){
        var tagParam = {
            pageNo: 1,
            pageSize:50000,
            name:'',
            status:'',
            type:''
        };
        var tagParam1 = {
            pageNo: 1,
            pageSize:50000,
            name:'',
            status:'',
            type:1
        };
        var tagParam2 = {
            pageNo: 1,
            pageSize:50000,
            name:'',
            status:'',
            type:2
        };
        utils.ajaxSubmit(apis.tag.getLists, tagParam, function (data) {
            tagArr = data.dataArr;
        });
        utils.ajaxSubmit(apis.tag.getLists, tagParam1, function (data) {
            tagArr1 = data.dataArr;
        });
        utils.ajaxSubmit(apis.tag.getLists, tagParam2, function (data) {
            tagArr2 = data.dataArr;
        });
    }
    getTagArr();
    function loadData() {
        utils.ajaxSubmit(apis.anchor.getLists, param, function (data) {
            //根据状态值显示对应的状态文字 + 显示对应的 允许登录/禁止登录 按钮
            $.each(data.dataArr,function(i,n){
                n.statusText = consts.status.ordinary[n.status];
                (n.status=="1")? n.materialButtonGroup = comButtons + stopButton + upMaxDateButton : n.materialButtonGroup = comButtons + startBouutn + upMaxDateButton;
            });
            data.tagArr = tagArr;
            data.statusText = listDropDown.statusText;
            data.anchorTagText = listDropDown.anchorTagText;
            data.dateCntText = listDropDown.dateCntText;
            data.goodsCntText = listDropDown.goodsCntText;
            data.clickCntText = listDropDown.clickCntText;
            data.maxGoodsDateText = listDropDown.maxGoodsDateText;
            $sampleTable.html(template('visaListItem', data));
            utils.bindPagination($visaPagination, param, loadData);
            $visaPagination.html(utils.pagination(parseInt(data.cnt), param.pageNo));
        });
    }
    // 页面首次加载列表数据
    setTimeout(function(){
        loadData();
    },100);
    utils.bindList($(document), operates);
    //列表筛选事件绑定
    var listDropDown = {
        statusText:'状态',
        anchorTagText:'主播标签',
        dateCntText:'收录总期数',
        goodsCntText:'带货商品总数',
        clickCntText:'点击数',
        maxGoodsDateText:'最新收录'
    };
    $sampleTable.on('click', '#dropStatusOptions a[data-id]', function () {
        param.status = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.statusText = "状态" : listDropDown.statusText = $(this).text();
        param.pageNo = 1;
        loadData();
    }).on('click', '#dropAnchorTagOptions a[data-id]', function () {
        param.tagId = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.anchorTagText = "主播标签" : listDropDown.anchorTagText = $(this).text();
        param.pageNo = 1;
        loadData();
    }).on('click', '#dropDateOptions a[data-id]', function () {
        param.orderByDateCnt = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.dateCntText = "收录总期数" : listDropDown.dateCntText = $(this).text();
        param.pageNo = 1;
        param.orderByGoodsCnt = '';
        param.orderByClickCnt = '';
        param.orderByMaxGoodsDate = '';
        listDropDown.goodsCntText = "带货商品总数";
        listDropDown.clickCntText = "点击数";
        listDropDown.maxGoodsDateText = "最新收录"
        loadData();
    }).on('click', '#dropGoodsOptions a[data-id]', function () {
        param.orderByGoodsCnt = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.goodsCntText = "带货商品总数" : listDropDown.goodsCntText = $(this).text();
        param.pageNo = 1;
        param.orderByDateCnt = '';
        param.orderByClickCnt = '';
        param.orderByMaxGoodsDate = '';
        listDropDown.dateCntText = "收录总期数";
        listDropDown.clickCntText = "点击数";
        listDropDown.maxGoodsDateText = "最新收录"
        loadData();
    }).on('click', '#dropClickOptions a[data-id]', function () {
        param.orderByClickCnt = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.clickCntText = "点击数" : listDropDown.clickCntText = $(this).text();
        param.pageNo = 1;
        param.orderByDateCnt = '';
        param.orderByGoodsCnt = '';
        param.orderByMaxGoodsDate = '';
        listDropDown.dateCntText = "收录总期数";
        listDropDown.goodsCntText = "带货商品总数";
        listDropDown.maxGoodsDateText = "最新收录"
        loadData();
    }).on('click', '#dropMaxGoodsDateOptions a[data-id]', function () {
        param.orderByMaxGoodsDate = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.maxGoodsDateText = "最新收录" : listDropDown.maxGoodsDateText = $(this).text();
        param.pageNo = 1;
        param.orderByDateCnt = '';
        param.orderByGoodsCnt = '';
        param.orderByClickCnt = '';
        listDropDown.dateCntText = "收录总期数";
        listDropDown.goodsCntText = "带货商品总数";
        listDropDown.clickCntText = "点击数";
        loadData();
    });
    $("#search").on("click",function(){
        param.pageNo = 1;
        param.name = $("#searchCont").val();
        loadData();
    });
    $('#searchCont').on('keypress',function(event){
        if (event.keyCode == 13) {
            $('#search').click();
        }
    });
});