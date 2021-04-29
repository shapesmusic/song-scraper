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
    ('Billboard', 'The Hot 100', 'Week of May 1, 2021', '2021-05-01 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2021-05-01');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 890; // SELECT last_insert_rowid();
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
        "title": "Solid",
        "artist_name": "Young Thug & Gunna Featuring Drake",
        "video_id": null,
        "capture_date": "2021-04-29 08:38:27.701701",
        "source_id": 890,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Ski",
        "artist_name": "Young Thug & Gunna",
        "video_id": null,
        "capture_date": "2021-04-29 08:38:27.701701",
        "source_id": 890,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Diamonds Dancing",
        "artist_name": "Young Thug & Gunna Featuring Travis Scott",
        "video_id": null,
        "capture_date": "2021-04-29 08:38:27.702702",
        "source_id": 890,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Proud Of You",
        "artist_name": "Young Thug Featuring Lil Uzi Vert & Yung Kayo",
        "video_id": null,
        "capture_date": "2021-04-29 08:38:27.702702",
        "source_id": 890,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Came And Saw",
        "artist_name": "Young Thug Featuring Rowdy Rebel",
        "video_id": null,
        "capture_date": "2021-04-29 08:38:27.703703",
        "source_id": 890,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Paid The Fine",
        "artist_name": "Young Thug & Gunna Featuring Lil Baby & YTB Trench",
        "video_id": null,
        "capture_date": "2021-04-29 08:38:27.703703",
        "source_id": 890,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Chasing After You",
        "artist_name": "Ryan Hurd With Maren Morris",
        "video_id": null,
        "capture_date": "2021-04-29 08:38:27.703703",
        "source_id": 890,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Go!",
        "artist_name": "Moneybagg Yo Featuring BIG30",
        "video_id": null,
        "capture_date": "2021-04-29 08:38:27.703703",
        "source_id": 890,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Slatty",
        "artist_name": "Young Thug & Gunna Featuring Yak Gotti & Lil Duke",
        "video_id": null,
        "capture_date": "2021-04-29 08:38:27.704704",
        "source_id": 890,
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
  ('Solid', 'Young Thug & Gunna Featuring Drake', NULL),
  ('Ski', 'Young Thug & Gunna', NULL),
  ('Diamonds Dancing', 'Young Thug & Gunna Featuring Travis Scott', NULL),
  ('Proud Of You', 'Young Thug Featuring Lil Uzi Vert & Yung Kayo', NULL),
  ('Came And Saw', 'Young Thug Featuring Rowdy Rebel', NULL),
  ('Paid The Fine', 'Young Thug & Gunna Featuring Lil Baby & YTB Trench', NULL),
  ('Chasing After You', 'Ryan Hurd With Maren Morris', NULL),
  ('Go!', 'Moneybagg Yo Featuring BIG30', NULL),
  ('Slatty', 'Young Thug & Gunna Featuring Yak Gotti & Lil Duke', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10258; // SELECT last_insert_rowid();

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
  ('2021-04-29 08:38:27.701701', '890', '10250'),
  ('2021-04-29 08:38:27.701701', '890', '10251'),
  ('2021-04-29 08:38:27.702702', '890', '10252'),
  ('2021-04-29 08:38:27.702702', '890', '10253'),
  ('2021-04-29 08:38:27.703703', '890', '10254'),
  ('2021-04-29 08:38:27.703703', '890', '10255'),
  ('2021-04-29 08:38:27.703703', '890', '10256'),
  ('2021-04-29 08:38:27.703703', '890', '10257'),
  ('2021-04-29 08:38:27.704704', '890', '10258')
  ;

  // Update to source_song table
