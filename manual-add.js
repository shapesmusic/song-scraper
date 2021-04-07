// Manual source and song additions
// by User or from a non-recurring source
// Single song or multiple songs


//
// Step 0: Check for previous versions of the source
//

  // For user additions

  SELECT
    parent_stream, publication_date, instance_name
  FROM
    source
  WHERE
    parent_entity = 'User'
  ORDER BY
    publication_date DESC LIMIT 12;


  // For non-recurring sources: fill in new source info

  SELECT
    publication_date, parent_stream, instance_name
  FROM
    source
  WHERE
    parent_entity = 'Pitchfork'
    AND NOT parent_stream = 'Track Reviews'
    AND NOT parent_stream = 'Best New Tracks'
    OR parent_stream is NULL
  ORDER BY
    publication_date DESC LIMIT 8;


//
// Step 1: Enter source data
//

  // For User additions

  parent_entity = "User" // the entity is an individual user
  parent_stream = "davidforrest" // the username of the person adding the song
  instance_name = "My Shazams" // a description of where you found out about the song
  publication_date = "2021-04-03 00:00:00.000000" // the date of the source, otherwise, the date the song was added
  chart_location = null // URL for the instance, or if there isn't one, null


  // For non-recurring sources

  parent_entity = "Stereogum" // the entity is an individual user
  parent_stream = null // a non-recurring source usually has no parent_stream
  instance_name = "The Top 45 Singles Of 2020" // title of the source
  publication_date = "2020-12-31 00:00:00.000000" // publication date of the source
  chart_location = "https://www.popjustice.com/articles/the-top-45-singles-of-2020/" // URL for the instance, or if there isn't one, null


  // Build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location)"
    + "\nVALUES \n  (\'" + parent_entity + "\', "
    + "\'" + parent_stream + "\', "
    + "\'" + instance_name + "\', "
    + "\'" + publication_date + "\', "
    + "\'" + chart_location + "\');"
  );


  // Stage the SQL statement
  // Replace any ' in strings with ’
  // Replace 'null' with NULL

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('Stereogum', 'null', 'The Top 45 Singles Of 2020', '2020-12-31 00:00:00.000000', 'https://www.popjustice.com/articles/the-top-45-singles-of-2020/');

  // Update to source table


  //
  // Step 2: Enter song data into an array
  //

    source_id = 882; // SELECT last_insert_rowid();

    // Add info for the first song only, or a blank template song
    title = ""
    artist_name = ""
    video_id = null // if not adding video_id, set to null

    song_id = null;

    // Add moment.js to the header (make sure scripts aren't blocked in the browser)
    momentjs = document.createElement("script");
    momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
    document.head.appendChild(momentjs);

    capture_date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

    // build songsData
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
      }
  ]

    JSON.stringify(songsData, null, 4);


  //
  // Step 3: Stage songsData
  //

    // manually add any add'l songs from the same source,
    // find & set any duplicate songs to true,
    // add song_ids for duplicates
    // if any empty fields (""), set to null

    songsData =
    [
    {
      "title": "Hypnotized",
      "artist_name": "Purple Disco Machine and Sophie and the Giants",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "Physical",
      "artist_name": "Dua Lipa",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": 8686,
      "duplicate": true
    },
    {
      "title": "In Your Eyes",
      "artist_name": "The Weeknd",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": 8229,
      "duplicate": true
    },
    {
      "title": "Experience",
      "artist_name": "Victoria Monét, Khalid and SG Lewis",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "Wish You Were Sober",
      "artist_name": "Conan Gray",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "DAMN DANIEL",
      "artist_name": "Bree Runway and Yung Baby Tate",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "Dynamite",
      "artist_name": "BTS",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": 9265,
      "duplicate": true
    },
    {
      "title": "Easy",
      "artist_name": "Troye Sivan, Kacey Musgraves and Mark Ronson",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": 9703,
      "duplicate": true
    },
    {
      "title": "The Streets Where I Belong",
      "artist_name": "Annie",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "forever",
      "artist_name": "Charli XCX",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": 8771,
      "duplicate": true
    },
    {
      "title": "Casino",
      "artist_name": "Ryan Beatty",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "Savage Remix",
      "artist_name": "Megan Thee Stallion and Beyoncé",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": 8308,
      "duplicate": true
    },
    {
      "title": "Kings & Queens, Pt. 2",
      "artist_name": "Ava Max, Lauv and Saweetie",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "Somebody",
      "artist_name": "Dagny",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "I Don’t Mind",
      "artist_name": "Georgia Twinn",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "XS",
      "artist_name": "Rina Sawayama",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": 8735,
      "duplicate": true
    },
    {
      "title": "Alone In My Room (Gone)",
      "artist_name": "GRACEY",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "Midnight Sky",
      "artist_name": "Miley Cyrus",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": 9253,
      "duplicate": true
    },
    {
      "title": "Promises",
      "artist_name": "COY",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "Crush On You (Latroit & Pretty Garter remix)",
      "artist_name": "HARLOE",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "Wildflower",
      "artist_name": "5 Seconds of Summer",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "want u back",
      "artist_name": "joan",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "Malibu",
      "artist_name": "Kim Petras",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "Rare",
      "artist_name": "Selena Gomez",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": 8073,
      "duplicate": true
    },
    {
      "title": "Fever",
      "artist_name": "Dua Lipa and Angèle",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "Modern Loneliness",
      "artist_name": "Lauv",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "TASTY",
      "artist_name": "Shygirl",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "Please Don’t Touch",
      "artist_name": "RAYE",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "Savage Love (Laxed — Siren Beat)",
      "artist_name": "Jawsh 685 and Jason Derulo",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": 8914,
      "duplicate": true
    },
    {
      "title": "THE BADDEST",
      "artist_name": "K/DA, (G)I‑DLE, Wolftyla, Bea Miller and League of Legends",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "Die 4 Ur Love",
      "artist_name": "Tei Shi",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "Stunnin'",
      "artist_name": "Curtis Waters and Harm Franklin",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "Sweet Melody",
      "artist_name": "Little Mix",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "If You're Too Shy (Let Me Know)",
      "artist_name": "The 1975",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "New Me",
      "artist_name": "Ella Eyre",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "I Wanna Be A Cowboy, Baby!",
      "artist_name": "CMAT",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "Rain On Me",
      "artist_name": "Lady Gaga and Ariana Grande",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": 8873,
      "duplicate": true
    },
    {
      "title": "Mood",
      "artist_name": "24kGoldn and iann dior",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": 9007,
      "duplicate": true
    },
    {
      "title": "Something In Your Eyes",
      "artist_name": "Steps",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "Stupid Love",
      "artist_name": "Lady Gaga",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": 8721,
      "duplicate": true
    },
    {
      "title": "Do It",
      "artist_name": "Chloe x Halle",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": 9159,
      "duplicate": true
    },
    {
      "title": "She's My Religion",
      "artist_name": "Pale Waves",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "Pretty Girl Lie",
      "artist_name": "Baby Queen",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "What’s Your Pleasure?",
      "artist_name": "Jessie Ware",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
      "song_id": null,
      "duplicate": false
    },
    {
      "title": "dependent",
      "artist_name": "Mae Muller",
      "video_id": null,
      "capture_date": "2021-04-06 07:22:53.251251",
      "source_id": 882,
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
        + "\'" + songsData[i].video_id + "\')"
      );

      if (songsData[i].duplicate == false){
        songs.push(song);
      }
    }
    console.log(String(songs));


    // Stage the SQL statement
    // Replace any ' in strings with ’
    // Replace any 'null' with NULL

    INSERT INTO song
      (title, artist_name, video_id)
    VALUES
      ('Hypnotized', 'Purple Disco Machine and Sophie and the Giants', 'null'),
      ('Experience', 'Victoria Monét, Khalid and SG Lewis', 'null'),
      ('Wish You Were Sober', 'Conan Gray', 'null'),
      ('DAMN DANIEL', 'Bree Runway and Yung Baby Tate', 'null'),
      ('The Streets Where I Belong', 'Annie', 'null'),
      ('Casino', 'Ryan Beatty', 'null'),
      ('Kings & Queens, Pt. 2', 'Ava Max, Lauv and Saweetie', 'null'),
      ('Somebody', 'Dagny', 'null'),
      ('I Don’t Mind', 'Georgia Twinn', 'null'),
      ('Alone In My Room (Gone)', 'GRACEY', 'null'),
      ('Promises', 'COY', 'null'),
      ('Crush On You (Latroit & Pretty Garter remix)', 'HARLOE', 'null'),
      ('Wildflower', '5 Seconds of Summer', 'null'),
      ('want u back', 'joan', 'null'),
      ('Malibu', 'Kim Petras', 'null'),
      ('Fever', 'Dua Lipa and Angèle', 'null'),
      ('Modern Loneliness', 'Lauv', 'null'),
      ('TASTY', 'Shygirl', 'null'),
      ('Please Don’t Touch', 'RAYE', 'null'),
      ('THE BADDEST', 'K/DA, (G)I‑DLE, Wolftyla, Bea Miller and League of Legends', 'null'),
      ('Die 4 Ur Love', 'Tei Shi', 'null'),
      ('Stunnin’', 'Curtis Waters and Harm Franklin', 'null'),
      ('Sweet Melody', 'Little Mix', 'null'),
      ('If You’re Too Shy (Let Me Know)', 'The 1975', 'null'),
      ('New Me', 'Ella Eyre', 'null'),
      ('I Wanna Be A Cowboy, Baby!', 'CMAT', 'null'),
      ('Something In Your Eyes', 'Steps', 'null'),
      ('She’s My Religion', 'Pale Waves', 'null'),
      ('Pretty Girl Lie', 'Baby Queen', 'null'),
      ('What’s Your Pleasure?', 'Jessie Ware', 'null'),
      ('dependent', 'Mae Muller', 'null')
    ;

     // Update to song table


   //
   // Step 5: Add new song_ids and update all songs to the source_song table.
   //

    // Get the last song_id inserted
    song_id = 10182; // SELECT last_insert_rowid();

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
    ('2021-04-06 07:22:53.251251', '882', '10152'),
    ('2021-04-06 07:22:53.251251', '882', '8686'),
    ('2021-04-06 07:22:53.251251', '882', '8229'),
    ('2021-04-06 07:22:53.251251', '882', '10153'),
    ('2021-04-06 07:22:53.251251', '882', '10154'),
    ('2021-04-06 07:22:53.251251', '882', '10155'),
    ('2021-04-06 07:22:53.251251', '882', '9265'),
    ('2021-04-06 07:22:53.251251', '882', '9703'),
    ('2021-04-06 07:22:53.251251', '882', '10156'),
    ('2021-04-06 07:22:53.251251', '882', '8771'),
    ('2021-04-06 07:22:53.251251', '882', '10157'),
    ('2021-04-06 07:22:53.251251', '882', '8308'),
    ('2021-04-06 07:22:53.251251', '882', '10158'),
    ('2021-04-06 07:22:53.251251', '882', '10159'),
    ('2021-04-06 07:22:53.251251', '882', '10160'),
    ('2021-04-06 07:22:53.251251', '882', '8735'),
    ('2021-04-06 07:22:53.251251', '882', '10161'),
    ('2021-04-06 07:22:53.251251', '882', '9253'),
    ('2021-04-06 07:22:53.251251', '882', '10162'),
    ('2021-04-06 07:22:53.251251', '882', '10163'),
    ('2021-04-06 07:22:53.251251', '882', '10164'),
    ('2021-04-06 07:22:53.251251', '882', '10165'),
    ('2021-04-06 07:22:53.251251', '882', '10166'),
    ('2021-04-06 07:22:53.251251', '882', '8073'),
    ('2021-04-06 07:22:53.251251', '882', '10167'),
    ('2021-04-06 07:22:53.251251', '882', '10168'),
    ('2021-04-06 07:22:53.251251', '882', '10169'),
    ('2021-04-06 07:22:53.251251', '882', '10170'),
    ('2021-04-06 07:22:53.251251', '882', '8914'),
    ('2021-04-06 07:22:53.251251', '882', '10171'),
    ('2021-04-06 07:22:53.251251', '882', '10172'),
    ('2021-04-06 07:22:53.251251', '882', '10173'),
    ('2021-04-06 07:22:53.251251', '882', '10174'),
    ('2021-04-06 07:22:53.251251', '882', '10175'),
    ('2021-04-06 07:22:53.251251', '882', '10176'),
    ('2021-04-06 07:22:53.251251', '882', '10177'),
    ('2021-04-06 07:22:53.251251', '882', '8873'),
    ('2021-04-06 07:22:53.251251', '882', '9007'),
    ('2021-04-06 07:22:53.251251', '882', '10178'),
    ('2021-04-06 07:22:53.251251', '882', '8721'),
    ('2021-04-06 07:22:53.251251', '882', '9159'),
    ('2021-04-06 07:22:53.251251', '882', '10179'),
    ('2021-04-06 07:22:53.251251', '882', '10180'),
    ('2021-04-06 07:22:53.251251', '882', '10181'),
    ('2021-04-06 07:22:53.251251', '882', '10182')
    ;

    // Update to source_song table
