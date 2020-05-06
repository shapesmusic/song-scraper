It’s *New Music Tuesday*, and like 9 months later, I’m scrapin’.

Why Tuesday? Because that’s how it’s been. It’s tradition. But also because Tuesday is when Billboard releases its charts.

But today, on Tuesday May 5th, Billboard shows the chart for the week of May 9th. And May 9th is this coming Saturday. So “Week of May 9th” really means “the week *post dated for* Saturday, May 9th”, but the tracking week *actually* ended a few days ago Sunday, May 3rd. According to Wikipedia:

A new chart is compiled and officially released to the public by Billboard on Tuesday. Each chart is post-dated with the "week-ending" issue date four days after the charts are refreshed online (i.e., the following Saturday).

Tracking starts more than a week before that. For example:

- Friday, April 24 – sales tracking-week begins, streaming tracking-week begins
- Monday, April 27 – airplay tracking-week begins
- Thursday, April 30 – sales tracking-week ends, streaming tracking-week ends
- Sunday, May 3 – airplay tracking-week ends
- Tuesday, May 5 – new chart released, with issue post-dated Saturday, May 9th.

But in any event, all this to say that if I want to scrape a Billboard chart’s URL in a useful way, I have to either scrape the chart published last week, or add this week’s publication date to the URL.

Because the current chart’s URL is just:
https://www.billboard.com/charts

whereas last week’s has changed to:
https://www.billboard.com/charts/hot-100/2020-05-02

By the way, can I please show you the ridiculous process I’m going through right now to scrape a chart? I’m not complaining because this is kind of just a first step. But I want somebody to laugh about this with me:

![absurd scraping demo](images/2020-05-05-scraping.gif)



Here are a few thoughts that have come up while I’ve been scraping:

- the Object ID format actually has to change from: `"ObjectId(5eb1f7ba8e1f3aed7d986a29)"` to	`ObjectId("5eb1f7ba8e1f3aed7d986a29")`
- Billboard songs don't have videoIDs yet, so they throw player errors
- the current Billboard chart always has the same URL, so scrape the prior week's chart, or add `YYYY-MM-DD` to the URL

lots of next steps this will bring up:

- find and remove duplicates by song/artist name
  - but add all the spreadsheet data first? or at least scraper-equivalent data?
- prioritize earliest source publicationDate when keeping duplicates
- the player need to (at least) filter for songs without videos
- video, hasVideo, timestamps, zoom, etc could all happen at the same time, or separately.
- YT metadata app will be useful again very soon, once i'm caught up to the list.
- this is a whole lot of work. but how else would you build such a thing?
- i’ll want a README for the scraper with instructions, orders of things to do, where to find new chart lists, etc.
- my formatting of “ft.” instead of “feat.” or “f/” etc. for artist names
- i want an easy way to see the last date i scraped a chart. or a list of dates scraped for that chart.

And then I’ve spent a moment looking at how to bring the existing playlist, which is in a spreadsheet, into this database and model. Remember the new plan--I’m not waiting until the model is “ready” before I start dumping data into it. Using it is going to develop it.

So toward importing the existing playlist, the first thing I did was figure out how many of the songs have some sort of source information. And that’s 3137 of 7538 songs. So those are the songs I’ll be working with first.

Next is to see which songs in the spreadsheet don’t have videoIDs. This matters because the video ID is how I’ll connect the song with any of the rest of the metadata fields down the road. So every song--at least every song that has other metadata fields, which is every song in the spreadsheet--needs to have a videoID. And turns out there are just over 300 songs, all songs that have source information, that don’t yet have videoIDs. Which isn’t as bad as it could be. There will be a lot more once I’m done catching up with the Billboard charts since last August.

So based on that, my next steps for getting the playlist out of that spreadsheet will be:

- on the songs side, fill in the missing 300 video IDs
- on the sources side, well, I suppose start cleaning it up with a focus on the “instance” level. I’ll have to derive the different entity types from that later on, based on which fields do and don’t have values. So I’m going to add an `instanceId` field in the spreadsheet which will correspond to the `captureSource` reference in the database.
- and then I’ll have to do one more pass at cleaning up timestamps. getting them all in full ISO format.

All this is doable, but tedious. But it’s moving me toward a bunch of song data I can actually work with. I just added 50 video IDs pretty quick. And I caught up to Complex. But omg, can I just say, Complex changed their embeds in the last three weeks, and got super sloppy and inconsistent with their artist and song name punctuation, and *then* the [current chart](https://www.complex.com/music/best-new-music-this-week-drake-megan-thee-stallion-beyonce) actually switches video embed types for the last three songs. So it’ll be a surprise to see what they come up with next week. I also might want to reconsider whether I scrape Complex at all, because it may weight the playlist too heavily toward that particular style. Getting back into all these sources will help me balance out where the deeper-cuts-than-Billboard come from.

And incidentally, I had the thought that moving all this from a spreadsheet into a database has some parallels to my beginner coding lesson about moving to increasingly structured, representational layers of information--detaching what you see (a spreadsheet) from what you get. This is my version of that introCoding lesson.


&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [go on →](2020-05-06-spreadsheet-sources.md)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; or\
[← go back](2020-05-04-scraping-into-the-player)
