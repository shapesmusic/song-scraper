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
  // May need to manually fill in date for the most recent song

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
  ('Pitchfork', 'Track Reviews', NULL, '2022-05-27 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-05-26 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-05-25 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-05-24 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-05-23 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-05-20 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-05-19 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-05-18 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-05-17 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-05-13 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-05-11 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-05-10 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-05-09 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-05-06 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-05-05 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-05-04 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-04-29 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-04-28 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-04-22 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-04-19 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-04-18 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-04-12 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-04-07 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-04-06 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-04-01 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-03-30 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-03-23 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-03-18 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-03-17 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-03-14 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-03-09 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-03-04 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-03-03 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-03-02 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-03-01 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-02-25 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/')
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
        "title": "Potion",
        "artist_name": "Calvin Harris & Dua Lipa & Young Thug",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.392392",
        "source_id": 1218,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Don’t Forget",
        "artist_name": "Sky Ferreira",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.398398",
        "source_id": 1219,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Slaughterhouse",
        "artist_name": "Chat Pile",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.399399",
        "source_id": 1220,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Wicked",
        "artist_name": "VNTAGEPARADISE",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.404404",
        "source_id": 1221,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cherry",
        "artist_name": "Daphni",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.405405",
        "source_id": 1222,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bones",
        "artist_name": "Soccer Mommy",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.405405",
        "source_id": 1223,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Angel of Business",
        "artist_name": "Grace Ives",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.405405",
        "source_id": 1224,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "This Hell",
        "artist_name": "Rina Sawayama",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.406406",
        "source_id": 1225,
        "song_id": 12246,
        "duplicate": true
    },
    {
        "title": "UW4GM",
        "artist_name": "Joviale",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.409409",
        "source_id": 1226,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Lungs",
        "artist_name": "Stella Donnelly",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.410410",
        "source_id": 1226,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mother I Sober",
        "artist_name": "Kendrick Lamar",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.411411",
        "source_id": 1227,
        "song_id": 12245,
        "duplicate": true
    },
    {
        "title": "Lydia Wears a Cross",
        "artist_name": "Julia Jacklin",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.412412",
        "source_id": 1228,
        "song_id": 12204,
        "duplicate": true
    },
    {
        "title": "How Far",
        "artist_name": "Astrid Sonne",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.413413",
        "source_id": 1229,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Heart Part 5",
        "artist_name": "Kendrick Lamar",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.413413",
        "source_id": 1230,
        "song_id": 12176,
        "duplicate": true
    },
    {
        "title": "Western Wind",
        "artist_name": "Carly Rae Jepsen",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.413413",
        "source_id": 1231,
        "song_id": 12143,
        "duplicate": true
    },
    {
        "title": "Ribs",
        "artist_name": "Tirzah",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.413413",
        "source_id": 1232,
        "song_id": 12150,
        "duplicate": true
    },
    {
        "title": "Tastes Just Like It Costs",
        "artist_name": "MJ Lenderman",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.413413",
        "source_id": 1233,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Decimation (Dis Nation)",
        "artist_name": "Dälek",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.413413",
        "source_id": 1234,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Big Time",
        "artist_name": "Angel Olsen",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.413413",
        "source_id": 1235,
        "song_id": 12124,
        "duplicate": true
    },
    {
        "title": "Surprise Me",
        "artist_name": "Mallrat",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.413413",
        "source_id": 1236,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Layla",
        "artist_name": "Mdou Moctar",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.414414",
        "source_id": 1237,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Question",
        "artist_name": "Dirty Bird",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.414414",
        "source_id": 1238,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Doritos & Fritos",
        "artist_name": "100 gecs",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.414414",
        "source_id": 1239,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Spur",
        "artist_name": "Joan Shelley",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.414414",
        "source_id": 1240,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "World of Pots and Pans",
        "artist_name": "Horsegirl",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.414414",
        "source_id": 1241,
        "song_id": 12010,
        "duplicate": true
    },
    {
        "title": "As It Was",
        "artist_name": "Harry Styles",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.414414",
        "source_id": 1242,
        "song_id": 11940,
        "duplicate": true
    },
    {
        "title": "Breathe You",
        "artist_name": "My Idea",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.414414",
        "source_id": 1243,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Shotgun",
        "artist_name": "Soccer Mommy",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.414414",
        "source_id": 1244,
        "song_id": 11899,
        "duplicate": true
    },
    {
        "title": "Fair",
        "artist_name": "Normani",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.414414",
        "source_id": 1245,
        "song_id": 11863,
        "duplicate": true
    },
    {
        "title": "Home Maker",
        "artist_name": "Sudan Archives",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.414414",
        "source_id": 1246,
        "song_id": 11887,
        "duplicate": true
    },
    {
        "title": "The Lightning I, II",
        "artist_name": "Arcade Fire",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.414414",
        "source_id": 1246,
        "song_id": 11861,
        "duplicate": true
    },
    {
        "title": "Pressure Cooker",
        "artist_name": "Dazy & Militarie Gun",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.414414",
        "source_id": 1247,
        "song_id": 11889,
        "duplicate": true
    },
    {
        "title": "June",
        "artist_name": "Destroyer",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.414414",
        "source_id": 1248,
        "song_id": 11844,
        "duplicate": true
    },
    {
        "title": "Vocoder",
        "artist_name": "Floating Points",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.414414",
        "source_id": 1248,
        "song_id": 11819,
        "duplicate": true
    },
    {
        "title": "It Hit Me",
        "artist_name": "Charlotte AdigéryBolis Pupul",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.414414",
        "source_id": 1249,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hi-De-Ho",
        "artist_name": "Jack White",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.414414",
        "source_id": 1250,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "It’s Random",
        "artist_name": "Dora Jar",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.414414",
        "source_id": 1251,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Snåcko",
        "artist_name": "Jeremiah ChiuMarta Sofia Honer",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.414414",
        "source_id": 1252,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Everybody Love",
        "artist_name": "Robert Glasper",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.414414",
        "source_id": 1252,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sorry Not Sorry",
        "artist_name": "Omerettà the Great",
        "video_id": null,
        "capture_date": "2022-05-30 08:12:32.414414",
        "source_id": 1253,
        "song_id": null,
        "duplicate": false
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
  SELECT id, publication_date, parent_entity FROM source ORDER BY id DESC LIMIT 20;

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
  // If ’ replaced, check again for duplicate
  // check artist name formatting

  INSERT INTO song
    (title, artist_name, video_id)
  VALUES
  ('Potion', 'Calvin Harris & Dua Lipa & Young Thug', NULL),
  ('Don’t Forget', 'Sky Ferreira', NULL),
  ('Slaughterhouse', 'Chat Pile', NULL),
  ('Wicked', 'VNTAGEPARADISE', NULL),
  ('Cherry', 'Daphni', NULL),
  ('Bones', 'Soccer Mommy', NULL),
  ('Angel of Business', 'Grace Ives', NULL),
  ('UW4GM', 'Joviale', NULL),
  ('Lungs', 'Stella Donnelly', NULL),
  ('How Far', 'Astrid Sonne', NULL),
  ('Tastes Just Like It Costs', 'MJ Lenderman', NULL),
  ('Decimation (Dis Nation)', 'Dälek', NULL),
  ('Surprise Me', 'Mallrat', NULL),
  ('Layla', 'Mdou Moctar', NULL),
  ('The Question', 'Dirty Bird', NULL),
  ('Doritos & Fritos', '100 gecs', NULL),
  ('The Spur', 'Joan Shelley', NULL),
  ('Breathe You', 'My Idea', NULL),
  ('It Hit Me', 'Charlotte AdigéryBolis Pupul', NULL),
  ('Hi-De-Ho', 'Jack White', NULL),
  ('It’s Random', 'Dora Jar', NULL),
  ('Snåcko', 'Jeremiah ChiuMarta Sofia Honer', NULL),
  ('Everybody Love', 'Robert Glasper', NULL),
  ('Sorry Not Sorry', 'Omerettà the Great', NULL)
  ;

   // Update to song table


//
// Step 6: Add new song_ids and update all songs to the source_song table.
//

  // Get the last song_id inserted
  song_id = 12303; // SELECT last_insert_rowid();

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
  ('2022-05-30 08:12:32.392392', '1218', '12280'),
  ('2022-05-30 08:12:32.398398', '1219', '12281'),
  ('2022-05-30 08:12:32.399399', '1220', '12282'),
  ('2022-05-30 08:12:32.404404', '1221', '12283'),
  ('2022-05-30 08:12:32.405405', '1222', '12284'),
  ('2022-05-30 08:12:32.405405', '1223', '12285'),
  ('2022-05-30 08:12:32.405405', '1224', '12286'),
  ('2022-05-30 08:12:32.406406', '1225', '12246'),
  ('2022-05-30 08:12:32.409409', '1226', '12287'),
  ('2022-05-30 08:12:32.410410', '1226', '12288'),
  ('2022-05-30 08:12:32.411411', '1227', '12245'),
  ('2022-05-30 08:12:32.412412', '1228', '12204'),
  ('2022-05-30 08:12:32.413413', '1229', '12289'),
  ('2022-05-30 08:12:32.413413', '1230', '12176'),
  ('2022-05-30 08:12:32.413413', '1231', '12143'),
  ('2022-05-30 08:12:32.413413', '1232', '12150'),
  ('2022-05-30 08:12:32.413413', '1233', '12290'),
  ('2022-05-30 08:12:32.413413', '1234', '12291'),
  ('2022-05-30 08:12:32.413413', '1235', '12124'),
  ('2022-05-30 08:12:32.413413', '1236', '12292'),
  ('2022-05-30 08:12:32.414414', '1237', '12293'),
  ('2022-05-30 08:12:32.414414', '1238', '12294'),
  ('2022-05-30 08:12:32.414414', '1239', '12295'),
  ('2022-05-30 08:12:32.414414', '1240', '12296'),
  ('2022-05-30 08:12:32.414414', '1241', '12010'),
  ('2022-05-30 08:12:32.414414', '1242', '11940'),
  ('2022-05-30 08:12:32.414414', '1243', '12297'),
  ('2022-05-30 08:12:32.414414', '1244', '11899'),
  ('2022-05-30 08:12:32.414414', '1245', '11863'),
  ('2022-05-30 08:12:32.414414', '1246', '11887'),
  ('2022-05-30 08:12:32.414414', '1246', '11861'),
  ('2022-05-30 08:12:32.414414', '1247', '11889'),
  ('2022-05-30 08:12:32.414414', '1248', '11844'),
  ('2022-05-30 08:12:32.414414', '1248', '11819'),
  ('2022-05-30 08:12:32.414414', '1249', '12298'),
  ('2022-05-30 08:12:32.414414', '1250', '12299'),
  ('2022-05-30 08:12:32.414414', '1251', '12300'),
  ('2022-05-30 08:12:32.414414', '1252', '12301'),
  ('2022-05-30 08:12:32.414414', '1252', '12302'),
  ('2022-05-30 08:12:32.414414', '1253', '12303')
  ;

  // Update to source_song table
