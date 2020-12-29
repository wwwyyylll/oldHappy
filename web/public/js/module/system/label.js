require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var searchlabel = $(".searchlabel");
    var $addModal = $("#addModal");
    var $sampleTable = $('#sampleTable');
    var $visaPagination = $("#visaPagination");
    //按钮组集合
    var comButtons =
            '<button class="btn btn-primary" type="button" data-operate="edit">编辑</button>'+
            '<button class="btn btn-info" type="button" data-operate="look">查看</button>';

    searchlabel.on("click",function(){
        $("#selectsearchlabel").text($(this).text());
        $("#searchCont").val("");
        $("#searchCont").attr("data-id",'');
    });

    //新增标签
    $addModal.on("click",function(){
        var initialData = {
            dataArr:{
                status:1
            }
        };
        utils.renderModal('新增标签', template('modalDiv',initialData), function(){
            if($("#visaPassportForm").valid()){
                utils.ajaxSubmit(apis.tag.add,$("#visaPassportForm").serialize(),function(data){
                    hound.success("添加成功","",1000);
                    utils.modal.modal('hide');
                    param.pageNo = 1;
                    loadData();
                })
            }
        }, 'md');
    });

    //页面操作配置
    var operates = {
        //编辑
        edit:function($this){
            var id = $this.closest("tr").attr("data-id");
            var name = $this.closest("tr").find("td").eq(1).text();
            var statusText = $this.closest("tr").find("td").eq(4).text();
            var status = "";
            if(statusText.indexOf("有效")!='-1'){
                status = 1;
            }else if(statusText.indexOf("无效")!='-1'){
                status = -1;
            }else{
                status = "";
            }
            var getByIdData = {
                dataArr:{
                    id:status,
                    name:name,
                    status:status
                }
            };
            utils.renderModal('编辑标签', template('modalDiv', getByIdData), function(){
                if($("#visaPassportForm").valid()) {
                    utils.ajaxSubmit(apis.tag.edit, $("#visaPassportForm").serialize(), function (data) {
                        hound.success("编辑成功", "", 1000);
                        utils.modal.modal('hide');
                        loadData();
                    })
                }
            }, 'md');
        },
        //查看
        look:function($this){
            var id = $this.closest("tr").attr("data-id");
            var name = $this.closest("tr").find("td").eq(1).text();
            var statusText = $this.closest("tr").find("td").eq(4).text();
            var status = "";
            if(statusText.indexOf("有效")!='-1'){
                status = 1;
            }else if(statusText.indexOf("无效")!='-1'){
                status = -1;
            }else{
                status = "";
            }
            var getByIdData = {
                dataArr:{
                    id:status,
                    name:name,
                    status:status
                }
            };
            utils.renderModal('查看标签', template('modalDiv', getByIdData),'', 'md');
            $("#visaPassportForm").append($("fieldset").prop('disabled', true));
        }
    };

    var param = {
        p: 1,
        ps:20,
        status:''
        //title:$("#searchCont").val()
    };

    function loadData() {
        utils.ajaxSubmit(apis.tag.index, param, function (data) {
            //根据状态值显示对应的状态文字 + 显示 有效/无效按钮  置顶/取消置顶按钮
            $.each(data.dataArr,function(i,n){
                n.statusText = consts.status.ordinary[n.status];
                n.materialButtonGroup = comButtons ;
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
    //列表筛选事件绑定
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
        param.title = $("#searchCont").val();
        loadData();
    });
    $('#searchCont').on('keypress',function(event){
        if (event.keyCode == 13) {
            $('#search').click();
        }
    });
});