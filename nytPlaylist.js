// Scroll to the bottom of the page first, so all the lazyload stuff loads.

// NOTE: sometimes two songs are grouped as one entry. This would potentially mess up `video_id` scraping.


//
// Step 0: Check recent scraped
//

  SELECT instance_name, publication_date FROM source WHERE parent_entity = 'New York Times' ORDER BY publication_date DESC LIMIT 8;


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
    ('New York Times', 'The Playlist', 'Taylor Swift’s New Old ‘Love Story,’ and 12 More Songs', '2021-03-01 09:46:20.000000', 'https://www.nytimes.com/2021/02/12/arts/music/playlist-taylor-swift-dua-lipa.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 798; // SELECT last_insert_rowid();
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

  JSON.stringify(songsData, null, 4);


//
// Step 3: Stage songsData, preview chart and prune songs, find & set any duplicate songs to true, and add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "Love Story (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2021-03-01 04:20:31.921921",
        "source_id": 798,
        "song_id": 9787,
        "duplicate": true
    },
    {
        "title": "Friday (Remix)",
        "artist_name": "Rebecca Black featuring Dorian Electra, Big Freedia and 3OH!3",
        "video_id": null,
        "capture_date": "2021-03-01 04:20:31.922922",
        "source_id": 798,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "We’re Good",
        "artist_name": "Dua Lipa",
        "video_id": null,
        "capture_date": "2021-03-01 04:20:31.922922",
        "source_id": 798,
        "song_id": 9788,
        "duplicate": true
    },
    {
        "title": "Fan de Tus Fotos",
        "artist_name": "Nicky Jam and Romeo Santos",
        "video_id": null,
        "capture_date": "2021-03-01 04:20:31.922922",
        "source_id": 798,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Big Bang",
        "artist_name": "Cherry Glazerr",
        "video_id": null,
        "capture_date": "2021-03-01 04:20:31.922922",
        "source_id": 798,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "One + One",
        "artist_name": "Death From Above 1979",
        "video_id": null,
        "capture_date": "2021-03-01 04:20:31.922922",
        "source_id": 798,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hall of Death",
        "artist_name": "Matt Sweeney and Bonnie ‘Prince’ Billy",
        "video_id": null,
        "capture_date": "2021-03-01 04:20:31.922922",
        "source_id": 798,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Calling My Phone",
        "artist_name": "Lil Tjay featuring 6lack",
        "video_id": null,
        "capture_date": "2021-03-01 04:20:31.922922",
        "source_id": 798,
        "song_id": 9786,
        "duplicate": true
    },
    {
        "title": "Portals",
        "artist_name": "Katy Kirby",
        "video_id": null,
        "capture_date": "2021-03-01 04:20:31.922922",
        "source_id": 798,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Circles",
        "artist_name": "Brent Faiyaz featuring Purr",
        "video_id": null,
        "capture_date": "2021-03-01 04:20:31.922922",
        "source_id": 798,
        "song_id": null,
        "duplicate": false
    }
]

  // Check each song for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%Up%'
    AND artist_name LIKE '%Cardi%'
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
  ('Friday (Remix)', 'Rebecca Black featuring Dorian Electra, Big Freedia and 3OH!3', NULL),
  ('Fan de Tus Fotos', 'Nicky Jam and Romeo Santos', NULL),
  ('Big Bang', 'Cherry Glazerr', NULL),
  ('One + One', 'Death From Above 1979', NULL),
  ('Hall of Death', 'Matt Sweeney and Bonnie ‘Prince’ Billy', NULL),
  ('Portals', 'Katy Kirby', NULL),
  ('Circles', 'Brent Faiyaz featuring Purr', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9896; // SELECT last_insert_rowid();

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
  ('2021-03-01 04:20:31.921921', '798', '9787'),
  ('2021-03-01 04:20:31.922922', '798', '9890'),
  ('2021-03-01 04:20:31.922922', '798', '9788'),
  ('2021-03-01 04:20:31.922922', '798', '9891'),
  ('2021-03-01 04:20:31.922922', '798', '9892'),
  ('2021-03-01 04:20:31.922922', '798', '9893'),
  ('2021-03-01 04:20:31.922922', '798', '9894'),
  ('2021-03-01 04:20:31.922922', '798', '9786'),
  ('2021-03-01 04:20:31.922922', '798', '9895'),
  ('2021-03-01 04:20:31.922922', '798', '9896')
  ;

  // Update to source_song table
