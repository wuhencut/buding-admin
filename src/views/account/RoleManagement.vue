<template>
	<div class="page">
		<el-form inline>
			<el-form-item label="用户手机号">
				<el-input v-model="search.phone"></el-input>
			</el-form-item>
			<el-form-item label="用户昵称">
				<el-input v-model="search.nickname"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="searchClick">搜索</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="list">
			<el-table-column label="用户昵称" prop="nickname"></el-table-column>
			<el-table-column label="手机号码" prop="phone"></el-table-column>
			<el-table-column label="注册时间" prop="created_at" sortable></el-table-column>
			<el-table-column label="实名认证" prop="real_name_status">
				<template slot-scope="scope">
					<el-tag type="warning" v-if="scope.row.real_name_status == 1">未认证</el-tag>
					<!-- <span v-if="scope.row.real_name_status == 2">补叮认证</span> -->
					<el-tag type="success" v-if="scope.row.real_name_status == 3">已认证</el-tag>
				</template>
			</el-table-column>
      <el-table-column label="补叮认证" prop="buding_status">
				<template slot-scope="scope">
					<el-tag type="success" v-if="scope.row.buding_status == 2">已认证</el-tag>
					<el-tag type="warning" v-if="scope.row.buding_status == 1">未认证</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="300">
				<template slot-scope="scope">
					<el-button
            v-if="scope.row.real_name_status != 3"
						type="text"
            @click="changeUserStatusClick(scope.row.real_name_status, scope.row.user_id)"
					>实名认证</el-button>
          <el-button v-if="scope.row.real_name_status == 3" type="text" @click="changeBudingClick(scope.row.user_id, scope.row.buding_status)">补叮认证</el-button>
					<el-button type="text" @click="getPersonDetail(scope.row.user_id)">详细资料</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--分页-->
		<div class="pagination">
			<el-pagination
				background
				@current-change="handleCurrentChange"
				:current-page="search.page"
				:page-size="search.page_size"
				layout="total, prev, pager, next, jumper"
				:total="total"
			></el-pagination>
		</div>
		<!--分页 end-->

		<el-dialog title="补叮认证" :visible.sync="changeBudingDg">
			<el-radio-group v-model="currBuding.buding_status">
        <el-radio :label="2">已认证</el-radio>
        <el-radio :label="1">取消认证</el-radio>
			</el-radio-group>
			<div style="margin-top: 20px;">
				<el-button type="primary" @click="changeBudingStatus">确认</el-button>
				<el-button @click="changeBudingDg = false">取消</el-button>
			</div>
		</el-dialog>

    <!-- 实名认证dg -->
    <el-dialog :visible.sync="changeRealDg" title="实名认证">
      <el-radio-group v-model="currReal.agree">
        <el-radio :label="true">认证通过</el-radio>
        <el-radio :label="false">认证取消</el-radio>
      </el-radio-group>
      <div style="margin-top: 20px;">
				<el-button type="primary" @click="changeRealStatus">确认</el-button>
				<el-button @click="changeRealDg = false">取消</el-button>
			</div>
    </el-dialog>

		<el-dialog title="详细资料" :visible.sync="infoDialog">
			<div class="person-info flex">
				<img class="person-img" width="100" height="100" :src="personInfo.icon_image" alt />
				<el-form inline class="flex-s1" disabled>
					<el-row>
						<el-col :span="8">
							<el-form-item label="昵称">
								<el-input style="width: 100px" size="mini" :value="personInfo.nickname"></el-input>
							</el-form-item>
							<el-form-item label="签名">
								<el-input style="width: 100px" size="mini" :value="personInfo.signature"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="手机">
								<el-input style="width: 100px" size="mini" :value="personInfo.phone"></el-input>
							</el-form-item>
							<el-form-item label="职位">
								<el-input style="width: 100px" size="mini" :value="personInfo.position"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="行业">
								<el-input style="width: 100px" size="mini" :value="personInfo.industry"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<p>
				<b>个人介绍</b>
			</p>
			<el-input disabled type="textarea" :value="personInfo.introduce"></el-input>
			<p style="padding-top: 14px;">
				<b>个人动态</b>
			</p>
			<div v-for="item in doingList" class="brand-item">
				<div v-for="i in item.images">
          <p class="brand-title">{{item.text}}</p>
					<img :src="i" alt />
				</div>
        <p class="time">{{item.create_time}}</p>
			</div>
      
      <!--分页-->
      <div class="pagination">
        <el-pagination
          background
          @current-change="handleDoingCurrentChange"
          :current-page="page"
          :page-size="5"
          layout="total, prev, pager, next, jumper"
          :total="doingTotal"
        ></el-pagination>
      </div>
      <!--分页 end-->
		</el-dialog>
	</div>
</template>

<script>
import moment from "moment";
import { async } from 'q';

export default {
	name: "roleManagement",
	data() {
		return {
      doingTotal: 10, // 
      doingList: [],
      total: 10,
			moment: moment,
			authDialog: false,
			infoDialog: false,
			authList: [],
			list: [],
			currUserId: "", // 被修改权限的用户id
			search: {
				nickname: "",
				phone: "",
				page: 1,
				page_size: 10,
				only_buding_status: true
			},
			personInfo: "", // 个人信息
			personBrand: "", // 品牌
      count: 0,
      currBuding: {}, // 补叮认证状态
      currReal: {
        user_ids: [],
        agree: true,
        reason: ''
      }, // 当前实名认证状态
      changeBudingDg: false, // 补叮状态Dg
      changeRealDg: false, // 实名认证Dg
      page: 0,
		};
	},
	mounted() {
		this.queryList();
	},
	methods: {
    // 修改用户状态
    changeUserStatusClick(status, user_id){
      this.currReal = {
        agree: status == 3 ? true : status == 1 ? false : false,
        user_ids: [user_id],
        reason: ''
      },
      this.changeRealDg = true;
    },
    // 修改用户状态确认
    async changeRealStatus(){
      let res = await this.$api.authVerify(this.currReal);
      if(res.code == 200){
        this.$message.success('修改成功');
        this.queryList();
        this.changeRealDg = false;
      } else {
        this.$message.error(res.msg);
      }
    },
    // 修改补叮认证状态
    async changeBudingStatus(){
      let res = await this.$api.changeBudingStatus(this.currBuding);
      if(res.code == 200){
        this.$message.success('修改成功');
        this.queryList();
        this.changeBudingDg = false;
      } else {
        this.$message.error(res.msg)
      }
    },
    // 修改补叮认证
    changeBudingClick(user_id, buding_status){
      this.currBuding = {
        user_id: user_id,
        buding_status: buding_status // 1 认证 2、撤销认证
      },
      this.changeBudingDg = true;
    },
		// 切换页码
		handleCurrentChange(val) {
			this.search.page = val;
			this.queryList();
    },
    handleDoingCurrentChange(val){
      this.page = val;
      this.gerPersonDoingList();
    },
		// 设置权限
		async setAuth(id) {
			let res = await this.$api.setAuth({
				user_id: id,
				buding_status: this.auth
			});
			if (res.code == 200) {
				this.queryList();
				this.authDialog = false;
			} else {
				this.$message.error(res.msg);
			}
		},
		searchClick() {
			this.search.page = 1;
			this.queryList();
		},
		async getPersonDetail(id) {
			let res = await this.$api.getPersonDetail({ user_id: id });
			if (res.code == 200) {
        this.personInfo = res.data;
        this.gerPersonDoingList(id, this.page_id)
				this.infoDialog = true;
			} else {
				this.$message.error(res.msg);
			}
    },
    async gerPersonDoingList(id, page_id){
      let res = await this.$api.personDoingList({
        user_id: 'c34df95e-d4a2-58ac-b352-1dcbfe7bb361',
        page_size: 5,
        page: ++this.page
        });
      if(res.code == 200){
        this.doingList = res.data.list;
        this.doingTotal = res.count;
      }
    },
    // 查询列表
		async queryList() {
			let res = await this.$api.searchUserList(this.search);
			if (res.code == 200) {
				this.list = res.data.list;
				this.total = res.data.count;
			} else {
				this.$message.error(res.msg);
			}
    },
	}
};
</script>

<style lang="less" scoped>
.flex {
	display: flex;
}

.flex-s1 {
	flex: 1;
}

.person-info {
	.person-img {
		width: 100px;
		height: 100px;
		margin: 10px;
		vertical-align: middle;
	}
}

.pagination {
	text-align: center;
	margin-top: 20px;
}

.brand-item {
	margin-right: 10px;
	display: inline-block;
	.brand-title {
		font-size: 16px;
		font-weight: bold;
		padding: 10px 0;
	}
	img {
		width: 30%;
	}
}
</style>