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
                '-1':'<span style="color:red">无效</span>'
            },
            cardType:{
                '1':'<span style="color:green"> 纯文字</span>',
                '2':'<span style="color:darkorange"> 图文</span>',
                '3':'<span style="color:blue"> 视频</span>'
            },
            imageType:{
                '1':'<span style="color:orange"> 横板</span>',
                '2':'<span style="color:green"> 竖版</span>'
            }
        }
    }
});