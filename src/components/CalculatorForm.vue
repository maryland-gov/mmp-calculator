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
		button.usa-button.usa-button--outline(
			v-if="showPrintButton",
			type="button",
			@click="print"
		) {{ printButtonText }}
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
			formdata:{}
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
		}
	}
};
</script>

<style lang="scss">
// Horizontal radio layout (not available in MDWDS)
.usa-radio-group {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin-top: 0.5rem;
	.usa-radio { margin-top: 0; }
}

// Custom tooltip icon positioning
.tooltip-icon {
	position: relative;
	margin-left: 0.25rem;
	top: -0.1em;
}

.mmp-calculator__form-actions {
	display: flex;
	gap: 0.5rem;
	@media print { display: none; }
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
</style>
