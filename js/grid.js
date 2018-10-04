const grid = {
	$container: $("#div_tilesContainer"),

	init: function (session) {
		$.LoadingOverlay("show", {text: "Loading..."});

		this.session = session;
		this.fb = this.session.fb;

		let postRef = this.fb.database().ref("posts").once(`value`, function (snap) {
			const dataset = snap.val();

			for (const hash in dataset) {
				const record = dataset[hash];
				const card = $(`<div class="col s12 m4 l3">`).html(`
					<div class="card medium">
							<div class="card-image">
									<img src="image/ex6.jpg">
									
							</div>
							<div class="card-content">
									<span class="card-title">${record.postTitle}</span>
									<p>${record.postDesc}</p>
									
									<div id="modal-${hash}" class="modal">
											<div class="modal-content">
													<h4>${record.postTitle}</h4>
													<p>${record.postDesc}</p>
													<ul>
															<li><strong>Date:</strong> ${record.postDate}</li>
															<li><strong>Address:</strong> ${record.postAddress}</li>
													</ul>
											</div>
											<div class="modal-footer">
													<a href="#!" class="modal-close waves-effect waves-green btn-flat">Done</a>
											</div>
									</div>
							</div>
							<div class="card-action">
							<div class="row">
							<div class="col s6">
								<a class="waves-effect waves-light btn modal-trigger" href="#modal-${hash}">See More</a>
							</div>
							<div class="col s6">
								<a class="waves-effect waves-light btn on-map" href="#map" data-address="${record.postAddress}">Map</a>
							</div>
					</div>
							</div>
					</div>
				`);
				// console.log(record);
				this.$container.append(card);
			}
			$('.modal').modal();
			$('.on-map').on('click', function(e) {
				
				$("#txt_zipCode").val($(e.currentTarget).attr('data-address'));

				// Create the search box and link it to the UI element.
				// var input = document.getElementById('txt_zipCode');
				// var searchBox = new google.maps.places.SearchBox(input);
				console.log('search box', window.searchBox);
				google.maps.event.trigger(window.map, 'bounds_changed');
				google.maps.event.trigger(window.searchBox, 'place_changed');
				console.log('Event!');
			});
			$.LoadingOverlay("hide");
		}.bind(this));
	}
};