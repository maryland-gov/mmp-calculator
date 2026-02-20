import {tmpl} from './functions';

/**
 * Retrieves copy text from the "Copy" tab in the source 
 * spreadsheet.
 */
class Copy {
	constructor(){
		this.strings = {};
	}
	
	add( key, value ){
		this.strings[key] = value;
	}
	
	get( key, vars, inline, allowEmpty ){
		let str = this.strings[key];
		if( !str ){
			return allowEmpty ? '' : key;
		}
		return tmpl( str, vars, inline );
	}
}

const copy = new Copy();

export default copy;
