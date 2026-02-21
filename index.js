import { createApp, h } from 'vue';
import FloatingVue from 'floating-vue';
import App from './src/components/App.vue';

import 'floating-vue/dist/style.css';

function init(){
	let nodes = document.querySelectorAll('[data-component="mmp-mortgage-calculator"]');
	nodes.forEach( node => {
		if( node.calculator ){
			return;
		}
		else {
			const app = createApp({
				render() {
					return h(App, {
						googleSheetId: node.dataset.googleSheetId,
						googleApiKey: node.dataset.googleApiKey
					});
				}
			});
			app.use(FloatingVue);
			window.calculator = app.mount(node);
		}
	});
}

init();
