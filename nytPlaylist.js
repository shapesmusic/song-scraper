// Scroll to the bottom of the page first, so all the lazyload stuff loads.

// NOTE: sometimes two songs are grouped as one entry. This would potentially mess up `video_id` scraping.


//
// Step 0: Check recent scraped
//

  SELECT publication_date, instance_name FROM source WHERE parent_entity = 'New York Times' ORDER BY publication_date DESC LIMIT 3;


//
// Step 1: Scrape source data
//

  // Add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // Get and format source data
  title = document.getElementsByTagName("h1")[0].innerText;
  instanceName = title.match(/[^:]+$/)[0].trim();
  publicationDate = document.getElementsByTagName("time")[0].dateTime;
  publicationDateFormatted = moment(publicationDate).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format
  chartLocation = window.location.href;

  // Build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'New York Times\', "
    + "\'The Playlist\', "
    + "\'" + instanceName + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + chartLocation + "\');"
  );

  // Stage the SQL statement
  // Replace any ' in strings with ’
  // Make sure the publication_date matches the URL's date

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('New York Times', 'The Playlist', 'My Chemical Romance’s Prog-Emo Surprise, and 12 More New Songs', '2022-05-13 08:16:46.000000', 'https://www.nytimes.com/2022/05/13/arts/music/playlist-my-chemical-romance-kendrick-lamar.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1209; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("css-1bxm55 eoo0vm40"); // this class changes periodically

  songsData = [];

  for (var i=0; i<elements.length; i++){

    merged = elements[i].innerText;
    title = merged.match(/, ‘(.*?)’$/)[1] // $ gives you the last apostrophe, so it doesn't cut off words like "ain't, etc."
    // if this throws an error, enter `merged` to see the problem song.
    artist_name = merged.match(/.+?(?=, ‘)/)[0];
    video_id = null;
    capture_date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

    // vidUrl = document.getElementsByClassName("css-1u3pw94")[i].innerHTML;
    // videoId = vidUrl.match(/embed\/([^"]{0,})/)[1];

    songData = {
      'title' : title,
      'artist_name' : artist_name,
      'video_id' : video_id,
      'capture_date' : capture_date,
      'source_id' : source_id,
      'song_id' : song_id,
      'duplicate' : false
    };

    songsData.push(songData);

  };

  console.log(JSON.stringify(songsData, null, 4));


//
// Step 3:  Stage songsData,
//          preview chart and prune songs (add video_id later),
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//          find and replace "featur~ing" with "ft."
//

  songsData =
  [
    {
        "title": "The Foundations of Decay",
        "artist_name": "My Chemical Romance",
        "video_id": null,
        "capture_date": "2022-05-29 05:25:16.755755",
        "source_id": 1209,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Opposite",
        "artist_name": "The Smile",
        "video_id": null,
        "capture_date": "2022-05-29 05:25:16.760760",
        "source_id": 1209,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Welcome to Hell",
        "artist_name": "black midi",
        "video_id": null,
        "capture_date": "2022-05-29 05:25:16.760760",
        "source_id": 1209,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Heart Part 5",
        "artist_name": "Kendrick Lamar",
        "video_id": null,
        "capture_date": "2022-05-29 05:25:16.760760",
        "source_id": 1209,
        "song_id": 12176,
        "duplicate": true
    },
    {
        "title": "Brown",
        "artist_name": "Flores",
        "video_id": null,
        "capture_date": "2022-05-29 05:25:16.760760",
        "source_id": 1209,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Michael",
        "artist_name": "Remi Wolf",
        "video_id": null,
        "capture_date": "2022-05-29 05:25:16.760760",
        "source_id": 1209,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Lydia Wears a Cross",
        "artist_name": "Julia Jacklin",
        "video_id": null,
        "capture_date": "2022-05-29 05:25:16.760760",
        "source_id": 1209,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Roman Candles",
        "artist_name": "Death Cab for Cutie",
        "video_id": null,
        "capture_date": "2022-05-29 05:25:16.760760",
        "source_id": 1209,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "How Long",
        "artist_name": "The Black Keys",
        "video_id": null,
        "capture_date": "2022-05-29 05:25:16.760760",
        "source_id": 1209,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Purple Haze",
        "artist_name": "Joy Oladokun",
        "video_id": null,
        "capture_date": "2022-05-29 05:25:16.760760",
        "source_id": 1209,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Girl Ur So Pretty",
        "artist_name": "Ambar Lucid",
        "video_id": null,
        "capture_date": "2022-05-29 05:25:16.760760",
        "source_id": 1209,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Interpret It Well",
        "artist_name": "Ches Smith",
        "video_id": null,
        "capture_date": "2022-05-29 05:25:16.760760",
        "source_id": 1209,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Fanfare",
        "artist_name": "Jacob Garchik",
        "video_id": null,
        "capture_date": "2022-05-29 05:25:16.760760",
        "source_id": 1209,
        "song_id": null,
        "duplicate": false
    }
]

  // Check each song for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%AP%'
    AND artist_name LIKE '%Pop Smoke%'
  ;

  // If any changes:
  // Update var songsData = the deduplicated list above


//
// Step 4: Update nonduplicates to the song table
//

  // Build the SQL statement
  songs = [];

  for (var i=0; i<songsData.length; i++){
    song = String(
      "\n(\'" + songsData[i].title + "\', "
      + "\'" + songsData[i].artist_name + "\', "
      + "NULL)"
    );

    if (songsData[i].duplicate == false){
      songs.push(song);
    }
  }
  console.log(String(songs));


  // Stage SQL statement
  // Replace any ' in strings with ’

  INSERT INTO song
    (title, artist_name, video_id)
  VALUES
  ('The Foundations of Decay', 'My Chemical Romance', NULL),
  ('The Opposite', 'The Smile', NULL),
  ('Welcome to Hell', 'black midi', NULL),
  ('Brown', 'Flores', NULL),
  ('Michael', 'Remi Wolf', NULL),
  ('Lydia Wears a Cross', 'Julia Jacklin', NULL),
  ('Roman Candles', 'Death Cab for Cutie', NULL),
  ('How Long', 'The Black Keys', NULL),
  ('Purple Haze', 'Joy Oladokun', NULL),
  ('Girl Ur So Pretty', 'Ambar Lucid', NULL),
  ('Interpret It Well', 'Ches Smith', NULL),
  ('Fanfare', 'Jacob Garchik', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 12210; // SELECT last_insert_rowid();

  // Calculate the number of nonduplicate songs added
  nonduplicates = 0;

  for (var i=0; i<songsData.length; i++){
    if (songsData[i].duplicate == false){
      nonduplicates++
    }
  };

  // Update nonduplicate song_ids
  for (var i=0; i<songsData.length; i++){

    if (songsData[i].duplicate == false){
      songsData[i].song_id = (song_id - nonduplicates +1);
      nonduplicates--;
    }
  }

  // Build the SQL statement
  source_songs = [];

  for (var i=0; i<songsData.length; i++){
    source_song = String(
      "\n(\'" + songsData[i].capture_date + "\', "
      + "\'" + songsData[i].source_id + "\', "
      + "\'" + songsData[i].song_id + "\')"
    );

    source_songs.push(source_song);
  }

  console.log(String(source_songs));


  // Stage the SQL statement
  INSERT INTO source_song
    (capture_date, source_id, song_id)
  VALUES
  ('2022-05-29 05:25:16.755755', '1209', '12199'),
  ('2022-05-29 05:25:16.760760', '1209', '12200'),
  ('2022-05-29 05:25:16.760760', '1209', '12201'),
  ('2022-05-29 05:25:16.760760', '1209', '12176'),
  ('2022-05-29 05:25:16.760760', '1209', '12202'),
  ('2022-05-29 05:25:16.760760', '1209', '12203'),
  ('2022-05-29 05:25:16.760760', '1209', '12204'),
  ('2022-05-29 05:25:16.760760', '1209', '12205'),
  ('2022-05-29 05:25:16.760760', '1209', '12206'),
  ('2022-05-29 05:25:16.760760', '1209', '12207'),
  ('2022-05-29 05:25:16.760760', '1209', '12208'),
  ('2022-05-29 05:25:16.760760', '1209', '12209'),
  ('2022-05-29 05:25:16.760760', '1209', '12210')
  ;

  // Update to source_song table
