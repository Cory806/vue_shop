<template>
    <el-container class="home-container">
         <!-- 头部区域 -->
  <el-header>
    <div><img src='../assets/1.jpg' class="img1">
         <span>肥猪电商管理系统</span>
     </div>
  <el-button type="info" @click="back">退出</el-button>
  </el-header>
   <!-- 页面主体区域 -->
  <el-container>
         <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px':'200px'">
      <!-- 按钮 -->
      <div class="togger-button" @click="toggerCollapse">|||</div>
      <!-- 侧边栏菜单区域 -->
       <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse='isCollapse' :collapse-transition='false' router :default-active='activePath'>
       
    <!-- 一级菜单 -->
    <!-- num+字符串=一个字符串 -->
      <el-submenu :index="item.id + ''" v-for="item in menulsit" :key='item.id'>
     
        <template slot="title">
          <i :class="iconsObj[item.id]"></i>
      
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key='subItem.id' @click="saveNavPath('/' + subItem.path)">

          <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{subItem.authName}}</span>
        </template>
        </el-menu-item> 
      </el-submenu>
    </el-menu>
    </el-aside>
      <!-- 右侧内容主体 -->   
    <el-main><router-view></router-view></el-main>
  </el-container>
   
</el-container>
 
</template>


<script>
export default {
    data(){
        return{
          //左侧菜单数据
            menulsit:[],
            iconsObj: {
            '125': 'iconfont icon-user',
            '103': 'iconfont icon-tijikongjian',
            '101': 'iconfont icon-shangpin',
            '102': 'iconfont icon-danju',
            '145': 'iconfont icon-baobiao'
            },
            //是否折叠
            isCollapse:false,
             // 被激活的链接地址
             activePath:''
        }
    },
    created () {
      //获取所有左侧菜单
      this.getMenuList()
      this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods: {
                back(){
                    //消除token
                    window.sessionStorage.clear()
                    this.$router.push('/login')
                },
                getMenuList() {
                  this.$http.get('menus').then(res =>{
                    if(res.data.meta.status !==200)
                        return this.$meassage.error(res.data.meta.msg);
                          this.menulsit = res.data.data;
                       // console.log(res)
                       console.log(this.menulsit)
                    })
                },
                toggerCollapse(){
                          this.isCollapse= !this.isCollapse
                },
                saveNavPath(activePath){
                  //存到sessionstorge当中 activePath键 activePath值
                  window.sessionStorage.setItem('activePath',activePath)
                   this.activePath = activePath
                }
            }
}
</script>>



<style lang="less" scoped>
.home-container{
     height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left:0px;
  color:white;
  font-size: 20px;
      .img1{
        width: 61px;
        height: 56px;
      }
      >div{
        display: flex;
        align-items: center;
        span{
          margin-left: 15px;
        }
      }

}
.el-aside {
  background-color: #333744;
  .el-menu{
    border-right: none;
  }
  .togger-button{
    text-align: center;
    color:#fff;
    background:  #4a5064;
    font-size: 10px;
    line-height: 24px;
    letter-spacing: 0.2em;
    cursor:pointer;
  }
}
.el-main {
  background-color: #eaedf1;
}


</style>