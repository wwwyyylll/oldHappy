require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var searchlabel = $(".searchlabel");
    var $addModal = $("#addModal");
    var $sampleTable = $('#sampleTable');
    var $visaPagination = $("#visaPagination");
    var $batchImport = $("#batchImport");
    //按钮组集合
    var comButtons =
            '<button class="btn btn-primary" type="button" data-operate="edit">编辑</button>'+
            '<button class="btn btn-info" type="button" data-operate="look">查看</button>',
        delButton = '<button class="btn btn-danger" type="button" data-operate="del">删除</button>';

    searchlabel.on("click",function(){
        $("#selectsearchlabel").text($(this).text());
        $("#searchCont").val("");
        $("#searchCont").attr("data-id",'');
    });

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
                    $(".imgUrl").html("<a target='_blank' href='"+ res.result +"'><img style='display: inline-block;width: 100px;height: 33px' src='"+ res.result +"'></a>");
                    $(".imgUrl").css({marginTop:0});
                    $("input[name=img_url]").val(res.result);
                }
            }).fail(function (jqXHR, textStatus) {
                hound.error('Request failed: ' + textStatus);
            });
        });
    }
    function typeChange(){
        var type = $("select[name=type]");
        type.on("change",function(){
            var value = $(this).val();
            if(value==1){
                $(".type1").show();
                $(".type2").hide();
                $(".type3").hide();
            }else if(value==2){
                $(".type1").hide();
                $(".type2").show();
                $(".type3").hide();
            }else if(value==3){
                $(".type1").hide();
                $(".type2").hide();
                $(".type3").show();
            }else{
                $(".type1").hide();
                $(".type2").hide();
                $(".type3").hide();
            }
        })
    }

    function messageText(){
        $("select[name=type]").on("change",function(){
            if($(this).val()==2){
                //图文
                $(".message").html("*注意：上传EXCEL文件格式为 类型 + 标题 + 作者 + 内容");
            }else if($(this).val()==3){
                //视频
                $(".message").html("*注意：上传EXCEL文件格式为 视频地址 + 类别 + 作者 + 标题");
            }else{
                $(".message").html("");
            }
        })
    }

    var importFileData = '';
    $batchImport.on("click",function(){
        var getData = {labelArr:labelArr};
        utils.renderModal('批量导入', template('batchImportModal',getData), function(){
            utils.loading(true);
            //console.log(importFileData);
            //var importData = {
            //    source:$("select[name=source]").val(),
            //    file:importFileData
            //}
            //utils.ajaxSubmit(apis.goods.importFromExcel, importData, function (data) {
            //    hound.success("导入成功", "", 1000);
            //    utils.modal.modal('hide');
            //    loadData();
            //})

            var tag_str = ',';
            $('input[name="tag"]:checked').each(function(){
                tag_str+=$(this).val()+',';
            });

            var formFile = new FormData();
            formFile.append("c", "joy");
            formFile.append("a", "upload");
            formFile.append("linkUserName", consts.param.linkUserName);
            formFile.append("linkPassword", consts.param.linkPassword);
            formFile.append("signature", consts.param.signature);
            formFile.append("userToken", $.cookie('userToken'));
            formFile.append("type", $("select[name=type]").val());
            formFile.append("tag_ids", tag_str);
            formFile.append("file", importFileData);

            $.ajax({
                type:'POST',
                url: "@@API",
                data: formFile,
                dataType: 'json',
                cache: false, //上传文件无需缓存
                processData: false, //用于对data参数进行序列化处理 这里必须false
                contentType: false, //必须
                success: function (res) {
                    utils.loading(false);
                    if(res.code==200){
                        hound.success("操作成功","",'').then(function(){
                            utils.modal.modal('hide');
                            loadData();
                        });
                    }else{
                        hound.error(res.message);
                    }
                }
            }).fail(function (jqXHR, textStatus) {
                utils.loading(false);
                hound.error('Request failed: ' + textStatus);
            });

        },'md');
        messageText();
        $('.uploadFileBatch').change(function () {
            if (window.FileReader) {
                var reader = new FileReader();
            } else {
                hound.alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
            }
            $('.avatarUploadBatch').removeClass('btn-default').addClass('btn-primary').prop('disabled', false);
            var file = this.files[0];
            importFileData = file;
            console.log(importFileData);
            reader.onload = function(e) {
                $(".imgUrl").html('<i class="fa fa-folder mr-2"></i>' + file.name)
            };
            reader.readAsDataURL(file);

            //if(file){
            //    var url = URL.createObjectURL(file);
            //    var base64 = blobToDataURL(file,function(base64Url) {
            //        importFileData = base64Url;
            //    })
            //}
        });
    });

    //获取当前时间
    function getDate(){
        var myDate = new Date();
        var year = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
        var month = myDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
        var date = myDate.getDate();        //获取当前日(1-31)
        var hour = myDate.getHours();       //获取当前小时数(0-23)
        var minutes = myDate.getMinutes();     //获取当前分钟数(0-59)
        var seconds = myDate.getSeconds();     //获取当前秒数(0-59)

        function addZero(a){
            var aa = "";
            if(a<10){
                aa = "0" + a;
            }else{
                aa = a;
            }
            return aa;
        }
        month = addZero(month);
        date = addZero(date);
        hour = addZero(hour);
        minutes = addZero(minutes);
        seconds = addZero(seconds);

        var dateData = year + "-" + month + "-" + date + " " + hour + ":" + minutes + ":" + seconds;
        return dateData;
    }

    //新增
    $addModal.on("click",function(){
        var releaseTime = getDate();
        var initialData = {
            dataArr:{
                status:1,
                tag_ids:'',
                release_time:releaseTime
            },
            labelArr:labelArr
        };
        utils.renderModal('新增卡片', template('modalDiv',initialData), function(){
            var tag_str = ',';
            $('input[name="tag"]:checked').each(function(){
                tag_str+=$(this).val()+',';
            });

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
                                        return;
                                    }
                                    func_digui(arry,len);
                                }
                            });
                        }
                    }
                }
                if(submitImgArr.length!=0){
                    func_digui(submitImgArr,submitImgArr.length);
                    setTimeout(function(){
                        var canPost = true;
                        for(var i=0;i<editerImg.length;i++){
                            if(editerImg.eq(i).attr("src").length>500){
                                canPost = false;
                                break;
                            }
                        }
                        if(canPost){
                            if($("#visaPassportForm").valid()){
                                $("input[name=graphic]").val($(".w-e-text").eq(0).html());
                                $("input[name=content]").val($(".w-e-text").eq(1).html());
                                $("input[name=tag_ids]").val(tag_str);
                                utils.ajaxSubmit(apis.joy.add,$("#visaPassportForm").serialize(),function(data){
                                    hound.success("添加成功","",1000);
                                    utils.modal.modal('hide');
                                    param.p = 1;
                                    loadData();
                                })
                            }
                        }
                    },1500);
                }else{
                    if($("#visaPassportForm").valid()){
                        $("input[name=graphic]").val($(".w-e-text").eq(0).html());
                        $("input[name=content]").val($(".w-e-text").eq(1).html());
                        $("input[name=tag_ids]").val(tag_str);
                        utils.ajaxSubmit(apis.joy.add,$("#visaPassportForm").serialize(),function(data){
                            hound.success("添加成功","",1000);
                            utils.modal.modal('hide');
                            param.p = 1;
                            loadData();
                        })
                    }
                }
            }else{
                if($("#visaPassportForm").valid()){
                    $("input[name=graphic]").val($(".w-e-text").eq(0).html());
                    $("input[name=content]").val($(".w-e-text").eq(1).html());
                    $("input[name=tag_ids]").val(tag_str);
                    utils.ajaxSubmit(apis.joy.add,$("#visaPassportForm").serialize(),function(data){
                        hound.success("添加成功","",1000);
                        utils.modal.modal('hide');
                        param.p = 1;
                        loadData();
                    })
                }
            }

        }, 'lg');
        var E = window.wangEditor;
        var editor = new E('#editor');
        editor.customConfig.showLinkImg = false;         // 隐藏“网络图片”tab
        editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
        editor.create();
        $(".w-e-text-container").css({"height":"500px"});
        $(".w-e-text-container").css({"z-index":"100"});
        $("#editor").find(".w-e-menu").css({"z-index":"101"});

        var editor1 = new E('#editor1');
        editor1.customConfig.showLinkImg = false;         // 隐藏“网络图片”tab
        editor1.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
        editor1.create();
        $(".w-e-text-container").css({"height":"500px"});
        $(".w-e-text-container").css({"z-index":"100"});
        $("#editor1").find(".w-e-menu").css({"z-index":"101"});

        uploadFile();
        typeChange();
    });

    //页面操作配置
    var operates = {
        //编辑
        edit:function($this){
            var id = $this.closest("tr").attr("data-id");
            utils.ajaxSubmit(apis.joy.view, {id: id}, function (data) {
                var getByIdData = {
                    dataArr:data,
                    labelArr:labelArr
                };
                getByIdData.dataArr.tag_ids = getByIdData.dataArr.tag_ids.split(",");
                getByIdData.dataArr.content = getByIdData.dataArr.content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
                getByIdData.dataArr.graphic = getByIdData.dataArr.graphic.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
                getByIdData.dataArr.content = getByIdData.dataArr.content.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
                getByIdData.dataArr.graphic = getByIdData.dataArr.graphic.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
                utils.renderModal('编辑卡片', template('modalDiv', getByIdData), function(){
                    var tag_str = ',';
                    $('input[name="tag"]:checked').each(function(){
                        tag_str+=$(this).val()+',';
                    });

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
                                                return;
                                            }
                                            func_digui(arry,len);
                                        }
                                    });
                                }
                            }
                        }
                        if(submitImgArr.length!=0){
                            func_digui(submitImgArr,submitImgArr.length);
                            setTimeout(function(){
                                var canPost = true;
                                for(var i=0;i<editerImg.length;i++){
                                    if(editerImg.eq(i).attr("src").length>500){
                                        canPost = false;
                                        break;
                                    }
                                }
                                if(canPost){
                                    if($("#visaPassportForm").valid()) {
                                        $("input[name=graphic]").val($(".w-e-text").eq(0).html());
                                        $("input[name=content]").val($(".w-e-text").eq(1).html());
                                        $("input[name=tag_ids]").val(tag_str);
                                        utils.ajaxSubmit(apis.joy.edit, $("#visaPassportForm").serialize(), function (data) {
                                            hound.success("编辑成功", "", 1000);
                                            utils.modal.modal('hide');
                                            loadData();
                                        })
                                    }
                                }
                            },1500);
                        }else{
                            if($("#visaPassportForm").valid()) {
                                $("input[name=graphic]").val($(".w-e-text").eq(0).html());
                                $("input[name=content]").val($(".w-e-text").eq(1).html());
                                $("input[name=tag_ids]").val(tag_str);
                                utils.ajaxSubmit(apis.joy.edit, $("#visaPassportForm").serialize(), function (data) {
                                    hound.success("编辑成功", "", 1000);
                                    utils.modal.modal('hide');
                                    loadData();
                                })
                            }
                        }
                    }else{
                        if($("#visaPassportForm").valid()) {
                            $("input[name=graphic]").val($(".w-e-text").eq(0).html());
                            $("input[name=content]").val($(".w-e-text").eq(1).html());
                            $("input[name=tag_ids]").val(tag_str);
                            utils.ajaxSubmit(apis.joy.edit, $("#visaPassportForm").serialize(), function (data) {
                                hound.success("编辑成功", "", 1000);
                                utils.modal.modal('hide');
                                loadData();
                            })
                        }
                    }

                }, 'lg');
                var E = window.wangEditor;
                var editor = new E('#editor');
                editor.customConfig.showLinkImg = false;         // 隐藏“网络图片”tab
                editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
                editor.create();
                $(".w-e-text-container").css({"height":"500px"});
                $(".w-e-text").eq(0).html(getByIdData.dataArr.graphic);
                $(".w-e-text-container").css({"z-index":"100"});
                $("#editor").find(".w-e-menu").css({"z-index":"101"});

                var editor1 = new E('#editor1');
                editor1.customConfig.showLinkImg = false;         // 隐藏“网络图片”tab
                editor1.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
                editor1.create();
                $(".w-e-text-container").css({"height":"500px"});
                $(".w-e-text").eq(1).html(getByIdData.dataArr.content);
                $(".w-e-text-container").css({"z-index":"100"});
                $("#editor1").find(".w-e-menu").css({"z-index":"101"});

                uploadFile();
                typeChange();
            });
        },
        //查看
        look:function($this){
            var id = $this.closest("tr").attr("data-id");
            utils.ajaxSubmit(apis.joy.view, {id: id}, function (data) {
                var getByIdData = {
                    dataArr:data,
                    labelArr:labelArr
                };
                getByIdData.dataArr.tag_ids = getByIdData.dataArr.tag_ids.split(",");
                getByIdData.dataArr.content = getByIdData.dataArr.content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
                getByIdData.dataArr.graphic = getByIdData.dataArr.graphic.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
                getByIdData.dataArr.content = getByIdData.dataArr.content.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
                getByIdData.dataArr.graphic = getByIdData.dataArr.graphic.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
                utils.renderModal('查看卡片', template('modalDiv', getByIdData),'', 'lg');
                var E = window.wangEditor;
                var editor = new E('#editor');
                editor.customConfig.showLinkImg = false;         // 隐藏“网络图片”tab
                editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
                editor.create();
                $(".w-e-text-container").css({"height":"500px"});
                $(".w-e-text").eq(0).html(getByIdData.dataArr.graphic);
                editor.$textElem.attr('contenteditable', false);
                $(".w-e-text-container").css({"z-index":"100"});
                $("#editor").find(".w-e-menu").css({"z-index":"101"});

                var editor1 = new E('#editor1');
                editor1.customConfig.showLinkImg = false;         // 隐藏“网络图片”tab
                editor1.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
                editor1.create();
                $(".w-e-text-container").css({"height":"500px"});
                $(".w-e-text").eq(1).html(getByIdData.dataArr.content);
                editor1.$textElem.attr('contenteditable', false);
                $(".w-e-text-container").css({"z-index":"100"});
                $("#editor1").find(".w-e-menu").css({"z-index":"101"});

                $("#visaPassportForm").append($("fieldset").prop('disabled', true));
            });
        },
        //删除
        del:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认删除吗?', '', function () {
                utils.ajaxSubmit(apis.joy.del, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        //预览
        preview:function($this){
            var textArea = $this.attr("data-content");
            var oNewWin = window.open('about:blank');
            oNewWin.document.write(textArea);
            oNewWin.document.body.style.cssText ='width:500px;margin:50px auto;';
        }
    };

    var labelParam = {
        p: 1,
        ps:100,
        status:1
    };
    var labelArr;
    function labelLoadData() {
        utils.ajaxSubmit(apis.tag.index, labelParam, function (data) {
            labelArr = data.list;
        });
    }
    labelLoadData();

    var param = {
        p: 1,
        ps:20,
        type:'',
        status:'',
        sortByRead:'',
        sortByfavorite:'',
        sortBypraise:'',
        tag_id:'',
        title:''
    };

    function loadData() {
        utils.ajaxSubmit(apis.joy.index, param, function (data) {
            $.each(data.list,function(i,n){
                n.content = n.content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
                n.graphic = n.graphic.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
                n.content = n.content.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
                n.graphic = n.graphic.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

                n.statusText = consts.status.ordinary[n.status];
                n.typeText = consts.status.cardType[n.type];
                n.imageTypeText = consts.status.imageType[n.img_type];
                n.materialButtonGroup = comButtons + delButton;
                //(n.status=="1")? n.materialButtonGroup = comButtons + stopButton : n.materialButtonGroup = comButtons + startBouutn ;
            });
            data.labelArr = labelArr;
            data.typeText = listDropDown.typeText;
            data.statusText = listDropDown.statusText;
            data.readText = listDropDown.readText;
            data.favoriteText = listDropDown.favoriteText;
            data.praiseText = listDropDown.praiseText;
            data.tagText = listDropDown.tagText;
            $sampleTable.html(template('visaListItem', data));
            utils.bindPagination($visaPagination, param, loadData);
            $visaPagination.html(utils.pagination(parseInt(data.count), param.p,20));
        });
    }
    // 页面首次加载列表数据
    setTimeout(function(){
        loadData();
    },100);

    utils.bindList($(document), operates);
    //列表筛选事件绑定
    var listDropDown = {
        typeText:'卡片格式',
        statusText:'状态',
        readText:'有效阅读数',
        favoriteText:'收藏数',
        praiseText:'点赞数',
        tagText:'关联标签'
    };
    $sampleTable.on('click', '#dropTypeOptions a[data-id]', function () {
        param.type = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.typeText = "卡片格式" : listDropDown.typeText = $(this).text();
        param.p = 1;
        loadData();
    }).on('click', '#dropStatusOptions a[data-id]', function () {
        param.status = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.statusText = "状态" : listDropDown.statusText = $(this).text();
        param.p = 1;
        loadData();
    }).on('click', '#dropTagOptions a[data-id]', function () {
        param.tag_id = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.tagText = "关联标签" : listDropDown.tagText = $(this).text();
        param.p = 1;
        loadData();
    }).on('click', '#dropReadOptions a[data-id]', function () {
        param.sortByRead = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.readText = "有效阅读数" : listDropDown.readText = $(this).text();
        param.p = 1;
        param.sortByfavorite = '';listDropDown.favoriteText = "收藏数";
        param.sortBypraise = '';  listDropDown.praiseText = "点赞数";
        loadData();
    }).on('click', '#dropFavoriteOptions a[data-id]', function () {
        param.sortByfavorite = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.favoriteText = "收藏数" : listDropDown.favoriteText = $(this).text();
        param.p = 1;
        param.sortByRead = '';listDropDown.readText = "有效阅读数";
        param.sortBypraise = '';  listDropDown.praiseText = "点赞数";
        loadData();
    }).on('click', '#dropPraiseOptions a[data-id]', function () {
        param.sortBypraise = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.praiseText = "点赞数" : listDropDown.praiseText = $(this).text();
        param.p = 1;
        param.sortByRead = '';listDropDown.readText = "有效阅读数";
        param.sortByfavorite = '';listDropDown.favoriteText = "收藏数";
        loadData();
    });
    $("#search").on("click",function(){
        param.p = 1;
        param.title = $("#searchCont").val();
        loadData();
    });
    $('#searchCont').on('keypress',function(event){
        if (event.keyCode == 13) {
            $('#search').click();
        }
    });
});