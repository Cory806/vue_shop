<template>
    <div>

          <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
    
        <!-- 警示 -->
    <el-card>
         <el-alert  title="添加商品信息" type="info" show-icon center> </el-alert>
         <!-- 进度条 -->
         <!-- :active 绑定的是数值，把字符串转数值，在后面减0 -->
            <el-steps :space="200" :active="activeName - 0" finish-status="success" align-center>
             <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
             <!-- tab栏区域 -->
             <el-form :model="addForm" :rules="addRules" ref="addRuleForm" label-width="100px" label-position='top'>
              <el-tabs :tab-position="'left'" v-model="activeName" :before-leave='beforeLeft' @tab-click='tabChange'>
                <el-tab-pane label="基本信息" name="0">
                    <el-form-item label="商品名称" prop="goods_name">
                        <el-input v-model="addForm.goods_name"></el-input>
                    </el-form-item>
                     <el-form-item label="商品价格" prop="goods_price">
                        <el-input v-model="addForm.goods_price"></el-input>
                    </el-form-item>
                     <el-form-item label="商品重量" prop="goods_weight">
                        <el-input v-model="addForm.goods_weight"></el-input>
                    </el-form-item>
                     <el-form-item label="商品数量" prop="goods_number">
                        <el-input v-model="addForm.goods_number"></el-input>
                    </el-form-item>
                     <el-form-item label="商品分类" prop="goods_cat">
                        <el-cascader
                            v-model="addForm.goods_cat"
                            :options="addGoodsCat"
                            :props="cateProps"
                            ></el-cascader>
                    </el-form-item>     
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="1">
                 <!-- 渲染表单的Item项 -->
                   <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                          <el-checkbox-group v-model="item.attr_vals">
                            <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
                          </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                 <el-tab-pane label="商品属性" name="2">
                      <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                        <el-input v-model="item.attr_vals"></el-input>
                     </el-form-item>
                 </el-tab-pane>
                <el-tab-pane label="商品图片" name="4"><el-upload
                    class="upload-demo"
                    :action="uploadURL"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    list-type="picture" :headers="headerObj" :on-success="handelSuccess">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                    </el-tab-pane>
                <el-tab-pane label="商品内容" name="5">
                    <!-- 富文本编辑器组件 -->
                    <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                     <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
                </el-tab-pane>
            </el-tabs>
             </el-form>
     </el-card>
     <!-- 图片预览对话框 -->
            <el-dialog
            title="图片预览"
            :visible.sync="picVisible"
            width="30%"
            >
            <img :src="previewFile" alt="" class="previewImg">
        </el-dialog>
    </div>
</template>>


<script>
import _ from 'lodash'

export default {
    data () {
        return {
            tabPosition: 'left',
           
           activeName:'0',
          // 添加商品的表单数据对象
           addForm:{
               goods_name:'',
               goods_price:0,
               goods_weight:0,
               goods_number:0,
               goods_cat:[],
               pics:[],
               // 商品的详情描述
               goods_introduce: '',
               //动态，静态参数
               attrs:[]
           },
            // 商品分类列表
           addGoodsCat:[],
            //动态参数
            manyTableData:[],
            //静态
            onlyTableData:[],

            cateProps:{
                value:'cat_id',
                label:'cat_name',
                children: 'children'
            },
            //上传图片的URL
            uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',

             // 图片上传组件的headers请求头对象
            headerObj:{
                 Authorization:window.sessionStorage.getItem('token')

            },
            //
            picVisible:false,

            //预览路径
            previewFile:'',

           addRules:{
                goods_name:[ { required: true, message: '请输入商品名称', trigger: 'blur' }],
                goods_price:[ { required: true, message: '请输入商品价格', trigger: 'blur' }],
                goods_weight:[ { required: true, message: '请输入商品重量', trigger: 'blur' }],
                goods_number:[ { required: true, message: '请输入商品数量', trigger: 'blur' }],
                goods_cat:[ { required: true, message: '请输入商品数量', trigger: 'blur' }]
           },
          
          }
         },
         created () {
             this.getAddList()
         },
        methods: {
                //获取级联选择器数据
                async getAddList(){
                    const {data:res} = await this.$http.get('categories')
                        if (res.meta.status !== 200) {
                      return this.$message.error('获取商品分类数据失败！')
                   }

                        this.addGoodsCat = res.data
                        console.log(this.addGoodsCat)
                },
                //active进入的标签，old tab切换限制
                beforeLeft(activeName, oldActiveName){
                   if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
                       this.$message.error('请选择商品分类')
                       return false
                   }

                },

                //获取动态参数
               async tabChange(){     
                   //console.log(this.activeName)            
                  // 证明访问的是动态参数面板
                    if(this.activeName === '1'){
                  const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,
                                                          
                    {
                        params:{ sel: 'many' }
                    }
                )
                 if (res.meta.status !== 200) {
                    return this.$message.error('获取动态参数列表失败！')
                  }

                console.log(res.data)
                res.data.forEach(item=>{
                    item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                })
                    this.manyTableData = res.data
             }else if (this.activeName === '2'){

                const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,
                                                                        
                                    {
                                        params:{ sel: 'only' }
                                    }
                                )
                                if (res.meta.status !== 200) {
                                    return this.$message.error('获取动态参数列表失败！')
                                }
                        this.onlyTableData = res.data
             }
        },
        //预览图片
        handlePreview(file){
            console.log(file)
            this.previewFile = file.response.data.url
            this.picVisible = true
        },
        //删除图片
        handleRemove(file){
            console.log(file)
            // 1. 获取将要删除的图片的临时路径
            const delPic = file.response.data.tem_path
            // 2. 从 pics 数组中，找到这个图片对应的索引值
            const i = this.addForm.pics.findIndex(x=>x.pic === delPic)
              // 3. 调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
                    this.addForm.pics.splice(i,1)
                },
        
        //获取上传图片的临时路径
        handelSuccess(response){
            console.log(response)
             // 1. 拼接得到一个图片信息对象
             const picInfo = {pic:response.data.tem_path}
             // 2. 将图片信息对象，push 到pics数组中
             this.addForm.pics.push(picInfo)
             console.log(this.addForm)

        },
        add(){
           this.$refs.addRuleForm.validate(async valid=>{
               if (!valid) {
                return this.$message.error('请填写必要的表单项！')
                }
                 // 执行添加的业务逻辑
                  // lodash   cloneDeep(obj)
            const form = _.cloneDeep(this.addForm)
            
            form.goods_cat = form.goods_cat.join(',')

            // 处理动态参数
            this.manyTableData.forEach(item =>{
               const newInfo = {
                   attr_id: item.attr_id,
                attr_value: item.attr_vals.join(' ')
               }
               this.addForm.attrs.push(newInfo) 
            })
            // 处理静态属性
            this.onlyTableData.forEach(item=>{
                const newInfo = {
                    attr_id: item.attr_id,
                attr_value: item.attr_vals}
                this.addForm.attrs.push(newInfo)
            })
                form.attrs = this.addForm.attrs
                // 发起请求添加商品
              // 商品的名称，必须是唯一的
                console.log(form)
            const { data: res } = await this.$http.post('goods', form)
          
                if (res.meta.status !== 201) {
                return this.$message.error('添加商品失败！')
                }
                console.log(res.data)
                this.$message.success('添加商品成功！')
                this.$router.push('/goods')

            })

        }
        

        },
        computed:{
            cateId(){
                if(this.addForm.goods_cat.length === 3){
                  return  this.addForm.goods_cat[2]
                }
                return null
            }
        }
    }        
</script>

<style lang="less" scoped>

.el-steps{
    margin:15px 0;
}

.el-checkbox {
  margin: 0 10px 0 0 !important;
}

.previewImg{
    width: 100%;
}

.btnAdd {
  margin-top: 15px;
}
</style>