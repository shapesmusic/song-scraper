# Song Scraper

`This is a program to be executed by a human, with some help from computers.`  
Also, this is a [Learning Repo](https://github.com/davidforrest/A-Learning-Repo), so you can [follow its story](https://github.com/davidforrest/devJournal/blob/main/2020-05-03-2-resuscitating-the-chart-scrapers.md).


### A Little Setup
1. Make sure your local copy of the `shapes.sqlite` database is up to date.
1. Point the sqlite CLI to the database with (for example):
```
sqlite3 /Users/davidforrest/david_local/development_local/Shapes-API/www/shapes.sqlite
```


### Each Tuesday

1. [Scrape](https://github.com/davidforrest/Song-Scraper/blob/master/billboard.js) new songs from the [Billboard Hot 100](https://www.billboard.com/charts/hot-100) chart.
1. [Scrape](https://github.com/davidforrest/Song-Scraper/blob/master/complex.js) the most recent Complex Best New Music This Week, which you’ll find on [this list](https://www.complex.com/music/cat/lists).
1. [Scrape]() the most recent New York Times Playlist, which you’ll find on [this list](https://www.nytimes.com/column/playlist), but weed out [the jazz](https://github.com/davidforrest/Song-Scraper/blob/master/steps/2020-05-12-1-new-music-tuesday.md#the-new-york-times-playlist).


### Second Tuesday of the month

1. [Scrape](https://github.com/davidforrest/Song-Scraper/blob/master/pitchfork.js) new songs from [Pitchfork Track Reviews](https://pitchfork.com/reviews/tracks/) (which includes Best New Songs).
