// FIXME: regex [ft. artists are in brackets] and IN SONG NAME, not ARTIST

//
// Step 0: Check recent scraped
//

  SELECT song.title, source.publication_date
  FROM source_song
  INNER JOIN song
    ON song.id = source_song.song_id
  INNER JOIN source
    ON source.id = source_song.source_id
  WHERE source.parent_entity = 'Pitchfork'
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
  ('Pitchfork', 'Track Reviews', NULL, '2021-03-09 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-03-05 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-03-04 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-03-03 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-03-02 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-03-01 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-02-26 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-02-24 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-02-23 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-02-22 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-02-18 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-02-12 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-02-11 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-02-10 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-02-09 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-02-08 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-02-05 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/')
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

  JSON.stringify(songsData, null, 4);


//
// Step 3: Stage new songs only, find & set any duplicate songs to true, and add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "Zero",
        "artist_name": "John Roberts",
        "video_id": null,
        "capture_date": "2021-03-09 03:28:40.008008",
        "source_id": 807,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Leave the Door Open",
        "artist_name": "Bruno Mars, Anderson .Paak, Silk Sonic",
        "video_id": null,
        "capture_date": "2021-03-09 03:28:40.011011",
        "source_id": 808,
        "song_id": 9951,
        "duplicate": true
    },
    {
        "title": "Lemon Pepper Freestyle",
        "artist_name": "Drake",
        "video_id": null,
        "capture_date": "2021-03-09 03:28:40.011011",
        "source_id": 808,
        "song_id": 9948,
        "duplicate": true
    },
    {
        "title": "Pay Your Way in Pain",
        "artist_name": "St. Vincent",
        "video_id": null,
        "capture_date": "2021-03-09 03:28:40.011011",
        "source_id": 809,
        "song_id": 9961,
        "duplicate": true
    },
    {
        "title": "Drama",
        "artist_name": "Erika de Casier",
        "video_id": null,
        "capture_date": "2021-03-09 03:28:40.011011",
        "source_id": 809,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Open Eyes",
        "artist_name": "duendita",
        "video_id": null,
        "capture_date": "2021-03-09 03:28:40.011011",
        "source_id": 809,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Human Thing",
        "artist_name": "Mattie",
        "video_id": null,
        "capture_date": "2021-03-09 03:28:40.011011",
        "source_id": 810,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Be Sweet",
        "artist_name": "Japanese Breakfast",
        "video_id": null,
        "capture_date": "2021-03-09 03:28:40.012012",
        "source_id": 811,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Michelle Pfeiffer",
        "artist_name": "Ethel Cain",
        "video_id": null,
        "capture_date": "2021-03-09 03:28:40.012012",
        "source_id": 812,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Rainforest",
        "artist_name": "Noname",
        "video_id": null,
        "capture_date": "2021-03-09 03:28:40.012012",
        "source_id": 813,
        "song_id": 9907,
        "duplicate": true
    },
    {
        "title": "White Elephant",
        "artist_name": "Nick CaveWarren Ellis",
        "video_id": null,
        "capture_date": "2021-03-09 03:28:40.012012",
        "source_id": 813,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Devil’s Rain",
        "artist_name": "Maria BC",
        "video_id": null,
        "capture_date": "2021-03-09 03:28:40.012012",
        "source_id": 814,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Now (Forever Momentary Space)",
        "artist_name": "Damon LocksBlack Monument Ensemble",
        "video_id": null,
        "capture_date": "2021-03-09 03:28:40.012012",
        "source_id": 815,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Runnin",
        "artist_name": "Debby Friday",
        "video_id": null,
        "capture_date": "2021-03-09 03:28:40.012012",
        "source_id": 816,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Strong Feelings",
        "artist_name": "Dry Cleaning",
        "video_id": null,
        "capture_date": "2021-03-09 03:28:40.012012",
        "source_id": 817,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Love Story (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2021-03-09 03:28:40.012012",
        "source_id": 818,
        "song_id": 9787,
        "duplicate": true
    },
    {
        "title": "La Perla",
        "artist_name": "Sofia Kourtesis",
        "video_id": null,
        "capture_date": "2021-03-09 03:28:40.012012",
        "source_id": 819,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Jayu",
        "artist_name": "Se So Neon",
        "video_id": null,
        "capture_date": "2021-03-09 03:28:40.012012",
        "source_id": 820,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dreams of the Imagination",
        "artist_name": "Sandy Chamoun",
        "video_id": null,
        "capture_date": "2021-03-09 03:28:40.012012",
        "source_id": 821,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "There’s Nothing You Can’t Do",
        "artist_name": "Spirit of the Beehive",
        "video_id": null,
        "capture_date": "2021-03-09 03:28:40.012012",
        "source_id": 822,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Up",
        "artist_name": "Cardi B",
        "video_id": null,
        "capture_date": "2021-03-09 03:28:40.012012",
        "source_id": 823,
        "song_id": 9774,
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
  SELECT id, publication_date, parent_entity FROM source ORDER BY id DESC LIMIT 3;

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
  ('Zero', 'John Roberts', NULL),
  ('Drama', 'Erika de Casier', NULL),
  ('Open Eyes', 'duendita', NULL),
  ('Human Thing', 'Mattie', NULL),
  ('Be Sweet', 'Japanese Breakfast', NULL),
  ('Michelle Pfeiffer', 'Ethel Cain', NULL),
  ('White Elephant', 'Nick Cave, Warren Ellis', NULL),
  ('Devil’s Rain', 'Maria BC', NULL),
  ('Now (Forever Momentary Space)', 'Damon Locks, Black Monument Ensemble', NULL),
  ('Runnin', 'Debby Friday', NULL),
  ('Strong Feelings', 'Dry Cleaning', NULL),
  ('La Perla', 'Sofia Kourtesis', NULL),
  ('Jayu', 'Se So Neon', NULL),
  ('Dreams of the Imagination', 'Sandy Chamoun', NULL),
  ('There’s Nothing You Can’t Do', 'Spirit of the Beehive', NULL)
  ;

   // Update to song table


//
// Step 6: Add new song_ids and update all songs to the source_song table.
//

  // Get the last song_id inserted
  song_id = 9981; // SELECT last_insert_rowid();

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
  ('2021-03-09 03:28:40.008008', '807', '9967'),
  ('2021-03-09 03:28:40.011011', '808', '9951'),
  ('2021-03-09 03:28:40.011011', '808', '9948'),
  ('2021-03-09 03:28:40.011011', '809', '9961'),
  ('2021-03-09 03:28:40.011011', '809', '9968'),
  ('2021-03-09 03:28:40.011011', '809', '9969'),
  ('2021-03-09 03:28:40.011011', '810', '9970'),
  ('2021-03-09 03:28:40.012012', '811', '9971'),
  ('2021-03-09 03:28:40.012012', '812', '9972'),
  ('2021-03-09 03:28:40.012012', '813', '9907'),
  ('2021-03-09 03:28:40.012012', '813', '9973'),
  ('2021-03-09 03:28:40.012012', '814', '9974'),
  ('2021-03-09 03:28:40.012012', '815', '9975'),
  ('2021-03-09 03:28:40.012012', '816', '9976'),
  ('2021-03-09 03:28:40.012012', '817', '9977'),
  ('2021-03-09 03:28:40.012012', '818', '9787'),
  ('2021-03-09 03:28:40.012012', '819', '9978'),
  ('2021-03-09 03:28:40.012012', '820', '9979'),
  ('2021-03-09 03:28:40.012012', '821', '9980'),
  ('2021-03-09 03:28:40.012012', '822', '9981'),
  ('2021-03-09 03:28:40.012012', '823', '9774')
  ;

  // Update to source_song table
