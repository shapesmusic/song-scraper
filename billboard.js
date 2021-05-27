//
// Step 0: Check recent scraped
//

  SELECT instance_name FROM source WHERE parent_entity = 'Billboard' ORDER BY publication_date DESC LIMIT 8;


//
// Step 1: Scrape source data
//

  // Add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // Get and format publicationDate
  publicationDate = document.getElementsByClassName('date-selector__button button--link')[0].innerText.trim();
  publicationDateFormatted = moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

  // Get location and format for current or past chart status
  currentChartLocation = window.location.href + "/" + moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD");
  pastChartLocation = window.location.href;

  // Build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'Billboard\', \'The Hot 100\', \'Week of "
    + publicationDate + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + currentChartLocation + "\');" // use pastChartLocation if not the current week's chart, otherwise use currentChartLocation
  );


  // Stage the SQL statement
  // Replace any ' in strings with ’

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('Billboard', 'The Hot 100', 'Week of May 29, 2021', '2021-05-29 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2021-05-29');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 917; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName('chart-list__element display--flex');

  songsData = [];

  for (var i=0; i<elements.length; i++){
      element = elements[i];
      isNew = element.getElementsByClassName('chart-element__trend chart-element__trend--new color--accent');
      songName = element.getElementsByClassName('chart-element__information__song text--truncate color--primary')[0];
      artistName = element.getElementsByClassName('chart-element__information__artist text--truncate color--secondary')[0];

      title = songName.innerText.trim();
      artist_name = artistName.innerText.trim();
      video_id = null;
      capture_date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

      songData = {
        'title' : title,
        'artist_name' : artist_name,
        'video_id' : video_id,
        'capture_date' : capture_date,
        'source_id' : source_id,
        'song_id' : song_id,
        'duplicate' : false
      };

      if(isNew.length == 1 && isNew[0].innerText == "New"){ // because innerText can also be "Re-Enter"

        songsData.push(songData);

      };
  };

  console.log(JSON.stringify(songsData, null, 4));


//
// Step 3:  Stage songsData,
//          prune unwanted songs,
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "Good 4 U",
        "artist_name": "Olivia Rodrigo",
        "video_id": null,
        "capture_date": "2021-05-27 06:43:12.199199",
        "source_id": 917,
        "song_id": 10393,
        "duplicate": true
    },
    {
        "title": "my.life",
        "artist_name": "J. Cole, 21 Savage & Morray",
        "video_id": null,
        "capture_date": "2021-05-27 06:43:12.201201",
        "source_id": 917,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "amari",
        "artist_name": "J. Cole",
        "video_id": null,
        "capture_date": "2021-05-27 06:43:12.202202",
        "source_id": 917,
        "song_id": 10384,
        "duplicate": true
    },
    {
        "title": "pride.is.the.devil",
        "artist_name": "J. Cole & Lil Baby",
        "video_id": null,
        "capture_date": "2021-05-27 06:43:12.203203",
        "source_id": 917,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "95.south",
        "artist_name": "J. Cole",
        "video_id": null,
        "capture_date": "2021-05-27 06:43:12.203203",
        "source_id": 917,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Seeing Green",
        "artist_name": "Nicki Minaj, Drake & Lil Wayne",
        "video_id": null,
        "capture_date": "2021-05-27 06:43:12.203203",
        "source_id": 917,
        "song_id": 10386,
        "duplicate": true
    },
    {
        "title": "applying.pressure",
        "artist_name": "J. Cole",
        "video_id": null,
        "capture_date": "2021-05-27 06:43:12.204204",
        "source_id": 917,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "100.mil'",
        "artist_name": "J. Cole & Bas",
        "video_id": null,
        "capture_date": "2021-05-27 06:43:12.204204",
        "source_id": 917,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "let.go.my.hand",
        "artist_name": "J. Cole, Bas & 6LACK",
        "video_id": null,
        "capture_date": "2021-05-27 06:43:12.206206",
        "source_id": 917,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "punchin'.the.clock",
        "artist_name": "J. Cole",
        "video_id": null,
        "capture_date": "2021-05-27 06:43:12.207207",
        "source_id": 917,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "hunger.on.hillside",
        "artist_name": "J. Cole & Bas",
        "video_id": null,
        "capture_date": "2021-05-27 06:43:12.210210",
        "source_id": 917,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "close",
        "artist_name": "J. Cole",
        "video_id": null,
        "capture_date": "2021-05-27 06:43:12.211211",
        "source_id": 917,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Straightenin",
        "artist_name": "Migos",
        "video_id": null,
        "capture_date": "2021-05-27 06:43:12.212212",
        "source_id": 917,
        "song_id": 10387,
        "duplicate": true
    },
    {
        "title": "Fractions",
        "artist_name": "Nicki Minaj",
        "video_id": null,
        "capture_date": "2021-05-27 06:43:12.214214",
        "source_id": 917,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Build A Bitch",
        "artist_name": "Bella Poarch",
        "video_id": null,
        "capture_date": "2021-05-27 06:43:12.215215",
        "source_id": 917,
        "song_id": 10409,
        "duplicate": true
    },
    {
        "title": "His & Hers",
        "artist_name": "Internet Money, Don Toliver & Lil Uzi Vert Featuring Gunna",
        "video_id": null,
        "capture_date": "2021-05-27 06:43:12.216216",
        "source_id": 917,
        "song_id": 10388,
        "duplicate": true
    },
    {
        "title": "White Teeth",
        "artist_name": "YoungBoy Never Broke Again",
        "video_id": null,
        "capture_date": "2021-05-27 06:43:12.217217",
        "source_id": 917,
        "song_id": 10391,
        "duplicate": true
    },
    {
        "title": "Itty Bitty Piggy",
        "artist_name": "Nicki Minaj",
        "video_id": null,
        "capture_date": "2021-05-27 06:43:12.217217",
        "source_id": 917,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Things A Man Oughta Know",
        "artist_name": "Lainey Wilson",
        "video_id": null,
        "capture_date": "2021-05-27 06:43:12.217217",
        "source_id": 917,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Crocodile Teeth",
        "artist_name": "Nicki Minaj & Skillibeng",
        "video_id": null,
        "capture_date": "2021-05-27 06:43:12.218218",
        "source_id": 917,
        "song_id": null,
        "duplicate": false
    }
]

  // Check each song for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%Up%'
    AND artist_name LIKE '%Cardi%'
  ;

  // If any changes:
  // Update var songsData = the deduplicated list above


//
// Step 4: Update nonduplicates to the song table
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
  ('my.life', 'J. Cole, 21 Savage & Morray', NULL),
  ('pride.is.the.devil', 'J. Cole & Lil Baby', NULL),
  ('95.south', 'J. Cole', NULL),
  ('applying.pressure', 'J. Cole', NULL),
  ('100.mil’', 'J. Cole & Bas', NULL),
  ('let.go.my.hand', 'J. Cole, Bas & 6LACK', NULL),
  ('punchin’.the.clock', 'J. Cole', NULL),
  ('hunger.on.hillside', 'J. Cole & Bas', NULL),
  ('close', 'J. Cole', NULL),
  ('Fractions', 'Nicki Minaj', NULL),
  ('Itty Bitty Piggy', 'Nicki Minaj', NULL),
  ('Things A Man Oughta Know', 'Lainey Wilson', NULL),
  ('Crocodile Teeth', 'Nicki Minaj & Skillibeng', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10429; // SELECT last_insert_rowid();

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
  ('2021-05-27 06:43:12.199199', '917', '10393'),
  ('2021-05-27 06:43:12.201201', '917', '10417'),
  ('2021-05-27 06:43:12.202202', '917', '10384'),
  ('2021-05-27 06:43:12.203203', '917', '10418'),
  ('2021-05-27 06:43:12.203203', '917', '10419'),
  ('2021-05-27 06:43:12.203203', '917', '10386'),
  ('2021-05-27 06:43:12.204204', '917', '10420'),
  ('2021-05-27 06:43:12.204204', '917', '10421'),
  ('2021-05-27 06:43:12.206206', '917', '10422'),
  ('2021-05-27 06:43:12.207207', '917', '10423'),
  ('2021-05-27 06:43:12.210210', '917', '10424'),
  ('2021-05-27 06:43:12.211211', '917', '10425'),
  ('2021-05-27 06:43:12.212212', '917', '10387'),
  ('2021-05-27 06:43:12.214214', '917', '10426'),
  ('2021-05-27 06:43:12.215215', '917', '10409'),
  ('2021-05-27 06:43:12.216216', '917', '10388'),
  ('2021-05-27 06:43:12.217217', '917', '10391'),
  ('2021-05-27 06:43:12.217217', '917', '10427'),
  ('2021-05-27 06:43:12.217217', '917', '10428'),
  ('2021-05-27 06:43:12.218218', '917', '10429')
  ;

  // Update to source_song table
