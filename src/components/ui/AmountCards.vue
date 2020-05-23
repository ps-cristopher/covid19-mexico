<template lang="html">
	<section class="mt-4 mb-0 text-center">
		<div class="container-fluid">
			<transition name="slide-up" mode="in-out" appear>
				<div class="row" v-if="!isSmall">
					<div class="col col-lg" style="min-width: 13rem;min-height: 10rem;">
						<div
							class="card text-white mb-3"
							style="min-width: 100%;min-height: 10rem;"
						>
							<div class="card-header bg-secondary">
								Confirmados
							</div>
							<div class="card-body mt-2">
								<h2 class="card-title text-secondary text-monospace">
									{{ formatNumbers(currentData.confirmed) }}
								</h2>
							</div>
							<div class="card-footer text-muted">
								<small>Número de casos confirmados</small>
							</div>
						</div>
					</div>
					<div class="col col-lg" style="min-width: 13rem;min-height: 10rem;">
						<div
							class="card text-white mb-3"
							style="min-width: 100%;min-height: 10rem;"
						>
							<div class="card-header bg-warning">
								Activos
							</div>
							<div class="card-body mt-2">
								<h2 class="card-title text-warning text-monospace">
									{{ formatNumbers(currentData.active) }}
								</h2>
							</div>
							<div class="card-footer text-muted">
								<small>Número de casos aún activos</small>
							</div>
						</div>
					</div>
					<div class="col col-lg" style="min-width: 13rem;min-height: 10rem;">
						<div
							class="card text-white mb-3"
							style="min-width: 100%;min-height: 10rem;"
						>
							<div class="card-header bg-danger">
								Fallecidos
							</div>
							<div class="card-body mt-2">
								<h2 class="card-title text-danger text-monospace">
									{{ formatNumbers(currentData.deaths) }}
								</h2>
							</div>
							<div class="card-footer text-muted">
								<small>Número de lamentables muertes</small>
							</div>
						</div>
					</div>
					<div class="col col-lg" style="min-width: 13rem;min-height: 10rem;">
						<div
							class="card text-white mb-3"
							style="min-width: 100%;min-height: 10rem;"
						>
							<div class="card-header bg-success">
								Recuperados
							</div>
							<div class="card-body mt-2">
								<h2 class="card-title text-success text-monospace">
									{{ formatNumbers(currentData.recovered) }}
								</h2>
							</div>
							<div class="card-footer text-muted">
								<small>Número de casos curados</small>
							</div>
						</div>
					</div>
				</div>
			</transition>
			<transition name="slide-up" mode="in-out" appear>
				<div class="table-responsive mt-2" v-if="isSmall">
					<table class="table table-sm table-hover table-borderless">
						<thead>
							<tr>
								<th class="bg-secondary text-center text-white first-column">
									Confirmados
								</th>
								<th class="bg-warning text-center text-white">Activos</th>
								<th class="bg-danger text-center text-white">Fallecidos</th>
								<th class="bg-success text-center text-white last-column">
									Recuperados
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td
									class="table-secondary text-center text-muted text-monospace"
								>
									{{ formatNumbers(currentData.confirmed) }}
								</td>
								<td class="table-warning text-center text-muted text-monospace">
									{{ formatNumbers(currentData.active) }}
								</td>
								<td class="table-danger text-center text-muted text-monospace">
									{{ formatNumbers(currentData.deaths) }}
								</td>
								<td class="table-success text-center text-muted text-monospace">
									{{ formatNumbers(currentData.recovered) }}
								</td>
							</tr>
							<tr>
								<td class="table-light text-muted text-center">
									<small>Número de casos confirmados</small>
								</td>
								<td class="table-light text-muted text-center">
									<small>Número de casos aún activos</small>
								</td>
								<td class="table-light text-muted text-center">
									<small>Número de lamentables muertes</small>
								</td>
								<td class="table-light text-muted text-center">
									<small>Número de casos curados</small>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</transition>
			<transition name="slide-up" mode="in-out" appear>
				<div class="row">
					<div class="col text-center">
						<span class="badge badge-warning">
							Última actualización {{ mexicoData.date }}
						</span>
					</div>
				</div>
			</transition>
		</div>
	</section>
</template>

<script>
import helpers from '@/helpers';
export default {
	name: 'AmountCard',
	props: ['isSmall'],
	data() {
		return {
			currentData: {
				confirmed: 0,
				deaths: 0,
				recovered: 0,
				active: 0
			}
		};
	},
	created() {
		this.initCount(this.mexicoData.confirmed, 'confirmed');
		this.initCount(this.mexicoData.deaths, 'deaths');
		this.initCount(this.mexicoData.recovered, 'recovered');
		this.initCount(
			this.mexicoData.confirmed - (this.mexicoData.deaths + this.mexicoData.recovered),
			'active'
		);
	},
	computed: {
		mexicoData() {
			return this.$store.state.mexico;
		}
	},
	methods: {
		formatNumbers(number) {
			return helpers.numbers.formatNumbers(number);
		},
		initCount(number, key, duration = 500) {
			let sum = number / (duration / 10);
			if (this.currentData[key] < number) {
				setTimeout(() => {
					this.currentData[key] += sum;
					this.initCount(number, key);
				}, 10);
			}
		}
	}
};
</script>
