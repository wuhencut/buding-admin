<template>
    <div class="page">
        <el-form inline>
          <el-form-item>
            <p style="font-size: 18px; font-weight: bold;">平台账号列表</p>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="search.phone"></el-input>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="search.nickname"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="icon-search" @click="queryList()">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="userDg = true" type="primary">新增</el-button>
          </el-form-item>
        </el-form>
        <el-table ref="multipleTable" :data="list">
            <el-table-column prop="phone" label="手机号" min-width="100"></el-table-column>
            <el-table-column prop="nickname" label="账户昵称" min-width="200">
              <template slot-scope="scope">
                <el-button type="text">{{scope.row.nickname}}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="账户性别" prop="gender">
              <template slot-scope="scope">
                <span v-if="scope.row.gender == 1">男</span>
                <span v-if="scope.row.gender == 2">女</span>
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="注册时间" width="180" sortable sort-by="create_at"></el-table-column>
            <!-- <el-table-column prop="create_time" label="最近登录时间" width="180" sortable sort-by="create_time"></el-table-column> -->
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button @click="checkTask(scope.row.user_id)"  type="text">查看相关任务</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <div class="pagination">
            <el-pagination background @current-change="handleCurrentChange" :current-page="search.page"
              :page-size="search.page_size"
              layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <!--分页 end-->

        <!-- 新增用户 -->
        <el-dialog :visible.sync="userDg" title="新增用户">
          <el-form :model="newUser" label-width="90px" :rules="formRules" ref="form">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="newUser.phone" placeholder="请输入手机号" maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="昵称" prop="user_name">
              <el-input v-model="newUser.user_name" placeholder="请输入昵称"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="newUser.gender">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="头像" prop="icon_image">
              <img v-if="newUser.icon_image" class="upload-img" :src="newUser.icon_image" alt="">
              <div class="add-img">
                <i class="el-icon-plus"></i>
              </div>
              <input class="file-area" type="file" @change="uploadImg($event)" accept="image/jpg,image/jpeg,image/png">
            </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button @click="userDg = false">取消</el-button>
            <el-button @click="addUser" type="primary">确定</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios'
  import OSS from 'ali-oss'
	import moment from "moment"

	export default {
		name: "AccountManage",
		data() {
			return {
        formRules: {
          phone: [{
            required: true,
            message: '请输入11位手机号',
            pattern: /^\d{11}$/,
            trigger: 'blur'
          }],
          user_name: [{
            required: true,
            message: '请输入昵称',
            trigger: 'blur'
          }],
          icon_image: [{
            required: true,
            message: '请选择头像',
            trigger: 'blur, change'
          }],
        },
        imageUrl: '',
        newUser: {
          phone: '',
          user_name: '',
          icon_image: '',
          gender: 1
        },
        userDg: false, // 新增弹窗
        total: 100,
				moment: moment,
				list: [], // 列表
				showInfo: false, // 展示审核信息
				selectedList: [], // 选中的列表
				search: {
          phone: '',
          nickname: '',
					page: 1,
					page_size: 10,
				},
        showAppealInfo: false, // 查看申诉信息
				operateInfo: {}, // 操作信息
        currAppealInfo: {},// 申诉详情
        client: {}, // ali-oss上传图片端口
			}
    },
		mounted() {
      this.queryList();
      // this.getSts()
		},
		methods: {
      // 点击展示审核信息
      async checkTask(user_id) {
        this.$router.push({
          name: "checkTasks",
          path: "checkTasks",
          query: { user_id: user_id }
        });
      },
      // 获取授权key
      async uploadImg(file){
        let image = file.target.files[0];
        let res = await this.$api.getSts({})
        if(res.code == 200){
          this.client = new OSS ({
            origin: 'oss-cn-hangzhou',
            accessKeyId: res.data.access_key_id,
            accessKeySecret: res.data.access_key_secret,
            bucket: res.data.bucket,
            stsToken: res.data.security_token
          })
          let name = 'user_header_pic/' + new Date().valueOf() + '.' + image.name.split('.').pop();
          this.client.multipartUpload(name, file.target.files[0]).then((res) => {
            this.newUser.icon_image = 'http://patchlinker.oss-cn-hangzhou.aliyuncs.com/' + name;
          }).catch((err) => {
            this.$message.error(err)
          })
        } else {
          this.$message.error(res.msg)
        }
      },
      // 展示新增弹窗
      showAddDg(){
        this.newUser = {};
      },
      async addUser(){
        this.$refs.form.validate(async (ok) => {
          if(ok){
            let res = await this.$api.addUser(this.newUser);
            if(res.code == 200){
              this.$message.success('添加成功');
              this.queryList();
              this.userDg = false;
            } else {
              this.$message.error(res.msg)
            }
          }
        })
      },
			// 查询列表
			async queryList() {
        // if(this.search.phone){
        //   // this.search.phone -= 0;
        // }
        let res = await this.$api.searchUserList(this.search);
        if(res.code == 200){
          this.list = res.data.list;
          this.total = res.data.count || 0;
        } else {
          this.$message.error(res.msg)
        }
			},
			// 点击展示审核信息
			async showInfoClick(id) {
				let res = await this.$api.appealOpearteInfo({id: id})
        if(res.code == 200){
					this.showInfo = true;
					this.operateInfo = res.data;
        } else {
					this.$message.error(res.msg)
        }
			},
			// 审核
			async verify(id) {
				let req = this.selectedList;
				this.$prompt('', '填写处理备注', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(async (val) => {
					if(!val.value){
						this.$message.error('填写处理信息')
						return false;
					} else {
						let res = await this.$api.dealAppeal({id: id, reason: val.value})
						if(res.code == 200){
							this.$message.success('处理成功');
							this.showInfo = false;
							this.queryList()
            } else {
							this.$message.error(res.msg)
            }
					}
				})
			},
			// 跳转
			handleCurrentChange(val) {
				this.search.page = val;
				this.queryList();
			},
            // 申诉内容展示
			showAppealContent(data){
				this.showAppealInfo = true;
          this.currAppealInfo = data
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
		}
	}
</script>
<style scoped>
  .upload-img{
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 101;
  }
  .add-img{
    width: 100px;
    line-height: 100px;
    border: 1px dashed #dedede;
    border-radius: 4px;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
  }
  .file-area{
    position: absolute;
    width: 100px;
    height: 100px;
    display: block;
    left: 0;
    top: 0;
    opacity: 0;
    z-index: 102;
  }
  .txt-right{
      text-align: right;
  }
  .pagination {
      text-align: center;
      margin-top: 20px;
  }
</style>