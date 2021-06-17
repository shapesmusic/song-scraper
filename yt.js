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
    ('YouTube', 'Global Top Songs', 'Week of Jun 10, 2021', '2021-06-10 12:00:00.000000', 'https://charts.youtube.com/charts/TopSongs/global/20210604-20210610');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 940; // SELECT last_insert_rowid();
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
        "title": "Yonaguni",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2021-06-17 12:10:55.464464",
        "source_id": 940,
        "song_id": 10517,
        "duplicate": true
    },
    {
        "title": "Baarish Ban Jaana",
        "artist_name": "Payal Dev",
        "video_id": null,
        "capture_date": "2021-06-17 12:10:55.466466",
        "source_id": 940,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Alcohol-Free",
        "artist_name": "TWICE",
        "video_id": null,
        "capture_date": "2021-06-17 12:10:55.466466",
        "source_id": 940,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bedardi Se Pyaar Ka",
        "artist_name": "Jubin Nautiyal",
        "video_id": null,
        "capture_date": "2021-06-17 12:10:55.467467",
        "source_id": 940,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Love Again",
        "artist_name": "Dua Lipa",
        "video_id": null,
        "capture_date": "2021-06-17 12:10:55.467467",
        "source_id": 940,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Don't fight the feeling",
        "artist_name": "EXO",
        "video_id": null,
        "capture_date": "2021-06-17 12:10:55.468468",
        "source_id": 940,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sevmedim Deme",
        "artist_name": "Kurtuluş Kuş",
        "video_id": null,
        "capture_date": "2021-06-17 12:10:55.468468",
        "source_id": 940,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Pudina Ae Haseena",
        "artist_name": "Pawan Singh",
        "video_id": null,
        "capture_date": "2021-06-17 12:10:55.469469",
        "source_id": 940,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "0X1=LOVESONG (I Know I Love You)",
        "artist_name": "TOMORROW X TOGETHER feat. Seori",
        "video_id": null,
        "capture_date": "2021-06-17 12:10:55.469469",
        "source_id": 940,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "happier",
        "artist_name": "Olivia Rodrigo",
        "video_id": null,
        "capture_date": "2021-06-17 12:10:55.470470",
        "source_id": 940,
        "song_id": 10469,
        "duplicate": true
    },
    {
        "title": "Pagla Pagli 2 Song",
        "artist_name": "ZB",
        "video_id": null,
        "capture_date": "2021-06-17 12:10:55.471471",
        "source_id": 940,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Pale Blue",
        "artist_name": "Kenshi Yonezu",
        "video_id": null,
        "capture_date": "2021-06-17 12:10:55.471471",
        "source_id": 940,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Kabira",
        "artist_name": "Jubin Nautiyal",
        "video_id": null,
        "capture_date": "2021-06-17 12:10:55.471471",
        "source_id": 940,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Tere Ishq Mein Naachenge",
        "artist_name": "Kumar Sanu",
        "video_id": null,
        "capture_date": "2021-06-17 12:10:55.472472",
        "source_id": 940,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bicycle",
        "artist_name": "RM",
        "video_id": null,
        "capture_date": "2021-06-17 12:10:55.472472",
        "source_id": 940,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Petrouchka",
        "artist_name": "Soso Maness feat. PLK",
        "video_id": null,
        "capture_date": "2021-06-17 12:10:55.472472",
        "source_id": 940,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Save",
        "artist_name": "NCT 127",
        "video_id": null,
        "capture_date": "2021-06-17 12:10:55.473473",
        "source_id": 940,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Somebody That I Used To Know",
        "artist_name": "Gotye",
        "video_id": null,
        "capture_date": "2021-06-17 12:10:55.473473",
        "source_id": 940,
        "song_id": 5580,
        "duplicate": true
    },
    {
        "title": "Pani Di Gal",
        "artist_name": "Maninder Buttar",
        "video_id": null,
        "capture_date": "2021-06-17 12:10:55.473473",
        "source_id": 940,
        "song_id": 10203,
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
  ('Baarish Ban Jaana', 'Payal Dev', NULL),
  ('Alcohol-Free', 'TWICE', NULL),
  ('Bedardi Se Pyaar Ka', 'Jubin Nautiyal', NULL),
  ('Love Again', 'Dua Lipa', NULL),
  ('Don’t fight the feeling', 'EXO', NULL),
  ('Sevmedim Deme', 'Kurtuluş Kuş', NULL),
  ('Pudina Ae Haseena', 'Pawan Singh', NULL),
  ('0X1=LOVESONG (I Know I Love You)', 'TOMORROW X TOGETHER feat. Seori', NULL),
  ('Pagla Pagli 2 Song', 'ZB', NULL),
  ('Pale Blue', 'Kenshi Yonezu', NULL),
  ('Kabira', 'Jubin Nautiyal', NULL),
  ('Tere Ishq Mein Naachenge', 'Kumar Sanu', NULL),
  ('Bicycle', 'RM', NULL),
  ('Petrouchka', 'Soso Maness feat. PLK', NULL),
  ('Save', 'NCT 127', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10598; // SELECT last_insert_rowid();

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
  ('2021-06-17 12:10:55.464464', '940', '10517'),
  ('2021-06-17 12:10:55.466466', '940', '10584'),
  ('2021-06-17 12:10:55.466466', '940', '10585'),
  ('2021-06-17 12:10:55.467467', '940', '10586'),
  ('2021-06-17 12:10:55.467467', '940', '10587'),
  ('2021-06-17 12:10:55.468468', '940', '10588'),
  ('2021-06-17 12:10:55.468468', '940', '10589'),
  ('2021-06-17 12:10:55.469469', '940', '10590'),
  ('2021-06-17 12:10:55.469469', '940', '10591'),
  ('2021-06-17 12:10:55.470470', '940', '10469'),
  ('2021-06-17 12:10:55.471471', '940', '10592'),
  ('2021-06-17 12:10:55.471471', '940', '10593'),
  ('2021-06-17 12:10:55.471471', '940', '10594'),
  ('2021-06-17 12:10:55.472472', '940', '10595'),
  ('2021-06-17 12:10:55.472472', '940', '10596'),
  ('2021-06-17 12:10:55.472472', '940', '10597'),
  ('2021-06-17 12:10:55.473473', '940', '10598'),
  ('2021-06-17 12:10:55.473473', '940', '5580'),
  ('2021-06-17 12:10:55.473473', '940', '10203')
  ;

  // Update to source_song table
