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
    ('Pitchfork', 'Track Reviews', NULL, '2022-11-30 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2022-11-29 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2022-11-28 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2022-11-17 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2022-11-16 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2022-11-15 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2022-11-11 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2022-11-10 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2022-11-09 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2022-11-08 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2022-11-07 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2022-11-04 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2022-11-03 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2022-11-02 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2022-11-01 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2022-10-31 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2022-10-28 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2022-10-27 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
    ('Pitchfork', 'Track Reviews', NULL, '2022-10-26 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/')
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
        "title": "Stop Worry!",
        "artist_name": "MIKE",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.297297",
        "source_id": 1442,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Help",
        "artist_name": "Rozi Plain",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.299299",
        "source_id": 1443,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Aquarius",
        "artist_name": "Subsonic Eye",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.300300",
        "source_id": 1444,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "once the reaper",
        "artist_name": "Joe Rainey",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.300300",
        "source_id": 1444,
        "song_id": 13221,
        "duplicate": true
    },
    {
        "title": "Wild Animals",
        "artist_name": "Liv.e",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.300300",
        "source_id": 1445,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Do you miss me?",
        "artist_name": "PinkPantheress",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.300300",
        "source_id": 1445,
        "song_id": 13200,
        "duplicate": true
    },
    {
        "title": "Contingency Song",
        "artist_name": "Jane Remover",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.300300",
        "source_id": 1446,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Climate and Resilience",
        "artist_name": "Egg Meat",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.300300",
        "source_id": 1446,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "De Carolina",
        "artist_name": "Rauw Alejandro",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.300300",
        "source_id": 1447,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Freedom Tap Water",
        "artist_name": "38Kea",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.300300",
        "source_id": 1447,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Nut Quick",
        "artist_name": "Glorilla",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.301301",
        "source_id": 1448,
        "song_id": 13175,
        "duplicate": true
    },
    {
        "title": "Raining Moment",
        "artist_name": "Fingergap",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.301301",
        "source_id": 1449,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Keep on Pushing These Walls",
        "artist_name": "Nadine Khouri",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.301301",
        "source_id": 1449,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "foam angel",
        "artist_name": "Ulla",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.301301",
        "source_id": 1450,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mike",
        "artist_name": "Shake Chain",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.301301",
        "source_id": 1450,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Loaded",
        "artist_name": "Tiwa SavageAsake",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.301301",
        "source_id": 1451,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mind You’re On",
        "artist_name": "Carla dal Forno",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.301301",
        "source_id": 1451,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Gold Satin Dreamer",
        "artist_name": "Nicole Dollanganger",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.301301",
        "source_id": 1452,
        "song_id": 13191,
        "duplicate": true
    },
    {
        "title": "Rich Flex",
        "artist_name": "Drake21 Savage",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.301301",
        "source_id": 1453,
        "song_id": 13146,
        "duplicate": true
    },
    {
        "title": "Casual",
        "artist_name": "Chappell Roan",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.301301",
        "source_id": 1454,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Another Bird Song",
        "artist_name": "Acre Memos",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.301301",
        "source_id": 1454,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "girlfriend",
        "artist_name": "Hemlocke Springs",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.301301",
        "source_id": 1455,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "God Is a Circle",
        "artist_name": "Yves Tumor",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.301301",
        "source_id": 1455,
        "song_id": 13125,
        "duplicate": true
    },
    {
        "title": "Follow the Cyborg",
        "artist_name": "Miss Grit",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.301301",
        "source_id": 1456,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "제 ceremony",
        "artist_name": "baehyuni",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.301301",
        "source_id": 1457,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bikini Bottom",
        "artist_name": "Ice Spice",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.301301",
        "source_id": 1458,
        "song_id": 13099,
        "duplicate": true
    },
    {
        "title": "Lift Me Up",
        "artist_name": "Rihanna",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.301301",
        "source_id": 1458,
        "song_id": 13096,
        "duplicate": true
    },
    {
        "title": "Shirt",
        "artist_name": "SZA",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.301301",
        "source_id": 1458,
        "song_id": 13097,
        "duplicate": true
    },
    {
        "title": "no fun/party",
        "artist_name": "Kara Jackson",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.302302",
        "source_id": 1459,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Do You Well",
        "artist_name": "Nakhane",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.302302",
        "source_id": 1459,
        "song_id": 13098,
        "duplicate": true
    },
    {
        "title": "Chores",
        "artist_name": "Feeble Little Horse",
        "video_id": null,
        "capture_date": "2022-11-30 04:06:36.302302",
        "source_id": 1460,
        "song_id": 13101,
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
    ('Stop Worry!', 'MIKE', NULL),
    ('Help', 'Rozi Plain', NULL),
    ('Aquarius', 'Subsonic Eye', NULL),
    ('Wild Animals', 'Liv.e', NULL),
    ('Contingency Song', 'Jane Remover', NULL),
    ('Climate and Resilience', 'Egg Meat', NULL),
    ('De Carolina', 'Rauw Alejandro', NULL),
    ('Freedom Tap Water', '38Kea', NULL),
    ('Raining Moment', 'Fingergap', NULL),
    ('Keep on Pushing These Walls', 'Nadine Khouri', NULL),
    ('foam angel', 'Ulla', NULL),
    ('Mike', 'Shake Chain', NULL),
    ('Loaded', 'Tiwa SavageAsake', NULL),
    ('Mind You’re On', 'Carla dal Forno', NULL),
    ('Casual', 'Chappell Roan', NULL),
    ('Another Bird Song', 'Acre Memos', NULL),
    ('girlfriend', 'Hemlocke Springs', NULL),
    ('Follow the Cyborg', 'Miss Grit', NULL),
    ('제 ceremony', 'baehyuni', NULL),
    ('no fun/party', 'Kara Jackson', NULL)
  ;

   // Update to song table


//
// Step 6: Add new song_ids and update all songs to the source_song table.
//

  // Get the last song_id inserted
  song_id = 13248; // SELECT last_insert_rowid();

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
    ('2022-11-30 04:06:36.297297', '1442', '13229'),
    ('2022-11-30 04:06:36.299299', '1443', '13230'),
    ('2022-11-30 04:06:36.300300', '1444', '13231'),
    ('2022-11-30 04:06:36.300300', '1444', '13221'),
    ('2022-11-30 04:06:36.300300', '1445', '13232'),
    ('2022-11-30 04:06:36.300300', '1445', '13200'),
    ('2022-11-30 04:06:36.300300', '1446', '13233'),
    ('2022-11-30 04:06:36.300300', '1446', '13234'),
    ('2022-11-30 04:06:36.300300', '1447', '13235'),
    ('2022-11-30 04:06:36.300300', '1447', '13236'),
    ('2022-11-30 04:06:36.301301', '1448', '13175'),
    ('2022-11-30 04:06:36.301301', '1449', '13237'),
    ('2022-11-30 04:06:36.301301', '1449', '13238'),
    ('2022-11-30 04:06:36.301301', '1450', '13239'),
    ('2022-11-30 04:06:36.301301', '1450', '13240'),
    ('2022-11-30 04:06:36.301301', '1451', '13241'),
    ('2022-11-30 04:06:36.301301', '1451', '13242'),
    ('2022-11-30 04:06:36.301301', '1452', '13191'),
    ('2022-11-30 04:06:36.301301', '1453', '13146'),
    ('2022-11-30 04:06:36.301301', '1454', '13243'),
    ('2022-11-30 04:06:36.301301', '1454', '13244'),
    ('2022-11-30 04:06:36.301301', '1455', '13245'),
    ('2022-11-30 04:06:36.301301', '1455', '13125'),
    ('2022-11-30 04:06:36.301301', '1456', '13246'),
    ('2022-11-30 04:06:36.301301', '1457', '13247'),
    ('2022-11-30 04:06:36.301301', '1458', '13099'),
    ('2022-11-30 04:06:36.301301', '1458', '13096'),
    ('2022-11-30 04:06:36.301301', '1458', '13097'),
    ('2022-11-30 04:06:36.302302', '1459', '13248'),
    ('2022-11-30 04:06:36.302302', '1459', '13098'),
    ('2022-11-30 04:06:36.302302', '1460', '13101')
  ;

  // Update to source_song table
