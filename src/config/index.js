import Vue from 'vue';
import Header from '@/components/ui/Header.vue';
import Footer from '@/components/ui/Footer.vue';
import MapChart from '@/components/ui/MapChart.vue';
import PieChart from '@/components/ui/PieChart.vue';
import AmountCards from '@/components/ui/AmountCards.vue';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

Vue.component('vue-header', Header);
Vue.component('vue-footer', Footer);
Vue.component('vue-map-chart', MapChart);
Vue.component('vue-pie-chart', PieChart);
Vue.component('vue-amount-cards', AmountCards);


NProgress.configure({showSpinner: false});
