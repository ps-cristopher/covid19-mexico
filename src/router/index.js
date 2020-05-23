import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '@/components/routes/Dashboard';
import Detail from '@/components/routes/Detail';
import NotFound from '@/components/routes/NotFound';
import NProgress from 'nprogress';
import store from '@/store';

Vue.use(Router);

const router = new Router({
	mode: 'history',
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		} else {
			return {x: 0, y: 0};
		}
	},
	routes: [
		{
			path: '/',
			redirect: '/dashboard'
		},
		{
			path: '/dashboard',
			name: 'dashboard',
			component: Dashboard
		},
		{
			path: '/detail',
			name: 'detail',
			component: Detail
		},
		{
			path: '*',
			component: NotFound
		}
	]
});

router.beforeEach((routeTo, routeFrom, next) => {
	NProgress.start();
	next();
});

router.afterEach((routeTo, routeFrom) => {
	NProgress.set(0.8);
});

export default router;
