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
    ('YouTube', 'Global Top Songs', 'Week of Mar 25, 2021', '2021-03-25 12:00:00.000000', 'https://charts.youtube.com/charts/TopSongs/global/20210319-20210325');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 858; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName('chart-table-row style-scope ytmc-chart-table');

  songsData = [];

  for (var i=0; i<elements.length; i++){
      element = elements[i];

      isNew = element.getElementsByClassName("style-scope ytmc-chart-table")[0].getElementsByClassName("style-scope ytmc-chart-table")[4].getElementsByClassName("style-scope ytmc-chart-table")[1].innerText;

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

  JSON.stringify(songsData, null, 4);


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
        "title": "Lut Gaye",
        "artist_name": "Jubin Nautiyal feat. Emraan Hashmi",
        "video_id": null,
        "capture_date": "2021-03-31 08:21:15.248248",
        "source_id": 858,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Peaches",
        "artist_name": "Justin Bieber feat. Daniel Caesar & Giveon",
        "video_id": null,
        "capture_date": "2021-03-31 08:21:15.250250",
        "source_id": 858,
        "song_id": 10025,
        "duplicate": true
    },
    {
        "title": "Aashiq Purana",
        "artist_name": "Kaka",
        "video_id": null,
        "capture_date": "2021-03-31 08:21:15.252252",
        "source_id": 858,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Marjaneya",
        "artist_name": "Neha Kakkar",
        "video_id": null,
        "capture_date": "2021-03-31 08:21:15.252252",
        "source_id": 858,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Prisionera",
        "artist_name": "NewNak",
        "video_id": null,
        "capture_date": "2021-03-31 08:21:15.254254",
        "source_id": 858,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "ROCKSTAR",
        "artist_name": "DaBaby feat. Roddy Ricch",
        "video_id": null,
        "capture_date": "2021-03-31 08:21:15.254254",
        "source_id": 858,
        "song_id": 8276,
        "duplicate": true
    },
    {
        "title": "Obsessed",
        "artist_name": "Addison Rae",
        "video_id": null,
        "capture_date": "2021-03-31 08:21:15.255255",
        "source_id": 858,
        "song_id": 10032,
        "duplicate": true
    },
    {
        "title": "Sugar Crash",
        "artist_name": "ElyOtto",
        "video_id": null,
        "capture_date": "2021-03-31 08:21:15.255255",
        "source_id": 858,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Fiel",
        "artist_name": "Los Legendarios, Wisin & Jhay Cortez",
        "video_id": null,
        "capture_date": "2021-03-31 08:21:15.256256",
        "source_id": 858,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Lavandiya London Se Layenge",
        "artist_name": "Khesari Lal Yadav",
        "video_id": null,
        "capture_date": "2021-03-31 08:21:15.256256",
        "source_id": 858,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Disco Arranhado (Funk Remix)",
        "artist_name": "Malu & DJ Lucas Beat",
        "video_id": null,
        "capture_date": "2021-03-31 08:21:15.257257",
        "source_id": 858,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "어떤X (What Type of X)",
        "artist_name": "Jessi",
        "video_id": null,
        "capture_date": "2021-03-31 08:21:15.257257",
        "source_id": 858,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Preta do Cabelo Cacheado",
        "artist_name": "Th CDM",
        "video_id": null,
        "capture_date": "2021-03-31 08:21:15.258258",
        "source_id": 858,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "롤린 (Rollin')",
        "artist_name": "브레이브걸스",
        "video_id": null,
        "capture_date": "2021-03-31 08:21:15.259259",
        "source_id": 858,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Ah Ellerim Kırılaydı",
        "artist_name": "Tuğçe Kandemir",
        "video_id": null,
        "capture_date": "2021-03-31 08:21:15.259259",
        "source_id": 858,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Talking to the Moon",
        "artist_name": "Bruno Mars",
        "video_id": null,
        "capture_date": "2021-03-31 08:21:15.260260",
        "source_id": 858,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "¿Quién Te Crees?",
        "artist_name": "MC Davo feat. Calibre 50",
        "video_id": null,
        "capture_date": "2021-03-31 08:21:15.260260",
        "source_id": 858,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Radha",
        "artist_name": "Dhvani Bhanushali & Abhijit Vaghani",
        "video_id": null,
        "capture_date": "2021-03-31 08:21:15.261261",
        "source_id": 858,
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
  ('Lut Gaye', 'Jubin Nautiyal feat. Emraan Hashmi', NULL),
  ('Aashiq Purana', 'Kaka', NULL),
  ('Marjaneya', 'Neha Kakkar', NULL),
  ('Prisionera', 'NewNak', NULL),
  ('Sugar Crash', 'ElyOtto', NULL),
  ('Fiel', 'Los Legendarios, Wisin & Jhay Cortez', NULL),
  ('Lavandiya London Se Layenge', 'Khesari Lal Yadav', NULL),
  ('Disco Arranhado (Funk Remix)', 'Malu & DJ Lucas Beat', NULL),
  ('어떤X (What Type of X)', 'Jessi', NULL),
  ('Preta do Cabelo Cacheado', 'Th CDM', NULL),
  ('롤린 (Rollin’)', '브레이브걸스', NULL),
  ('Ah Ellerim Kırılaydı', 'Tuğçe Kandemir', NULL),
  ('Talking to the Moon', 'Bruno Mars', NULL),
  ('¿Quién Te Crees?', 'MC Davo feat. Calibre 50', NULL),
  ('Radha', 'Dhvani Bhanushali & Abhijit Vaghani', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10081; // SELECT last_insert_rowid();

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
  ('2021-03-31 08:21:15.248248', '858', '10067'),
  ('2021-03-31 08:21:15.250250', '858', '10025'),
  ('2021-03-31 08:21:15.252252', '858', '10068'),
  ('2021-03-31 08:21:15.252252', '858', '10069'),
  ('2021-03-31 08:21:15.254254', '858', '10070'),
  ('2021-03-31 08:21:15.254254', '858', '8276'),
  ('2021-03-31 08:21:15.255255', '858', '10032'),
  ('2021-03-31 08:21:15.255255', '858', '10071'),
  ('2021-03-31 08:21:15.256256', '858', '10072'),
  ('2021-03-31 08:21:15.256256', '858', '10073'),
  ('2021-03-31 08:21:15.257257', '858', '10074'),
  ('2021-03-31 08:21:15.257257', '858', '10075'),
  ('2021-03-31 08:21:15.258258', '858', '10076'),
  ('2021-03-31 08:21:15.259259', '858', '10077'),
  ('2021-03-31 08:21:15.259259', '858', '10078'),
  ('2021-03-31 08:21:15.260260', '858', '10079'),
  ('2021-03-31 08:21:15.260260', '858', '10080'),
  ('2021-03-31 08:21:15.261261', '858', '10081')
  ;

  // Update to source_song table
