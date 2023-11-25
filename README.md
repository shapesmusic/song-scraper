# Song Scraper



### A Little Setup

1. Make sure the local copy of the `shapes.sqlite` database is up to date.
1. Point the sqlite CLI to the database with (for example):

```
sqlite3 /Users/davidforrest/david_local/development_local/shapes-backend/db/shapes.sqlite
```



### List of Sources

**Billboard**

- ✅🤖 Hot 100 https://www.billboard.com/charts/hot-100
- Pop Airplay https://www.billboard.com/charts/pop-songs/
- Radio Songs https://www.billboard.com/charts/radio-songs/
- TikTok Top 50 https://www.billboard.com/charts/tiktok-billboard-top-50/
- ✅ 10 Cool New Pop Songs https://www.billboard.com/results/#?q=cool%20new%20pop%20songs

**New York Times**

- ✅🤖 Playlist https://www.nytimes.com/column/playlist

**YouTube**

- Weekly Top Music Videos https://charts.youtube.com/charts/TopVideos/us/weekly
  - Regions: US, ...
- Weekly Top Songs https://charts.youtube.com/charts/TopSongs/us/weekly
  - Regions: US, ...
- New Releases: Music Videos https://music.youtube.com/new_releases/videos

**The Fader**

- ✅ Songs You Need In Your Life https://www.thefader.com/tag/songs-you-need-in-your-life

**Stereogum**

- ✅🤖 5 Best Songs of the Week https://www.stereogum.com/category/franchises/the-5-best-songs-of-the-week/

**Pitchfork**

- ✅🤖 Track Reviews https://pitchfork.com/reviews/tracks/
  - Includes Best New Tracks https://pitchfork.com/reviews/best/tracks/
- Pitchfork Selects https://pitchfork.com/tags/pitchfork-selects/

**Complex**

- Tag: Best New Music https://www.complex.com/tag/best_new_music
  - What's On Our Playlist
  - Best New Music This Week

**Spotify**

- ✅ Weekly Top Songs https://charts.spotify.com/charts/view/regional-global-weekly/latest
  - Regions: Global, ...

**Shazam**

- ✅ Top 200 Weekly https://charts.spotify.com/charts/view/regional-global-weekly/latest
  - Regions: Global, ...

**Popjustice**

-  New Music Friday https://www.popjustice.com/playlist/new-music-friday-popjustice-edit/

**Soundcloud**

- Top 50 https://soundcloud.com/charts/top?genre=all-music&country=all-countries
  - Regions: Global, ...

**Apple Music**

- Top 100 USA https://music.apple.com/us/playlist/top-100-usa/pl.606afcbb70264d2eb2b51d8dbcfa6a12



---

To list all recurring sources in the database:

```sql
SELECT DISTINCT parent_entity, parent_stream
FROM source
ORDER BY parent_entity;
```
