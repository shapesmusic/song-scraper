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
    ('YouTube', 'Global Top Songs', 'Week of Apr 1, 2021', '2021-04-01 12:00:00.000000', 'https://charts.youtube.com/charts/TopSongs/global/20210326-20210401');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 876; // SELECT last_insert_rowid();
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
        "title": "MONTERO (Call Me By Your Name)",
        "artist_name": "Lil Nas X",
        "video_id": null,
        "capture_date": "2021-04-06 08:12:10.912912",
        "source_id": 876,
        "song_id": 10082,
        "duplicate": true
    },
    {
        "title": "Hori Khele Raghuveera",
        "artist_name": "Alka Yagnik, Udit Narayan, Amitabh Bachchan & Sukhwinder Singh",
        "video_id": null,
        "capture_date": "2021-04-06 08:12:10.913913",
        "source_id": 876,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "EL MAKINON",
        "artist_name": "Karol G & Mariah Angeliq",
        "video_id": null,
        "capture_date": "2021-04-06 08:12:10.914914",
        "source_id": 876,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Baarish Ki Jaaye",
        "artist_name": "B Praak feat. Nawazuddin Siddiqui & Sunanda Sharma",
        "video_id": null,
        "capture_date": "2021-04-06 08:12:10.914914",
        "source_id": 876,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Film out",
        "artist_name": "BTS",
        "video_id": null,
        "capture_date": "2021-04-06 08:12:10.916916",
        "source_id": 876,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "CHO MÌNH EM",
        "artist_name": "Binz & Đen",
        "video_id": null,
        "capture_date": "2021-04-06 08:12:10.916916",
        "source_id": 876,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Kismat Teri",
        "artist_name": "Inder Chahal",
        "video_id": null,
        "capture_date": "2021-04-06 08:12:10.916916",
        "source_id": 876,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Kekra Sang Khelme Holiya Ge Jaan",
        "artist_name": "Prabha Raj",
        "video_id": null,
        "capture_date": "2021-04-06 08:12:10.916916",
        "source_id": 876,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Balam Pichkari",
        "artist_name": "Shalmali Kholgade & Vishal Dadlani",
        "video_id": null,
        "capture_date": "2021-04-06 08:12:10.917917",
        "source_id": 876,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Loot Liya",
        "artist_name": "Khasa Aala Chahar",
        "video_id": null,
        "capture_date": "2021-04-06 08:12:10.917917",
        "source_id": 876,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "MUSAFIR",
        "artist_name": "Korala Maan & Gurlez Akhtar",
        "video_id": null,
        "capture_date": "2021-04-06 08:12:10.917917",
        "source_id": 876,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Rang Barse",
        "artist_name": "Amitabh Bachchan",
        "video_id": null,
        "capture_date": "2021-04-06 08:12:10.918918",
        "source_id": 876,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Tujhe Bhoolna Toh Chaaha",
        "artist_name": "Rochak Kohli & Jubin Nautiyal",
        "video_id": null,
        "capture_date": "2021-04-06 08:12:10.918918",
        "source_id": 876,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "No Hago Coro",
        "artist_name": "GhettoSPM, Farruko & Nino Freestyle",
        "video_id": null,
        "capture_date": "2021-04-06 08:12:10.918918",
        "source_id": 876,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "EL BARCO",
        "artist_name": "Karol G",
        "video_id": null,
        "capture_date": "2021-04-06 08:12:10.919919",
        "source_id": 876,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Tombstone",
        "artist_name": "Rod Wave",
        "video_id": null,
        "capture_date": "2021-04-06 08:12:10.919919",
        "source_id": 876,
        "song_id": 10062,
        "duplicate": true
    },
    {
        "title": "La Llevo Al Cielo",
        "artist_name": "Kallde \"El Rey Del Placer\" feat. Chencho Corleone",
        "video_id": null,
        "capture_date": "2021-04-06 08:12:10.919919",
        "source_id": 876,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Take a picture",
        "artist_name": "NiziU",
        "video_id": null,
        "capture_date": "2021-04-06 08:12:10.919919",
        "source_id": 876,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Kutty Pattas",
        "artist_name": "Santhosh Dhayanidhi & Rakshitha Suresh",
        "video_id": null,
        "capture_date": "2021-04-06 08:12:10.919919",
        "source_id": 876,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "廻廻奇譚",
        "artist_name": "Eve",
        "video_id": null,
        "capture_date": "2021-04-06 08:12:10.920920",
        "source_id": 876,
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
  ('Hori Khele Raghuveera', 'Alka Yagnik, Udit Narayan, Amitabh Bachchan & Sukhwinder Singh', NULL),
  ('EL MAKINON', 'Karol G & Mariah Angeliq', NULL),
  ('Baarish Ki Jaaye', 'B Praak feat. Nawazuddin Siddiqui & Sunanda Sharma', NULL),
  ('Film out', 'BTS', NULL),
  ('CHO MÌNH EM', 'Binz & Đen', NULL),
  ('Kismat Teri', 'Inder Chahal', NULL),
  ('Kekra Sang Khelme Holiya Ge Jaan', 'Prabha Raj', NULL),
  ('Balam Pichkari', 'Shalmali Kholgade & Vishal Dadlani', NULL),
  ('Loot Liya', 'Khasa Aala Chahar', NULL),
  ('MUSAFIR', 'Korala Maan & Gurlez Akhtar', NULL),
  ('Rang Barse', 'Amitabh Bachchan', NULL),
  ('Tujhe Bhoolna Toh Chaaha', 'Rochak Kohli & Jubin Nautiyal', NULL),
  ('No Hago Coro', 'GhettoSPM, Farruko & Nino Freestyle', NULL),
  ('EL BARCO', 'Karol G', NULL),
  ('La Llevo Al Cielo', 'Kallde "El Rey Del Placer" feat. Chencho Corleone', NULL),
  ('Take a picture', 'NiziU', NULL),
  ('Kutty Pattas', 'Santhosh Dhayanidhi & Rakshitha Suresh', NULL),
  ('廻廻奇譚', 'Eve', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10135; // SELECT last_insert_rowid();

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
  ('2021-04-06 08:12:10.912912', '876', '10082'),
  ('2021-04-06 08:12:10.913913', '876', '10118'),
  ('2021-04-06 08:12:10.914914', '876', '10119'),
  ('2021-04-06 08:12:10.914914', '876', '10120'),
  ('2021-04-06 08:12:10.916916', '876', '10121'),
  ('2021-04-06 08:12:10.916916', '876', '10122'),
  ('2021-04-06 08:12:10.916916', '876', '10123'),
  ('2021-04-06 08:12:10.916916', '876', '10124'),
  ('2021-04-06 08:12:10.917917', '876', '10125'),
  ('2021-04-06 08:12:10.917917', '876', '10126'),
  ('2021-04-06 08:12:10.917917', '876', '10127'),
  ('2021-04-06 08:12:10.918918', '876', '10128'),
  ('2021-04-06 08:12:10.918918', '876', '10129'),
  ('2021-04-06 08:12:10.918918', '876', '10130'),
  ('2021-04-06 08:12:10.919919', '876', '10131'),
  ('2021-04-06 08:12:10.919919', '876', '10062'),
  ('2021-04-06 08:12:10.919919', '876', '10132'),
  ('2021-04-06 08:12:10.919919', '876', '10133'),
  ('2021-04-06 08:12:10.919919', '876', '10134'),
  ('2021-04-06 08:12:10.920920', '876', '10135')
  ;

  // Update to source_song table
