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
  ('Pitchfork', 'Track Reviews', NULL, '2022-08-30 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/?page=4'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-08-29 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/?page=4'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-08-23 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/?page=4'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-08-22 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/?page=4'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-08-19 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/?page=4'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-08-18 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/?page=4'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-08-17 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/?page=4'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-08-16 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/?page=4'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-08-15 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/?page=4'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-08-12 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/?page=4'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-08-09 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/?page=4'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-08-08 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/?page=4'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-08-05 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/?page=4'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-08-04 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/?page=4'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-08-03 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/?page=4'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-08-02 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/?page=4'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-08-01 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/?page=4'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-07-29 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/?page=4'),
  ('Pitchfork', 'Track Reviews', NULL, '2022-07-28 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/?page=4')
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
        "title": "There’d Better Be a Mirrorball",
        "artist_name": "Arctic Monkeys",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.138138",
        "source_id": 1333,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cada Músculo",
        "artist_name": "Mabe Fratti",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.142142",
        "source_id": 1333,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hey Baby",
        "artist_name": "I. Jordan",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.142142",
        "source_id": 1334,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hagan Ruido",
        "artist_name": "Gera MXSnow tha Product",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.142142",
        "source_id": 1334,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dicen",
        "artist_name": "Lucrecia Dalt",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.142142",
        "source_id": 1335,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Weird Goodbyes",
        "artist_name": "The National",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.143143",
        "source_id": 1336,
        "song_id": 12716,
        "duplicate": true
    },
    {
        "title": "Make You Say",
        "artist_name": "Zedd, Maren Morris, Beauz",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.143143",
        "source_id": 1337,
        "song_id": 12689,
        "duplicate": true
    },
    {
        "title": "Happen",
        "artist_name": "Nick Hakim",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.143143",
        "source_id": 1338,
        "song_id": 12694,
        "duplicate": true
    },
    {
        "title": "Brindo",
        "artist_name": "Silvana Estrada",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.143143",
        "source_id": 1338,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hoodie",
        "artist_name": "Ari Lennox",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.143143",
        "source_id": 1339,
        "song_id": 12646,
        "duplicate": true
    },
    {
        "title": "Plug",
        "artist_name": "Nikki Nair",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.143143",
        "source_id": 1340,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sex Appeal",
        "artist_name": "Blackstarkids",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.143143",
        "source_id": 1341,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sudany",
        "artist_name": "Sofie BirchAntonina Nowacka",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.143143",
        "source_id": 1342,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Paper Plane",
        "artist_name": "Girls’ Generation",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.143143",
        "source_id": 1343,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Real Hips",
        "artist_name": "Bandmanrill",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.143143",
        "source_id": 1344,
        "song_id": 12619,
        "duplicate": true
    },
    {
        "title": "Ven Vamos",
        "artist_name": "MULA",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.143143",
        "source_id": 1345,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Pájaros en Verano",
        "artist_name": "Ela MinusDJ Python",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.144144",
        "source_id": 1345,
        "song_id": 12626,
        "duplicate": true
    },
    {
        "title": "Ocean",
        "artist_name": "Young Jesus",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.144144",
        "source_id": 1346,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Edge of the Edge",
        "artist_name": "Panda BearSonic Boom",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.144144",
        "source_id": 1346,
        "song_id": 12620,
        "duplicate": true
    },
    {
        "title": "Daydream",
        "artist_name": "Neggy Gemmy",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.144144",
        "source_id": 1347,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Blessing",
        "artist_name": "Akini JingChace",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.144144",
        "source_id": 1347,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cookie",
        "artist_name": "NewJeans",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.144144",
        "source_id": 1348,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Drugs du Jour",
        "artist_name": "Cakes da Killa",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.144144",
        "source_id": 1349,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Xtasis",
        "artist_name": "Nick León",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.144144",
        "source_id": 1349,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "grimace_smoking_weed.jpeg",
        "artist_name": "Chat Pile",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.144144",
        "source_id": 1350,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Virgo’s Groove",
        "artist_name": "Beyoncé",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.144144",
        "source_id": 1350,
        "song_id": 12605,
        "duplicate": true
    },
    {
        "title": "2 Die 4",
        "artist_name": "Tove Lo",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.144144",
        "source_id": 1351,
        "song_id": 12596,
        "duplicate": true
    },
    {
        "title": "Despechá",
        "artist_name": "Rosalía",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.144144",
        "source_id": 1351,
        "song_id": 12587,
        "duplicate": true
    },
    {
        "title": "So Typically Now",
        "artist_name": "U.S. Girls",
        "video_id": null,
        "capture_date": "2022-08-30 02:01:13.144144",
        "source_id": 1299,
        "song_id": 12588,
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
  ('There’d Better Be a Mirrorball', 'Arctic Monkeys', NULL),
  ('Cada Músculo', 'Mabe Fratti', NULL),
  ('Hey Baby', 'I. Jordan', NULL),
  ('Hagan Ruido', 'Gera MXSnow tha Product', NULL),
  ('Dicen', 'Lucrecia Dalt', NULL),
  ('Brindo', 'Silvana Estrada', NULL),
  ('Plug', 'Nikki Nair', NULL),
  ('Sex Appeal', 'Blackstarkids', NULL),
  ('Sudany', 'Sofie BirchAntonina Nowacka', NULL),
  ('Paper Plane', 'Girls’ Generation', NULL),
  ('Ven Vamos', 'MULA', NULL),
  ('Ocean', 'Young Jesus', NULL),
  ('Daydream', 'Neggy Gemmy', NULL),
  ('Blessing', 'Akini JingChace', NULL),
  ('Cookie', 'NewJeans', NULL),
  ('Drugs du Jour', 'Cakes da Killa', NULL),
  ('Xtasis', 'Nick León', NULL),
  ('grimace_smoking_weed.jpeg', 'Chat Pile', NULL)
  ;

   // Update to song table


//
// Step 6: Add new song_ids and update all songs to the source_song table.
//

  // Get the last song_id inserted
  song_id = 12759; // SELECT last_insert_rowid();

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
  ('2022-08-30 02:01:13.138138', '1333', '12742'),
  ('2022-08-30 02:01:13.142142', '1333', '12743'),
  ('2022-08-30 02:01:13.142142', '1334', '12744'),
  ('2022-08-30 02:01:13.142142', '1334', '12745'),
  ('2022-08-30 02:01:13.142142', '1335', '12746'),
  ('2022-08-30 02:01:13.143143', '1336', '12716'),
  ('2022-08-30 02:01:13.143143', '1337', '12689'),
  ('2022-08-30 02:01:13.143143', '1338', '12694'),
  ('2022-08-30 02:01:13.143143', '1338', '12747'),
  ('2022-08-30 02:01:13.143143', '1339', '12646'),
  ('2022-08-30 02:01:13.143143', '1340', '12748'),
  ('2022-08-30 02:01:13.143143', '1341', '12749'),
  ('2022-08-30 02:01:13.143143', '1342', '12750'),
  ('2022-08-30 02:01:13.143143', '1343', '12751'),
  ('2022-08-30 02:01:13.143143', '1344', '12619'),
  ('2022-08-30 02:01:13.143143', '1345', '12752'),
  ('2022-08-30 02:01:13.144144', '1345', '12626'),
  ('2022-08-30 02:01:13.144144', '1346', '12753'),
  ('2022-08-30 02:01:13.144144', '1346', '12620'),
  ('2022-08-30 02:01:13.144144', '1347', '12754'),
  ('2022-08-30 02:01:13.144144', '1347', '12755'),
  ('2022-08-30 02:01:13.144144', '1348', '12756'),
  ('2022-08-30 02:01:13.144144', '1349', '12757'),
  ('2022-08-30 02:01:13.144144', '1349', '12758'),
  ('2022-08-30 02:01:13.144144', '1350', '12759'),
  ('2022-08-30 02:01:13.144144', '1350', '12605'),
  ('2022-08-30 02:01:13.144144', '1351', '12596'),
  ('2022-08-30 02:01:13.144144', '1351', '12587'),
  ('2022-08-30 02:01:13.144144', '1299', '12588')
  ;

  // Update to source_song table
