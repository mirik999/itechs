import * as firebase from 'firebase'

const config = {
	apiKey: "AIzaSyA8PEm7fAWz94QLu3Y6_dp2yOd-0IHOlDU",
	authDomain: "itechs-810f3.firebaseapp.com",
	databaseURL: "https://itechs-810f3.firebaseio.com",
	projectId: "itechs-810f3",
	storageBucket: "itechs-810f3.appspot.com",
	messagingSenderId: "432237850157"
};
firebase.initializeApp(config);

export const githubAuth = new firebase.auth.GithubAuthProvider();
export const auth = firebase.auth();

export default firebase;