define("apis", function() {
    return {
        login:{
            index:{
                c:'login',
                a:'index'
            }
        },
        admin:{
            index:{
                c:'admin',
                a:'index'
            },
            add:{
                c:'admin',
                a:'add'
            },
            edit:{
                c:'admin',
                a:'edit'
            }
        },
        joy:{
            index:{
                c:'joy',
                a:'index'
            },
            add:{
                c:'joy',
                a:'add'
            },
            edit:{
                c:'joy',
                a:'edit'
            },
            view:{
                c:'joy',
                a:'view'
            },
            del:{
                c:'joy',
                a:'del'
            }
        },
        tag:{
            index:{
                c:'tag',
                a:'index'
            },
            add:{
                c:'tag',
                a:'add'
            },
            edit:{
                c:'tag',
                a:'edit'
            }
        },
        user:{
            index:{
                c:'user',
                a:'index'
            },
            setOperator:{
                c:'user',
                a:'setOperator'
            }
        }
    }
});