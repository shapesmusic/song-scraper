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

  parent_entity = "Pitchfork" // the entity is an individual user
  parent_stream = null // a non-recurring source usually has no parent_stream
  instance_name = "The 7 Best Music Videos of March 2021" // title of the source
  publication_date = "2021-04-01 00:00:00.000000" // publication date of the source
  chart_location = "https://pitchfork.com/thepitch/the-7-best-music-videos-of-march-2021/" // URL for the instance, or if there isn't one, null


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
    ('User', 'davidforrest', 'My Shazams', '2020-11-10 00:00:00.000000', NULL);

  // Update to source table


  //
  // Step 2: Enter song data into an array
  //

    source_id = 865; // SELECT last_insert_rowid();

    // Add info for the first song only
    title = "Be Sweet"
    artist_name = "Japanese Breakfast"
    video_id = "2ZfcZEIo6Bw" // if not adding video_id, set to null

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
        "title": "Put Your Records On",
        "artist_name": "Ritt Momney",
        "video_id": null,
        "capture_date": "2021-04-03 00:00:00.000000",
        "source_id": 866,
        "song_id": 9348,
        "duplicate": true
      },{
        "title": "Without Me",
        "artist_name": "Halsey",
        "video_id": null,
        "capture_date": "2021-02-07 00:00:00.000000",
        "source_id": 867,
        "song_id": 1371,
        "duplicate": true
      },{
        "title": "34+35",
        "artist_name": "Ariana Grande",
        "video_id": null,
        "capture_date": "2021-02-05 00:00:00.000000",
        "source_id": 868,
        "song_id": 9524,
        "duplicate": true
      },{
        "title": "Holy",
        "artist_name": "Justin Bieber ft. Chance the Rapper",
        "video_id": null,
        "capture_date": "2021-02-05 00:00:00.000000",
        "source_id": 868,
        "song_id": 9301,
        "duplicate": true
      },{
        "title": "What You Know Bout Love",
        "artist_name": "Pop Smoke",
        "video_id": null,
        "capture_date": "2021-02-05 00:00:00.000000",
        "source_id": 868,
        "song_id": 8943,
        "duplicate": true
      },{
        "title": "Disorder",
        "artist_name": "Joy Division",
        "video_id": "fhCLalLXHP4",
        "capture_date": "2021-01-21 00:00:00.000000",
        "source_id": 869,
        "song_id": null,
        "duplicate": false
      },{
        "title": "Amber",
        "artist_name": "311",
        "video_id": "SUFSB2plwzM",
        "capture_date": "2021-01-19 00:00:00.000000",
        "source_id": 870,
        "song_id": null,
        "duplicate": false
      },{
        "title": "Minnesota, WI",
        "artist_name": "Bon Iver",
        "video_id": "gt8gG9iEjpM",
        "capture_date": "2020-12-17 00:00:00.000000",
        "source_id": 871,
        "song_id": null,
        "duplicate": false
      },{
        "title": "My Possession",
        "artist_name": "Dirty Projectors",
        "video_id": "aR20j39ja4k",
        "capture_date": "2020-11-28 00:00:00.000000",
        "source_id": 872,
        "song_id": null,
        "duplicate": false
      },{
        "title": "Mercedes Boy",
        "artist_name": "Pebbles",
        "video_id": "lQS0t5Hdc6M",
        "capture_date": "2020-11-28 00:00:00.000000",
        "source_id": 872,
        "song_id": null,
        "duplicate": false
      },{
        "title": "Leave Me Alone",
        "artist_name": "Flipp Dinero",
        "video_id": null,
        "capture_date": "2020-11-14 00:00:00.000000",
        "source_id": 873,
        "song_id": 1327,
        "duplicate": true
      },{
        "title": "On Your Marks",
        "artist_name": "Bonobo",
        "video_id": "bGGb9kumcv8",
        "capture_date": "2020-11-10 00:00:00.000000",
        "source_id": 874,
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
      ('Disorder', 'Joy Division', 'fhCLalLXHP4'),
      ('Amber', '311', 'SUFSB2plwzM'),
      ('Minnesota, WI', 'Bon Iver', 'gt8gG9iEjpM'),
      ('My Possession', 'Dirty Projectors', 'aR20j39ja4k'),
      ('Mercedes Boy', 'Pebbles', 'lQS0t5Hdc6M'),
      ('On Your Marks', 'Bonobo', 'bGGb9kumcv8')
    ;

     // Update to song table


   //
   // Step 5: Add new song_ids and update all songs to the source_song table.
   //

    // Get the last song_id inserted
    song_id = 10103; // SELECT last_insert_rowid();

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
      ('2021-04-03 00:00:00.000000', '866', '9348'),
      ('2021-02-07 00:00:00.000000', '867', '1371'),
      ('2021-02-05 00:00:00.000000', '868', '9524'),
      ('2021-02-05 00:00:00.000000', '868', '9301'),
      ('2021-02-05 00:00:00.000000', '868', '8943'),
      ('2021-01-21 00:00:00.000000', '869', '10098'),
      ('2021-01-19 00:00:00.000000', '870', '10099'),
      ('2020-12-17 00:00:00.000000', '871', '10100'),
      ('2020-11-28 00:00:00.000000', '872', '10101'),
      ('2020-11-28 00:00:00.000000', '872', '10102'),
      ('2020-11-14 00:00:00.000000', '873', '1327'),
      ('2020-11-10 00:00:00.000000', '874', '10103')
    ;

    // Update to source_song table
