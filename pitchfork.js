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
  ('Pitchfork', 'Track Reviews', NULL, '2021-02-04 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-02-02 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-02-01 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-01-27 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-01-26 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-01-25 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-01-21 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-01-20 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-01-19 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-01-15 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-01-14 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-01-12 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-01-08 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-01-07 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/')
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
        "title": "Xiu",
        "artist_name": "Yu Su",
        "video_id": null,
        "capture_date": "2021-03-01 07:24:10.182182",
        "source_id": "779",
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "All Futures",
        "artist_name": "The Armed",
        "video_id": null,
        "capture_date": "2021-03-01 07:24:10.184184",
        "source_id": "779",
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Holding Hand",
        "artist_name": "Iceage",
        "video_id": null,
        "capture_date": "2021-03-01 07:24:10.185185",
        "source_id": "780",
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "ACTION",
        "artist_name": "CHAI",
        "video_id": null,
        "capture_date": "2021-03-01 07:24:10.185185",
        "source_id": "781",
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Don’t Judge Me",
        "artist_name": "FKA twigsHeadie OneFred again..",
        "video_id": null,
        "capture_date": "2021-03-01 07:24:10.185185",
        "source_id": "781",
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "hold yourself.",
        "artist_name": "Tune-Yards",
        "video_id": null,
        "capture_date": "2021-03-01 07:24:10.185185",
        "source_id": "782",
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Schatze",
        "artist_name": "Ohtis",
        "video_id": null,
        "capture_date": "2021-03-01 07:24:10.185185",
        "source_id": "783",
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Madre",
        "artist_name": "Arca",
        "video_id": null,
        "capture_date": "2021-03-01 07:24:10.185185",
        "source_id": "784",
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Lo Vas a Olvidar",
        "artist_name": "Billie Eilish & Rosalía",
        "video_id": null,
        "capture_date": "2021-03-01 07:24:10.185185",
        "source_id": "785",
        "song_id": 9765,
        "duplicate": true
    },
    {
        "title": "Hard Drive",
        "artist_name": "Cassandra Jenkins",
        "video_id": null,
        "capture_date": "2021-03-01 07:24:10.185185",
        "source_id": "785",
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Salvaged Copper",
        "artist_name": "Heathered Pearls",
        "video_id": null,
        "capture_date": "2021-03-01 07:24:10.185185",
        "source_id": "786",
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "ULTIMA",
        "artist_name": "Body Meat",
        "video_id": null,
        "capture_date": "2021-03-01 07:24:10.185185",
        "source_id": "787",
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mai",
        "artist_name": "Donato Dozzy",
        "video_id": null,
        "capture_date": "2021-03-01 07:24:10.185185",
        "source_id": "788",
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Trembling of Glass",
        "artist_name": "Rachika Nayar",
        "video_id": null,
        "capture_date": "2021-03-01 07:24:10.185185",
        "source_id": "789",
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Ballroom Dance Scene",
        "artist_name": "Horsegirl",
        "video_id": null,
        "capture_date": "2021-03-01 07:24:10.186186",
        "source_id": "790",
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Groove Elation",
        "artist_name": "Bernice",
        "video_id": null,
        "capture_date": "2021-03-01 07:24:10.186186",
        "source_id": "791",
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Atlantic",
        "artist_name": "The Weather Station",
        "video_id": null,
        "capture_date": "2021-03-01 07:24:10.186186",
        "source_id": "792",
        "song_id": null,
        "duplicate": false
    }
]

  // To check for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%pov%'
    AND artist_name LIKE '%Ariana Grande%'
  ;


//
// Step 4: add source_ids
//

  // get source_ids and dates for newly added sources
  // increase LIMIT number if necessary
  SELECT id, publication_date, parent_entity FROM source ORDER BY id DESC LIMIT 3;

  // manually add source_ids in songsData above.

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

  INSERT INTO song
    (title, artist_name, video_id)
  VALUES
  ('Xiu', 'Yu Su', NULL),
  ('All Futures', 'The Armed', NULL),
  ('The Holding Hand', 'Iceage', NULL),
  ('ACTION', 'CHAI', NULL),
  ('Don’t Judge Me', 'FKA twigsHeadie OneFred again..', NULL),
  ('hold yourself.', 'Tune-Yards', NULL),
  ('Schatze', 'Ohtis', NULL),
  ('Madre', 'Arca', NULL),
  ('Hard Drive', 'Cassandra Jenkins', NULL),
  ('Salvaged Copper', 'Heathered Pearls', NULL),
  ('ULTIMA', 'Body Meat', NULL),
  ('Mai', 'Donato Dozzy', NULL),
  ('The Trembling of Glass', 'Rachika Nayar', NULL),
  ('Ballroom Dance Scene', 'Horsegirl', NULL),
  ('Groove Elation', 'Bernice', NULL),
  ('Atlantic', 'The Weather Station', NULL)
  ;

   // Update to song table


//
// Step 6: Add new song_ids and update all songs to the source_song table.
//

  // Get the last song_id inserted
  song_id = 9850; // SELECT last_insert_rowid();

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
  ('2021-03-01 07:24:10.182182', '779', '9835'),
  ('2021-03-01 07:24:10.184184', '779', '9836'),
  ('2021-03-01 07:24:10.185185', '780', '9837'),
  ('2021-03-01 07:24:10.185185', '781', '9838'),
  ('2021-03-01 07:24:10.185185', '781', '9839'),
  ('2021-03-01 07:24:10.185185', '782', '9840'),
  ('2021-03-01 07:24:10.185185', '783', '9841'),
  ('2021-03-01 07:24:10.185185', '784', '9842'),
  ('2021-03-01 07:24:10.185185', '785', '9765'),
  ('2021-03-01 07:24:10.185185', '785', '9843'),
  ('2021-03-01 07:24:10.185185', '786', '9844'),
  ('2021-03-01 07:24:10.185185', '787', '9845'),
  ('2021-03-01 07:24:10.185185', '788', '9846'),
  ('2021-03-01 07:24:10.185185', '789', '9847'),
  ('2021-03-01 07:24:10.186186', '790', '9848'),
  ('2021-03-01 07:24:10.186186', '791', '9849'),
  ('2021-03-01 07:24:10.186186', '792', '9850')
  ;

  // Update to source_song table
