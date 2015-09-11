var shelfs = [
	"Featured Movies",
	"Just Added",
	"test"
]

var mediaObj1 = {
	id: "123",
	title: "The Falling on",
	poster: "https://trailers.apple.com/trailers/independent/thefalling/images/poster-large.jpg",
	section: "Just Addeded"
}

var mediaObj2 = mediaObj1
var mediaObj3 = mediaObj1


module.exports = {
	compile: compile,
	canCache: false,

	shelfs: shelfs,
	mediaObjects: [mediaObj1, mediaObj2, mediaObj3,mediaObj3,mediaObj3,mediaObj3,mediaObj3,mediaObj3,mediaObj3,mediaObj3,mediaObj3,mediaObj3,mediaObj3,mediaObj3,mediaObj3,mediaObj3,mediaObj3,mediaObj3,mediaObj3,mediaObj3,mediaObj3,mediaObj3,mediaObj3,mediaObj3,mediaObj3],
}

function compile(callback) {
	// This method is called before template is available.
	console.log("Compiling template")

	// unirest, fetch featured
	// unirest, fetch "Just added"

	// Unless we have a way to parse the sections..

	// media.section = "Just Added"


	// Aggregator: navigation
	// Aggregator: pageSections

	// todo: aggregator, grab featured movies too.

	// fetchMedia
	// create shelfs based on mediaObject.section

	


	if (callback)  callback()
}

/*

			todo: load each shelf from the array
			do the same for the navigation bar..

			for each item, load a collectionDivider
			for each group of items, load a shelf
			for each group, load a moviePoster item
			*/


// This is for nav.xml.js
/*
var shelfs = [
	{
		title: "Home",
		url: "/home.xml"
	},
	{
		title: "Popular",
		url: "/popular.xml"
	},
	{
		title: "Filter",
		url: "/filter.xml"
	},
	{
		title: "Browse",
		url: "/browse.xml"
	},
	{
		title: "Search",
		url: "/search.xml"
	}
]*/