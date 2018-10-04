// Initialize Firebase
const session = {
	fb: firebase,
	prov: null,
	config: {
		apiKey: "AIzaSyAqqbAs7Ka69UKEe77O4lniiufFHRidj10",
    authDomain: "upcycled-4f19e.firebaseapp.com",
    databaseURL: "https://upcycled-4f19e.firebaseio.com",
    projectId: "upcycled-4f19e",
    storageBucket: "upcycled-4f19e.appspot.com",
    messagingSenderId: "627195428823"
	},
	token: false,
	status: false,
	logged: false,

	init: function () {
		this.fb.initializeApp(this.config);
		this.prov = new firebase.auth.GoogleAuthProvider();
		
		this._configButtons();
	},

	login: function () {

		if (this._session()) {
			this._logged();
			$.LoadingOverlay("hide");
		} else {
			this.fb.auth().getRedirectResult().then(this._handlerRedirect.bind(this)).catch(this._catchRedirect);
		}
	},

	_session: function() {
		let logged = sessionStorage.getItem('logged');
		let ok = !(logged===null);
		
		if (ok) {
			this.logged = JSON.parse(logged);
		}
		return ok;
	},

	_logged: function() {
		$(".div_login").toggleClass('hide');
		$(".div_newPost").toggleClass('hide');
	},

	_handlerRedirect: function (result) {
		$.LoadingOverlay("hide");

		if (result.credential) {
			// This gives you a Google Access Token. You can use it to access the Google API.
			this.token = result.credential.accessToken;
		}
		// The signed-in user info.
		if (result.user===null) {
			console.log('Please relogin');
		} else {
			this.logged = result.user;
			sessionStorage.setItem('logged', JSON.stringify(this.logged));
			this._saveUser();
			this._logged();
		}
	},

	_saveUser: function() {
		let usersRef = this.fb.database().ref("users").once(`value`, function(snap) {
			const dataset = snap.val();
			let ok = true;

			for (const hash in dataset) {
				const current = dataset[hash];
				if (current.uid===this.logged.uid) {
					ok = false;
					break;
				}
			}

			if (ok) {
				const key = this.fb.database().ref('users').push({
					displayName: this.logged.displayName,
					email: this.logged.email,
					metadata: this.logged.metadata,
					uid: this.logged.uid
				}).key;
				console.log('User saved to Firebase!', this.logged);
			} else {
				console.log('User already in Firebase!');
			}
		}.bind(this));
	},

	_catchRedirect: function (error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// The email of the user's account used.
		var email = error.email;
		// The firebase.auth.AuthCredential type that was used.
		var credential = error.credential;
		// ...
	},

	_configButtons: function () {
		$("#linkLogin").on('click', function () {
			this.fb.auth().setPersistence(this.fb.auth.Auth.Persistence.NONE)
				.then(function () {
					var provider = new firebase.auth.GoogleAuthProvider();
					// In memory persistence will be applied to the signed in Google user
					// even though the persistence was set to 'none' and a page redirect
					// occurred.
					return this.fb.auth().signInWithRedirect(this.prov);
				}.bind(this))
				.catch(function (error) {
					console.log(error.code);
					console.log(error.message);
					alert('Firebase Authentification Error!');

					
					// var errorCode = error.code;
					// var errorMessage = error.message;
				}.bind(this));
		}.bind(this));
	},
};