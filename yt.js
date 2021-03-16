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
    ('YouTube', 'Global Top Songs', 'Week of Mar 11, 2021', '2021-03-11 12:00:00.000000', 'https://charts.youtube.com/charts/TopSongs/global/20210305-20210311');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 849; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName('chart-table-row style-scope ytmc-chart-table');

  songsData = [];

  for (var i=0; i<elements.length; i++){ // if artist_name error, set i < [last successful i + 1], scrape to there, then continue from the next new song through elements.length. (i=36; i<37; gets chart no 37)
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
        "title": "Leave The Door Open",
        "artist_name": "Bruno Mars, Anderson .Paak & Silk Sonic",
        "video_id": null,
        "capture_date": "2021-03-16 10:33:21.198198",
        "source_id": 849,
        "song_id": 9951,
        "duplicate": true
    },
    {
        "title": "Hold On",
        "artist_name": "Justin Bieber",
        "video_id": null,
        "capture_date": "2021-03-16 10:33:21.199199",
        "source_id": 849,
        "song_id": 9952,
        "duplicate": true
    },
    {
        "title": "Además de Mí (Remix)",
        "artist_name": "Rusherking, KHEA, Duki, Maria Becerra, Lit Killah & Tiago PZK",
        "video_id": null,
        "capture_date": "2021-03-16 10:33:21.199199",
        "source_id": 849,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mexico Koka",
        "artist_name": "Karan Aujla",
        "video_id": null,
        "capture_date": "2021-03-16 10:33:21.200200",
        "source_id": 849,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "What’s Next",
        "artist_name": "Drake",
        "video_id": null,
        "capture_date": "2021-03-16 10:33:21.200200",
        "source_id": 849,
        "song_id": 9988,
        "duplicate": true
    },
    {
        "title": "Tera Suit",
        "artist_name": "Tony Kakkar",
        "video_id": null,
        "capture_date": "2021-03-16 10:39:02.183183",
        "source_id": 849,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Fly",
        "artist_name": "Badshah & Uchana Amit",
        "video_id": null,
        "capture_date": "2021-03-16 10:41:08.639639",
        "source_id": 849,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mi Niña (Remix)",
        "artist_name": "Wisin, Myke Towers & Maluma feat. Anitta & Los Legendarios",
        "video_id": null,
        "capture_date": "2021-03-16 10:41:08.640640",
        "source_id": 849,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "911",
        "artist_name": "Sech",
        "video_id": null,
        "capture_date": "2021-03-16 10:41:08.641641",
        "source_id": 849,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Não Pode Se Apaixonar",
        "artist_name": "Xand Avião, DJ Ivis & MC Danny",
        "video_id": null,
        "capture_date": "2021-03-16 10:41:08.641641",
        "source_id": 849,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "왜왜왜 (Why Why Why)",
        "artist_name": "iKON",
        "video_id": null,
        "capture_date": "2021-03-16 10:47:44.431431",
        "source_id": 849,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Chitti",
        "artist_name": "Ram Miriyala",
        "video_id": null,
        "capture_date": "2021-03-16 10:49:38.728728",
        "source_id": 849,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Kannau Hodiyaka",
        "artist_name": "Shreya Ghoshal",
        "video_id": null,
        "capture_date": "2021-03-16 10:49:38.728728",
        "source_id": 849,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "CHIAMAMI PER NOME",
        "artist_name": "Francesca Michielin & Fedez",
        "video_id": null,
        "capture_date": "2021-03-16 10:51:18.944944",
        "source_id": 849,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Namo Namo",
        "artist_name": "Amit Trivedi",
        "video_id": null,
        "capture_date": "2021-03-16 10:55:37.173173",
        "source_id": 849,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "She is beautiful",
        "artist_name": "SP420",
        "video_id": null,
        "capture_date": "2021-03-16 10:55:37.173173",
        "source_id": 849,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Lavandiya London Se Layenge",
        "artist_name": "Ritesh Pandey",
        "video_id": null,
        "capture_date": "2021-03-16 10:57:06.764764",
        "source_id": 849,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sweater Weather",
        "artist_name": "The Neighbourhood",
        "video_id": null,
        "capture_date": "2021-03-16 10:57:06.764764",
        "source_id": 849,
        "song_id": 4778,
        "duplicate": true
    },
    {
        "title": "Bholenath",
        "artist_name": "Kaka",
        "video_id": null,
        "capture_date": "2021-03-16 10:57:06.764764",
        "source_id": 849,
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
  ('Además de Mí (Remix)', 'Rusherking, KHEA, Duki, Maria Becerra, Lit Killah & Tiago PZK', NULL),
  ('Mexico Koka', 'Karan Aujla', NULL),
  ('Tera Suit', 'Tony Kakkar', NULL),
  ('Fly', 'Badshah & Uchana Amit', NULL),
  ('Mi Niña (Remix)', 'Wisin, Myke Towers & Maluma feat. Anitta & Los Legendarios', NULL),
  ('911', 'Sech', NULL),
  ('Não Pode Se Apaixonar', 'Xand Avião, DJ Ivis & MC Danny', NULL),
  ('왜왜왜 (Why Why Why)', 'iKON', NULL),
  ('Chitti', 'Ram Miriyala', NULL),
  ('Kannau Hodiyaka', 'Shreya Ghoshal', NULL),
  ('CHIAMAMI PER NOME', 'Francesca Michielin & Fedez', NULL),
  ('Namo Namo', 'Amit Trivedi', NULL),
  ('She is beautiful', 'SP420', NULL),
  ('Lavandiya London Se Layenge', 'Ritesh Pandey', NULL),
  ('Bholenath', 'Kaka', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10007; // SELECT last_insert_rowid();

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
  ('2021-03-16 10:33:21.198198', '849', '9951'),
  ('2021-03-16 10:33:21.199199', '849', '9952'),
  ('2021-03-16 10:33:21.199199', '849', '9993'),
  ('2021-03-16 10:33:21.200200', '849', '9994'),
  ('2021-03-16 10:33:21.200200', '849', '9988'),
  ('2021-03-16 10:39:02.183183', '849', '9995'),
  ('2021-03-16 10:41:08.639639', '849', '9996'),
  ('2021-03-16 10:41:08.640640', '849', '9997'),
  ('2021-03-16 10:41:08.641641', '849', '9998'),
  ('2021-03-16 10:41:08.641641', '849', '9999'),
  ('2021-03-16 10:47:44.431431', '849', '10000'),
  ('2021-03-16 10:49:38.728728', '849', '10001'),
  ('2021-03-16 10:49:38.728728', '849', '10002'),
  ('2021-03-16 10:51:18.944944', '849', '10003'),
  ('2021-03-16 10:55:37.173173', '849', '10004'),
  ('2021-03-16 10:55:37.173173', '849', '10005'),
  ('2021-03-16 10:57:06.764764', '849', '10006'),
  ('2021-03-16 10:57:06.764764', '849', '4778'),
  ('2021-03-16 10:57:06.764764', '849', '10007')
  ;

  // Update to source_song table
