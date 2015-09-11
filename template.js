
var jade = require('jade');


var templateConfig = {
	files: [
		"/appletv/us/index.xml"
	]
}

module.exports = {
	file: shouldTemplateFile,
	compile: compileTemplate
}

function shouldTemplateFile(url) {
	for (templateFile of templateConfig.files) {
		if (templateFile == url)
			return true
	}

	return false
}

function compileTemplate(url, templateFileFromSource, callback) {
	var templateFile = "./web/templates" + url + ".js"

	console.log("Compiling template file: " + templateFile)
	var template = loadTemplate(templateFile, function(err, template) {
		if (err) {
			if (callback)  callback(err)
			return
		}

		if (typeof template.compile === 'function') {
			template.compile(function() {

				try {
					var templater = jade.compileFile(templateFileFromSource)
					var compiledFile = templater(template)
					if (callback)  callback(null, compiledFile)
				} catch (e) {
					console.log("[RED] Error compiling template")
					console.log(e)
					if (callback)  callback(e)
				}

				return
			})
		}

	})
}

function loadTemplate(templateFile, callback) {
	var fs = require('fs')
	fs.readFile(templateFile, 'utf8', function(err, template) {
		if (err) throw err;

		try {
			template = eval(template)
		} catch (e) {
			err = e
			console.log("[RED] Error loading template")
			console.log(e)
		}

		if (callback)  callback(err, template)
	})
}

// todo: for all mediaObject.section = "popular"
//then add them to the popular shelf at the top

