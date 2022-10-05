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
  ('Pitchfork', 'Track Reviews', NULL, '2022-10-04 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-10-03 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-09-30 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-09-29 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-09-28 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-09-27 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-09-26 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-09-23 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-09-22 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-09-21 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-09-20 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-09-19 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-09-14 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-09-13 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-09-09 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-09-08 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-09-07 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-09-06 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-08-31 12:00:00.000000', 'https://pitchfork.com/reviews/tracks')
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
        "title": "D​ó​nde rueda",
        "artist_name": "Palánta",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.722722",
        "source_id": 1376,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "That Girl",
        "artist_name": "Bree Runway",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.727727",
        "source_id": 1376,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "JUDGE",
        "artist_name": "Origami Angel",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.729729",
        "source_id": 1377,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Snake Lady",
        "artist_name": "Sea Moss",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.731731",
        "source_id": 1377,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Tu Forma",
        "artist_name": "Sangre Nueva",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.732732",
        "source_id": 1377,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "New Body Rhumba",
        "artist_name": "LCD Soundsystem",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.732732",
        "source_id": 1378,
        "song_id": 12903,
        "duplicate": true
    },
    {
        "title": "Rien dire",
        "artist_name": "Christine and the Queens",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.732732",
        "source_id": 1378,
        "song_id": 12930,
        "duplicate": true
    },
    {
        "title": "Outside of Dunkin",
        "artist_name": "Papo2oo4DJ LucasSubjxct 5",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.733733",
        "source_id": 1379,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sever",
        "artist_name": "Nisa",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.733733",
        "source_id": 1380,
        "song_id": 12906,
        "duplicate": true
    },
    {
        "title": "This Is Why",
        "artist_name": "Paramore",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.733733",
        "source_id": 1380,
        "song_id": 12901,
        "duplicate": true
    },
    {
        "title": "F.O.O.F.",
        "artist_name": "Frankie Cosmos",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.733733",
        "source_id": 1381,
        "song_id": 12905,
        "duplicate": true
    },
    {
        "title": "Nun’s Dream",
        "artist_name": "Phil & the Tiles",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.733733",
        "source_id": 1382,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Blind Date",
        "artist_name": "Joy Overmono",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.733733",
        "source_id": 1383,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Baking Soda",
        "artist_name": "Mavi",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.733733",
        "source_id": 1384,
        "song_id": 12863,
        "duplicate": true
    },
    {
        "title": "Pisoteo",
        "artist_name": "Daniela Lalita",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.733733",
        "source_id": 1385,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Right to Riot",
        "artist_name": "Hagop Tchaparian",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.733733",
        "source_id": 1386,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Gemini",
        "artist_name": "Hawa",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.733733",
        "source_id": 1387,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cherub",
        "artist_name": "Coco & Clair Clair",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.733733",
        "source_id": 1387,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Post Ryan",
        "artist_name": "Gilla Band",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.733733",
        "source_id": 1388,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "It’s Not Just Me, It’s Everybody",
        "artist_name": "Weyes Blood",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.733733",
        "source_id": 1389,
        "song_id": 12846,
        "duplicate": true
    },
    {
        "title": "Miracles",
        "artist_name": "Alex G",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.734734",
        "source_id": 1390,
        "song_id": 12833,
        "duplicate": true
    },
    {
        "title": "Bull Believer",
        "artist_name": "Wednesday",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.734734",
        "source_id": 1391,
        "song_id": 12836,
        "duplicate": true
    },
    {
        "title": "Jesus Freak Lighter",
        "artist_name": "Blood Orange",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.734734",
        "source_id": 1391,
        "song_id": 12808,
        "duplicate": true
    },
    {
        "title": "Promise",
        "artist_name": "Knifeplay",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.734734",
        "source_id": 1392,
        "song_id": 12803,
        "duplicate": true
    },
    {
        "title": "No Te Quiero Perder",
        "artist_name": "DannyLux",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.734734",
        "source_id": 1392,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Tonight",
        "artist_name": "Phoenix",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.734734",
        "source_id": 1392,
        "song_id": 12809,
        "duplicate": true
    },
    {
        "title": "Party de Palo",
        "artist_name": "Inka",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.734734",
        "source_id": 1393,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Atopos",
        "artist_name": "Björk",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.734734",
        "source_id": 1393,
        "song_id": 12807,
        "duplicate": true
    },
    {
        "title": "God of Thunder",
        "artist_name": "Mosca",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.734734",
        "source_id": 1393,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Complex (Demo)",
        "artist_name": "Katie Gregson-MacLeod",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.734734",
        "source_id": 1394,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Midnight Legend",
        "artist_name": "Special Interest",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.734734",
        "source_id": 1394,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Raid on Onigashima",
        "artist_name": "Akai Solo",
        "video_id": null,
        "capture_date": "2022-10-05 10:03:16.734734",
        "source_id": 1333,
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
  SELECT id, publication_date, parent_entity FROM source ORDER BY id DESC LIMIT 30;

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
  ('D​ó​nde rueda', 'Palánta', NULL),
  ('That Girl', 'Bree Runway', NULL),
  ('JUDGE', 'Origami Angel', NULL),
  ('Snake Lady', 'Sea Moss', NULL),
  ('Tu Forma', 'Sangre Nueva', NULL),
  ('Outside of Dunkin', 'Papo2oo4DJ LucasSubjxct 5', NULL),
  ('Nun’s Dream', 'Phil & the Tiles', NULL),
  ('Blind Date', 'Joy Overmono', NULL),
  ('Pisoteo', 'Daniela Lalita', NULL),
  ('Right to Riot', 'Hagop Tchaparian', NULL),
  ('Gemini', 'Hawa', NULL),
  ('Cherub', 'Coco & Clair Clair', NULL),
  ('Post Ryan', 'Gilla Band', NULL),
  ('No Te Quiero Perder', 'DannyLux', NULL),
  ('Party de Palo', 'Inka', NULL),
  ('God of Thunder', 'Mosca', NULL),
  ('Complex (Demo)', 'Katie Gregson-MacLeod', NULL),
  ('Midnight Legend', 'Special Interest', NULL),
  ('Raid on Onigashima', 'Akai Solo', NULL)
  ;

   // Update to song table


//
// Step 6: Add new song_ids and update all songs to the source_song table.
//

  // Get the last song_id inserted
  song_id = 12954; // SELECT last_insert_rowid();

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
  ('2022-10-05 10:03:16.722722', '1376', '12936'),
  ('2022-10-05 10:03:16.727727', '1376', '12937'),
  ('2022-10-05 10:03:16.729729', '1377', '12938'),
  ('2022-10-05 10:03:16.731731', '1377', '12939'),
  ('2022-10-05 10:03:16.732732', '1377', '12940'),
  ('2022-10-05 10:03:16.732732', '1378', '12903'),
  ('2022-10-05 10:03:16.732732', '1378', '12930'),
  ('2022-10-05 10:03:16.733733', '1379', '12941'),
  ('2022-10-05 10:03:16.733733', '1380', '12906'),
  ('2022-10-05 10:03:16.733733', '1380', '12901'),
  ('2022-10-05 10:03:16.733733', '1381', '12905'),
  ('2022-10-05 10:03:16.733733', '1382', '12942'),
  ('2022-10-05 10:03:16.733733', '1383', '12943'),
  ('2022-10-05 10:03:16.733733', '1384', '12863'),
  ('2022-10-05 10:03:16.733733', '1385', '12944'),
  ('2022-10-05 10:03:16.733733', '1386', '12945'),
  ('2022-10-05 10:03:16.733733', '1387', '12946'),
  ('2022-10-05 10:03:16.733733', '1387', '12947'),
  ('2022-10-05 10:03:16.733733', '1388', '12948'),
  ('2022-10-05 10:03:16.733733', '1389', '12846'),
  ('2022-10-05 10:03:16.734734', '1390', '12833'),
  ('2022-10-05 10:03:16.734734', '1391', '12836'),
  ('2022-10-05 10:03:16.734734', '1391', '12808'),
  ('2022-10-05 10:03:16.734734', '1392', '12803'),
  ('2022-10-05 10:03:16.734734', '1392', '12949'),
  ('2022-10-05 10:03:16.734734', '1392', '12809'),
  ('2022-10-05 10:03:16.734734', '1393', '12950'),
  ('2022-10-05 10:03:16.734734', '1393', '12807'),
  ('2022-10-05 10:03:16.734734', '1393', '12951'),
  ('2022-10-05 10:03:16.734734', '1394', '12952'),
  ('2022-10-05 10:03:16.734734', '1394', '12953'),
  ('2022-10-05 10:03:16.734734', '1333', '12954')
  ;

  // Update to source_song table
