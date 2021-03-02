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
    ('New York Times', 'The Playlist', 'Cardi B’s Gleefully Relentless ‘Up,’ and 12 More New Songs', '2021-02-05 08:48:49.000000', 'https://www.nytimes.com/2021/02/05/arts/music/playlist-cardi-b-sia-vic-mensa.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 797; // SELECT last_insert_rowid();
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
        "title": "Up",
        "artist_name": "Cardi B",
        "video_id": null,
        "capture_date": "2021-03-01 04:10:34.337337",
        "source_id": 797,
        "song_id": 9774,
        "duplicate": true
    },
    {
        "title": "One More",
        "artist_name": "SG Lewis featuring Nile Rodgers",
        "video_id": null,
        "capture_date": "2021-03-01 04:10:34.337337",
        "source_id": 797,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Floating Through Space",
        "artist_name": "Sia and David Guetta",
        "video_id": null,
        "capture_date": "2021-03-01 04:10:34.337337",
        "source_id": 797,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Grow Up To",
        "artist_name": "Miss Grit",
        "video_id": null,
        "capture_date": "2021-03-01 04:10:34.337337",
        "source_id": 797,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Agua",
        "artist_name": "Bomba Estéreo featuring Okan and Lido Pimienta",
        "video_id": null,
        "capture_date": "2021-03-01 04:10:34.338338",
        "source_id": 797,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Two",
        "artist_name": "Flock of Dimes",
        "video_id": null,
        "capture_date": "2021-03-01 04:10:34.338338",
        "source_id": 797,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Shelter",
        "artist_name": "Vic Mensa featuring Wyclef Jean and Chance the Rapper",
        "video_id": null,
        "capture_date": "2021-03-01 04:10:34.338338",
        "source_id": 797,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Fight for You",
        "artist_name": "H.E.R.",
        "video_id": null,
        "capture_date": "2021-03-01 04:10:34.338338",
        "source_id": 797,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Notice",
        "artist_name": "Jimmy Edgar featuring 24hrs",
        "video_id": null,
        "capture_date": "2021-03-01 04:10:34.338338",
        "source_id": 797,
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
  ('One More', 'SG Lewis featuring Nile Rodgers', NULL),
  ('Floating Through Space', 'Sia and David Guetta', NULL),
  ('Grow Up To', 'Miss Grit', NULL),
  ('Agua', 'Bomba Estéreo featuring Okan and Lido Pimienta', NULL),
  ('Two', 'Flock of Dimes', NULL),
  ('Shelter', 'Vic Mensa featuring Wyclef Jean and Chance the Rapper', NULL),
  ('Fight for You', 'H.E.R.', NULL),
  ('Notice', 'Jimmy Edgar featuring 24hrs', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9889; // SELECT last_insert_rowid();

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
  ('2021-03-01 04:10:34.337337', '797', '9774'),
  ('2021-03-01 04:10:34.337337', '797', '9882'),
  ('2021-03-01 04:10:34.337337', '797', '9883'),
  ('2021-03-01 04:10:34.337337', '797', '9884'),
  ('2021-03-01 04:10:34.338338', '797', '9885'),
  ('2021-03-01 04:10:34.338338', '797', '9886'),
  ('2021-03-01 04:10:34.338338', '797', '9887'),
  ('2021-03-01 04:10:34.338338', '797', '9888'),
  ('2021-03-01 04:10:34.338338', '797', '9889')
  ;

  // Update to source_song table
