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
    ('Billboard', 'The Hot 100', 'Week of August 28, 2021', '2021-08-28 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2021-08-28/2021-08-28');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 951; // SELECT last_insert_rowid();
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
//          find and replace "Featured" with "ft."
//

  songsData =
  [
      {
          "title": "Rumors",
          "artist_name": "Lizzo ft. Cardi B",
          "video_id": null,
          "capture_date": "2021-10-11 10:55:40.113113",
          "source_id": 951,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Paralyzed",
          "artist_name": "Sueco",
          "video_id": null,
          "capture_date": "2021-10-11 10:55:40.115115",
          "source_id": 951,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Mind Of Melvin",
          "artist_name": "YNW Melly ft. Lil Uzi Vert",
          "video_id": null,
          "capture_date": "2021-10-11 10:55:40.116116",
          "source_id": 951,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Papercuts",
          "artist_name": "Machine Gun Kelly",
          "video_id": null,
          "capture_date": "2021-10-11 10:55:40.116116",
          "source_id": 951,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Cold Heart (PNAU Remix)",
          "artist_name": "Elton John & Dua Lipa",
          "video_id": null,
          "capture_date": "2021-10-11 10:55:40.116116",
          "source_id": 951,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Brainwashed",
          "artist_name": "Tom MacDonald",
          "video_id": null,
          "capture_date": "2021-10-11 10:55:40.117117",
          "source_id": 951,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Thinking 'Bout You",
          "artist_name": "Dustin Lynch ft. Lauren Alaina Or MacKenzie Porter",
          "video_id": null,
          "capture_date": "2021-10-11 10:55:40.117117",
          "source_id": 951,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "I Like Dat",
          "artist_name": "T-Pain & Kehlani",
          "video_id": null,
          "capture_date": "2021-10-11 10:55:40.117117",
          "source_id": 951,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Steal My Love",
          "artist_name": "Dan + Shay",
          "video_id": null,
          "capture_date": "2021-10-11 10:55:40.117117",
          "source_id": 951,
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
  ('Rumors', 'Lizzo ft. Cardi B', NULL),
  ('Paralyzed', 'Sueco', NULL),
  ('Mind Of Melvin', 'YNW Melly ft. Lil Uzi Vert', NULL),
  ('Papercuts', 'Machine Gun Kelly', NULL),
  ('Cold Heart (PNAU Remix)', 'Elton John & Dua Lipa', NULL),
  ('Brainwashed', 'Tom MacDonald', NULL),
  ('Thinking ’Bout You', 'Dustin Lynch ft. Lauren Alaina Or MacKenzie Porter', NULL),
  ('I Like Dat', 'T-Pain & Kehlani', NULL),
  ('Steal My Love', 'Dan + Shay', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10718; // SELECT last_insert_rowid();

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
  ('2021-10-11 10:55:40.113113', '951', '10710'),
  ('2021-10-11 10:55:40.115115', '951', '10711'),
  ('2021-10-11 10:55:40.116116', '951', '10712'),
  ('2021-10-11 10:55:40.116116', '951', '10713'),
  ('2021-10-11 10:55:40.116116', '951', '10714'),
  ('2021-10-11 10:55:40.117117', '951', '10715'),
  ('2021-10-11 10:55:40.117117', '951', '10716'),
  ('2021-10-11 10:55:40.117117', '951', '10717'),
  ('2021-10-11 10:55:40.117117', '951', '10718')
  ;

  // Update to source_song table
