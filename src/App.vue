<template>
    <router-view v-if="show"/>
</template>

<script>
    export default {
        name: 'App',
        data() {
            return {
                show: true
            }
        },
        mounted(){

        }
    }
</script>

<style>

</style>
