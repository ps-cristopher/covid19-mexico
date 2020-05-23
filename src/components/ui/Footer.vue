<template lang="html">
	<footer class="pr-2 pl-2 pt-2 pb-1">
		<div class="container-fluid">
			<div class="row">
				<div class="col-4 col-md">
					<p class="text-white">Contacto</p>
					<ul class="list-unstyled text-small">
						<li>
							<a
								href="https://cristopherps.com"
								class="text-muted"
								target="_blank"
								rel="noopener"
							>
								<i class="fas fa-globe"></i> Sitio web
							</a>
						</li>
						<li>
							<a
								href="https://twitter.com/ps_cristopher"
								class="text-muted"
								target="_blank"
								rel="noopener"
							>
								<i class="fab fa-twitter"></i> Twitter
							</a>
						</li>
						<li>
							<a
								href="https://www.linkedin.com/in/cristopher-paniagua/"
								class="text-muted"
								target="_blank"
								rel="noopener"
							>
								<i class="fab fa-linkedin-in"></i> Linkedin
							</a>
						</li>
						<li>
							<a
								href="https://github.com/cristopherpaniagua"
								class="text-muted"
								target="_blank"
								rel="noopener"
							>
								<i class="fab fa-github"></i> Github
							</a>
						</li>
						<li>
							<a href="mailto:info@cristopherps.com" class="text-muted">
								<i class="fas fa-envelope"></i> Email
							</a>
						</li>
					</ul>
				</div>
				<div class="col-6 col-md text-center">
					<p class="text-white mb-1 text-muted">
						<small>Powered by</small>
					</p>
					<ul class="list-unstyled">
						<li class="mb-2">
							<a href="https://cristopherps.com" target="_blank" rel="noopener">
								<img
									src="@/assets/logo-white-cristopherps.png"
									width="120rem"
									class="mr-2"
									alt="Logotipo CristopherPS"
								/>
							</a>
						</li>
						<li class="mb-1 ml-2">
							<a href="https://getbootstrap.com" target="_blank" rel="noopener">
								<img
									src="@/assets/bootstrap-logo.png"
									width="20rem"
									class="mr-2"
									alt="Logotipo Bootstrap"
								/>
							</a>
							<a href="https://vuejs.org" target="_blank" rel="noopener">
								<img src="@/assets/vue-logo.png" width="20rem" class="mr-2" alt="Logotipo Vue"/>
							</a>
							<a href="https://webpack.js.org" target="_blank" rel="noopener">
								<img
									src="@/assets/webpack-logo.png"
									width="20rem"
									class="mr-2"
									alt="Logotipo Webpack"
								/>
							</a>
						</li>
						<li class="ml-2">
							<a href="https://www.amcharts.com" target="_blank" rel="noopener">
								<img
									src="@/assets/amcharts-logo.png"
									width="60rem"
									class="mr-2"
									alt="Logotipo Amcharts"
								/>
							</a>
						</li>
						<li>
							<small class="d-block mb-3 text-muted">2020</small>
						</li>
					</ul>
				</div>
				<div class="col-2 col-md text-right">
					<p class="float-right">
						<a href="#" class="btn btn-primary btn-sm">
							<i class="fas fa-arrow-up" style="font-size: 1.5rem;"></i>
						</a>
					</p>
				</div>
			</div>
		</div>
	</footer>
</template>

<script>
export default {
	name: 'Footer'
};
</script>
