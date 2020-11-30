require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var initialData = {
    };
    //页面操作配置
    var operates = {
        addGoods:function(){
            var editerContent = $(".w-e-text");
            var editerImg = editerContent.find("p").find("img");
            if(editerImg.length>0){
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
                        content:editerImg.attr("src")
                    },
                    dataType: 'json',
                    success: function (res) {
                    }
                }).fail(function (jqXHR, textStatus) {
                    hound.error('Request failed: ' + textStatus);
                });
            }
            $("input[name=details]").val($(".w-e-text").html());
            utils.reInputName($(".specItem"));
            utils.reInputName($(".imgItem"));
            utils.ajaxSubmit(apis.mallGoods.create,$("#goodsForm").serialize(),function(data){
                hound.success("添加成功","",1000);
                utils.modal.modal('hide');
            })
        }
    };

    utils.bindList($(document), operates);
    // 页面首次加载列表数据
    setTimeout(function(){
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
                editor.$textElem.attr('contenteditable', false);
                $(".w-e-text-container").css({"z-index":"100"});
                $('#'+idNumber).find(".w-e-menu").css({"z-index":"101"});
            }
            $("#goodsForm").append($("fieldset").prop('disabled', true));
            $(".saveButton").remove();
        });
    },100);
});