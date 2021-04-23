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
    ('YouTube', 'Global Top Songs', 'Week of Apr 15, 2021', '2021-04-15 12:00:00.000000', 'https://charts.youtube.com/charts/TopSongs/global/20210409-20210415');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 887; // SELECT last_insert_rowid();
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
        "title": "Dame Tu Cosita",
        "artist_name": "El Chombo",
        "video_id": null,
        "capture_date": "2021-04-22 09:33:25.822822",
        "source_id": 887,
        "song_id": 1872,
        "duplicate": true
    },
    {
        "title": "Kiss Me More",
        "artist_name": "Doja Cat feat. SZA",
        "video_id": null,
        "capture_date": "2021-04-22 09:33:25.822822",
        "source_id": 887,
        "song_id": 10188,
        "duplicate": true
    },
    {
        "title": "RAPSTAR",
        "artist_name": "Polo G",
        "video_id": null,
        "capture_date": "2021-04-22 09:33:25.823823",
        "source_id": 887,
        "song_id": 10187,
        "duplicate": true
    },
    {
        "title": "Time To Rise",
        "artist_name": "VannDa-វណ្ណដា",
        "video_id": null,
        "capture_date": "2021-04-22 09:33:25.826826",
        "source_id": 887,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Jamaica to India",
        "artist_name": "Emiway Bantai",
        "video_id": null,
        "capture_date": "2021-04-22 09:33:25.826826",
        "source_id": 887,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Ruff Ryders' Anthem",
        "artist_name": "DMX",
        "video_id": null,
        "capture_date": "2021-04-22 09:33:25.826826",
        "source_id": 887,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Vida Louca",
        "artist_name": "Mc Poze do Rodo",
        "video_id": null,
        "capture_date": "2021-04-22 09:33:25.829829",
        "source_id": 887,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Volta Bebê, Volta Neném",
        "artist_name": "Dj Guuga feat. DJ Ivis",
        "video_id": null,
        "capture_date": "2021-04-22 09:33:25.829829",
        "source_id": 887,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Is Qadar",
        "artist_name": "Tulsi Kumar",
        "video_id": null,
        "capture_date": "2021-04-22 09:33:25.830830",
        "source_id": 887,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mood",
        "artist_name": "24kGoldn feat. Iann Dior",
        "video_id": null,
        "capture_date": "2021-04-22 09:33:25.831831",
        "source_id": 887,
        "song_id": 9007,
        "duplicate": true
    },
    {
        "title": "Am",
        "artist_name": "Nio Garcia",
        "video_id": null,
        "capture_date": "2021-04-22 09:33:25.832832",
        "source_id": 887,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "EL BARCO",
        "artist_name": "Karol G",
        "video_id": null,
        "capture_date": "2021-04-22 09:33:25.832832",
        "source_id": 887,
        "song_id": 10131,
        "duplicate": true
    },
    {
        "title": "Liberdade (Quando o Grave Bate Forte)",
        "artist_name": "Alok",
        "video_id": null,
        "capture_date": "2021-04-22 09:33:25.833833",
        "source_id": 887,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Rasputin (Live)",
        "artist_name": "Boney M",
        "video_id": null,
        "capture_date": "2021-04-22 09:33:25.833833",
        "source_id": 887,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Oh Sanam",
        "artist_name": "Tony Kakkar",
        "video_id": null,
        "capture_date": "2021-04-22 09:33:25.834834",
        "source_id": 887,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Vou Falar Que Não Quero",
        "artist_name": "DJ Lucas Beat",
        "video_id": null,
        "capture_date": "2021-04-22 09:33:25.834834",
        "source_id": 887,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Otra Noche Sin Ti",
        "artist_name": "J Balvin",
        "video_id": null,
        "capture_date": "2021-04-22 09:33:25.834834",
        "source_id": 887,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "X Gon' Give It To Ya",
        "artist_name": "DMX",
        "video_id": null,
        "capture_date": "2021-04-22 09:33:25.835835",
        "source_id": 887,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Travesuras (Remix)",
        "artist_name": "Nio Garcia",
        "video_id": null,
        "capture_date": "2021-04-22 09:33:25.835835",
        "source_id": 887,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Agg Att Koka Kehar",
        "artist_name": "Baani Sandhu",
        "video_id": null,
        "capture_date": "2021-04-22 09:33:25.836836",
        "source_id": 887,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Take Me To Church",
        "artist_name": "Hozier",
        "video_id": null,
        "capture_date": "2021-04-22 09:33:25.836836",
        "source_id": 887,
        "song_id": 4100,
        "duplicate": true
    },
    {
        "title": "Millones",
        "artist_name": "Camilo",
        "video_id": null,
        "capture_date": "2021-04-22 09:33:25.836836",
        "source_id": 887,
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
  ('Time To Rise', 'VannDa-វណ្ណដា', NULL),
  ('Jamaica to India', 'Emiway Bantai', NULL),
  ('Ruff Ryders’ Anthem', 'DMX', NULL),
  ('Vida Louca', 'Mc Poze do Rodo', NULL),
  ('Volta Bebê, Volta Neném', 'Dj Guuga feat. DJ Ivis', NULL),
  ('Is Qadar', 'Tulsi Kumar', NULL),
  ('Am', 'Nio Garcia', NULL),
  ('Liberdade (Quando o Grave Bate Forte)', 'Alok', NULL),
  ('Rasputin (Live)', 'Boney M', NULL),
  ('Oh Sanam', 'Tony Kakkar', NULL),
  ('Vou Falar Que Não Quero', 'DJ Lucas Beat', NULL),
  ('Otra Noche Sin Ti', 'J Balvin', NULL),
  ('X Gon’ Give It To Ya', 'DMX', NULL),
  ('Travesuras (Remix)', 'Nio Garcia', NULL),
  ('Agg Att Koka Kehar', 'Baani Sandhu', NULL),
  ('Millones', 'Camilo', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10234; // SELECT last_insert_rowid();

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
  ('2021-04-22 09:33:25.822822', '887', '1872'),
  ('2021-04-22 09:33:25.822822', '887', '10188'),
  ('2021-04-22 09:33:25.823823', '887', '10187'),
  ('2021-04-22 09:33:25.826826', '887', '10219'),
  ('2021-04-22 09:33:25.826826', '887', '10220'),
  ('2021-04-22 09:33:25.826826', '887', '10221'),
  ('2021-04-22 09:33:25.829829', '887', '10222'),
  ('2021-04-22 09:33:25.829829', '887', '10223'),
  ('2021-04-22 09:33:25.830830', '887', '10224'),
  ('2021-04-22 09:33:25.831831', '887', '9007'),
  ('2021-04-22 09:33:25.832832', '887', '10225'),
  ('2021-04-22 09:33:25.832832', '887', '10131'),
  ('2021-04-22 09:33:25.833833', '887', '10226'),
  ('2021-04-22 09:33:25.833833', '887', '10227'),
  ('2021-04-22 09:33:25.834834', '887', '10228'),
  ('2021-04-22 09:33:25.834834', '887', '10229'),
  ('2021-04-22 09:33:25.834834', '887', '10230'),
  ('2021-04-22 09:33:25.835835', '887', '10231'),
  ('2021-04-22 09:33:25.835835', '887', '10232'),
  ('2021-04-22 09:33:25.836836', '887', '10233'),
  ('2021-04-22 09:33:25.836836', '887', '4100'),
  ('2021-04-22 09:33:25.836836', '887', '10234')
  ;

  // Update to source_song table
