const path = require('path')
const fs = require('fs')

class Store {
	constructor(opts) {
		this.path = path.join(opts.appDataPath, opts.configName + '.json')
		this.data = parseDataFile(this.path, opts.defaults)
	}

	get(key) {
		return this.data[key]
	}

	set(key, value) {
		this.data[key] = value
		fs.writeFileSync(this.path, JSON.stringify(this.data))
	}
}

function parseDataFile(filePath, defaults) {
	try {
		return JSON.parse(fs.readFileSync(filePath))
	} catch(error) {
		return defaults
	}
}

module.exports = Store