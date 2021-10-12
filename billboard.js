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
    ('Billboard', 'The Hot 100', 'Week of October 16, 2021', '2021-10-16 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2021-10-16');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 960; // SELECT last_insert_rowid();
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
          "title": "Intro (Hate On Me)",
          "artist_name": "Meek Mill",
          "video_id": null,
          "capture_date": "2021-10-12 09:22:11.722722",
          "source_id": 960,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Hot",
          "artist_name": "Meek Mill ft. Moneybagg Yo",
          "video_id": null,
          "capture_date": "2021-10-12 09:22:11.722722",
          "source_id": 960,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Expensive Pain",
          "artist_name": "Meek Mill",
          "video_id": null,
          "capture_date": "2021-10-12 09:22:11.723723",
          "source_id": 960,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "On My Soul",
          "artist_name": "Meek Mill",
          "video_id": null,
          "capture_date": "2021-10-12 09:22:11.723723",
          "source_id": 960,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Jugaste y Sufri",
          "artist_name": "Eslabon Armado ft. DannyLux",
          "video_id": null,
          "capture_date": "2021-10-12 09:22:11.723723",
          "source_id": 960,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Outside (100 MPH)",
          "artist_name": "Meek Mill",
          "video_id": null,
          "capture_date": "2021-10-12 09:22:11.723723",
          "source_id": 960,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Last One Standing",
          "artist_name": "Skylar Grey, Polo G, Mozzy & Eminem",
          "video_id": null,
          "capture_date": "2021-10-12 09:22:11.723723",
          "source_id": 960,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "The Feels",
          "artist_name": "TWICE",
          "video_id": null,
          "capture_date": "2021-10-12 09:22:11.723723",
          "source_id": 960,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Me (FWM)",
          "artist_name": "Meek Mill ft. A$AP Ferg",
          "video_id": null,
          "capture_date": "2021-10-12 09:22:11.723723",
          "source_id": 960,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Love Train",
          "artist_name": "Meek Mill",
          "video_id": null,
          "capture_date": "2021-10-12 09:22:11.723723",
          "source_id": 960,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Feelin Like Tunechi",
          "artist_name": "Lil Wayne ft. Rich The Kid",
          "video_id": null,
          "capture_date": "2021-10-12 09:22:11.723723",
          "source_id": 960,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Ride For You",
          "artist_name": "Meek Mill ft. Kehlani",
          "video_id": null,
          "capture_date": "2021-10-12 09:22:11.723723",
          "source_id": 960,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Esta Danada",
          "artist_name": "Ivan Cornejo",
          "video_id": null,
          "capture_date": "2021-10-12 09:22:11.723723",
          "source_id": 960,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Whiskey And Rain",
          "artist_name": "Michael Ray",
          "video_id": null,
          "capture_date": "2021-10-12 09:22:11.723723",
          "source_id": 960,
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
  ('Intro (Hate On Me)', 'Meek Mill', NULL),
  ('Hot', 'Meek Mill ft. Moneybagg Yo', NULL),
  ('Expensive Pain', 'Meek Mill', NULL),
  ('On My Soul', 'Meek Mill', NULL),
  ('Jugaste y Sufri', 'Eslabon Armado ft. DannyLux', NULL),
  ('Outside (100 MPH)', 'Meek Mill', NULL),
  ('Last One Standing', 'Skylar Grey, Polo G, Mozzy & Eminem', NULL),
  ('The Feels', 'TWICE', NULL),
  ('Me (FWM)', 'Meek Mill ft. A$AP Ferg', NULL),
  ('Love Train', 'Meek Mill', NULL),
  ('Feelin Like Tunechi', 'Lil Wayne ft. Rich The Kid', NULL),
  ('Ride For You', 'Meek Mill ft. Kehlani', NULL),
  ('Esta Danada', 'Ivan Cornejo', NULL),
  ('Whiskey And Rain', 'Michael Ray', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10841; // SELECT last_insert_rowid();

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
  ('2021-10-12 09:22:11.722722', '960', '10828'),
  ('2021-10-12 09:22:11.722722', '960', '10829'),
  ('2021-10-12 09:22:11.723723', '960', '10830'),
  ('2021-10-12 09:22:11.723723', '960', '10831'),
  ('2021-10-12 09:22:11.723723', '960', '10832'),
  ('2021-10-12 09:22:11.723723', '960', '10833'),
  ('2021-10-12 09:22:11.723723', '960', '10834'),
  ('2021-10-12 09:22:11.723723', '960', '10835'),
  ('2021-10-12 09:22:11.723723', '960', '10836'),
  ('2021-10-12 09:22:11.723723', '960', '10837'),
  ('2021-10-12 09:22:11.723723', '960', '10838'),
  ('2021-10-12 09:22:11.723723', '960', '10839'),
  ('2021-10-12 09:22:11.723723', '960', '10840'),
  ('2021-10-12 09:22:11.723723', '960', '10841')
  ;

  // Update to source_song table
