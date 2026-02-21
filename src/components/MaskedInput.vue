<template lang="html">
  
  <input
    type="text"
    class="input-number"
    :tabindex="tabindex"
    v-model="displayValue"
    @blur="handleInputState"
    @focus="handleInputState" 
  />
    
</template>

<script>

const masks = {
  currency: {
    mask (value) {
      return value.toLocaleString()
    },
    unmask (value) {
      value = parseFloat(value.replace(/[^\d\.]/g, ""))
      return isNaN(value)
      	? 0
        : value
    },
  },
}

export default {
  props: {
  	modelValue: null,
    maskType: String,
    tabindex: Number
  },
  emits: ['update:modelValue'],
  data: function() {
    return {
      inputFocused: false
    }
  },
  methods: {
  	handleInputState (event) {
    	this.inputFocused = event.type === 'focus'
    },
    unmask (value) {
    	return masks[this.maskType].unmask(value)
    },
    mask (value) {
    	return masks[this.maskType].mask(value)
    },
  },
  computed: {
    displayValue: {
      get: function() {
        if (this.inputFocused) {
          return this.modelValue !== undefined ? this.modelValue.toString() : '';
        } else {
          return this.modelValue !== undefined ? this.mask(this.modelValue) : '';
        }
      },
      set: function(modifiedValue) {
        this.$emit('update:modelValue', this.unmask(modifiedValue))
      }
    }
  }
};
</script>

<style></style>
