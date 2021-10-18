"use strict"

const path = require('path')
const fs = require('fs')

class Store {
	/*
	* @constructor Store
	* @param {String} aviDataPath
	* @param {Object} defaults
	*/

	constructor({ aviDataPath, defaults }) {
		this.path = path.join(aviDataPath, 'config.json')
		this.data = parseDataFile(this.path, defaults)
	}

	/*
	* @function get
	* @param {String} key
	* @return {Object}
	*/
	get(key) {
		return this.data[key]
	}

	/*
	* @function set
	* @param {String} key
	* @param {Object} value
	*/
	set(key, value) {
		this.data[key] = value
		fs.writeFileSync(this.path, JSON.stringify(this.data))
	}
}

/*
* @function parseDataFile
* @param {String} filePath
* @param {Object} defaults
* @return {Object}
*/

function parseDataFile(filePath, defaults) {
	try {
		return JSON.parse(fs.readFileSync(filePath))
	} catch(error) {
		return defaults
	}
}

module.exports = Store