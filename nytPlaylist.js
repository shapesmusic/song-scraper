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
    ('New York Times', 'The Playlist', 'Alicia Keys’s Hypnotic Love Jam, and 12 More New Songs', '2021-10-29 11:30:05.000000', 'https://www.nytimes.com/2021/10/29/arts/music/playlist-alicia-keys-asap-rocky.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1062; // SELECT last_insert_rowid();
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
//          find and replace "Featur~ing" with "ft."
//

  songsData =
  [
    {
        "title": "Best of Me",
        "artist_name": "Alicia Keys",
        "video_id": null,
        "capture_date": "2021-12-30 07:27:41.306306",
        "source_id": 1062,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Rhododendron",
        "artist_name": "Hurray for the Riff Raff",
        "video_id": null,
        "capture_date": "2021-12-30 07:27:41.307307",
        "source_id": 1062,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Kiss of Life",
        "artist_name": "Kylie Minogue and Jessie Ware",
        "video_id": null,
        "capture_date": "2021-12-30 07:27:41.307307",
        "source_id": 1062,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Vaccine",
        "artist_name": "Baba Harare ft. Kae Chaps and Joseph Tivafire",
        "video_id": null,
        "capture_date": "2021-12-30 07:27:41.307307",
        "source_id": 1062,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sandman",
        "artist_name": "ASAP Rocky",
        "video_id": null,
        "capture_date": "2021-12-30 07:27:41.307307",
        "source_id": 1062,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "L’Appel du Mali Kura",
        "artist_name": "Collectif Mali Kura",
        "video_id": null,
        "capture_date": "2021-12-30 07:27:41.307307",
        "source_id": 1062,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Tocarte",
        "artist_name": "Jorge Drexler and C. Tangana",
        "video_id": null,
        "capture_date": "2021-12-30 07:27:41.307307",
        "source_id": 1062,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Nice Things",
        "artist_name": "Hayes Carll",
        "video_id": null,
        "capture_date": "2021-12-30 07:27:41.307307",
        "source_id": 1062,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bright Star",
        "artist_name": "Anaïs Mitchell",
        "video_id": null,
        "capture_date": "2021-12-30 07:27:41.307307",
        "source_id": 1062,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bessie, Did You Make It?",
        "artist_name": "Marissa Nadler",
        "video_id": null,
        "capture_date": "2021-12-30 07:27:41.307307",
        "source_id": 1062,
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
  ('Best of Me', 'Alicia Keys', NULL),
  ('Rhododendron', 'Hurray for the Riff Raff', NULL),
  ('Kiss of Life', 'Kylie Minogue and Jessie Ware', NULL),
  ('Vaccine', 'Baba Harare ft. Kae Chaps and Joseph Tivafire', NULL),
  ('Sandman', 'ASAP Rocky', NULL),
  ('L’Appel du Mali Kura', 'Collectif Mali Kura', NULL),
  ('Tocarte', 'Jorge Drexler and C. Tangana', NULL),
  ('Nice Things', 'Hayes Carll', NULL),
  ('Bright Star', 'Anaïs Mitchell', NULL),
  ('Bessie, Did You Make It?', 'Marissa Nadler', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11277; // SELECT last_insert_rowid();

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
  ('2021-12-30 07:27:41.306306', '1062', '11268'),
  ('2021-12-30 07:27:41.307307', '1062', '11269'),
  ('2021-12-30 07:27:41.307307', '1062', '11270'),
  ('2021-12-30 07:27:41.307307', '1062', '11271'),
  ('2021-12-30 07:27:41.307307', '1062', '11272'),
  ('2021-12-30 07:27:41.307307', '1062', '11273'),
  ('2021-12-30 07:27:41.307307', '1062', '11274'),
  ('2021-12-30 07:27:41.307307', '1062', '11275'),
  ('2021-12-30 07:27:41.307307', '1062', '11276'),
  ('2021-12-30 07:27:41.307307', '1062', '11277')
  ;

  // Update to source_song table
