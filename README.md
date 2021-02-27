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
|Complex|Best New Music This Week|[this list](https://www.complex.com/music/cat/lists)|[complex.js](https://github.com/davidforrest/Song-Scraper/blob/master/complex.js)|Weekly|Complex absorbed Pigeons & Planes|
|New York Times|Playlist|[this list](https://www.nytimes.com/column/playlist)|[nytPlaylist.js](https://github.com/davidforrest/Song-Scraper/blob/master/nytPlaylist.js)|Weekly|But weed out [the jazz](https://github.com/davidforrest/devJournal/blob/main/2020-05-12-1-new-music-tuesday.md#the-new-york-times-playlist)|
|Pitchfork|Track Reviews|[current chart](https://pitchfork.com/reviews/tracks/)|[pitchfork.js](https://github.com/davidforrest/Song-Scraper/blob/master/pitchfork.js)|Monthly|Includes Best New Tracks|
|Stereogum|The 5 Best Songs Of The Week|[this list](https://www.stereogum.com/category/franchises/the-5-best-songs-of-the-week/)|N/A|Weekly|**Interesting**|
|The Fader|10 songs you need in your life this week|[this list](https://www.thefader.com/search?query=10+songs+you+need+in+your+life+this+week)|N/A|Weekly|**Interesting**|
|Popjustice|New Music Friday: The Popjustice Edit|[current list](https://open.spotify.com/playlist/5s7cNVeGfehrRfCatNN43P)|N/A|Weekly||
|YouTube|Global Top Songs|[current chart](https://charts.youtube.com/global)|N/A|Weekly|**Interesting** YouTube also has several [other charts](https://charts.youtube.com/)|
|Hype Machine|Stack|[current chart](https://hypem.com/stack)|N/A|Weekly|Also [Popular Now](https://hypem.com/popular) updated realtime|
|Hype Machine|Zeitgeist|[current chart](https://hypem.com/zeitgeist/)|N/A|Yearly|Annual best of the Stack|
|Shazam|Top 200 Global|[current chart](https://www.shazam.com/charts/top-200/world)|N/A|Weekly|Can also filter by country|
|Spotify|Viral 50 Global|[current chart](https://spotifycharts.com/viral/global/weekly)|N/A|Weekly|New additions (`-`) or just the top 20|
|SoundCloud|Top 50 Global|[current chart](https://soundcloud.com/charts/top?genre=all-music&country=all-countries)|N/A|Weekly|Also ["New & Hot"](https://soundcloud.com/charts/new?genre=all-music&country=all-countries) and filter by country|
|KPWR Power 106|Music Playlist|[current list](https://www.power106.com/playlist/)|N/A|Weekly|Los Angeles 105.9 FM|
|KIIS FM|Top Songs|[current list](https://kiisfm.iheart.com/music/top-songs/)|N/A|Weekly|Los Angeles 102.7 FM|
|Next Big Sound|Pandora Top Spins|[current chart](https://www.nextbigsound.com/charts/top-spins)|N/A|Weekly|Other charts are by artist|
|Alpha Data|Top Songs|[current chart](https://alphadata.fm/charts/songs/)|N/A|Weekly (updated Daily)|Formerly Buzz Angle Music|
|Now That's What I Call Music!||[album list](https://www.nowmusic.com/albums/)|N/A|~Semi-Annually|Compilation albums|


**Add a non-recurring source:**

How?

**Add a single song:**

How?
