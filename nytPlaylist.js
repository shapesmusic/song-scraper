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
    ('New York Times', 'The Playlist', 'Abba Previews First Album in 40 Years, and 11 More New Songs', '2021-09-03 11:38:06.000000', 'https://www.nytimes.com/2021/09/03/arts/music/playlist-abba-bobby-shmurda.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 971; // SELECT last_insert_rowid();
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
          "title": "Don’t Shut Me Down",
          "artist_name": "Abba",
          "video_id": null,
          "capture_date": "2021-10-12 05:06:42.026026",
          "source_id": 971,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Good Ones",
          "artist_name": "Charli XCX",
          "video_id": null,
          "capture_date": "2021-10-12 05:06:42.027027",
          "source_id": 971,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Love Me",
          "artist_name": "Juls ft. Niniola",
          "video_id": null,
          "capture_date": "2021-10-12 05:06:42.027027",
          "source_id": 971,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Billie (Loving Arms)",
          "artist_name": "Fred again..",
          "video_id": null,
          "capture_date": "2021-10-12 05:06:42.027027",
          "source_id": 971,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Linda",
          "artist_name": "Tokischa and Rosalía",
          "video_id": null,
          "capture_date": "2021-10-12 05:06:42.027027",
          "source_id": 971,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "No Time for Sleep (Freestyle)",
          "artist_name": "Bobby Shmurda",
          "video_id": null,
          "capture_date": "2021-10-12 05:06:42.027027",
          "source_id": 971,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Pausa",
          "artist_name": "Martox ft. Gian Rojas",
          "video_id": null,
          "capture_date": "2021-10-12 05:06:42.027027",
          "source_id": 971,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Tokyo",
          "artist_name": "Jhay Cortez",
          "video_id": null,
          "capture_date": "2021-10-12 05:06:42.027027",
          "source_id": 971,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Glider",
          "artist_name": "Japanese Breakfast",
          "video_id": null,
          "capture_date": "2021-10-12 05:06:42.027027",
          "source_id": 971,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Reason to Believe",
          "artist_name": "Aoife O’Donovan",
          "video_id": null,
          "capture_date": "2021-10-12 05:06:42.028028",
          "source_id": 971,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Pt. 1",
          "artist_name": "Ruby Landen",
          "video_id": null,
          "capture_date": "2021-10-12 05:06:42.028028",
          "source_id": 971,
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
  ('Don’t Shut Me Down', 'Abba', NULL),
  ('Good Ones', 'Charli XCX', NULL),
  ('Love Me', 'Juls ft. Niniola', NULL),
  ('Billie (Loving Arms)', 'Fred again..', NULL),
  ('Linda', 'Tokischa and Rosalía', NULL),
  ('No Time for Sleep (Freestyle)', 'Bobby Shmurda', NULL),
  ('Pausa', 'Martox ft. Gian Rojas', NULL),
  ('Tokyo', 'Jhay Cortez', NULL),
  ('Glider', 'Japanese Breakfast', NULL),
  ('Reason to Believe', 'Aoife O’Donovan', NULL),
  ('Pt. 1', 'Ruby Landen', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10944; // SELECT last_insert_rowid();

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
  ('2021-10-12 05:06:42.026026', '971', '10934'),
  ('2021-10-12 05:06:42.027027', '971', '10935'),
  ('2021-10-12 05:06:42.027027', '971', '10936'),
  ('2021-10-12 05:06:42.027027', '971', '10937'),
  ('2021-10-12 05:06:42.027027', '971', '10938'),
  ('2021-10-12 05:06:42.027027', '971', '10939'),
  ('2021-10-12 05:06:42.027027', '971', '10940'),
  ('2021-10-12 05:06:42.027027', '971', '10941'),
  ('2021-10-12 05:06:42.027027', '971', '10942'),
  ('2021-10-12 05:06:42.028028', '971', '10943'),
  ('2021-10-12 05:06:42.028028', '971', '10944')
  ;

  // Update to source_song table
