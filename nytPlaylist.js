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
    ('New York Times', 'The Playlist', 'A Bittersweet Juice WRLD Team-Up, and 13 More New Songs', '2020-12-04 08:58:58.000000', 'https://www.nytimes.com/2020/12/04/arts/music/playlist-juice-wrld-drake-britney-spears.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 759; // SELECT last_insert_rowid();
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
        "title": "Real ___",
        "artist_name": "Juice WRLD and Benny Blanco",
        "video_id": null,
        "capture_date": "2020-12-22 03:08:42.926926",
        "source_id": 759,
        "song_id": 9627,
        "duplicate": true
    },
    {
        "title": "Blinding Lights (Remix)",
        "artist_name": "The Weeknd featuring Rosalía",
        "video_id": null,
        "capture_date": "2020-12-22 03:08:42.927927",
        "source_id": 759,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Monsters",
        "artist_name": "All Time Low featuring Demi Lovato and blackbear",
        "video_id": null,
        "capture_date": "2020-12-22 03:08:42.927927",
        "source_id": 759,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Good Girls (Don’t Get Used)",
        "artist_name": "Beach Bunny",
        "video_id": null,
        "capture_date": "2020-12-22 03:08:42.927927",
        "source_id": 759,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "If",
        "artist_name": "Nana Yamato",
        "video_id": null,
        "capture_date": "2020-12-22 03:08:42.927927",
        "source_id": 759,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Telepatía",
        "artist_name": "Kali Uchis",
        "video_id": null,
        "capture_date": "2020-12-22 03:08:42.927927",
        "source_id": 759,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Coco",
        "artist_name": "24kGoldn featuring DaBaby",
        "video_id": null,
        "capture_date": "2020-12-22 03:08:42.927927",
        "source_id": 759,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "B.B. King Freestyle",
        "artist_name": "Lil Wayne featuring Drake",
        "video_id": null,
        "capture_date": "2020-12-22 03:08:42.927927",
        "source_id": 759,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "La Loba",
        "artist_name": "La Chica",
        "video_id": null,
        "capture_date": "2020-12-22 03:08:42.927927",
        "source_id": 759,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Swimming in the Stars",
        "artist_name": "Britney Spears",
        "video_id": null,
        "capture_date": "2020-12-22 03:08:42.927927",
        "source_id": 759,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Unblu",
        "artist_name": "Jenny Lewis and Serengeti",
        "video_id": null,
        "capture_date": "2020-12-22 03:08:42.927927",
        "source_id": 759,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Better Days",
        "artist_name": "Ant Clemons featuring Justin Timberlake",
        "video_id": null,
        "capture_date": "2020-12-22 03:08:42.927927",
        "source_id": 759,
        "song_id": null,
        "duplicate": false
    }
]

  // Check each song for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%Stay Down%'
    AND artist_name LIKE '%durk%'
  ;

  // If duplicates:
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
    ('Blinding Lights (Remix)', 'The Weeknd featuring Rosalía', NULL),
    ('Monsters', 'All Time Low featuring Demi Lovato and blackbear', NULL),
    ('Good Girls (Don’t Get Used)', 'Beach Bunny', NULL),
    ('If', 'Nana Yamato', NULL),
    ('Telepatía', 'Kali Uchis', NULL),
    ('Coco', '24kGoldn featuring DaBaby', NULL),
    ('B.B. King Freestyle', 'Lil Wayne featuring Drake', NULL),
    ('La Loba', 'La Chica', NULL),
    ('Swimming in the Stars', 'Britney Spears', NULL),
    ('Unblu', 'Jenny Lewis and Serengeti', NULL),
    ('Better Days', 'Ant Clemons featuring Justin Timberlake', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9701; // SELECT last_insert_rowid();

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
    ('2020-12-22 03:08:42.926926', '759', '9627'),
    ('2020-12-22 03:08:42.927927', '759', '9691'),
    ('2020-12-22 03:08:42.927927', '759', '9692'),
    ('2020-12-22 03:08:42.927927', '759', '9693'),
    ('2020-12-22 03:08:42.927927', '759', '9694'),
    ('2020-12-22 03:08:42.927927', '759', '9695'),
    ('2020-12-22 03:08:42.927927', '759', '9696'),
    ('2020-12-22 03:08:42.927927', '759', '9697'),
    ('2020-12-22 03:08:42.927927', '759', '9698'),
    ('2020-12-22 03:08:42.927927', '759', '9699'),
    ('2020-12-22 03:08:42.927927', '759', '9700'),
    ('2020-12-22 03:08:42.927927', '759', '9701')
  ;

  // Update to source_song table
