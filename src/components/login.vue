<template>
        <div class="login-container">
            <div class="login-box">
                <!-- 头像区域 -->
                <div class='image-box'>
                    <img src="../assets/logo.png" alt="">
                </div>
                <!-- 登录表单区 -->
                <!-- ref 引用 loginFormRef属性值就是表单的引用对象 -->
                <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login-form">
                 
                <!-- 用户名 -->
               
                    <el-form-item prop="username">
                        <el-input v-model="loginForm.username" prefix-icon='el-icon-s-custom'></el-input>
                    </el-form-item>
                   
                <!-- 密码 -->
               
                    <el-form-item  prop="password">
                        <el-input v-model="loginForm.password" prefix-icon='el-icon-lock' type="password"></el-input>
                            
                    </el-form-item>
                   
                <!-- 按钮区域 -->
                
                    <el-form-item class='btns'>
                         <el-button type="primary" @click="preLogin">登录</el-button>
                         <el-button type="info" @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-form>                
            </div>
        </div> 
</template>

<script>
    export default {
        data(){
            return{
                // 这是登录表单的数据绑定对象
                loginForm:{
                username: 'admin',
                password: '123456'
            },
                // 这是表单的验证规则对象
                loginFormRules:{
                    // 验证用户名是否合法
                       
                     username: [
                        { required: true, message: '请输入登录名称', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                        ],
                      password: [
                        { required: true, message: '请输入登录密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                     ]
                    
                }
               
          }
            
         },
          methods: {
               // 点击重置按钮，重置登录表单，resetFields方法需要表单的实例对象调用
                    resetForm(){
                        this.$refs.loginFormRef.resetFields()
                    },
                   preLogin(){
                        //validate预验证 接受一个回调函数，回调的第一个形参是一个布尔值，如果验证合法则返回true，否则false
                        this.$refs.loginFormRef.validate(vaild =>{
                            if (!vaild) return 
                            //ture 发送请求
                            this.$http.post('login',{
                                username: this.loginForm.username,
                                password: this.loginForm.password
                            })
                            .then((res)=>{ 
                                if(res.data.meta.status != 200)
                                 
                               return this.$message.error('登录失败！');
                                
                                   this.$message.success('登录成功')
                                  
                                    // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
                                    //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
                                    //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
                                    window.sessionStorage.setItem('token',res.data.data.token)
                                    // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
                                    this.$router.push('/home')
                                    })
                                
                                
                                
                                   
                                   
                         

                       
                    
                })
          }
        }
    }
      

</script>>

<style lang="less" scoped>
 .login-container{
     background:#2b4b6b;
     height: 100%;
 }
 .login-box{
     width: 450px;
     height: 300px;
     background-color:#fff;
     border-radius: 3px;
     position: absolute;
     left: 50%;
     top:50%;
     transform: translate(-50%,-50%);
    .image-box{
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #dddddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background: #ffffff;
        img{
            width:100%;
            height: 100%;
            border-radius: 50%;
            background: #eee;
            }
     } 
 
        
        .login-form {
            position: absolute;
            bottom: 0;
            width: 100%;
            padding: 0 20px;
            // 表单默认content box
            box-sizing: border-box;
            }

        .btns {
                // 两个按钮去到最右边
            display: flex;
            justify-content: flex-end;
            }

 }

 

</style>