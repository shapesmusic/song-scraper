# Song Scraper

`This is a program to be executed by a human, with some help from computers.`  


### A Little Setup
1. Make sure the local copy of the `shapes.sqlite` database is up to date.
1. Point the sqlite CLI to the database with (for example):
```
sqlite3 /Users/davidforrest/david_local/development_local/Shapes-API/www/shapes.sqlite
```

### List of Sources

To list all recurring sources currently in the database:
```sql
SELECT DISTINCT parent_entity, parent_stream
FROM source
ORDER BY parent_entity;
```
<br>

**Recurring Sources:**  

|Entity|Stream|Where|Scraper|Frequency|Notes|
|---|---|---|---|---|---|
|Billboard|Hot 100|[current chart](https://www.billboard.com/charts/hot-100)|[billboard.js](https://github.com/davidforrest/Song-Scraper/blob/master/billboard.js)|Weekly|Billboard also has several [other charts](https://www.billboard.com/charts#id-chart-category-overallpopularity)|
|New York Times|Playlist|[this list](https://www.nytimes.com/column/playlist)|[nytPlaylist.js](https://github.com/davidforrest/Song-Scraper/blob/master/nytPlaylist.js)|Weekly|But weed out [the jazz](https://github.com/davidforrest/devJournal/blob/main/2020-05-12-1-new-music-tuesday.md#the-new-york-times-playlist)|
|Pitchfork|Track Reviews|[current chart](https://pitchfork.com/reviews/tracks/)|[pitchfork.js](https://github.com/davidforrest/Song-Scraper/blob/master/pitchfork.js)|Monthly|Includes Best New Tracks. Also see [Pitchfork Selects](https://pitchfork.com/search/?query=Pitchfork%20Selects)|
|Complex|Best New Music This Week|[this list](https://www.complex.com/music/cat/lists)|[complex.js](https://github.com/davidforrest/Song-Scraper/blob/master/complex.js)|Weekly|Complex absorbed Pigeons & Planes|
|The Fader|10 songs you need in your life this week|[this list](https://www.thefader.com/search?query=10+songs+you+need+in+your+life+this+week)|😸|Weekly||
|Stereogum|The 5 Best Songs Of The Week|[this list](https://www.stereogum.com/category/franchises/the-5-best-songs-of-the-week/)|😸||
|YouTube|Global Top Songs|[current chart](https://charts.youtube.com/charts/TopSongs/global)|[yt.js](https://github.com/davidforrest/Song-Scraper/blob/master/yt.js)|Weekly|Works for YT's [other charts](https://charts.youtube.com/) too|
|Spotify|Viral 50 Global|[current chart](https://spotifycharts.com/viral/global/weekly)|😸|Weekly|New additions (`-`)|
|Shazam|Top 200 Global|[current chart](https://www.shazam.com/charts/top-200/world)|😸Not as many duplicates as you'd think. |Weekly|Can also filter by country|
|Popjustice|New Music Friday: The Popjustice Edit|[this list](https://www.popjustice.com/?s=New+Music) or [Spotify](https://open.spotify.com/playlist/5s7cNVeGfehrRfCatNN43P)|😸|Weekly|Also see [Top 45 singles](https://www.popjustice.com/?s=Top+45+singles) of the year|
|SoundCloud|Top 50 Global|[current chart](https://soundcloud.com/charts/top?genre=all-music&country=all-countries)|😸|Weekly|Also ["New & Hot"](https://soundcloud.com/charts/new?genre=all-music&country=all-countries) and filter by country|
|Hype Machine|Stack|[current chart](https://hypem.com/stack)|😸|Weekly|Also [Popular Now](https://hypem.com/popular) updated realtime|


**Manual Additions**

Use [manual-add.js](https://github.com/davidforrest/Song-Scraper/blob/master/manual-add.js) to add single songs and non-recurring sources.

**One-Time Scrapes**

Use [onetime-list.js](https://github.com/davidforrest/Song-Scraper/blob/master/onetime-list.js) to set up a large list scrape that you're only going to use once.
