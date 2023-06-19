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
  ('Pitchfork', 'Track Reviews', NULL, '2023-06-06 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-05-30 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-05-26 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-05-24 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-05-19 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-05-17 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-05-16 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-05-15 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-05-11 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-05-09 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-05-08 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-05-03 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-04-26 12:00:00.000000', 'https://pitchfork.com/reviews/tracks'),
  ('Pitchfork', 'Track Reviews', NULL, '2023-04-25 12:00:00.000000', 'https://pitchfork.com/reviews/tracks')
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
        "title": "Skeleton Is Walking",
        "artist_name": "Blake Mills",
        "video_id": null,
        "capture_date": "2023-06-12 05:50:42.216216",
        "source_id": 1626,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Hillbillies",
        "artist_name": "Baby Keem & Kendrick Lamar",
        "video_id": null,
        "capture_date": "2023-06-12 05:50:42.218218",
        "source_id": 1627,
        "song_id": 14324,
        "duplicate": true
    },
    {
        "title": "Karma",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2023-06-12 05:50:42.219219",
        "source_id": 1628,
        "song_id": 13081,
        "duplicate": true
    },
    {
        "title": "The King",
        "artist_name": "Anjimile",
        "video_id": null,
        "capture_date": "2023-06-12 05:50:42.219219",
        "source_id": 1629,
        "song_id": 14290,
        "duplicate": true
    },
    {
        "title": "Where She Goes",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2023-06-12 05:50:42.219219",
        "source_id": 1630,
        "song_id": 14257,
        "duplicate": true
    },
    {
        "title": "You’ll Never Get Your Money Back",
        "artist_name": "Alex Lahey",
        "video_id": null,
        "capture_date": "2023-06-12 05:50:42.219219",
        "source_id": 1630,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Universe",
        "artist_name": "Róisín Murphy",
        "video_id": null,
        "capture_date": "2023-06-12 05:50:42.219219",
        "source_id": 1631,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Greater Wings",
        "artist_name": "Julie Byrne",
        "video_id": null,
        "capture_date": "2023-06-12 05:50:42.219219",
        "source_id": 1631,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Illumina",
        "artist_name": "Call Super and Julia Holter",
        "video_id": null,
        "capture_date": "2023-06-12 05:50:42.219219",
        "source_id": 1631,
        "song_id": 14262,
        "duplicate": true
    },
    {
        "title": "It Must Change",
        "artist_name": "ANOHNI and the Johnsons",
        "video_id": null,
        "capture_date": "2023-06-12 05:50:42.219219",
        "source_id": 1632,
        "song_id": 14255,
        "duplicate": true
    },
    {
        "title": "Girl Next Door",
        "artist_name": "Tyla",
        "video_id": null,
        "capture_date": "2023-06-12 05:50:42.219219",
        "source_id": 1633,
        "song_id": 14267,
        "duplicate": true
    },
    {
        "title": "Sword",
        "artist_name": "Natural Wonder Beauty Concept",
        "video_id": null,
        "capture_date": "2023-06-12 05:50:42.219219",
        "source_id": 1634,
        "song_id": 14233,
        "duplicate": true
    },
    {
        "title": "Ritual",
        "artist_name": "DJ Danifox",
        "video_id": null,
        "capture_date": "2023-06-12 05:50:42.219219",
        "source_id": 1635,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "X Em",
        "artist_name": "Philly Goats",
        "video_id": null,
        "capture_date": "2023-06-12 05:50:42.220220",
        "source_id": 1636,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Co-Star",
        "artist_name": "Amaarae",
        "video_id": null,
        "capture_date": "2023-06-12 05:50:42.220220",
        "source_id": 1637,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "A Child’s Question, August",
        "artist_name": "PJ Harvey",
        "video_id": null,
        "capture_date": "2023-06-12 05:50:42.220220",
        "source_id": 1638,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "No More Lies",
        "artist_name": "Thundercat and Tame Impala",
        "video_id": null,
        "capture_date": "2023-06-12 05:50:42.220220",
        "source_id": 1639,
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
  ('Skeleton Is Walking', 'Blake Mills', NULL),
  ('You’ll Never Get Your Money Back', 'Alex Lahey', NULL),
  ('The Universe', 'Róisín Murphy', NULL),
  ('The Greater Wings', 'Julie Byrne', NULL),
  ('Ritual', 'DJ Danifox', NULL),
  ('X Em', 'Philly Goats', NULL),
  ('Co-Star', 'Amaarae', NULL),
  ('A Child’s Question, August', 'PJ Harvey', NULL),
  ('No More Lies', 'Thundercat and Tame Impala', NULL)
  ;

   // Update to song table


//
// Step 6: Add new song_ids and update all songs to the source_song table.
//

  // Get the last song_id inserted
  song_id = 14340; // SELECT last_insert_rowid();

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
  ('2023-06-12 05:50:42.216216', '1626', '14332'),
  ('2023-06-12 05:50:42.218218', '1627', '14324'),
  ('2023-06-12 05:50:42.219219', '1628', '13081'),
  ('2023-06-12 05:50:42.219219', '1629', '14290'),
  ('2023-06-12 05:50:42.219219', '1630', '14257'),
  ('2023-06-12 05:50:42.219219', '1630', '14333'),
  ('2023-06-12 05:50:42.219219', '1631', '14334'),
  ('2023-06-12 05:50:42.219219', '1631', '14335'),
  ('2023-06-12 05:50:42.219219', '1631', '14262'),
  ('2023-06-12 05:50:42.219219', '1632', '14255'),
  ('2023-06-12 05:50:42.219219', '1633', '14267'),
  ('2023-06-12 05:50:42.219219', '1634', '14233'),
  ('2023-06-12 05:50:42.219219', '1635', '14336'),
  ('2023-06-12 05:50:42.220220', '1636', '14337'),
  ('2023-06-12 05:50:42.220220', '1637', '14338'),
  ('2023-06-12 05:50:42.220220', '1638', '14339'),
  ('2023-06-12 05:50:42.220220', '1639', '14340')
  ;

  // Update to source_song table
