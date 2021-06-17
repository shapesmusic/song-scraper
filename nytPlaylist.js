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

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('New York Times', 'The Playlist', 'Lorde’s Sunburst, and 10 More New Songs', '2021-06-11 08:42:21.000000', 'https://www.nytimes.com/2021/06/11/arts/music/playlist-lorde-sza-pmbata.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 941; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("css-ow6j0y eoo0vm40"); // this class changes periodically

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
//

  songsData =
  [
    {
        "title": "Solar Power",
        "artist_name": "Lorde",
        "video_id": null,
        "capture_date": "2021-06-17 12:24:08.203203",
        "source_id": 941,
        "song_id": 10581,
        "duplicate": true
    },
    {
        "title": "EveryTime I Cry",
        "artist_name": "Ava Max",
        "video_id": null,
        "capture_date": "2021-06-17 12:24:08.204204",
        "source_id": 941,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Just for Me",
        "artist_name": "Saint Jhn and SZA",
        "video_id": null,
        "capture_date": "2021-06-17 12:24:08.204204",
        "source_id": 941,
        "song_id": 10578,
        "duplicate": true
    },
    {
        "title": "Favorite Song",
        "artist_name": "PmBata",
        "video_id": null,
        "capture_date": "2021-06-17 12:24:08.204204",
        "source_id": 941,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Nest",
        "artist_name": "Jomoro featuring Sharon Van Etten",
        "video_id": null,
        "capture_date": "2021-06-17 12:24:08.204204",
        "source_id": 941,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Blouse",
        "artist_name": "Clairo",
        "video_id": null,
        "capture_date": "2021-06-17 12:24:08.204204",
        "source_id": 941,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Formwela 4",
        "artist_name": "Esperanza Spalding featuring Corey King",
        "video_id": null,
        "capture_date": "2021-06-17 12:24:08.204204",
        "source_id": 941,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "A Fullness of Light in Your Soul",
        "artist_name": "Hypnotic Brass Ensemble featuring Perfume Genius",
        "video_id": null,
        "capture_date": "2021-06-17 12:24:08.205205",
        "source_id": 941,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Squint",
        "artist_name": "Julian Lage",
        "video_id": null,
        "capture_date": "2021-06-17 12:24:08.205205",
        "source_id": 941,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Day You Left",
        "artist_name": "Poo Bear",
        "video_id": null,
        "capture_date": "2021-06-17 12:24:08.205205",
        "source_id": 941,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Time Speed",
        "artist_name": "NoCap",
        "video_id": null,
        "capture_date": "2021-06-17 12:24:08.205205",
        "source_id": 941,
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
  ('EveryTime I Cry', 'Ava Max', NULL),
  ('Favorite Song', 'PmBata', NULL),
  ('Nest', 'Jomoro featuring Sharon Van Etten', NULL),
  ('Blouse', 'Clairo', NULL),
  ('Formwela 4', 'Esperanza Spalding featuring Corey King', NULL),
  ('A Fullness of Light in Your Soul', 'Hypnotic Brass Ensemble featuring Perfume Genius', NULL),
  ('Squint', 'Julian Lage', NULL),
  ('The Day You Left', 'Poo Bear', NULL),
  ('Time Speed', 'NoCap', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10607; // SELECT last_insert_rowid();

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
  ('2021-06-17 12:24:08.203203', '941', '10581'),
  ('2021-06-17 12:24:08.204204', '941', '10599'),
  ('2021-06-17 12:24:08.204204', '941', '10578'),
  ('2021-06-17 12:24:08.204204', '941', '10600'),
  ('2021-06-17 12:24:08.204204', '941', '10601'),
  ('2021-06-17 12:24:08.204204', '941', '10602'),
  ('2021-06-17 12:24:08.204204', '941', '10603'),
  ('2021-06-17 12:24:08.205205', '941', '10604'),
  ('2021-06-17 12:24:08.205205', '941', '10605'),
  ('2021-06-17 12:24:08.205205', '941', '10606'),
  ('2021-06-17 12:24:08.205205', '941', '10607')
  ;

  // Update to source_song table
