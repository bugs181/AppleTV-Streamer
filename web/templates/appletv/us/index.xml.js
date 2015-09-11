var http = require('httpHelper')

var shelfs = [
	"Featured Movies",
	"Just Added"
]

var mediaObjects = [{ title: "Bob", images: { poster: "poster.jpg"} }]


module.exports = {
	compile: compile,
	canCache: false,

	shelfs: shelfs,
	mediaObjects: mediaObjects
}

function compile(callback) {
	// This method is called before template is available.
	console.log("Compiling template")

	var apiURL = "http://localhost:8020/browse/shows"
  http.loadPage(apiURL, function(body) {
    mediaObjects = Object.create(parseIndex(body))
    if (callback)  callback()
  })
}


// Media object parsing methods.
function parseIndex(body) {
	var mediaObjectJSON = body;

	var error = false;
	if (!mediaObjectJSON)  error = true
	if (typeof mediaObjectJSON !== "object")  error = true

	if (error) {
		return []
	}

	var mediaObjects = []

	for (var mediaObjectItem of mediaObjectJSON) {
		if (mediaObjectItem) {
						
			// Set up a new media object
			var mediaObject = new mediaObjectClass()

			// Meda object in, media object out. xD
			mediaObject = parseMediaObject(mediaObjectItem, mediaObject)
			mediaObjects.push(mediaObject);
		}
	}

	return mediaObjects
}

function parseMediaObject(mediaObjectItem, mediaObject) {
	// This function returns a mediaObject formatted JSON object.

	// todo: verify all required fields exist before returning mediaObject
	// otherwise return empty mediaObject

	// console.log("Missing property: " + missingProperty)
	// return { }
	
	var mediaID = mediaObjectItem.portal + mediaObjectItem.info
	mediaObject.id = mediaID
	
	mediaObject.title = mediaObjectItem.title
	//mediaObject.year = mediaObjectItem.year
	mediaObject.year = "2015"

	if (mediaObjectItem.images)  mediaObject.images.poster = mediaObjectItem.images.poster
	mediaObject.slug = mediaObjectItem.title.replace(" ", "-")
	mediaObject.rating.percentage = mediaObjectItem.rating

	//mediaObject.genres = mediaObjectItem.genres
	mediaObject.genres = ["Comedy"]

	// Not always available info
	mediaObject.synopsis = mediaObjectItem.synopsis
	mediaObject.num_seasons = mediaObjectItem.seasons
	//mediaObject.runtime = mediaObjectItem.runtime
	mediaObject.runtime = "60"

	return mediaObject;
}

function mediaObjectClass() {
	this.id = undefined // String

	this.title = undefined // String
	this.year = undefined // String

	this.images = {
		banner: undefined, // String
		fanart: undefined, // String
		poster: undefined // String
	}

	this.rating = {
		percentage: undefined // Number
	}

	this.genres = undefined // String

	// Not always available info
	this.synopsis = undefined // String

	this.num_seasons = undefined // Number
	this.runtime = undefined // String

	this.episodes = [
		{

			overview: undefined, // String
			title: undefined, // String
			season: undefined, // Number
			episode: undefined, // Number

			files: [],

		}
	]
}

// todo: count how many mediaObjects per shelf, because it breaks if shelf is empty