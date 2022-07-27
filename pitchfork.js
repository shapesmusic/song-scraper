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
  ('Pitchfork', 'Track Reviews', NULL, '2022-07-27 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-07-26 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-07-22 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-07-21 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-07-20 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-07-19 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-07-14 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-07-13 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-07-12 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-07-07 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-07-06 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-07-01 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/')
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
        "title": "Muzik",
        "artist_name": "Jennifer Loveless",
        "video_id": null,
        "capture_date": "2022-07-27 04:57:07.390390",
        "source_id": 1299,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Feathers",
        "artist_name": "Palm",
        "video_id": null,
        "capture_date": "2022-07-27 04:57:07.393393",
        "source_id": 1300,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cross the Sea",
        "artist_name": "Alex G",
        "video_id": null,
        "capture_date": "2022-07-27 04:57:07.393393",
        "source_id": 1300,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Gotsta Get Paid",
        "artist_name": "Rico Nasty",
        "video_id": null,
        "capture_date": "2022-07-27 04:57:07.393393",
        "source_id": 1301,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Karaoke",
        "artist_name": "Cass McCombs",
        "video_id": null,
        "capture_date": "2022-07-27 04:57:07.393393",
        "source_id": 1301,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Three Essays: First Essay (Nimrod)",
        "artist_name": "Caroline ShawAttacca Quartet",
        "video_id": null,
        "capture_date": "2022-07-27 04:57:07.394394",
        "source_id": 1302,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Big Steppa",
        "artist_name": "Flo Milli",
        "video_id": null,
        "capture_date": "2022-07-27 04:57:07.394394",
        "source_id": 1303,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sueños",
        "artist_name": "Waleed",
        "video_id": null,
        "capture_date": "2022-07-27 04:57:07.395395",
        "source_id": 1303,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Free Yourself",
        "artist_name": "Jessie Ware",
        "video_id": null,
        "capture_date": "2022-07-27 04:57:07.395395",
        "source_id": 1304,
        "song_id": 12541,
        "duplicate": true
    },
    {
        "title": "YAY",
        "artist_name": "valknee",
        "video_id": null,
        "capture_date": "2022-07-27 04:57:07.395395",
        "source_id": 1305,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Nausea",
        "artist_name": "Rachika Nayar",
        "video_id": null,
        "capture_date": "2022-07-27 04:57:07.395395",
        "source_id": 1306,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Let the Lights On",
        "artist_name": "Sorry",
        "video_id": null,
        "capture_date": "2022-07-27 04:57:07.395395",
        "source_id": 1307,
        "song_id": 12534,
        "duplicate": true
    },
    {
        "title": "Pressure in My Chest",
        "artist_name": "Indigo Sparke",
        "video_id": null,
        "capture_date": "2022-07-27 04:57:07.395395",
        "source_id": 1307,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Part of the Band",
        "artist_name": "The 1975",
        "video_id": null,
        "capture_date": "2022-07-27 04:57:07.395395",
        "source_id": 1308,
        "song_id": 12484,
        "duplicate": true
    },
    {
        "title": "Immature",
        "artist_name": "Flo",
        "video_id": null,
        "capture_date": "2022-07-27 04:57:07.395395",
        "source_id": 1308,
        "song_id": 12488,
        "duplicate": true
    },
    {
        "title": "Pharmacist",
        "artist_name": "Alvvays",
        "video_id": null,
        "capture_date": "2022-07-27 04:57:07.395395",
        "source_id": 1309,
        "song_id": 12485,
        "duplicate": true
    },
    {
        "title": "Thérèse",
        "artist_name": "Maya Hawke",
        "video_id": null,
        "capture_date": "2022-07-27 04:57:07.395395",
        "source_id": 1309,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Touch Tank",
        "artist_name": "quinnie",
        "video_id": null,
        "capture_date": "2022-07-27 04:57:07.395395",
        "source_id": 1310,
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
  ('Muzik', 'Jennifer Loveless', NULL),
  ('Feathers', 'Palm', NULL),
  ('Cross the Sea', 'Alex G', NULL),
  ('Gotsta Get Paid', 'Rico Nasty', NULL),
  ('Karaoke', 'Cass McCombs', NULL),
  ('Three Essays: First Essay (Nimrod)', 'Caroline ShawAttacca Quartet', NULL),
  ('Big Steppa', 'Flo Milli', NULL),
  ('Sueños', 'Waleed', NULL),
  ('YAY', 'valknee', NULL),
  ('Nausea', 'Rachika Nayar', NULL),
  ('Pressure in My Chest', 'Indigo Sparke', NULL),
  ('Thérèse', 'Maya Hawke', NULL),
  ('Touch Tank', 'quinnie', NULL)
  ;

   // Update to song table


//
// Step 6: Add new song_ids and update all songs to the source_song table.
//

  // Get the last song_id inserted
  song_id = 12578; // SELECT last_insert_rowid();

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
  ('2022-07-27 04:57:07.390390', '1299', '12566'),
  ('2022-07-27 04:57:07.393393', '1300', '12567'),
  ('2022-07-27 04:57:07.393393', '1300', '12568'),
  ('2022-07-27 04:57:07.393393', '1301', '12569'),
  ('2022-07-27 04:57:07.393393', '1301', '12570'),
  ('2022-07-27 04:57:07.394394', '1302', '12571'),
  ('2022-07-27 04:57:07.394394', '1303', '12572'),
  ('2022-07-27 04:57:07.395395', '1303', '12573'),
  ('2022-07-27 04:57:07.395395', '1304', '12541'),
  ('2022-07-27 04:57:07.395395', '1305', '12574'),
  ('2022-07-27 04:57:07.395395', '1306', '12575'),
  ('2022-07-27 04:57:07.395395', '1307', '12534'),
  ('2022-07-27 04:57:07.395395', '1307', '12576'),
  ('2022-07-27 04:57:07.395395', '1308', '12484'),
  ('2022-07-27 04:57:07.395395', '1308', '12488'),
  ('2022-07-27 04:57:07.395395', '1309', '12485'),
  ('2022-07-27 04:57:07.395395', '1309', '12577'),
  ('2022-07-27 04:57:07.395395', '1310', '12578')
  ;

  // Update to source_song table
