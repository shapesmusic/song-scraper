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
  )


  // Stage the SQL statement
  // Replace any ' in strings with ’

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('Billboard', 'The Hot 100', 'Week of May 8, 2021', '2021-05-08 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2021-05-08');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 904; // SELECT last_insert_rowid();
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
        "title": "Shottas (Lala)",
        "artist_name": "Moneybagg Yo",
        "video_id": null,
        "capture_date": "2021-05-07 05:50:37.430430",
        "source_id": 904,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "If Pain Was A Person",
        "artist_name": "Moneybagg Yo",
        "video_id": null,
        "capture_date": "2021-05-07 05:50:37.431431",
        "source_id": 904,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Wockesha",
        "artist_name": "Moneybagg Yo",
        "video_id": null,
        "capture_date": "2021-05-07 05:50:37.431431",
        "source_id": 904,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Botella Tras Botella",
        "artist_name": "Gera MX + Christian Nodal",
        "video_id": null,
        "capture_date": "2021-05-07 05:50:37.431431",
        "source_id": 904,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Come Through",
        "artist_name": "H.E.R. Featuring Chris Brown",
        "video_id": null,
        "capture_date": "2021-05-07 05:50:37.431431",
        "source_id": 904,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Free Promo",
        "artist_name": "Moneybagg Yo Featuring Polo G & Lil Durk",
        "video_id": null,
        "capture_date": "2021-05-07 05:50:37.431431",
        "source_id": 904,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Just Say Det",
        "artist_name": "Moneybagg Yo",
        "video_id": null,
        "capture_date": "2021-05-07 05:50:37.432432",
        "source_id": 904,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Blame It On You",
        "artist_name": "Jason Aldean",
        "video_id": null,
        "capture_date": "2021-05-07 05:50:37.432432",
        "source_id": 904,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Way Less Sad",
        "artist_name": "AJR",
        "video_id": null,
        "capture_date": "2021-05-07 05:50:37.432432",
        "source_id": 904,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Clear Da Air",
        "artist_name": "Moneybagg Yo",
        "video_id": null,
        "capture_date": "2021-05-07 05:50:37.432432",
        "source_id": 904,
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
  ('Shottas (Lala)', 'Moneybagg Yo', NULL),
  ('If Pain Was A Person', 'Moneybagg Yo', NULL),
  ('Wockesha', 'Moneybagg Yo', NULL),
  ('Botella Tras Botella', 'Gera MX + Christian Nodal', NULL),
  ('Come Through', 'H.E.R. Featuring Chris Brown', NULL),
  ('Free Promo', 'Moneybagg Yo Featuring Polo G & Lil Durk', NULL),
  ('Just Say Det', 'Moneybagg Yo', NULL),
  ('Blame It On You', 'Jason Aldean', NULL),
  ('Way Less Sad', 'AJR', NULL),
  ('Clear Da Air', 'Moneybagg Yo', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10306; // SELECT last_insert_rowid();

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
  ('2021-05-07 05:50:37.430430', '904', '10297'),
  ('2021-05-07 05:50:37.431431', '904', '10298'),
  ('2021-05-07 05:50:37.431431', '904', '10299'),
  ('2021-05-07 05:50:37.431431', '904', '10300'),
  ('2021-05-07 05:50:37.431431', '904', '10301'),
  ('2021-05-07 05:50:37.431431', '904', '10302'),
  ('2021-05-07 05:50:37.432432', '904', '10303'),
  ('2021-05-07 05:50:37.432432', '904', '10304'),
  ('2021-05-07 05:50:37.432432', '904', '10305'),
  ('2021-05-07 05:50:37.432432', '904', '10306')
  ;

  // Update to source_song table
