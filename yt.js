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
    ('YouTube', 'Global Top Songs', 'Week of May 20, 2021', '2021-05-20 12:00:00.000000', 'https://charts.youtube.com/charts/TopSongs/global/20210514-20210520');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 919; // SELECT last_insert_rowid();
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

  // check that this grabbed all the new songs


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
        "title": "Build a Bitch",
        "artist_name": "Bella Poarch",
        "video_id": null,
        "capture_date": "2021-05-27 06:55:58.414414",
        "source_id": 919,
        "song_id": 10409,
        "duplicate": true
    },
    {
        "title": "good 4 u",
        "artist_name": "Olivia Rodrigo",
        "video_id": null,
        "capture_date": "2021-05-27 06:55:58.419419",
        "source_id": 919,
        "song_id": 10393,
        "duplicate": true
    },
    {
        "title": "Next Level",
        "artist_name": "aespa",
        "video_id": null,
        "capture_date": "2021-05-27 06:55:58.421421",
        "source_id": 919,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Trốn Tìm (feat. MTV BAND)",
        "artist_name": "Đen",
        "video_id": null,
        "capture_date": "2021-05-27 06:55:58.429429",
        "source_id": 919,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bitch I'm Back",
        "artist_name": "Sidhu Moose Wala",
        "video_id": null,
        "capture_date": "2021-05-27 06:55:58.430430",
        "source_id": 919,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "चित बदली (Chit Badali)",
        "artist_name": "Shilpi Raj",
        "video_id": null,
        "capture_date": "2021-05-27 06:55:58.432432",
        "source_id": 919,
        "song_id": 10259,
        "duplicate": true
    },
    {
        "title": "Raja Tani Jai Na Bahariya",
        "artist_name": "Rakesh Mishra",
        "video_id": null,
        "capture_date": "2021-05-27 06:55:58.434434",
        "source_id": 919,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Grandes Ligas",
        "artist_name": "Lupillo Rivera",
        "video_id": null,
        "capture_date": "2021-05-27 06:55:58.434434",
        "source_id": 919,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Samne Aa Jao",
        "artist_name": "Pritam Dholiya",
        "video_id": null,
        "capture_date": "2021-05-27 06:55:58.435435",
        "source_id": 919,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Libaas",
        "artist_name": "Kaka",
        "video_id": null,
        "capture_date": "2021-05-27 06:55:58.435435",
        "source_id": 919,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "a m a r i",
        "artist_name": "J. Cole",
        "video_id": null,
        "capture_date": "2021-05-27 06:55:58.436436",
        "source_id": 919,
        "song_id": 10384,
        "duplicate": true
    },
    {
        "title": "Straightenin",
        "artist_name": "Migos",
        "video_id": null,
        "capture_date": "2021-05-27 06:55:58.436436",
        "source_id": 919,
        "song_id": 10387,
        "duplicate": true
    },
    {
        "title": "Electric",
        "artist_name": "Katy Perry",
        "video_id": null,
        "capture_date": "2021-05-27 06:55:58.436436",
        "source_id": 919,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Te Necesito",
        "artist_name": "KHEA",
        "video_id": null,
        "capture_date": "2021-05-27 06:55:58.437437",
        "source_id": 919,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Machayenge 3",
        "artist_name": "Emiway Bantai",
        "video_id": null,
        "capture_date": "2021-05-27 06:55:58.438438",
        "source_id": 919,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Burberry",
        "artist_name": "Sidhu Moose Wala",
        "video_id": null,
        "capture_date": "2021-05-27 06:55:58.438438",
        "source_id": 919,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "คิดฮอดรู้หม้าย",
        "artist_name": "คิว สราวุฒิ",
        "video_id": null,
        "capture_date": "2021-05-27 06:55:58.438438",
        "source_id": 919,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "EL BARCO",
        "artist_name": "Karol G",
        "video_id": null,
        "capture_date": "2021-05-27 06:55:58.439439",
        "source_id": 919,
        "song_id": 10131,
        "duplicate": true
    },
    {
        "title": "Dil De Diya",
        "artist_name": "Kamaal Khan",
        "video_id": null,
        "capture_date": "2021-05-27 06:55:58.440440",
        "source_id": 919,
        "song_id": 10369,
        "duplicate": true
    },
    {
        "title": "Chhor Denge",
        "artist_name": "Parampara Thakur",
        "video_id": null,
        "capture_date": "2021-05-27 06:55:58.441441",
        "source_id": 919,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "m y . l i f e",
        "artist_name": "J. Cole feat. 21 Savage & Morray",
        "video_id": null,
        "capture_date": "2021-05-27 06:55:58.441441",
        "source_id": 919,
        "song_id": 10417,
        "duplicate": true
    },
    {
        "title": "Sal y Perrea",
        "artist_name": "Sech",
        "video_id": null,
        "capture_date": "2021-05-27 06:55:58.441441",
        "source_id": 919,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Kutty Pattas",
        "artist_name": "Santhosh Dhayanidhi",
        "video_id": null,
        "capture_date": "2021-05-27 06:55:58.443443",
        "source_id": 919,
        "song_id": 10134,
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
  ('Next Level', 'aespa', NULL),
  ('Trốn Tìm (feat. MTV BAND)', 'Đen', NULL),
  ('Bitch I’m Back', 'Sidhu Moose Wala', NULL),
  ('Raja Tani Jai Na Bahariya', 'Rakesh Mishra', NULL),
  ('Grandes Ligas', 'Lupillo Rivera', NULL),
  ('Samne Aa Jao', 'Pritam Dholiya', NULL),
  ('Libaas', 'Kaka', NULL),
  ('Electric', 'Katy Perry', NULL),
  ('Te Necesito', 'KHEA', NULL),
  ('Machayenge 3', 'Emiway Bantai', NULL),
  ('Burberry', 'Sidhu Moose Wala', NULL),
  ('คิดฮอดรู้หม้าย', 'คิว สราวุฒิ', NULL),
  ('Chhor Denge', 'Parampara Thakur', NULL),
  ('Sal y Perrea', 'Sech', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10452; // SELECT last_insert_rowid();

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
  ('2021-05-27 06:55:58.414414', '919', '10409'),
  ('2021-05-27 06:55:58.419419', '919', '10393'),
  ('2021-05-27 06:55:58.421421', '919', '10439'),
  ('2021-05-27 06:55:58.429429', '919', '10440'),
  ('2021-05-27 06:55:58.430430', '919', '10441'),
  ('2021-05-27 06:55:58.432432', '919', '10259'),
  ('2021-05-27 06:55:58.434434', '919', '10442'),
  ('2021-05-27 06:55:58.434434', '919', '10443'),
  ('2021-05-27 06:55:58.435435', '919', '10444'),
  ('2021-05-27 06:55:58.435435', '919', '10445'),
  ('2021-05-27 06:55:58.436436', '919', '10384'),
  ('2021-05-27 06:55:58.436436', '919', '10387'),
  ('2021-05-27 06:55:58.436436', '919', '10446'),
  ('2021-05-27 06:55:58.437437', '919', '10447'),
  ('2021-05-27 06:55:58.438438', '919', '10448'),
  ('2021-05-27 06:55:58.438438', '919', '10449'),
  ('2021-05-27 06:55:58.438438', '919', '10450'),
  ('2021-05-27 06:55:58.439439', '919', '10131'),
  ('2021-05-27 06:55:58.440440', '919', '10369'),
  ('2021-05-27 06:55:58.441441', '919', '10451'),
  ('2021-05-27 06:55:58.441441', '919', '10417'),
  ('2021-05-27 06:55:58.441441', '919', '10452'),
  ('2021-05-27 06:55:58.443443', '919', '10134')
  ;

  // Update to source_song table
