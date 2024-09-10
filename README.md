# Song Scraper



### A Little Setup

1. Make sure the local copy of the `shapes.sqlite` database is up to date.
1. Point the sqlite CLI to the database:

```
sqlite3 /Users/davidforrest/david_local/development_local/shapes-backend/db/shapes.sqlite
```



### List of Sources

**NMT [2024-09-10]**
Most recent 👀 date in [brackets]



**Billboard**

- ✅[🤖](billboard.js) Hot 100 https://www.billboard.com/charts/hot-100 [wk of 2024-09-14]
- ✅ Friday Music Guide https://www.billboard.com/t/friday-music-guide/ [2024-09-06]
- 10 Cool New Pop Songs https://www.billboard.com/t/10-cool-new-pop-songs/ [2024-08-12]
- Pop Airplay https://www.billboard.com/charts/pop-songs/
- Radio Songs https://www.billboard.com/charts/radio-songs/
- TikTok Top 50 https://www.billboard.com/charts/tiktok-billboard-top-50/

**New York Times**

- ✅[🤖](nytPlaylist.js) Playlist https://www.nytimes.com/column/playlist [2024-09-06]

**YouTube**

- ✅ Weekly Top Music Videos https://charts.youtube.com/charts/TopVideos/global/weekly
  - Download CSV, copy the top 10 or so title and artist values, and use the GPT prompt: `please turn the following list into a SQLite statement with the format INSERT INTO NMT (title, artist_name, video_id) and video_id values NULL: <paste list>`
  - Regions: Global, ...
- Weekly Top Songs https://charts.youtube.com/charts/TopSongs/us/weekly
  - Regions: US, ...
- New Releases: Music Videos https://music.youtube.com/new_releases/videos

**The Fader**

- ✅🤖 Songs You Need In Your Life https://www.thefader.com/tag/songs-you-need-in-your-life [Sept 2024 Playlist - through "Malibu Beach House"] 

**Stereogum**

- ✅[🤖](stereogum.js) 5 Best Songs of the Week https://www.stereogum.com/category/franchises/the-5-best-songs-of-the-week/ [2024-09-06]

**Pitchfork**

- ✅[🤖](pitchfork.js) Track Reviews https://pitchfork.com/reviews/tracks/ [2024-09-06 "SOS (Magic I Want U)"]
  - Includes Best New Tracks https://pitchfork.com/reviews/best/tracks/
- ✅ Pitchfork Selects https://pitchfork.com/tags/pitchfork-selects/ [2024-09-09] (also in Feedly)
  - copy list and use GPT prompt above


**Popjustice**

- ✅ New Music Friday https://open.spotify.com/playlist/5s7cNVeGfehrRfCatNN43P [Fri 2024-09-06]
  - use [Exportify](https://watsonbox.github.io/exportify/#access_token=BQCtHvo26Mks5zysMmDjh3ZxJ5FisQkzudP1yv2zrcTEK0oUBS4xQHNwLcdjh2SCyaDb8FRqTS5Ke0PiYC5k61Kg7vfHZuiXuvq6CzJQw1LGv9u86bCgQrj5uJ4h_QfWdnIpeLBBh-5Zqr4bE5oG5iWGYedr3Iou3C4BQkeZxCvWdIKf0m0Zg4u6LDOGW4krW0tOwL55qhhYyT2Tv7rhsqdEJw&token_type=Bearer&expires_in=3600), copy title and artist columns, and use the GPT prompt above.


**Complex**

- Tag: Best New Music https://www.complex.com/tag/best_new_music
  - What's On Our Playlist
  - Best New Music This Week

**Spotify**

- ✅ Weekly Top Songs https://charts.spotify.com/charts/view/regional-global-weekly/latest [Week of 2024-09-05]
  - Regions: Global, ...
  - Download CSV, copy the top 10 or so titles and artists, and use the GPT prompt above.
  - Week ends on Thursday.

**Shazam**

- ✅ Top 200 Weekly https://www.shazam.com/charts/top-200/world [2024-09-10]
  - Regions: Global, ...
  - Download CSV, delete all but the top 10 or so rows, copy title and artist columns, and use the GPT prompt above.
  - Gives data for the past 7 days from the date accessed.

**Soundcloud**

- Top 50 https://soundcloud.com/charts/top?genre=all-music&country=all-countries
  - Regions: Global, ...

**Apple Music**

- Top 100 USA https://music.apple.com/us/playlist/top-100-usa/pl.606afcbb70264d2eb2b51d8dbcfa6a12

**Feeds**

- Brooklyn Vegan (x New Songs Out Today)

- EARMILK

- Indie Shuffle

- Obscure Sound

- The Owl

- Line Of Best Fit

- ...

  

---

