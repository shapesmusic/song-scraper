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
  ('Pitchfork', 'Track Reviews', NULL, '2022-02-22 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-02-17 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-02-16 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-02-15 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-02-11 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-02-10 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-02-08 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-02-04 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-02-03 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-02-02 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-02-01 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-01-31 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-01-28 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/')
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
        "title": "Back to the Radio",
        "artist_name": "Porridge Radio",
        "video_id": null,
        "capture_date": "2022-02-22 08:44:25.087087",
        "source_id": 1140,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Punish",
        "artist_name": "4s4ki",
        "video_id": null,
        "capture_date": "2022-02-22 08:44:25.089089",
        "source_id": 1141,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Like Exploding Stones",
        "artist_name": "Kurt Vile",
        "video_id": null,
        "capture_date": "2022-02-22 08:44:25.090090",
        "source_id": 1142,
        "song_id": 11722,
        "duplicate": true
    },
    {
        "title": "Black Be the Source",
        "artist_name": "Fly Anakin",
        "video_id": null,
        "capture_date": "2022-02-22 08:44:25.090090",
        "source_id": 1143,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Finger Pies (Maral At The Controls Dub Mix)",
        "artist_name": "Anika",
        "video_id": null,
        "capture_date": "2022-02-22 08:44:25.090090",
        "source_id": 1144,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Billions",
        "artist_name": "Caroline Polachek",
        "video_id": null,
        "capture_date": "2022-02-22 08:44:25.090090",
        "source_id": 1145,
        "song_id": 11671,
        "duplicate": true
    },
    {
        "title": "Porta",
        "artist_name": "Sharon Van Etten",
        "video_id": null,
        "capture_date": "2022-02-22 08:44:25.090090",
        "source_id": 1146,
        "song_id": 11699,
        "duplicate": true
    },
    {
        "title": "Bites on My Neck",
        "artist_name": "yeule",
        "video_id": null,
        "capture_date": "2022-02-22 08:44:25.090090",
        "source_id": 1147,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Luv Like",
        "artist_name": "Nia Archives",
        "video_id": null,
        "capture_date": "2022-02-22 08:44:25.090090",
        "source_id": 1147,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Manatee (A Story of This World Pt. III)",
        "artist_name": "Circuit des Yeux",
        "video_id": null,
        "capture_date": "2022-02-22 08:44:25.091091",
        "source_id": 1148,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Don’t Forget You’re Precious",
        "artist_name": "Alabaster dePlume",
        "video_id": null,
        "capture_date": "2022-02-22 08:44:25.091091",
        "source_id": 1149,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cities on Fire",
        "artist_name": "Shitbots",
        "video_id": null,
        "capture_date": "2022-02-22 08:44:25.091091",
        "source_id": 1150,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Madeso",
        "artist_name": "DJ Nigga Fox",
        "video_id": null,
        "capture_date": "2022-02-22 08:44:25.091091",
        "source_id": 1151,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Slow Crash",
        "artist_name": "Tony Shhnow",
        "video_id": null,
        "capture_date": "2022-02-22 08:44:25.091091",
        "source_id": 1152,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Falnukmel",
        "artist_name": "Julmud",
        "video_id": null,
        "capture_date": "2022-02-22 08:44:25.091091",
        "source_id": 1152,
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
  // check artist name formatting

  INSERT INTO song
    (title, artist_name, video_id)
  VALUES
  ('Back to the Radio', 'Porridge Radio', NULL),
  ('Punish', '4s4ki', NULL),
  ('Black Be the Source', 'Fly Anakin', NULL),
  ('Finger Pies (Maral At The Controls Dub Mix)', 'Anika', NULL),
  ('Bites on My Neck', 'yeule', NULL),
  ('Luv Like', 'Nia Archives', NULL),
  ('The Manatee (A Story of This World Pt. III)', 'Circuit des Yeux', NULL),
  ('Don’t Forget You’re Precious', 'Alabaster dePlume', NULL),
  ('Cities on Fire', 'Shitbots', NULL),
  ('Madeso', 'DJ Nigga Fox', NULL),
  ('Slow Crash', 'Tony Shhnow', NULL),
  ('Falnukmel', 'Julmud', NULL)
  ;

   // Update to song table


//
// Step 6: Add new song_ids and update all songs to the source_song table.
//

  // Get the last song_id inserted
  song_id = 11735; // SELECT last_insert_rowid();

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
  ('2022-02-22 08:44:25.087087', '1140', '11724'),
  ('2022-02-22 08:44:25.089089', '1141', '11725'),
  ('2022-02-22 08:44:25.090090', '1142', '11722'),
  ('2022-02-22 08:44:25.090090', '1143', '11726'),
  ('2022-02-22 08:44:25.090090', '1144', '11727'),
  ('2022-02-22 08:44:25.090090', '1145', '11671'),
  ('2022-02-22 08:44:25.090090', '1146', '11699'),
  ('2022-02-22 08:44:25.090090', '1147', '11728'),
  ('2022-02-22 08:44:25.090090', '1147', '11729'),
  ('2022-02-22 08:44:25.091091', '1148', '11730'),
  ('2022-02-22 08:44:25.091091', '1149', '11731'),
  ('2022-02-22 08:44:25.091091', '1150', '11732'),
  ('2022-02-22 08:44:25.091091', '1151', '11733'),
  ('2022-02-22 08:44:25.091091', '1152', '11734'),
  ('2022-02-22 08:44:25.091091', '1152', '11735')
  ;

  // Update to source_song table
