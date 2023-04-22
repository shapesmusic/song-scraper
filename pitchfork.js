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
    ('Pitchfork', 'Track Reviews', NULL, '2023-04-21 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-04-20 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-04-19 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-04-14 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-04-13 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-04-12 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-04-07 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-04-05 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-04-04 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-03-31 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-03-29 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-03-27 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-03-24 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-03-23 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-03-22 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-03-17 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-03-15 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-03-14 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-03-10 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-03-09 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-03-08 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-03-07 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-03-06 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-03-03 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-03-02 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-02-28 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-02-24 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2023-02-23 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/')
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
        "title": "Double Fantasy",
        "artist_name": "The Weeknd",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.484484",
        "source_id": 1571,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Don’t Let the Devil",
        "artist_name": "Killer Mike",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.487487",
        "source_id": 1572,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Fields",
        "artist_name": "Nourished by Time",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.487487",
        "source_id": 1573,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Fubu",
        "artist_name": "DinamarcaRalphie Choo",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.487487",
        "source_id": 1574,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Pod",
        "artist_name": "Snõõper",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.487487",
        "source_id": 1575,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "FaceTime",
        "artist_name": "billy woodsKenny Segal",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.487487",
        "source_id": 1576,
        "song_id": 14116,
        "duplicate": true
    },
    {
        "title": "Waffle House",
        "artist_name": "Jonas Brothers",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.487487",
        "source_id": 1577,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Big Songbirds Don’t Cry",
        "artist_name": "Superviolet",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.487487",
        "source_id": 1578,
        "song_id": 14058,
        "duplicate": true
    },
    {
        "title": "Cloudy",
        "artist_name": "Blue Bendy",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.487487",
        "source_id": 1578,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "One Touch",
        "artist_name": "Bambii",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.487487",
        "source_id": 1579,
        "song_id": 14104,
        "duplicate": true
    },
    {
        "title": "Maria",
        "artist_name": "Greg Mendez",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.488488",
        "source_id": 1580,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Don’t Leave Me Now",
        "artist_name": "Jessy Lanza",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.488488",
        "source_id": 1581,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Psychos",
        "artist_name": "Jenny Lewis",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.488488",
        "source_id": 1581,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dogtooth",
        "artist_name": "Tyler, the Creator",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.488488",
        "source_id": 1582,
        "song_id": 14035,
        "duplicate": true
    },
    {
        "title": "Smoke",
        "artist_name": "Victoria Monét",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.488488",
        "source_id": 1582,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dancehall",
        "artist_name": "Bella Boo",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.488488",
        "source_id": 1583,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Vampiros",
        "artist_name": "RosalíaRauw Alejandro",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.488488",
        "source_id": 1583,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Abril Lluvias Mil (Ricardo Villalobos Remix)",
        "artist_name": "Ela MinusDJ Python",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.488488",
        "source_id": 1584,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sports",
        "artist_name": "Yunè Pinku",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.488488",
        "source_id": 1585,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Reckless & Sweet",
        "artist_name": "Amaarae",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.488488",
        "source_id": 1586,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Lean Beef Patty",
        "artist_name": "JPEGMAFIADanny Brown",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.488488",
        "source_id": 1587,
        "song_id": 13742,
        "duplicate": true
    },
    {
        "title": "Safe to Run",
        "artist_name": "Esther Rose",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.488488",
        "source_id": 1588,
        "song_id": 13705,
        "duplicate": true
    },
    {
        "title": "Nurse!",
        "artist_name": "Bar Italia",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.488488",
        "source_id": 1589,
        "song_id": 13722,
        "duplicate": true
    },
    {
        "title": "Shiver",
        "artist_name": "Fever Ray",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.488488",
        "source_id": 1589,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Never Coming Back",
        "artist_name": "Alan BraxeAnnie",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.488488",
        "source_id": 1590,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I’ve Got Me",
        "artist_name": "Joanna Sternberg",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.489489",
        "source_id": 1590,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "To Be Honest",
        "artist_name": "Christine and the Queens",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.489489",
        "source_id": 1591,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "CooCool",
        "artist_name": "Róisín Murphy",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.489489",
        "source_id": 1591,
        "song_id": 13721,
        "duplicate": true
    },
    {
        "title": "Pic of U",
        "artist_name": "Proc Fiskal",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.489489",
        "source_id": 1592,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Old Place",
        "artist_name": "Jim Legxacy",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.489489",
        "source_id": 1593,
        "song_id": 13727,
        "duplicate": true
    },
    {
        "title": "Coogie",
        "artist_name": "Dijon",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.489489",
        "source_id": 1594,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Good Time",
        "artist_name": "The Dare",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.489489",
        "source_id": 1594,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Believe",
        "artist_name": "Jacques Greene",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.489489",
        "source_id": 1595,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Idaho Alien",
        "artist_name": "Youth Lagoon",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.489489",
        "source_id": 1596,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Barley",
        "artist_name": "Water From Your Eyes",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.489489",
        "source_id": 1596,
        "song_id": 13636,
        "duplicate": true
    },
    {
        "title": "Tin Man",
        "artist_name": "Feeble Little Horse",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.489489",
        "source_id": 1596,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Pawnshop",
        "artist_name": "Kara Jackson",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.489489",
        "source_id": 1597,
        "song_id": 13734,
        "duplicate": true
    },
    {
        "title": "Moonlight",
        "artist_name": "Kali Uchis",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.489489",
        "source_id": 1597,
        "song_id": 14008,
        "duplicate": true
    },
    {
        "title": "To Remain/To Return",
        "artist_name": "Arooj Aftab, Vijay Iyer, Shahzad Ismaily",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.489489",
        "source_id": 1597,
        "song_id": 13607,
        "duplicate": true
    },
    {
        "title": "Captain Picard",
        "artist_name": "PhiikLungs",
        "video_id": null,
        "capture_date": "2023-04-22 09:22:34.489489",
        "source_id": 1598,
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
  ('Double Fantasy', 'The Weeknd', NULL),
  ('Don’t Let the Devil', 'Killer Mike', NULL),
  ('The Fields', 'Nourished by Time', NULL),
  ('Fubu', 'DinamarcaRalphie Choo', NULL),
  ('Pod', 'Snõõper', NULL),
  ('Waffle House', 'Jonas Brothers', NULL),
  ('Cloudy', 'Blue Bendy', NULL),
  ('Maria', 'Greg Mendez', NULL),
  ('Don’t Leave Me Now', 'Jessy Lanza', NULL),
  ('Psychos', 'Jenny Lewis', NULL),
  ('Smoke', 'Victoria Monét', NULL),
  ('Dancehall', 'Bella Boo', NULL),
  ('Vampiros', 'RosalíaRauw Alejandro', NULL),
  ('Abril Lluvias Mil (Ricardo Villalobos Remix)', 'Ela MinusDJ Python', NULL),
  ('Sports', 'Yunè Pinku', NULL),
  ('Reckless & Sweet', 'Amaarae', NULL),
  ('Shiver', 'Fever Ray', NULL),
  ('Never Coming Back', 'Alan BraxeAnnie', NULL),
  ('I’ve Got Me', 'Joanna Sternberg', NULL),
  ('To Be Honest', 'Christine and the Queens', NULL),
  ('Pic of U', 'Proc Fiskal', NULL),
  ('Coogie', 'Dijon', NULL),
  ('Good Time', 'The Dare', NULL),
  ('Believe', 'Jacques Greene', NULL),
  ('Idaho Alien', 'Youth Lagoon', NULL),
  ('Tin Man', 'Feeble Little Horse', NULL),
  ('Captain Picard', 'PhiikLungs', NULL)
  ;

   // Update to song table


//
// Step 6: Add new song_ids and update all songs to the source_song table.
//

  // Get the last song_id inserted
  song_id = 14143; // SELECT last_insert_rowid();

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
  ('2023-04-22 09:22:34.484484', '1571', '14117'),
  ('2023-04-22 09:22:34.487487', '1572', '14118'),
  ('2023-04-22 09:22:34.487487', '1573', '14119'),
  ('2023-04-22 09:22:34.487487', '1574', '14120'),
  ('2023-04-22 09:22:34.487487', '1575', '14121'),
  ('2023-04-22 09:22:34.487487', '1576', '14116'),
  ('2023-04-22 09:22:34.487487', '1577', '14122'),
  ('2023-04-22 09:22:34.487487', '1578', '14058'),
  ('2023-04-22 09:22:34.487487', '1578', '14123'),
  ('2023-04-22 09:22:34.487487', '1579', '14104'),
  ('2023-04-22 09:22:34.488488', '1580', '14124'),
  ('2023-04-22 09:22:34.488488', '1581', '14125'),
  ('2023-04-22 09:22:34.488488', '1581', '14126'),
  ('2023-04-22 09:22:34.488488', '1582', '14035'),
  ('2023-04-22 09:22:34.488488', '1582', '14127'),
  ('2023-04-22 09:22:34.488488', '1583', '14128'),
  ('2023-04-22 09:22:34.488488', '1583', '14129'),
  ('2023-04-22 09:22:34.488488', '1584', '14130'),
  ('2023-04-22 09:22:34.488488', '1585', '14131'),
  ('2023-04-22 09:22:34.488488', '1586', '14132'),
  ('2023-04-22 09:22:34.488488', '1587', '13742'),
  ('2023-04-22 09:22:34.488488', '1588', '13705'),
  ('2023-04-22 09:22:34.488488', '1589', '13722'),
  ('2023-04-22 09:22:34.488488', '1589', '14133'),
  ('2023-04-22 09:22:34.488488', '1590', '14134'),
  ('2023-04-22 09:22:34.489489', '1590', '14135'),
  ('2023-04-22 09:22:34.489489', '1591', '14136'),
  ('2023-04-22 09:22:34.489489', '1591', '13721'),
  ('2023-04-22 09:22:34.489489', '1592', '14137'),
  ('2023-04-22 09:22:34.489489', '1593', '13727'),
  ('2023-04-22 09:22:34.489489', '1594', '14138'),
  ('2023-04-22 09:22:34.489489', '1594', '14139'),
  ('2023-04-22 09:22:34.489489', '1595', '14140'),
  ('2023-04-22 09:22:34.489489', '1596', '14141'),
  ('2023-04-22 09:22:34.489489', '1596', '13636'),
  ('2023-04-22 09:22:34.489489', '1596', '14142'),
  ('2023-04-22 09:22:34.489489', '1597', '13734'),
  ('2023-04-22 09:22:34.489489', '1597', '14008'),
  ('2023-04-22 09:22:34.489489', '1597', '13607'),
  ('2023-04-22 09:22:34.489489', '1598', '14143')
  ;

  // Update to source_song table
