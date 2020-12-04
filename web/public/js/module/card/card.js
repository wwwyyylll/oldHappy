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
        stopButton = '<button class="btn btn-danger" type="button" data-operate="setOff">无效</button>';

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
                    $("input[name=pic]").val(res.result);
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
                $(".type1").show();
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

    //新增
    $addModal.on("click",function(){
        var initialData = {
            dataArr:{}
        };
        utils.renderModal('新增卡片', template('modalDiv',initialData), function(){
            if($("#visaPassportForm").valid()){
                utils.loading(true);
                utils.ajaxSubmit(apis.taobaoPopularizeImages.create,$("#visaPassportForm").serialize(),function(data){
                    utils.loading(false);
                    hound.success("添加成功","",1000);
                    utils.modal.modal('hide');
                    param.pageNo = 1;
                    loadData();
                })
            }
        }, 'lg');
        uploadFile();
        typeChange();
    });

    //页面操作配置
    var operates = {
        //编辑
        edit:function($this){
            var id = $this.closest("tr").attr("data-id");
            utils.ajaxSubmit(apis.taobaoPopularizeImages.getById, {id: id}, function (data) {
                var getByIdData = {
                    dataArr:data
                };
                utils.renderModal('编辑海报', template('modalDiv', getByIdData), function(){
                    if($("#visaPassportForm").valid()) {
                        utils.loading(true);
                        utils.ajaxSubmit(apis.taobaoPopularizeImages.updateById, $("#visaPassportForm").serialize(), function (data) {
                            utils.loading(false);
                            hound.success("编辑成功", "", 1000);
                            utils.modal.modal('hide');
                            loadData();
                        })
                    }
                }, 'lg');
                uploadFile();
            });
        },
        //查看
        look:function($this){
            var id = $this.closest("tr").attr("data-id");
            utils.ajaxSubmit(apis.taobaoPopularizeImages.getById, {id: id}, function (data) {
                var getByIdData = {
                    dataArr:data
                };
                utils.renderModal('查看海报', template('modalDiv', getByIdData),'', 'lg');
                $("#visaPassportForm").append($("fieldset").prop('disabled', true));
            });
        },
        //无效
        setOff:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认无效吗?', '', function () {
                utils.ajaxSubmit(apis.taobaoPopularizeImages.offById, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        //有效
        setOn:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认有效吗?', '', function () {
                utils.ajaxSubmit(apis.taobaoPopularizeImages.onById, {id: id}, function (data) {
                    loadData();
                });
            });
        }
    };

    var param = {
        pageNo: 1,
        pageSize:10,
        status:''
    };

    function loadData() {
        //utils.ajaxSubmit(apis.taobaoPopularizeImages.getLists, param, function (data) {
            var data = {
                dataArr:[{
                    id:1,
                    type:1,
                    imageType:1,
                    pic:'',
                    content:'假的假的假的假的',
                    videoUrl:'https//:baidu.com'
                }]
            };
            $.each(data.dataArr,function(i,n){
                n.typeText = consts.status.cardType[n.type];
                n.imageTypeText = consts.status.imageType[n.imageType];
                n.materialButtonGroup = comButtons + stopButton;
                //(n.status=="1")? n.materialButtonGroup = comButtons + stopButton : n.materialButtonGroup = comButtons + startBouutn ;
            });
            //data.statusText = listDropDown.statusText;
            $sampleTable.html(template('visaListItem', data));
            //utils.bindPagination($visaPagination, param, loadData);
            //$visaPagination.html(utils.pagination(parseInt(data.cnt), param.pageNo));
        //});
    }
    // 页面首次加载列表数据
    loadData();
    utils.bindList($(document), operates);
    //列表筛选事件绑定
    var listDropDown = {
        statusText:'状态'
    };
    $sampleTable.on('click', '#dropStatusOptions a[data-id]', function () {
        param.status = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.statusText = "状态" : listDropDown.statusText = $(this).text();
        param.pageNo = 1;
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