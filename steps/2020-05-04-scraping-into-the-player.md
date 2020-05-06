So now the Complex scraper is spitting out a JSON that looks like this:

```JSON
{
    "dateAdded": "",
    "source": "",
    "sourceDate": "",
    "sourceUrl": "",
    "songName": "",
    "artistName": "",
    "videoID": ""
  };
```

Which is definitely a step up from console logs. But a first step toward bringing this line with the [models](https://github.com/davidforrest/Data-model/tree/master/models) I’m working out is to recognize that I’m scraping *two* things here--first a source, and then the songs from that source, linked to that source.

And the other thing to keep in mind is the [model](https://github.com/davidforrest/Music-Video-Player/blob/master/models/song.js) the player uses to play songs, which also includes timestamps.

So my project today will be to:
1. separate the scraper’s output into “source” and “songs” and update the field names.
1. try exporting the contents of the current `songs` collection from the development-db into a file
1. replace the data in that collection with some data from this scraper, including a reference between songs and their source
1. see how the player behaves with song data that’s missing starting and ending timestamps (I think it will just ignore them, but we’ll see.

So here we go. [First step](https://github.com/davidforrest/Song-Scraper/commit/09a5c16dddbc9e04a41cb3f288ef3b53877048c5) down, and it included adding a couple new regex lines to grab the stream and instance names. And then I consulted my [timestamps step](https://docs.google.com/document/d/1wjN6487Sx-uoafge1Y43iDoYElyKEisuCkzbjnAzB0I/edit) from a couple weeks ago and [added moment.js](https://github.com/davidforrest/Song-Scraper/commit/16a06ae4e7e8a76fe52af93715ecbad0c4554a30) to format the dates. The diffs are pretty hard to see from that link, though, because I also added some comments and indents, which makes me think I could be a little more atomic about making sure the things that matter are visible in diffs. But this is cool! Now I have a pretty dramatically updated Complex scraper that’s ready to dump into a database.

But first, according to my plan up there, I want to clear the songs out of the current `songs` collection. I started to mess with this kind of thing at the end of [this doc](https://docs.google.com/document/d/1u9h7PlgXNRT-hhhbnv8RZp0-_jj7gWeAqLo6Jqoz9YQ/edit), so I can do what I want from the command line (not the mongo shell) with:

```
mongoexport --collection=songs --db=music --out=2020-05-04-songs-export.json --pretty
```

And it exported 5053 songs to a file that I’ll [archive](https://github.com/davidforrest/development-db/commit/5be211cc71971584e71b7b3318ee1a07cbeffcba) in the development db repo. Second step down.

Now, I’m going to start scraping Complex [where I left off](https://www.complex.com/music/best-new-music-this-week-brockhampton-vince-staples-lana-del-rey) back at the end of August. I can simultaneously create a `sources` collection *and* put my first scraped source into it with:

```javascript
db.sources.insertOne({
  "parentEntity": "Complex",
  "parentStream": "Best New Music This Week",
  "instanceName": "Brockhampton, Vince Staples, Lana Del Rey, and More",
  "publicationDate": "2019-08-23T00:00:00-07:00",
  "location": "https://www.complex.com/music/best-new-music-this-week-brockhampton-vince-staples-lana-del-rey"
})
```

and I get the following response, which contains the ObjectId I’ll need to reference that source:

```javascript
{
	"acknowledged" : true,
	"insertedId" : ObjectId("5eb0e81665bca35b26437f21")
}
```

Next, I’m going to drop the whole songs collection with `db.songs.drop()`. Just like that, it’s gone.

Now, in the scraper code, I have to [add the ObjectId](https://github.com/davidforrest/Song-Scraper/commit/19ac6710a08ea7c1c09281da8549dfc5fa7dde63) for the source I want to reference, so that it’ll show up in each song document I scrape from that source. The only issue here is that it looks like that ObjectId shouldn’t be a string when it goes into mongo. So until I can figure out how to do that, my temporary hack is to build a string in the scraper and do a manual “replace all” in Atom to remove the quotation marks before I dump everything into mongo. I’m going to [use the songs.json file](https://github.com/davidforrest/Song-Scraper/commit/3810cf16ee2253e743ed129d3c2390be62d41b4d) for this purpose--staging data to insert into the db. The final `insertMany()` for the 10 songs on this chart looks like this:

```javascript
db.songs.insertMany([
    {
        "captureDate": "2020-05-04T21:25:11-07:00",
        "captureSource": ObjectId("5eb0e81665bca35b26437f21"),
        "songName": "St. Percy",
        "artistName": "Brockhampton",
        "videoId": "rp-I-YGg6Hs"
    },
    {
        "captureDate": "2020-05-04T21:25:11-07:00",
        "captureSource": ObjectId("5eb0e81665bca35b26437f21"),
        "songName": "Pose",
        "artistName": "Yo Gotti f/ Lil Uzi Vert",
        "videoId": "HpACqY0RDaw"
    },
    {
        "captureDate": "2020-05-04T21:25:11-07:00",
        "captureSource": ObjectId("5eb0e81665bca35b26437f21"),
        "songName": "The Greatest",
        "artistName": "Lana Del Rey",
        "videoId": "YYNr09lRC48"
    },
    {
        "captureDate": "2020-05-04T21:25:11-07:00",
        "captureSource": ObjectId("5eb0e81665bca35b26437f21"),
        "songName": "So What",
        "artistName": "Vince Staples",
        "videoId": "01sml1kPv54"
    },
    {
        "captureDate": "2020-05-04T21:25:11-07:00",
        "captureSource": ObjectId("5eb0e81665bca35b26437f21"),
        "songName": "Truth Hurts (Remix)",
        "artistName": "Lizzo f/ DaBaby",
        "videoId": "Wh8Bcuui2bE"
    },
    {
        "captureDate": "2020-05-04T21:25:11-07:00",
        "captureSource": ObjectId("5eb0e81665bca35b26437f21"),
        "songName": "Why I Still Love You",
        "artistName": "Missy Elliott",
        "videoId": "KcqAesYavW0"
    },
    {
        "captureDate": "2020-05-04T21:25:11-07:00",
        "captureSource": ObjectId("5eb0e81665bca35b26437f21"),
        "songName": "Ten-Eight",
        "artistName": "G Perico",
        "videoId": "siFbiJfXUko"
    },
    {
        "captureDate": "2020-05-04T21:25:11-07:00",
        "captureSource": ObjectId("5eb0e81665bca35b26437f21"),
        "songName": "Flowerchild",
        "artistName": "Saint Bodhi",
        "videoId": "IilSNcGpQw8"
    },
    {
        "captureDate": "2020-05-04T21:25:11-07:00",
        "captureSource": ObjectId("5eb0e81665bca35b26437f21"),
        "songName": "People",
        "artistName": "The 1975",
        "videoId": "EKdPxXWm7Jg"
    },
    {
        "captureDate": "2020-05-04T21:25:11-07:00",
        "captureSource": ObjectId("5eb0e81665bca35b26437f21"),
        "songName": "Torn",
        "artistName": "Ava Max",
        "videoId": "cPyQRtd7hNU"
    }
])
```

And there you have it! Some songs scraped into a database and linked to their source.

The final test, Step 4, is to see what happens if I launch the [music video player](https://github.com/davidforrest/Music-Video-Player). The `songName`, `artistName`, and `videoId` fields are the same, but there are no `startDur` and `endDur` fields in the database anymore. What do you think will happen? My guess is that it just won’t pass start and end values into the YouTube player, so the videos will start at the beginning and play through, as they would by default.

And yup, that’s exactly what happens. I’m listening to the chart! This is kind of a big moment, you know. But I’m chill…


&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [go on →](2020-05-05-new-music-tuesday.md)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; or\
[← go back](2020-05-03-2-resuscitating-the-chart-scrapers.md)
