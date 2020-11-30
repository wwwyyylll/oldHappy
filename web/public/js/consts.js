define("consts", function() {
    return {
        host: '@@HOST',
        apiBase: "@@API",
        viewBase: '@@HOST@@VIEW',
        param: {
            linkUserName:'noteConsole',
            linkPassword:'dusid@!#$erff2324fdscs@3!@#$%@!%^$@lw@^%',
            signature:'e81ae1bafdf72b4b2b1a73ce4831e84a'
        },
        status:{
            ordinary:{
                '1':'<span style="color:green">有效</span>',
                '2':'<span style="color:red">无效</span>'
            },
            ordinary1:{
                '1':'【有效】',
                '2':'【无效】'
            },
            goodsStatus:{
                '1':'<span style="color:green">上架</span>',
                '2':'<span style="color:red">下架</span>',
                '3':'<span style="color:orange">已删除</span>'
            },
            orderStatus:{
                '1':'<span style="color:orange">待支付</span>',
                '2':'<span style="color:green">已支付</span>',
                '3':'<span style="color:red">已发货</span>',
                '4':'<span style="color:green">已完成</span>',
                '5':'<span style="color:red">已关闭</span>',
                '6':'<span style="color:gray">已取消</span>',
                '7':'<span style="color:green">提交供应商</span>',
                '8':'<span style="color:red">申请退款</span>'
            },
            taobaoOrderStatus:{
                '1':'<span style="color:orange">已付款</span>',
                '2':'<span style="color:green">已收货</span>',
                '3':'<span style="color:green">已结算</span>',
                '4':'<span style="color:red">已失效</span>',
                '5':'<span style="color:red">已维权退单</span>'
            },
            orderLogStatus:{
                '1':'<span style="color:orange">待支付</span>',
                '2':'<span style="color:green">已支付</span>',
                '3':'<span style="color:red">已发货</span>',
                '4':'<span style="color:green">已完成</span>',
                '5':'<span style="color:red">已退款</span>',
                '6':'<span style="color:gray">已取消</span>',
                '7':'<span style="color:green">提交供应商</span>',
                '8':'<span style="color:red">申请退款</span>'
            },
            userType:{
                '1':'用户',
                '2':'管理员',
                '3':'系统'
            },
            user:{
                '1':'<span style="color:green">允许登录</span>',
                '2':'<span style="color:red">禁止登录</span>'
            },
            userSource:{
                '1':'<span style="color:green">微信</span>',
                '2':'<span style="color:orange">机器人</span>'
            },
            userDetailSource:{
                '1':'微信',
                '2':'机器人'
            },
            goods:{
                '1':'<span style="color:green">上架</span>',
                '2':'<span style="color:red">下架</span>'
            },
            goodsText:{
                '1':'有效',
                '2':'无效'
            },
            source:{
                '1':'<span style="color:red">京东</span>',
                '2':'<span style="color:orange">淘宝</span>'
            },
            shopSource:{
                '1':'<span style="color:red">京东</span>',
                '2':'<span style="color:orange">淘宝</span>'
            },
            shopType:{
                'B':'<span style="color:red">天猫</span>',
                'C':'<span style="color:orange">淘宝</span>'
            },
            message:{
                '1':'<span style="color:orange">待回复</span>',
                '2':'<span style="color:green">已回复</span>'
            },
            isBind:{
                '1':'<span style="color:green">是</span>',
                '2':'<span style="color:red">否</span>'
            },
            isBind1:{
                '1':'是',
                '2':'否'
            },
            syncWay:{
                '1':'<span style="color:green">手动</span>',
                '2':'<span style="color:orange">自动</span>'
            },
            expectAnchorVote:{
                '1':'<span style="color:orange">待审核</span>',
                '2':'<span style="color:green">审核通过</span>',
                '3':'<span style="color:hotpink">已收录</span>',
                '4':'<span style="color:red">审核不通过</span>'
            },
            haveCoupon:{
                '-1':'',
                '1':'<span style="color:green">有</span>',
                '2':'<span style="color:red">无</span>'
            },
            anchorType:{
                '1':'<span style="color:green">带货平台</span>',
                '2':'<span style="color:orange">主播性质</span>'
            },
            guestBook:{
                '1':'<span style="color:red">待回复</span>',
                '2':'<span style="color:green">已回复</span>'
            },
            isRead:{
                '1':'<span style="color:green">已读</span>',
                '2':'<span style="color:red">未读</span>'
            },
            ranking:{
                '1':'<span style="color:red">抖音</span>',
                '2':'<span style="color:orange">淘宝</span>'
            },
            indexPosition:{
                '1':'<span style="color:red">【左一】</span>',
                '3':'<span style="color:orange">【左二】</span>',
                '2':'<span style="color:green">【右一】</span>',
                '4':'<span style="color:blue">【右二】</span>'
            },
            level:{
                '1':'<span style="color:orange">初级</span>',
                '2':'<span style="color:#ea5664">中级</span>',
                '3':'<span style="color:green">高级</span>'
            },
            accountType:{
                '1':'<span style="color:green">微信</span>',
                '2':'<span style="color:blue">支付宝</span>'
            },
            accountTypeShow:{
                '1':'<span style="color:green">【微信账号】</span>',
                '2':'<span style="color:blue">【支付宝账号】</span>'
            },
            userStatus:{
                '1':'<span style="color:orange">等待打款</span>',
                '2':'<span style="color:green">已打款</span>',
                '3':'<span style="color:red">已驳回</span>'
            },
            taobaoBindStatus:{
                '1':'<span style="color:orange">等待绑定</span>',
                '2':'<span style="color:green">已绑定</span>',
                '3':'<span style="color:red">已驳回</span>'
            },
            userWxMessageStatus:{
                '1':'<span style="color:orange">待处理</span>',
                '2':'<span style="color:green">已签约</span>',
                '3':'<span style="color:red">无需处理</span>'
            },
            userRecommendStatus:{
                '1':'<span style="color:orange">待审核</span>',
                '2':'<span style="color:green">审核通过</span>',
                '3':'<span style="color:red">已驳回</span>'
            },
            commissionType:{
                '1':'奖励佣金',
                '2':'推广佣金',
                '3':'销售佣金',
                '4':'商品抵扣',
                '5':'订单取消',
                '6':'现金券'
            },
            taobaoCommissionType:{
                '1':'返佣收益',
                '2':'推广佣金',
                '3':'大神卡佣金'
            },
            fansType:{
                '1':'<span style="color:orange">专属粉丝</span>',
                '2':'<span style="color:gray">普通粉丝</span>'
            },
            buyType:{
                '1':'<span style="color:green">购买</span>',
                '2':'<span style="color:red">退单</span>'
            },
            buyType1:{
                '1':'<span style="color:green"> -购买</span>',
                '2':'<span style="color:red"> -退单</span>'
            },
            settlementStatus:{
                '1':'<span style="color:green"> 已结算</span>',
                '2':'<span style="color:red"> 未结算</span>',
                '4':'<span style="color:gray"> 已退单</span>'
            },
            robotRoleStatus:{
                '1':'<span style="color:orange"> 未启动</span>',
                '2':'<span style="color:green"> 已启动</span>',
                '3':'<span style="color:red"> 已删除</span>'
            },
            cashCouponStatus:{
                '1':'<span style="color:orange"> 未启用</span>',
                '2':'<span style="color:green"> 启用</span>',
                '3':'<span style="color:red"> 停止</span>',
                '4':'<span style="color:red"> 删除</span>'
            },
            orderSettlementStatus:{
                '1':'已结算',
                '2':'未结算'
            },
            position:{
                '1':'<span style="color:green"> 头部</span>',
                '2':'<span style="color:darkorange"> 左下角</span>',
                '3':'<span style="color:blue"> 头二</span>'
            },
            imageType:{
                '1':'<span style="color:orange"> 内测</span>',
                '2':'<span style="color:green"> 供会员使用</span>'
            },
            taskType:{
                '1':'加入淘宝返佣计划',
                '2':'进行淘宝账号绑定',
                '3':'购买1次返佣商品',
                '4':'购买5次返佣商品',
                '5':'购买15次返佣商品',
                '6':'邀请1位朋友入驻老乐惠',
                '7':'邀请5位朋友入驻老乐惠',
                '8':'邀请15位朋友入驻老乐惠',
                '9':'购买大神返利卡',
                '10':'订阅公众号',
                '11':'填写邀请人',
                '12':'连续签到6天',
                '13':'连续签到15天'
            },
            isCompletedType:{
                '1':'<span style="color:green">已完成</span>',
                '2':'<span style="color:red">未完成</span>'
            },
            isCompletedType1:{
                '1':'<span style="color:green">已购买</span>',
                '2':'<span style="color:red">未购买</span>'
            },
            recommendType:{
                '1':'<span style="color:green">视频</span>',
                '2':'<span style="color:orange">物料商品</span>'
            },
            articleType:{
                '1':'<span style="color:green">主播带货日期</span>',
                '2':'<span style="color:orange">排行榜</span>',
                '3':'<span style="color:blueviolet">主题带货</span>'
            },
            articleType1:{
                '1':'主播带货日期',
                '2':'排行榜',
                '3':'主题带货'
            },
            recommendSource:{
                '2':'<span style="color:green">后台</span>',
                '1':'<span style="color:orange">H5</span>'
            },
            expressStatus:{
                '1':'<span style="color:red">待发货</span>',
                '2':'<span style="color:orange">已发货</span>',
                '3':'<span style="color:green">已收货</span>'
            },
            groupStatus:{
                '1':'<span style="color:orange">进行中</span>',
                '2':'<span style="color:green">已完成</span>',
                '3':'<span style="color:red">失败</span>'
            },
            groupType:{
                '1':'<span style="color:orange">机器人</span>',
                '2':'<span style="color:green">自然人</span>'
            }
        }
    }
});