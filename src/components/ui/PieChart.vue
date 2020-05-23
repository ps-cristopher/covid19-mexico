<template lang="html">
	<div :ref="id" :id="id" :style="chartStyle"></div>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

export default {
	name: 'PieChart',
	props: {
		id: {
			type: String,
			required: true
		},
		data: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			chart: null,
			chartStyle: {
				width: '100%',
				height: '30rem'
			}
		};
	},
	mounted() {
		am4core.ready(() => {
			let container = am4core.create(this.id, am4charts.PieChart3D);
			container.hiddenState.properties.opacity = 0; // this creates initial fade-in

			container.legend = new am4charts.Legend();

			container.data = this.data;

			container.label = am4core.color('red');
			container.fill = am4core.color('red').lighten(0.5);
			var series = container.series.push(new am4charts.PieSeries3D());
			series.dataFields.value = 'litres';
			series.dataFields.category = 'country';
			series.dataFields.color = 'color';

			series.slices.template.propertyFields.fill = 'color';

			// Disable ticks and labels
			series.labels.template.disabled = true;
			series.ticks.template.disabled = true;

			// Let's cut a hole in our Pie chart the size of 40% the radius
			//container.innerRadius = am4core.percent(40);

			container.legend.labels.template.fill = am4core.color('#222f36');
			container.legend.valueLabels.template.fill = am4core.color('#222f36');


			this.chart = container;
		});
	},
	beforeDestroy() {
		if (this.chart !== null) this.chart.dispose();
		this.chart = null;
	},
	computed: {
		mexico() {
			return this.$store.state.mexico;
		},
		mexicoStates() {
			return this.$store.state.mexicoStates;
		},
		mexicoTimeline() {
			return this.$store.state.mexicoTimeline;
		},
		mexicoStatesTimeline() {
			return this.$store.state.mexicoStatesTimeline;
		}
	},
	methods: {}
};
</script>
