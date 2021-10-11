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
    ('Billboard', 'The Hot 100', 'Week of August 7, 2021', '2021-08-07 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2021-08-07/2021-08-07');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 948; // SELECT last_insert_rowid();
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
          "title": "Industry Baby",
          "artist_name": "Lil Nas X & Jack Harlow",
          "video_id": null,
          "capture_date": "2021-10-11 08:47:55.017017",
          "source_id": 948,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "If I Didn't Love You",
          "artist_name": "Jason Aldean & Carrie Underwood",
          "video_id": null,
          "capture_date": "2021-10-11 08:47:55.018018",
          "source_id": 948,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Not Sober",
          "artist_name": "The Kid LAROI ft. Polo G & Stunna Gambino",
          "video_id": null,
          "capture_date": "2021-10-11 08:47:55.019019",
          "source_id": 948,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Don't Go Yet",
          "artist_name": "Camila Cabello",
          "video_id": null,
          "capture_date": "2021-10-11 08:47:55.019019",
          "source_id": 948,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Over The Top",
          "artist_name": "Smiley ft. Drake",
          "video_id": null,
          "capture_date": "2021-10-11 08:47:55.020020",
          "source_id": 948,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Pepas",
          "artist_name": "Farruko",
          "video_id": null,
          "capture_date": "2021-10-11 08:47:55.020020",
          "source_id": 948,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Better Believe",
          "artist_name": "Belly, The Weeknd & Young Thug",
          "video_id": null,
          "capture_date": "2021-10-11 08:47:55.020020",
          "source_id": 948,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Lick Back",
          "artist_name": "EST Gee",
          "video_id": null,
          "capture_date": "2021-10-11 08:47:55.021021",
          "source_id": 948,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Memory I Don't Mess With",
          "artist_name": "Lee Brice",
          "video_id": null,
          "capture_date": "2021-10-11 08:47:55.021021",
          "source_id": 948,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "5500 Degrees",
          "artist_name": "EST Gee ft. Lil Baby, 42 Dugg & Rylo Rodriguez",
          "video_id": null,
          "capture_date": "2021-10-11 08:47:55.021021",
          "source_id": 948,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Still Chose You",
          "artist_name": "The Kid LAROI ft. Mustard",
          "video_id": null,
          "capture_date": "2021-10-11 08:47:55.021021",
          "source_id": 948,
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
  ('Industry Baby', 'Lil Nas X & Jack Harlow', NULL),
  ('If I Didn’t Love You', 'Jason Aldean & Carrie Underwood', NULL),
  ('Not Sober', 'The Kid LAROI ft. Polo G & Stunna Gambino', NULL),
  ('Don’t Go Yet', 'Camila Cabello', NULL),
  ('Over The Top', 'Smiley ft. Drake', NULL),
  ('Pepas', 'Farruko', NULL),
  ('Better Believe', 'Belly, The Weeknd & Young Thug', NULL),
  ('Lick Back', 'EST Gee', NULL),
  ('Memory I Don’t Mess With', 'Lee Brice', NULL),
  ('5500 Degrees', 'EST Gee ft. Lil Baby, 42 Dugg & Rylo Rodriguez', NULL),
  ('Still Chose You', 'The Kid LAROI ft. Mustard', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10688; // SELECT last_insert_rowid();

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
  ('2021-10-11 08:47:55.017017', '948', '10678'),
  ('2021-10-11 08:47:55.018018', '948', '10679'),
  ('2021-10-11 08:47:55.019019', '948', '10680'),
  ('2021-10-11 08:47:55.019019', '948', '10681'),
  ('2021-10-11 08:47:55.020020', '948', '10682'),
  ('2021-10-11 08:47:55.020020', '948', '10683'),
  ('2021-10-11 08:47:55.020020', '948', '10684'),
  ('2021-10-11 08:47:55.021021', '948', '10685'),
  ('2021-10-11 08:47:55.021021', '948', '10686'),
  ('2021-10-11 08:47:55.021021', '948', '10687'),
  ('2021-10-11 08:47:55.021021', '948', '10688')
  ;

  // Update to source_song table
