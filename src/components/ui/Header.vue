<template lang="html">
	<header>
		<div class="navbar navbar-dark navbar-top bg-dark">
			<a href="/" class="navbar-brand d-flex align-items-center">
				<img
					src="@/assets/logo-white-cristopherps.png"
					width="150rem"
					class="mr-2"
					alt="Logotipo CristopherPS"
				/>
			</a>
			<span class="navbar-text text-white">
				<h3>COVID 19 México 🇲🇽</h3>
			</span>
			<form class="form-inline my-2 my-lg-0">
				<a
					class="btn btn-secondary btn-sm mr-2"
					style="width: 8rem;"
					rel="noopener"
					@click="share()"
				>
					<i class="fab fa-twitter"></i>
					<strong>Compartir</strong>
				</a>
				<a
					class="btn btn-primary btn-sm"
					@click="showingAboutSection = !showingAboutSection"
					style="min-width: 8rem;"
				>
					<i class="fas fa-info-circle"></i>
					<strong>{{
						showingAboutSection ? 'Ocultar información' : 'Información'
					}}</strong>
				</a>
			</form>
		</div>

		<!-- <hr class="mt-0 mb-0" style="border: 0.5px solid rgb(255, 255, 255, 1);background-color:"> -->

		<transition name="fade" mode="out-in">
			<div
				class="navbar navbar-dark bg-dark shadow-sm"
				id="navbarHeader"
				v-show="showingAboutSection"
			>
				<div
					class="alert alert-primary alert-dismissible show mb-0 mt-0"
					style="width: 100%;"
					v-show="showingInfoAlert"
				>
					<h5 class="alert-heading">¡Importante!</h5>
					<hr />
					<p>
						Para recibir ayuda y más información detallada acerca del COVID-19
						en méxico, entra a
						<a
							href="http://coronavirus.gob.mx"
							target="_blank"
							rel="noopener"
							class="alert-link"
						>
							coronavirus.gob.mx
						</a>
					</p>
					<button type="button" class="close" @click="showingInfoAlert = false">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="container-fluid">
					<div class="row">
						<div class="col-sm-10 py-4">
							<h4 class="text-white">Información</h4>
							<p class="text-justify">
								Todos los datos aquí mostrados son obtenidos solo de fuentes
								oficiales y comunicados de la
								<a
									href="https://coronavirus.gob.mx/"
									target="_blank"
									rel="noopener"
								>
									Secretaria de Salud de México
								</a>
							</p>
							<p class="text-justify">
								Los datos
								<label class="text-warning">
									no se actualizan en tiempo real </label
								>, son actualizados tan pronto es posible después que la
								<a
									href="https://coronavirus.gob.mx/"
									target="_blank"
									rel="noopener"
								>
									Secretaría de Salud
								</a>
								realiza su comunicado y reporte técnico diario.
							</p>
							<p class="text-justify">
								Proyecto sin fines de lucro ni intereses políticos; el código
								fuente es abierto y está disponible en
								<a
									href="https://github.com/cristopherpaniagua/covid19-mexico"
									target="_blank"
									rel="noopener"
								>
									<i class="fab fa-github"></i> Github </a
								>. Para mayor información, por favor usar los medios de contacto
								aquí mostrados, con gusto te escucharé.
								<label class="text-warning">#QuédateEnCasa</label>
							</p>
							<p class="text-justify">
								Si lo deseas puedes ayudar a sostener este proyecto y contribuir
								a la realización de mejoras a través de
								<a
									href="https://www.paypal.me/pscristopher"
									target="_blank"
									rel="noopener"
								>
									este medio <i class="fas fa-money-check-alt"></i>
								</a>
								o con alguna colaboración en
								<a
									href="https://github.com/cristopherpaniagua/covid19-mexico"
									target="_blank"
									rel="noopener"
								>
									<i class="fab fa-github"></i> Github.
								</a>
							</p>
							<h5>Última actualización:</h5>
							<label class="text-warning"
								>{{ mexicoData.date }} a las 00:00 a. m.</label
							>
						</div>
						<div class="col-sm-2 py-4">
							<h4 class="text-white">Contacto</h4>
							<ul class="list-unstyled">
								<li>
									<a
										href="https://cristopherps.com"
										class="text-white"
										target="_blank"
										rel="noopener"
									>
										<i class="fas fa-globe"></i> Sitio web
									</a>
								</li>
								<li>
									<a
										href="https://twitter.com/ps_cristopher"
										class="text-white"
										target="_blank"
										rel="noopener"
									>
										<i class="fab fa-twitter"></i> Twitter
									</a>
								</li>
								<li>
									<a
										href="https://www.linkedin.com/in/cristopher-paniagua/"
										class="text-white"
										target="_blank"
										rel="noopener"
									>
										<i class="fab fa-linkedin-in"></i> Linkedin
									</a>
								</li>
								<li>
									<a
										href="https://github.com/cristopherpaniagua"
										class="text-white"
										target="_blank"
										rel="noopener"
									>
										<i class="fab fa-github"></i> Github
									</a>
								</li>
								<li>
									<a href="mailto:info@cristopherps.com" class="text-white">
										<i class="fas fa-envelope"></i> Email
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</transition>

		<hr
			class="mt-0 mb-0"
			style="border: 0.5px solid rgb(255, 255, 255, 1);background-color:"
		/>

		<nav class="navbar navbar-expand navbar-dark bg-dark">
			<ul class="navbar-nav">
				<li :class="getNavItemClass('dashboard')">
					<router-link class="nav-link" to="dashboard">
						<strong>Inicio</strong><span class="sr-only">(current)</span>
					</router-link>
				</li>
				<li :class="getNavItemClass('detail')">
					<router-link class="nav-link" to="detail">
						<strong>Detalle</strong>
					</router-link>
				</li>
			</ul>
		</nav>
		<div class="alert alert-danger mb-0 mt-0 pt-0 pb-0 text-center">
			<strong>API en desarrollo. ¡Datos falsos!.</strong>
		</div>
	</header>
</template>

<script>
export default {
	name: 'Header',
	created() {
		this.currentRoute = this.$router.currentRoute;
	},
	data() {
		return {
			showingAboutSection: false,
			showingInfoAlert: true,
			currentRoute: null
		};
	},
	watch: {
		$route(to, from) {
			this.currentRoute = to;
		}
	},
	computed: {
		mexicoData() {
			return this.$store.state.mexico;
		}
	},
	methods: {
		getNavItemClass(routeName) {
			if (this.currentRoute.name == routeName) return 'nav-item active';
			else return 'nav-item';
		},
		share() {
			window.open(`https://twitter.com/intent/tweet
			?text=Mira el estado del Covid19 en México
			&size=large
			&url=https://covid19mexico.cristopherps.com
			&hashtags=covid19mx,quedateencasa
			&via=ps_cristopher`, '_blank', 'width=500,height=300,scrollbars=NO,location=NO,titlebar=NO');
		}
	}
};
</script>
