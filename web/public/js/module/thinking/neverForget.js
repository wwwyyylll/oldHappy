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

    function blobToDataURL(blob,cb) {
        var reader = new FileReader();
        reader.onload = function (evt) {
            var base64 = evt.target.result
            cb(base64)
        };
        reader.readAsDataURL(blob);
    }

    var originPicFile = "";
    var answerPicFile = "";
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
                    originPicFile = base64Url;
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
                    content:originPicFile
                },
                dataType: 'json',
                success: function (res) {
                    $(".imgUrl").html("");
                    $(".imgUrl").html("<a target='_blank' href='"+ res.result +"'>原图预览</a>");
                    $("input[name=originPic]").val(res.result);
                }
            }).fail(function (jqXHR, textStatus) {
                hound.error('Request failed: ' + textStatus);
            });
        });
    }
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
                    answerPicFile = base64Url;
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
                    content:answerPicFile
                },
                dataType: 'json',
                success: function (res) {
                    $(".imgUrl1").html("");
                    $(".imgUrl1").html("<a target='_blank' href='"+ res.result +"'>答案图预览</a>");
                    $("input[name=answerPic]").val(res.result);
                }
            }).fail(function (jqXHR, textStatus) {
                hound.error('Request failed: ' + textStatus);
            });
        });
    }
    //新增
    $addModal.on("click",function(){
        var initialData = {
            itemArr:[{},{},{}],
            dataArr:{}
        };
        utils.renderModal('新增', template('modalDiv',initialData), function(){
            utils.reInputName($(".singItem"));
            var itemId = $("input[name=itemId]:checked").val();
            if(itemId!=undefined){
                if($("#visaPassportForm").valid()){
                    utils.ajaxSubmit(apis.goodMemory.create,$("#visaPassportForm").serialize(),function(data){
                        hound.success("添加成功","",1000);
                        utils.modal.modal('hide');
                        param.pageNo = 1;
                        loadData();
                    })
                }
            }else{
                hound.error("请设置答案","","");
            }
        }, 'lg');
        uploadFile();
        uploadFile1();
    })

    //页面操作配置
    var operates = {
        //新增选项
        addSelect:function($this){
            if($("#itemSelectDiv").find(".singItem").length>=3){
                $this.closest(".form-row").find("h5").text("提示:最多可添加3个答案");
            }else{
                $("#itemSelectDiv").append(template('singItemDiv', ''));
            }
            //给input和label重新拍id
            var singItemArr = $("#itemSelectDiv").find(".singItem");
            for(var i=0;i<singItemArr.length;i++){
                singItemArr.eq(i).find("input").eq(0).attr("id","order_" + i);
                singItemArr.eq(i).find("label").attr("for","order_" + i);
            }
        },
        //删除选项
        delSelect:function($this){
            if($("#itemSelectDiv").find(".singItem").length<=2){
                $(".mark").closest(".form-row").find("h5").text("提示:最少要添加2个答案");
            }else{
                var row = $this.closest(".form-row");
                //编辑页面要统计已有ID的选项 delItemArr[0][id]
                var delId = row.find("input").eq(1).val();
                if(delId!=""){
                    var delItemArr = $("#delItemArr");
                    delItemArr.append('<div class="delItemSingle"><input type="hidden" name="delItemArr[][id]" value="'+ delId +'" class="form-control"></div');
                }
                row.remove();
            }
        },
        //设置答案
        setAnswer:function($this){
            var row = $this.closest(".form-row");
            var content = row.find("input").eq(2).val();
            if(content!=''){
                row.find("input").eq(3).val("1");
                for(var i=0;i<row.siblings(".form-row").length;i++){
                    row.siblings(".form-row").eq(i).find("input").eq(3).val("2");
                }
            }else{
                row.find("input").eq(3).val("1");
                for(var i=0;i<row.siblings(".form-row").length;i++){
                    row.siblings(".form-row").eq(i).find("input").eq(3).val("2");
                }
                hound.error("请先填写选项内容","","");
            }
        },
        //编辑
        edit:function($this){
            var id = $this.closest("tr").attr("data-id");
            utils.ajaxSubmit(apis.goodMemory.getById, {id: id}, function (data) {
                var data = {
                    itemArr:(data.itemArr.length!=0)? data.itemArr : [{},{}],
                    dataArr:data.dataArr
                };
                utils.renderModal('编辑——'+ data.dataArr.title, template('modalDiv', data), function(){
                    utils.reInputName($(".singItem"));
                    utils.reInputName($(".delItemSingle"));
                    if($("#visaPassportForm").valid()) {
                        utils.ajaxSubmit(apis.goodMemory.updateById, $("#visaPassportForm").serialize(), function (data) {
                            hound.success("编辑成功", "", 1000);
                            utils.modal.modal('hide');
                            loadData();
                        })
                    }
                }, 'lg');
                uploadFile();
                uploadFile1();
            });
        },
        //查看
        look:function($this){
            var id = $this.closest("tr").attr("data-id");
            utils.ajaxSubmit(apis.goodMemory.getById, {id: id}, function (data) {
                var data = {
                    itemArr:(data.itemArr.length!=0)? data.itemArr : [{},{}],
                    dataArr:data.dataArr
                };
                utils.renderModal('查看——'+ data.dataArr.title, template('modalDiv', data),'', 'lg');
                $("#visaPassportForm").append($("fieldset").prop('disabled', true));
            });
        },
        //结算
        settlement:function($this){
            var id = $this.closest("tr").attr("data-id");
            utils.ajaxSubmit(apis.goodMemory.getById, {id: id}, function (data) {
                var data = {
                    itemArr:(data.itemArr.length!=0)? data.itemArr : [{}],
                    dataArr:data.dataArr
                };
                utils.renderModal('结算', template('settlementDiv', data),function(){
                    utils.ajaxSubmit(apis.goodMemory.settlementById,$("#settlementForm").serialize(),function(data){
                        hound.success("结算成功","",1000);
                        utils.modal.modal('hide');
                        loadData();
                    })
                }, 'md');
            });
        },
        //无效
        setOff:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认无效吗?', '', function () {
                utils.ajaxSubmit(apis.goodMemory.setOff, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        //有效
        setOn:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认有效吗?', '', function () {
                utils.ajaxSubmit(apis.goodMemory.setOn, {id: id}, function (data) {
                    loadData();
                });
            });
        },
    }

    var param = {
        pageNo: 1,
        pageSize:10,
        status:'',
        id:''
    };

    function loadData() {
        utils.ajaxSubmit(apis.goodMemory.getLists, param, function (data) {
            //根据状态值显示对应的状态文字
            $.each(data.dataArr,function(i,n){
                n.statusText = consts.status.predict[n.status];
                $.each(n.itemArr,function(j,m){
                    (m.isAnswer=="1")? m.isAnswerText = '<i style="color: green;margin-left: 5px" class="icon fa fa-check"></i>' : m.isAnswerText = '';
                })
            })
            //操作按钮 编辑 + 查看 + 有效/无效
            $.each(data.dataArr,function(i,n){
                (n.status=="1")? n.materialButtonGroup = comButtons + stopButton : n.materialButtonGroup = comButtons + startBouutn;
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
    var listDropDown = {
        statusText:'状态'
    };
    $sampleTable.on('click', '#dropStatusOptions a[data-id]', function () {
        param.status = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.statusText = "状态" : listDropDown.statusText = $(this).text();
        loadData();
    });
    $("#search").on("click",function(){
        param.pageNo = 1;
        //判断是什么条件搜索
        var selectSearchLabel = $("#selectsearchlabel").text();
        if(selectSearchLabel=="ID"){
            param.id = $("#searchCont").val();
            param.title = '';
            loadData();
        }else if(selectSearchLabel=="标题"){
            param.id = '';
            param.title = $("#searchCont").val();
            loadData();
        }
    });
    $('#searchCont').on('keypress',function(event){
        if (event.keyCode == 13) {
            $('#search').click();
        }
    });
});