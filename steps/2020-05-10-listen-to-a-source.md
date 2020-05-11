So now that the playlist is in a database and is relatively up to date, the task turns to making it a *better* playlist. On the scraper side, it’s prioritizing sources and balancing out the kinds of songs I capture, and on the app side, it’s building a way to add and work with various kinds of metadata about those songs. So in early preparation for the next New Music Tuesday coming up, let’s do a little roundup and refactoring of sources. First of all, what’s in the playlist now?

`db.sources.distinct("parentEntity")` gives me the following list:

```

"Complex",
"Billboard",
"",
"The Fader",
"Genius",
"Hype Machine",
"Hypebot",
"Jezebel",
"Medium",
"MTV News",
"New York Times",
"Official Charts",
"Pigeons & Planes",
"Pitchfork",
"KPWR Power 106",
"Shazam",
"Popjustice",
"Spotify",
"Stereogum",
"Vevo",
"YouTube"

```

What’s up with the empty one? `db.sources.find( { parentEntity: "" } ).pretty()` returns:

```Javascript

{
	"_id" : ObjectId("5eb3180eda68e21818429b5a"),
	"parentEntity" : "",
	"parentStream" : "Now That's What I Call Music!",
	"instanceName" : "Now 99",
	"publicationDate" : "2018-03-23T00:00:00-07:00",
	"location" : "https://www.nowmusic.com/album/now-99/"
}

```

I think there’s another takeaway about my data model here--`parentEntity` is required. Because in this case, “Now That's What I Call Music!" is both a stream *and* an entity, but my relationship to it is really as an entity. The stream is the [series of albums](https://www.nowmusic.com/albums/) they put out, which doesn’t really have a name in itself, except that they’re all called “Now” something, but each album does have an instance name and publication date. So in any event, It’s time to do my first database [update](https://docs.mongodb.com/manual/reference/method/db.collection.update/#db.collection.update). I try all this stuff out in a “scratch” collection, by the way, but I save you all the details of that, unless the details become interesting. Just so you know i’m not being reckless here!

So I want to set the `parentEntity` field to `"Now That's What I Call Music!"`, and I want the `parentStream` field to be empty. Another option here would be to delete the document and re-add it, but then I’d lose my `ObjectId`, which is linked to songs. But let’s explore that option for a moment. It turns out to be really simple, and a good thing to know--even an obvious-seeming thing--if I insert a new document but define the `_id` field, that becomes the document’s unique ID, and Mongo doesn’t create a new one. So I can, indeed delete and re-add the document with:

```Javascript

// delete the original document
db.sources.deleteOne( {_id: ObjectId("5eb3180eda68e21818429b5a") } )


// replace it and preserve the ObjectId
db.sources.insertOne(
{
	"_id" : ObjectId("5eb3180eda68e21818429b5a"),
	"parentEntity" : "Now That's What I Call Music!",
	"parentStream" : "",
	"instanceName" : "Now 99",
	"publicationDate" : "2018-03-23T00:00:00-07:00",
	"location" : "https://www.nowmusic.com/album/now-99/"
}
)

```

That does *not* work, however, with the [Extended JSON](https://docs.mongodb.com/manual/reference/mongodb-extended-json/index.html) format Mongo uses in exports, like what I’ve [archived](https://github.com/davidforrest/development-db/blob/599d07b5372d721a4b5f130080dfe01da8e87b9a/archive/2020-05-04-songs-export.json) in the development db repo, and which would look like this:

```Javascript

{
  "_id": {
		"$oid": "5eb3180eda68e21818429b5a"
	},
	"parentEntity" : "Now That's What I Call Music!",
	"parentStream" : "",
	"instanceName" : "Now 99",
	"publicationDate" : "2018-03-23T00:00:00-07:00",
	"location" : "https://www.nowmusic.com/album/now-99/"
}

```
 This makes sense enough, though, because the `ObjectId("5eb3180eda68e21818429b5a")` format is *not* valid JSON, and I’ve had to reformat it as I’ve been scraping songs and sources out of the browser.

But all this aside, I want to try using `update()` instead. It’s a simpler way to change only some specific part of a document, and I can also apply a change to multiple documents. Let’s say that I want to update all the documents in a collection where `parentStream" : "Now That's What I Call Music!"`. Actually, it looks like what I’d want here is [`updateMany()`](https://docs.mongodb.com/manual/reference/method/db.collection.updateMany/), and it would look like this:

```Javascript

db.sources.updateMany(
  {parentStream: "Now That's What I Call Music!"},
  {
   $set: {
     parentEntity: "Now That's What I Call Music!",
     parentStream: ""
   }
  }
)

```

I could also do the exact same thing, with the exact same syntax for [‘updateOne()`](https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/), and it would only update the first result. Of course, there’s only one result in the case of "Now That's What I Call Music!" anyway. But in principle, I’m going to use `updateMany()` here, because it’s not the norm to have only one instance of a source, and I want to update the source in *all* its potential instances. So okay, now I have my *real* list of entities:

```

"Complex",
"Billboard",
"Now That's What I Call Music!",
"The Fader",
"Genius",
"Hype Machine",
"Hypebot",
"Jezebel",
"Medium",
"MTV News",
"New York Times",
"Official Charts",
"Pigeons & Planes",
"Pitchfork",
"KPWR Power 106",
"Shazam",
"Popjustice",
"Spotify",
"Stereogum",
"Vevo",
"YouTube"

```

Next up, how well are each of these sources represented in the database? `db.songs.count()` tells me there are 8304 songs in the database. To figure out where those songs came from, I’ll need to use the aggregation pipeline, and this is a tricky one, because source IDs are stored in songs, but there can be multiple source IDs associated with the same parent entity (because it can have multiple streams and instances). So do I approach this starting from` songs` or `sources`? I’d imagine from `sources`. I’d get all the IDs associated with an entity, then get all the songs associated with each of those IDs. Is that possible? It’s like looping over an array, but with unwinds. Hmm. Nope, I’d start from `songs`. Within `songs`, do a `$lookup` to get the source for *every* song, then filter that for sources where the `parentEntity` is, say, `”Complex”`, and then [`$count`](https://docs.mongodb.com/manual/reference/operator/aggregation/count/#pipe._S_count) the results (`$count` is the aggregation version of `collection.count()`). The query looks like this:

```Javascript

db.songs.aggregate( [
  { $lookup:
    {
     from: "sources",
     localField: "captureSource",
     foreignField: "_id",
     as: "songSources"
    }
  },
  {
    $unwind: "$songSources"
  },
  { $match :
    {
      "songSources.parentEntity" : "Complex"
    }
  },
  {
    $count : "videoId"
  }
] )

```

I have to count *some* field, in the document, but it doesn’t really matter which one, because all the documents have all the fields. I’m using `videoId` because, even if it’s not filled in yet, the field *exists* and it’s how my model represents a unique song. And there are 460 unique songs where the `parentEntity` is `”Complex”`. Here’s how that pans out for all the sources. I could write a script to do this if I was working in an app, but here in the shell, I’m just doin’ stuff manually, repeating this query for each source:

But remember, when I [imported](https://raw.githubusercontent.com/davidforrest/development-db/master/archive/2020-05-08-spreadsheet-songs-import.json?token=ABF6EBTF7BKSRMGMMOXWS2S6YGCPY) songs from the spreadsheet, there were a whole bunch that didn’t have sources--they were from before I tracked sources consistently. `db.songs.count( { captureSource : "" } )` tells me that there are 4402 such songs, which is 53% of the database. So the percentages below are of the 3904 songs that *do* have sources. Because that’s all I have to work with when it comes to trying to round up and assess sources. By the way, I can count all the songs that *do* have sources with `db.songs.count( { captureSource : {$ne : ""} } )`. Where [`$ne`](https://docs.mongodb.com/manual/reference/operator/query/ne/) means “does not equal.”

```

Total songs - 8304
Without sources - 4402
With sources - 3902, 100% of below:

Billboard - 1599 songs, 41%
Pitchfork - 579 songs, 14.8%
Complex - 460 songs, 12%
New York Times - 330 songs, 8.46%
Pigeons & Planes - 314 songs, 8.05%
Spotify - 201 songs, 5.15%
Hype Machine - 150 songs, 3.8%
Shazam - 128 songs (58 are “My Shazams”), 3.28%
Stereogum - 35 songs, 8.59%’
YouTube - 25 songs, 0.64%
Now That's What I Call Music! - 24 songs, 0.6%
Vevo - 21 songs, 0.54%
Jezebel - 11 songs, 0.28%
Popjustice - 9 songs, 0.23%
Hypebot - 8 songs, 0.21%
Genius - 3 songs, 0.08%
The Fader - 1 song, 0.03%
Medium - 1 song, 0.03%
MTV News - 1 song, 0.03%
Official Charts - 1 song, 0.03%
KPWR Power 106 - 1 song, 0.03%

```

It would be cool to make a little stats script that tells me things like this. Kind of as a way of getting perspective on the playlist to try to keep it balanced, and also to report on what’s in it. That assumes, I suppose, that each of these sources are sort of like genres, which, in a way, they are. The songs that come from Stereogum are going to have a different quality than the songs that come from Complex. They’re different levels and tendrils of “nicheness,” with Billboard, I’d say, representing the most general swath of music culture. Does that argument fly? Sources as genres.

In any event, the next step is to try filtering the player to only play songs from one of these sources, to have the experience of just that source, and see what kind of stuff it turns out. That’s also a first baby step into thinking in an app, but still solidly on the task of refactoring New Music Tuesday toward a better overall playlist. And after all this database stuff, it’d be nice to listen to a little music again. Is that part of this same step, well, sort of, so yes.

First up, I [made an edit](https://github.com/davidforrest/Music-Video-Player/commit/2967dcefcf6d83d80b599aa82d4582f6488fd568) to the one line of code where the player queries the database--now it only grabs songs that have music videos. My first pass was to have it only grab songs called “Baby,” but as you can imagine, that made for a pretty different overall experience. The main point of doing this is just to highlight where in the app the database query happens. And it opens up a lot of questions for me. For comparison [here’s that same line](https://github.com/learninglab-dev/simplest_express_mongo/blob/e0f879bb73dd68cec6adc8de1e22b07508d90b64/routes/index.js#L7) in the “simplest express mongo” app that I’m planning to rebuild as a kickoff to my starter db app. It’s nice to have this side-by-side comparison, because the differences between the two apps helps me notice more things and ask better questions. Here are the queries from these two apps reformatted to make their parts extra clear:

```Javascript

// Music Video Player
router.get('/songs_api', function(req, res){

  Song.find(

    { videoId : {$ne : ""} },

    function (err, data){
      console.log(JSON.stringify(data, null, 4));
      res.json(data);
    }
  );

});


// Simplest Express Mongo
router.get('/', function(req, res, next) {

  FavoriteColor.find(

    {},

    function(err, data){
      var myData = data;
      console.log(JSON.stringify(myData, null, 4));
      res.render('index', {title: 'Express', subtitle: 'my subtitle', data: myData});
    })
});

```

And here are some things I notice. Again, by the time you or I read this, I’m sure all these things will seem so, so obvious:

- In the favorite color app, the index page is rendered inside the same router call as the query, but in the player app, it’s in a [separate call](https://github.com/davidforrest/Music-Video-Player/blob/ce384da5b1e55897a649790189e7f10379eead9c/routes/index.js#L14), and the query has its own route name, `songs_api`. In the first case, the response is a JSON of the data, and in the second case, that data gets put into a variable and wrapped into the index page.
- I wonder if the second scenario is better suited when you want different queries for different routes. In that case, wouldn’t you need a separate “`_api`” route for each different query, and a separate “`data`” variable for each response, which you could then use in different views? I think so, because (notwithstanding that for some reason its a .html file in the `public` directory, [this](https://github.com/davidforrest/Music-Video-Player/blob/dd12662a5688a7817f55149cdb47cc5bd4acd3a7/public/player.html#L22) is where the data gets brought into the player view, whereas it’s [already there](https://github.com/learninglab-dev/simplest_express_mongo/blob/e0f879bb73dd68cec6adc8de1e22b07508d90b64/views/index.ejs#L26) in the index view of the favorite color app. Then again, would I necessarily want to tie a query that closely to a view? That doesn’t seem very modular.
-  The collection name in the query is `Song` (or `FavoriteColor`), which references the *schema*, not the collection. There’s a [comment](https://github.com/davidforrest/Music-Video-Player/blob/ce384da5b1e55897a649790189e7f10379eead9c/routes/index.js#L17) in the player app that says “query the db according to the song schema,” but it really means “according to the *collection defined in* the song schema.” I talked about this [here](https://github.com/davidforrest/Database-references/blob/033a4cf9239f731f50c9c00309a4232484cf0d55/steps/into-the-database.md) in the database references repo. The proof that nothing’s happening according to the schema itself is that the data logged into the terminal uses the [newer song model](https://github.com/davidforrest/Data-model/blob/6dd1e0d82b34a2110eb5f1aab4526932bdb0f87e/models/song.js) from the development db, and not the [original song model](https://github.com/davidforrest/Music-Video-Player/blob/dd12662a5688a7817f55149cdb47cc5bd4acd3a7/models/song.js) from the player app. The player still works because all it’s really using is the `videoId` field, which is the same in both schema. Start and end times don’t work anymore because they don’t exist in the new schema.
- I do not understand callbacks. I will have to overcome this.

But this is really good. I feel a lot more oriented to what’s going on, and it’s also interesting (and alarming) to see how much stuff I was able to build (or at least get to work) without really understanding the details of what I was doing. That’s how code learning tends to work, though, except I don’t believe it has to, or ought to be that way.

So next, let’s see if I can [put my query into a variable](https://github.com/davidforrest/Music-Video-Player/commit/c4fd5b8212de9cf9d2aebb0a735a9da224bf47e1) (yes), and then if that query can [be an aggregation](https://github.com/davidforrest/Music-Video-Player/commit/e348268e1978a0d2f792481bdef00efe37d7dd24) (yes).

So there it is. At long last, I can play the songs from just one source and get a sense of that source’s vibe. But to wrap up today’s adventure, I’m going to [stage the query](https://github.com/davidforrest/Music-Video-Player/commit/dd12662a5688a7817f55149cdb47cc5bd4acd3a7) so that it’s no longer in a variable (because it’s clear enough to see what’s going on now), and so that by default, it plays *every* song in the playlist that has a `videoId`, but gives me a place to plug in a specific source I want to listen to:

```Javascript

router.get('/songs_api', function(req, res){

  Song.aggregate(

    [
      { $lookup:
        {
         from: "sources",
         localField: "captureSource",
         foreignField: "_id",
         as: "songSources"
        }
      },
      {
        $unwind: "$songSources"
      },
      { $match :
        {
          "songSources.parentEntity" : {$exists: true} // or "Billboard", etc.
        }
      },
      { $match :
        {
          videoId : {$ne : ""}
        }
      }
    ],

    function (err, data){
      console.log(JSON.stringify(data, null, 4));
      res.json(data);
    }
  );

});

```

And if I start the app with `nodemon start` instead of `npm start`, the player will update with the new source when I save the file and refresh the page.

So I’m in bizness. Was this a chill Sunday like [yesterday](https://github.com/davidforrest/Song-Scraper/blob/fb14b23385c210cd0e637b8224d649078805cb0e/steps/2020-05-09-catching-up-to-billboard.md) was a chill Saturday?


&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [go on →]()\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; or\
[← go back](2020-05-09-catching-up-to-billboard.md)
