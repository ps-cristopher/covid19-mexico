<template>
	<div id="app">
		<vue-header />
		<transition name="slide-fade" mode="out-in">
			<router-view />
		</transition>
		<vue-footer />
	</div>
</template>

<script>
export default {
	name: 'app'
};
</script>

<style lang="scss">
@import '../../node_modules/bootstrap/dist/css/bootstrap.css';
@import '../../node_modules/@fortawesome/fontawesome-free/css/all.css';
@import '../scss/global.scss';
</style>
