Well, I’m squeezing sources from the playlist spreadsheet into this new development db model, and it seems worth jotting a few of them down so I can remember how I’m thinking about them. Here’s one:

```Javascript

{
    "parentEntity": "",
    "parentStream": "Now That's What I Call Music!",
    "instanceName": "Now 99",
    "publicationDate": "2018-03-23T00:00:00-07:00",
    "location": "https://www.nowmusic.com/album/now-99/"
}


```

This is what a stream looks like when I’m not tracking a parent entity. Who knows who’s behind the “Now That’s What I Call Music!” series! I do care to be aware of the series which would have its own location that’s different from the instance location here.

Here’s another example, for songs that came from the Billboard Hot 100 Chart before I was paying attention to which instance of the chart:

```Javascript

{
    "parentEntity": "Billboard",
    "parentStream": "The Hot 100",
    "instanceName": "",
    "publicationDate": "",
    "location": "https://www.billboard.com/charts/hot-100"
}

```

So whereas the first example was of an instance of a stream without a parent entity, this is a just a stream, and the location shows the location of the stream generally, not any particular instance of the stream. Another example would be Billboard’s Twitter feed, which is noteworthy here because I’ve decided to use its URL (rather than Twitter handle) as the location:

```Javascript

{
    "parentEntity": "Billboard",
    "parentStream": "Twitter",
    "instanceName": "",
    "publicationDate": "",
    "location": "https://twitter.com/billboard"
}

```

On the other hand, here’s one for songs that came from Complex Best New Music This Week, back when they refreshed the same URL every week and it was impossible to go back to a prior chart, which also explains why some weeks are missing during that period. If I didn’t scrape it *during that week*, I missed it. So this is an instance, but without a name. So really what defines an instance versus a parent source in this model is the presence of *either* an `instanceName` or `publicationDate`, both of which refer to an instance, since this interim model is at the level of an instance:

```Javascript

{
    "parentEntity": "Complex",
    "parentStream": "Best New Music This Week",
    "instanceName": "",
    "publicationDate": "2019-02-15T00:00:00-07:00",
    "location": ""
}

```

In the case above, though, I actually am going to add the location I used at the time I found those songs, which is just "https://www.complex.com/music/new-music-this-week/", rather than leaving the location empty. There’s no way to find that individual instance now, since the URL is frozen where they deprecated it, on April 19, 2019. Beyoncé. But had I scraped the location at the time, this is what it would have looked like. This is different from the Billboard example higher up, from before I was paying attention to which instance of the chart. Because in this case, I did capture the publication date of the instance, so I was thinking (at least somewhat) in terms of instances.

And finally, here’s one that’s an instance (an article), discovered through Billboard’s Twitter. So the full chain of sources is full. This is the same as an instance of the Hot 100 chart, actually, but it helps to see it as something other than a chart:

```Javascript

{
    "parentEntity": "Billboard",
    "parentStream": "Twitter",
    "instanceName": "Catching Up With Labrinth: The Mystery Artist Behind Apple Watch Commercial's Viral Song",
    "publicationDate": "2017-09-14T00:00:00-07:00",
    "location": "https://www.billboard.com/articles/news/7965714/labrinth-apple-watch-commercials-artist-song-interview"
}

```

For the moment, the takeaway here is that this development model is focused at the level of an instance, and if *both* the `instanceName` *and* `publicationDate` values are empty, it means the document is a placeholder for a higher-level source, either a stream or an entity. So the first thing I’d want to do, if and when I’m breaking this out into different levels of sources down the line (if, indeed, I end up doing that), would be to search for documents with an empty `instanceName` and `publicationDate` value. This also means that there will be songs linked to more general sources, like, “oh, it came from Billboard, but who knows what chart or article or when… all I know is that it came from Billboard.”

But now there are, like, over two years of Billboard charts in the spreadsheet that I *did* track, so am I going to add each of those to the database by hand? No way, not least for all the potential human error that would introduce. With just the date field, I can make a little script (for the browser console--my favorite :stuck_out_tongue:) that builds an insert array for me.

So first, I copy all the date values into Atom--there are 890 of them--use regex to replace `\n` with `",\n"`, and enclose the whole thing in `[“ “]`. I’ve got my `dates` array.

Next, `noDuplicates = new Set(dates);` filters out all the duplicates. [Here’s](https://medium.com/dailyjs/how-to-remove-array-duplicates-in-es6-5daa8789641c) a nice Medium article on a few different ways to do this. Also you have to convert a Set to an array if you want to JSON.stringify it, like this: `JSON.stringify([...noDuplicates], null, 4);`. Down to 103 unique dates, which I’ll call `datesArray`. Although I need to learn more about Sets, because I have a feeling that this still isn’t quite an array. Not going to go down that rabbit hole right now, though.

And then, my little script (I really should shake this bad habit of not declaring variables in the browser console, but it gives me this little happy rebellious feeling):

```Javascript

// add moment.js
momentjs = document.createElement("script");
momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
document.head.appendChild(momentjs);

// build my sources object
sources = [];

for (var i=0; i<datesArray.length; i++){

  longDate = moment(datesArray[i], "YYYY-MM-DD").format("MMMM D, YYYY")
  instanceName = "Week of " + longDate;
  publicationDate = moment(datesArray[i], "YYYY-MM-DD").format();
  chartLocation = "https://www.billboard.com/charts/hot-100/" + datesArray[i];

  source = {
      "parentEntity": "Billboard",
      "parentStream": "The Hot 100",
      "instanceName": instanceName,
      "publicationDate": publicationDate,
      "location": chartLocation
  }

  sources.push(source);
}

// give me something to copy out of the console
JSON.stringify(sources, null, 4)

```

I’m glad I did this, too, because it taught me something. I’d originally used the variable `location` to build the URL for the chart, but `location` means something to the browser, and it kept trying to open the page! And now I know.

I also just noticed that there’s no `captureDate` for the stream instance itself in this model I’m working with, although there is in the [model](https://github.com/davidforrest/Data-model/blob/master/models/streamInstance.js) I was sketching. The assumption here is that the instance is “captured” by capturing a song from that instance. There’s never been any notion of adding a source, unattached to adding songs. I’m kind of okay with that, but I’m flagging it here so I’m aware of it.

And there you go. All 1120-something songs in the spreadsheet that came from Billboard in one form or another now have `ObjectId` references to individual documents in the database for their sources.


&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [go on →]()\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; or\
[← go back](2020-05-05-new-music-tuesday.md)
