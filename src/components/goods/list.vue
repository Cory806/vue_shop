<template>
    <div> 
        
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

    <!-- 卡片视图区域 -->
        <el-card>
             <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
            <el-col :span="8">
                <el-input placeholder="请输入内容" v-model="queryInfo.query"  clearable @clear="getGoodList">
                <el-button slot="append" icon="el-icon-search" @click="getGoodList"></el-button>
                </el-input>
            </el-col>
            <el-col :span="8">
                <el-button type="primary" icon="el-icon-search" @click="goAddPage" >添加商品</el-button>
            </el-col>
            </el-row>
            <!-- 商品列表 -->
             <el-table :data="list" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="商品名称" prop="goods_name"></el-table-column>
            <el-table-column label="商品价格" prop="goods_price"></el-table-column>
            <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
            <el-table-column label="创建时间" prop="add_time">
             <template slot-scope="scope">
                 {{scope.row.add_time | dateFormat}}
             </template>
          </el-table-column>
            <el-table-column label="操作" width="180px">
              <template v-slot:default='scope'>
                <!-- 修改按钮 -->
                <el-button type="primary" icon="el-icon-edit" size="mini" ></el-button>
               <!-- 删除按钮 -->
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(scope.row.id)"></el-button>  
              </template>            
            </el-table-column>
        </el-table>
          <!-- 页码数 -->
         <el-pagination
            @size-change="handleSizeChange" 
            @current-change="handleCurrentChange" 
            :current-page="queryInfo.pagenum" 
            :page-sizes="[3, 5, 10, 15]" 
            :page-size="queryInfo.pagesize" 
            layout="total, sizes, prev, pager, next, jumper" 
            :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>>


<script>
export default {
    data () {
        return {
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:5               
            },
            list:[],
            total:0
        }
    },
    created () {
        this.getGoodList()
    },
    methods: {
       async getGoodList(){
            const {data:res}= await this.$http.get('/goods',{params:this.queryInfo})
                  if(res.meta.status !==200){
                      return this.$message.error('获取商品列表失败')
                  }
                this.list = res.data.goods
                this.total = res.data.total
            },

            //每页显示条数
            handleSizeChange(newSize){
                this.queryInfo.pagesize =newSize
                this.getGoodList()
            },
            //当前页码 
            handleCurrentChange(newPage){
                this.queryInfo.pagenum =newPage
                this.getGoodList()
            },
           goAddPage(){
               this.$router.push('/goods/add')
           },
           //删除
           deleteGoods(id){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then((res) => {
                    this.$http.delete('goods/ ' + id ).then(res=>{
                            if(res.data.meta.status !== 200){
                                this.$message.error('删除失败')
                            }
                            this.$message.success('删除成功')
                             this.getGoodList()

                    }).catch(err => {
                        this.$message.error('删除失败')
                    })
                     

                    }).catch(err => err)
                        
                    
    
        }
    }
}
</script>>

<style lang="less" scoped>



</style>