import App from './App.svelte';
// import Habit from './Habit.svelte'

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;