import App from './App.svelte';

// document.onkeypress = (e) => {
// 	console.log(e)
// }
const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;