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
    ('YouTube', 'Global Top Songs', 'Week of May 6, 2021', '2021-05-06 12:00:00.000000', 'https://charts.youtube.com/charts/TopSongs/global/20210430-20210506');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 912; // SELECT last_insert_rowid();
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
        "title": "In the morning",
        "artist_name": "ITZY",
        "video_id": null,
        "capture_date": "2021-05-14 07:52:11.216216",
        "source_id": 912,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Your Power",
        "artist_name": "Billie Eilish",
        "video_id": null,
        "capture_date": "2021-05-14 07:52:11.218218",
        "source_id": 912,
        "song_id": 10313,
        "duplicate": true
    },
    {
        "title": "Muộn Rồi Mà Sao Còn",
        "artist_name": "Sơn Tùng M-TP",
        "video_id": null,
        "capture_date": "2021-05-14 07:52:11.219219",
        "source_id": 912,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Doob Gaye",
        "artist_name": "Guru Randhawa",
        "video_id": null,
        "capture_date": "2021-05-14 07:52:11.220220",
        "source_id": 912,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bipolar",
        "artist_name": "MC Don Juan",
        "video_id": null,
        "capture_date": "2021-05-14 07:52:11.220220",
        "source_id": 912,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dil De Diya",
        "artist_name": "Kamaal Khan",
        "video_id": null,
        "capture_date": "2021-05-14 07:52:11.221221",
        "source_id": 912,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Miénteme",
        "artist_name": "TINI",
        "video_id": null,
        "capture_date": "2021-05-14 07:52:11.221221",
        "source_id": 912,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "ทน",
        "artist_name": "Sprite",
        "video_id": null,
        "capture_date": "2021-05-14 07:52:11.222222",
        "source_id": 912,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "SORRY NOT SORRY (feat. Nas, JAY-Z & James Fauntleroy)",
        "artist_name": "DJ Khaled",
        "video_id": null,
        "capture_date": "2021-05-14 07:52:11.222222",
        "source_id": 912,
        "song_id": 10309,
        "duplicate": true
    },
    {
        "title": "Girl From Rio",
        "artist_name": "Anitta",
        "video_id": null,
        "capture_date": "2021-05-14 07:52:11.223223",
        "source_id": 912,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Seeti Maar",
        "artist_name": "Jaspreet Jasz",
        "video_id": null,
        "capture_date": "2021-05-14 07:52:11.223223",
        "source_id": 912,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "8 Raflaan (feat. Gurlez Akhtar)",
        "artist_name": "Mankirt Aulakh",
        "video_id": null,
        "capture_date": "2021-05-14 07:52:11.223223",
        "source_id": 912,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Confetti (feat. Saweetie)",
        "artist_name": "Little Mix",
        "video_id": null,
        "capture_date": "2021-05-14 07:52:11.224224",
        "source_id": 912,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dick (feat. Doja Cat)",
        "artist_name": "StarBoi3",
        "video_id": null,
        "capture_date": "2021-05-14 07:52:11.225225",
        "source_id": 912,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "ແພງອ້າຍ (feat. NUTDAO, แบกือ & BigYai)",
        "artist_name": "Sophana",
        "video_id": null,
        "capture_date": "2021-05-14 07:52:11.225225",
        "source_id": 912,
        "song_id": 10271,
        "duplicate": true
    },
    {
        "title": "L-Gante Rkt",
        "artist_name": "Papu DJ",
        "video_id": null,
        "capture_date": "2021-05-14 07:52:11.226226",
        "source_id": 912,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "踊",
        "artist_name": "Ado",
        "video_id": null,
        "capture_date": "2021-05-14 07:52:11.226226",
        "source_id": 912,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "After School",
        "artist_name": "Weeekly",
        "video_id": null,
        "capture_date": "2021-05-14 07:52:11.226226",
        "source_id": 912,
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
  ('In the morning', 'ITZY', NULL),
  ('Muộn Rồi Mà Sao Còn', 'Sơn Tùng M-TP', NULL),
  ('Doob Gaye', 'Guru Randhawa', NULL),
  ('Bipolar', 'MC Don Juan', NULL),
  ('Dil De Diya', 'Kamaal Khan', NULL),
  ('Miénteme', 'TINI', NULL),
  ('ทน', 'Sprite', NULL),
  ('Girl From Rio', 'Anitta', NULL),
  ('Seeti Maar', 'Jaspreet Jasz', NULL),
  ('8 Raflaan (feat. Gurlez Akhtar)', 'Mankirt Aulakh', NULL),
  ('Confetti (feat. Saweetie)', 'Little Mix', NULL),
  ('Dick (feat. Doja Cat)', 'StarBoi3', NULL),
  ('L-Gante Rkt', 'Papu DJ', NULL),
  ('踊', 'Ado', NULL),
  ('After School', 'Weeekly', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10379; // SELECT last_insert_rowid();

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
  ('2021-05-14 07:52:11.216216', '912', '10365'),
  ('2021-05-14 07:52:11.218218', '912', '10313'),
  ('2021-05-14 07:52:11.219219', '912', '10366'),
  ('2021-05-14 07:52:11.220220', '912', '10367'),
  ('2021-05-14 07:52:11.220220', '912', '10368'),
  ('2021-05-14 07:52:11.221221', '912', '10369'),
  ('2021-05-14 07:52:11.221221', '912', '10370'),
  ('2021-05-14 07:52:11.222222', '912', '10371'),
  ('2021-05-14 07:52:11.222222', '912', '10309'),
  ('2021-05-14 07:52:11.223223', '912', '10372'),
  ('2021-05-14 07:52:11.223223', '912', '10373'),
  ('2021-05-14 07:52:11.223223', '912', '10374'),
  ('2021-05-14 07:52:11.224224', '912', '10375'),
  ('2021-05-14 07:52:11.225225', '912', '10376'),
  ('2021-05-14 07:52:11.225225', '912', '10271'),
  ('2021-05-14 07:52:11.226226', '912', '10377'),
  ('2021-05-14 07:52:11.226226', '912', '10378'),
  ('2021-05-14 07:52:11.226226', '912', '10379')
  ;

  // Update to source_song table
