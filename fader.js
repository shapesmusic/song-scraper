// Scroll to the bottom of the page first, so all the lazyload stuff loads
// Always check the last song name to make sure everything got scraped
// If no roundup this week, manually add songs (steps at the end of this file)


//
// Step 0: Check recent scraped
//

  SELECT publication_date, instance_name FROM source WHERE parent_entity = 'The Fader' ORDER BY publication_date DESC LIMIT 8;


//
// Step 1: Scrape source data
//

  fader_no = 254 // from the chart page

  // Add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // Get and format publicationDate
  publicationDate = document.getElementsByClassName("posted")[0].innerText.trim();
  publicationDateFormatted = moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

  // Get source name info
  chartTitle = document.getElementsByTagName("h1")[0].innerText;
  parentStream = chartTitle;
  instanceName = "No. " + fader_no + " Week of " + publicationDate;

  // Get and format location
  chartLocation = window.location.href; // "location" is a reserved word

  // Build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'The Fader\', "
    + "\'" + parentStream + "\', "
    + "\'" + instanceName + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + chartLocation + "\');"
  );


  // Stage the SQL statement
  // Replace any ' in strings with ’
  // If ’ replaced, check again for duplicate

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('The Fader', '10 songs you need in your life this week', 'No. 254 Week of May 23, 2022', '2022-05-23 12:00:00.000000', 'https://www.thefader.com/2022/05/23/10-songs-you-need-in-your-life-harry-styles-mozzy-shordie-four-tet-2022');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1216; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("headline");

  songsData = [];

  for (var i=0; i<elements.length; i++){
    title = elements[i].innerText.match(/[“"](.*?)[”"]/)[1];
    artist_name = elements[i].innerText.match(/[–-—-] ([\s\S]*)$/)[1]; // still gets stuck on &nbsp;
    video_id = null
      // replace null with below to grab video IDs (when all songs are YT)
      // videoUrl[i].style.backgroundImage.match(/(?<=vi\/)(.*)(?=\/)/)[0];

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

    songsData.push(songData);

  };

  console.log(JSON.stringify(songsData, null, 4));


//
// Step 3:  Stage songsData,
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//          find and replace fe~at. with "ft."
//

  songsData =
  [
    {
        "title": "Pokke Koebês",
        "artist_name": "Free Radicals and Jitsvinger",
        "video_id": null,
        "capture_date": "2022-05-30 07:43:31.130130",
        "source_id": 1216,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Selfish Soul",
        "artist_name": "Sudan Archives",
        "video_id": null,
        "capture_date": "2022-05-30 07:43:31.138138",
        "source_id": 1216,
        "song_id": 12251,
        "duplicate": true
    },
    {
        "title": "Idk What Love Is",
        "artist_name": "Dazegxd",
        "video_id": null,
        "capture_date": "2022-05-30 07:43:31.139139",
        "source_id": 1216,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Frozen On Fire",
        "artist_name": "Madonna and Sickick",
        "video_id": null,
        "capture_date": "2022-05-30 07:43:31.139139",
        "source_id": 1216,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Radiation",
        "artist_name": "Lucy",
        "video_id": null,
        "capture_date": "2022-05-30 07:43:31.139139",
        "source_id": 1216,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Looking At Your Pager",
        "artist_name": "KH",
        "video_id": null,
        "capture_date": "2022-05-30 07:43:31.139139",
        "source_id": 1216,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "(Herman's) House",
        "artist_name": "Special Interest",
        "video_id": null,
        "capture_date": "2022-05-30 07:43:31.139139",
        "source_id": 1216,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Tell The Truth",
        "artist_name": "Mozzie and Shordie Shordie",
        "video_id": null,
        "capture_date": "2022-05-30 07:43:31.139139",
        "source_id": 1216,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Love Of My Life",
        "artist_name": "Harry Styles",
        "video_id": null,
        "capture_date": "2022-05-30 07:43:31.139139",
        "source_id": 1216,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hit It Light It Twist It",
        "artist_name": "Jim Legxacy",
        "video_id": null,
        "capture_date": "2022-05-30 07:43:31.139139",
        "source_id": 1216,
        "song_id": null,
        "duplicate": false
    }
]

  // Check each song for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%Set%'
    AND artist_name LIKE '%CJ%'
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
  ('Pokke Koebês', 'Free Radicals and Jitsvinger', NULL),
  ('Idk What Love Is', 'Dazegxd', NULL),
  ('Frozen On Fire', 'Madonna and Sickick', NULL),
  ('Radiation', 'Lucy', NULL),
  ('Looking At Your Pager', 'KH', NULL),
  ('(Herman’s) House', 'Special Interest', NULL),
  ('Tell The Truth', 'Mozzie and Shordie Shordie', NULL),
  ('Love Of My Life', 'Harry Styles', NULL),
  ('Hit It Light It Twist It', 'Jim Legxacy', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 12277; // SELECT last_insert_rowid();

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
  ('2022-05-30 07:43:31.130130', '1216', '12269'),
  ('2022-05-30 07:43:31.138138', '1216', '12251'),
  ('2022-05-30 07:43:31.139139', '1216', '12270'),
  ('2022-05-30 07:43:31.139139', '1216', '12271'),
  ('2022-05-30 07:43:31.139139', '1216', '12272'),
  ('2022-05-30 07:43:31.139139', '1216', '12273'),
  ('2022-05-30 07:43:31.139139', '1216', '12274'),
  ('2022-05-30 07:43:31.139139', '1216', '12275'),
  ('2022-05-30 07:43:31.139139', '1216', '12276'),
  ('2022-05-30 07:43:31.139139', '1216', '12277')
  ;

  // Update to source_song table


  ---
  Manual Additions

  //
  // Step 1: Fill in the source data manually
  //

    // Fill in manually:

    INSERT INTO source
      (parent_entity, parent_stream, instance_name, publication_date, location)
    VALUES
      ('The Fader',
      'Songs You Need',
      'Week of February 20, 2022', -- Mondays (for the previous week, including the publication_date)
      '2023-02-20 12:00:00.000000', -- Dont forget this!
      'https://www.thefader.com/tag/songs-you-need-in-your-life');

      // Update to source table


  //
  // Step 2: Enter source info into an array & create blank template songs
  //

    source_id = 1510; // SELECT last_insert_rowid();

    // Create a blank template song
    title = ""
    artist_name = ""
    video_id = null // if not adding video_id, set to null

    song_id = null;

    // Add moment.js to the header (make sure scripts aren't blocked in the browser)
    momentjs = document.createElement("script");
    momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
    document.head.appendChild(momentjs);

    capture_date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

    // build template songsData
    songsData =
    [
      {
          "title": title,
          "artist_name": artist_name,
          "video_id": video_id,
          "capture_date": capture_date,
          "source_id": source_id,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": title,
          "artist_name": artist_name,
          "video_id": video_id,
          "capture_date": capture_date,
          "source_id": source_id,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": title,
          "artist_name": artist_name,
          "video_id": video_id,
          "capture_date": capture_date,
          "source_id": source_id,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": title,
          "artist_name": artist_name,
          "video_id": video_id,
          "capture_date": capture_date,
          "source_id": source_id,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": title,
          "artist_name": artist_name,
          "video_id": video_id,
          "capture_date": capture_date,
          "source_id": source_id,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": title,
          "artist_name": artist_name,
          "video_id": video_id,
          "capture_date": capture_date,
          "source_id": source_id,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": title,
          "artist_name": artist_name,
          "video_id": video_id,
          "capture_date": capture_date,
          "source_id": source_id,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": title,
          "artist_name": artist_name,
          "video_id": video_id,
          "capture_date": capture_date,
          "source_id": source_id,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": title,
          "artist_name": artist_name,
          "video_id": video_id,
          "capture_date": capture_date,
          "source_id": source_id,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": title,
          "artist_name": artist_name,
          "video_id": video_id,
          "capture_date": capture_date,
          "source_id": source_id,
          "song_id": null,
          "duplicate": false
      }
  ]

    console.log(JSON.stringify(songsData, null, 4));


  //
  // Step 3: Stage songsData
  //

    // manually add titles and artists,
    // find & set any duplicate songs to true,
    // add song_ids for duplicates
    // add or remove blank songs as needed

    // the top song is the most recent song
    songsData =
    [
    {
        "title": "Circle Back Around",
        "artist_name": "Jayda G",
        "video_id": null,
        "capture_date": "2023-02-24 09:15:12.918000",
        "source_id": 1510,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Work With It",
        "artist_name": "Peezy and Yg Teck",
        "video_id": null,
        "capture_date": "2023-02-24 09:15:12.918000",
        "source_id": 1510,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Us Against The World",
        "artist_name": "Strandz and Digga D",
        "video_id": null,
        "capture_date": "2023-02-24 09:15:12.918000",
        "source_id": 1510,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Strange As Can Be",
        "artist_name": "Lucy",
        "video_id": null,
        "capture_date": "2023-02-24 09:15:12.918000",
        "source_id": 1510,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Reason You",
        "artist_name": "Rema",
        "video_id": null,
        "capture_date": "2023-02-24 09:15:12.918000",
        "source_id": 1510,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Clown",
        "artist_name": "Mega Bog",
        "video_id": null,
        "capture_date": "2023-02-24 09:15:12.918000",
        "source_id": 1510,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Titan of Hope",
        "artist_name": "MSPAINT",
        "video_id": null,
        "capture_date": "2023-02-24 09:15:12.918000",
        "source_id": 1510,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "A&W",
        "artist_name": "Lana Del Rey",
        "video_id": null,
        "capture_date": "2023-02-24 09:15:12.918000",
        "source_id": 1510,
        "song_id": 13533,
        "duplicate": true
    },
    {
        "title": "Trust Fund",
        "artist_name": "Llainwire",
        "video_id": null,
        "capture_date": "2023-02-24 09:15:12.918000",
        "source_id": 1510,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "73%",
        "artist_name": "Algiers",
        "video_id": null,
        "capture_date": "2023-02-24 09:15:12.918000",
        "source_id": 1510,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Evil Finds Light",
        "artist_name": "Drain",
        "video_id": null,
        "capture_date": "2023-02-24 09:15:12.918000",
        "source_id": 1510,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Stay Close",
        "artist_name": "Bawo",
        "video_id": null,
        "capture_date": "2023-02-24 09:15:12.918000",
        "source_id": 1510,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Femme Fatale",
        "artist_name": "gyrofield",
        "video_id": null,
        "capture_date": "2023-02-24 09:15:12.918000",
        "source_id": 1510,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Redd St. Turbulence",
        "artist_name": "Jam City ft. Julian Cashwan Pratt",
        "video_id": null,
        "capture_date": "2023-02-24 09:15:12.918000",
        "source_id": 1510,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Night Light",
        "artist_name": "yuné pinku",
        "video_id": null,
        "capture_date": "2023-02-24 09:15:12.918000",
        "source_id": 1510,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Wooden Cross",
        "artist_name": "Fooly Cooly",
        "video_id": null,
        "capture_date": "2023-02-24 09:15:12.918000",
        "source_id": 1510,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Yoga",
        "artist_name": "Asake",
        "video_id": null,
        "capture_date": "2023-02-24 09:15:12.918000",
        "source_id": 1510,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dawns",
        "artist_name": "Zach Bryan and Maggie Rogers",
        "video_id": null,
        "capture_date": "2023-02-24 09:15:12.918000",
        "source_id": 1510,
        "song_id": 13477,
        "duplicate": true
    },
    {
        "title": "Can't Move Wrong",
        "artist_name": "Luh Tyler ft. Trapland Pat",
        "video_id": null,
        "capture_date": "2023-02-24 09:15:12.918000",
        "source_id": 1510,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Over the Dune",
        "artist_name": "Steve Gunn and David Moore",
        "video_id": null,
        "capture_date": "2023-02-24 09:15:12.918000",
        "source_id": 1510,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sandrail Silhouette",
        "artist_name": "Avalon Emerson",
        "video_id": null,
        "capture_date": "2023-02-24 09:15:12.918000",
        "source_id": 1510,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Future Shaman",
        "artist_name": "Rob Mazurek",
        "video_id": null,
        "capture_date": "2023-02-24 09:15:12.918000",
        "source_id": 1510,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Town Crank",
        "artist_name": "Clark",
        "video_id": null,
        "capture_date": "2023-02-24 09:15:12.918000",
        "source_id": 1510,
        "song_id": 13456,
        "duplicate": true
    }
]

    // Check each song for duplicates in the database
    SELECT id, title, artist_name FROM song WHERE
      title LIKE '%Up%'
      AND artist_name LIKE '%Cardi%'
    ;

    // Add var songsData = the deduplicated list above


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


    // Stage the SQL statement
    // Replace any ' in strings with ’

    INSERT INTO song
      (title, artist_name, video_id)
    VALUES
    ('Circle Back Around', 'Jayda G', NULL),
    ('Work With It', 'Peezy and Yg Teck', NULL),
    ('Us Against The World', 'Strandz and Digga D', NULL),
    ('Strange As Can Be', 'Lucy', NULL),
    ('Reason You', 'Rema', NULL),
    ('The Clown', 'Mega Bog', NULL),
    ('Titan of Hope', 'MSPAINT', NULL),
    ('Trust Fund', 'Llainwire', NULL),
    ('73%', 'Algiers', NULL),
    ('Evil Finds Light', 'Drain', NULL),
    ('Stay Close', 'Bawo', NULL),
    ('Femme Fatale', 'gyrofield', NULL),
    ('Redd St. Turbulence', 'Jam City ft. Julian Cashwan Pratt', NULL),
    ('Night Light', 'yuné pinku', NULL),
    ('Wooden Cross', 'Fooly Cooly', NULL),
    ('Yoga', 'Asake', NULL),
    ('Can’t Move Wrong', 'Luh Tyler ft. Trapland Pat', NULL),
    ('Over the Dune', 'Steve Gunn and David Moore', NULL),
    ('Sandrail Silhouette', 'Avalon Emerson', NULL),
    ('Future Shaman', 'Rob Mazurek', NULL)
    ;

     // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 13565; // SELECT last_insert_rowid();

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
  ('2023-02-24 09:15:12.918000', '1510', '13546'),
  ('2023-02-24 09:15:12.918000', '1510', '13547'),
  ('2023-02-24 09:15:12.918000', '1510', '13548'),
  ('2023-02-24 09:15:12.918000', '1510', '13549'),
  ('2023-02-24 09:15:12.918000', '1510', '13550'),
  ('2023-02-24 09:15:12.918000', '1510', '13551'),
  ('2023-02-24 09:15:12.918000', '1510', '13552'),
  ('2023-02-24 09:15:12.918000', '1510', '13533'),
  ('2023-02-24 09:15:12.918000', '1510', '13553'),
  ('2023-02-24 09:15:12.918000', '1510', '13554'),
  ('2023-02-24 09:15:12.918000', '1510', '13555'),
  ('2023-02-24 09:15:12.918000', '1510', '13556'),
  ('2023-02-24 09:15:12.918000', '1510', '13557'),
  ('2023-02-24 09:15:12.918000', '1510', '13558'),
  ('2023-02-24 09:15:12.918000', '1510', '13559'),
  ('2023-02-24 09:15:12.918000', '1510', '13560'),
  ('2023-02-24 09:15:12.918000', '1510', '13561'),
  ('2023-02-24 09:15:12.918000', '1510', '13477'),
  ('2023-02-24 09:15:12.918000', '1510', '13562'),
  ('2023-02-24 09:15:12.918000', '1510', '13563'),
  ('2023-02-24 09:15:12.918000', '1510', '13564'),
  ('2023-02-24 09:15:12.918000', '1510', '13565'),
  ('2023-02-24 09:15:12.918000', '1510', '13456')
  ;

  // Update to source_song table
