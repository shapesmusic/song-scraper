// FIXME: regex [ft. artists are in brackets] and IN SONG NAME, not ARTIST

//
// Step 0: Check recent scraped
//

  SELECT source.id, source.publication_date, song.title
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
  ('Pitchfork', 'Track Reviews', NULL, '2022-10-24 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-10-21 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-10-20 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-10-19 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-10-18 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-10-17 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-10-14 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-10-13 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-10-12 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-10-11 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-10-10 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-10-07 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-10-06 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-10-05 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/')
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

  // the top song is the most recent song
  songsData =
  [
    {
        "title": "dj",
        "artist_name": "Jim Legxacy",
        "video_id": null,
        "capture_date": "2022-10-25 08:48:10.947947",
        "source_id": 1409,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Changes",
        "artist_name": "Jeremih",
        "video_id": null,
        "capture_date": "2022-10-25 08:48:10.949949",
        "source_id": 1409,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Anti-Hero",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2022-10-25 08:48:10.949949",
        "source_id": 1410,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Body Bag",
        "artist_name": "Monaleo",
        "video_id": null,
        "capture_date": "2022-10-25 08:48:10.950950",
        "source_id": 1411,
        "song_id": 13052,
        "duplicate": true
    },
    {
        "title": "Monotonía",
        "artist_name": "ShakiraOzuna",
        "video_id": null,
        "capture_date": "2022-10-25 08:48:10.950950",
        "source_id": 1411,
        "song_id": 13040,
        "duplicate": true
    },
    {
        "title": "Where I Go",
        "artist_name": "NxWorriesKnxwledgeAnderson .PaakH.E.R.",
        "video_id": null,
        "capture_date": "2022-10-25 08:48:10.951951",
        "source_id": 1412,
        "song_id": 13042,
        "duplicate": true
    },
    {
        "title": "Happy Ending",
        "artist_name": "Kelela",
        "video_id": null,
        "capture_date": "2022-10-25 08:48:10.951951",
        "source_id": 1412,
        "song_id": 13043,
        "duplicate": true
    },
    {
        "title": "No Decent Shoes for Rain",
        "artist_name": "Dry Cleaning",
        "video_id": null,
        "capture_date": "2022-10-25 08:48:10.951951",
        "source_id": 1413,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sunset",
        "artist_name": "Caroline Polachek",
        "video_id": null,
        "capture_date": "2022-10-25 08:48:10.951951",
        "source_id": 1414,
        "song_id": 13041,
        "duplicate": true
    },
    {
        "title": "Shimmer",
        "artist_name": "Shanti Celeste",
        "video_id": null,
        "capture_date": "2022-10-25 08:48:10.951951",
        "source_id": 1415,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "nuthin i can do is wrng",
        "artist_name": "MIKE",
        "video_id": null,
        "capture_date": "2022-10-25 08:48:10.951951",
        "source_id": 1416,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Don’t Give Up",
        "artist_name": "Black Belt Eagle Scout",
        "video_id": null,
        "capture_date": "2022-10-25 08:48:10.951951",
        "source_id": 1416,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Idol; Re-Run",
        "artist_name": "Westerman",
        "video_id": null,
        "capture_date": "2022-10-25 08:48:10.951951",
        "source_id": 1417,
        "song_id": 13018,
        "duplicate": true
    },
    {
        "title": "Hurricane",
        "artist_name": "Plains",
        "video_id": null,
        "capture_date": "2022-10-25 08:48:10.953953",
        "source_id": 1417,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cry Alone",
        "artist_name": "Abi Ooze",
        "video_id": null,
        "capture_date": "2022-10-25 08:48:10.953953",
        "source_id": 1418,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Poland",
        "artist_name": "Lil Yachty",
        "video_id": null,
        "capture_date": "2022-10-25 08:48:10.953953",
        "source_id": 1418,
        "song_id": 12964,
        "duplicate": true
    },
    {
        "title": "In My Bag",
        "artist_name": "Lay Bankz",
        "video_id": null,
        "capture_date": "2022-10-25 08:48:10.953953",
        "source_id": 1418,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bulerías de un Caballo Malo",
        "artist_name": "Ralphie Choo",
        "video_id": null,
        "capture_date": "2022-10-25 08:48:10.953953",
        "source_id": 1419,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sodadi",
        "artist_name": "Chelsea Dinorath",
        "video_id": null,
        "capture_date": "2022-10-25 08:48:10.953953",
        "source_id": 1420,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Air Guitar",
        "artist_name": "Sobs",
        "video_id": null,
        "capture_date": "2022-10-25 08:48:10.953953",
        "source_id": 1420,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Shabooya",
        "artist_name": "HitkiddGloss UpK Carbon",
        "video_id": null,
        "capture_date": "2022-10-25 08:48:10.953953",
        "source_id": 1421,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Genius",
        "artist_name": "Queen G",
        "video_id": null,
        "capture_date": "2022-10-25 08:48:10.953953",
        "source_id": 1421,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "What They Call Us",
        "artist_name": "Fever Ray",
        "video_id": null,
        "capture_date": "2022-10-25 08:48:10.953953",
        "source_id": 1422,
        "song_id": 12978,
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
  SELECT id, publication_date, parent_entity FROM source ORDER BY id DESC LIMIT 15;

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
  ('dj', 'Jim Legxacy', NULL),
  ('Changes', 'Jeremih', NULL),
  ('Anti-Hero', 'Taylor Swift', NULL),
  ('No Decent Shoes for Rain', 'Dry Cleaning', NULL),
  ('Shimmer', 'Shanti Celeste', NULL),
  ('nuthin i can do is wrng', 'MIKE', NULL),
  ('Don’t Give Up', 'Black Belt Eagle Scout', NULL),
  ('Hurricane', 'Plains', NULL),
  ('Cry Alone', 'Abi Ooze', NULL),
  ('In My Bag', 'Lay Bankz', NULL),
  ('Bulerías de un Caballo Malo', 'Ralphie Choo', NULL),
  ('Sodadi', 'Chelsea Dinorath', NULL),
  ('Air Guitar', 'Sobs', NULL),
  ('Shabooya', 'HitkiddGloss UpK Carbon', NULL),
  ('Genius', 'Queen G', NULL)
  ;

   // Update to song table


//
// Step 6: Add new song_ids and update all songs to the source_song table.
//

  // Get the last song_id inserted
  song_id = 13073; // SELECT last_insert_rowid();

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
  ('2022-10-25 08:48:10.947947', '1409', '13059'),
  ('2022-10-25 08:48:10.949949', '1409', '13060'),
  ('2022-10-25 08:48:10.949949', '1410', '13061'),
  ('2022-10-25 08:48:10.950950', '1411', '13052'),
  ('2022-10-25 08:48:10.950950', '1411', '13040'),
  ('2022-10-25 08:48:10.951951', '1412', '13042'),
  ('2022-10-25 08:48:10.951951', '1412', '13043'),
  ('2022-10-25 08:48:10.951951', '1413', '13062'),
  ('2022-10-25 08:48:10.951951', '1414', '13041'),
  ('2022-10-25 08:48:10.951951', '1415', '13063'),
  ('2022-10-25 08:48:10.951951', '1416', '13064'),
  ('2022-10-25 08:48:10.951951', '1416', '13065'),
  ('2022-10-25 08:48:10.951951', '1417', '13018'),
  ('2022-10-25 08:48:10.953953', '1417', '13066'),
  ('2022-10-25 08:48:10.953953', '1418', '13067'),
  ('2022-10-25 08:48:10.953953', '1418', '12964'),
  ('2022-10-25 08:48:10.953953', '1418', '13068'),
  ('2022-10-25 08:48:10.953953', '1419', '13069'),
  ('2022-10-25 08:48:10.953953', '1420', '13070'),
  ('2022-10-25 08:48:10.953953', '1420', '13071'),
  ('2022-10-25 08:48:10.953953', '1421', '13072'),
  ('2022-10-25 08:48:10.953953', '1421', '13073'),
  ('2022-10-25 08:48:10.953953', '1422', '12978')
  ;

  // Update to source_song table
