It’s New Music Tuesday--the first real one in a while. And I’m establishing an updated mission for NMT, it’s not just to catch up to scraping songs, and not just to find necessary updates and improvements to the scrapers themselves, but also to move the playlist towards being a better, more balanced, more satisfying, more hyperreal, more diverse (but not artificially diverse) experience of current music culture. Starting to think about sources in terms of genres, in terms of the overall “vibe” of songs that comes from a source has been a good start. It matters where a song came from, and (this will come up when I get into removing duplicates) it also matters if the same song shows up on multiple sources. It even matters when. This tells something about the source. And the song.

This also means--if it wasn’t already really apparent--that this playlist is curated. It’s *highly* curated, and the delivery and experience of the songs is curated, too (they’re trimmed, they’re zoomed, they’re filtered…). *Any* snapshot of current music culture is curated, if it’s a snapshot. So this playlist has a style and a rhetorical aim like any other playlist does. No claims to objectivity. But also, some claims to objectivity: “This is a color-boosted representation of the music around you, most generally, when you step out into culture-at-large.” It’s driven by the same impulse that attracts theorists to generalizations. But hopefully it’s a generalization that will offer a whole lot of particulars. If I want to talk about “the music around you,” what exactly does that mean? This playlist is the best answer I can give.


#### The Billboard Hot 100

New Music Tuesday’s excuse for being on Tuesday is the release of a new Billboard Hot 100 chart, “the music industry standard record chart in the United States for songs,” [so says](https://en.wikipedia.org/wiki/Billboard_Hot_100) Wikipedia. This playlist’s “culture-at-large” *is* the United States, but it’s the United States in its role as the main culprit for globalized, commercial music culture, and also as a consumer and regurgitator of the spoils of that culture, of the less-globalized music that percolates into the mix, or at least that gets absorbed into the ever-spreading blob. It’s the world’s Billboard Hot 100 chart, even as the Hot 100 chart steadily loses some of its grasp to Spotify, or Buzzangle / Alpha Data, or other more “accurate” and variable sources, the mythology behind the Hot 100 remains sacrosanct.

So adding new songs from the week’s Billboard Hot 100 is where NMT’s ritual begins. I have caught myself up over the past week, so all that remains today is to scrape this week’s chart. I’m going to start a [new NMT protocol](https://github.com/davidforrest/Song-Scraper) (as a README for the scraper) as I do this.

A [couple changes](https://github.com/davidforrest/Song-Scraper/commit/ff2d59aad348ee8f8a96aae586e7af1598285027) to the Billboard scraper for this week: most importantly, the current chart is at the source’s URL, not the URL where that chart will be archived when it’s no longer the current chart. So I made a little update to anticipate the archived URL, which is actually also valid while the chart is still the current chart. I had to fix last week’s chart URL, too, since I scraped it while it was current without realizing this:

```Javascript

db.sources.updateOne(
  {instanceName: "Week of May 9, 2020"},
  {
   $set: {
     location: "https://www.billboard.com/charts/hot-100/2020-05-09"
   }
  }
)

```

And second, I reordered the steps to be more like step-by-step instructions for scraping, since this is ultimately a `program to be executed by a human`.


#### Pitchfork Track Reviews

Now on to Pitchfork. Pitchfork is, as of now, the second most represented source in the playlist, not counting all the songs before I tracked sources, and also not counting if I merged Complex and Pigeons & Planes, which are in fact merged. It’s worth considering those two (or three) together for a moment. Pitchfork is the playlist’s token representative of “indie” music, whatever that means. Its vibe is actually on the poppy side of indie, bordering on “indie sludge,” I think we used to call it, along with a spattering of straight ahead indie (like with crunchy guitars in it), and also some slightly more edgy or obscure mainstream-ish stuff. All this makes it a pretty decent check on the Hot 100, and I’d say it’s as comparatively established in the indie world as Billboard is in the mainstream world, again, whatever any of that means.


#### Complex Best New Music This Week

Pigeons & Planes got absorbed into Complex a couple years ago at least, but the vibe has remained pretty well the same--it leans pretty heavily toward hip hop, mumble rap, trap-influenced stuff, with some occasional outliers that you’d expect to find on the electronic or R&B side of Pitchfork. So, a lot of profanity, gold teeth, a lot of songs that don’t have music videos, a fair share of its own flavor of quantized hi-hat-sludge, and then also some stuff that’s just plain good. Whatever vibe Complex represents is also pretty well represented in the Hot 100, so it has a legitimate place in this model of culture-at-large. But I don’t want to overinflate that particular vibe, so I could stand to be a little more vigilant about curating Complex. Only playing songs with music videos might accomplish this outright. It also makes me think I might want to start giving more thought to what counterbalances Complex. If Complex is the devil sitting on one shoulder, what’s sitting on the other shoulder? Stereogum and Popjustice?

There’s also a question of how many songs on average come from a source in a given period of time. I don’t know those sorts of numbers. How many new songs on a Billboard chart on average? I just roughly counted up Pitchfork and they add between about 25-30 songs in a month to their track reviews and best new songs combined. My guess would be that’s about half what’s new on Billboard. There are usually 10 new songs on a Complex weekly list, so that falls roughly in between Billboard and Pitchfork, not figuring whether songs have videos or not. My thought was that maybe I ought to scrape Pitchfork only monthly, and I also checked to see if Complex has a best songs of the month list (they don’t), so the result of this quick guesstimation is that I’ll leave things just as they are for now and scrape these three weekly.


#### The New York Times Playlist

Now what about the New York Times Playlist? Well, how ‘bout I listen to it, now that I can. I actually have pretty mixed feelings about the NYT Playlist. On one hand, it does have a solid focus on pop, most broadly defined, and manages to ferret out morsels of mainstream pop that cool kids in Brooklyn could publicly admit that they like, or at least could convince themselves that they like. This is the NYT Playlist’s superpower, and the reason it has a place here--it sharpens the edges just a little bit, and counterbalances all the various flavors of sludge. Compare this to any music on NPR, which manages somehow to turn everything it touches into smart-sludge. The NYT Playlist saves itself from this because deep down, it knows that pop is good, and doesn’t pretend to deny it. On the other hand, for some reason the NYT Playlist thinks that jazz (most broadly defined) is still cool, and that cool people would want jazz (most broadly defined) in the same playlist as pop (most broadly defined). Maybe the Playlist manages to convince these people that indeed, this is what they want. But more likely, the jazz is there to make the cool target audience feel better about liking the pop. Don’t worry, you can like this pop, because it’s *smart, cool* pop, and you can be even more confident that it’s smartcool pop because its in the same Playlist as some jazz. I have feelings about jazz, you know. At least as it relates to pop. In any event, I’ll scrape the NYT Playlist weekly, and pick out anything that’s there to justify the pop before adding it to the database.

Catching up, though--which means getting totally oversaturated by one source--I notice more things. One, that the NYT Playlist isn’t necessarily a “best songs of the week” list. It’s more like a list of songs that are noteworthy, and sometimes negatively noteworthy, which is nice--this is the musical world around you (according to us). I also do, in general, have a sad, exhausted feeling after going through a week’s NYT Playlist, usually with the sole exception of Jon Caramonica’s stuff, that is, the pop. Music that’s extra-musically noteworthy or “interesting” doesn’t often translate to music you’d actually want to listen to. And oh, god, all the jazz. How is it that nobody will admit how lazy and self-indulgent this stuff is? It takes impossibly more skill and magic and craft and everything to make a good pop song than to barf some more jazz into the world. It’s fun enough to play it (the more scary the chord symbol, just add more notes, play faster, and play louder--do whatever you want!), but please, everybody, don’t make us listen to it. Especially not in the same list as halfway decent pop.

These are all the sources that currently have scrapers, all up-to-date with the current week. Now on to expanding the territory.


&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [go on →]()\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; or\
[← go back](2020-05-10-listen-to-a-source.md)
