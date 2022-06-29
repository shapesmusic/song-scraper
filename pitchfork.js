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
  // If necessary, remove page numbers from location
  // May need to manually fill in date for the most recent song

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
  ('Pitchfork', 'Track Reviews', NULL, '2022-06-24 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-06-21 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-06-17 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-06-15 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-06-13 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-06-10 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-06-09 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-06-07 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-06-06 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-06-02 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-05-31 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/')
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
        "title": "Carolina",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2022-06-29 09:30:14.492492",
        "source_id": 1273,
        "song_id": 12433,
        "duplicate": true
    },
    {
        "title": "Break My Soul",
        "artist_name": "Beyoncé",
        "video_id": null,
        "capture_date": "2022-06-29 09:30:14.497497",
        "source_id": 1274,
        "song_id": 12418,
        "duplicate": true
    },
    {
        "title": "Don’t Press Me",
        "artist_name": "Dry Cleaning",
        "video_id": null,
        "capture_date": "2022-06-29 09:30:14.497497",
        "source_id": 1275,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sticky",
        "artist_name": "Drake",
        "video_id": null,
        "capture_date": "2022-06-29 09:30:14.497497",
        "source_id": 1275,
        "song_id": 12415,
        "duplicate": true
    },
    {
        "title": "Betamax",
        "artist_name": "Elucid",
        "video_id": null,
        "capture_date": "2022-06-29 09:30:14.498498",
        "source_id": 1276,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "BDA Creature",
        "artist_name": "Altrice",
        "video_id": null,
        "capture_date": "2022-06-29 09:30:14.498498",
        "source_id": 1276,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Carmen Villain (Actress Remix)",
        "artist_name": "Carmen Villain",
        "video_id": null,
        "capture_date": "2022-06-29 09:30:14.499499",
        "source_id": 1277,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cash In Cash Out",
        "artist_name": "Pharrell Williams",
        "video_id": null,
        "capture_date": "2022-06-29 09:30:14.499499",
        "source_id": 1278,
        "song_id": 12379,
        "duplicate": true
    },
    {
        "title": "Olympus",
        "artist_name": "Blondshell",
        "video_id": null,
        "capture_date": "2022-06-29 09:30:14.499499",
        "source_id": 1279,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Come for Me",
        "artist_name": "Shygirl",
        "video_id": null,
        "capture_date": "2022-06-29 09:30:14.499499",
        "source_id": 1280,
        "song_id": 12387,
        "duplicate": true
    },
    {
        "title": "Teeth Marks",
        "artist_name": "S.G. Goodman",
        "video_id": null,
        "capture_date": "2022-06-29 09:30:14.499499",
        "source_id": 1281,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Spitting Off the Edge of the World",
        "artist_name": "Yeah Yeah Yeahs",
        "video_id": null,
        "capture_date": "2022-06-29 09:30:14.499499",
        "source_id": 1282,
        "song_id": 12345,
        "duplicate": true
    },
    {
        "title": "Weather Alive",
        "artist_name": "Beth Orton",
        "video_id": null,
        "capture_date": "2022-06-29 09:30:14.499499",
        "source_id": 1283,
        "song_id": 12353,
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
  ('Don’t Press Me', 'Dry Cleaning', NULL),
  ('Betamax', 'Elucid', NULL),
  ('BDA Creature', 'Altrice', NULL),
  ('Carmen Villain (Actress Remix)', 'Carmen Villain', NULL),
  ('Olympus', 'Blondshell', NULL),
  ('Teeth Marks', 'S.G. Goodman', NULL)
  ;

   // Update to song table


//
// Step 6: Add new song_ids and update all songs to the source_song table.
//

  // Get the last song_id inserted
  song_id = 12448; // SELECT last_insert_rowid();

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
  ('2022-06-29 09:30:14.492492', '1273', '12433'),
  ('2022-06-29 09:30:14.497497', '1274', '12418'),
  ('2022-06-29 09:30:14.497497', '1275', '12443'),
  ('2022-06-29 09:30:14.497497', '1275', '12415'),
  ('2022-06-29 09:30:14.498498', '1276', '12444'),
  ('2022-06-29 09:30:14.498498', '1276', '12445'),
  ('2022-06-29 09:30:14.499499', '1277', '12446'),
  ('2022-06-29 09:30:14.499499', '1278', '12379'),
  ('2022-06-29 09:30:14.499499', '1279', '12447'),
  ('2022-06-29 09:30:14.499499', '1280', '12387'),
  ('2022-06-29 09:30:14.499499', '1281', '12448'),
  ('2022-06-29 09:30:14.499499', '1282', '12345'),
  ('2022-06-29 09:30:14.499499', '1283', '12353')
  ;

  // Update to source_song table
