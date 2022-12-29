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
  ('Pitchfork', 'Track Reviews', NULL, '2022-12-15 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-12-13 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-12-12 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-12-09 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-12-08 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-12-07 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-12-06 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-12-02 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/')
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
        "title": "Madhatter",
        "artist_name": "Mona Evie",
        "video_id": null,
        "capture_date": "2022-12-28 08:58:44.076076",
        "source_id": 1474,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Only in The",
        "artist_name": "Crosslegged",
        "video_id": null,
        "capture_date": "2022-12-28 08:58:44.078078",
        "source_id": 1474,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Gorilla",
        "artist_name": "Little Simz",
        "video_id": null,
        "capture_date": "2022-12-28 08:58:44.078078",
        "source_id": 1475,
        "song_id": 13329,
        "duplicate": true
    },
    {
        "title": "The Sheltering Sky - Alva Noto Remodel",
        "artist_name": "Ryuichi SakamotoAlva Noto",
        "video_id": null,
        "capture_date": "2022-12-28 08:58:44.079079",
        "source_id": 1475,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Ocean",
        "artist_name": "Katarina Gryvul",
        "video_id": null,
        "capture_date": "2022-12-28 08:58:44.079079",
        "source_id": 1476,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Blind",
        "artist_name": "SZA",
        "video_id": null,
        "capture_date": "2022-12-28 08:58:44.079079",
        "source_id": 1477,
        "song_id": 13304,
        "duplicate": true
    },
    {
        "title": "Body/Prison",
        "artist_name": "Evita Manji",
        "video_id": null,
        "capture_date": "2022-12-28 08:58:44.079079",
        "source_id": 1478,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Yerimayo Celebration",
        "artist_name": "Baaba Maal",
        "video_id": null,
        "capture_date": "2022-12-28 08:58:44.079079",
        "source_id": 1478,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Did You Know That There’s a Tunnel Under Ocean Blvd",
        "artist_name": "Lana Del Rey",
        "video_id": null,
        "capture_date": "2022-12-28 08:58:44.079079",
        "source_id": 1479,
        "song_id": 13291,
        "duplicate": true
    },
    {
        "title": "Puesta",
        "artist_name": "Villano AntillanoLa Dame Blanche",
        "video_id": null,
        "capture_date": "2022-12-28 08:58:44.079079",
        "source_id": 1479,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Shittin’ Me",
        "artist_name": "A$AP Rocky",
        "video_id": null,
        "capture_date": "2022-12-28 08:58:44.079079",
        "source_id": 1480,
        "song_id": 13261,
        "duplicate": true
    },
    {
        "title": "Oni (They)",
        "artist_name": "Kate NV",
        "video_id": null,
        "capture_date": "2022-12-28 08:58:44.079079",
        "source_id": 1480,
        "song_id": 13295,
        "duplicate": true
    },
    {
        "title": "Hey Big Man",
        "artist_name": "100 gecs",
        "video_id": null,
        "capture_date": "2022-12-28 08:58:44.079079",
        "source_id": 1481,
        "song_id": 13251,
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
  ('Madhatter', 'Mona Evie', NULL),
  ('Only in The', 'Crosslegged', NULL),
  ('The Sheltering Sky - Alva Noto Remodel', 'Ryuichi SakamotoAlva Noto', NULL),
  ('Ocean', 'Katarina Gryvul', NULL),
  ('Body/Prison', 'Evita Manji', NULL),
  ('Yerimayo Celebration', 'Baaba Maal', NULL),
  ('Puesta', 'Villano AntillanoLa Dame Blanche', NULL)
  ;

   // Update to song table


//
// Step 6: Add new song_ids and update all songs to the source_song table.
//

  // Get the last song_id inserted
  song_id = 13354; // SELECT last_insert_rowid();

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
    ('2022-12-28 08:58:44.076076', '1474', '13348'),
    ('2022-12-28 08:58:44.078078', '1474', '13349'),
    ('2022-12-28 08:58:44.078078', '1475', '13329'),
    ('2022-12-28 08:58:44.079079', '1475', '13350'),
    ('2022-12-28 08:58:44.079079', '1476', '13351'),
    ('2022-12-28 08:58:44.079079', '1477', '13304'),
    ('2022-12-28 08:58:44.079079', '1478', '13352'),
    ('2022-12-28 08:58:44.079079', '1478', '13353'),
    ('2022-12-28 08:58:44.079079', '1479', '13291'),
    ('2022-12-28 08:58:44.079079', '1479', '13354'),
    ('2022-12-28 08:58:44.079079', '1480', '13261'),
    ('2022-12-28 08:58:44.079079', '1480', '13295'),
    ('2022-12-28 08:58:44.079079', '1481', '13251')
  ;

  // Update to source_song table
