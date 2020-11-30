require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var initialData = {
        dataArr:{},
        specsArr:[{}]
    };
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
                    uploadFile.find(".imgUrl").html("<a target='_blank' href='"+ res.result +"'><img style='display: inline-block;width: 45px;height: 20px' src='"+ res.result +"'></a>");
                    uploadFile.find("input[type=hidden]").val(res.result);
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
                specItem.remove();
                var specNumber = $(".specNumber");
                for(var i=0;i<specNumber.length;i++){
                    specNumber.eq(i).text(i+1);
                }
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
                                        for(var j=0;j<$(".w-e-text").length;j++){
                                            $("input[name='detail[][content]']").eq(j).val($(".w-e-text").eq(j).html());
                                        }
                                        utils.reInputName($(".specItem"));
                                        utils.reInputName($(".imgItem"));
                                        utils.reInputName($(".delSpecSingle"));
                                        utils.reInputName($(".delImgSingle"));
                                        utils.ajaxSubmit(apis.subject.create,$("#goodsForm").serialize(),function(data){
                                            utils.loading(false);
                                            hound.success("添加成功","",'').then(function(){
                                                window.location.href = "@@HOSTview/subject/edit.html?id=" + data.id;
                                            });
                                        });
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
                    //            console.log($(".w-e-text").html());
                    //            utils.reInputName($(".specItem"));
                    //            utils.reInputName($(".imgItem"));
                    //            utils.reInputName($(".delSpecSingle"));
                    //            utils.reInputName($(".delImgSingle"));
                    //            utils.ajaxSubmit(apis.subject.create,$("#goodsForm").serialize(),function(data){
                    //                utils.loading(false);
                    //                hound.success("添加成功","",'').then(function(){
                    //                    window.location.href = "@@HOSTview/subject/edit.html?id=" + data.id;
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
                        utils.ajaxSubmit(apis.subject.create,$("#goodsForm").serialize(),function(data){
                            utils.loading(false);
                            hound.success("添加成功","",'').then(function(){
                                window.location.href = "@@HOSTview/subject/edit.html?id=" + data.id;
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
                    utils.ajaxSubmit(apis.subject.create,$("#goodsForm").serialize(),function(data){
                        utils.loading(false);
                        hound.success("添加成功","",'').then(function(){
                            window.location.href = "@@HOSTview/subject/edit.html?id=" + data.id;
                        });
                    })
                }else{
                    utils.loading(false);
                }
            }
        }
    };
    $(document).on("click",function(){
        $('.ability-list').remove();
    });
    utils.bindList($(document), operates);
    // 页面首次加载列表数据
    setTimeout(function(){
        $("#goodsForm").html(template('goodsFormContent', initialData));
        $("#tabContent1").html(template('specList', initialData));
        uploadFile();
        var E = window.wangEditor;
        var editor = new E('#editor_1');
        editor.customConfig.showLinkImg = false;         // 隐藏“网络图片”tab
        editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
        editor.create();
        $(".w-e-text-container").css({"height":"200px"});
        $(".w-e-text-container").css({"z-index":"100"});
        $("#editor_1").find(".w-e-menu").css({"z-index":"101"});
    },100);
});