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
  ORDER BY
    publication_date DESC LIMIT 8;


//
// Step 1: Enter source data
//

  // For User additions

  parent_entity = "User" // the entity is an individual user
  parent_stream = "davidforrest" // the username of the person adding the song
  instance_name = "heard it on the radio and realized how great it is" // a description of where you found out about the song
  publication_date = "2021-03-04 00:00:00.000000" // the date of the source, otherwise, the date the song was added
  chart_location = null // URL for the instance, or if there isn't one, null


  // For non-recurring sources

  parent_entity = "Pitchfork" // the entity is an individual user
  parent_stream = null // a non-recurring source usually has no parent_stream
  instance_name = "The 7 Best Music Videos of February 2021" // title of the source
  publication_date = "2021-03-02 00:00:00.000000" // publication date of the source
  chart_location = "https://pitchfork.com/thepitch/best-music-videos-of-february-2021/" // URL for the instance, or if there isn't one, null


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
    ('Pitchfork', NULL, 'The 7 Best Music Videos of February 2021', '2021-03-02 00:00:00.000000', 'https://pitchfork.com/thepitch/best-music-videos-of-february-2021/');

  // Update to source table


  //
  // Step 2: Enter song data into an array
  //

    source_id = 847; // SELECT last_insert_rowid();

    // Add info for the first song only
    title = "Tweety"
    artist_name = "Raveena"
    video_id = "U4t37sXE_N0" // if not adding video_id, set to null

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
            "title": "Tweety",
            "artist_name": "Raveena",
            "video_id": "U4t37sXE_N0",
            "capture_date": "2021-03-12 09:05:08.554554",
            "source_id": 847,
            "song_id": null,
            "duplicate": false
        },
        {
            "title": "Cry Baby",
            "artist_name": "Megan Thee Stallion ft. DaBaby",
            "video_id": null,
            "capture_date": "2021-03-12 09:05:08.554554",
            "source_id": 847,
            "song_id": 9601,
            "duplicate": true
        },
        {
            "title": "Ungodly Hour",
            "artist_name": "Chloe x Halle",
            "video_id": null,
            "capture_date": "2021-03-12 09:05:08.554554",
            "source_id": 847,
            "song_id": null,
            "duplicate": false
        },
        {
            "title": "F.U.C.K.",
            "artist_name": "Victoria Monét",
            "video_id": null,
            "capture_date": "2021-03-12 09:05:08.554554",
            "source_id": 847,
            "song_id": null,
            "duplicate": false
        },
        {
            "title": "Up",
            "artist_name": "Cardi B",
            "video_id": null,
            "capture_date": "2021-03-12 09:05:08.554554",
            "source_id": 847,
            "song_id": 9774,
            "duplicate": true
        },
        {
            "title": "KIM",
            "artist_name": "Tkay Maidza ft. Yung Baby Tate",
            "video_id": null,
            "capture_date": "2021-03-12 09:05:08.554554",
            "source_id": 847,
            "song_id": null,
            "duplicate": false
        },
        {
            "title": "AGUA",
            "artist_name": "Bomba Estéreo",
            "video_id": null,
            "capture_date": "2021-03-12 09:05:08.554554",
            "source_id": 847,
            "song_id": 9885,
            "duplicate": true
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
    ('Tweety', 'Raveena', 'U4t37sXE_N0'),
    ('Ungodly Hour', 'Chloe x Halle', NULL),
    ('F.U.C.K.', 'Victoria Monét', NULL),
    ('KIM', 'Tkay Maidza ft. Yung Baby Tate', NULL)
    ;

     // Update to song table


   //
   // Step 5: Add new song_ids and update all songs to the source_song table.
   //

    // Get the last song_id inserted
    song_id = 9987; // SELECT last_insert_rowid();

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
    ('2021-03-12 09:05:08.554554', '847', '9984'),
    ('2021-03-12 09:05:08.554554', '847', '9601'),
    ('2021-03-12 09:05:08.554554', '847', '9985'),
    ('2021-03-12 09:05:08.554554', '847', '9986'),
    ('2021-03-12 09:05:08.554554', '847', '9774'),
    ('2021-03-12 09:05:08.554554', '847', '9987'),
    ('2021-03-12 09:05:08.554554', '847', '9885')
    ;

    // Update to source_song table
