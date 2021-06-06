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
    ('YouTube', 'Global Top Songs', 'Week of May 27, 2021', '2021-05-27 12:00:00.000000', 'https://charts.youtube.com/charts/TopSongs/global/20210521-20210527');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 932; // SELECT last_insert_rowid();
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
        "title": "Butter",
        "artist_name": "BTS",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27",
        "source_id": 932,
        "song_id": 10466,
        "duplicate": true
    },
    {
        "title": "Todo De Ti",
        "artist_name": "Rauw Alejandro",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27",
        "source_id": 932,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Razzi Bolja",
        "artist_name": "Harjeet Deewana",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27",
        "source_id": 932,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Coco Cola",
        "artist_name": "Ruchika Jangid",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27",
        "source_id": 932,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "SHUM (Live)",
        "artist_name": "Go_A",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27",
        "source_id": 932,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Voilà",
        "artist_name": "Barbara Pravi",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27.613613",
        "source_id": 932,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "SUN GOES DOWN",
        "artist_name": "Lil Nas X",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27",
        "source_id": 932,
        "song_id": 10435,
        "duplicate": true
    },
    {
        "title": "RUSSIAN WOMAN (Live)",
        "artist_name": "Manizha",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27",
        "source_id": 932,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Life Goes On",
        "artist_name": "BTS",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27",
        "source_id": 932,
        "song_id": 9591,
        "duplicate": true
    },
    {
        "title": "US",
        "artist_name": "Sidhu Moose Wala feat. Raja Kumari",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27",
        "source_id": 932,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "MIC Drop (Steve Aoki Remix)",
        "artist_name": "BTS ft. Steve Aoki",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27",
        "source_id": 932,
        "song_id": 10052,
        "duplicate": true
    },
    {
        "title": "Mata Hari",
        "artist_name": "Samira Efendi",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27.615615",
        "source_id": 932,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "malibu",
        "artist_name": "Sangiovanni",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27",
        "source_id": 932,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Film out",
        "artist_name": "BTS",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27",
        "source_id": 932,
        "song_id": 10121,
        "duplicate": true
    },
    {
        "title": "traitor",
        "artist_name": "Olivia Rodrigo",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27",
        "source_id": 932,
        "song_id": 10437,
        "duplicate": true
    },
    {
        "title": "enough for you",
        "artist_name": "Olivia Rodrigo",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27.616616",
        "source_id": 932,
        "song_id": 10468,
        "duplicate": true
    },
    {
        "title": "ZITTI E BUONI",
        "artist_name": "Måneskin",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27",
        "source_id": 932,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "IDOL",
        "artist_name": "BTS",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27",
        "source_id": 932,
        "song_id": 1294,
        "duplicate": true
    },
    {
        "title": "Pretty Savage",
        "artist_name": "BLACKPINK",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27",
        "source_id": 932,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Doutora 3",
        "artist_name": "Mc Kevin",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27.618618",
        "source_id": 932,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Saturno",
        "artist_name": "Pablo Alborán",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27",
        "source_id": 932,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Me Rehúso",
        "artist_name": "Danny Ocean",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27",
        "source_id": 932,
        "song_id": 2816,
        "duplicate": true
    },
    {
        "title": "GANG GANG",
        "artist_name": "Polo G & Lil Wayne",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27",
        "source_id": 932,
        "song_id": 10430,
        "duplicate": true
    },
    {
        "title": "Na Ponta do Pé (Brega Funk)",
        "artist_name": "Nadson O Ferinha",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27",
        "source_id": 932,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "ON",
        "artist_name": "BTS",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27.620620",
        "source_id": 932,
        "song_id": 8147,
        "duplicate": true
    },
    {
        "title": "Dile a Él",
        "artist_name": "Rauw Alejandro",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27.620620",
        "source_id": 932,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Pardesia",
        "artist_name": "Khesari Lal Yadav & Shilpi Raj",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27",
        "source_id": 932,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Baby Me Atende",
        "artist_name": "Matheus Fernandes & Dilsinho",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27",
        "source_id": 932,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "PROBLEMA",
        "artist_name": "Daddy Yankee",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27.621621",
        "source_id": 932,
        "song_id": 9927,
        "duplicate": true
    },
    {
        "title": "Jalebi Baby",
        "artist_name": "Tesher",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27.621621",
        "source_id": 932,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "10 Years (Live)",
        "artist_name": "Daði Freyr",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27.621621",
        "source_id": 932,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Calling My Phone",
        "artist_name": "Lil Tjay & 6LACK",
        "video_id": null,
        "capture_date": "2021-06-06 03:35:27",
        "source_id": 932,
        "song_id": 9786,
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
  ('Todo De Ti', 'Rauw Alejandro', NULL),
  ('Razzi Bolja', 'Harjeet Deewana', NULL),
  ('Coco Cola', 'Ruchika Jangid', NULL),
  ('SHUM (Live)', 'Go_A', NULL),
  ('Voilà', 'Barbara Pravi', NULL),
  ('RUSSIAN WOMAN (Live)', 'Manizha', NULL),
  ('US', 'Sidhu Moose Wala feat. Raja Kumari', NULL),
  ('Mata Hari', 'Samira Efendi', NULL),
  ('malibu', 'Sangiovanni', NULL),
  ('ZITTI E BUONI', 'Måneskin', NULL),
  ('Pretty Savage', 'BLACKPINK', NULL),
  ('Doutora 3', 'Mc Kevin', NULL),
  ('Saturno', 'Pablo Alborán', NULL),
  ('Na Ponta do Pé (Brega Funk)', 'Nadson O Ferinha', NULL),
  ('Dile a Él', 'Rauw Alejandro', NULL),
  ('Pardesia', 'Khesari Lal Yadav & Shilpi Raj', NULL),
  ('Baby Me Atende', 'Matheus Fernandes & Dilsinho', NULL),
  ('Jalebi Baby', 'Tesher', NULL),
  ('10 Years (Live)', 'Daði Freyr', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10498; // SELECT last_insert_rowid();

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
  ('2021-06-06 03:35:27', '932', '10466'),
  ('2021-06-06 03:35:27', '932', '10480'),
  ('2021-06-06 03:35:27', '932', '10481'),
  ('2021-06-06 03:35:27', '932', '10482'),
  ('2021-06-06 03:35:27', '932', '10483'),
  ('2021-06-06 03:35:27.613613', '932', '10484'),
  ('2021-06-06 03:35:27', '932', '10435'),
  ('2021-06-06 03:35:27', '932', '10485'),
  ('2021-06-06 03:35:27', '932', '9591'),
  ('2021-06-06 03:35:27', '932', '10486'),
  ('2021-06-06 03:35:27', '932', '10052'),
  ('2021-06-06 03:35:27.615615', '932', '10487'),
  ('2021-06-06 03:35:27', '932', '10488'),
  ('2021-06-06 03:35:27', '932', '10121'),
  ('2021-06-06 03:35:27', '932', '10437'),
  ('2021-06-06 03:35:27.616616', '932', '10468'),
  ('2021-06-06 03:35:27', '932', '10489'),
  ('2021-06-06 03:35:27', '932', '1294'),
  ('2021-06-06 03:35:27', '932', '10490'),
  ('2021-06-06 03:35:27.618618', '932', '10491'),
  ('2021-06-06 03:35:27', '932', '10492'),
  ('2021-06-06 03:35:27', '932', '2816'),
  ('2021-06-06 03:35:27', '932', '10430'),
  ('2021-06-06 03:35:27', '932', '10493'),
  ('2021-06-06 03:35:27.620620', '932', '8147'),
  ('2021-06-06 03:35:27.620620', '932', '10494'),
  ('2021-06-06 03:35:27', '932', '10495'),
  ('2021-06-06 03:35:27', '932', '10496'),
  ('2021-06-06 03:35:27.621621', '932', '9927'),
  ('2021-06-06 03:35:27.621621', '932', '10497'),
  ('2021-06-06 03:35:27.621621', '932', '10498'),
  ('2021-06-06 03:35:27', '932', '9786')
  ;

  // Update to source_song table
