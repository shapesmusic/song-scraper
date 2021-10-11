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
    ('Billboard', 'The Hot 100', 'Week of September 4, 2021', '2021-09-04 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2021-09-04/2021-09-04');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 952; // SELECT last_insert_rowid();
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
//          find and replace "Featured" with "ft."
//

  songsData =
  [
      {
          "title": "Summer Of Love",
          "artist_name": "Shawn Mendes & Tainy",
          "video_id": null,
          "capture_date": "2021-10-11 11:00:22.499499",
          "source_id": 952,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Matt Hardy 999",
          "artist_name": "Trippie Redd ft. Juice WRLD",
          "video_id": null,
          "capture_date": "2021-10-11 11:00:22.499499",
          "source_id": 952,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Rich MF",
          "artist_name": "Trippie Redd ft. Lil Durk & Polo G",
          "video_id": null,
          "capture_date": "2021-10-11 11:00:22.499499",
          "source_id": 952,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Already Won",
          "artist_name": "Rod Wave ft. Lil Durk",
          "video_id": null,
          "capture_date": "2021-10-11 11:00:22.499499",
          "source_id": 952,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Betrayal",
          "artist_name": "Trippie Redd ft. Drake",
          "video_id": null,
          "capture_date": "2021-10-11 11:00:22.499499",
          "source_id": 952,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Don't Go",
          "artist_name": "Skrillex, Justin Bieber & Don Toliver",
          "video_id": null,
          "capture_date": "2021-10-11 11:00:22.499499",
          "source_id": 952,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "One Mississippi",
          "artist_name": "Kane Brown",
          "video_id": null,
          "capture_date": "2021-10-11 11:00:22.500500",
          "source_id": 952,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Visiting Hours",
          "artist_name": "Ed Sheeran",
          "video_id": null,
          "capture_date": "2021-10-11 11:00:22.500500",
          "source_id": 952,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "MP5",
          "artist_name": "Trippie Redd ft. SoFaygo",
          "video_id": null,
          "capture_date": "2021-10-11 11:00:22.500500",
          "source_id": 952,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "I Guess I'm In Love",
          "artist_name": "Clinton Kane",
          "video_id": null,
          "capture_date": "2021-10-11 11:00:22.500500",
          "source_id": 952,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Get Ready",
          "artist_name": "Rod Wave ft. Kodak Black",
          "video_id": null,
          "capture_date": "2021-10-11 11:00:22.500500",
          "source_id": 952,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Danny Phantom",
          "artist_name": "Trippie Redd ft. XXXTENTACION",
          "video_id": null,
          "capture_date": "2021-10-11 11:00:22.500500",
          "source_id": 952,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "What's Wrong",
          "artist_name": "Rod Wave",
          "video_id": null,
          "capture_date": "2021-10-11 11:00:22.500500",
          "source_id": 952,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Demon Time",
          "artist_name": "Trippie Redd ft. Ski Mask The Slump God",
          "video_id": null,
          "capture_date": "2021-10-11 11:00:22.500500",
          "source_id": 952,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Tick Tock",
          "artist_name": "Young Thug",
          "video_id": null,
          "capture_date": "2021-10-11 11:00:22.500500",
          "source_id": 952,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Time Heals",
          "artist_name": "Rod Wave",
          "video_id": null,
          "capture_date": "2021-10-11 11:00:22.500500",
          "source_id": 952,
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
  ('Summer Of Love', 'Shawn Mendes & Tainy', NULL),
  ('Matt Hardy 999', 'Trippie Redd ft. Juice WRLD', NULL),
  ('Rich MF', 'Trippie Redd ft. Lil Durk & Polo G', NULL),
  ('Already Won', 'Rod Wave ft. Lil Durk', NULL),
  ('Betrayal', 'Trippie Redd ft. Drake', NULL),
  ('Don’t Go', 'Skrillex, Justin Bieber & Don Toliver', NULL),
  ('One Mississippi', 'Kane Brown', NULL),
  ('Visiting Hours', 'Ed Sheeran', NULL),
  ('MP5', 'Trippie Redd ft. SoFaygo', NULL),
  ('I Guess I’m In Love', 'Clinton Kane', NULL),
  ('Get Ready', 'Rod Wave ft. Kodak Black', NULL),
  ('Danny Phantom', 'Trippie Redd ft. XXXTENTACION', NULL),
  ('What’s Wrong', 'Rod Wave', NULL),
  ('Demon Time', 'Trippie Redd ft. Ski Mask The Slump God', NULL),
  ('Tick Tock', 'Young Thug', NULL),
  ('Time Heals', 'Rod Wave', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10734; // SELECT last_insert_rowid();

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
  ('2021-10-11 11:00:22.499499', '952', '10719'),
  ('2021-10-11 11:00:22.499499', '952', '10720'),
  ('2021-10-11 11:00:22.499499', '952', '10721'),
  ('2021-10-11 11:00:22.499499', '952', '10722'),
  ('2021-10-11 11:00:22.499499', '952', '10723'),
  ('2021-10-11 11:00:22.499499', '952', '10724'),
  ('2021-10-11 11:00:22.500500', '952', '10725'),
  ('2021-10-11 11:00:22.500500', '952', '10726'),
  ('2021-10-11 11:00:22.500500', '952', '10727'),
  ('2021-10-11 11:00:22.500500', '952', '10728'),
  ('2021-10-11 11:00:22.500500', '952', '10729'),
  ('2021-10-11 11:00:22.500500', '952', '10730'),
  ('2021-10-11 11:00:22.500500', '952', '10731'),
  ('2021-10-11 11:00:22.500500', '952', '10732'),
  ('2021-10-11 11:00:22.500500', '952', '10733'),
  ('2021-10-11 11:00:22.500500', '952', '10734')
  ;

  // Update to source_song table
