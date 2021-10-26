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
    ('Billboard', 'The Hot 100', 'Week of October 30, 2021', '2021-10-30 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2021-10-30');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1051; // SELECT last_insert_rowid();
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
//          find and replace "Featur~ing" with "ft."
//

  songsData =
  [
      {
          "title": "Bubbly",
          "artist_name": "Young Thug With Drake & Travis Scott",
          "video_id": null,
          "capture_date": "2021-10-26 01:34:31.828828",
          "source_id": 1051,
          "song_id": 11124,
          "duplicate": true
      },
      {
          "title": "Pissed Me Off",
          "artist_name": "Lil Durk",
          "video_id": null,
          "capture_date": "2021-10-26 01:34:31.829829",
          "source_id": 1051,
          "song_id": 11125,
          "duplicate": true
      },
      {
          "title": "Lets Go Brandon",
          "artist_name": "Loza Alexander",
          "video_id": null,
          "capture_date": "2021-10-26 01:34:31.829829",
          "source_id": 1051,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Ex For A Reason",
          "artist_name": "Summer Walker & JT",
          "video_id": null,
          "capture_date": "2021-10-26 01:34:31.830830",
          "source_id": 1051,
          "song_id": 11126,
          "duplicate": true
      },
      {
          "title": "Better Days",
          "artist_name": "NEIKED X Mae Muller X Polo G",
          "video_id": null,
          "capture_date": "2021-10-26 01:34:31.830830",
          "source_id": 1051,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Livin It Up",
          "artist_name": "Young Thug With Post Malone & A$AP Rocky",
          "video_id": null,
          "capture_date": "2021-10-26 01:34:31.831831",
          "source_id": 1051,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Stressed",
          "artist_name": "Young Thug With J. Cole & T-Shyne",
          "video_id": null,
          "capture_date": "2021-10-26 01:34:31.831831",
          "source_id": 1051,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Rich N***a Shit",
          "artist_name": "Young Thug With Juice WRLD",
          "video_id": null,
          "capture_date": "2021-10-26 01:34:31.831831",
          "source_id": 1051,
          "song_id": 9372,
          "duplicate": true
      },
      {
          "title": "Let Somebody Go",
          "artist_name": "Coldplay X Selena Gomez",
          "video_id": null,
          "capture_date": "2021-10-26 01:34:31.832832",
          "source_id": 1051,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Ya Superame (En Vivo Desde Culiacan, Sinaloa)",
          "artist_name": "Grupo Firme",
          "video_id": null,
          "capture_date": "2021-10-26 01:34:31.832832",
          "source_id": 1051,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Peepin Out The Window",
          "artist_name": "Young Thug With Future & BSlime",
          "video_id": null,
          "capture_date": "2021-10-26 01:34:31.832832",
          "source_id": 1051,
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
  ('Lets Go Brandon', 'Loza Alexander', NULL),
  ('Better Days', 'NEIKED X Mae Muller X Polo G', NULL),
  ('Livin It Up', 'Young Thug With Post Malone & A$AP Rocky', NULL),
  ('Stressed', 'Young Thug With J. Cole & T-Shyne', NULL),
  ('Let Somebody Go', 'Coldplay X Selena Gomez', NULL),
  ('Ya Superame (En Vivo Desde Culiacan, Sinaloa)', 'Grupo Firme', NULL),
  ('Peepin Out The Window', 'Young Thug With Future & BSlime', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11145; // SELECT last_insert_rowid();

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
  ('2021-10-26 01:34:31.828828', '1051', '11124'),
  ('2021-10-26 01:34:31.829829', '1051', '11125'),
  ('2021-10-26 01:34:31.829829', '1051', '11139'),
  ('2021-10-26 01:34:31.830830', '1051', '11126'),
  ('2021-10-26 01:34:31.830830', '1051', '11140'),
  ('2021-10-26 01:34:31.831831', '1051', '11141'),
  ('2021-10-26 01:34:31.831831', '1051', '11142'),
  ('2021-10-26 01:34:31.831831', '1051', '9372'),
  ('2021-10-26 01:34:31.832832', '1051', '11143'),
  ('2021-10-26 01:34:31.832832', '1051', '11144'),
  ('2021-10-26 01:34:31.832832', '1051', '11145')
  ;

  // Update to source_song table
