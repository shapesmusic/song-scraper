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
    ('New York Times', 'The Playlist', 'Kane Brown and H.E.R.’s Genre-Melting Duet, and 11 More New Songs', '2021-10-01 11:06:05.000000', 'https://www.nytimes.com/2021/10/01/arts/music/playlist-kane-brown-her-springsteen-mellencamp.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 975; // SELECT last_insert_rowid();
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
          "title": "Blessed & Free",
          "artist_name": "Kane Brown and H.E.R.",
          "video_id": null,
          "capture_date": "2021-10-12 10:28:55.477477",
          "source_id": 975,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Wasted Days",
          "artist_name": "John Mellencamp and Bruce Springsteen",
          "video_id": null,
          "capture_date": "2021-10-12 10:28:55.479479",
          "source_id": 975,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Panic Attacks in Paradise",
          "artist_name": "Ashnikko",
          "video_id": null,
          "capture_date": "2021-10-12 10:28:55.479479",
          "source_id": 975,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "The Distance",
          "artist_name": "Totally Enormous Extinct Dinosaurs",
          "video_id": null,
          "capture_date": "2021-10-12 10:28:55.480480",
          "source_id": 975,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Dad Vibes",
          "artist_name": "Limp Bizkit",
          "video_id": null,
          "capture_date": "2021-10-12 10:28:55.480480",
          "source_id": 975,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Negra Del Alma",
          "artist_name": "Susana Baca",
          "video_id": null,
          "capture_date": "2021-10-12 10:28:55.480480",
          "source_id": 975,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Angel on My Shoulder",
          "artist_name": "Sega Bodega",
          "video_id": null,
          "capture_date": "2021-10-12 10:28:55.480480",
          "source_id": 975,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Skin 2 Skin",
          "artist_name": "Hyd",
          "video_id": null,
          "capture_date": "2021-10-12 10:28:55.480480",
          "source_id": 975,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Go Easy Kid",
          "artist_name": "Monica Martin",
          "video_id": null,
          "capture_date": "2021-10-12 10:28:55.480480",
          "source_id": 975,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Count the Tear Drops",
          "artist_name": "Corrina Repp",
          "video_id": null,
          "capture_date": "2021-10-12 10:28:55.480480",
          "source_id": 975,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Lieve",
          "artist_name": "Holy Other",
          "video_id": null,
          "capture_date": "2021-10-12 10:28:55.480480",
          "source_id": 975,
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
  ('Blessed & Free', 'Kane Brown and H.E.R.', NULL),
  ('Wasted Days', 'John Mellencamp and Bruce Springsteen', NULL),
  ('Panic Attacks in Paradise', 'Ashnikko', NULL),
  ('The Distance', 'Totally Enormous Extinct Dinosaurs', NULL),
  ('Dad Vibes', 'Limp Bizkit', NULL),
  ('Negra Del Alma', 'Susana Baca', NULL),
  ('Angel on My Shoulder', 'Sega Bodega', NULL),
  ('Skin 2 Skin', 'Hyd', NULL),
  ('Go Easy Kid', 'Monica Martin', NULL),
  ('Count the Tear Drops', 'Corrina Repp', NULL),
  ('Lieve', 'Holy Other', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10987; // SELECT last_insert_rowid();

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
  ('2021-10-12 10:28:55.477477', '975', '10977'),
  ('2021-10-12 10:28:55.479479', '975', '10978'),
  ('2021-10-12 10:28:55.479479', '975', '10979'),
  ('2021-10-12 10:28:55.480480', '975', '10980'),
  ('2021-10-12 10:28:55.480480', '975', '10981'),
  ('2021-10-12 10:28:55.480480', '975', '10982'),
  ('2021-10-12 10:28:55.480480', '975', '10983'),
  ('2021-10-12 10:28:55.480480', '975', '10984'),
  ('2021-10-12 10:28:55.480480', '975', '10985'),
  ('2021-10-12 10:28:55.480480', '975', '10986'),
  ('2021-10-12 10:28:55.480480', '975', '10987')
  ;

  // Update to source_song table
