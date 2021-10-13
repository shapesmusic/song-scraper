// Scroll to the bottom of the page first, so all the lazyload stuff loads.

// NOTE: sometimes two songs are grouped as one entry. This would potentially mess up `video_id` scraping.


//
// Step 0: Check recent scraped
//

  SELECT publication_date, instance_name FROM source WHERE parent_entity = 'New York Times' ORDER BY publication_date DESC LIMIT 3;


//
// Step 1: Scrape source data
//

  // Add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // Get and format source data
  title = document.getElementsByTagName("h1")[0].innerText;
  instanceName = title.match(/[^:]+$/)[0].trim();
  publicationDate = document.getElementsByTagName("time")[0].dateTime;
  publicationDateFormatted = moment(publicationDate).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format
  chartLocation = window.location.href;

  // Build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'New York Times\', "
    + "\'The Playlist\', "
    + "\'" + instanceName + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + chartLocation + "\');"
  );

  // Stage the SQL statement
  // Replace any ' in strings with ’

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('New York Times', 'The Playlist', 'Radiohead’s ‘Kid A’ Era Outtake, and 13 More New Songs', '2021-09-13 11:55:46.000000', 'https://www.nytimes.com/2021/09/10/arts/music/playlist-radiohead-ed-sheeran-lisa.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 972; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("css-ow6j0y eoo0vm40"); // this class changes periodically

  songsData = [];

  for (var i=0; i<elements.length; i++){

    merged = elements[i].innerText;
    title = merged.match(/, ‘(.*?)’$/)[1] // $ gives you the last apostrophe, so it doesn't cut off words like "ain't, etc."
    // if this throws an error, enter `merged` to see the problem song.
    artist_name = merged.match(/.+?(?=, ‘)/)[0];
    video_id = null;
    capture_date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

    // vidUrl = document.getElementsByClassName("css-1u3pw94")[i].innerHTML;
    // videoId = vidUrl.match(/embed\/([^"]{0,})/)[1];

    songData = {
      'title' : title,
      'artist_name' : artist_name,
      'video_id' : video_id,
      'capture_date' : capture_date,
      'source_id' : source_id,
      'song_id' : song_id,
      'duplicate' : false
    };

    songsData.push(songData);

  };

  console.log(JSON.stringify(songsData, null, 4));


//
// Step 3:  Stage songsData,
//          preview chart and prune songs (add video_id later),
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//          find and replace "Featured" with "ft."
//

  songsData =
  [
      {
          "title": "If You Say the Word",
          "artist_name": "Radiohead",
          "video_id": null,
          "capture_date": "2021-10-12 10:08:18.340340",
          "source_id": 972,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Shivers",
          "artist_name": "Ed Sheeran",
          "video_id": null,
          "capture_date": "2021-10-12 10:08:18.341341",
          "source_id": 972,
          "song_id": 10783,
          "duplicate": true
      },
      {
          "title": "23",
          "artist_name": "Sam Hunt",
          "video_id": null,
          "capture_date": "2021-10-12 10:08:18.342342",
          "source_id": 972,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Lalisa",
          "artist_name": "Lisa",
          "video_id": null,
          "capture_date": "2021-10-12 10:08:18.342342",
          "source_id": 972,
          "song_id": 10789,
          "duplicate": true
      },
      {
          "title": "Boomerang",
          "artist_name": "Yebba",
          "video_id": null,
          "capture_date": "2021-10-12 10:08:18.342342",
          "source_id": 972,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "True Seekers",
          "artist_name": "Sleigh Bells",
          "video_id": null,
          "capture_date": "2021-10-12 10:08:18.342342",
          "source_id": 972,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Fake Blood",
          "artist_name": "Ìfé",
          "video_id": null,
          "capture_date": "2021-10-12 10:08:18.342342",
          "source_id": 972,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Story Time",
          "artist_name": "Fivio Foreign",
          "video_id": null,
          "capture_date": "2021-10-12 10:08:18.342342",
          "source_id": 972,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Hive Mind",
          "artist_name": "Tirzah ft. Coby Sey",
          "video_id": null,
          "capture_date": "2021-10-12 10:08:18.343343",
          "source_id": 972,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Pond House",
          "artist_name": "St. Etienne",
          "video_id": null,
          "capture_date": "2021-10-12 10:08:18.343343",
          "source_id": 972,
          "song_id": 10891,
          "duplicate": true
      },
      {
          "title": "Sculpting the Exodus",
          "artist_name": "Circuit des Yeux",
          "video_id": null,
          "capture_date": "2021-10-12 10:08:18.343343",
          "source_id": 972,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Abeyant",
          "artist_name": "Sarah Davachi",
          "video_id": null,
          "capture_date": "2021-10-12 10:08:18.343343",
          "source_id": 972,
          "song_id": null,
          "duplicate": false
      }
  ]

  // Check each song for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%AP%'
    AND artist_name LIKE '%Pop Smoke%'
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
  ('If You Say the Word', 'Radiohead', NULL),
  ('23', 'Sam Hunt', NULL),
  ('Boomerang', 'Yebba', NULL),
  ('True Seekers', 'Sleigh Bells', NULL),
  ('Fake Blood', 'Ìfé', NULL),
  ('Story Time', 'Fivio Foreign', NULL),
  ('Hive Mind', 'Tirzah ft. Coby Sey', NULL),
  ('Sculpting the Exodus', 'Circuit des Yeux', NULL),
  ('Abeyant', 'Sarah Davachi', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10953; // SELECT last_insert_rowid();

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
  ('2021-10-12 10:08:18.340340', '972', '10945'),
  ('2021-10-12 10:08:18.341341', '972', '10783'),
  ('2021-10-12 10:08:18.342342', '972', '10946'),
  ('2021-10-12 10:08:18.342342', '972', '10789'),
  ('2021-10-12 10:08:18.342342', '972', '10947'),
  ('2021-10-12 10:08:18.342342', '972', '10948'),
  ('2021-10-12 10:08:18.342342', '972', '10949'),
  ('2021-10-12 10:08:18.342342', '972', '10950'),
  ('2021-10-12 10:08:18.343343', '972', '10951'),
  ('2021-10-12 10:08:18.343343', '972', '10891'),
  ('2021-10-12 10:08:18.343343', '972', '10952'),
  ('2021-10-12 10:08:18.343343', '972', '10953')
  ;

  // Update to source_song table
