require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var searchlabel = $(".searchlabel");
    var $sampleTable = $('#sampleTable');
    var $visaPagination = $("#visaPagination");
    var $searchCont = $("#searchCont");
    var $batchImport = $("#batchImport");
    //按钮组集合
    var comButtons =
            '<button class="btn btn-primary" type="button" data-operate="look">编辑</button>',
        startBouutn =  '<button class="btn btn-primary" type="button" data-operate="setOn">上架</button>',
        stopButton = '<button class="btn btn-danger" type="button" data-operate="setOff">下架</button>',
        delButton = '<button class="btn btn-danger" type="button" data-operate="del">删除</button>',
        handButton = '<button class="btn btn-success" type="button" data-operate="hand">手动同步</button>',
        autoButton = '<button class="btn btn-primary" type="button" data-operate="auto">自动同步</button>';

    searchlabel.on("click",function(){
        $("#selectsearchlabel").text($(this).text());
        $("#searchCont").val("");
        $("#searchCont").attr("data-id",'');
    });

    var rankingId;
    var rankingTitle;
    var loc = location.href;
    var n1 = loc.length;//地址的总长度
    var n2 = loc.indexOf("=");//取得=号的位置
    var id = decodeURI(loc.substr(n2+1,n1-n2));//从=号后面的内容
    var urlParam = id.split("=");
    if(urlParam[0].indexOf('html')=="-1"){
        rankingId = urlParam[0];
    }

    var importFileData = '';
    $batchImport.on("click",function(){
        var batchData = {
            rankingTitle:rankingTitle
        };
        utils.renderModal('批量导入', template('batchImportModal',batchData), function(){
            utils.loading(true);
            var formFile = new FormData();
            formFile.append("c", "rankingGoods");
            formFile.append("a", "importFromExcel");
            formFile.append("linkUserName", consts.param.linkUserName);
            formFile.append("linkPassword", consts.param.linkPassword);
            formFile.append("signature", consts.param.signature);
            formFile.append("userToken", $.cookie('userToken'));
            formFile.append("rankingId", rankingId);
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
                        hound.success(res.result,"",'').then(function(){
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
        });
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
                    $(".imgUrl").html("<a target='_blank' href='"+ res.result +"'>图片预览</a>");
                    $("input[name=coverImg]").val(res.result);
                }
            }).fail(function (jqXHR, textStatus) {
                hound.error('Request failed: ' + textStatus);
            });
        });
    }
    function copyText(){
        var btns = document.querySelectorAll('.copyBtn');
        var clipboard = new ClipboardJS(btns);
        clipboard.on('success', function(e) {
            hound.success("商品地址复制成功", "", 1000);
        });
        clipboard.on('error', function(e) {
            hound.error("商品地址复制失败", "", 1000);
        });
    }

    function closeWindow(){
        $(".close").one("click",function(){
            utils.modal.modal('hide');
            loadData();
        });
        $(".secondCancel").one("click",function(){
            utils.modal.modal('hide');
            loadData();
        });
        var footerCancel = $(".modal-footer").find("button").eq(1);
        footerCancel.one("click",function(){
            utils.modal.modal('hide');
            loadData();
        });
    }
    //页面操作配置
    var operates = {
        //编辑
        edit:function($this){
            var id = $this.closest("tr").attr("data-id");
            utils.ajaxSubmit(apis.rankingGoods.getById, {id: id,rankingId:rankingId}, function (data) {
                var getByIdData = {
                    dataArr:data.dataArr,
                    categoryArr:categoryArr,
                    goodsFrom:goodsFrom
                };
                getByIdData.dataArr.statusText = consts.status.goods[getByIdData.dataArr.status];
                utils.renderModal('编辑商品', template('modalDiv', getByIdData), function(){
                    if($("#visaPassportForm").valid()) {
                        utils.loading(true);
                        utils.ajaxSubmit(apis.rankingGoods.updateById, $("#visaPassportForm").serialize(), function (data) {
                            utils.loading(false);
                            hound.success("编辑成功", "", 1000);
                            utils.modal.modal('hide');
                            loadData();
                        })
                    }
                }, 'lg');
                uploadFile();
                closeWindow();
            });
        },
        sameCancel:function($this){
            var footer = $(".modal-footer");
            //footer.find("button").eq(1).click();
            utils.modal.modal('hide');
            loadData();
        },
        sameUpdate:function($this){
            var footer = $(".modal-footer");
            footer.find("button").eq(0).click();
        },
        updateTaoMessage:function($this){
            var id = $("input[name=id]").val();
            var itemId = $("input[name=itemId]").val();
            utils.loading(true);
            utils.ajaxSubmit(apis.rankingGoods.syncById, {id: id,itemId:itemId,rankingId:rankingId}, function (data) {
                utils.loading(false);
                var getByIdData = {
                    dataArr:data.dataArr,
                    categoryArr:categoryArr
                };
                getByIdData.dataArr.statusText = consts.status.goods[getByIdData.dataArr.status];
                utils.renderModal('编辑商品', template('modalDiv', getByIdData),'', 'lg');
                uploadFile();
                closeWindow();
                hound.success("同步成功", "", 1000);
                loadData();
            });
        },
        updateTaoPwd:function($this){
            var id = $("input[name=id]").val();
            var itemId = $("input[name=itemId]").val();
            hound.confirm('确认更新淘口令吗?', '', function () {
                utils.ajaxSubmit(apis.rankingGoods.getPwdById, {itemId: itemId,rankingId:rankingId}, function (data) {
                    $(".pwd").val(data);
                });
            });
        },
        //查看
        look:function($this){
            var id = $this.closest("tr").attr("data-id");
            if($this.text()=="编辑"){
                utils.ajaxSubmit(apis.rankingGoods.getById, {id: id,rankingId:rankingId}, function (data) {
                    var getByIdData = {
                        dataArr:data.dataArr,
                        categoryArr:categoryArr
                    };
                    getByIdData.dataArr.statusText = consts.status.goods[getByIdData.dataArr.status];
                    utils.renderModal('编辑商品', template('modalDiv', getByIdData),'', 'lg');
                });
            }else if($this.text()=="查看"){
                utils.ajaxSubmit(apis.rankingGoods.getById, {id: id,rankingId:rankingId}, function (data) {
                    var getByIdData = {
                        dataArr:data.dataArr,
                        categoryArr:categoryArr
                    };
                    getByIdData.dataArr.statusText = consts.status.goods[getByIdData.dataArr.status];
                    utils.renderModal('查看商品', template('modalDiv', getByIdData),'', 'lg');
                    $("#visaPassportForm").append($("fieldset").prop('disabled', true));
                });
            }
        },
        //无效
        setOff:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认下架吗?', '', function () {
                utils.ajaxSubmit(apis.rankingGoods.offById, {id: id,rankingId:rankingId}, function (data) {
                    loadData();
                });
            });
        },
        //有效
        setOn:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认上架吗?', '', function () {
                utils.ajaxSubmit(apis.rankingGoods.onById, {id: id,rankingId:rankingId}, function (data) {
                    loadData();
                });
            });
        },
        //删除
        del:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认删除吗?', '', function () {
                utils.ajaxSubmit(apis.rankingGoods.delById, {id: id,rankingId:rankingId}, function (data) {
                    loadData();
                });
            });
        },
        hand:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认手动同步吗?', '', function () {
                utils.ajaxSubmit(apis.rankingGoods.handSyncById, {id: id,rankingId:rankingId}, function (data) {
                    loadData();
                });
            });
        },
        auto:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认自动同步吗?', '', function () {
                utils.ajaxSubmit(apis.rankingGoods.autoSyncById, {id: id,rankingId:rankingId}, function (data) {
                    loadData();
                });
            });
        }
    };

    var param = {
        pageNo: 1,
        pageSize:10,
        status:'',
        id:'',
        title:'',
        categoryId:'',
        syncWay:'',
        itemId:'',
        date:'',
        rankingId:rankingId
    };
    var listDropDown = {
        categoryText:'分类',
        statusText:'状态',
        syncWayText:'同步方式'
    };

    var categoryArr;
    var goodsFrom;
    function loadData() {
        utils.ajaxSubmit(apis.rankingGoods.getLists, param, function (data) {
            $.each(data.dataArr,function(i,n){
                n.statusText = consts.status.goods[n.status];
                n.syncWayText = consts.status.syncWay[n.itemArr.syncWay];
                if(n.isCanOpt=="yes"){
                    if(n.status=="1"){
                        n.materialButtonGroup = comButtons + stopButton + delButton;
                    }else if(n.status=="2"){
                        n.materialButtonGroup = comButtons + startBouutn + delButton;
                    }else if(n.status=="3"){
                        n.materialButtonGroup = comButtons + startBouutn + stopButton + delButton;
                    }
                    if(n.itemArr.syncWay=="1"){
                        n.materialButtonGroup = n.materialButtonGroup + autoButton;
                    }else{
                        n.materialButtonGroup = n.materialButtonGroup + handButton;
                    }
                }else if(n.isCanOpt=="no"){
                    n.materialButtonGroup = '<button class="btn btn-info" type="button" data-operate="look">查看</button>';
                }
            });
            categoryArr = data.category;
            goodsFrom = data.rankingArr.from;
            data.categoryText = listDropDown.categoryText;
            data.statusText = listDropDown.statusText;
            data.syncWayText = listDropDown.syncWayText;
            $sampleTable.html(template('visaListItem', data));
            $(".rankingTitle1").html(template('titleItem', data));
            $(".rankingTitle2").html(template('titleItem', data));
            rankingTitle = data.rankingArr.title;
            (data.rankingArr.from==1)? $(".batchImportDiv").show() : $(".batchImportDiv").hide();
            utils.bindPagination($visaPagination, param, loadData);
            $visaPagination.html(utils.pagination(parseInt(data.cnt), param.pageNo));
            $sampleTable.find('#date').val(param.date);
            copyText();
        });
    }
    // 页面首次加载列表数据
    loadData();
    utils.bindList($(document), operates);

    $sampleTable.on('click', '#dropStatusOptions a[data-id]', function () {
        param.status = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.statusText = "状态" : listDropDown.statusText = $(this).text();
        param.pageNo = 1;
        loadData();
    }).on('click', '#dropCategoryOptions a[data-id]', function () {
        param.categoryId = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.categoryText = "分类" : listDropDown.categoryText = $(this).text();
        param.pageNo = 1;
        loadData();
    }).on('click', '#dropSyncWayOptions a[data-id]', function () {
        param.syncWay = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.syncWayText = "同步方式" : listDropDown.syncWayText = $(this).text();
        param.pageNo = 1;
        loadData();
    });
    setInterval(function () {
        var $date = $sampleTable.find('#date');
        if ($date.length === 1) {
            if ($date.val() !== param.date) {
                param.date = $date.val();
                param.pageNo = 1;
                loadData();
            }
        }
    },500);
    $("#search").on("click",function(){
        param.pageNo = 1;
        var selectSearchLabel = $("#selectsearchlabel").text();
        if(selectSearchLabel=="商品ID"){
            param.id = $("#searchCont").val();
            param.title = '';
            param.itemId = '';
            loadData();
        }else if(selectSearchLabel=="淘宝商品ID"){
            param.id = '';
            param.title = '';
            param.itemId = $("#searchCont").val();
            loadData();
        }else if(selectSearchLabel=="标题"){
            param.id = '';
            param.itemId = '';
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