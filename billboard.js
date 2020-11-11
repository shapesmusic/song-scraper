//
// Step 0: check recent scraped
//

SELECT instance_name FROM source WHERE parent_entity = 'Billboard' ORDER BY publication_date DESC LIMIT 8;

//
// Step 1: scrape source data
//

  // add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // get and format publicationDate
  publicationDate = document.getElementsByClassName('date-selector__button button--link')[0].innerText.trim();
  publicationDateFormatted = moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

  // URL changes once current chart is archived
  currentChartLocation = window.location.href + "/" + moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD");
  pastChartLocation = window.location.href;

  // build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'Billboard\', \'The Hot 100\', \'Week of "
    + publicationDate + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + currentChartLocation + "\');"
  )

  // stage the statement below and insert the source into the db
  // replace any ' in strings with ’

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('Billboard', 'The Hot 100', 'Week of November 14, 2020', '2020-11-14 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2020-11-14');


//
// Step 2: scrape song data (title, artist_name, video_id)
//

  source_id = 743; // `SELECT last_insert_rowid();`
  song_id = null;

  elements = document.getElementsByClassName('chart-list__element display--flex');

  songsData = [];
  // songs = [];

  for (var i=0; i<elements.length; i++){
      element = elements[i];
      isNew = element.getElementsByClassName('chart-element__trend chart-element__trend--new color--accent');
      songName = element.getElementsByClassName('chart-element__information__song text--truncate color--primary')[0];
      artistName = element.getElementsByClassName('chart-element__information__artist text--truncate color--secondary')[0];

      title = songName.innerText.trim();
      artist_name = artistName.innerText.trim();
      video_id = null;
      capture_date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

      songData = {
        'title' : title,
        'artist_name' : artist_name,
        'video_id' : video_id,
        'capture_date' : capture_date,
        'source_id' : source_id,
        'song_id' : song_id
      };

      // song = String(
      //   "\n(\'" + title + "\', "
      //   + "\'" + artist_name + "\', "
      //   + "NULL)"
      // );

      if(isNew.length == 1 && isNew[0].innerText == "New"){ // because innerText can also be "Re-Enter"

        songsData.push(songData);
        // songs.push(song);

      };
  };

  JSON.stringify(songsData, null, 4);
  // console.log(String(songs));


//
// Step 3: stage songsData and move duplicates into a separate list below
//

songsData =
[
    {
        "title": "34+35",
        "artist_name": "Ariana Grande",
        "video_id": null,
        "capture_date": "2020-11-10 11:16:59.629629",
        "source_id": 743,
        "song_id": null
    },
    {
        "title": "Dakiti",
        "artist_name": "Bad Bunny & Jhay Cortez",
        "video_id": null,
        "capture_date": "2020-11-10 11:16:59.629629",
        "source_id": 743,
        "song_id": null
    },
    {
        "title": "Motive",
        "artist_name": "Ariana Grande Featuring Doja Cat",
        "video_id": null,
        "capture_date": "2020-11-10 11:16:59.629629",
        "source_id": 743,
        "song_id": null
    },
    {
        "title": "Off The Table",
        "artist_name": "Ariana Grande Featuring The Weeknd",
        "video_id": null,
        "capture_date": "2020-11-10 11:16:59.629629",
        "source_id": 743,
        "song_id": null
    },
    {
        "title": "pov",
        "artist_name": "Ariana Grande",
        "video_id": null,
        "capture_date": "2020-11-10 11:16:59.629629",
        "source_id": 743,
        "song_id": null
    },
    {
        "title": "Just Like Magic",
        "artist_name": "Ariana Grande",
        "video_id": null,
        "capture_date": "2020-11-10 11:16:59.630630",
        "source_id": 743,
        "song_id": null
    },
    {
        "title": "Shut Up",
        "artist_name": "Ariana Grande",
        "video_id": null,
        "capture_date": "2020-11-10 11:16:59.630630",
        "source_id": 743,
        "song_id": null
    },
    {
        "title": "Nasty",
        "artist_name": "Ariana Grande",
        "video_id": null,
        "capture_date": "2020-11-10 11:16:59.630630",
        "source_id": 743,
        "song_id": null
    },
    {
        "title": "Safety Net",
        "artist_name": "Ariana Grande Featuring Ty Dolla $ign",
        "video_id": null,
        "capture_date": "2020-11-10 11:16:59.630630",
        "source_id": 743,
        "song_id": null
    },
    {
        "title": "My Hair",
        "artist_name": "Ariana Grande",
        "video_id": null,
        "capture_date": "2020-11-10 11:16:59.630630",
        "source_id": 743,
        "song_id": null
    },
    {
        "title": "Obvious",
        "artist_name": "Ariana Grande",
        "video_id": null,
        "capture_date": "2020-11-10 11:16:59.630630",
        "source_id": 743,
        "song_id": null
    },
    {
        "title": "West Side",
        "artist_name": "Ariana Grande",
        "video_id": null,
        "capture_date": "2020-11-10 11:16:59.630630",
        "source_id": 743,
        "song_id": null
    },
    {
        "title": "Love Language",
        "artist_name": "Ariana Grande",
        "video_id": null,
        "capture_date": "2020-11-10 11:16:59.630630",
        "source_id": 743,
        "song_id": null
    },
    {
        "title": "Weeeeee",
        "artist_name": "Trippie Redd",
        "video_id": null,
        "capture_date": "2020-11-10 11:16:59.631631",
        "source_id": 743,
        "song_id": null
    },
    {
        "title": "Thick",
        "artist_name": "DJ Chose Featuring BeatKing",
        "video_id": null,
        "capture_date": "2020-11-10 11:16:59.631631",
        "source_id": 743,
        "song_id": null
    },
    {
        "title": "Take You Dancing",
        "artist_name": "Jason Derulo",
        "video_id": null,
        "capture_date": "2020-11-10 11:16:59.631631",
        "source_id": 743,
        "song_id": null
    }
]


// check for duplicates, move them into a separate list, add song_id
SELECT id, title, artist_name FROM song WHERE
	title LIKE '%Stay Down%'
  AND artist_name LIKE '%durk%'
;

duplicates =
[
  {
      "title": "Six Thirty",
      "artist_name": "Ariana Grande",
      "video_id": null,
      "capture_date": "2020-11-10 11:16:59.630630",
      "source_id": 743,
      "song_id": 9472
  },
  {
      "title": "Stay Down",
      "artist_name": "Lil Durk, 6LACK & Young Thug",
      "video_id": null,
      "capture_date": "2020-11-10 11:16:59.631631",
      "source_id": 743,
      "song_id": 9476
  },
]


//
// Step 4:
//

  // update songsData from deduplicated list above

  // build SQL statement to update nonduplicates to song table

  songs = [];

  for (var i=0; i<songsData.length; i++){

    song = String(
      "\n(\'" + songsData[i].title + "\', "
      + "\'" + songsData[i].artist_name + "\', "
      + "NULL)"
    );

    songs.push(song);
  }
  console.log(String(songs));

  // stage SQL statement and update to song table
  // replace any ' in strings with ’

  INSERT INTO song
    (title, artist_name, video_id)
  VALUES
    ('34+35', 'Ariana Grande', NULL),
    ('Dakiti', 'Bad Bunny & Jhay Cortez', NULL),
    ('Motive', 'Ariana Grande Featuring Doja Cat', NULL),
    ('Off The Table', 'Ariana Grande Featuring The Weeknd', NULL),
    ('pov', 'Ariana Grande', NULL),
    ('Just Like Magic', 'Ariana Grande', NULL),
    ('Shut Up', 'Ariana Grande', NULL),
    ('Nasty', 'Ariana Grande', NULL),
    ('Safety Net', 'Ariana Grande Featuring Ty Dolla $ign', NULL),
    ('My Hair', 'Ariana Grande', NULL),
    ('Obvious', 'Ariana Grande', NULL),
    ('West Side', 'Ariana Grande', NULL),
    ('Love Language', 'Ariana Grande', NULL),
    ('Weeeeee', 'Trippie Redd', NULL),
    ('Thick', 'DJ Chose Featuring BeatKing', NULL),
    ('Take You Dancing', 'Jason Derulo', NULL)
  ;

  // build SQL statement to update all songs to source_song

  // first add nonduplicates

  song_id = 9523; // `SELECT last_insert_rowid();`

  // TBC
