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
      'Week of April 17, 2022', -- Mondays (for the previous week, including the publication_date)
      '2023-04-17 12:00:00.000000', -- Dont forget this!
      'https://www.thefader.com/tag/songs-you-need-in-your-life');

      // Update to source table


  //
  // Step 2: Enter source info into an array & create blank template songs
  //

    source_id = 1569; // SELECT last_insert_rowid();

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
        "title": "Get Busy With It",
        "artist_name": "Conducta and MC Novelist",
        "video_id": null,
        "capture_date": "2023-04-22 08:34:07.080000",
        "source_id": 1569,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Elsewhere",
        "artist_name": "Hayden Pedigo",
        "video_id": null,
        "capture_date": "2023-04-22 08:34:07.080000",
        "source_id": 1569,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Back In Office",
        "artist_name": "Saba and No I.D.",
        "video_id": null,
        "capture_date": "2023-04-22 08:34:07.080000",
        "source_id": 1569,
        "song_id": 14099,
        "duplicate": true
    },
    {
        "title": "Modus Operandi",
        "artist_name": "Juan Wauters and Frankie Cosmos",
        "video_id": null,
        "capture_date": "2023-04-22 08:34:07.080000",
        "source_id": 1569,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Paraclete Bhishajyai",
        "artist_name": "Fire-Toolz",
        "video_id": null,
        "capture_date": "2023-04-22 08:34:07.080000",
        "source_id": 1569,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "One Touch",
        "artist_name": "Bambii",
        "video_id": null,
        "capture_date": "2023-04-22 08:34:07.080000",
        "source_id": 1569,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "FKA MESS",
        "artist_name": "Abra",
        "video_id": null,
        "capture_date": "2023-04-22 08:34:07.080000",
        "source_id": 1569,
        "song_id": 14041,
        "duplicate": true
    },
    {
        "title": "Dog Dreams",
        "artist_name": "Lucy Liyou",
        "video_id": null,
        "capture_date": "2023-04-22 08:34:07.080000",
        "source_id": 1569,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hollow Head",
        "artist_name": "GracieHorse",
        "video_id": null,
        "capture_date": "2023-04-22 08:34:07.080000",
        "source_id": 1569,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Phone Me",
        "artist_name": "MAY",
        "video_id": null,
        "capture_date": "2023-04-22 08:34:07.080000",
        "source_id": 1569,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Oklahoma Baby",
        "artist_name": "Emile Mosseri",
        "video_id": null,
        "capture_date": "2023-04-22 08:34:07.080000",
        "source_id": 1569,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "uHhH HuH.mp3",
        "artist_name": "Tisakorean",
        "video_id": null,
        "capture_date": "2023-04-22 08:34:07.080000",
        "source_id": 1569,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Get Down",
        "artist_name": "DJ Girl",
        "video_id": null,
        "capture_date": "2023-04-22 08:34:07.080000",
        "source_id": 1569,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cut",
        "artist_name": "Chat Pile",
        "video_id": null,
        "capture_date": "2023-04-22 08:34:07.080000",
        "source_id": 1569,
        "song_id": 14056,
        "duplicate": true
    },
    {
        "title": "Something Other Than Years",
        "artist_name": "Lucinda Chua ft. yeule",
        "video_id": null,
        "capture_date": "2023-04-22 08:34:07.080000",
        "source_id": 1569,
        "song_id": 14019,
        "duplicate": true
    },
    {
        "title": "night n day",
        "artist_name": "NEW YORK",
        "video_id": null,
        "capture_date": "2023-04-22 08:34:07.080000",
        "source_id": 1569,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dumbest Girl Alive",
        "artist_name": "100 gecs",
        "video_id": null,
        "capture_date": "2023-04-22 08:34:07.080000",
        "source_id": 1569,
        "song_id": 13701,
        "duplicate": true
    },
    {
        "title": "No Effort to Exist",
        "artist_name": "Bernice",
        "video_id": null,
        "capture_date": "2023-04-22 08:34:07.080000",
        "source_id": 1569,
        "song_id": null,
        "duplicate": false
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
    ('Get Busy With It', 'Conducta and MC Novelist', NULL),
    ('Elsewhere', 'Hayden Pedigo', NULL),
    ('Modus Operandi', 'Juan Wauters and Frankie Cosmos', NULL),
    ('Paraclete Bhishajyai', 'Fire-Toolz', NULL),
    ('One Touch', 'Bambii', NULL),
    ('Dog Dreams', 'Lucy Liyou', NULL),
    ('Hollow Head', 'GracieHorse', NULL),
    ('Phone Me', 'MAY', NULL),
    ('Oklahoma Baby', 'Emile Mosseri', NULL),
    ('uHhH HuH.mp3', 'Tisakorean', NULL),
    ('Get Down', 'DJ Girl', NULL),
    ('night n day', 'NEW YORK', NULL),
    ('No Effort to Exist', 'Bernice', NULL)
    ;

     // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 14112; // SELECT last_insert_rowid();

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
  ('2023-04-22 08:34:07.080000', '1569', '14100'),
  ('2023-04-22 08:34:07.080000', '1569', '14101'),
  ('2023-04-22 08:34:07.080000', '1569', '14099'),
  ('2023-04-22 08:34:07.080000', '1569', '14102'),
  ('2023-04-22 08:34:07.080000', '1569', '14103'),
  ('2023-04-22 08:34:07.080000', '1569', '14104'),
  ('2023-04-22 08:34:07.080000', '1569', '14041'),
  ('2023-04-22 08:34:07.080000', '1569', '14105'),
  ('2023-04-22 08:34:07.080000', '1569', '14106'),
  ('2023-04-22 08:34:07.080000', '1569', '14107'),
  ('2023-04-22 08:34:07.080000', '1569', '14108'),
  ('2023-04-22 08:34:07.080000', '1569', '14109'),
  ('2023-04-22 08:34:07.080000', '1569', '14110'),
  ('2023-04-22 08:34:07.080000', '1569', '14056'),
  ('2023-04-22 08:34:07.080000', '1569', '14019'),
  ('2023-04-22 08:34:07.080000', '1569', '14111'),
  ('2023-04-22 08:34:07.080000', '1569', '13701'),
  ('2023-04-22 08:34:07.080000', '1569', '14112')
  ;

  // Update to source_song table
