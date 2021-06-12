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
    ('YouTube', 'Global Top Songs', 'Week of Jun 3, 2021', '2021-06-03 12:00:00.000000', 'https://charts.youtube.com/charts/TopSongs/global/20210528-20210603');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 937; // SELECT last_insert_rowid();
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
        "title": "Dame Tu Cosita",
        "artist_name": "El Chombo feat. Cutty Ranks",
        "video_id": null,
        "capture_date": "2021-06-11 05:48:20.493493",
        "source_id": 937,
        "song_id": 1872,
        "duplicate": true
    },
    {
        "title": "Lost Cause",
        "artist_name": "Billie Eilish",
        "video_id": null,
        "capture_date": "2021-06-11 05:48:20.495495",
        "source_id": 937,
        "song_id": 10536,
        "duplicate": true
    },
    {
        "title": "หนังเรื่องเก่า",
        "artist_name": "เนสกาแฟ ศรีนคร",
        "video_id": null,
        "capture_date": "2021-06-11 05:48:20.495495",
        "source_id": 937,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Qué Más Pues?",
        "artist_name": "J Balvin",
        "video_id": null,
        "capture_date": "2021-06-11 05:48:20.495495",
        "source_id": 937,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Brown Shortie",
        "artist_name": "Sidhu Moose Wala",
        "video_id": null,
        "capture_date": "2021-06-11 05:48:20.496496",
        "source_id": 937,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Lucid Dreams",
        "artist_name": "Juice WRLD",
        "video_id": null,
        "capture_date": "2021-06-11 05:48:20.496496",
        "source_id": 937,
        "song_id": 1961,
        "duplicate": true
    },
    {
        "title": "Enjoy Enjaami",
        "artist_name": "Dhee",
        "video_id": null,
        "capture_date": "2021-06-11 05:48:20.497497",
        "source_id": 937,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "She Gets Away With Everything",
        "artist_name": "FunniFlix",
        "video_id": null,
        "capture_date": "2021-06-11 05:48:20.498498",
        "source_id": 937,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "ممكن (Momken)",
        "artist_name": "Saif Nabeel",
        "video_id": null,
        "capture_date": "2021-06-11 05:48:20.498498",
        "source_id": 937,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I WANNA BE YOUR SLAVE",
        "artist_name": "Måneskin",
        "video_id": null,
        "capture_date": "2021-06-11 05:48:20.498498",
        "source_id": 937,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Te Necesito (Acoustic)",
        "artist_name": "KHEA",
        "video_id": null,
        "capture_date": "2021-06-11 05:48:20.499499",
        "source_id": 937,
        "song_id": 10447,
        "duplicate": true
    },
    {
        "title": "You're Welcome",
        "artist_name": "Dwayne Johnson",
        "video_id": null,
        "capture_date": "2021-06-11 05:48:20.499499",
        "source_id": 937,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Satisfya",
        "artist_name": "Imran Khan",
        "video_id": null,
        "capture_date": "2021-06-11 05:48:20.500500",
        "source_id": 937,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mood",
        "artist_name": "24kGoldn feat. Iann Dior",
        "video_id": null,
        "capture_date": "2021-06-11 05:48:20.500500",
        "source_id": 937,
        "song_id": 9007,
        "duplicate": true
    },
    {
        "title": "Habibty",
        "artist_name": "Hassan Shakosh feat. Yasmin Raeis",
        "video_id": null,
        "capture_date": "2021-06-11 05:48:20.500500",
        "source_id": 937,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "ONLY YOU",
        "artist_name": "GIMS feat. Dhurata Dora",
        "video_id": null,
        "capture_date": "2021-06-11 05:48:20.500500",
        "source_id": 937,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "เพื่อนเล่น ไม่เล่นเพื่อน (Just Being Friendly)",
        "artist_name": "Tilly Birds feat. Milli",
        "video_id": null,
        "capture_date": "2021-06-11 05:48:20.501501",
        "source_id": 937,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Radhe Title Track",
        "artist_name": "Sajid–Wajid",
        "video_id": null,
        "capture_date": "2021-06-11 05:48:20.501501",
        "source_id": 937,
        "song_id": 10400,
        "duplicate": true
    },
    {
        "title": "Vida Louca",
        "artist_name": "Mc Poze do Rodo",
        "video_id": null,
        "capture_date": "2021-06-11 05:48:20.501501",
        "source_id": 937,
        "song_id": 10222,
        "duplicate": true
    },
    {
        "title": "A Cara do Crime (Nós Incomoda)",
        "artist_name": "Mc Poze do Rodo",
        "video_id": null,
        "capture_date": "2021-06-11 05:48:20.501501",
        "source_id": 937,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Outside (Better Days)",
        "artist_name": "MO3",
        "video_id": null,
        "capture_date": "2021-06-11 05:48:20.502502",
        "source_id": 937,
        "song_id": 10512,
        "duplicate": true
    },
    {
        "title": "De Cora <3",
        "artist_name": "Rauw Alejandro",
        "video_id": null,
        "capture_date": "2021-06-11 05:48:20.502502",
        "source_id": 937,
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
  ('หนังเรื่องเก่า', 'เนสกาแฟ ศรีนคร', NULL),
  ('Qué Más Pues?', 'J Balvin', NULL),
  ('Brown Shortie', 'Sidhu Moose Wala', NULL),
  ('Enjoy Enjaami', 'Dhee', NULL),
  ('She Gets Away With Everything', 'FunniFlix', NULL),
  ('ممكن (Momken)', 'Saif Nabeel', NULL),
  ('I WANNA BE YOUR SLAVE', 'Måneskin', NULL),
  ('You’re Welcome', 'Dwayne Johnson', NULL),
  ('Satisfya', 'Imran Khan', NULL),
  ('Habibty', 'Hassan Shakosh feat. Yasmin Raeis', NULL),
  ('ONLY YOU', 'GIMS feat. Dhurata Dora', NULL),
  ('เพื่อนเล่น ไม่เล่นเพื่อน (Just Being Friendly)', 'Tilly Birds feat. Milli', NULL),
  ('A Cara do Crime (Nós Incomoda)', 'Mc Poze do Rodo', NULL),
  ('De Cora <3', 'Rauw Alejandro', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10556; // SELECT last_insert_rowid();

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
  ('2021-06-11 05:48:20.493493', '937', '1872'),
  ('2021-06-11 05:48:20.495495', '937', '10536'),
  ('2021-06-11 05:48:20.495495', '937', '10543'),
  ('2021-06-11 05:48:20.495495', '937', '10544'),
  ('2021-06-11 05:48:20.496496', '937', '10545'),
  ('2021-06-11 05:48:20.496496', '937', '1961'),
  ('2021-06-11 05:48:20.497497', '937', '10546'),
  ('2021-06-11 05:48:20.498498', '937', '10547'),
  ('2021-06-11 05:48:20.498498', '937', '10548'),
  ('2021-06-11 05:48:20.498498', '937', '10549'),
  ('2021-06-11 05:48:20.499499', '937', '10447'),
  ('2021-06-11 05:48:20.499499', '937', '10550'),
  ('2021-06-11 05:48:20.500500', '937', '10551'),
  ('2021-06-11 05:48:20.500500', '937', '9007'),
  ('2021-06-11 05:48:20.500500', '937', '10552'),
  ('2021-06-11 05:48:20.500500', '937', '10553'),
  ('2021-06-11 05:48:20.501501', '937', '10554'),
  ('2021-06-11 05:48:20.501501', '937', '10400'),
  ('2021-06-11 05:48:20.501501', '937', '10222'),
  ('2021-06-11 05:48:20.501501', '937', '10555'),
  ('2021-06-11 05:48:20.502502', '937', '10512'),
  ('2021-06-11 05:48:20.502502', '937', '10556')
  ;

  // Update to source_song table
