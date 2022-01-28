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
  // If necessary, remove page numbers (ex: ) from location

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
  ('Pitchfork', 'Track Reviews', NULL, '2022-01-26 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-01-25 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-01-21 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-01-20 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-01-19 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-01-18 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-01-14 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-01-13 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-01-12 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-01-11 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-01-07 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-01-05 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/')
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
        "title": "Equator Song",
        "artist_name": "Nyokabi Kariũki",
        "video_id": null,
        "capture_date": "2022-01-27 10:12:09.535535",
        "source_id": 1107,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "home",
        "artist_name": "Two Shell",
        "video_id": null,
        "capture_date": "2022-01-27 10:12:09.537537",
        "source_id": 1107,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "GRAVE YARD",
        "artist_name": "Jon E Cash",
        "video_id": null,
        "capture_date": "2022-01-27 10:12:09.537537",
        "source_id": 1108,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sincerely Face",
        "artist_name": "Babyface Ray",
        "video_id": null,
        "capture_date": "2022-01-27 10:12:09.537537",
        "source_id": 1108,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Estación Esperanza",
        "artist_name": "Sofia Kourtesis",
        "video_id": null,
        "capture_date": "2022-01-27 10:12:09.537537",
        "source_id": 1109,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Simulation Swarm",
        "artist_name": "Big Thief",
        "video_id": null,
        "capture_date": "2022-01-27 10:12:09.537537",
        "source_id": 1110,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Midnight Sun",
        "artist_name": "Nilüfer Yanya",
        "video_id": null,
        "capture_date": "2022-01-27 10:12:09.538538",
        "source_id": 1110,
        "song_id": 11554,
        "duplicate": true
    },
    {
        "title": "Good morning (red)",
        "artist_name": "caroline",
        "video_id": null,
        "capture_date": "2022-01-27 10:12:09.538538",
        "source_id": 1111,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Rush",
        "artist_name": "Raveena",
        "video_id": null,
        "capture_date": "2022-01-27 10:12:09.538538",
        "source_id": 1112,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Come My Way",
        "artist_name": "Saba",
        "video_id": null,
        "capture_date": "2022-01-27 10:12:09.538538",
        "source_id": 1113,
        "song_id": 11531,
        "duplicate": true
    },
    {
        "title": "Jump!! (Or Get Jumped!!!)((By the Future))",
        "artist_name": "Soul Glo",
        "video_id": null,
        "capture_date": "2022-01-27 10:12:09.538538",
        "source_id": 1113,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Accelerometer Overdose",
        "artist_name": "Binker and Moses",
        "video_id": null,
        "capture_date": "2022-01-27 10:12:09.538538",
        "source_id": 1114,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Lawn",
        "artist_name": "Aldous Harding",
        "video_id": null,
        "capture_date": "2022-01-27 10:12:09.538538",
        "source_id": 1115,
        "song_id": 11517,
        "duplicate": true
    },
    {
        "title": "Tintoretto, It’s for You",
        "artist_name": "Destroyer",
        "video_id": null,
        "capture_date": "2022-01-27 10:12:09.538538",
        "source_id": 1116,
        "song_id": 11477,
        "duplicate": true
    },
    {
        "title": "Say It",
        "artist_name": "SASAMI",
        "video_id": null,
        "capture_date": "2022-01-27 10:12:09.538538",
        "source_id": 1117,
        "song_id": 11478,
        "duplicate": true
    },
    {
        "title": "Funny Girl",
        "artist_name": "Father John Misty",
        "video_id": null,
        "capture_date": "2022-01-27 10:12:09.538538",
        "source_id": 1118,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "You Will Never Work in Television Again",
        "artist_name": "The Smile",
        "video_id": null,
        "capture_date": "2022-01-27 10:12:09.539539",
        "source_id": 1118,
        "song_id": 11453,
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
  SELECT id, publication_date, parent_entity FROM source ORDER BY id DESC LIMIT 10;

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
  ('Equator Song', 'Nyokabi Kariũki', NULL),
  ('home', 'Two Shell', NULL),
  ('GRAVE YARD', 'Jon E Cash', NULL),
  ('Sincerely Face', 'Babyface Ray', NULL),
  ('Estación Esperanza', 'Sofia Kourtesis', NULL),
  ('Simulation Swarm', 'Big Thief', NULL),
  ('Good morning (red)', 'caroline', NULL),
  ('Rush', 'Raveena', NULL),
  ('Jump!! (Or Get Jumped!!!)((By the Future))', 'Soul Glo', NULL),
  ('Accelerometer Overdose', 'Binker and Moses', NULL),
  ('Funny Girl', 'Father John Misty', NULL)
  ;

   // Update to song table


//
// Step 6: Add new song_ids and update all songs to the source_song table.
//

  // Get the last song_id inserted
  song_id = 11573; // SELECT last_insert_rowid();

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
  ('2022-01-27 10:12:09.535535', '1107', '11563'),
  ('2022-01-27 10:12:09.537537', '1107', '11564'),
  ('2022-01-27 10:12:09.537537', '1108', '11565'),
  ('2022-01-27 10:12:09.537537', '1108', '11566'),
  ('2022-01-27 10:12:09.537537', '1109', '11567'),
  ('2022-01-27 10:12:09.537537', '1110', '11568'),
  ('2022-01-27 10:12:09.538538', '1110', '11554'),
  ('2022-01-27 10:12:09.538538', '1111', '11569'),
  ('2022-01-27 10:12:09.538538', '1112', '11570'),
  ('2022-01-27 10:12:09.538538', '1113', '11531'),
  ('2022-01-27 10:12:09.538538', '1113', '11571'),
  ('2022-01-27 10:12:09.538538', '1114', '11572'),
  ('2022-01-27 10:12:09.538538', '1115', '11517'),
  ('2022-01-27 10:12:09.538538', '1116', '11477'),
  ('2022-01-27 10:12:09.538538', '1117', '11478'),
  ('2022-01-27 10:12:09.538538', '1118', '11573'),
  ('2022-01-27 10:12:09.539539', '1118', '11453')
  ;

  // Update to source_song table
