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
    ('YouTube', 'Global Top Songs', 'Week of May 13, 2021', '2021-05-13 12:00:00.000000', 'https://charts.youtube.com/charts/TopSongs/global/20210507-20210513');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 915; // SELECT last_insert_rowid();
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
        "title": "맛 (Hot Sauce)",
        "artist_name": "NCT DREAM",
        "video_id": null,
        "capture_date": "2021-05-27 06:03:58",
        "source_id": 915,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "नदी बिचे नईया डोले",
        "artist_name": "Shilpi Raj",
        "video_id": null,
        "capture_date": "2021-05-27 06:03:58",
        "source_id": 915,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Miss The Rage",
        "artist_name": "Trippie Redd feat. Playboi Carti",
        "video_id": null,
        "capture_date": "2021-05-27 06:03:58",
        "source_id": 915,
        "song_id": 10352,
        "duplicate": true
    },
    {
        "title": "कुँवारे में गंगा नहईले बानी 2",
        "artist_name": "Ankush Raja & Shilpi Raj",
        "video_id": "MQLSxKwVmJU",
        "capture_date": "2021-05-27 06:03:58",
        "source_id": 915,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "La Mamá de la Mamá",
        "artist_name": "El Alfa, Chael Produciendo, CJ & El Cherry Scom",
        "video_id": "s5yRZOQ3EWI",
        "capture_date": "2021-05-27 06:03:58",
        "source_id": 915,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "LET IT GO",
        "artist_name": "DJ Khaled feat. Justin Bieber & 21 Savage",
        "video_id": "QRZJNqoJQFY",
        "capture_date": "2021-05-27 06:03:58",
        "source_id": 915,
        "song_id": 10340,
        "duplicate": true
    },
    {
        "title": "Radhe Title Track",
        "artist_name": "Sajid–Wajid",
        "video_id": "jA3XkD8k8-A",
        "capture_date": "2021-05-27 06:03:58",
        "source_id": 915,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Krvn",
        "artist_name": "Uzi",
        "video_id": "8OQMEeOXGWI",
        "capture_date": "2021-05-27 06:03:58",
        "source_id": 915,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Calling My Phone",
        "artist_name": "Lil Tjay & 6LACK",
        "video_id": "zzd4ydafGR0",
        "capture_date": "2021-05-27 06:03:58",
        "source_id": 915,
        "song_id": 9786,
        "duplicate": true
    },
    {
        "title": "2/Catorce",
        "artist_name": "Rauw Alejandro",
        "video_id": null,
        "capture_date": "2021-05-27 06:03:58.384384",
        "source_id": 915,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Poblado",
        "artist_name": "Crissin",
        "video_id": null,
        "capture_date": "2021-05-27 06:03:58.385385",
        "source_id": 915,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Rod Roast Yourself",
        "artist_name": "Rod Contreras",
        "video_id": null,
        "capture_date": "2021-05-27 06:03:58.385385",
        "source_id": 915,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mood",
        "artist_name": "24kGoldn feat. Iann Dior",
        "video_id": null,
        "capture_date": "2021-05-27 06:03:58.386386",
        "source_id": 915,
        "song_id": 9007,
        "duplicate": true
    },
    {
        "title": "Tipo Gin (Ao Vivo)",
        "artist_name": "MC Kevin o Chris",
        "video_id": null,
        "capture_date": "2021-05-27 06:03:58.386386",
        "source_id": 915,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "दुई रूपया",
        "artist_name": "Khesari Lal Yadav",
        "video_id": null,
        "capture_date": "2021-05-27 06:03:58.386386",
        "source_id": 915,
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
  ('맛 (Hot Sauce)', 'NCT DREAM', NULL),
  ('नदी बिचे नईया डोले', 'Shilpi Raj', NULL),
  ('कुँवारे में गंगा नहईले बानी 2', 'Ankush Raja & Shilpi Raj', NULL),
  ('La Mamá de la Mamá', 'El Alfa, Chael Produciendo, CJ & El Cherry Scom', NULL),
  ('Radhe Title Track', 'Sajid–Wajid', NULL),
  ('Krvn', 'Uzi', NULL),
  ('2/Catorce', 'Rauw Alejandro', NULL),
  ('Poblado', 'Crissin', NULL),
  ('Rod Roast Yourself', 'Rod Contreras', NULL),
  ('Tipo Gin (Ao Vivo)', 'MC Kevin o Chris', NULL),
  ('दुई रूपया', 'Khesari Lal Yadav', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10406; // SELECT last_insert_rowid();

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
  ('2021-05-27 06:03:58', '915', '10396'),
  ('2021-05-27 06:03:58', '915', '10397'),
  ('2021-05-27 06:03:58', '915', '10352'),
  ('2021-05-27 06:03:58', '915', '10398'),
  ('2021-05-27 06:03:58', '915', '10399'),
  ('2021-05-27 06:03:58', '915', '10340'),
  ('2021-05-27 06:03:58', '915', '10400'),
  ('2021-05-27 06:03:58', '915', '10401'),
  ('2021-05-27 06:03:58', '915', '9786'),
  ('2021-05-27 06:03:58.384384', '915', '10402'),
  ('2021-05-27 06:03:58.385385', '915', '10403'),
  ('2021-05-27 06:03:58.385385', '915', '10404'),
  ('2021-05-27 06:03:58.386386', '915', '9007'),
  ('2021-05-27 06:03:58.386386', '915', '10405'),
  ('2021-05-27 06:03:58.386386', '915', '10406')
  ;

  // Update to source_song table
