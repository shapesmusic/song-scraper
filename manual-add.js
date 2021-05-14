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

  // Copy into the console:

  // For User additions

  parent_entity = "User" // the entity is an individual user
  parent_stream = "davidforrest" // the username of the person adding the song
  instance_name = "My Shazams" // a description of where you found out about the song
  publication_date = "2021-04-11 19:15:00.000000" // the date of the source, otherwise, the date the song was added
  chart_location = null // URL for the instance, or if there isn't one, null


  // For non-recurring sources

  parent_entity = "Popjustice" // the entity is an individual user
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
    ('User', 'davidforrest', 'My Shazams', '2021-04-11 19:15:00.000000', 'null');

  // Update to source table


  //
  // Step 2: Enter song data into an array
  //

    source_id = 908; // SELECT last_insert_rowid();

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

    console.log(JSON.stringify(songsData, null, 4));


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
            "title": "B.S.",
            "artist_name": "Jhené Aiko ft. H.E.R.",
            "video_id": null,
            "capture_date": "2021-05-13 08:41:44.470470",
            "source_id": 908,
            "song_id": 376,
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
    ('2021-05-13 08:41:44.470470', '908', '376')
    ;

    // Update to source_song table
