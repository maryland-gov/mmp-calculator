<template lang="pug">
form.usa-form.mmp-calculator__form(@submit.prevent="calculate")
	.usa-form-group(v-for="(field, index) in fields", :key="index")
		transition(name="forminput")
			div(:data-name="field.name")
				label.usa-label
					span(v-html="field.label")
					span.tooltip-icon(
						v-if="field.tooltip",
						v-tooltip.top-start="{content: field.tooltip, trigger: 'hover click'}",
						@focus="tooltipFocus"
					)
				span.usa-hint(
					v-if="field.description",
					v-html="field.description"
				)

				template(v-if="field.Type == 'Currency'")
					.usa-input-group
						span.usa-input-prefix(aria-hidden="true") $
						masked-input.usa-input(
							type="text",
							v-model="formdata[field.name]",
							mask-type="currency"
						)

				template(v-else-if="field.Type == 'Yes No Question'")
					.usa-radio-group
						.usa-radio
							input.usa-radio__input(type="radio",:id="field.name + '_no'",:name="field.name",value="N",v-model="formdata[field.name]")
							label.usa-radio__label(:for="field.name + '_no'") No
						.usa-radio
							input.usa-radio__input(type="radio",:id="field.name + '_yes'",:name="field.name",value="Y",v-model="formdata[field.name]")
							label.usa-radio__label(:for="field.name + '_yes'") Yes

				template(v-else-if="field.Type == 'BuiltIn' && field.name == 'householdSize'")
					.usa-radio-group
						.usa-radio
							input.usa-radio__input(type="radio",id="householdSize_1",name="householdSize",value="1",v-model="formdata.householdSize")
							label.usa-radio__label(for="householdSize_1") 1
						.usa-radio
							input.usa-radio__input(type="radio",id="householdSize_2",name="householdSize",value="2",v-model="formdata.householdSize")
							label.usa-radio__label(for="householdSize_2") 2
						.usa-radio
							input.usa-radio__input(type="radio",id="householdSize_3",name="householdSize",value="3+",v-model="formdata.householdSize")
							label.usa-radio__label(for="householdSize_3") 3+

				template(v-else-if="field.Type == 'BuiltIn' && field.name == 'location'")
					select.usa-select(v-model="formdata.location")
						option(value="",disabled,hidden) Select County
						option(v-for="county in counties", :key="county") {{ county }}

					.usa-radio-group(v-if="displayTargeting")
						.usa-radio
							input.usa-radio__input(type="radio",id="targeted_yes",name="targeted",value="Y",v-model="formdata.targeted")
							label.usa-radio__label(for="targeted_yes") Targeted
						.usa-radio
							input.usa-radio__input(type="radio",id="targeted_no",name="targeted",value="N",v-model="formdata.targeted")
							label.usa-radio__label(for="targeted_no") Non-Targeted

					span.usa-hint.-limits-footnote(v-if="targetingFootnote",v-html="targetingFootnote")

	.mmp-calculator__form-actions
		button.usa-button(
			type="submit",
			:disabled="calculateButtonDisabled"
		) {{ calculateButtonText }}
		| &nbsp;
		button.usa-button.usa-button--outline(
			v-if="showPrintButton",
			type="button",
			@click="print"
		) {{ printButtonText }}

		br

		.mmp-calculator__share(v-if="showPrintButton")
			label.usa-label Share your results
			.usa-input-group.mmp-calculator__share-input
				input.usa-input(
					type="text",
					:value="shareableUrl",
					readonly
				)
				a.mmp-calculator__share-btn(
					target="_blank",
					:href="shareableUrl",
					@click="copyToClipboard"
				)
					svg(aria-hidden="true" focusable="false" data-prefix="far" data-icon="copy" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512")
						path(fill="currentColor" d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z")
					div.mmp-calculator__copy-message(
						v-html="copyMessage",
						:class="{'animated fadeInUp': !!copyMessage}"
					)

				a.mmp-calculator__share-btn(
					target="_blank",
					:href="mailToUrl"
				)
					svg(aria-hidden="true" focusable="false" data-prefix="far" data-icon="envelope" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512")
						path(fill="currentColor" d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z")
</template>

<script>
import MaskedInput from './MaskedInput.vue';
import copy from "../helpers/copy";

export default {
	
	components: {
		MaskedInput
	},
	
	props: [
		"values",
		"settings",
		"limits",
		"fields"
	],
	
	data: function() {
		return {
			formdata:{},
			copyMessage: ""
		};
	},
	
	created : function(){
		this.formdata = Object.assign({}, this.values.data);
	},
	
	computed : {
		json: function(){
			return JSON.stringify( this.$data );
		},
		counties : function(){
			return this.limits.map( limit => limit.county );
		},
		locationLimit : function(){
			return this.limits.find( limit => limit.county === this.formdata.location );
		},
		displayTargeting : function(){
			let limit = this.limits.find( limit => limit.county === this.formdata.location );
			return limit && limit.note == "2";
		},
		targetingFootnote : function(){
			let limit = this.limits.find( limit => limit.county === this.formdata.location );
			if( limit && limit.note === "2" ){
				return copy.get("Limits Footnote 2");
			}
			if( limit && limit.note == "1" ){
				return copy.get("Limits Footnote 1");
			}
			return false;
		},
		showCalculateButton : function(){
			for( let f of this.fields ){
				if( this.formdata[f.name] === undefined ){
					return false;
				}
			}
			return true;
		},
		showPrintButton : function(){
			return this.showCalculateButton && this.hasCalculated;
		},
		hasCalculated : function(){
			for(var key in this.values.data) {
				if(this.values.data.hasOwnProperty(key)){
					return true;
				}
			}
			return false;
		},
		calculateButtonText : function(){
			return this.hasCalculated ? 
				copy.get("Recalculate",{},true) :
	    		copy.get("Calculate",{},true);
		},
		calculateButtonDisabled : function(){
			
			for( let field of this.fields ){
				if( this.formdata[field.name] === undefined ){
					return true;
				}
				else if( field.name == 'location' && 
				         this.locationLimit.note === '2' &&
							   this.formdata.targeted === undefined ){
					return true;
				}
			}
			return false;
		},
		printButtonText : function(){
			return copy.get("Print",{},true);
		},
		progressText : function(){
			let count = 0;
			for( let f of this.fields ){
				if( this.showField(f) ){
					count++;
				}
				else {
					break;
				}
			}
			return 'Question '+count+' of '+this.fields.length;
		},
		
		shareableUrl : function(){
			let url = location.protocol+'//'+location.hostname+(location.port?":"+location.port:"")+location.pathname+(location.search?location.search:"");
			url+='#'+(btoa(JSON.stringify(this.values.data)));
			return url;
		},
		
		mailToUrl : function(){
			let subject = encodeURIComponent(copy.get("Email Subject",{},true));
			let url = encodeURIComponent(this.shareableUrl);
			return `mailto:?to=&subject=${subject}&body=${this.shareableUrl}`;
		}
	},
	
	watch : {
		values : function(newVal, oldVal) {
			for( let i in newVal ){
				this.formdata[i] = newVal[i];
			}
			this.$forceUpdate();
			this.calculate();
		}
	},

	methods : {
		calculate : function(e){
			this.values.data = Object.assign({}, this.formdata);
			this.$emit('calculate');
		},
		
		showField : function(field){
			for(let i = 0; i<this.fields.length; i++){
				let f = this.fields[i];
				
				if( f !== field && this.formdata[f.name] === undefined ){
					return false;
				}
				else if( f !== field && f.name === 'location' && this.formdata[f.name] ){
					if( this.displayTargeting && this.formdata['targeted'] === undefined ){
						return false;
					}
				}
				else if( f === field ){
					return true;
				}
			}
			return false;
		},
		
		nextButtonDisabled : function(){
			if( !this.$el ){
				return true;
			}
			for( let f in this.fields ){
				console.log( 
					f, 
					this.$el.querySelector('label[data-name="'+f.name+'"]')
				);
				if( this.showField(f) && !this.$el.querySelector('label[data-name="'+f.name+'"]')){
					return true;
				}
			}
			return false;
		},
		
		/**
		 * Go to newly created elements on tab
		 * @param  Event e event
		 * @return void 
		 */
		onTab : function(e){
			if( e.shiftKey ) return;
			
			let selector = 'input,select';
			let input = e.target.closest(selector);
			let group = e.target.closest('.mmp-calculator__form-group');
			
			setTimeout(()=>{
				
				// check for another 
				let all = group.querySelectorAll(selector);
				
				let next = null;
				let getNext = false;
				let curName = false;
				
				for( let i =0; i < all.length; i++ ){
					
					let el = all[i];
					
					if( el === input ){
						getNext = true;
						curName = input.name; 
					}
					
					else if( getNext && (!curName || (el.name !== curName)) ){
						next = el;
						break;
					}
					
				}
				
				if( !next ){
					let nextGroup = group.nextElementSibling;
					if( nextGroup && nextGroup.matches('.mmp-calculator__form-group') ){
						next = nextGroup.querySelector(selector);
					}
				}
			
				if( next ) {
					next.focus();
				}
			},0);
		},
		
		tooltipFocus : function(e){
			e.preventDefault();
		},
		
		print : function(){
			
			window.print();
		},
		
		setData : function( data ){
			this.formdata = data;
			if( !this.nextButtonDisabled ){
				this.calculate();
			}
		},
		
		preventDefault : function(e){
			e.preventDefault();
		},

		copyToClipboard : function(e){
			e.preventDefault();
			navigator.clipboard.writeText(this.shareableUrl).then(() => {
				this.copyMessage = 'The link has been copied!';
			}).catch(() => {
				this.copyMessage = 'Press Ctrl+C to copy the link';
			});
			clearTimeout(this.copyMessageTimeout);
			this.copyMessageTimeout = setTimeout(() => {
				this.copyMessage = '';
			}, 3000);
		}
	}
};
</script>

<style lang="scss">
.mmp-calculator__form {
	@media print {
		display: flex;
		flex-wrap: wrap;
	}

	.usa-form-group {
		@media print {
			width: 50%;
			margin-bottom: 2rem;
		}
	}

	.usa-label {
		.tooltip-icon {
			position: relative;
			margin-left: 0.25rem;
			top: -0.1em;
		}
	}

	.usa-hint {
		display: block;
		p {
			font-size: 14px;
			margin-bottom: 0 !important;
		}
	}

	.usa-radio-group {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.5rem;
		.usa-radio {
			margin-top: 0;
		}
	}

	&-actions {
		margin-top: 1.5rem;
		padding-top: 1rem;
		@media print {
			display: none;
		}
		.usa-button + .usa-button {
			margin-left: 0.5rem;
		}
	}
}

.mmp-calculator__copy-message {
	position: absolute;
	bottom: 100%;
	left: 50%;
	transform: translateX(-50%);
	margin-bottom: 10px;
	background: rgba(0,0,0,0.9);
	color: #fff;
	pointer-events: none;
	font-size: 12px;
	white-space: nowrap;
	padding: 2px 10px;
	line-height: 1.5;
	display: none;
	z-index: 2;
}

.mmp-calculator__share {
	display: block;
	margin-top: 20px;
	&-input {
		display: flex;
		width: 100%;
		.usa-input {
			flex: 1;
		}
	}
	&-btn {
		position: relative;
		color: #08c;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 2.5em;
		width: 2.5em;
		padding: 0;
		background: #f2f2f2;
		border: 1px solid #d8d8d8;
		box-sizing: border-box;
		margin-left: -1px;
	}
	svg {
		display: inline-block;
		height: 1.2em;
		width: auto;
	}
}

.-limits-footnote {
	display: block;
	margin-top: 0.5rem;
	font-size: 12px;
	font-weight: 400;
	p {
		font-size: inherit !important;
		line-height: 1.5;
	}
}
</style>

<style lang="scss">
.forminput-enter-active {
  transition: all .3s ease;
}
.forminput-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.forminput-enter-from, .forminput-leave-to {
  transform: translateX(10px);
  opacity: 0;
}


@keyframes fadeInUp {
    from {
        transform: translate3d(-50%,15px,0)
    }

    to {
        transform: translate3d(-50%,0,0);
        opacity: 1
    }
}

@-webkit-keyframes fadeInUp {
    from {
        transform: translate3d(-50%,10px,0);
    }

    to {
        transform: translate3d(-50%,0,0);
        opacity: 1;
    }
}

.animated {
	display: block;
    animation-duration: 0.2s;
    animation-fill-mode: both;
    -webkit-animation-duration: 0.2s;
    -webkit-animation-fill-mode: both
}

.animatedFadeInUp {
    opacity: 0
}

.fadeInUp {
    opacity: 0;
    animation-name: fadeInUp;
    -webkit-animation-name: fadeInUp;
}
</style>
