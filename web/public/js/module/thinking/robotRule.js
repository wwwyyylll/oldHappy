require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var searchlabel = $(".searchlabel");
    var $addModal = $("#addModal");
    var $sampleTable = $('#sampleTable');
    var $visaPagination = $("#visaPagination");
    var $searchCont = $("#searchCont");
    //按钮组集合
    var editButton =
            '<button class="btn btn-primary" type="button" data-operate="edit">编辑</button>',
            //'<button class="btn btn-info" type="button" data-operate="look">查看</button>',
        startBouutn =  '<button class="btn btn-primary" type="button" data-operate="setOn">启动</button>',
        stopButton = '<button class="btn btn-danger" type="button" data-operate="setOff">停止</button>',
        delButton = '<button class="btn btn-danger" type="button" data-operate="del">删除</button>',
        joinBouutn =  '<button class="btn btn-primary" type="button" data-operate="join">参与活动</button>',
        logButton = '<button class="btn btn-warning" type="button" data-operate="showLog">日志</button>';

    searchlabel.on("click",function(){
        $("#selectsearchlabel").text($(this).text());
        $("#searchCont").val("");
        $("#searchCont").attr("data-id",'');
    })

    //新增机器人规则
    $addModal.on("click",function(){
        var initialData = {
            dataArr:{}
        };
        utils.renderModal('新增机器人规则', template('modalDiv',initialData), function(){
            if($("#visaPassportForm").valid()){
                if($("select[name=type]").val()==2){
                    if($("input[name=rangeMin]").val()<1){
                        hound.error("数字最小范围值为1","","");
                    }else if($("input[name=rangeMax]").val()>99){
                        hound.error("数字最大范围值为99","","");
                    }else{
                        utils.ajaxSubmit(apis.robotRule.create,$("#visaPassportForm").serialize(),function(data){
                            hound.success("添加成功","",1000);
                            utils.modal.modal('hide');
                            param.pageNo = 1;
                            loadData();
                        })
                    }
                }else if($("select[name=type]").val()==1){
                    //预见未来 期数为空时默认设置为通用
                    if($("input[name=typeContent]").val()==''){
                        hound.confirm('如若期数不填，则默认为通用，确认继续添加吗?', '', function () {
                            var addParam = {
                                type:$("select[name=type]").val(),
                                typeContent:-1,
                                robotCnt:$("input[name=robotCnt]").val(),
                                rangeMin:$("input[name=rangeMin]").val(),
                                rangeMax:$("input[name=rangeMax]").val(),
                                startTime:$("input[name=startTime]").val(),
                                endTime:$("input[name=endTime]").val()
                            };
                            utils.ajaxSubmit(apis.robotRule.create,addParam,function(data){
                                hound.success("添加成功","",1000);
                                utils.modal.modal('hide');
                                param.pageNo = 1;
                                loadData();
                            })
                        });
                    }else{
                        utils.ajaxSubmit(apis.robotRule.create,$("#visaPassportForm").serialize(),function(data){
                            hound.success("添加成功","",1000);
                            utils.modal.modal('hide');
                            param.pageNo = 1;
                            loadData();
                        })
                    }
                }else if($("select[name=type]").val()==3){
                    //商品 商品ID为空时默认设置为通用
                    if($("input[name=typeContent]").val()==''){
                        hound.confirm('如若商品ID不填，则默认为通用，确认继续添加吗?', '', function () {
                            var addParam = {
                                type:$("select[name=type]").val(),
                                typeContent:-1,
                                robotCnt:$("input[name=robotCnt]").val(),
                                rangeMin:$("input[name=rangeMin]").val(),
                                rangeMax:$("input[name=rangeMax]").val(),
                                startTime:$("input[name=startTime]").val(),
                                endTime:$("input[name=endTime]").val()
                            };
                            utils.ajaxSubmit(apis.robotRule.create,addParam,function(data){
                                hound.success("添加成功","",1000);
                                utils.modal.modal('hide');
                                param.pageNo = 1;
                                loadData();
                            })
                        });
                    }else{
                        utils.ajaxSubmit(apis.robotRule.create,$("#visaPassportForm").serialize(),function(data){
                            hound.success("添加成功","",1000);
                            utils.modal.modal('hide');
                            param.pageNo = 1;
                            loadData();
                        })
                    }
                }
            }
        }, 'lg');
        typeChange();
    })

    function typeChange(){
        $(document).on("click",function(){
            $('.ability-list').remove();
        });
        $("select[name=type]").on("change",function(){
            if($(this).val()==1){
                $(".rangeDiv").show();
                $(".rangeDiv").find("input").eq(0).attr("required","required");
                $(".rangeDiv").find("input").eq(1).attr("required","required");
                $("input[name=typeContent]").closest(".col-4").show();
                $("input[name=typeContent]").closest(".col-4").find("span").text("期数");
                $("input[name=typeContent]").val("");
                $("input[name=rangeMin]").parent().find("span").text("能量最小范围");
                $("input[name=rangeMin]").attr("placeholder","请输入能量最小范围值");
                $("input[name=rangeMax]").parent().find("span").text("能量最大范围");
                $("input[name=rangeMax]").attr("placeholder","请输入能量最大范围值");
            }else if($(this).val()==2){
                $(".rangeDiv").show();
                $(".rangeDiv").find("input").eq(0).attr("required","required");
                $(".rangeDiv").find("input").eq(1).attr("required","required");
                $("input[name=typeContent]").closest(".col-4").hide();
                $("input[name=typeContent]").val("-1");
                $("input[name=rangeMin]").parent().find("span").text("数字最小范围");
                $("input[name=rangeMax]").parent().find("span").text("数字最大范围");
                $("input[name=rangeMin]").attr("placeholder","请输入数字最小范围值");
                $("input[name=rangeMax]").attr("placeholder","请输入数字最大范围值");
            }else if($(this).val()==3){
                $(".rangeDiv").hide();
                $(".rangeDiv").find("input").eq(0).removeAttr("required");
                $(".rangeDiv").find("input").eq(1).removeAttr("required");
                $("input[name=rangeMin]").val("");
                $("input[name=rangeMax]").val("");
                $("input[name=typeContent]").closest(".col-4").show();
                $("input[name=typeContent]").closest(".col-4").find("span").text("商品ID");
                $("input[name=typeContent]").val("");
            }
        });
    }

    //页面操作配置
    var operates = {
        //编辑
        edit:function($this){
            var id = $this.closest("tr").attr("data-id");
            utils.ajaxSubmit(apis.robotRule.getById, {id: id}, function (data) {
                var getByIdData = {
                    dataArr:data
                };
                utils.renderModal('编辑机器人规则', template('modalDiv', getByIdData), function(){
                    if($("#visaPassportForm").valid()) {
                        if($("select[name=type]").val()==2){
                            if($("input[name=rangeMin]").val()<1){
                                hound.error("数字最小范围值为1","","");
                            }else if($("input[name=rangeMax]").val()>99){
                                hound.error("数字最大范围值为99","","");
                            }else{
                                utils.ajaxSubmit(apis.robotRule.updateById, $("#visaPassportForm").serialize(), function (data) {
                                    hound.success("编辑成功", "", 1000);
                                    utils.modal.modal('hide');
                                    loadData();
                                })
                            }
                        }else if($("select[name=type]").val()==1){
                            //预见未来 期数为空时默认设置为通用
                            if($("input[name=typeContent]").val()==''){
                                hound.confirm('如若期数不填，则默认为通用，确认继续编辑吗?', '', function () {
                                    var editParam = {
                                        id:$("input[name=id]").val(),
                                        type:$("select[name=type]").val(),
                                        typeContent:-1,
                                        robotCnt:$("input[name=robotCnt]").val(),
                                        rangeMin:$("input[name=rangeMin]").val(),
                                        rangeMax:$("input[name=rangeMax]").val(),
                                        startTime:$("input[name=startTime]").val(),
                                        endTime:$("input[name=endTime]").val()
                                    };
                                    utils.ajaxSubmit(apis.robotRule.updateById,editParam,function(data){
                                        hound.success("编辑成功","",1000);
                                        utils.modal.modal('hide');
                                        loadData();
                                    })
                                });
                            }else{
                                utils.ajaxSubmit(apis.robotRule.updateById,$("#visaPassportForm").serialize(),function(data){
                                    hound.success("编辑成功","",1000);
                                    utils.modal.modal('hide');
                                    loadData();
                                })
                            }
                        }else if($("select[name=type]").val()==3){
                            //商品 商品ID为空时默认设置为通用
                            if($("input[name=typeContent]").val()==''){
                                hound.confirm('如若商品ID不填，则默认为通用，确认继续编辑吗?', '', function () {
                                    var editParam = {
                                        id:$("input[name=id]").val(),
                                        type:$("select[name=type]").val(),
                                        typeContent:-1,
                                        robotCnt:$("input[name=robotCnt]").val(),
                                        rangeMin:$("input[name=rangeMin]").val(),
                                        rangeMax:$("input[name=rangeMax]").val(),
                                        startTime:$("input[name=startTime]").val(),
                                        endTime:$("input[name=endTime]").val()
                                    };
                                    utils.ajaxSubmit(apis.robotRule.updateById,editParam,function(data){
                                        hound.success("编辑成功","",1000);
                                        utils.modal.modal('hide');
                                        loadData();
                                    })
                                });
                            }else{
                                utils.ajaxSubmit(apis.robotRule.updateById,$("#visaPassportForm").serialize(),function(data){
                                    hound.success("编辑成功","",1000);
                                    utils.modal.modal('hide');
                                    loadData();
                                })
                            }
                        }
                    }
                }, 'lg');
                typeChange();
            });
        },
        //查看
        look:function($this){
            var id = $this.closest("tr").attr("data-id");
            utils.ajaxSubmit(apis.robotRule.getById, {id: id}, function (data) {
                var getByIdData = {
                    dataArr:data
                };
                utils.renderModal('查看机器人规则', template('modalDiv', getByIdData),'', 'lg');
                $("#visaPassportForm").append($("fieldset").prop('disabled', true));
            });
        },
        //停止
        setOff:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认停止吗?', '', function () {
                utils.ajaxSubmit(apis.robotRule.offById, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        //启动
        setOn:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认启动吗?', '', function () {
                utils.ajaxSubmit(apis.robotRule.onById, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        del:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认删除吗?', '', function () {
                utils.ajaxSubmit(apis.robotRule.delById, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        //参与活动
        join:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认参与活动吗?', '', function () {
                //utils.ajaxSubmit(apis.robotRule.joinActivity, {id: id}, function (data) {
                //    hound.success("参与成功", "", 1000);
                //    loadData();
                //});
                $.ajax({
                    type:'POST',
                    url: "@@API",
                    data: {
                        c:"robotRule",
                        a:"joinActivity",
                        id:id,
                        linkUserName:consts.param.linkUserName,
                        linkPassword:consts.param.linkPassword,
                        signature:consts.param.signature,
                        userToken: $.cookie('userToken'),
                    },
                    dataType: 'json',
                    success: function (res) {
                        if(res.code==200){
                            if(res.result.isSuccess==1){
                                hound.success(res.result.message, "", 1000);
                            }else{
                                hound.error(res.result.message);
                            }
                        }else if(res.code=='A00001'){
                            hound.error(res.message);
                        }else if(res.code=='B00001'){
                            location.href = '@@HOSTlogin.html';
                        }
                    }
                }).fail(function (jqXHR, textStatus) {
                    hound.error('Request failed: ' + textStatus);
                });
            });
        },
        showLog:function($this){
            var id = $this.closest("tr").attr("data-id");
            logParam.id = id;
            logListDropDown.statusText = "状态";
            logParam.date = '';
            logParam.status = '';
            logParam.pageNo = 1;
            logLoadData();
        },
    }

    var param = {
        pageNo: 1,
        pageSize:10,
        status:'',
        type:'',
        typeContent:'',
        startTime:'',
        endTime:''
    };

    function searchTypeContent(){
        $(".goSearch").on("click",function(){
            param.typeContent = $(".searchTypeContent").val();
            listDropDown.TypeContentText = "期数/商品ID为" + param.typeContent;
            param.pageNo = 1;
            loadData();
        })
    }

    function loadData() {
        utils.ajaxSubmit(apis.robotRule.getLists, param, function (data) {
            //根据状态值显示对应的状态文字
            $.each(data.dataArr,function(i,n){
                n.statusText = consts.status.robotRoleStatus[n.status];
                n.typeText = consts.status.type[n.type];
                if(n.status=="1"){
                    n.materialButtonGroup = editButton + startBouutn + delButton
                }else if(n.status=="2"){
                    n.materialButtonGroup = stopButton + logButton
                }else{
                    n.materialButtonGroup = logButton
                }
                //(n.showJoinBtn=="1")? n.materialButtonGroup = n.materialButtonGroup + joinBouutn : n.materialButtonGroup = n.materialButtonGroup;
            });
            data.statusText = listDropDown.statusText;
            data.typeText = listDropDown.typeText;
            data.TypeContentText = listDropDown.TypeContentText;
            $sampleTable.html(template('visaListItem', data));
            utils.bindPagination($visaPagination, param, loadData);
            $visaPagination.html(utils.pagination(parseInt(data.cnt), param.pageNo));
            $sampleTable.find('#startTime').val(param.startTime);
            $sampleTable.find('#endTime').val(param.endTime);
            searchTypeContent();
        });
    }
    var logParam = {
        pageNo: 1,
        pageSize:10,
        status:'',
        id:'',
        typeContent:'',
        date:''
    };
    var logListDropDown = {
        statusText:'状态',
        TypeContentText:'期数/商品ID'
    };
    function logLoadData(){
        utils.ajaxSubmit(apis.robotRule.getByRuleId, logParam, function (data) {
            //根据状态值显示对应的状态文字 + 显示 有效/无效按钮
            $.each(data.dataArr,function(i,n){
                n.statusText = consts.status.ruleLogStatus[n.status];
            })
            data.statusText = logListDropDown.statusText;
            if(logParam.typeContent==''){
                if(data.type==1 || data.type==2){
                    logListDropDown.TypeContentText = "期数";
                }else if(data.type==3){
                    logListDropDown.TypeContentText = "商品ID";
                }
            }else{
                logListDropDown.TypeContentText = logListDropDown.TypeContentText;
            }
            data.TypeContentText = logListDropDown.TypeContentText;
            utils.renderModal('规则ID为'+ logParam.id +'的日志', template('logList', data),'', 'xl');
            utils.bindPagination($("#logPagination"), logParam, logLoadData);
            $("#logPagination").html(utils.pagination(parseInt(data.cnt), logParam.pageNo));
            $("#logTable").find('#typeDate').val(logParam.date);

            $("#logTable").on('click', '#dropLogStatusOptions a[data-id]', function () {
                logParam.status = $(this).data('id');
                ($(this).text()=="所有") ? logListDropDown.statusText = "状态" : logListDropDown.statusText = $(this).text();
                logParam.pageNo = 1;
                logLoadData();
            }).on('click', '#dropLogTypeContentOptions a[data-id]', function () {
                logParam.typeContent = $(this).data('id');
                ($(this).text()=="所有") ? logListDropDown.TypeContentText = "期数/商品ID" : logListDropDown.TypeContentText = $(this).text();
                logParam.pageNo = 1;
                logLoadData();
            });
            $(".goSearchLog").on("click",function(){
                logParam.typeContent = $(".searchLogTypeContent").val();
                logListDropDown.TypeContentText =  logParam.typeContent;
                logParam.pageNo = 1;
                logLoadData();
            });
            setInterval(function () {
                var $typeDate = $("#logTable").find('#typeDate');
                if ($typeDate.length === 1) {
                    if ($typeDate.val() !== logParam.date) {
                        logParam.date = $typeDate.val();
                        logParam.pageNo = 1;
                        logLoadData();
                    }
                }
            },500);
        });
    }
    // 页面首次加载列表数据
    loadData();
    utils.bindList($(document), operates);
    var listDropDown = {
        statusText:'状态',
        typeText:'类型',
        TypeContentText:'期数/商品ID'
    };
    $sampleTable.on('click', '#dropStatusOptions a[data-id]', function () {
        param.status = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.statusText = "状态" : listDropDown.statusText = $(this).text();
        param.pageNo = 1;
        loadData();
    }).on('click', '#dropTopOptions a[data-id]', function () {
        param.type = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.typeText = "类型" : listDropDown.typeText = $(this).text();
        param.pageNo = 1;
        loadData();
    }).on('click', '#dropTypeContentOptions a[data-id]', function () {
        param.typeContent = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.TypeContentText = "期数/商品ID" : listDropDown.TypeContentText = $(this).text();
        param.pageNo = 1;
        loadData();
    });
    setInterval(function () {
        var $startTime = $sampleTable.find('#startTime');
        if ($startTime.length === 1) {
            if ($startTime.val() !== param.startTime) {
                param.startTime = $startTime.val();
                param.pageNo = 1;
                loadData();
            }
        }
        var $endTime = $sampleTable.find('#endTime');
        if ($endTime.length === 1) {
            if ($endTime.val() !== param.endTime) {
                param.endTime = $endTime.val();
                param.pageNo = 1;
                loadData();
            }
        }
    },500);
    $("#search").on("click",function(){
        param.pageNo = 1;
        param.title = $("#searchCont").val();
        loadData();
    });
    $('#searchCont').on('keypress',function(event){
        if (event.keyCode == 13) {
            $('#search').click();
        }
    });
});