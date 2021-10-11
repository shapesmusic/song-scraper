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
    ('Billboard', 'The Hot 100', 'Week of July 31, 2021', '2021-07-31 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2021-07-31/2021-07-31');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 947; // SELECT last_insert_rowid();
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
          "title": "Wild Side",
          "artist_name": "Normani ft. Cardi B",
          "video_id": null,
          "capture_date": "2021-10-11 08:38:58.176176",
          "source_id": 947,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Tell The Vision",
          "artist_name": "Pop Smoke ft. Kanye West & Pusha T",
          "video_id": null,
          "capture_date": "2021-10-11 08:38:58.177177",
          "source_id": 947,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Holy Smokes",
          "artist_name": "Trippie Redd ft. Lil Uzi Vert",
          "video_id": null,
          "capture_date": "2021-10-11 08:38:58.177177",
          "source_id": 947,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Bout A Million",
          "artist_name": "Pop Smoke ft. 21 Savage & 42 Dugg",
          "video_id": null,
          "capture_date": "2021-10-11 08:38:58.177177",
          "source_id": 947,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Woo Baby",
          "artist_name": "Pop Smoke ft. Chris Brown",
          "video_id": null,
          "capture_date": "2021-10-11 08:38:58.178178",
          "source_id": 947,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Mr. Jones",
          "artist_name": "Pop Smoke ft. Future",
          "video_id": null,
          "capture_date": "2021-10-11 08:38:58.178178",
          "source_id": 947,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "More Time",
          "artist_name": "Pop Smoke",
          "video_id": null,
          "capture_date": "2021-10-11 08:38:58.178178",
          "source_id": 947,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Manslaughter",
          "artist_name": "Pop Smoke ft. Rick Ross & The-Dream",
          "video_id": null,
          "capture_date": "2021-10-11 08:38:58.178178",
          "source_id": 947,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Demeanor",
          "artist_name": "Pop Smoke ft. Dua Lipa",
          "video_id": null,
          "capture_date": "2021-10-11 08:38:58.178178",
          "source_id": 947,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "2055",
          "artist_name": "Sleepy Hallow",
          "video_id": null,
          "capture_date": "2021-10-11 08:38:58.178178",
          "source_id": 947,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Love Again",
          "artist_name": "Dua Lipa",
          "video_id": null,
          "capture_date": "2021-10-11 08:38:58.178178",
          "source_id": 947,
          "song_id": 10587,
          "duplicate": true
      },
      {
          "title": "30",
          "artist_name": "Pop Smoke ft. Bizzy Banks",
          "video_id": null,
          "capture_date": "2021-10-11 08:38:58.178178",
          "source_id": 947,
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
  ('Wild Side', 'Normani ft. Cardi B', NULL),
  ('Tell The Vision', 'Pop Smoke ft. Kanye West & Pusha T', NULL),
  ('Holy Smokes', 'Trippie Redd ft. Lil Uzi Vert', NULL),
  ('Bout A Million', 'Pop Smoke ft. 21 Savage & 42 Dugg', NULL),
  ('Woo Baby', 'Pop Smoke ft. Chris Brown', NULL),
  ('Mr. Jones', 'Pop Smoke ft. Future', NULL),
  ('More Time', 'Pop Smoke', NULL),
  ('Manslaughter', 'Pop Smoke ft. Rick Ross & The-Dream', NULL),
  ('Demeanor', 'Pop Smoke ft. Dua Lipa', NULL),
  ('2055', 'Sleepy Hallow', NULL),
  ('30', 'Pop Smoke ft. Bizzy Banks', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10677; // SELECT last_insert_rowid();

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
  ('2021-10-11 08:38:58.176176', '947', '10667'),
  ('2021-10-11 08:38:58.177177', '947', '10668'),
  ('2021-10-11 08:38:58.177177', '947', '10669'),
  ('2021-10-11 08:38:58.177177', '947', '10670'),
  ('2021-10-11 08:38:58.178178', '947', '10671'),
  ('2021-10-11 08:38:58.178178', '947', '10672'),
  ('2021-10-11 08:38:58.178178', '947', '10673'),
  ('2021-10-11 08:38:58.178178', '947', '10674'),
  ('2021-10-11 08:38:58.178178', '947', '10675'),
  ('2021-10-11 08:38:58.178178', '947', '10676'),
  ('2021-10-11 08:38:58.178178', '947', '10587'),
  ('2021-10-11 08:38:58.178178', '947', '10677')
  ;

  // Update to source_song table
