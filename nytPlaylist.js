// Scroll to the bottom of the page first, so all the lazyload stuff loads.

// NOTE: sometimes two songs are grouped as one entry. This would potentially mess up `video_id` scraping.


//
// Step 0: Check recent scraped
//

  SELECT instance_name, publication_date FROM source WHERE parent_entity = 'New York Times' ORDER BY publication_date DESC LIMIT 8;


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
    ('New York Times', 'The Playlist', 'Kodak Black Celebrates Clemency From Trump, and 10 More New Songs', '2021-01-29 09:14:18.000000', 'https://www.nytimes.com/2021/01/29/arts/music/playlist-kodak-black-jensen-mcrae.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 796; // SELECT last_insert_rowid();
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

  JSON.stringify(songsData, null, 4);


//
// Step 3: Stage songsData, preview chart and prune songs, find & set any duplicate songs to true, and add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "Last Day In",
        "artist_name": "Kodak Black",
        "video_id": null,
        "capture_date": "2021-03-01 03:59:49.170170",
        "source_id": 796,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Don’t Judge Me",
        "artist_name": "FKA twigs featuring Headie One and Fred again..",
        "video_id": null,
        "capture_date": "2021-03-01 03:59:49.171171",
        "source_id": 796,
        "song_id": 9839,
        "duplicate": true
    },
    {
        "title": "Immune",
        "artist_name": "Jensen McRae",
        "video_id": null,
        "capture_date": "2021-03-01 03:59:49.171171",
        "source_id": 796,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "You Sold Me a Dream",
        "artist_name": "Jupiter & Okwess featuring Ana Tijoux",
        "video_id": null,
        "capture_date": "2021-03-01 03:59:49.171171",
        "source_id": 796,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Minus Me",
        "artist_name": "Alostmen featuring Ambolley",
        "video_id": null,
        "capture_date": "2021-03-01 03:59:49.171171",
        "source_id": 796,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "It’s Time to Rock",
        "artist_name": "Tes X & Mario Judah",
        "video_id": null,
        "capture_date": "2021-03-01 03:59:49.171171",
        "source_id": 796,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Garden of Eden",
        "artist_name": "Billie Marten",
        "video_id": null,
        "capture_date": "2021-03-01 03:59:49.171171",
        "source_id": 796,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Free",
        "artist_name": "Prettymuch",
        "video_id": null,
        "capture_date": "2021-03-01 03:59:49.171171",
        "source_id": 796,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bad Dream",
        "artist_name": "Ani DiFranco",
        "video_id": null,
        "capture_date": "2021-03-01 03:59:49.171171",
        "source_id": 796,
        "song_id": null,
        "duplicate": false
    }
]

  // Check each song for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%Stay Down%'
    AND artist_name LIKE '%durk%'
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
  ('Last Day In', 'Kodak Black', NULL),
  ('Immune', 'Jensen McRae', NULL),
  ('You Sold Me a Dream', 'Jupiter & Okwess featuring Ana Tijoux', NULL),
  ('Minus Me', 'Alostmen featuring Ambolley', NULL),
  ('It’s Time to Rock', 'Tes X & Mario Judah', NULL),
  ('Garden of Eden', 'Billie Marten', NULL),
  ('Free', 'Prettymuch', NULL),
  ('Bad Dream', 'Ani DiFranco', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9881; // SELECT last_insert_rowid();

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
  ('2021-03-01 03:59:49.170170', '796', '9874'),
  ('2021-03-01 03:59:49.171171', '796', '9839'),
  ('2021-03-01 03:59:49.171171', '796', '9875'),
  ('2021-03-01 03:59:49.171171', '796', '9876'),
  ('2021-03-01 03:59:49.171171', '796', '9877'),
  ('2021-03-01 03:59:49.171171', '796', '9878'),
  ('2021-03-01 03:59:49.171171', '796', '9879'),
  ('2021-03-01 03:59:49.171171', '796', '9880'),
  ('2021-03-01 03:59:49.171171', '796', '9881')
  ;

  // Update to source_song table
