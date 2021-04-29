// FIXME: regex [ft. artists are in brackets] and IN SONG NAME, not ARTIST

//
// Step 0: Check recent scraped
//

  SELECT source.publication_date, song.title
  FROM source_song
  INNER JOIN song
    ON song.id = source_song.song_id
  INNER JOIN source
    ON source.id = source_song.source_id
  WHERE source.parent_entity = 'Pitchfork'
    AND source.parent_stream = 'Track Reviews'
  ORDER BY source.publication_date DESC LIMIT 8;


//
// Step 1: Scrape source data without duplicates
//

  // Note: a new song may already have an existing source!
  //
  // Songs released today have an "hours ago" date format, so enter YYYY-MM-DD manually
  //
  // Also may need to remove page number from "chartLocation" if scrolling down a lot to catch up.


  // Add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  sourceDates = [];

  // get a list of source dates from songs
  elements = document.getElementsByClassName("artist-list");
  for (var i=0; i<elements.length; i++){

    publicationDate = document.getElementsByClassName("pub-date")[i].innerText.trim();
    publicationDateFormatted = moment(publicationDate, "MMMM DD YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

    sourceDates.push(publicationDateFormatted);
  };

  // remove duplicate dates
  sourceSet = new Set(sourceDates);
  sourceArray = Array.from(sourceSet)

  // build sources object from dates
  sources = [];
  for (var i=0; i<sourceArray.length; i++){

    publicationDate = sourceArray[i];
    chartLocation = window.location.href;

    source = String(
      "\n(\'Pitchfork\', "
      + "\'Track Reviews\', "
      + "NULL, "
      + "\'" + publicationDate + "\', "
      + "\'" + chartLocation + "\')"
    );

    sources.push(source);

  };

  console.log(String(sources));


  // Paste sources into the SQL statement, and prune out existing sources
  // If necessary, remove page numbers (ex: ?page=2) from location

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
  ('Pitchfork', 'Track Reviews', NULL, '2021-04-27 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-04-26 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-04-23 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-04-21 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-04-16 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-04-14 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-04-13 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-04-12 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-04-08 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-04-07 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/')
  ;

  // Update to source table


//
// Step 2: Scrape songs data w/ placeholder source
//

  songsData = [];
  elements = document.getElementsByClassName("artist-list");
  for (var i=0; i<elements.length; i++){

    title = elements[i].nextElementSibling.innerText.match(/“(.*?)”/)[1]; // everything inside the quotatino marks
    artist_name = elements[i].innerText;
    video_id = null;

    capture_date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

    // date placeholder for source_id
    publicationDate = document.getElementsByClassName("pub-date")[i].innerText.trim();
    publicationDateFormatted = moment(publicationDate, "MMMM DD YYYY").format(); // to ISO

    songData = {
      'title' : title,
      'artist_name' : artist_name,
      'video_id' : video_id,
      'capture_date' : capture_date,
      'source_id' : publicationDateFormatted, // placeholder
      'song_id' : null,
      'duplicate' : false
    };

    songsData.push(songData);

  };

  console.log(JSON.stringify(songsData, null, 4));


//
// Step 3:  Stage new songs only,
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "Cheers",
        "artist_name": "Faye Webster",
        "video_id": null,
        "capture_date": "2021-04-29 09:18:01.895895",
        "source_id": 894,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Find Home",
        "artist_name": "Green-House",
        "video_id": null,
        "capture_date": "2021-04-29 09:18:01.898898",
        "source_id": 895,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "MMMOOOAAAAAYAYA",
        "artist_name": "Illuminati Hotties",
        "video_id": null,
        "capture_date": "2021-04-29 09:18:01.898898",
        "source_id": 896,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Moscow",
        "artist_name": "03CAS",
        "video_id": null,
        "capture_date": "2021-04-29 09:18:01.898898",
        "source_id": 896,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Introvert",
        "artist_name": "Little Simz",
        "video_id": null,
        "capture_date": "2021-04-29 09:18:01.898898",
        "source_id": 897,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Little Deer",
        "artist_name": "SPELLLING",
        "video_id": null,
        "capture_date": "2021-04-29 09:18:01.898898",
        "source_id": 898,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Send Me",
        "artist_name": "Tirzah",
        "video_id": null,
        "capture_date": "2021-04-29 09:18:01.898898",
        "source_id": 899,
        "song_id": 10245,
        "duplicate": true
    },
    {
        "title": "Red Flag",
        "artist_name": "Suzanne Kraft",
        "video_id": null,
        "capture_date": "2021-04-29 09:18:01.899899",
        "source_id": 900,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sick Bitch",
        "artist_name": "LSDXOXO",
        "video_id": null,
        "capture_date": "2021-04-29 09:18:01.899899",
        "source_id": 901,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "formwela 3",
        "artist_name": "Esperanza Spalding",
        "video_id": null,
        "capture_date": "2021-04-29 09:18:01.899899",
        "source_id": 902,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "4U",
        "artist_name": "Pi’erre Bourne",
        "video_id": null,
        "capture_date": "2021-04-29 09:18:01.899899",
        "source_id": 903,
        "song_id": 10140,
        "duplicate": true
    }
]

  // To check for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%Up%'
    AND artist_name LIKE '%Cardi%'
  ;


//
// Step 4: add source_ids
//

  // get source_ids and dates for newly added sources
  // increase LIMIT number if necessary
  SELECT id, publication_date, parent_entity FROM source ORDER BY id DESC LIMIT 8;

  // manually add source_ids in songsData above (INT without quotation marks).

  // Update var songsData = the array above.


//
// Step 5: Update nonduplicates to the song table
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
  // check artist name formatting

  INSERT INTO song
    (title, artist_name, video_id)
  VALUES
    ('Cheers', 'Faye Webster', NULL),
    ('Find Home', 'Green-House', NULL),
    ('MMMOOOAAAAAYAYA', 'Illuminati Hotties', NULL),
    ('Moscow', '03CAS', NULL),
    ('Introvert', 'Little Simz', NULL),
    ('Little Deer', 'SPELLLING', NULL),
    ('Red Flag', 'Suzanne Kraft', NULL),
    ('Sick Bitch', 'LSDXOXO', NULL),
    ('formwela 3', 'Esperanza Spalding', NULL)
  ;

   // Update to song table


//
// Step 6: Add new song_ids and update all songs to the source_song table.
//

  // Get the last song_id inserted
  song_id = 10296; // SELECT last_insert_rowid();

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
  ('2021-04-29 09:18:01.895895', '894', '10288'),
  ('2021-04-29 09:18:01.898898', '895', '10289'),
  ('2021-04-29 09:18:01.898898', '896', '10290'),
  ('2021-04-29 09:18:01.898898', '896', '10291'),
  ('2021-04-29 09:18:01.898898', '897', '10292'),
  ('2021-04-29 09:18:01.898898', '898', '10293'),
  ('2021-04-29 09:18:01.898898', '899', '10245'),
  ('2021-04-29 09:18:01.899899', '900', '10294'),
  ('2021-04-29 09:18:01.899899', '901', '10295'),
  ('2021-04-29 09:18:01.899899', '902', '10296'),
  ('2021-04-29 09:18:01.899899', '903', '10140')
  ;

  // Update to source_song table
