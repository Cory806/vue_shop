<template>
  <div>
   <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
             <!-- 添加角色按钮区域 -->
                <el-row>
                    <el-col>
                    <el-button type="primary">添加角色</el-button>
                    </el-col>
                </el-row>
            <!-- 角色列表区域 -->
            <el-table :data="rolelist" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!-- 每一行有下边线，如索引为0，加上边线 -->
                    <el-row :class="['bdbottom',i1 ===0 ? 'bdtop' : '' ,'vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                       <!-- 一层 -->
                        <el-col :span="5">
                                <el-tag closable @close="removeTag(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二、三层 -->
                            <el-col :span="19" >
                          <el-row :class="[i2 === 0 ? '' : 'bdtop' ,'vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id" >       

                            <!--二层  -->
                                <el-col :span="6">
                                    <el-tag type="success" closable @close="removeTag(scope.row,item2.id)">{{item2.authName}}</el-tag> 
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                            <!--三层  -->
                            <el-col :span="18">
                                 <el-tag type="warning"  closable @close="removeTag(scope.row,item3.id)" v-for="(item3,i3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag> 
                            </el-col>
                         </el-row>
                        </el-col>
                    </el-row>
                    </template>
                </el-table-column>
                   <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <!-- 编辑按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                    <!-- 分配权限 -->
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRight(scope.row)">分配权限</el-button>
              
              </template>            
            </el-table-column>
             </el-table>
        </el-card>
        <!-- 分配权限的弹框 -->
        <el-dialog
            title="提示"
            :visible.sync="rightVisible"
            width="30%"
            @click="setRightListClose"
            >
            <el-tree :data="rightlist" :props="treeProps" show-checkbox node-key="id" default-expand-all
                :default-checked-keys="defkeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="rightVisible= false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>

  </div>
</template>

<script>
export default {
    data () {
        return {
         // 所有角色列表数据
            rolelist:[],
            // 所有权限的数据
            rightlist: [],
        // 树形控件的属性绑定对象
            treeProps:{
                label:'authName',
                children:'children'
            } ,

            rightVisible:false,
      // 当前即将分配权限的角色id
            roleid:'',

      //默认勾选
         defkeys:[]

        }
    },
    created () {
        this.getRoleList()
    },
    methods: {
                        getRoleList(){
                            this.$http.get('roles').then(
                                res=>{
                                    if(res.data.meta.status !== 200)
                                    return this.$message.error('获取角色列表失败')
                                    this.rolelist = res.data.data
                                })
                        },
                                    async removeTag(role,rightId){
                            const confirmResult = await this.$confirm(
                        '此操作将永久删除该用户, 是否继续?',
                        '提示',
                        {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }
                    ).catch(err => err)

                    // 如果用户确认删除，则返回值为字符串 confirm
                    // 如果用户取消了删除，则返回值为字符串 cancel
                    // console.log(confirmResult)
                    if (confirmResult !== 'confirm') {
                        return this.$message.info('取消了删除！')
                    }
                    this.$http.delete( `roles/${role.id}/rights/${rightId}`).then(res=>{
                    
                            if (res.data.meta.status !== 200) {
                        return this.$message.error('删除用户失败！')
                    }
                        role.children = res.data.data
                        //  console.log(res)
                })
             },

                    showRight(role){
                         this.roleid = role.id 
                        this.$http.get('rights/tree').then(res=>{
                         if (res.data.meta.status !== 200) 
                        return this.$message.error('获取用户失败！')
                            this.rightlist = res.data.data                          
                             // 递归获取三级节点的Id
                             this.getLeafKeys(role, this.defkeys)
                             this.rightVisible = true
                        })
                       
                    },
                      // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
                        //节点，数组，如果节点没有children则是第三节点
                        getLeafKeys(node,arr){
                            if(!node.children){
                                return arr.push(node.id);
                            }
                            //二轮查找节点，遍历数组
                            node.children.forEach(item=> this.getLeafKeys(item,arr))

                        },
                         // 监听分配权限对话框的关闭事件
                        setRightListClose(){
                            this.defkeys=[]
                        },
                        // 点击为角色分配权限
                        //获得选中和半选中的id,合并，数组的形式发送POST请求
                        allotRights(){
                            const keys = [
                                ...this.$refs.treeRef.getCheckedKeys(),
                                ...this.$refs.treeRef.getHalfCheckedKeys()
                            ]
                            
                          const idStr = keys.join(',')

                            this.$http.post(`roles/${this.roleid}/rights`, {rids:idStr}).then(res=>{
                                if (res.data.meta.status !== 200) {
                                  return this.$message.error('分配权限失败！')
                               }
                                this.$message.success('分配权限成功！')
                                this.getRoleList()
                                this.rightVisible = false
                            })

                        }

                        
                       
        
    }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
