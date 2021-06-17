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
    ('Billboard', 'The Hot 100', 'Week of June 19, 2021', '2021-06-19 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2021-06-19');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 938; // SELECT last_insert_rowid();
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
        "title": "Yonaguni",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2021-06-17 11:58:18.687687",
        "source_id": 938,
        "song_id": 10517,
        "duplicate": true
    },
    {
        "title": "Hats Off",
        "artist_name": "Lil Baby, Lil Durk & Travis Scott",
        "video_id": null,
        "capture_date": "2021-06-17 11:58:18.687687",
        "source_id": 938,
        "song_id": 10513,
        "duplicate": true
    },
    {
        "title": "Late At Night",
        "artist_name": "Roddy Ricch",
        "video_id": null,
        "capture_date": "2021-06-17 11:58:18.687687",
        "source_id": 938,
        "song_id": 10514,
        "duplicate": true
    },
    {
        "title": "Lost Cause",
        "artist_name": "Billie Eilish",
        "video_id": null,
        "capture_date": "2021-06-17 11:58:18.687687",
        "source_id": 938,
        "song_id": 10536,
        "duplicate": true
    },
    {
        "title": "2040",
        "artist_name": "Lil Baby & Lil Durk",
        "video_id": null,
        "capture_date": "2021-06-17 11:58:18.688688",
        "source_id": 938,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "How It Feels",
        "artist_name": "Lil Baby & Lil Durk",
        "video_id": null,
        "capture_date": "2021-06-17 11:58:18.688688",
        "source_id": 938,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Still Runnin",
        "artist_name": "Lil Baby, Lil Durk & Meek Mill",
        "video_id": null,
        "capture_date": "2021-06-17 11:58:18.688688",
        "source_id": 938,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Who I Want",
        "artist_name": "Lil Baby & Lil Durk",
        "video_id": null,
        "capture_date": "2021-06-17 11:58:18.688688",
        "source_id": 938,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Still Hood",
        "artist_name": "Lil Baby & Lil Durk",
        "video_id": null,
        "capture_date": "2021-06-17 11:58:18.688688",
        "source_id": 938,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Okay",
        "artist_name": "Lil Baby & Lil Durk",
        "video_id": null,
        "capture_date": "2021-06-17 11:58:18.688688",
        "source_id": 938,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Man Of My Word",
        "artist_name": "Lil Baby & Lil Durk",
        "video_id": null,
        "capture_date": "2021-06-17 11:58:18.689689",
        "source_id": 938,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Medical",
        "artist_name": "Lil Baby & Lil Durk",
        "video_id": null,
        "capture_date": "2021-06-17 11:58:18.689689",
        "source_id": 938,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Rich Off Pain",
        "artist_name": "Lil Baby, Lil Durk & Rod Wave",
        "video_id": null,
        "capture_date": "2021-06-17 11:58:18.689689",
        "source_id": 938,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Lying",
        "artist_name": "Lil Baby & Lil Durk",
        "video_id": null,
        "capture_date": "2021-06-17 11:58:18.689689",
        "source_id": 938,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Snowflakes",
        "artist_name": "Tom MacDonald",
        "video_id": null,
        "capture_date": "2021-06-17 11:58:18.689689",
        "source_id": 938,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "That's Facts",
        "artist_name": "Lil Baby & Lil Durk",
        "video_id": null,
        "capture_date": "2021-06-17 11:58:18.689689",
        "source_id": 938,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Please",
        "artist_name": "Lil Baby & Lil Durk",
        "video_id": null,
        "capture_date": "2021-06-17 11:58:18.689689",
        "source_id": 938,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Up The Side",
        "artist_name": "Lil Baby, Lil Durk & Young Thug",
        "video_id": null,
        "capture_date": "2021-06-17 11:58:18.689689",
        "source_id": 938,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "If You Want To",
        "artist_name": "Lil Baby & Lil Durk",
        "video_id": null,
        "capture_date": "2021-06-17 11:58:18.690690",
        "source_id": 938,
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
  ('2040', 'Lil Baby & Lil Durk', NULL),
  ('How It Feels', 'Lil Baby & Lil Durk', NULL),
  ('Still Runnin', 'Lil Baby, Lil Durk & Meek Mill', NULL),
  ('Who I Want', 'Lil Baby & Lil Durk', NULL),
  ('Still Hood', 'Lil Baby & Lil Durk', NULL),
  ('Okay', 'Lil Baby & Lil Durk', NULL),
  ('Man Of My Word', 'Lil Baby & Lil Durk', NULL),
  ('Medical', 'Lil Baby & Lil Durk', NULL),
  ('Rich Off Pain', 'Lil Baby, Lil Durk & Rod Wave', NULL),
  ('Lying', 'Lil Baby & Lil Durk', NULL),
  ('Snowflakes', 'Tom MacDonald', NULL),
  ('That’s Facts', 'Lil Baby & Lil Durk', NULL),
  ('Please', 'Lil Baby & Lil Durk', NULL),
  ('Up The Side', 'Lil Baby, Lil Durk & Young Thug', NULL),
  ('If You Want To', 'Lil Baby & Lil Durk', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10571; // SELECT last_insert_rowid();

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
  ('2021-06-17 11:58:18.687687', '938', '10517'),
  ('2021-06-17 11:58:18.687687', '938', '10513'),
  ('2021-06-17 11:58:18.687687', '938', '10514'),
  ('2021-06-17 11:58:18.687687', '938', '10536'),
  ('2021-06-17 11:58:18.688688', '938', '10557'),
  ('2021-06-17 11:58:18.688688', '938', '10558'),
  ('2021-06-17 11:58:18.688688', '938', '10559'),
  ('2021-06-17 11:58:18.688688', '938', '10560'),
  ('2021-06-17 11:58:18.688688', '938', '10561'),
  ('2021-06-17 11:58:18.688688', '938', '10562'),
  ('2021-06-17 11:58:18.689689', '938', '10563'),
  ('2021-06-17 11:58:18.689689', '938', '10564'),
  ('2021-06-17 11:58:18.689689', '938', '10565'),
  ('2021-06-17 11:58:18.689689', '938', '10566'),
  ('2021-06-17 11:58:18.689689', '938', '10567'),
  ('2021-06-17 11:58:18.689689', '938', '10568'),
  ('2021-06-17 11:58:18.689689', '938', '10569'),
  ('2021-06-17 11:58:18.689689', '938', '10570'),
  ('2021-06-17 11:58:18.690690', '938', '10571')
  ;

  // Update to source_song table
