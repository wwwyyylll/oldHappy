require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var searchlabel = $(".searchlabel");
    var $sampleTable = $('#sampleTable');

    searchlabel.on("click",function(){
        $("#selectsearchlabel").text($(this).text());
        $("#searchCont").val("");
        $("#searchCont").attr("data-id",'');
    });
    $(document).on("click",function(){
        $('.ability-list').remove();
    });

    //页面操作配置
    var operates = {
        getTaobaoPwd:function(){
            utils.ajaxSubmit(apis.tool.getTaobaoSignUpPwd, '', function (data) {
                $("#pwd").html(data.pwd);
                $("#updateTime").val(data.updateTime);
            });
        },
        saveTaobaoPwd:function($this){
            hound.confirm('确认更新签约淘宝淘口令吗?', '', function () {
                utils.ajaxSubmit(apis.tool.saveTaobaoSignUpPwd, $("#taobaoPwd").serialize(), function (data) {
                    hound.success("更新成功","",1000);
                    operates.getTaobaoPwd();
                });
            });
        }
    };

    $("#headerTab1").on("click",function(){
        $("#tabContent1").show();
        $("#tabContent2").hide();
        $(this).css({color:"orange"});
        $(this).closest("li").siblings().find("a").css({color:"#555555"});
    });
    $("#headerTab2").on("click",function(){
        $("#tabContent1").hide();
        $("#tabContent2").show();
        operates.getTaobaoPwd();
        $(this).css({color:"orange"});
        $(this).closest("li").siblings().find("a").css({color:"#555555"});
    });

    var param = {
       materialId:''
    };

    function loadData() {
        utils.ajaxSubmit(apis.tool.searchTbOptimusByMaterialId, param, function (data) {
            var json = JSON.stringify(data, undefined, 2);
            $sampleTable.html(json);
            $sampleTable.show();
        });
    }
    utils.bindList($(document), operates);
    var listDropDown = {
        statusText:'订单状态'
    };
    $sampleTable.on('click', '#dropStatusOptions a[data-id]', function () {
        param.status = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.statusText = "订单状态" : listDropDown.statusText = $(this).text();
        loadData();
    });
    $("#search").on("click",function(){
        //判断是什么条件搜索
        var selectSearchLabel = $("#selectsearchlabel").text();
        if(selectSearchLabel=="物料ID"){
            if($("#searchCont").val()!=''){
                param.materialId = $("#searchCont").val();
                loadData();
            }else{
                hound.error("请填写物料ID");
            }
        }
    });
    $('#searchCont').on('keypress',function(event){
        if (event.keyCode == 13) {
            $('#search').click();
        }
    });
});