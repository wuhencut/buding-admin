<template>
	<el-container class="page-main">
		<!--header-->
		<el-header class="header flex">
			<div class="logo">Patchlinker</div>
			<div class="user-admin">
				<el-dropdown @command="handleCommand" trigger="click">
					<p class="user-email">
						<img src="../../static/img/icon-header.png" alt />
						{{user.username}}
					</p>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="logout">安全退出</el-dropdown-item>
						<!--<el-dropdown-item command="updatePassword">修改密码</el-dropdown-item>-->
					</el-dropdown-menu>
				</el-dropdown>
			</div>
		</el-header>
		<!--/header-->
		<!--main-->
		<el-container class="content">
			<el-aside class="aside" width="200px">
				<el-menu
					:default-active="active"
					unique-opened
					router
					text-color="#a9afb6"
					active-text-color="#1060b6"
					background-color="#001525"
				>
					<el-submenu v-for="(value, key) in routerJson" :key="key" :index="key">
						<template slot="title">{{value.label}}</template>
						<el-menu-item
							v-for="(subValue, subKey) in value.children"
							:key="subKey"
							:index="subKey"
						>{{subValue}}</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-aside>
			<el-main>
				<router-view />
			</el-main>
		</el-container>
	</el-container>
	<!--/main-->
</template>
<script>
import routerJson from "../router/router";
export default {
	data() {
		return {
			routerJson: routerJson, // 路由配置文件
			user: {
				username: localStorage.getItem("username"),
				user_id: localStorage.getItem("user_id")
			}
		};
	},
	computed: {
		active() {
			let pathName = this.$route.name;
			let pathMap = {
        reportTaskDeal: "reportTaskDeal",
        accountManage: "accountManage", // 添加平台账户
        nearTask: "nearTask", // 附近的任务
				authentication: "authentication", //博主列表
				watchTaskVerify: "watchTaskVerify", // 围观任务
				feedbackInfoDeal: "feedbackInfoDeal", // 看目录去吧，懒得写了
				appealTaskDeal: "appealTaskDeal",
				taskManagement: "taskManagement",
				// checkTasks: "taskManagement",
				notifyManagement: "notifyManagement",
				startPageSet: "startPageSet",
				categorySet: "categorySet",
				userHelpSet: "userHelpSet",
				authManagement: "authManagement",
				roleManagement: "roleManagement",
				withdraw: "withdraw"
			};
			return pathMap[pathName];
		}
	},
	mounted() {},
	methods: {
		logout() {
			localStorage.removeItem("token");
			this.$router.push({
				name: "login"
			});
		},
		handleCommand(command) {
			this[command]();
		}
	}
};
</script>
<style lang="less">
.page-main {
	width: 100%;
	height: 100%;
	.el-aside {
		background-color: #001525;
	}
	.el-header {
		padding: 0;
		z-index: 100;
		box-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);
		.logo {
			background: #001e38;
			width: 200px;
			line-height: 60px;
			box-sizing: border-box;
			color: #fff;
			text-align: center;
		}
		.user-admin {
			flex: 1;
			line-height: 60px;
			text-align: right;
			padding-right: 14px;
			background: #fff;
			cursor: pointer;
			img {
				width: 15px;
				vertical-align: -3px;
			}
		}
	}
	.header {
		position: fixed;
		width: 100%;
	}
	.content {
		padding-top: 60px;
		padding-left: 200px;
		.aside {
			position: fixed;
			left: 0;
			height: 100%;
		}
	}
}

.el-main::-webkit-scrollbar {
	width: 0;
	height: 0;
}

.el-aside {
	box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
	.el-menu {
		border-right: none;
	}
}

.el-main {
	height: 100%;
}
</style>

