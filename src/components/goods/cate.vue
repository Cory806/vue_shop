<template>
    <div>
         <!-- 面包屑导航区域 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
     <!-- 添加按钮区域 -->
                <el-row>
                    <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                    </el-col>
                </el-row>
      <!-- 表格 -->
        <tree-table class="table" :data="cates" :columns="columns" :expand-type="false"
         :selection-type="false" :show-index="true" :border="true" >
      <!-- 是否有效 -->
         <template slot="isok" slot-scope="scope">
             <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
             <i class="el-icon-error" v-else style= 'color:red'></i>
         </template>   
      <!-- 排序 -->
        <template slot="ispaixu" slot-scope="scope">
            <el-tag v-if='scope.row.cat_level === 0' >一级</el-tag>
            <el-tag v-else-if='scope.row.cat_level === 1' type="success">二级</el-tag>
            <el-tag v-else type="info">三级</el-tag>
         </template>  
         <!-- 操作 -->
        <template slot="iscaozuo" slot-scope="scope">
             <el-button type="primary">编辑</el-button>
             <el-button type="danger">删除</el-button>
         </template>  
        
        </tree-table>
          <!-- 页码数 -->
         <el-pagination
            @size-change="handleSizeChange" 
            @current-change="handleCurrentChange" 
            :current-page="querInfo.pagenum" 
            :page-sizes="[3, 5, 10, 15]" 
            :page-size="querInfo.pagesize" 
            layout="total, sizes, prev, pager, next, jumper" 
            :total="total">
            </el-pagination>
        </el-card>   
        <!-- 添加分类的对话框 -->
        <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="30%"
        @close= addCateDialogClosed
        >   <!-- 添加分类的表单 -->
        <el-form ref="addCateFormRef" :model="addCateForm" label-width="100px" :rules="addCateFormRules">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
         <!-- options 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
            <el-form-item label="父级分类">
               <el-cascader props.expandTrigger="hover" :options="parentCateList" :props="cascaderProps" v-model="selectedKeys" @change="parentCateChanged" clearable props.checkStrictly>
          </el-cascader>
        </el-form-item>   
       </el-form>   
        <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
        </el-dialog>
    </div>

</template>>


<script>
export default {
    data () {
        return {
             querInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 5
                },
            cates:[],
            
            total:0,

           columns: [
            {
                label: "分类名称",
                prop: "cat_name"
            },
            {
                label: "是否有效",
                // 表示，将当前列定义为模板列
                 type: 'template',
                  // 表示当前这一列使用模板名称
                 template: 'isok'
            },
            {
                label: "排序",
                // 表示，将当前列定义为模板列
                 type: 'template',
                  // 表示当前这一列使用模板名称
                 template: 'ispaixu'

            },
            {
                label: "排序",
                // 表示，将当前列定义为模板列
                 type: 'template',
                  // 表示当前这一列使用模板名称
                 template: 'iscaozuo'

            }
           ],
           addCateDialogVisible: false,
           
           // 添加分类的表单数据对象
                addCateForm: {
                    // 将要添加的分类的名称
                    cat_name: '',
                    // 父级分类的Id
                    cat_pid: 0,
                    // 分类的等级，默认要添加的是1级分类
                    cat_level: 0
      },
           addCateFormRules:{
              cat_name: [
                  { required: true, message: '请输入分类名', trigger: 'blur' }
                ]
           },
            // 父级分类的列表
            parentCateList:[],
        // 指定级联选择器的配置对象
          cascaderProps:{
               value:'cat_id',
               label:'cat_name',
               children:'children'
           },
            // 选中的父级分类的Id数组
           selectedKeys:[]
        }
    },
    created () {
        this.getCateList()
    },
    methods: {
       async getCateList() {
                const { data: res } = await this.$http.get('categories', { params: this.querInfo
                })

                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品分类失败！')
                }

                console.log(res.data)
                // 把数据列表，赋值给 catelist
                this.cates = res.data.result
                // 为总数据条数赋值
                this.total = res.data.total
       },

            handleSizeChange(newSize){
                this.querInfo.pagesize = newSize
                 this.getCateList()
            },
            
            handleCurrentChange(newPage){
                this.querInfo.pagenum =newPage
                 this.getCateList()
            },
            // 点击按钮，展示添加分类的对话框
            showAddCateDialog(){
                this.getParentCateList()
                this.addCateDialogVisible= true
            },
              // 获取父级分类的数据列表
             async getParentCateList() {
                    const { data: res } = await this.$http.get('categories', {
                        params: { type: 2 }
                    })

                    if (res.meta.status !== 200) {
                        return this.$message.error('获取父级分类数据失败！')
                    }

                    
                    this.parentCateList = res.data
                    console.log(res.data)
             },

              // 选择项发生变化触发这个函数
            parentCateChanged(){
             // 如果 selectedKeys(id) 数组中的 length 大于0，(有id 证明有选中)证明选中的父级分类
             // 反之，就说明没有选中任何父级分类
             if(this.selectedKeys.length>0) {
                   // 父级分类的Id = 最后的id 
                   this.addCateForm.cat_pid = this.selectedKeys[
                       this.selectedKeys.length - 1
                   ]
                   // 为当前分类的等级赋值
                   this.addCateForm.cat_level = this.selectedKeys.length
                   return 
             }else {
                  // 父级分类的Id
                  this.addCateForm.cat_pid = 0
                   // 为当前分类的等级赋值
                   this.addCateForm.cat_level = 0
             }

            },
             // 点击按钮，添加新的分类
                addCate(){
                    this.$refs.addCateFormRef.validate(async valid =>{
                        if(!valid) return
                        const {data:res} = await this.$http.post( 'categories',
                      this.addCateForm)

                           if (res.meta.status !== 201) {
                        return this.$message.error('添加分类失败！')
                        }

                        this.$message.success('添加分类成功！')
                        this.getCateList()
                        this.addCateDialogVisible = false


                    })

                },
                 // 监听对话框的关闭事件，重置表单数据
                addCateDialogClosed(){
                    this.$refs.addCateFormRef.resetFields()
                     this.selectedKeys = []
                    this.addCateForm.cat_level = 0
                    this.addCateForm.cat_pid = 0
                }



        }
    
}
</script>>

<style lang="less" scoped>
.table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}

</style>>