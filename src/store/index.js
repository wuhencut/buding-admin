import Vue from  'vue'
import Vuex from 'vuex'
import api from '../api'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        userInfo:{},
        balance:0,
        messageCount:0,
        addressInput: '北京', // citySelect组件 - 城市
        investmentCount: 0,
    },
    mutations:{
        //更新用户信息
        updateUserInfo(state,userInfo){
            state.userInfo = userInfo;
        },
        //更新余额
        updateBalance(state,balance){
            state.balance = balance;
        },
        updateMessageCount(state,messageCount){
            state.messageCount = messageCount;
        },
        //更新 citySelect组件的城市
        updateAddress(state, address){
            state.addressInput = address;
        },
        //更新团队活动受邀请数
        updateInvestInfo(state, count){
            state.investmentCount = count
        }
    },
    actions:{
        async updateMessageCount(context, messageCount) {
            if(messageCount == undefined){
                let res = await api.getMessageCount({});
                if(res.errorCode == 0){
                    let count = res.data && res.data.count || 0;
                    context.commit('updateMessageCount', count);
                }else{
                    context.commit('updateMessageCount', 0);
                }
            }else{
                context.commit('updateMessageCount', 0);
            }

        },
        async updateInvestInfo(context){
            let res = await api.cypherActivityData({})
            if(res.errorCode == 0){
                let count = res.data.invited_count || 0;
                context.commit('updateInvestInfo', count);
            }else{
                context.commit('updateInvestInfo', 0);
            }
        },
        //其实是同步更新的addressInput，没必要走这一步，但是，保持一致吧
        updateAddress(context, address){
            context.commit('updateAddress', address)
        },
        async updateUserInfo(context){
            let res = await api.getProfile({});
            if(res.errorCode == 0){
                context.commit('updateUserInfo', res.data||{});
            }
        },
        async updateBalance(context){
            let userId = localStorage.getItem('agentId')||localStorage.getItem('userId');
            let req = {
                user_id:userId
            };
            let res = await api.balanceGet(req);
            if(res.errorCode == 0){
                context.commit('updateBalance',res.data||{});
            }else{
                context.commit('updateBalance',{});
            }
        }
    },
    getters:{
        getUserInfo(state){
            return state.userInfo;
        },
    }
});