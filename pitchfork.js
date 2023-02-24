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
  ('Pitchfork', 'Track Reviews', NULL, '2023-02-21 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-02-16 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-02-15 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-02-14 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-02-13 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-02-10 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-02-09 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-02-08 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-02-07 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-02-03 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-02-02 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-02-01 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-01-31 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-01-30 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-01-27 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-01-26 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-01-25 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-01-24 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-01-20 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-01-19 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-01-18 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-01-17 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-01-13 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-01-12 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-01-11 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-01-10 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-01-06 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-01-04 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-01-03 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/')
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
        "title": "Dale Paca",
        "artist_name": "Flow 28 x Braulio Fogon x Kiko El Crazy ft. Leo RD",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.881881",
        "source_id": 1511,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Float",
        "artist_name": "Janelle Monáe ft. Seun Kuti and Egypt 80",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.883883",
        "source_id": 1512,
        "song_id": 13534,
        "duplicate": true
    },
    {
        "title": "Respawn",
        "artist_name": "Crushed",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.883883",
        "source_id": 1512,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "You the Type",
        "artist_name": "Hitkidd x Aleza x Slimeroni ft. Gloss Up and K Carbon",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.883883",
        "source_id": 1513,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "In Lightning",
        "artist_name": "Feist",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.883883",
        "source_id": 1513,
        "song_id": 13532,
        "duplicate": true
    },
    {
        "title": "A&W",
        "artist_name": "Lana Del Rey",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.883883",
        "source_id": 1514,
        "song_id": 13533,
        "duplicate": true
    },
    {
        "title": "Play",
        "artist_name": "Le Makeup ft. Tohji & gummyboy",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.883883",
        "source_id": 1515,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Love Potion",
        "artist_name": "Nick León",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.883883",
        "source_id": 1516,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Been Thinking",
        "artist_name": "Tyla",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.884884",
        "source_id": 1517,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Pearls",
        "artist_name": "Jessie Ware",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.884884",
        "source_id": 1517,
        "song_id": 13514,
        "duplicate": true
    },
    {
        "title": "GETOUTOFMYHEAD",
        "artist_name": "SHERELLE",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.884884",
        "source_id": 1518,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Younger & Dumber",
        "artist_name": "Indigo De Souza",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.884884",
        "source_id": 1518,
        "song_id": 13517,
        "duplicate": true
    },
    {
        "title": "Exodus the North Star",
        "artist_name": "Yaya Bey",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.884884",
        "source_id": 1519,
        "song_id": 13518,
        "duplicate": true
    },
    {
        "title": "Elevator",
        "artist_name": "Addison Groove",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.884884",
        "source_id": 1519,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Gotikeo (Sapphir22 Remix)",
        "artist_name": "Sassyggirl x Sapphir22",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.884884",
        "source_id": 1519,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Boy’s a Liar Pt. 2",
        "artist_name": "PinkPantheress x Ice Spice",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.884884",
        "source_id": 1520,
        "song_id": 13507,
        "duplicate": true
    },
    {
        "title": "Mojik (Your Waves)",
        "artist_name": "Fatima Al Qadiri",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.884884",
        "source_id": 1520,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dibujos de Mi Alma",
        "artist_name": "Y La Bamba",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.884884",
        "source_id": 1521,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Amaranth",
        "artist_name": "Model x Actriz",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.884884",
        "source_id": 1522,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "After All This Time",
        "artist_name": "Jana Horn",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.885885",
        "source_id": 1523,
        "song_id": 13496,
        "duplicate": true
    },
    {
        "title": "Pray It Away",
        "artist_name": "Chlöe",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.885885",
        "source_id": 1523,
        "song_id": 13458,
        "duplicate": true
    },
    {
        "title": "Echolalia",
        "artist_name": "Yves Tumor",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.885885",
        "source_id": 1524,
        "song_id": 13488,
        "duplicate": true
    },
    {
        "title": "One Touch",
        "artist_name": "Golin",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.885885",
        "source_id": 1524,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dickhead Blues",
        "artist_name": "Kara Jackson",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.885885",
        "source_id": 1525,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cinnamon",
        "artist_name": "Fatboi Sharif x Roper Williams",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.885885",
        "source_id": 1526,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sandrail Silhouette",
        "artist_name": "Avalon Emerson",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.885885",
        "source_id": 1527,
        "song_id": 13564,
        "duplicate": true
    },
    {
        "title": "Nazama",
        "artist_name": "Nyokabi Kariũki",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.885885",
        "source_id": 1527,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "All the Girls <3 ft. Tony Shhnow",
        "artist_name": "Popstar Benny",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.885885",
        "source_id": 1528,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Echo",
        "artist_name": "Lucinda Chua",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.885885",
        "source_id": 1528,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Chilldo Cycling Club",
        "artist_name": "Huizit",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.885885",
        "source_id": 1528,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Gloss Up",
        "artist_name": "BestFrenn ft. Glorilla",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.885885",
        "source_id": 1529,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cnt Go Back ( Tell Me )",
        "artist_name": "B. Cool-Aid x Pink Siifu x Ahwlee ft. Liv.e, Butcher Brown, Jimetta Rose, V.C.R, and Maurice II",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.885885",
        "source_id": 1530,
        "song_id": 13423,
        "duplicate": true
    },
    {
        "title": "Eclipse de Amor",
        "artist_name": "NOIA ft. Buscabulla",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.885885",
        "source_id": 1530,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Injury Detail",
        "artist_name": "Mandy, Indiana",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.885885",
        "source_id": 1531,
        "song_id": 13421,
        "duplicate": true
    },
    {
        "title": "Chosen to Deserve",
        "artist_name": "Wednesday",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.885885",
        "source_id": 1531,
        "song_id": 13441,
        "duplicate": true
    },
    {
        "title": "$20",
        "artist_name": "boygenius",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.885885",
        "source_id": 1531,
        "song_id": 13402,
        "duplicate": true
    },
    {
        "title": "For Granted",
        "artist_name": "Yaeji",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.885885",
        "source_id": 1532,
        "song_id": 13404,
        "duplicate": true
    },
    {
        "title": "Flowers",
        "artist_name": "Miley Cyrus",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.885885",
        "source_id": 1533,
        "song_id": 13383,
        "duplicate": true
    },
    {
        "title": "Istibtan",
        "artist_name": "Toumba",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.885885",
        "source_id": 1534,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "So Hard to Tell",
        "artist_name": "Debby Friday",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.885885",
        "source_id": 1534,
        "song_id": 13433,
        "duplicate": true
    },
    {
        "title": "Contains Multitudes",
        "artist_name": "James Holden",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.885885",
        "source_id": 1535,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Oceans Niagara",
        "artist_name": "M83",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.886886",
        "source_id": 1536,
        "song_id": 13394,
        "duplicate": true
    },
    {
        "title": "Nothing Left to Lose",
        "artist_name": "Everything But the Girl",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.886886",
        "source_id": 1536,
        "song_id": 13380,
        "duplicate": true
    },
    {
        "title": "We Caa Done",
        "artist_name": "Popcaan ft. Drake",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.887887",
        "source_id": 1537,
        "song_id": 13369,
        "duplicate": true
    },
    {
        "title": "Negro Leo",
        "artist_name": "Rela ft. May Tuti",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.887887",
        "source_id": 1538,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "OMG",
        "artist_name": "NewJeans",
        "video_id": null,
        "capture_date": "2023-02-24 09:31:04.887887",
        "source_id": 1539,
        "song_id": 13398,
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
  SELECT id, publication_date, parent_entity FROM source ORDER BY id DESC LIMIT 48;

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
  ('Dale Paca', 'Flow 28 x Braulio Fogon x Kiko El Crazy ft. Leo RD', NULL),
  ('Respawn', 'Crushed', NULL),
  ('You the Type', 'Hitkidd x Aleza x Slimeroni ft. Gloss Up and K Carbon', NULL),
  ('Play', 'Le Makeup ft. Tohji & gummyboy', NULL),
  ('Love Potion', 'Nick León', NULL),
  ('Been Thinking', 'Tyla', NULL),
  ('GETOUTOFMYHEAD', 'SHERELLE', NULL),
  ('Elevator', 'Addison Groove', NULL),
  ('Gotikeo (Sapphir22 Remix)', 'Sassyggirl x Sapphir22', NULL),
  ('Mojik (Your Waves)', 'Fatima Al Qadiri', NULL),
  ('Dibujos de Mi Alma', 'Y La Bamba', NULL),
  ('Amaranth', 'Model x Actriz', NULL),
  ('One Touch', 'Golin', NULL),
  ('Dickhead Blues', 'Kara Jackson', NULL),
  ('Cinnamon', 'Fatboi Sharif x Roper Williams', NULL),
  ('Nazama', 'Nyokabi Kariũki', NULL),
  ('All the Girls <3 ft. Tony Shhnow', 'Popstar Benny', NULL),
  ('Echo', 'Lucinda Chua', NULL),
  ('Chilldo Cycling Club', 'Huizit', NULL),
  ('Gloss Up', 'BestFrenn ft. Glorilla', NULL),
  ('Eclipse de Amor', 'NOIA ft. Buscabulla', NULL),
  ('Istibtan', 'Toumba', NULL),
  ('Contains Multitudes', 'James Holden', NULL),
  ('Negro Leo', 'Rela ft. May Tuti', NULL)
  ;

   // Update to song table


//
// Step 6: Add new song_ids and update all songs to the source_song table.
//

  // Get the last song_id inserted
  song_id = 13589; // SELECT last_insert_rowid();

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
    ('2023-02-24 09:31:04.881881', '1511', '13566'),
    ('2023-02-24 09:31:04.883883', '1512', '13534'),
    ('2023-02-24 09:31:04.883883', '1512', '13567'),
    ('2023-02-24 09:31:04.883883', '1513', '13568'),
    ('2023-02-24 09:31:04.883883', '1513', '13532'),
    ('2023-02-24 09:31:04.883883', '1514', '13533'),
    ('2023-02-24 09:31:04.883883', '1515', '13569'),
    ('2023-02-24 09:31:04.883883', '1516', '13570'),
    ('2023-02-24 09:31:04.884884', '1517', '13571'),
    ('2023-02-24 09:31:04.884884', '1517', '13514'),
    ('2023-02-24 09:31:04.884884', '1518', '13572'),
    ('2023-02-24 09:31:04.884884', '1518', '13517'),
    ('2023-02-24 09:31:04.884884', '1519', '13518'),
    ('2023-02-24 09:31:04.884884', '1519', '13573'),
    ('2023-02-24 09:31:04.884884', '1519', '13574'),
    ('2023-02-24 09:31:04.884884', '1520', '13507'),
    ('2023-02-24 09:31:04.884884', '1520', '13575'),
    ('2023-02-24 09:31:04.884884', '1521', '13576'),
    ('2023-02-24 09:31:04.884884', '1522', '13577'),
    ('2023-02-24 09:31:04.885885', '1523', '13496'),
    ('2023-02-24 09:31:04.885885', '1523', '13458'),
    ('2023-02-24 09:31:04.885885', '1524', '13488'),
    ('2023-02-24 09:31:04.885885', '1524', '13578'),
    ('2023-02-24 09:31:04.885885', '1525', '13579'),
    ('2023-02-24 09:31:04.885885', '1526', '13580'),
    ('2023-02-24 09:31:04.885885', '1527', '13564'),
    ('2023-02-24 09:31:04.885885', '1527', '13581'),
    ('2023-02-24 09:31:04.885885', '1528', '13582'),
    ('2023-02-24 09:31:04.885885', '1528', '13583'),
    ('2023-02-24 09:31:04.885885', '1528', '13584'),
    ('2023-02-24 09:31:04.885885', '1529', '13585'),
    ('2023-02-24 09:31:04.885885', '1530', '13423'),
    ('2023-02-24 09:31:04.885885', '1530', '13586'),
    ('2023-02-24 09:31:04.885885', '1531', '13421'),
    ('2023-02-24 09:31:04.885885', '1531', '13441'),
    ('2023-02-24 09:31:04.885885', '1531', '13402'),
    ('2023-02-24 09:31:04.885885', '1532', '13404'),
    ('2023-02-24 09:31:04.885885', '1533', '13383'),
    ('2023-02-24 09:31:04.885885', '1534', '13587'),
    ('2023-02-24 09:31:04.885885', '1534', '13433'),
    ('2023-02-24 09:31:04.885885', '1535', '13588'),
    ('2023-02-24 09:31:04.886886', '1536', '13394'),
    ('2023-02-24 09:31:04.886886', '1536', '13380'),
    ('2023-02-24 09:31:04.887887', '1537', '13369'),
    ('2023-02-24 09:31:04.887887', '1538', '13589'),
    ('2023-02-24 09:31:04.887887', '1539', '13398')
  ;

  // Update to source_song table
