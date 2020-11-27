<template>
    <div>  
        <!-- 面包屑导航区域 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
     <!-- 卡片视图区域 -->
        <el-card>  
        <!-- 警示区域 -->
         <el-alert
            title="注意：只允许为第三级分类设置相关参数！"
            type="warning"
            show-icon>
        </el-alert>
        <!-- 商品分类-->
         <el-row class=".cat_opt">
            <el-col >
              <span>选择商品分类：</span>
                <el-cascader props.expandTrigger="hover" :options="parentCateList" :props="cascaderProps" v-model="selectedKeys" @change="handleChange">
                </el-cascader>
            </el-col>
         </el-row>
         <!-- tab 页签区域 -->
         <el-tabs v-model="activeName" @tab-click="handleTabClick">
              <!-- 添加动态参数的面板 -->
            <el-tab-pane label="动态参数" name="many">
                <!-- 添加参数的按钮 -->
            <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
             <!-- 动态参数表格 -->           
            <el-table :data="manyTableData" border stripe>
             <!-- 展开行 -->
            <el-table-column type="expand">
                <template  v-slot:default='scope'>
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}} </el-tag> 
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                    >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)" >+ New Tag</el-button>                 
                </template>
                </el-table-column>    
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" >
             <template v-slot:default='scope'>
                 <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                 <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)" >删除</el-button>
                </template>
            </el-table-column>
           
            </el-table>
            </el-tab-pane>
             <!-- 添加静态属性的面板 -->
             <el-tab-pane label="静态参数" name="only">
                    <!-- 动态参数表格 -->           
            <el-table :data="onlyTableData" border stripe>   
            <el-button type="primary" size="mini" :disabled="isBtnDisabled"  @click="addDialogVisible=true">添加参数</el-button>    
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" >
             <template v-slot:default='scope'>
                 <el-button size="mini" type="primary" icon="el-icon-edit" >修改</el-button>
                 <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                </template>
            </el-table-column>
            </el-table>
             </el-tab-pane>
      </el-tabs>   
     </el-card> 
      <!-- 添加动态参数的对话框 -->
        <el-dialog
        :title="'添加' + titleText"
        :visible.sync="addDialogVisible"
        width="30%"
        @close="addDialogClosed"
        >   <!-- 添加分类的表单 -->
        <el-form ref="addFormRef" :model="addForm" label-width="100px" :rules="addFormRules">
            <el-form-item label=动态参数 prop="attr_name">
                <el-input v-model="addForm.attr_name"></el-input>
            </el-form-item>
       </el-form>   
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
        </el-dialog>   
        
         <!-- 编辑参数的对话框 -->
        <el-dialog
        :title="'修改' + titleText"
        :visible.sync="editDialogVisible"
        width="30%"
        @close="editDialogClosed"
        >   <!-- 添加分类的表单 -->
        <el-form ref="editFormRef" :model="editForm" label-width="100px" :rules="editFormRules">
            <el-form-item label=修改参数 prop="attr_name">
                <el-input v-model="editForm.attr_name"></el-input>
            </el-form-item>
       </el-form>   
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary"  @click="editParams">确 定</el-button>
        </span>
        </el-dialog>   
    </div>
</template>>


<script>
export default {
    data () {
        return {
            parentCateList:[],

            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },

            selectedKeys:[],
             // 被激活的页签的名称
            activeName:'many',
            // 动态参数的数据
            manyTableData:[],
            // 静态属性的数据
            onlyTableData:[],
            //添加对话框隐藏或显示
            addDialogVisible:false,
            //修改对话框隐藏或显示
            editDialogVisible:false,
            //添加动态参数的数据
            addForm:{
                attr_name:''
            },
            //修改动态参数的数据
            editForm:{
                 attr_name:''
            },
            

            addFormRules:{
                attr_name:[
                     { required: true, message: '请输入参数', trigger: 'blur' }

                ]
              },
           editFormRules:{
                attr_name:[
                     { required: true, message: '请输入参数', trigger: 'blur' }

                ]
              }



            
        }
    },
    
    created () {
        this.getParams()
    },
    methods: {
        
       // 获取所有的商品分类列表
        async getParams() {
        const { data: res } = await this.$http.get('categories')
        if (res.meta.status !== 200) {
            return this.$message.error('获取商品分类失败！')
        }

        this.parentCateList = res.data

        
        },
        // 级联选择框选中项变化，会触发这个函数
        handleChange(){

            this.getParamsData()
        },

         // tab 页签点击事件的处理函数
          handleTabClick() {
            this.getParamsData()
          },


         // 获取参数的列表数据
                async getParamsData() {
            // 证明选中的不是三级分类
            if (this.selectedKeys.length !== 3) {
                this.selectedKeys = []
                this.manyTableData = []
                this.onlyTableData = []
                return
            }

            // 证明选中的是三级分类
           
            // 根据所选分类的Id，和当前所处的面板，获取对应的参数
            const { data: res } = await this.$http.get(
                `categories/${this.cateId}/attributes`,
                {
                params: { sel: this.activeName }
                }
            )
             
            if (res.meta.status !== 200) {
                return this.$message.error('获取参数列表失败！')
            }
                //字符串转换成数组，并用空格隔开,如果属性是空格，则让数组为空
              res.data.forEach(item=>{
                  item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                    // 控制文本框的显示与隐藏
                    item.inputVisible = false
                    // 文本框中输入的值
                    item.inputVisible = ''
              })



           console.log(res.data)
            if (this.activeName === 'many') {
                this.manyTableData = res.data
            } else {
                this.onlyTableData = res.data
            }
            },

            //添加参数
            addParams(){
                this.$refs.addFormRef.validate(async valid =>{
                    if(!valid) return
             const {data:res} = await this.$http.post(
                 `categories/${this.cateId}/attributes`,
                 {attr_name:this.addForm.attr_name,
                  attr_sel :this.activeName

                 }
              )
              if (res.meta.status !== 201) {
             return this.$message.error('添加参数失败！')
            }
              this.$message.success('添加参数成功！')
               this.addDialogVisible=false
               this.getParams()
                
                })
           
            },

            //展示编辑对话框
          async showEditDialog(attr_id){

                const {data:res}= await this.$http.get(
                    `categories/${this.cateId}/attributes/${attr_id}`,
                    {
                        
                        params:{attr_sel:this.activeName}
                      

                    }
                    )
                     if (res.meta.status !== 200) {
                     return this.$message.error('获取参数失败！')
                     }


                        this.editForm = res.data

                      this.editDialogVisible =true

            },
            // 发送修改对话框请求
            editParams(){
                this.$refs.editFormRef.validate(async valid=>{
                    if(!valid) return
                 const {data:res}= await this.$http.put(
                    `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
                    {
                        attr_name: this.editForm.attr_name,
                        attr_sel:this.activeName
                    }
                    )
                     if (res.meta.status !== 200) {
                     return this.$message.error('获取参数失败！')
                     }
                    this.$message.success('修改参数成功！')
                    this.editDialogVisible = false
                    this.getParams()


                })

            },
            //根据id 删除
           async removeParams(attr_id){
           
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
                    const { data: res } = await this.$http.delete(
                       
                         `categories/${this.cateId}/attributes/${attr_id}`)
                        
                      if (res.meta.status !== 200) {
                        return this.$message.error('删除参数失败！')
                    }
                    console.log(res.data)
                         this.$message.success('删除参数成功！')                    
                         this.getParams()
                },

                    addDialogClosed(){
                        this.$refs.addFormRef.resetFields()
                    },

                    editDialogClosed(){
                        this.$refs.editFormRef.resetFields()
                    },
                    // 删除对应的参数可选项
                handleClose(i,row){
                    row.attr_vals.splice(i,1)
                    this.saveAttrVals(row)
                    
                },
                handleInputConfirm(row){
                    if(row.inputValue.trim()=== 0){
                        row.inputValue =''
                        row.inputVisible = false
                    }
                    //如不为空，后续操作
                    row.attr_vals.push(row.inputValue.trim())
                    row.inputValue =''
                     row.inputVisible = false
                    this.saveAttrVals(row)
                },
                    //文本框内容添加到服务器
                   async saveAttrVals(row){
                        const {data:res} = await this.$http.put(
                            `categories/${this.cateId}/attributes/${row.attr_id}`,
                            {
                                    attr_name: row.attr_name,
                                    attr_sel : row.attr_sel,
                                    attr_vals: row.attr_vals.join('')
                            }) 
                             if (res.meta.status !== 200) {
                                return this.$message.error('修改参数项失败！')
                            }

                            this.$message.success('修改参数项成功！')                       

                    },

                showInput(row){
                        row.inputVisible = true
                        // 让文本框自动获得焦点
                        // $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
                        this.$nextTick(_ => {
                            this.$refs.saveTagInput.$refs.input.focus()
                        })
                        }
                },

   
     
     //计算属性
     computed: {
         isBtnDisabled(){
             if(this.selectedKeys.length !==3){
                return true
             }
             return false
         },
           // 当前选中的三级分类的Id
         cateId(){
             if(this.selectedKeys.length === 3){
               return this.selectedKeys[2]
         }
          return null
         
     },
      // 动态计算标题的文本
     titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
    }
}
</script>>

<style lang="less" scoped>
.cat_opt{
    margin: 15px 0;
}
.input-new-tag{
    width: 120px;
}

</style>>