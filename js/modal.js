const modal = {
	letItGo: true,
	controls: [
		{ id: 'txt_title', req: true },
		{ id: 'txt_description', req: true },
		{ id: 'dt_saleOn', req: true },
		{ id: 'txt_address', req: true }
		// {id: 'txt_arng_priceddress', req: true}
	],

	init: function (session) {
		this.session = session;
		this.fb = session.fb;

		$('.modal').modal();
		$('.datepicker').datepicker();
		$("#btn_submitPost").on('click', this.onSubmit.bind(this));
	},

	savePost: function (post) {
		post.userId = this.session.logged.uid;
		// console.log(post);
		const key = this.fb.database().ref('posts').push(post).key;
		console.log(key);
	},

	validate: function () {
		for (const current in this.controls) {
			if (this.controls[current].req) {
				const element = $(`#${this.controls[current].id}`);
				if (element.val().trim().length < 1) {
					return false;
				}
			}
		}
		return true;
	},

	onSubmit: function (e) {

		if (this.validate()) {
			const post = {};
			for (const current in this.controls) {
				const element = $(`#${this.controls[current].id}`);
				post[element.attr('name')] = element.val().trim();
			}
			this.letItGo = true;
			this.savePost(post);
			console.log(post);
		} else {
			console.log("Form validation fails!");
			this.letItGo = false;
		}
	}
};




