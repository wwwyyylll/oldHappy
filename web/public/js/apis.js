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
            },
            upload:{
                c:'joy',
                a:'upload'
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
        },
        greeting:{
            index:{
                c:'greeting',
                a:'index'
            },
            add:{
                c:'greeting',
                a:'add'
            },
            edit:{
                c:'greeting',
                a:'edit'
            },
            view:{
                c:'greeting',
                a:'view'
            }
        },
        blessing:{
            index:{
                c:'blessing',
                a:'index'
            },
            add:{
                c:'blessing',
                a:'add'
            },
            edit:{
                c:'blessing',
                a:'edit'
            },
            view:{
                c:'blessing',
                a:'view'
            },
            findByTitle:{
                c:'blessing',
                a:'findByTitle'
            }
        }
    }
});