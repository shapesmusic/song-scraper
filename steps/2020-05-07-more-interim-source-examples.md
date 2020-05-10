Next up, Fader. Or *FADER*. Or *The Fader*. The Fader is a magazine, but it’s also an entertainment media company, like Complex, like Billboard. [I was thinking about this](https://docs.google.com/document/d/1RW2LYKJM4PyKengBsQ6nbcM0nBmqH_O77M-50agy_IQ/edit?usp=sharing) a few days ago, and it’s clearer now that for my purposes, all of these things are entities. They’re entities because that’s how I relate to them, not because they’re parent companies and so forth. My sources model isn’t describing the structure of these sources objectively--it’s describing their relationship to this project. That’s important to say out loud.

For the one song in my spreadsheet that came from The Fader, here’s what I know:

```Javascript

{
    "parentEntity": "The Fader",
    "parentStream": "",
    "instanceName": "10 songs you need in your life this week",
    "publicationDate": "2018-05-15T00:00:00-07:00",
    "location": "https://www.thefader.com/2018/05/15/drake-lil-baby-yes-indeed-andre-3000-mitski-geyser"
}

```

In other words, I know the instance, I don’t know how I came across that instance, and I do know that ultimately, it came from The Fader. I just don’t know how it got from The Fader to me. Possibly Twitter? Or some email? I don’t know. But I do know that this example helps me understand the difference between an entity and a stream. An entity is where the instance originates, and a stream is what gets that instance from the entity to me. Thanks, The Fader. High five. :raised_hands”

Genius Top Songs is also a little interesting:

```Javascript

{
    "parentEntity": "Genius",
    "parentStream": "Top Songs",
    "instanceName": "",
    "publicationDate": "",
    "location": "https://genius.com/#top-songs"
}

```

It’s a chart that doesn’t have instances. I could consider an instance to be the date I accessed it, but that’s not a `publicationDate`. It’s a capture date, which will be reflected by songs. Also, this is a chart without a name. Genius has a section for “Charts,” but there’s only one chart, and it doesn’t have a name, only a heading, “Trending on Genius,” and some filtering options. So I’ve made up a name for their chart based on its URL. Top Songs.

Are you down for even more examples? I am. The Hype Machine Stack will be interesting in terms of the process for adding it:

```Javascript

{
    "parentEntity": "Hype Machine",
    "parentStream": "Stack",
    "instanceName": "№176",
    "publicationDate": "2018-02-23T00:00:00-07:00",
    "location": "https://hypem.com/stack/176"
}

```

I get the stack by email, and from that email, I’ll have to derive information for the instance. This matters because like I’ve articulated the difference between and entity and a source, I’m now saying out loud that the purpose of the `location` field is not to tell you how *I* accessed the source, but to show you how *you* can access the source, and even more specifically, how you can access it *as a URL*. This came up yesterday, too, when I was talking about Billboard’s Twitter feed. The location will be `”https://twitter.com/billboard”`, rather than `@billboard` or something like that. Of course, in some cases--like those older Complex instances, or charts that don’t differentiate instances--it’s only possible to give you the URL I used at the time. But the goal, as close as I can come to it, is to point you to the instance on the web. And for Stacks where I didn’t capture the instance, well, I’m not going to try to reconstruct it. Those were the days when I recognized only the stream.

Now here’s another thing to consider. In this interim model, am I blurring the difference between a stream and the means by which I access a stream? Yesterday I gave the example of Billboard’s Twitter feed as a stream that had pointed me to an article, an instance. But that’s to say that Billboard’s Twitter feed is actually like a publication--a self-contained feed of content. If I found out about, say, the Hot 100 chart through Twitter, this model would break. because both are streams, and I would have found the one stream through the other. In a sense, that’s okay, though, and I’ve accounted for that in the [larger model](https://github.com/davidforrest/Data-model/blob/master/models/stream.js). And that there’s another version of a stream that’s a bit more abstracted--it’s “out there,” and I actively go and look at it sometimes, like on New Music Tuesday. Where this really breaks, I think, is:

```Javascript

{
    "parentEntity": "Hypebot",
    "parentStream": "email subscription",
    "instanceName": "Spotify Names Most Streamed Songs Of The Summer Of 2017",
    "publicationDate": "2017-08-31T00:00:00-07:00",
    "location": "https://www.hypebot.com/hypebot/2017/08/spotify-names-most-streamed-songs-of-the-summer-of-2017.html"
}

```

There’s no publication date as part of this article, but it arrived in my inbox on August 31, 2017, as part of Hypebot’s daily summary email, which I’m subscribed to. Here, the email subscription is not a stream, but a `followingBy`. Sort of. And I don’t know the actual publication date for the instance, unless I count it as the day the actual text of the article shows up in the email--that’s as close as I can come. So, okay, that’s good enough. The takeaways from this one are that `parentStream` does *not* mean `followingBy` (I could follow Billboard’s Twitter by manually checking the URL for that Twitter account), and that the `publicationDate` will be as close as it possibly can be, that is, I won’t leave it out just because I’m not sure it’s exact. It’s as exact as the available information. So for Hypebot, I’m going to leave `parentStream` empty. The instance came from Hypebot, the entity. And I am following Hypebot by an email subscription, which is not a part of this interim model. Once all the playlist sources are in and I do a round of cleanup, I’ll consider removing Twitter as a streamInstance from that Billboard article, too. Although I’m still not sure that’s exactly the same situation.

Incidentally, since I know you want even more excruciating detail about Hypebot, they’re also complicated (and illuminated) a little by guest posts. [This article](https://www.hypebot.com/hypebot/2018/04/_____________________________-guest-post-by-if-youre-looking-for-a-preview-of-where-pop-music-might-be-headed-superorga.html) came through in their April 6, 2018 email, and reprints a [Medium article](https://blog.nextbigsound.com/anatomy-of-a-sound-superorganism-c149e40c06de) dated April 3rd, which, by the way, I also got in a Medium Daily Digest email on April 4th, and which has yet a *different* parent entity--Next Big Sound, which I also follow. The Hypebot URL, by the way, has an insane partial date (only the month) with a bunch of underscores in it, and the link I actually copied down at the time was the link directly to the Medium article. I think we’ve captured the essence of the whole music industry right here :stuck_out_tongue_winking_eye:. So what the heck do I do with all this? Well, I take away more takeaways. First, that I want to always drill down as close to the most primary source of an instance as I can, so that’s the Medium article. Then, I have to keep in mind what this interim model is and isn’t meant to represent. My current, [larger sketch](https://github.com/davidforrest/Data-model/blob/master/models/streamInstance.js) distinguishes `parentSource`, the parent entity, from `captureSource`, where it originally came from, which is Hypebot in this case. But this smaller model is meant to capture as much of that information--all the essential information--in a condensed form. Which means the `parentEntity` has to be Hypebot, otherwise I would lose the record of where I actually found it. And as for the rest of the instance information, it’s information for the primary source. This is yet another example for how this model is meant to represent *my* (or this project’s) relationship to the source, and not its structure of relationships outside this project. Whether I care to know if the same source showed up in multiple content feeds (the same article from multiple google scholar alerts, or the same song from multiple charts) is a different question, and a question for later. At least thus far, the source is where I actually encountered the thing, not where else I could have possibly also encountered it. This also means that “Medium” is an entity in my model, even though it’s more a vehicle for articles by other entities.

And also that `instanceName` is a marker for, essentially, a *work* that will have other information associated with it, like an author and so forth. But the overlap of instances and works is funny. This article only matters as a means to a song, which is the work that matters to my project.

:snail:

Here’s another good one:

```Javascript

{
    "parentEntity": "MTV News",
    "parentStream": "",
    "instanceName": "",
    "publicationDate": "",
    "location": ""
}

```

MTV News is an entity, even though its a division of MTV. I’m following it by Twitter, but that’s not represented in this model. Luckily for this model, Twitter is the *only* way I’m following MTV news, so no information is lost. Sort of. Ah, but then I have to include `”https://twitter.com/MTVNEWS”` for `location`. Aren’t you glad we paused on this?

But then, are The Playlist, Popcast, and Diary of a Song all entities, too, and not streams of New York Times? Or is MTV News then a stream? Or ought there to be no division between entities and streams in my model? Again, just flagging this.

Want another noteworthy one? Pitchfork [Best New Tracks](https://pitchfork.com/reviews/best/tracks/) (and also [Track Reviews](https://pitchfork.com/reviews/tracks/), which includes Best New Tracks) is a single page with a continuous stream of songs, but each individual song has its own “date added.” So one option would be to just consider the stream and ignore the individual song dates--but that doesn’t feel right. It’s also not exactly right to consider each song added to be a separate instance of the stream, even though that’s perhaps closer to right, because more than one song can get added on the same date. So I’ve had to invent what an instance of this stream means, and it is “a date, at the resolution of a day, when one or more songs were added to the list.” And one of those instances looks like this:

```Javascript

{
	"parentEntity" : "Pitchfork",
	"parentStream" : "Best New Tracks",
	"instanceName" : "",
	"publicationDate" : "2018-02-08T00:00:00-07:00",
	"location" : "https://pitchfork.com/reviews/best/tracks/"
}

```

And now, at long last, all the sources have moved, in a pretty workable form, from the spreadsheet to a database, and I’m only 120-something videoIDs away from being able to move all the songs from the spreadsheet into the database, too. I’ve also learned a thing or two about the sources model, which was why I took this little detour in the first place. Now, just to be safe, I exported all these new sources to a JSON and [saved it](https://github.com/davidforrest/development-db/commit/8ff291debb46bd04f1574eb5376ea201139d8996) in the development-db’s archive directory. This is some really good progress.


&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [go on →](2020-05-09-catching-up-to-billboard.md)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; or\
[← go back](2020-05-06-spreadsheet-sources.md)
