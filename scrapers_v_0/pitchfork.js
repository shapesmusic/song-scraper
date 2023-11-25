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
    ('Pitchfork', 'Track Reviews', NULL, '2023-10-04 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-09-27 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-09-21 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-09-20 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-09-19 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/')
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
        "title": "Stunna",
        "artist_name": "Rome Streetz",
        "video_id": null,
        "capture_date": "2023-10-07 02:07:01.143143",
        "source_id": 1731,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Annie, Pick a Flower.. (My House)",
        "artist_name": "Saya Gray",
        "video_id": null,
        "capture_date": "2023-10-07 02:07:01.145145",
        "source_id": 1731,
        "song_id": 14856,
        "duplicate": true
    },
    {
        "title": "Diaries",
        "artist_name": "Martyna Basta",
        "video_id": null,
        "capture_date": "2023-10-07 02:07:01.145145",
        "source_id": 1732,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Crushing",
        "artist_name": "Eartheater",
        "video_id": null,
        "capture_date": "2023-10-07 02:07:01.145145",
        "source_id": 1733,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Census Designated",
        "artist_name": "Jane Remover",
        "video_id": null,
        "capture_date": "2023-10-07 02:07:01.145145",
        "source_id": 1733,
        "song_id": 14828,
        "duplicate": true
    },
    {
        "title": "Glory Glory",
        "artist_name": "Little Brother",
        "video_id": null,
        "capture_date": "2023-10-07 02:07:01.146146",
        "source_id": 1734,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "La Alhambra",
        "artist_name": "Marina Herlop",
        "video_id": null,
        "capture_date": "2023-10-07 02:07:01.146146",
        "source_id": 1735,
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
  ('Stunna', 'Rome Streetz', NULL),
  ('Diaries', 'Martyna Basta', NULL),
  ('Crushing', 'Eartheater', NULL),
  ('Glory Glory', 'Little Brother', NULL),
  ('La Alhambra', 'Marina Herlop', NULL)
  ;

   // Update to song table


//
// Step 6: Add new song_ids and update all songs to the source_song table.
//

  // Get the last song_id inserted
  song_id = 14869; // SELECT last_insert_rowid();

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
  ('2023-10-07 02:07:01.143143', '1731', '14865'),
  ('2023-10-07 02:07:01.145145', '1731', '14856'),
  ('2023-10-07 02:07:01.145145', '1732', '14866'),
  ('2023-10-07 02:07:01.145145', '1733', '14867'),
  ('2023-10-07 02:07:01.145145', '1733', '14828'),
  ('2023-10-07 02:07:01.146146', '1734', '14868'),
  ('2023-10-07 02:07:01.146146', '1735', '14869')
  ;

  // Update to source_song table
