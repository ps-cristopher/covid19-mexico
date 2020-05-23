import Vue from 'vue';
import Vuex from 'vuex';
import data from '@/data';
// MODULE IMPORTS

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		mexico: data.mexico,
		mexicoStates: data.mexicoStates,
		mexicoTimeline: data.mexicoTimeline,
		mexicoStatesTimeline: data.mexicoStatesTimeline
	}
});

export default store;
