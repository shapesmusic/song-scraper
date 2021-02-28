//
// Step 0: Check recent scraped
//

  SELECT instance_name FROM source WHERE parent_entity = 'Billboard' ORDER BY publication_date DESC LIMIT 8;


//
// Step 1: Scrape source data
//

  // Add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // Get and format publicationDate
  publicationDate = document.getElementsByClassName('date-selector__button button--link')[0].innerText.trim();
  publicationDateFormatted = moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

  // Get location and format for current or past chart status
  currentChartLocation = window.location.href + "/" + moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD");
  pastChartLocation = window.location.href;

  // Build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'Billboard\', \'The Hot 100\', \'Week of "
    + publicationDate + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + pastChartLocation + "\');" // use pastChartLocation if not the current week's chart, otherwise use currentChartLocation
  )


  // Stage the SQL statement
  // Replace any ' in strings with ’

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('Billboard', 'The Hot 100', 'Week of February 20, 2021', '2021-02-20 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2021-02-20');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 771; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName('chart-list__element display--flex');

  songsData = [];

  for (var i=0; i<elements.length; i++){
      element = elements[i];
      isNew = element.getElementsByClassName('chart-element__trend chart-element__trend--new color--accent');
      songName = element.getElementsByClassName('chart-element__information__song text--truncate color--primary')[0];
      artistName = element.getElementsByClassName('chart-element__information__artist text--truncate color--secondary')[0];

      title = songName.innerText.trim();
      artist_name = artistName.innerText.trim();
      video_id = null;
      capture_date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

      songData = {
        'title' : title,
        'artist_name' : artist_name,
        'video_id' : video_id,
        'capture_date' : capture_date,
        'source_id' : source_id,
        'song_id' : song_id,
        'duplicate' : false
      };

      if(isNew.length == 1 && isNew[0].innerText == "New"){ // because innerText can also be "Re-Enter"

        songsData.push(songData);

      };
  };

  JSON.stringify(songsData, null, 4);


//
// Step 3: Stage songsData, prune unwanted songs, find & set any duplicate songs to true, and add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "Up",
        "artist_name": "Cardi B",
        "video_id": null,
        "capture_date": "2021-02-27 08:29:25.097097",
        "source_id": 771,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Time Today",
        "artist_name": "Moneybagg Yo",
        "video_id": null,
        "capture_date": "2021-02-27 08:29:25.101101",
        "source_id": 771,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Neighbors",
        "artist_name": "Pooh Shiesty Featuring BIG30",
        "video_id": null,
        "capture_date": "2021-02-27 08:29:25.101101",
        "source_id": 771,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "GNF (OKOKOK)",
        "artist_name": "Polo G",
        "video_id": null,
        "capture_date": "2021-02-27 08:29:25.102102",
        "source_id": 771,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Glad You Exist",
        "artist_name": "Dan + Shay",
        "video_id": null,
        "capture_date": "2021-02-27 08:29:25.102102",
        "source_id": 771,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Provide",
        "artist_name": "G-Eazy Featuring Chris Brown & Mark Morrison",
        "video_id": null,
        "capture_date": "2021-02-27 08:29:25.102102",
        "source_id": 771,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Box Of Churches",
        "artist_name": "Pooh Shiesty Featuring 21 Savage",
        "video_id": null,
        "capture_date": "2021-02-27 08:29:25.102102",
        "source_id": 771,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "My Head And My Heart",
        "artist_name": "Ava Max",
        "video_id": null,
        "capture_date": "2021-02-27 08:29:25.102102",
        "source_id": 771,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "No More Parties",
        "artist_name": "Coi Leray",
        "video_id": null,
        "capture_date": "2021-02-27 08:29:25.102102",
        "source_id": 771,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bandido",
        "artist_name": "Myke Towers & Juhn",
        "video_id": null,
        "capture_date": "2021-02-27 08:29:25.103103",
        "source_id": 771,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Lifestyle",
        "artist_name": "Jason Derulo Featuring Adam Levine",
        "video_id": null,
        "capture_date": "2021-02-27 08:29:25.103103",
        "source_id": 771,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Quicksand",
        "artist_name": "Morray",
        "video_id": null,
        "capture_date": "2021-02-27 08:29:25.103103",
        "source_id": 771,
        "song_id": null,
        "duplicate": false
    }
]

  // Check each song for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%Up%'
    AND artist_name LIKE '%Cardi%'
  ;

  // If duplicates:
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
  ('Up', 'Cardi B', NULL),
  ('Time Today', 'Moneybagg Yo', NULL),
  ('Neighbors', 'Pooh Shiesty Featuring BIG30', NULL),
  ('GNF (OKOKOK)', 'Polo G', NULL),
  ('Glad You Exist', 'Dan + Shay', NULL),
  ('Provide', 'G-Eazy Featuring Chris Brown & Mark Morrison', NULL),
  ('Box Of Churches', 'Pooh Shiesty Featuring 21 Savage', NULL),
  ('My Head And My Heart', 'Ava Max', NULL),
  ('No More Parties', 'Coi Leray', NULL),
  ('Bandido', 'Myke Towers & Juhn', NULL),
  ('Lifestyle', 'Jason Derulo Featuring Adam Levine', NULL),
  ('Quicksand', 'Morray', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9785; // SELECT last_insert_rowid();

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
  ('2021-02-27 08:29:25.097097', '771', '9774'),
  ('2021-02-27 08:29:25.101101', '771', '9775'),
  ('2021-02-27 08:29:25.101101', '771', '9776'),
  ('2021-02-27 08:29:25.102102', '771', '9777'),
  ('2021-02-27 08:29:25.102102', '771', '9778'),
  ('2021-02-27 08:29:25.102102', '771', '9779'),
  ('2021-02-27 08:29:25.102102', '771', '9780'),
  ('2021-02-27 08:29:25.102102', '771', '9781'),
  ('2021-02-27 08:29:25.102102', '771', '9782'),
  ('2021-02-27 08:29:25.103103', '771', '9783'),
  ('2021-02-27 08:29:25.103103', '771', '9784'),
  ('2021-02-27 08:29:25.103103', '771', '9785')
  ;

  // Update to source_song table
