require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var initialData = {
        dataArr:{}
    };
    //上传图片文件
    function blobToDataURL(blob,cb) {
        var reader = new FileReader();
        reader.onload = function (evt) {
            var base64 = evt.target.result
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
                    uploadFile.find(".imgUrl").html("<a target='_blank' href='"+ res.result +"'><img style='display: inline-block;width: 45px;height: 20px' src='"+ res.result +"'></a>");
                    uploadFile.find("input[type=hidden]").val(res.result);
                    //http://lnhs.go-trip.com.cn/file/images/20200616/226b4d02a0c25d56fdf0cd83363eb9e5.jpeg
                    //http://lnhs.go-trip.com.cn/file/images/20200616/3cb2cefcee8b76143d022e3135beee77.jpeg
                }
            }).fail(function (jqXHR, textStatus) {
                hound.error('Request failed: ' + textStatus);
            });
        });
    }
    //页面操作配置
    var operates = {
        addSpec:function(){
            var data = {
                dataArr:{},
                specsArr:{}
            };
            $(".specDiv").append(template('specItem', data));
            var specNumber = $(".specNumber");
            for(var i=0;i<specNumber.length;i++){
                specNumber.eq(i).text(i+1);
            }
            uploadFile();
            var idNumberArr = $(".editorDiv").eq(specNumber.length-2).attr("id").split("_");
            var idNumber = parseInt(idNumberArr[1]) + 1;
            $(".editorDiv").eq(specNumber.length-1).attr("id","editor_" + idNumber);
            var E = window.wangEditor;
            var editor = new E('#editor_'+ idNumber);
            editor.customConfig.showLinkImg = false;         // 隐藏“网络图片”tab
            editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
            editor.create();
            $(".w-e-text-container").css({"height":"200px"});
            $(".w-e-text-container").css({"z-index":"100"});
            $('#editor_'+ idNumber).find(".w-e-menu").css({"z-index":"101"});
        },
        delSpec:function($this){
            hound.confirm('确认删除吗?', '', function () {
                var specItem = $this.closest(".specItem");
                //编辑页面要统计已有ID的选项 delItemArr[0][id]
                var delId = specItem.find(".specItemId").val();
                if(delId!=""){
                    var delSpecArr = $("#delSpecArr");
                    delSpecArr.append('<div class="delSpecSingle"><input type="hidden" name="delDetail[][id]" value="'+ delId +'" class="form-control"></div');
                }
                specItem.remove();
                var specNumber = $(".specNumber");
                for(var i=0;i<specNumber.length;i++){
                    specNumber.eq(i).text(i+1);
                }
            });
        },
        recoverSpec:function($this){
            var id = $this.closest(".form-row").next("input").val();
            hound.confirm('确认恢复吗?', '', function () {
                utils.ajaxSubmit(apis.subject.recoveryDetailByDetailId, {id: id}, function (data) {
                    $this.closest(".specItem").find("input").attr("disabled",false);
                    //富文本编辑器可编辑使用
                    $this.closest(".specItem").find(".w-e-text").attr("contenteditable",true);
                    $this.closest(".specItem").find(".w-e-text").css({background:"#ffffff"});
                    $this.closest(".specItem").css({background:"#ffffff"});
                    $this.closest(".specItem").find(".delStatus").text("");
                    $this.closest(".specItem").find(".iconDiv").html('<span data-operate="delSpec" style="float: right;cursor: pointer" ><i class="icon fa fa-close"></i></span>');

                });
            });
        },
        addGoods:function(){
            utils.loading(true);
            var editerContent = $(".w-e-text");
            var editerImg = editerContent.find("img");
            //统计富文本编辑器中图片的数量
            if(editerImg.length>0){
                //图片src的长度大于500的需要上传，小于500的直接提交
                var submitImgArr = [];
                for(var i=0;i<editerImg.length;i++){
                    if(editerImg.eq(i).attr("src").length>500){
                        submitImgArr.push(editerImg.eq(i));
                    }
                }

                function func_digui(arry,len){
                    var temp;
                    for(i=0;i<len;i++){
                        if(i==0){
                            temp =arry[0];
                            arry.splice(i,1);
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
                                    content:temp.attr("src")
                                },
                                dataType: 'json',
                                success:function(data){
                                    temp.attr("src",data.result);
                                    len = arry.length;
                                    if(len ==0){
                                        //调保存的接口
                                        //if($("#goodsForm").valid()){
                                            for(var j=0;j<$(".w-e-text").length;j++){
                                                $("input[name='detail[][content]']").eq(j).val($(".w-e-text").eq(j).html());
                                            }
                                            utils.reInputName($(".specItem"));
                                            utils.reInputName($(".imgItem"));
                                            utils.reInputName($(".delSpecSingle"));
                                            utils.reInputName($(".delImgSingle"));
                                            utils.ajaxSubmit(apis.subject.updateById,$("#goodsForm").serialize(),function(data){
                                                utils.loading(false);
                                                hound.success("编辑成功","",'').then(function(){
                                                    getGoodsData();
                                                });
                                            });
                                        //}
                                        //测试结束位置
                                        return;
                                    }
                                    func_digui(arry,len);
                                }
                            });
                        }
                    }
                }
                if(submitImgArr.length!=0){
                    if($("#goodsForm").valid()){
                        func_digui(submitImgArr,submitImgArr.length);
                    }else{
                        utils.loading(false);
                    }
                    //setTimeout(function(){
                    //    var canPost = true;
                    //    for(var i=0;i<editerImg.length;i++){
                    //        if(editerImg.eq(i).attr("src").length>500){
                    //            canPost = false;
                    //            break;
                    //        }
                    //    }
                    //    if(canPost){
                    //        if($("#goodsForm").valid()){
                    //            for(var i=0;i<$(".w-e-text").length;i++){
                    //                $("input[name='detail[][content]']").eq(i).val($(".w-e-text").eq(i).html());
                    //            }
                    //            utils.reInputName($(".specItem"));
                    //            utils.reInputName($(".imgItem"));
                    //            utils.reInputName($(".delSpecSingle"));
                    //            utils.reInputName($(".delImgSingle"));
                    //            utils.ajaxSubmit(apis.subject.updateById,$("#goodsForm").serialize(),function(data){
                    //                utils.loading(false);
                    //                hound.success("编辑成功","",'').then(function(){
                    //                    getGoodsData();
                    //                });
                    //            })
                    //        }
                    //    }
                    //},1500);
                }else{
                    if($("#goodsForm").valid()){
                        for(var i=0;i<$(".w-e-text").length;i++){
                            $("input[name='detail[][content]']").eq(i).val($(".w-e-text").eq(i).html());
                        }
                        utils.reInputName($(".specItem"));
                        utils.reInputName($(".imgItem"));
                        utils.reInputName($(".delSpecSingle"));
                        utils.reInputName($(".delImgSingle"));
                        utils.ajaxSubmit(apis.subject.updateById,$("#goodsForm").serialize(),function(data){
                            utils.loading(false);
                            hound.success("编辑成功","",'').then(function(){
                                getGoodsData();
                            });
                        })
                    }else{
                        utils.loading(false);
                    }
                }
            }else{
                if($("#goodsForm").valid()){
                    for(var i=0;i<$(".w-e-text").length;i++){
                        $("input[name='detail[][content]']").eq(i).val($(".w-e-text").eq(i).html());
                    }
                    utils.reInputName($(".specItem"));
                    utils.reInputName($(".imgItem"));
                    utils.reInputName($(".delSpecSingle"));
                    utils.reInputName($(".delImgSingle"));
                    utils.ajaxSubmit(apis.subject.updateById,$("#goodsForm").serialize(),function(data){
                        utils.loading(false);
                        hound.success("编辑成功","",'').then(function(){
                            getGoodsData();
                        });
                    })
                }else{
                    utils.loading(false);
                }
            }
        }
    };

    utils.bindList($(document), operates);

    $(document).on("click",function(){
        $('.ability-list').remove();
    });
    // 页面首次加载列表数据
    function getGoodsData(){
        //getById获取数据
        var loc = location.href;
        var n1 = loc.length;//地址的总长度
        var n2 = loc.indexOf("=");//取得=号的位置
        var id = decodeURI(loc.substr(n2+1,n1-n2));//从=号后面的内容
        var urlParam = id.split("=");
        utils.ajaxSubmit(apis.subject.getById, {id:urlParam[0]}, function (data) {
            var getByIdData = {
                dataArr:data.dataArr,
                specsArr:data.detailArr
            };
            getByIdData.dataArr.statusText = consts.status.ordinary[getByIdData.dataArr.status];
            $("#goodsForm").html(template('goodsFormContent', getByIdData));
            $("#tabContent1").html(template('specList', getByIdData));

            $(document).ready(function () {
                $(".sortable-list").sortable({
                    connectWith: ".connectList"
                }).disableSelection();
            });
            uploadFile();
            //所有的富文本编辑器循环加id + 显示
            var editorDiv = $(".editorDiv");
            for(var i=0;i<editorDiv.length;i++){
                var idNumber = editorDiv.eq(i).attr("id");
                var E = window.wangEditor;
                var editor = new E('#'+idNumber);
                editor.customConfig.showLinkImg = false;         // 隐藏“网络图片”tab
                editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
                editor.create();
                $(".w-e-text-container").css({"height":"200px"});
                $(".w-e-text").eq(i).html(getByIdData.specsArr[i].content);
                if(editorDiv.eq(i).next("input").attr("disabled")){
                    editor.$textElem.attr('contenteditable', false);
                    $('#'+idNumber).find(".w-e-text").css({background:"#eceaea"});
                }
                $(".w-e-text-container").css({"z-index":"100"});
                $('#'+idNumber).find(".w-e-menu").css({"z-index":"101"});
            }
        });
    }
    getGoodsData();
});