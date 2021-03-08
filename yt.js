//
// Step 0: Check recent scraped
//

  SELECT parent_stream, instance_name FROM source WHERE parent_entity = 'YouTube' ORDER BY publication_date DESC LIMIT 8;

//
// Step 1: Scrape source data
//

  // Add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // Get and format publicationDate
  publicationDate = document.getElementsByClassName('style-scope ytmc-dropdown iron-selected')[1].ariaLabel.match(/(?<=–)[^–]*/)[0].trim()
  weekBeginDate = moment(publicationDate).subtract(6, "days");

  publicationDateFormatted = moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // SQLite time format

  // Get location and format for current or past chart status
  currentChartLocation = window.location.href
    + "/"
    + moment(weekBeginDate, "MMM DD, YYYY").format("YYYYMMDD")
    + "-"
    + moment(publicationDate, "MMM DD, YYYY").format("YYYYMMDD");

pastChartLocation = window.location.href;

  // Build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'YouTube\', \'Global Top Songs\', \'Week of " // Change instance_name 'Global Top Songs' if scraping a different YT chart
    + publicationDate + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + currentChartLocation + "\');" // use pastChartLocation if not the current week's chart, otherwise use currentChartLocation
  )


  // Stage the SQL statement
  // Replace any ' in strings with ’

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('YouTube', 'Global Top Songs', 'Week of Mar 4, 2021', '2021-03-04 12:00:00.000000', 'https://charts.youtube.com/charts/TopSongs/global/20210226-20210304');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 802; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName('chart-table-row style-scope ytmc-chart-table');

  songsData = [];

  for (var i=0; i<elements.length; i++){ // if artist_name error, set i < [last successful i + 1], scrape to there, then continue from the next new song through elements.length.
      element = elements[i];

      isNew = element.getElementsByClassName("style-scope ytmc-chart-table")[0].getElementsByClassName("style-scope ytmc-chart-table")[4].getElementsByClassName("style-scope ytmc-chart-table")[1].innerText;

      title = element.getElementsByClassName("ytmc-ellipsis-text style-scope")[0].innerText.trim();
      artist_name = element.getElementsByClassName("ytmc-artist-name clickable style-scope ytmc-artists-list")[0].innerText.trim();
      video_id = null;
      capture_date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format
      duplicate = false;

      songData = {
        // 'element': i,
        'title' : title,
        'artist_name' : artist_name,
        'video_id' : video_id,
        'capture_date' : capture_date,
        'source_id' : source_id,
        'song_id' : song_id,
        'duplicate' : duplicate
      };

      if(isNew == "--"){

        songsData.push(songData);
        console.log(i);

      };
  };

  JSON.stringify(songsData, null, 4);


//
// Step 3:  Stage songsData,
//          move artists out of titles,
//          prune unwanted songs,
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "Shor Machega",
        "artist_name": "Honey Singh & Hommie Dilliwala",
        "video_id": null,
        "capture_date": "2021-03-08 09:27:08.502502",
        "source_id": 802,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Saranga Dariya",
        "artist_name": "Mangli",
        "video_id": null,
        "capture_date": "2021-03-08 09:27:08.502502",
        "source_id": 802,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Kill This Love",
        "artist_name": "BLACKPINK",
        "video_id": null,
        "capture_date": "2021-03-08 09:27:08.503503",
        "source_id": 802,
        "song_id": 978,
        "duplicate": true
    },
    {
        "title": "Jatt Te Jawani",
        "artist_name": "Dilpreet Dhillon & Karan Aujla",
        "video_id": null,
        "capture_date": "2021-03-08 09:27:08.503503",
        "source_id": 802,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "PROBLEMA",
        "artist_name": "Daddy Yankee",
        "video_id": null,
        "capture_date": "2021-03-08 09:27:08.504504",
        "source_id": 802,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Machu Picchu",
        "artist_name": "Camilo & Evaluna Montaner",
        "video_id": null,
        "capture_date": "2021-03-08 09:27:08.504504",
        "source_id": 802,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Nadiyon Paar (Let the Music Play Again)",
        "artist_name": "Sachin–Jigar, Rashmeet Kaur, Shamur & IP Singh",
        "video_id": null,
        "capture_date": "2021-03-08 09:27:08.504504",
        "source_id": 802,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "M4",
        "artist_name": "Matuê",
        "video_id": null,
        "capture_date": "2021-03-08 09:27:08.505505",
        "source_id": 802,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "群青",
        "artist_name": "Yoasobi",
        "video_id": null,
        "capture_date": "2021-03-08 09:27:08.505505",
        "source_id": 802,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Jerusalema (Remix)",
        "artist_name": "Ponifasio Samoa",
        "video_id": null,
        "capture_date": "2021-03-08 09:27:08.505505",
        "source_id": 802,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Aur Pyaar Karna Hai",
        "artist_name": "Neha Kakkar, Guru Randhawa & Sachet–Parampara",
        "video_id": null,
        "capture_date": "2021-03-08 09:27:08.505505",
        "source_id": 802,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Peşimde",
        "artist_name": "Kerimcan Durmaz",
        "video_id": null,
        "capture_date": "2021-03-08 09:27:08.505505",
        "source_id": 802,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Guilty",
        "artist_name": "Inder Chahal & Karan Aujla",
        "video_id": null,
        "capture_date": "2021-03-08 09:27:08.506506",
        "source_id": 802,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hot N*gga",
        "artist_name": "Bobby Shmurda",
        "video_id": null,
        "capture_date": "2021-03-08 09:27:08.506506",
        "source_id": 802,
        "song_id": 4262,
        "duplicate": true
    },
    {
        "title": "Love Is Gone (Acoustic)",
        "artist_name": "SLANDER feat. Dylan Matthew",
        "video_id": null,
        "capture_date": "2021-03-08 09:29:26.841841",
        "source_id": 802,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "ROCKSTAR",
        "artist_name": "DaBaby feat. Roddy Ricch",
        "video_id": null,
        "capture_date": "2021-03-08 09:29:26.842842",
        "source_id": 802,
        "song_id": 8276,
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
  ('Shor Machega', 'Honey Singh & Hommie Dilliwala', NULL),
  ('Saranga Dariya', 'Mangli', NULL),
  ('Jatt Te Jawani', 'Dilpreet Dhillon & Karan Aujla', NULL),
  ('PROBLEMA', 'Daddy Yankee', NULL),
  ('Machu Picchu', 'Camilo & Evaluna Montaner', NULL),
  ('Nadiyon Paar (Let the Music Play Again)', 'Sachin–Jigar, Rashmeet Kaur, Shamur & IP Singh', NULL),
  ('M4', 'Matuê', NULL),
  ('群青', 'Yoasobi', NULL),
  ('Jerusalema (Remix)', 'Ponifasio Samoa', NULL),
  ('Aur Pyaar Karna Hai', 'Neha Kakkar, Guru Randhawa & Sachet–Parampara', NULL),
  ('Peşimde', 'Kerimcan Durmaz', NULL),
  ('Guilty', 'Inder Chahal & Karan Aujla', NULL),
  ('Love Is Gone (Acoustic)', 'SLANDER feat. Dylan Matthew', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9936; // SELECT last_insert_rowid();

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
  ('2021-03-08 09:27:08.502502', '802', '9924'),
  ('2021-03-08 09:27:08.502502', '802', '9925'),
  ('2021-03-08 09:27:08.503503', '802', '978'),
  ('2021-03-08 09:27:08.503503', '802', '9926'),
  ('2021-03-08 09:27:08.504504', '802', '9927'),
  ('2021-03-08 09:27:08.504504', '802', '9928'),
  ('2021-03-08 09:27:08.504504', '802', '9929'),
  ('2021-03-08 09:27:08.505505', '802', '9930'),
  ('2021-03-08 09:27:08.505505', '802', '9931'),
  ('2021-03-08 09:27:08.505505', '802', '9932'),
  ('2021-03-08 09:27:08.505505', '802', '9933'),
  ('2021-03-08 09:27:08.505505', '802', '9934'),
  ('2021-03-08 09:27:08.506506', '802', '9935'),
  ('2021-03-08 09:27:08.506506', '802', '4262'),
  ('2021-03-08 09:29:26.841841', '802', '9936'),
  ('2021-03-08 09:29:26.842842', '802', '8276')
  ;

  // Update to source_song table
