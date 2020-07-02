<template lang="html">
	<div ref="chartMapDiv" id="chartMapDiv"></div>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_mexicoLow from '@amcharts/amcharts4-geodata/mexicoLow';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_dark from '@amcharts/amcharts4/themes/dark';

am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_dark);

export default {
	name: 'HelloWorld',
	data() {
		return {
			chart: null
		};
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
			return this.$store.state.mexicoStatesTimeline.map((date) => {
				let confirmed = date.list[0].confirmed;
				let deaths = date.list[0].deaths;
				let recovered = date.list[0].recovered;
				date.list = date.list.map((state, index) => {
					state.confirmed = confirmed * 2;
					state.deaths = deaths * 2;
					state.recovered = recovered * 2;
					confirmed = state.confirmed;
					deaths = state.deaths;
					recovered = state.recovered;
					console.log(state);
					return state;
				});
				return date;
			});
		}
	},
	methods: {
		getSlideData(indexParam) {
			let index = indexParam;
			// function that returns current slide
			// if index is not set, get last slide
			if (index == undefined) {
				index = this.mexicoStatesTimeline.length - 1;
			}

			var data = this.mexicoStatesTimeline[index];

			// augment with names
			for (var i = 0; i < data.list.length; i++) {
				data.list[i].name = data.list[i].id;
			}
			return data;
		}
	},
	beforeDestroy() {
		if (this.chart !== null) this.chart.dispose();
		this.chart = null;
	},
	mounted() {
		am4core.ready(() => {
			var backgroundColor = am4core.color('#ffffff');
			var activeColor = am4core.color('#ffc107');
			var confirmedColor = am4core.color('#6c757d');
			var recoveredColor = am4core.color('#28a745');
			var deathsColor = am4core.color('#dc3545');

			// for an easier access by key
			var colors = {
				active: activeColor,
				confirmed: confirmedColor,
				recovered: recoveredColor,
				deaths: deathsColor
			};

			var countryColor = am4core.color('#222f36');
			var countryStrokeColor = am4core.color('#ffffff');
			var buttonStrokeColor = am4core.color('#ffffff');
			var countryHoverColor = am4core.color('#000000');
			var activeCountryColor = am4core.color('#000000');

			var currentIndex;
			var currentCountry = 'México';

			// last date of the data
			var lastDate = new Date(
				this.mexicoTimeline[this.mexicoTimeline.length - 1].date
			);
			var currentDate = lastDate;

			var currentPolygon;

			var countryDataTimeout;

			var sliderAnimation;

			let mexicoTimeline = this.mexicoTimeline;
			let mexicoStatesTimeline = this.mexicoStatesTimeline;
			//////////////////////////////////////////////////////////////////////////////
			// PREPARE DATA
			//////////////////////////////////////////////////////////////////////////////

			// make a map of country indexes for later use
			var countryIndexMap = {};
			var list = this.mexicoStatesTimeline[0].list;
			for (var i = 0; i < list.length; i++) {
				var country = list[i];
				countryIndexMap[country.id] = i;
			}

			// calculated active cases in world data (active = confirmed - recovered)
			for (var i = 0; i < this.mexicoTimeline.length; i++) {
				var di = this.mexicoTimeline[i];
				di.active = di.confirmed - di.recovered - di.deaths;
			}

			// function idToName(id) {
			// 	return am4geodata_data_countries2[id] ? am4geodata_data_countries2[id].country : id;
			// }

			// get slide data
			var slideData = this.getSlideData();

			// as we will be modifying raw data, make a copy
			var mapData = JSON.parse(JSON.stringify(slideData.list));
			var max = {confirmed: 0, recovered: 0, deaths: 0};

			// the last day will have most
			for (var i = 0; i < mapData.length; i++) {
				var di = mapData[i];
				if (di.confirmed > max.confirmed) {
					max.confirmed = di.confirmed;
				}
				if (di.recovered > max.recovered) {
					max.recovered = di.recovered;
				}
				if (di.deaths > max.deaths) {
					max.deaths = di.deaths;
				}
				if (di.active > max.active) {
					max.active = di.active;
				}
			}

			// END OF DATA

			//////////////////////////////////////////////////////////////////////////////
			// LAYOUT & CHARTS
			//////////////////////////////////////////////////////////////////////////////

			// main container
			// https://www.amcharts.com/docs/v4/concepts/svg-engine/containers/
			var container = am4core.create(this.$refs.chartMapDiv, am4core.Container);
			container.width = am4core.percent(100);
			container.height = am4core.percent(100);

			// MAP CHART
			// https://www.amcharts.com/docs/v4/chart-types/map/
			var mapChart = container.createChild(am4maps.MapChart);
			mapChart.height = am4core.percent(80);
			mapChart.zoomControl = new am4maps.ZoomControl();
			mapChart.zoomControl.align = 'right';
			mapChart.zoomControl.marginRight = 15;
			mapChart.zoomControl.valign = 'middle';
			mapChart.maxZoomLevel = 1.3;

			// by default minus button zooms out by one step, but we modify the behavior so when user clicks on minus, the map would fully zoom-out and show world data
			mapChart.zoomControl.minusButton.events.on('hit', showWorld);
			// clicking on a 'sea' will also result a full zoom-out
			mapChart.seriesContainer.background.events.on('hit', showWorld);
			mapChart.seriesContainer.background.events.on('over', resetHover);
			mapChart.seriesContainer.background.fillOpacity = 0;
			mapChart.zoomEasing = am4core.ease.sinOut;

			// https://www.amcharts.com/docs/v4/chart-types/map/#Map_data
			// you can use more accurate world map or map of any other country - a wide selection of maps available at: https://github.com/amcharts/amcharts4-geodata
			mapChart.geodata = am4geodata_mexicoLow;

			// Set projection
			// https://www.amcharts.com/docs/v4/chart-types/map/#Setting_projection
			// instead of Miller, you can use Mercator or many other projections available: https://www.amcharts.com/demos/map-using-d3-projections/
			mapChart.projection = new am4maps.projections.Miller();
			mapChart.panBehavior = 'move';

			// when map is globe, beackground is made visible
			mapChart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 0.05;
			mapChart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color(
				'#ffffff'
			);
			mapChart.backgroundSeries.hidden = true;

			// Map polygon series (defines how country areas look and behave)
			var polygonSeries = mapChart.series.push(new am4maps.MapPolygonSeries());
			polygonSeries.dataFields.id = 'id';
			polygonSeries.exclude = ['AQ']; // Antarctica is excluded in non-globe projection
			polygonSeries.useGeodata = true;
			polygonSeries.nonScalingStroke = true;
			polygonSeries.strokeWidth = 0.5;
			// this helps to place bubbles in the visual middle of the area
			polygonSeries.calculateVisualCenter = true;

			var polygonTemplate = polygonSeries.mapPolygons.template;
			polygonTemplate.fill = countryColor;
			polygonTemplate.fillOpacity = 1;
			polygonTemplate.stroke = countryStrokeColor;
			polygonTemplate.strokeOpacity = 0.15;
			polygonTemplate.setStateOnChildren = true;

			polygonTemplate.events.on('hit', handleCountryHit);
			polygonTemplate.events.on('over', handleCountryOver);
			polygonTemplate.events.on('out', handleCountryOut);

			// you can have pacific - centered map if you set this to -154.8
			mapChart.deltaLongitude = -10;

			// polygon states
			var polygonHoverState = polygonTemplate.states.create('hover');
			polygonHoverState.properties.fill = countryHoverColor;

			var polygonActiveState = polygonTemplate.states.create('active');
			polygonActiveState.properties.fill = activeCountryColor;

			// Bubble series
			var bubbleSeries = mapChart.series.push(new am4maps.MapImageSeries());
			bubbleSeries.data = mapData;
			bubbleSeries.dataFields.value = 'confirmed';
			bubbleSeries.dataFields.id = 'id';

			// adjust tooltip
			bubbleSeries.tooltip.animationDuration = 0;
			bubbleSeries.tooltip.showInViewport = false;
			bubbleSeries.tooltip.background.fillOpacity = 0.2;
			bubbleSeries.tooltip.getStrokeFromObject = true;
			bubbleSeries.tooltip.getFillFromObject = false;
			bubbleSeries.tooltip.background.fillOpacity = 0.2;
			bubbleSeries.tooltip.background.fill = am4core.color('#000000');

			var imageTemplate = bubbleSeries.mapImages.template;
			// if you want bubbles to become bigger when zoomed, set this to false
			imageTemplate.nonScaling = true;
			imageTemplate.strokeOpacity = 0;
			imageTemplate.fillOpacity = 0.6;
			imageTemplate.tooltipText = '{name}: [bold]{value}[/]';
			// this is needed for the tooltip to point to the top of the circle instead of the middle
			//imageTemplate.adapter.add('tooltipY', function(tooltipY, target) {
			//	return -target.children.getIndex(0).radius;
			//})

			imageTemplate.events.on('over', handleImageOver);
			imageTemplate.events.on('out', handleImageOut);
			imageTemplate.events.on('hit', handleImageHit);

			// When hovered, circles become non-opaque
			var imageHoverState = imageTemplate.states.create('hover');
			imageHoverState.properties.fillOpacity = 1;

			// add circle inside the image
			var circle = imageTemplate.createChild(am4core.Circle);
			// this makes the circle to pulsate a bit when showing it
			circle.hiddenState.properties.scale = 0.0001;
			circle.hiddenState.transitionDuration = 10;
			circle.defaultState.transitionDuration = 2000;
			circle.defaultState.transitionEasing = am4core.ease.elasticOut;
			// later we set fill color on template (when changing what type of data the map should show) and all the clones get the color because of this
			circle.applyOnClones = true;
			circle.nonScaling = false;

			mapChart.events.on('zoomlevelchanged', () => {
				circle.scale = 1 + mapChart.zoomLevel / 20;
			});

			// heat rule makes the bubbles to be of a different width. Adjust min/max for smaller/bigger radius of a bubble
			bubbleSeries.heatRules.push({
				target: circle,
				property: 'radius',
				min: 3,
				max: 30,
				dataField: 'value'
			});

			// when data items validated, hide 0 value bubbles (because min size is set)
			bubbleSeries.events.on('dataitemsvalidated', function() {
				bubbleSeries.dataItems.each((dataItem) => {
					var mapImage = dataItem.mapImage;
					var circle = mapImage.children.getIndex(0);
					if (mapImage.dataItem.value == 0) {
						circle.hide(0);
					} else if (circle.isHidden || circle.isHiding) {
						circle.show();
					}
				});
			});

			// this places bubbles at the visual center of a country
			imageTemplate.adapter.add('latitude', function(
				latitude,
				targetPropertie
			) {
				let target = targetPropertie;
				var polygon = polygonSeries.getPolygonById(target.dataItem.id);
				if (polygon) {
					target.disabled = false;
					return polygon.visualLatitude;
				} else {
					target.disabled = true;
				}
				return latitude;
			});

			imageTemplate.adapter.add('longitude', function(
				longitude,
				targetPropertie
			) {
				let target = targetPropertie;
				var polygon = polygonSeries.getPolygonById(target.dataItem.id);
				if (polygon) {
					target.disabled = false;
					return polygon.visualLongitude;
				} else {
					target.disabled = true;
				}
				return longitude;
			});

			// END OF MAP

			// top title
			var title = mapChart.titles.create();
			title.fontSize = '1.5em';
			title.text = '';
			title.align = 'left';
			title.horizontalCenter = 'left';
			title.marginLeft = 20;
			title.paddingBottom = 10;
			title.y = 20;

			// buttons & chart container
			var buttonsAndChartContainer = container.createChild(am4core.Container);
			buttonsAndChartContainer.layout = 'vertical';
			buttonsAndChartContainer.height = am4core.percent(38); // make this bigger if you want more space for the chart
			buttonsAndChartContainer.width = am4core.percent(100);
			buttonsAndChartContainer.valign = 'bottom';

			// country name and buttons container
			var nameAndButtonsContainer = buttonsAndChartContainer.createChild(
				am4core.Container
			);
			nameAndButtonsContainer.width = am4core.percent(100);
			nameAndButtonsContainer.padding(0, 10, 5, 20);
			nameAndButtonsContainer.layout = 'horizontal';

			// name of a country and date label
			var countryName = nameAndButtonsContainer.createChild(am4core.Label);
			countryName.fontSize = '1.1em';
			countryName.valign = 'middle';
			countryName.fill = am4core.color('#222f36');
			countryName.stroke = am4core.color('#222f36');
			countryName.strokeOpacity = 0.1;

			// buttons container (active/confirmed/recovered/deaths)
			var buttonsContainer = nameAndButtonsContainer.createChild(
				am4core.Container
			);
			buttonsContainer.layout = 'grid';
			buttonsContainer.width = am4core.percent(100);
			buttonsContainer.x = 10;
			buttonsContainer.contentAlign = 'right';

			// Chart & slider container
			var chartAndSliderContainer = buttonsAndChartContainer.createChild(
				am4core.Container
			);
			chartAndSliderContainer.layout = 'vertical';
			chartAndSliderContainer.height = am4core.percent(100);
			chartAndSliderContainer.width = am4core.percent(100);
			chartAndSliderContainer.background = new am4core.RoundedRectangle();
			chartAndSliderContainer.background.fill = am4core.color('#222f36');
			chartAndSliderContainer.background.cornerRadius(30, 30, 0, 0);
			chartAndSliderContainer.background.fillOpacity = 0.8;
			chartAndSliderContainer.fill = am4core.color('#222f36');
			chartAndSliderContainer.paddingTop = 15;
			chartAndSliderContainer.paddingBottom = 0;

			// Slider container
			var sliderContainer = chartAndSliderContainer.createChild(
				am4core.Container
			);
			sliderContainer.width = am4core.percent(100);
			sliderContainer.padding(0, 15, 15, 10);
			sliderContainer.layout = 'horizontal';

			var slider = sliderContainer.createChild(am4core.Slider);
			slider.width = am4core.percent(100);
			slider.valign = 'middle';
			slider.background.opacity = 1;
			slider.opacity = 0.7;
			slider.background.fill = am4core.color('#ffffff');
			slider.marginLeft = 20;
			slider.marginRight = 35;
			slider.height = 15;
			slider.start = 1;

			// what to do when slider is dragged
			slider.events.on('rangechanged', (event) => {
				var index = Math.round(
					(mexicoStatesTimeline.length - 1) * slider.start
				);
				updateMapData(this.getSlideData(index).list);
				updateTotals(index, mexicoTimeline);
			});
			// stop animation if dragged
			slider.startGrip.events.on('drag', () => {
				stop();
				if (sliderAnimation) {
					sliderAnimation.setProgress(slider.start);
				}
			});

			// play button
			var playButton = sliderContainer.createChild(am4core.PlayButton);
			playButton.valign = 'middle';
			// play button behavior
			playButton.events.on('toggled', function(event) {
				if (event.target.isActive) {
					play();
				} else {
					stop();
				}
			});
			// make slider grip look like play button
			playButton.background.fill = am4core.color('#f1d300');

			var playButtonHoverState = playButton.background.states.create('hover');
			playButtonHoverState.properties.fillOpacity = 1;
			playButtonHoverState.properties.fill = am4core.color('#1e73be');

			var playButtonActiveState = playButton.background.states.create('down');
			playButtonActiveState.properties.fillOpacity = 1;
			playButtonActiveState.properties.fill = am4core.color('#1e73be');

			slider.startGrip.background.fill = playButton.background.fill;
			slider.startGrip.background.fillOpacity = 1;
			slider.startGrip.background.strokeOpacity = 0;
			slider.startGrip.icon.stroke = am4core.color('#ffffff');
			slider.startGrip.background.states.copyFrom(playButton.background.states);

			// play behavior
			function play() {
				if (!sliderAnimation) {
					sliderAnimation = slider
						.animate(
							{property: 'start', to: 1, from: 0},
							10000,
							am4core.ease.linear
						)
						.pause();
					sliderAnimation.events.on('animationended', () => {
						playButton.isActive = false;
					});
				}

				if (slider.start >= 1) {
					slider.start = 0;
					sliderAnimation.start();
				}
				sliderAnimation.resume();
				playButton.isActive = true;
			}

			// stop behavior
			function stop() {
				if (sliderAnimation) {
					sliderAnimation.pause();
				}
				playButton.isActive = false;
			}

			// BOTTOM CHART
			// https://www.amcharts.com/docs/v4/chart-types/xy-chart/
			var lineChart = chartAndSliderContainer.createChild(am4charts.XYChart);
			lineChart.fontSize = '0.8em';
			lineChart.paddingRight = 30;
			lineChart.paddingLeft = 30;
			lineChart.maskBullets = false;
			lineChart.zoomOutButton.disabled = true;
			lineChart.paddingBottom = 7;

			// make a copy of data as we will be modifying it
			lineChart.data = JSON.parse(JSON.stringify(this.mexicoTimeline));

			// date axis
			// https://www.amcharts.com/docs/v4/concepts/axes/date-axis/
			var dateAxis = lineChart.xAxes.push(new am4charts.DateAxis());
			dateAxis.renderer.minGridDistance = 50;
			dateAxis.renderer.grid.template.stroke = am4core.color('#000000');
			dateAxis.max = lastDate.getTime() + am4core.time.getDuration('day', 3);
			dateAxis.tooltip.label.fontSize = '0.8em';
			dateAxis.tooltip.background.fill = activeColor;
			dateAxis.tooltip.background.stroke = activeColor;

			// value axis
			// https://www.amcharts.com/docs/v4/concepts/axes/value-axis/
			var valueAxis = lineChart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.interpolationDuration = 5000000;
			valueAxis.renderer.grid.template.stroke = am4core.color('#000000');
			valueAxis.renderer.baseGrid.disabled = true;
			valueAxis.tooltip.disabled = true;
			valueAxis.extraMax = 0.05;
			valueAxis.renderer.inside = true;
			valueAxis.renderer.labels.template.verticalCenter = 'bottom';
			valueAxis.renderer.labels.template.padding(2, 2, 2, 2);

			// cursor
			// https://www.amcharts.com/docs/v4/concepts/chart-cursor/
			lineChart.cursor = new am4charts.XYCursor();
			lineChart.cursor.behavior = 'none'; // set zoomX for a zooming possibility
			lineChart.cursor.lineY.disabled = true;
			lineChart.cursor.lineX.stroke = activeColor;
			lineChart.cursor.xAxis = dateAxis;
			// this prevents cursor to move to the clicked location while map is dragged
			am4core
				.getInteraction()
				.body.events.off(
					'down',
					lineChart.cursor.handleCursorDown,
					lineChart.cursor
				);
			am4core
				.getInteraction()
				.body.events.off(
					'up',
					lineChart.cursor.handleCursorUp,
					lineChart.cursor
				);

			// legend
			// https://www.amcharts.com/docs/v4/concepts/legend/
			lineChart.legend = new am4charts.Legend();
			lineChart.legend.parent = lineChart.plotContainer;

			// create series
			var activeSeries = addSeries('active', activeColor, 'Activos');
			// active series is visible initially
			activeSeries.tooltip.disabled = true;
			activeSeries.hidden = false;

			var confirmedSeries = addSeries(
				'confirmed',
				confirmedColor,
				'Confirmados'
			);
			var recoveredSeries = addSeries(
				'recovered',
				recoveredColor,
				'Recuperados'
			);
			var deathsSeries = addSeries('deaths', deathsColor, 'Fallecidos');

			var series = {
				active: activeSeries,
				confirmed: confirmedSeries,
				recovered: recoveredSeries,
				deaths: deathsSeries
			};
			// add series
			function addSeries(name, color, textLabel = '') {
				var series = lineChart.series.push(new am4charts.LineSeries());
				series.dataFields.valueY = name;
				series.dataFields.dateX = 'date';
				series.name = textLabel || capitalizeFirstLetter(name);
				series.strokeOpacity = 0.6;
				series.stroke = color;
				series.maskBullets = false;
				series.minBulletDistance = 10;
				series.hidden = true;
				series.hideTooltipWhileZooming = true;
				// series bullet
				var bullet = series.bullets.push(new am4charts.CircleBullet());

				// only needed to pass it to circle
				var bulletHoverState = bullet.states.create('hover');
				bullet.setStateOnChildren = true;

				bullet.circle.fillOpacity = 1;
				bullet.circle.fill = backgroundColor;
				bullet.circle.radius = 3;

				var circleHoverState = bullet.circle.states.create('hover');
				circleHoverState.properties.fillOpacity = 1;
				circleHoverState.properties.fill = color;
				circleHoverState.properties.scale = 1.4;

				// tooltip setup
				series.tooltip.pointerOrientation = 'down';
				series.tooltip.getStrokeFromObject = true;
				series.tooltip.getFillFromObject = false;
				series.tooltip.background.fillOpacity = 0.2;
				series.tooltip.background.fill = am4core.color('#000000');
				series.tooltip.dy = -4;
				series.tooltip.fontSize = '0.8em';
				series.tooltipText = '{valueY} casos el {dateX} ';

				return series;
			}

			// data warning label
			var label = lineChart.plotContainer.createChild(am4core.Label);
			label.text =
				'Los datos se actualizán solo con información oficial de la Secretaría de Salud.';
			label.fontSize = '0.7em';
			label.opacity = 0.5;
			label.align = 'right';
			label.horizontalCenter = 'right';
			label.verticalCenter = 'bottom';

			// BUTTONS
			// create buttons
			var confirmedButton = addButton(
				'confirmed',
				confirmedColor,
				'Confirmados'
			);
			var activeButton = addButton('active', activeColor, 'Activos');
			var deathsButton = addButton('deaths', deathsColor, 'Fallecidos');
			var recoveredButton = addButton(
				'recovered',
				recoveredColor,
				'Recuperados'
			);

			var buttons = {
				confirmed: confirmedButton,
				active: activeButton,
				deaths: deathsButton,
				recovered: recoveredButton
			};

			// add button
			function addButton(name, color, textLabel = '') {
				var button = buttonsContainer.createChild(am4core.Button);
				button.label.valign = 'middle';
				button.fontSize = '1em';
				button.name = name;
				button.textLabel = textLabel || capitalizeFirstLetter(name);
				button.label.fill = am4core.color('#ffffff');
				button.background.cornerRadius(30, 30, 30, 30);
				button.background.stroke = am4core.color('#ffffff');
				button.background.strokeOpacity = 0.1;
				button.background.fill = am4core.color('#222f36');
				button.background.fillOpacity = 0.5;
				button.background.padding(2, 3, 2, 3);
				button.states.create('active');
				button.setStateOnChildren = true;

				var activeHoverState = button.background.states.create('hoverActive');
				activeHoverState.properties.fillOpacity = 1;

				var circle = new am4core.Circle();
				circle.radius = 8;
				circle.fillOpacity = 0.9;
				circle.fill = am4core.color('#ffffff');
				circle.strokeOpacity = 1;
				circle.valign = 'middle';
				circle.marginRight = 5;
				button.icon = circle;

				// save name to dummy data for later use
				button.dummyData = name;

				var circleActiveState = circle.states.create('active');
				circleActiveState.properties.fill = color;
				circleActiveState.properties.fillOpacity = 1;

				button.events.on('hit', handleButtonClick);

				return button;
			}

			// handle button clikc
			function handleButtonClick(event) {
				// we saved name to dummy data
				changeDataType(event.target.dummyData);
			}

			// change data type (active/confirmed/recovered/deaths)
			function changeDataType(name) {
				// make button active
				var activeButton = buttons[name];
				activeButton.isActive = true;
				// make other buttons inactive
				for (var key in buttons) {
					if (buttons[key] != activeButton) {
						buttons[key].isActive = false;
					}
				}
				// tell series new field name
				bubbleSeries.dataFields.value = name;
				bubbleSeries.invalidateData();
				// change color of bubbles
				// setting colors on mapImage for tooltip colors
				bubbleSeries.mapImages.template.fill = colors[name];
				bubbleSeries.mapImages.template.stroke = colors[name];
				// first child is circle
				bubbleSeries.mapImages.template.children.getIndex(0).fill =
					colors[name];

				dateAxis.tooltip.background.fill = colors[name];
				dateAxis.tooltip.background.stroke = colors[name];
				lineChart.cursor.lineX.stroke = colors[name];

				// show series
				var activeSeries = series[name];
				activeSeries.show();
				// hide other series
				for (var key in series) {
					if (series[key] != activeSeries) {
						series[key].hide();
					}
				}
				// update heat rule's maxValue
				bubbleSeries.heatRules.getIndex(0).maxValue = max[name];
			}

			// select a country
			function selectCountry(mapPolygonParam) {
				let mapPolygon = mapPolygonParam;
				resetHover();
				polygonSeries.hideTooltip();

				// if the same country is clicked show world
				if (currentPolygon == mapPolygon) {
					currentPolygon.isActive = false;
					currentPolygon = undefined;
					showWorld();
					return;
				}
				// save current polygon
				currentPolygon = mapPolygon;
				var countryIndex = countryIndexMap[mapPolygon.dataItem.id];
				currentCountry = mapPolygon.dataItem.dataContext.name;

				// make others inactive
				polygonSeries.mapPolygons.each(function(polygonParam) {
					let polygon = polygonParam;
					polygon.isActive = false;
				});

				// clear timeout if there is one
				if (countryDataTimeout) {
					clearTimeout(countryDataTimeout);
				}
				// we delay change of data for better performance (so that data is not changed whil zooming)
				countryDataTimeout = setTimeout(function() {
					setCountryData(countryIndex);
				}, 1000); // you can adjust number, 1000 is one second

				updateTotals(currentIndex, mexicoTimeline);
				updateCountryName();
				mapPolygon.isActive = true;
				mapChart.zoomToMapObject(mapPolygon, getZoomLevel(mapPolygon));
			}

			// change line chart data to the selected countries
			function setCountryData(countryIndex) {
				// instead of setting whole data array, we modify current raw data so that a nice animation would happen
				for (var i = 0; i < lineChart.data.length; i++) {
					var di = mexicoStatesTimeline[i].list;

					var countryData = di[countryIndex];
					var dataContext = lineChart.data[i];
					if (countryData) {
						dataContext.recovered = countryData.recovered;
						dataContext.confirmed = countryData.confirmed;
						dataContext.deaths = countryData.deaths;
						dataContext.active =
							countryData.confirmed -
							countryData.recovered -
							countryData.deaths;
						valueAxis.min = undefined;
						valueAxis.max = undefined;
					} else {
						dataContext.recovered = 0;
						dataContext.confirmed = 0;
						dataContext.deaths = 0;
						dataContext.active = 0;
						valueAxis.min = 0;
						valueAxis.max = 10;
					}
				}

				lineChart.invalidateRawData();
				updateTotals(currentIndex, mexicoTimeline);
				setTimeout(updateSeriesTooltip, 2000);
			}

			function updateSeriesTooltip() {
				var position = dateAxis.dateToPosition(currentDate);
				position = dateAxis.toGlobalPosition(position);
				var x = dateAxis.positionToCoordinate(position);

				lineChart.cursor.triggerMove({x: x, y: 0}, 'soft', true);
				lineChart.series.each(function(seriesParam) {
					let series = seriesParam;
					if (!series.isHidden) {
						series.tooltip.disabled = false;
						series.showTooltipAtDataItem(series.tooltipDataItem);
					}
				});
			}

			// what happens when a country is rolled-over
			function rollOverCountry(mapPolygonParam) {
				let mapPolygon = mapPolygonParam;
				resetHover();
				if (mapPolygon) {
					mapPolygon.isHover = true;

					// make bubble hovered too
					var image = bubbleSeries.getImageById(mapPolygon.dataItem.id);
					if (image) {
						image.isHover = true;
					}
				}
			}
			// what happens when a country is rolled-out
			function rollOutCountry(mapPolygon) {
				var image = bubbleSeries.getImageById(mapPolygon.dataItem.id);
				resetHover();
				if (image) {
					image.isHover = false;
				}
			}

			// rotate and zoom
			function rotateAndZoom(mapPolygon) {
				polygonSeries.hideTooltip();
				var animation = mapChart.animate(
					[
						{property: 'deltaLongitude', to: -mapPolygon.visualLongitude},
						{property: 'deltaLatitude', to: -mapPolygon.visualLatitude}
					],
					1000
				);
				animation.events.on('animationended', function() {
					mapChart.zoomToMapObject(mapPolygon, getZoomLevel(mapPolygon));
				});
			}

			// calculate zoom level (default is too close)
			function getZoomLevel(mapPolygon) {
				var w = mapPolygon.polygon.bbox.width;
				var h = mapPolygon.polygon.bbox.width;
				// change 2 to smaller walue for a more close zoom
				return Math.min(
					mapChart.seriesWidth / (w * 2),
					mapChart.seriesHeight / (h * 2)
				);
			}

			// show world data
			function showWorld() {
				currentCountry = 'México';
				currentPolygon = undefined;
				resetHover();

				if (countryDataTimeout) {
					clearTimeout(countryDataTimeout);
				}

				// make all inactive
				polygonSeries.mapPolygons.each(function(polygonParam) {
					let polygon = polygonParam;
					polygon.isActive = false;
				});

				updateCountryName();

				// update line chart data (again, modifying instead of setting new data for a nice animation)
				for (var i = 0; i < lineChart.data.length; i++) {
					var di = mexicoTimeline[i];
					var dataContext = lineChart.data[i];

					dataContext.recovered = di.recovered;
					dataContext.confirmed = di.confirmed;
					dataContext.deaths = di.deaths;
					dataContext.active = di.confirmed - di.recovered - di.deaths;
					valueAxis.min = undefined;
					valueAxis.max = undefined;
				}

				lineChart.invalidateRawData();

				updateTotals(currentIndex, mexicoTimeline);
				mapChart.goHome();
			}

			// updates country name and date
			function updateCountryName() {
				countryName.text =
					currentCountry +
					', ' +
					mapChart.dateFormatter.format(currentDate, 'MMM dd, yyyy');
			}

			// update total values in buttons
			function updateTotals(index, mexicoTimeline) {
				if (!isNaN(index)) {
					var di = mexicoTimeline[index];
					var date = new Date(di.date);
					currentDate = date;

					updateCountryName();

					var position = dateAxis.dateToPosition(date);
					position = dateAxis.toGlobalPosition(position);
					var x = dateAxis.positionToCoordinate(position);

					if (lineChart.cursor) {
						lineChart.cursor.triggerMove({x: x, y: 0}, 'soft', true);
					}
					for (var key in buttons) {
						buttons[key].label.text =
							buttons[key].textLabel + ': ' + lineChart.data[index][key];
					}
					currentIndex = index;
				}
			}

			// update map data
			function updateMapData(data) {
				//modifying instead of setting new data for a nice animation
				bubbleSeries.dataItems.each(function(dataItemParam) {
					let dataItem = dataItemParam;
					dataItem.dataContext.confirmed = 0;
					dataItem.dataContext.deaths = 0;
					dataItem.dataContext.recovered = 0;
					dataItem.dataContext.active = 0;
				});

				for (var i = 0; i < data.length; i++) {
					var di = data[i];
					var image = bubbleSeries.getImageById(di.id);
					if (image) {
						image.dataItem.dataContext.confirmed = di.confirmed;
						image.dataItem.dataContext.deaths = di.deaths;
						image.dataItem.dataContext.recovered = di.recovered;
						image.dataItem.dataContext.active =
							di.confirmed - di.recovered - di.deaths;
					}
				}
				bubbleSeries.invalidateRawData();
			}

			// capitalize first letter
			function capitalizeFirstLetter(string) {
				return string.charAt(0).toUpperCase() + string.slice(1);
			}

			function handleImageOver(event) {
				rollOverCountry(polygonSeries.getPolygonById(event.target.dataItem.id));
			}

			function handleImageOut(event) {
				rollOutCountry(polygonSeries.getPolygonById(event.target.dataItem.id));
			}

			function handleImageHit(event) {
				selectCountry(polygonSeries.getPolygonById(event.target.dataItem.id));
			}

			function handleCountryHit(event) {
				selectCountry(event.target);
			}

			function handleCountryOver(event) {
				rollOverCountry(event.target);
			}

			function handleCountryOut(event) {
				rollOutCountry(event.target);
			}

			function resetHover() {
				polygonSeries.mapPolygons.each(function(polygonParam) {
					let polygon = polygonParam;
					polygon.isHover = false;
				});

				bubbleSeries.mapImages.each(function(imageParam) {
					let image = imageParam;
					image.isHover = false;
				});
			}

			container.events.on('layoutvalidated', () => {
				dateAxis.tooltip.hide();
				lineChart.cursor.hide();
				updateTotals(currentIndex, mexicoTimeline);
			});

			// set initial data and names
			updateCountryName();
			changeDataType('active');

			setTimeout(updateSeriesTooltip, 3000);

			this.chart = container;
		});
	}
};
</script>

<style scoped>
#chartMapDiv {
	flex: 1;
	height: 50vh;
	min-height: 70rem;
	float: left;
	margin: 0rem 0rem 0rem 0rem;
}
</style>
