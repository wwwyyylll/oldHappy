require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var searchlabel = $(".searchlabel");
    var $addModal = $("#addModal");
    var $sampleTable = $('#sampleTable');
    var $visaPagination = $("#visaPagination");
    var $searchCont = $("#searchCont");
    //按钮组集合
    var comButtons =
            '<button class="btn btn-primary" type="button" data-operate="edit">编辑</button>'+
            '<button class="btn btn-info" type="button" data-operate="look">查看</button>',
        startBouutn =  '<button class="btn btn-primary" type="button" data-operate="setOn">有效</button>',
        stopButton = '<button class="btn btn-danger" type="button" data-operate="setOff">无效</button>',
        saveArticleButton = '<button class="btn btn-primary" type="button" data-operate="saveArticle">生成软文</button>';

    searchlabel.on("click",function(){
        $("#selectsearchlabel").text($(this).text());
        $("#searchCont").val("");
        $("#searchCont").attr("data-id",'');
    });

    //新增
    $addModal.on("click",function(){
        var initialData = {
            dataArr:{}
        };
        utils.renderModal('新增排行榜', template('modalDiv',initialData), function(){
            if($("#visaPassportForm").valid()){
                utils.loading(true);
                utils.ajaxSubmit(apis.ranking.create,$("#visaPassportForm").serialize(),function(data){
                    utils.loading(false);
                    hound.success("添加成功","",1000);
                    utils.modal.modal('hide');
                    param.pageNo = 1;
                    loadData();
                })
            }
        }, 'lg');
        $(".modal-body").css({background:"#ece9e9"});
        uploadFile();
        showIndex();
    });

    function showIndex(){
        $("select[name=isShowSearchIndex]").change(function(){
            if($(this).val()==1){
                $(this).closest(".col-6").next(".col-6").show();
            }else{
                $(this).closest(".col-6").next(".col-6").hide();
            }
        })
    }

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
                    uploadFile.find(".imgUrl").css({marginTop:0,marginBottom:0});
                    uploadFile.find(".imgUrl").html("<a target='_blank' href='"+ res.result +"'><img style='display: inline-block;width: 65px;height: 35px' src='"+ res.result +"'></a>");
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
            utils.ajaxSubmit(apis.ranking.getById, {id: id}, function (data) {
                var getByIdData = {
                    dataArr:data
                };
                utils.renderModal('编辑排行榜', template('modalDiv', getByIdData), function(){
                    if($("#visaPassportForm").valid()) {
                        utils.loading(true);
                        utils.ajaxSubmit(apis.ranking.updateById, $("#visaPassportForm").serialize(), function (data) {
                            utils.loading(false);
                            hound.success("编辑成功", "", 1000);
                            utils.modal.modal('hide');
                            loadData();
                        })
                    }
                }, 'lg');
                $(".modal-body").css({background:"#ece9e9"});
                uploadFile();
                showIndex();
            });
        },
        //查看
        look:function($this){
            var id = $this.closest("tr").attr("data-id");
            utils.ajaxSubmit(apis.ranking.getById, {id: id}, function (data) {
                var getByIdData = {
                    dataArr:data
                };
                utils.renderModal('查看排行榜', template('modalDiv', getByIdData),'', 'lg');
                $(".modal-body").css({background:"#ece9e9"});
                $("#visaPassportForm").append($("fieldset").prop('disabled', true));
            });
        },
        //无效
        setOff:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认无效吗?', '', function () {
                utils.ajaxSubmit(apis.ranking.offById, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        //有效
        setOn:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认有效吗?', '', function () {
                utils.ajaxSubmit(apis.ranking.onById, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        //生成软文
        saveArticle:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认生成软文吗?', '', function () {
                utils.loading(true);
                utils.ajaxSubmit(apis.taobaoArticle.saveArticle, {id: id,type:2}, function (data) {
                    utils.loading(false);
                    hound.success("操作成功","",'').then(function(){
                        loadData();
                    });
                });
            });
        }
    };

    var param = {
        pageNo: 1,
        pageSize:10,
        status:''
    };
    var listDropDown = {
        statusText:'状态'
    };

    function loadData() {
        utils.ajaxSubmit(apis.ranking.getLists, param, function (data) {
            $.each(data.dataArr,function(i,n){
                n.statusText = consts.status.ordinary[n.status];
                n.sourceText = consts.status.ranking[n.source];
                n.isShowRankingIndexText = consts.status.isBind[n.isShowRankingIndex];
                n.isShowSearchIndexText = consts.status.isBind[n.isShowSearchIndex];
                n.showSearchIndexPositionText = consts.status.indexPosition[n.showSearchIndexPosition];
                (n.status=="1")? n.materialButtonGroup = comButtons + stopButton : n.materialButtonGroup = comButtons + startBouutn;
                if(n.canCreateArticle=='yes'){
                    n.materialButtonGroup = n.materialButtonGroup + saveArticleButton ;
                }else{
                    n.materialButtonGroup = n.materialButtonGroup ;
                }
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

    $sampleTable.on('click', '#dropStatusOptions a[data-id]', function () {
        param.status = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.statusText = "状态" : listDropDown.statusText = $(this).text();
        param.pageNo = 1;
        loadData();
    });
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