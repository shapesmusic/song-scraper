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
    ('New York Times', 'The Playlist', 'Gwen Stefani’s Ska-Pop Flashback, and 10 More New Songs', '2020-12-11 09:27:22.000000', 'https://www.nytimes.com/2020/12/11/arts/music/playlist-gwen-stefani-sturgill-simpson.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 760; // SELECT last_insert_rowid();
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
        "title": "Let Me Reintroduce Myself",
        "artist_name": "Gwen Stefani",
        "video_id": null,
        "capture_date": "2020-12-22 03:17:03.257257",
        "source_id": 760,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Easy",
        "artist_name": "Troye Sivan, Kacey Musgraves and Mark Ronson",
        "video_id": null,
        "capture_date": "2020-12-22 03:17:03.259259",
        "source_id": 760,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Dead Walk",
        "artist_name": "John Carpenter",
        "video_id": null,
        "capture_date": "2020-12-22 03:17:03.259259",
        "source_id": 760,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Lurkin",
        "artist_name": "Funkmaster Flex featuring King Von",
        "video_id": null,
        "capture_date": "2020-12-22 03:17:03.259259",
        "source_id": 760,
        "song_id": 9676,
        "duplicate": true
    },
    {
        "title": "3:30 in Houston",
        "artist_name": "Benny the Butcher",
        "video_id": null,
        "capture_date": "2020-12-22 03:17:03.259259",
        "source_id": 760,
        "song_id": 9674,
        "duplicate": true
    },
    {
        "title": "Pain",
        "artist_name": "King Princess",
        "video_id": null,
        "capture_date": "2020-12-22 03:17:03.259259",
        "source_id": 760,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Oh Sarah",
        "artist_name": "Sturgill Simpson",
        "video_id": null,
        "capture_date": "2020-12-22 03:17:03.259259",
        "source_id": 760,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Another You",
        "artist_name": "Elle King",
        "video_id": null,
        "capture_date": "2020-12-22 03:17:03.259259",
        "source_id": 760,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Alone in Halls",
        "artist_name": "El Perro del Mar featuring Blood Orange",
        "video_id": null,
        "capture_date": "2020-12-22 03:17:03.259259",
        "source_id": 760,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Ferry",
        "artist_name": "Moontype",
        "video_id": null,
        "capture_date": "2020-12-22 03:17:03.259259",
        "source_id": 760,
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
    ('Let Me Reintroduce Myself', 'Gwen Stefani', NULL),
    ('Easy', 'Troye Sivan, Kacey Musgraves and Mark Ronson', NULL),
    ('The Dead Walk', 'John Carpenter', NULL),
    ('Pain', 'King Princess', NULL),
    ('Oh Sarah', 'Sturgill Simpson', NULL),
    ('Another You', 'Elle King', NULL),
    ('Alone in Halls', 'El Perro del Mar featuring Blood Orange', NULL),
    ('Ferry', 'Moontype', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9709; // SELECT last_insert_rowid();

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
    ('2020-12-22 03:17:03.257257', '760', '9702'),
    ('2020-12-22 03:17:03.259259', '760', '9703'),
    ('2020-12-22 03:17:03.259259', '760', '9704'),
    ('2020-12-22 03:17:03.259259', '760', '9676'),
    ('2020-12-22 03:17:03.259259', '760', '9674'),
    ('2020-12-22 03:17:03.259259', '760', '9705'),
    ('2020-12-22 03:17:03.259259', '760', '9706'),
    ('2020-12-22 03:17:03.259259', '760', '9707'),
    ('2020-12-22 03:17:03.259259', '760', '9708'),
    ('2020-12-22 03:17:03.259259', '760', '9709')
  ;

  // Update to source_song table
