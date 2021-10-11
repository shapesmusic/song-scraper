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
    + "\'" + currentChartLocation + "\');" // use pastChartLocation if not the current week's chart, otherwise use currentChartLocation
  );


  // Stage the SQL statement
  // Replace any ' in strings with ’

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('Billboard', 'The Hot 100', 'Week of June 26, 2021', '2021-06-26 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2021-06-26/2021-06-26');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 942; // SELECT last_insert_rowid();
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

  console.log(JSON.stringify(songsData, null, 4));


//
// Step 3:  Stage songsData,
//          prune unwanted songs,
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "Having Our Way",
        "artist_name": "Migos ft. Drake",
        "video_id": null,
        "capture_date": "2021-10-10 10:44:03.378378",
        "source_id": 942,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Thot Shit",
        "artist_name": "Megan Thee Stallion",
        "video_id": null,
        "capture_date": "2021-10-10 10:44:03.378378",
        "source_id": 942,
        "song_id": 10573,
        "duplicate": true
    },
    {
        "title": "No Return",
        "artist_name": "Polo G ft. The Kid LAROI & Lil Durk",
        "video_id": null,
        "capture_date": "2021-10-10 10:44:03.379379",
        "source_id": 942,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Avalanche",
        "artist_name": "Migos",
        "video_id": null,
        "capture_date": "2021-10-10 10:44:03.379379",
        "source_id": 942,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Need To Know",
        "artist_name": "Doja Cat",
        "video_id": null,
        "capture_date": "2021-10-10 10:44:03.380380",
        "source_id": 942,
        "song_id": 10577,
        "duplicate": true
    },
    {
        "title": "Black Hearted",
        "artist_name": "Polo G",
        "video_id": null,
        "capture_date": "2021-10-10 10:44:03.380380",
        "source_id": 942,
        "song_id": 10574,
        "duplicate": true
    },
    {
        "title": "Painting Pictures",
        "artist_name": "Polo G",
        "video_id": null,
        "capture_date": "2021-10-10 10:44:03.381381",
        "source_id": 942,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Modern Day",
        "artist_name": "Migos",
        "video_id": null,
        "capture_date": "2021-10-10 10:44:03.381381",
        "source_id": 942,
        "song_id": 10572,
        "duplicate": true
    },
    {
        "title": "Toxic",
        "artist_name": "Polo G",
        "video_id": null,
        "capture_date": "2021-10-10 10:44:03.381381",
        "source_id": 942,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Solar Power",
        "artist_name": "Lorde",
        "video_id": null,
        "capture_date": "2021-10-10 10:44:03.381381",
        "source_id": 942,
        "song_id": 10581,
        "duplicate": true
    },
    {
        "title": "Malibu",
        "artist_name": "Migos ft. Polo G",
        "video_id": null,
        "capture_date": "2021-10-10 10:44:03.381381",
        "source_id": 942,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Type Shit",
        "artist_name": "Migos & Cardi B",
        "video_id": null,
        "capture_date": "2021-10-10 10:44:03.381381",
        "source_id": 942,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Clueless",
        "artist_name": "Polo G ft. Pop Smoke & Fivio Foreign",
        "video_id": null,
        "capture_date": "2021-10-10 10:44:03.382382",
        "source_id": 942,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Heart Of A Giant",
        "artist_name": "Polo G ft. Rod Wave",
        "video_id": null,
        "capture_date": "2021-10-10 10:44:03.382382",
        "source_id": 942,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Party Lyfe",
        "artist_name": "Polo G ft. DaBaby",
        "video_id": null,
        "capture_date": "2021-10-10 10:44:03.382382",
        "source_id": 942,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Go Part 1",
        "artist_name": "Polo G ft. G Herbo",
        "video_id": null,
        "capture_date": "2021-10-10 10:44:03.382382",
        "source_id": 942,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "transparentsoul",
        "artist_name": "Willow ft. Travis Barker",
        "video_id": null,
        "capture_date": "2021-10-10 10:44:03.382382",
        "source_id": 942,
        "song_id": 10329,
        "duplicate": true
    },
    {
        "title": "Boom",
        "artist_name": "Polo G",
        "video_id": null,
        "capture_date": "2021-10-10 10:44:03.382382",
        "source_id": 942,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Fiel",
        "artist_name": "Los Legendarios, Wisin & Jhay Cortez",
        "video_id": null,
        "capture_date": "2021-10-10 10:44:03.382382",
        "source_id": 942,
        "song_id": 10072,
        "duplicate": true
    },
    {
        "title": "Bloody Canvas",
        "artist_name": "Polo G",
        "video_id": null,
        "capture_date": "2021-10-10 10:44:03.383383",
        "source_id": 942,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "You",
        "artist_name": "Regard x Troye Sivan x Tate McRae",
        "video_id": null,
        "capture_date": "2021-10-10 10:44:03.383383",
        "source_id": 942,
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
  ('Having Our Way', 'Migos ft. Drake', NULL),
  ('No Return', 'Polo G ft. The Kid LAROI & Lil Durk', NULL),
  ('Avalanche', 'Migos', NULL),
  ('Painting Pictures', 'Polo G', NULL),
  ('Toxic', 'Polo G', NULL),
  ('Malibu', 'Migos ft. Polo G', NULL),
  ('Type Shit', 'Migos & Cardi B', NULL),
  ('Clueless', 'Polo G ft. Pop Smoke & Fivio Foreign', NULL),
  ('Heart Of A Giant', 'Polo G ft. Rod Wave', NULL),
  ('Party Lyfe', 'Polo G ft. DaBaby', NULL),
  ('Go Part 1', 'Polo G ft. G Herbo', NULL),
  ('Boom', 'Polo G', NULL),
  ('Bloody Canvas', 'Polo G', NULL),
  ('You', 'Regard x Troye Sivan x Tate McRae', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10621; // SELECT last_insert_rowid();

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
  ('2021-10-10 10:44:03.378378', '942', '10608'),
  ('2021-10-10 10:44:03.378378', '942', '10573'),
  ('2021-10-10 10:44:03.379379', '942', '10609'),
  ('2021-10-10 10:44:03.379379', '942', '10610'),
  ('2021-10-10 10:44:03.380380', '942', '10577'),
  ('2021-10-10 10:44:03.380380', '942', '10574'),
  ('2021-10-10 10:44:03.381381', '942', '10611'),
  ('2021-10-10 10:44:03.381381', '942', '10572'),
  ('2021-10-10 10:44:03.381381', '942', '10612'),
  ('2021-10-10 10:44:03.381381', '942', '10581'),
  ('2021-10-10 10:44:03.381381', '942', '10613'),
  ('2021-10-10 10:44:03.381381', '942', '10614'),
  ('2021-10-10 10:44:03.382382', '942', '10615'),
  ('2021-10-10 10:44:03.382382', '942', '10616'),
  ('2021-10-10 10:44:03.382382', '942', '10617'),
  ('2021-10-10 10:44:03.382382', '942', '10618'),
  ('2021-10-10 10:44:03.382382', '942', '10329'),
  ('2021-10-10 10:44:03.382382', '942', '10619'),
  ('2021-10-10 10:44:03.382382', '942', '10072'),
  ('2021-10-10 10:44:03.383383', '942', '10620'),
  ('2021-10-10 10:44:03.383383', '942', '10621')
  ;

  // Update to source_song table
