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
  );


  // Stage the SQL statement
  // Replace any ' in strings with ’

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('YouTube', 'Global Top Songs', 'Week of Apr 22, 2021', '2021-04-22 12:00:00.000000', 'https://charts.youtube.com/charts/TopSongs/global/20210416-20210422');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 891; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName('chart-table-row style-scope ytmc-chart-table');

  songsData = [];

  for (var i=0; i<elements.length; i++){
      element = elements[i];

      isNew = element.getElementsByClassName("style-scope ytmc-chart-table")[0].getElementsByClassName("style-scope ytmc-chart-table")[4].getElementsByClassName("style-scope ytmc-chart-table")[2].innerText

      title = element.getElementsByClassName("ytmc-ellipsis-text style-scope")[0].innerText.trim();
      artist_name = element.getElementsByClassName("ytmc-artist-name style-scope ytmc-artists-list")[0].innerText.trim();
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

  console.log(JSON.stringify(songsData, null, 4));


//
// Step 3:  Stage songsData,
//          move any artists out of titles,
//          prune unwanted songs,
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "चित बदली (Chit Badali)",
        "artist_name": "Shilpi Raj",
        "video_id": null,
        "capture_date": "2021-04-29 08:47:38.359359",
        "source_id": 891,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Pareja Del Año",
        "artist_name": "Sebastián Yatra",
        "video_id": null,
        "capture_date": "2021-04-29 08:47:38.360360",
        "source_id": 891,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bangliniya",
        "artist_name": "Khesari Lal Yadav, Antra Singh Priyanka",
        "video_id": null,
        "capture_date": "2021-04-29 08:47:38.361361",
        "source_id": 891,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Feelings",
        "artist_name": "Sumit Goswami",
        "video_id": null,
        "capture_date": "2021-04-29 08:47:38.361361",
        "source_id": 891,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Talja",
        "artist_name": "Jassa Dhillon feat. Deepak Dhillon",
        "video_id": null,
        "capture_date": "2021-04-29 08:47:38.362362",
        "source_id": 891,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "फंसाली बंगलिनिया",
        "artist_name": "Ankush Raja",
        "video_id": null,
        "capture_date": "2021-04-29 08:47:38.363363",
        "source_id": 891,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Binibini",
        "artist_name": "Zack Tabudlo",
        "video_id": null,
        "capture_date": "2021-04-29 08:47:38.364364",
        "source_id": 891,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Chitti",
        "artist_name": "--",
        "video_id": null,
        "capture_date": "2021-04-29 08:47:38.365365",
        "source_id": 891,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Jerusalema",
        "artist_name": "Master KG feat. Nomcebo Zikode",
        "video_id": null,
        "capture_date": "2021-04-29 08:47:38.365365",
        "source_id": 891,
        "song_id": 9932,
        "duplicate": true
    },
    {
        "title": "Acaso",
        "artist_name": "Vitor Fernandes",
        "video_id": null,
        "capture_date": "2021-04-29 08:47:38.365365",
        "source_id": 891,
        "song_id": 9920,
        "duplicate": true
    },
    {
        "title": "Coração Gelado 2",
        "artist_name": "DJ Boy",
        "video_id": null,
        "capture_date": "2021-04-29 08:47:38.366366",
        "source_id": 891,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "O Carpinteiro (Conto de Fadas)",
        "artist_name": "nattan",
        "video_id": null,
        "capture_date": "2021-04-29 08:47:38.367367",
        "source_id": 891,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Gangsta's Paradise",
        "artist_name": "Coolio",
        "video_id": null,
        "capture_date": "2021-04-29 08:47:38.367367",
        "source_id": 891,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "El Tóxico",
        "artist_name": "Grupo Firme",
        "video_id": null,
        "capture_date": "2021-04-29 08:47:38.367367",
        "source_id": 891,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "ແພງອ້າຍ",
        "artist_name": "Sophana feat. NUTDAO, แบกือ & BigYai",
        "video_id": null,
        "capture_date": "2021-04-29 08:47:38.368368",
        "source_id": 891,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "PROBLEMA",
        "artist_name": "Daddy Yankee",
        "video_id": null,
        "capture_date": "2021-04-29 08:47:38.368368",
        "source_id": 891,
        "song_id": 9927,
        "duplicate": true
    },
    {
        "title": "ดวงเดือน",
        "artist_name": "JOEY PHUWASIT",
        "video_id": null,
        "capture_date": "2021-04-29 08:47:38.369369",
        "source_id": 891,
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
  ('चित बदली (Chit Badali)', 'Shilpi Raj', NULL),
  ('Pareja Del Año', 'Sebastián Yatra', NULL),
  ('Bangliniya', 'Khesari Lal Yadav, Antra Singh Priyanka', NULL),
  ('Feelings', 'Sumit Goswami', NULL),
  ('Talja', 'Jassa Dhillon feat. Deepak Dhillon', NULL),
  ('फंसाली बंगलिनिया', 'Ankush Raja', NULL),
  ('Binibini', 'Zack Tabudlo', NULL),
  ('Chitti', '--', NULL),
  ('Coração Gelado 2', 'DJ Boy', NULL),
  ('O Carpinteiro (Conto de Fadas)', 'nattan', NULL),
  ('Gangsta’s Paradise', 'Coolio', NULL),
  ('El Tóxico', 'Grupo Firme', NULL),
  ('ແພງອ້າຍ', 'Sophana feat. NUTDAO, แบกือ & BigYai', NULL),
  ('ดวงเดือน', 'JOEY PHUWASIT', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10272; // SELECT last_insert_rowid();

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
  ('2021-04-29 08:47:38.359359', '891', '10259'),
  ('2021-04-29 08:47:38.360360', '891', '10260'),
  ('2021-04-29 08:47:38.361361', '891', '10261'),
  ('2021-04-29 08:47:38.361361', '891', '10262'),
  ('2021-04-29 08:47:38.362362', '891', '10263'),
  ('2021-04-29 08:47:38.363363', '891', '10264'),
  ('2021-04-29 08:47:38.364364', '891', '10265'),
  ('2021-04-29 08:47:38.365365', '891', '10266'),
  ('2021-04-29 08:47:38.365365', '891', '9932'),
  ('2021-04-29 08:47:38.365365', '891', '9920'),
  ('2021-04-29 08:47:38.366366', '891', '10267'),
  ('2021-04-29 08:47:38.367367', '891', '10268'),
  ('2021-04-29 08:47:38.367367', '891', '10269'),
  ('2021-04-29 08:47:38.367367', '891', '10270'),
  ('2021-04-29 08:47:38.368368', '891', '10271'),
  ('2021-04-29 08:47:38.368368', '891', '9927'),
  ('2021-04-29 08:47:38.369369', '891', '10272')
  ;

  // Update to source_song table
