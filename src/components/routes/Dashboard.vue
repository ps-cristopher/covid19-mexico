<template lang="html">
	<main role="main">
		<vue-amount-cards />

		<div class="container-fluid mt-0" v-if="!isMobile">
			<div class="row">
				<vue-map-chart></vue-map-chart>
			</div>
		</div>
	</main>
</template>

<script>
import {isMobile} from 'mobile-device-detect';
import NProgress from 'nprogress';

export default {
	name: 'Dashboard',
	created() {
		NProgress.done();
	},
	data() {
		return {
			isMobile: isMobile
		};
	}
};
</script>
