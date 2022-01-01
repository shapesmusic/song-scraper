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
  ('Pitchfork', 'Track Reviews', NULL, '2021-12-17 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-12-08 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-11-19 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-11-18 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-11-17 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-11-12 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-11-11 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-11-10 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-11-09 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-11-04 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-11-03 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-10-29 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-10-28 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-10-26 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-10-21 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-10-15 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-10-14 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-10-13 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/')
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
      "title": "Faultline",
      "artist_name": "Girlpool",
      "video_id": null,
      "capture_date": "2022-01-01 03:37:21.630630",
      "source_id": 1069,
      "song_id": 11328,
      "duplicate": true
  },
  {
      "title": "Gestures",
      "artist_name": "Carmen Villain",
      "video_id": null,
      "capture_date": "2022-01-01 03:37:21.632632",
      "source_id": 1070,
      "song_id": 11329,
      "duplicate": true
  },
  {
      "title": "2010",
      "artist_name": "Earl Sweatshirt",
      "video_id": null,
      "capture_date": "2022-01-01 03:37:21.633633",
      "source_id": 1071,
      "song_id": 11297,
      "duplicate": true
  },
  {
      "title": "To Be Loved",
      "artist_name": "Adele",
      "video_id": null,
      "capture_date": "2022-01-01 03:37:21.633633",
      "source_id": 1071,
      "song_id": 11229,
      "duplicate": true
  },
  {
      "title": "search party",
      "artist_name": "dltzk",
      "video_id": null,
      "capture_date": "2022-01-01 03:37:21.633633",
      "source_id": 1072,
      "song_id": null,
      "duplicate": false
  },
  {
      "title": "Two Ribbons",
      "artist_name": "Let’s Eat Grandma",
      "video_id": null,
      "capture_date": "2022-01-01 03:37:21.633633",
      "source_id": 1073,
      "song_id": 11296,
      "duplicate": true
  },
  {
      "title": "All Too Well (10 Minute Version) (Taylor’s Version)",
      "artist_name": "Taylor Swift",
      "video_id": null,
      "capture_date": "2022-01-01 03:37:21.633633",
      "source_id": 1074,
      "song_id": 11191,
      "duplicate": true
  },
  {
      "title": "La Fama",
      "artist_name": "Rosalía",
      "video_id": null,
      "capture_date": "2022-01-01 03:37:21.633633",
      "source_id": 1075,
      "song_id": 11224,
      "duplicate": true
  },
  {
      "title": "Jupiter",
      "artist_name": "Jenny Hval",
      "video_id": null,
      "capture_date": "2022-01-01 03:37:21.633633",
      "source_id": 1075,
      "song_id": null,
      "duplicate": false
  },
  {
      "title": "Once Twice Melody",
      "artist_name": "Beach House",
      "video_id": null,
      "capture_date": "2022-01-01 03:37:21.634634",
      "source_id": 1076,
      "song_id": null,
      "duplicate": false
  },
  {
      "title": "The Only Heartbreaker",
      "artist_name": "Mitski",
      "video_id": null,
      "capture_date": "2022-01-01 03:37:21.634634",
      "source_id": 1077,
      "song_id": 11293,
      "duplicate": true
  },
  {
      "title": "New Shapes",
      "artist_name": "Charli XCX",
      "video_id": null,
      "capture_date": "2022-01-01 03:37:21.634634",
      "source_id": 1078,
      "song_id": 11278,
      "duplicate": true
  },
  {
      "title": "29",
      "artist_name": "YaejiOh Hyuk",
      "video_id": null,
      "capture_date": "2022-01-01 03:37:21.634634",
      "source_id": 1079,
      "song_id": null,
      "duplicate": false
  },
  {
      "title": "Gucci Tried to Tell Me",
      "artist_name": "Mick Jenkins",
      "video_id": null,
      "capture_date": "2022-01-01 03:37:21.634634",
      "source_id": 1080,
      "song_id": null,
      "duplicate": false
  },
  {
      "title": "Cleo",
      "artist_name": "Shygirl",
      "video_id": null,
      "capture_date": "2022-01-01 03:37:21.634634",
      "source_id": 1081,
      "song_id": null,
      "duplicate": false
  },
  {
      "title": "Message in a Hammer",
      "artist_name": "Obongjayar",
      "video_id": null,
      "capture_date": "2022-01-01 03:37:21.634634",
      "source_id": 1082,
      "song_id": null,
      "duplicate": false
  },
  {
      "title": "Embryo",
      "artist_name": "Jlin",
      "video_id": null,
      "capture_date": "2022-01-01 03:37:21.634634",
      "source_id": 1083,
      "song_id": 11153,
      "duplicate": false
  },
  {
      "title": "Ben Franklin",
      "artist_name": "Snail Mail",
      "video_id": null,
      "capture_date": "2022-01-01 03:37:21.634634",
      "source_id": 1083,
      "song_id": 11150,
      "duplicate": true
  },
  {
      "title": "Easy on Me",
      "artist_name": "Adele",
      "video_id": null,
      "capture_date": "2022-01-01 03:37:21.634634",
      "source_id": 1084,
      "song_id": 11115,
      "duplicate": true
  },
  {
      "title": "Running Away",
      "artist_name": "Cate Le Bon",
      "video_id": null,
      "capture_date": "2022-01-01 03:37:21.634634",
      "source_id": 1085,
      "song_id": null,
      "duplicate": false
  },
  {
      "title": "Piano Love",
      "artist_name": "Conway the Machine",
      "video_id": null,
      "capture_date": "2022-01-01 03:37:21.634634",
      "source_id": 1086,
      "song_id": 11109,
      "duplicate": true
  },
  {
      "title": "Working for the Knife",
      "artist_name": "Mitski",
      "video_id": null,
      "capture_date": "2022-01-01 03:37:21.635635",
      "source_id": 978,
      "song_id": 10988,
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
  ('search party', 'dltzk', NULL),
  ('Jupiter', 'Jenny Hval', NULL),
  ('Once Twice Melody', 'Beach House', NULL),
  ('29', 'YaejiOh Hyuk', NULL),
  ('Gucci Tried to Tell Me', 'Mick Jenkins', NULL),
  ('Cleo', 'Shygirl', NULL),
  ('Message in a Hammer', 'Obongjayar', NULL),
  ('Embryo', 'Jlin', NULL),
  ('Running Away', 'Cate Le Bon', NULL)
  ;

   // Update to song table


//
// Step 6: Add new song_ids and update all songs to the source_song table.
//

  // Get the last song_id inserted
  song_id = 11345; // SELECT last_insert_rowid();

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
  ('2022-01-01 03:37:21.630630', '1069', '11328'),
  ('2022-01-01 03:37:21.632632', '1070', '11329'),
  ('2022-01-01 03:37:21.633633', '1071', '11297'),
  ('2022-01-01 03:37:21.633633', '1071', '11229'),
  ('2022-01-01 03:37:21.633633', '1072', '11337'),
  ('2022-01-01 03:37:21.633633', '1073', '11296'),
  ('2022-01-01 03:37:21.633633', '1074', '11191'),
  ('2022-01-01 03:37:21.633633', '1075', '11224'),
  ('2022-01-01 03:37:21.633633', '1075', '11338'),
  ('2022-01-01 03:37:21.634634', '1076', '11339'),
  ('2022-01-01 03:37:21.634634', '1077', '11293'),
  ('2022-01-01 03:37:21.634634', '1078', '11278'),
  ('2022-01-01 03:37:21.634634', '1079', '11340'),
  ('2022-01-01 03:37:21.634634', '1080', '11341'),
  ('2022-01-01 03:37:21.634634', '1081', '11342'),
  ('2022-01-01 03:37:21.634634', '1082', '11343'),
  ('2022-01-01 03:37:21.634634', '1083', '11344'),
  ('2022-01-01 03:37:21.634634', '1083', '11150'),
  ('2022-01-01 03:37:21.634634', '1084', '11115'),
  ('2022-01-01 03:37:21.634634', '1085', '11345'),
  ('2022-01-01 03:37:21.634634', '1086', '11109'),
  ('2022-01-01 03:37:21.635635', '978', '10988')
  ;

  // Update to source_song table
