<template lang="html">
	<main role="main">
		<vue-amount-cards :isSmall="true" />

		<div class="container-fluid mt-4">
			<div class="row">
				<div class="col-md">
					<h5 class="text-center text-muted">
						<small>
							<strong>EDADES EN CASOS CONFIRMADOS</strong>
						</small>
					</h5>
					<vue-pie-chart id="chartDiv2" :data="[
						{
							country: '0 - 29',
							litres: 301,
							color: '#45B39D'
						},
						{
							country: '30 - 59',
							litres: 301,
							color: '#F5B041'
						},
						{
							country: '+59',
							litres: 301,
							color: '#F4D03F'
						}
					]
					"></vue-pie-chart>
				</div>
				<div class="col-md">
					<h5 class="text-center text-muted">
						<small>
							<strong>SEXO EN CASOS CONFIRMADOS</strong>
						</small>
					</h5>
					<vue-pie-chart id="chartDiv1" :data="[
						{
							country: 'Hombres',
							litres: 501,
							color: '#5499C7'
						},
						{
							country: 'Mujeres',
							litres: 301,
							color: '#AF7AC5'
						}
					]
					"></vue-pie-chart>
				</div>
			</div>
			<div class="row">
				<div class="col mt-2 text-right d-flex justify-content-end">
					<div class="dropdown export-options">
						<button
							id="dropdownMenuButton"
							@click="showingExportOptions = !showingExportOptions"
							class="btn btn-primary dropdown-toggle"
							type="button"
						>
							Exportar
						</button>
						<div
							class="dropdown-menu text-center"
							v-show="showingExportOptions"
						>
							<a class="dropdown-item" @click="exportData('xls')">xls</a>
							<a class="dropdown-item" @click="exportData('csv')">csv</a>
							<a class="dropdown-item" @click="exportData('txt')">txt</a>
						</div>
					</div>
				</div>
				<div class="col-12 mt-2">
					<input
						type="search"
						class="form-control mr-sm-2"
						placeholder="Escribe para buscar"
						v-model="textFilterInputValue"
					/>
				</div>
			</div>
			<div
				class="table-responsive mt-2"
				v-if="rowsToRender && rowsToRender.length > 0"
			>
				<table class="table table-sm table-hover table-borderless">
					<thead>
						<tr>
							<th
								v-for="(header, headerKey) in tableFields"
								:key="`row-${headerKey}`"
								:class="`text-center text-white th-header ${header.class}`"
								@click="sortData(headerKey)"
							>
								{{ header.label }}
								<span v-if="header.sortable" style="padding-left: 0.5rem;">
									<i class="fas fa-sort" v-if="header.isSorting == null"></i>
									<i class="fas fa-sort-up" v-else-if="header.isSorting"></i>
									<i class="fas fa-sort-down" v-else></i>
								</span>
							</th>
						</tr>
					</thead>
					<transition-group tag="tbody" name="slide-up" mode="in-out" appear>
						<tr v-for="row in rowsToRender" :key="row.id">
							<th
								class="table-light text-center text-muted"
								style="white-space: nowrap;"
							>
								{{ row.name }}
							</th>
							<td class="table-secondary text-center text-muted text-monospace">
								{{ row.confirmed }}
							</td>
							<td class="table-warning text-center text-muted text-monospace">
								{{ row.active }}
							</td>
							<td class="table-danger text-center text-muted text-monospace">
								{{ row.deaths }}
							</td>
							<td class="table-success text-center text-muted text-monospace">
								{{ row.recovered }}
							</td>
						</tr>
					</transition-group>
				</table>
			</div>
		</div>
	</main>
</template>

<script>
import helpers from '@/helpers';
import Moment from 'moment';
import NProgress from 'nprogress';
import FileSaver from 'file-saver';

export default {
	name: 'Detail',
	timeoutFilter: null,
	created() {
		NProgress.done();
	},
	data() {
		return {
			textFilterInputValue: '',
			textFilterQuery: '',
			showingExportOptions: false,
			tableFields: {
				id: {
					label: 'Estado',
					sortable: true,
					type: 'string',
					isSorting: true,
					class: 'bg-primary  first-column'
				},
				confirmed: {
					label: 'Confirmados',
					sortable: true,
					type: 'number',
					isSorting: null,
					class: 'bg-secondary'
				},
				active: {
					label: 'Activos',
					sortable: true,
					type: 'number',
					isSorting: null,
					class: 'bg-warning'
				},
				deaths: {
					label: 'Fallecidos',
					sortable: true,
					type: 'number',
					isSorting: null,
					class: 'bg-danger'
				},
				recovered: {
					label: 'Recuperados',
					sortable: true,
					type: 'number',
					isSorting: null,
					class: 'bg-success  last-column'
				}
			}
		};
	},
	computed: {
		rows() {
			return this.$store.state.mexicoStates.map((state) => {
				state.active = state.confirmed - (state.recovered + state.deaths);
				return state;
			});
		},
		rowsToRender() {
			if (!this.rows) return [];
			let rowKeys = Object.keys(this.tableFields);

			let filteredItems = this.rows
				.map((row) => {
					return row;
				})
				.filter((row) => {
					let match = true;
					if (this.textFilterQuery)
						match = helpers.table.matchStringFromQuery(
							this.textFilterQuery,
							JSON.stringify(row)
						);
					return match;
				});

			let headerSortingKey = rowKeys.find((header) => {
				return this.tableFields[header].isSorting != null;
			});

			if (headerSortingKey) {
				let headerSorting = this.tableFields[headerSortingKey];
				switch (headerSorting.type) {
					case 'number':
						if (headerSorting.isSorting)
							filteredItems = helpers.table.orderByNumber(
								filteredItems,
								headerSortingKey
							);
						else
							filteredItems = helpers.table.orderByNumber(
								filteredItems,
								headerSortingKey,
								-1
							);
						break;
					default:
						if (headerSorting.isSorting)
							filteredItems = helpers.table.orderByString(
								filteredItems,
								headerSortingKey
							);
						else
							filteredItems = helpers.table.orderByString(
								filteredItems,
								headerSortingKey,
								-1
							);
				}
			}

			return filteredItems;
		}
	},
	watch: {
		textFilterInputValue() {
			clearTimeout(this.timeoutFilter);

			if (
				this.textFilterInputValue === '' ||
				this.textFilterInputValue.length < 3
			) {
				this.textFilterQuery = '';
				return;
			}

			this.timeoutFilter = setTimeout(() => {
				this.textFilterQuery = this.textFilterInputValue;
			}, 750);
		}
	},
	methods: {
		getDataString() {
			let headers = this.tableFields;
			let headerKeys = Object.keys(headers);
			let rows = this.rowsToRender;
			let string = '';
			headerKeys.forEach(
				(headerKey) =>
					(string += `${helpers.table.removeAccentsFromString(
						headers[headerKey].label
					)}\t`)
			);

			string += '\n';

			rows.forEach((row) => {
				headerKeys.forEach(
					(headerKey) =>
						(string +=
							helpers.table.removeAccentsFromString(row[headerKey] || '') +
							'\t')
				);
				string += '\n';
			});
			return string;
		},
		exportData(extension) {
			let title = 'COVID-19 México ';
			let reportDate = Moment(new Date()).format('YYYY-MM-DD');
			let reportName = `${title}${reportDate}-bycristopherps.${extension}`;
			let dataString = this.getDataString();
			let type = '';
			switch (extension) {
				case 'txt':
					type = 'text/plain;charset=utf-8';
					break;
				case 'csv':
					type = 'text/plain;charset=utf-8';
					break;
				default:
					type = 'application/vnd.ms-excel;charset=utf-8';
					break;
			}
			let blob = new Blob([dataString], {type});
			FileSaver.saveAs(blob, reportName);
		},
		sortData(key) {
			let headerKeys = Object.keys(this.tableFields);

			headerKeys.forEach((headerKey) => {
				if (headerKey != key) this.tableFields[headerKey].isSorting = null;
			});

			this.tableFields[key].isSorting = !this.tableFields[key].isSorting;
		}
	}
};
</script>
