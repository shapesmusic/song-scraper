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
    ('YouTube', 'Global Top Songs', 'Week of Apr 29, 2021', '2021-04-29 12:00:00.000000', 'https://charts.youtube.com/charts/TopSongs/global/20210423-20210429');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 906; // SELECT last_insert_rowid();
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
        "title": "Botella Tras Botella",
        "artist_name": "Gera Mx",
        "video_id": null,
        "capture_date": "2021-05-07 06:03:30.631631",
        "source_id": 906,
        "song_id": 10300,
        "duplicate": true
    },
    {
        "title": "Wafa Na Raas Aayee",
        "artist_name": "Jubin Nautiyal",
        "video_id": null,
        "capture_date": "2021-05-07 06:03:30.634634",
        "source_id": 906,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Seeti Maar",
        "artist_name": "Kamaal Khan",
        "video_id": null,
        "capture_date": "2021-05-07 06:03:30.635635",
        "source_id": 906,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Drunk-Dazed",
        "artist_name": "ENHYPEN",
        "video_id": null,
        "capture_date": "2021-05-07 06:03:30.637637",
        "source_id": 906,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Ram Pam Pam",
        "artist_name": "Natti Natasha",
        "video_id": null,
        "capture_date": "2021-05-07 06:03:30.637637",
        "source_id": 906,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Is Qadar",
        "artist_name": "Tulsi Kumar",
        "video_id": null,
        "capture_date": "2021-05-07 06:03:30.638638",
        "source_id": 906,
        "song_id": 10224,
        "duplicate": true
    },
    {
        "title": "Lavandiya London Se Layenge",
        "artist_name": "Ritesh Pandey",
        "video_id": null,
        "capture_date": "2021-05-07 06:03:30.638638",
        "source_id": 906,
        "song_id": 10073,
        "duplicate": true
    },
    {
        "title": "EL PONY",
        "artist_name": "Daddy Yankee",
        "video_id": null,
        "capture_date": "2021-05-07 06:03:30.638638",
        "source_id": 906,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "On Me",
        "artist_name": "Lil Baby",
        "video_id": null,
        "capture_date": "2021-05-07 06:03:30.639639",
        "source_id": 906,
        "song_id": 9624,
        "duplicate": true
    },
    {
        "title": "Tu Bhi Sataya Jayega",
        "artist_name": "Vishal Mishra",
        "video_id": null,
        "capture_date": "2021-05-07 06:03:30.639639",
        "source_id": 906,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Kura Kura",
        "artist_name": "TWICE",
        "video_id": null,
        "capture_date": "2021-05-07 06:03:30.639639",
        "source_id": 906,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mencari Cinta",
        "artist_name": "NOAH feat. Bunga Citra Lestari",
        "video_id": null,
        "capture_date": "2021-05-07 06:03:30.640640",
        "source_id": 906,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Body",
        "artist_name": "Russ",
        "video_id": null,
        "capture_date": "2021-05-07 06:03:30.640640",
        "source_id": 906,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sona Kitna Sona Hai",
        "artist_name": "Udit Narayan Jha",
        "video_id": null,
        "capture_date": "2021-05-07 06:03:30.640640",
        "source_id": 906,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Aquí Abajo",
        "artist_name": "Christian Nodal",
        "video_id": null,
        "capture_date": "2021-05-07 06:03:30.640640",
        "source_id": 906,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Chumma Lebau Othava Pe",
        "artist_name": "Gunjan Singh",
        "video_id": null,
        "capture_date": "2021-05-07 06:03:30.641641",
        "source_id": 906,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Volta Comigo BB",
        "artist_name": "Zé Vaqueiro",
        "video_id": null,
        "capture_date": "2021-05-07 06:03:30.641641",
        "source_id": 906,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bzrp Music Sessions, Vol. 39",
        "artist_name": "Bizarrap",
        "video_id": null,
        "capture_date": "2021-05-07 06:03:30.641641",
        "source_id": 906,
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
  ('Wafa Na Raas Aayee', 'Jubin Nautiyal', NULL),
  ('Seeti Maar', 'Kamaal Khan', NULL),
  ('Drunk-Dazed', 'ENHYPEN', NULL),
  ('Ram Pam Pam', 'Natti Natasha', NULL),
  ('EL PONY', 'Daddy Yankee', NULL),
  ('Tu Bhi Sataya Jayega', 'Vishal Mishra', NULL),
  ('Kura Kura', 'TWICE', NULL),
  ('Mencari Cinta', 'NOAH feat. Bunga Citra Lestari', NULL),
  ('Body', 'Russ', NULL),
  ('Sona Kitna Sona Hai', 'Udit Narayan Jha', NULL),
  ('Aquí Abajo', 'Christian Nodal', NULL),
  ('Chumma Lebau Othava Pe', 'Gunjan Singh', NULL),
  ('Volta Comigo BB', 'Zé Vaqueiro', NULL),
  ('Bzrp Music Sessions, Vol. 39', 'Bizarrap', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10328; // SELECT last_insert_rowid();

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
  ('2021-05-07 06:03:30.631631', '906', '10300'),
  ('2021-05-07 06:03:30.634634', '906', '10315'),
  ('2021-05-07 06:03:30.635635', '906', '10316'),
  ('2021-05-07 06:03:30.637637', '906', '10317'),
  ('2021-05-07 06:03:30.637637', '906', '10318'),
  ('2021-05-07 06:03:30.638638', '906', '10224'),
  ('2021-05-07 06:03:30.638638', '906', '10073'),
  ('2021-05-07 06:03:30.638638', '906', '10319'),
  ('2021-05-07 06:03:30.639639', '906', '9624'),
  ('2021-05-07 06:03:30.639639', '906', '10320'),
  ('2021-05-07 06:03:30.639639', '906', '10321'),
  ('2021-05-07 06:03:30.640640', '906', '10322'),
  ('2021-05-07 06:03:30.640640', '906', '10323'),
  ('2021-05-07 06:03:30.640640', '906', '10324'),
  ('2021-05-07 06:03:30.640640', '906', '10325'),
  ('2021-05-07 06:03:30.641641', '906', '10326'),
  ('2021-05-07 06:03:30.641641', '906', '10327'),
  ('2021-05-07 06:03:30.641641', '906', '10328')
  ;

  // Update to source_song table
