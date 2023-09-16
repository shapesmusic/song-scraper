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
    ('Pitchfork', 'Track Reviews', NULL, '2023-09-14 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-09-01 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-08-31 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-08-30 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-08-29 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-08-28 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-08-24 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-08-23 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-08-22 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-08-18 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-08-17 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-08-14 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-08-11 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-08-10 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-08-07 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-08-02 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-08-01 12:00:00.000000', 'https://pitchfork.com/reviews/tracks')
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
        "title": "Will Anybody Ever Love Me?",
        "artist_name": "Sufjan Stevens",
        "video_id": null,
        "capture_date": "2023-09-16 02:45:48.047047",
        "source_id": 1703,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Demons",
        "artist_name": "Doja Cat",
        "video_id": null,
        "capture_date": "2023-09-16 02:45:48.049049",
        "source_id": 1704,
        "song_id": 14708,
        "duplicate": true
    },
    {
        "title": "I’m Scanning Things I Can’t See",
        "artist_name": "Fievel Is Glauque",
        "video_id": null,
        "capture_date": "2023-09-16 02:45:48.049049",
        "source_id": 1704,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Runway",
        "artist_name": "DJ Premier",
        "video_id": null,
        "capture_date": "2023-09-16 02:45:48.050050",
        "source_id": 1705,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Plain Speak",
        "artist_name": "Marnie Stern",
        "video_id": null,
        "capture_date": "2023-09-16 02:45:48.050050",
        "source_id": 1706,
        "song_id": 14722,
        "duplicate": true
    },
    {
        "title": "Bright Green Vibrant Gray",
        "artist_name": "Helena Deland",
        "video_id": null,
        "capture_date": "2023-09-16 02:45:48.050050",
        "source_id": 1706,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Vajkoczy",
        "artist_name": "Sofia Kourtesis",
        "video_id": null,
        "capture_date": "2023-09-16 02:45:48.050050",
        "source_id": 1707,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I Got Heaven",
        "artist_name": "Mannequin Pussy",
        "video_id": null,
        "capture_date": "2023-09-16 02:45:48.050050",
        "source_id": 1708,
        "song_id": 14723,
        "duplicate": true
    },
    {
        "title": "For Now and Forever",
        "artist_name": "DJ Sabrina the Teenage DJ",
        "video_id": null,
        "capture_date": "2023-09-16 02:45:48.050050",
        "source_id": 1709,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Binoculars",
        "artist_name": "Shabazz Palaces",
        "video_id": null,
        "capture_date": "2023-09-16 02:45:48.050050",
        "source_id": 1709,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Pet Rock",
        "artist_name": "L’Rain",
        "video_id": null,
        "capture_date": "2023-09-16 02:45:48.050050",
        "source_id": 1710,
        "song_id": 14678,
        "duplicate": true
    },
    {
        "title": "With the Other Hand",
        "artist_name": "Lost Girls",
        "video_id": null,
        "capture_date": "2023-09-16 02:45:48.050050",
        "source_id": 1711,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I Got It Bad",
        "artist_name": "Addison Rae",
        "video_id": null,
        "capture_date": "2023-09-16 02:45:48.050050",
        "source_id": 1712,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "What Comes Will Come",
        "artist_name": "Genesis Owusu",
        "video_id": null,
        "capture_date": "2023-09-16 02:45:48.050050",
        "source_id": 1712,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "4K Murmurs",
        "artist_name": "Purelink",
        "video_id": null,
        "capture_date": "2023-09-16 02:45:48.050050",
        "source_id": 1713,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "So You Are Tired",
        "artist_name": "Sufjan Stevens",
        "video_id": null,
        "capture_date": "2023-09-16 02:45:48.051051",
        "source_id": 1714,
        "song_id": 14665,
        "duplicate": true
    },
    {
        "title": "Your Spit",
        "artist_name": "IAN SWEET",
        "video_id": null,
        "capture_date": "2023-09-16 02:45:48.051051",
        "source_id": 1714,
        "song_id": 14631,
        "duplicate": true
    },
    {
        "title": "Bad Idea Right?",
        "artist_name": "Olivia Rodrigo",
        "video_id": null,
        "capture_date": "2023-09-16 02:45:48.051051",
        "source_id": 1715,
        "song_id": 14626,
        "duplicate": true
    },
    {
        "title": "What Not to Do (Moodymann Remix)",
        "artist_name": "Róisín Murphy",
        "video_id": null,
        "capture_date": "2023-09-16 02:45:48.051051",
        "source_id": 1716,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Knockin",
        "artist_name": "MJ Lenderman",
        "video_id": null,
        "capture_date": "2023-09-16 02:45:48.051051",
        "source_id": 1717,
        "song_id": 14643,
        "duplicate": true
    },
    {
        "title": "Trauma Mic",
        "artist_name": "Armand Hammer",
        "video_id": null,
        "capture_date": "2023-09-16 02:45:48.051051",
        "source_id": 1718,
        "song_id": 14621,
        "duplicate": true
    },
    {
        "title": "Fruit Loop",
        "artist_name": "Flo Milli",
        "video_id": null,
        "capture_date": "2023-09-16 02:45:48.051051",
        "source_id": 1719,
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
  ('Will Anybody Ever Love Me?', 'Sufjan Stevens', NULL),
  ('I’m Scanning Things I Can’t See', 'Fievel Is Glauque', NULL),
  ('Runway', 'DJ Premier', NULL),
  ('Bright Green Vibrant Gray', 'Helena Deland', NULL),
  ('Vajkoczy', 'Sofia Kourtesis', NULL),
  ('For Now and Forever', 'DJ Sabrina the Teenage DJ', NULL),
  ('Binoculars', 'Shabazz Palaces', NULL),
  ('With the Other Hand', 'Lost Girls', NULL),
  ('I Got It Bad', 'Addison Rae', NULL),
  ('What Comes Will Come', 'Genesis Owusu', NULL),
  ('4K Murmurs', 'Purelink', NULL),
  ('What Not to Do (Moodymann Remix)', 'Róisín Murphy', NULL),
  ('Fruit Loop', 'Flo Milli', NULL)
  ;

   // Update to song table


//
// Step 6: Add new song_ids and update all songs to the source_song table.
//

  // Get the last song_id inserted
  song_id = 14768; // SELECT last_insert_rowid();

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
  ('2023-09-16 02:45:48.047047', '1703', '14756'),
  ('2023-09-16 02:45:48.049049', '1704', '14708'),
  ('2023-09-16 02:45:48.049049', '1704', '14757'),
  ('2023-09-16 02:45:48.050050', '1705', '14758'),
  ('2023-09-16 02:45:48.050050', '1706', '14722'),
  ('2023-09-16 02:45:48.050050', '1706', '14759'),
  ('2023-09-16 02:45:48.050050', '1707', '14760'),
  ('2023-09-16 02:45:48.050050', '1708', '14723'),
  ('2023-09-16 02:45:48.050050', '1709', '14761'),
  ('2023-09-16 02:45:48.050050', '1709', '14762'),
  ('2023-09-16 02:45:48.050050', '1710', '14678'),
  ('2023-09-16 02:45:48.050050', '1711', '14763'),
  ('2023-09-16 02:45:48.050050', '1712', '14764'),
  ('2023-09-16 02:45:48.050050', '1712', '14765'),
  ('2023-09-16 02:45:48.050050', '1713', '14766'),
  ('2023-09-16 02:45:48.051051', '1714', '14665'),
  ('2023-09-16 02:45:48.051051', '1714', '14631'),
  ('2023-09-16 02:45:48.051051', '1715', '14626'),
  ('2023-09-16 02:45:48.051051', '1716', '14767'),
  ('2023-09-16 02:45:48.051051', '1717', '14643'),
  ('2023-09-16 02:45:48.051051', '1718', '14621'),
  ('2023-09-16 02:45:48.051051', '1719', '14768')
  ;

  // Update to source_song table
