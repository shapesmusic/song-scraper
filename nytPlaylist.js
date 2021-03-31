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
    ('New York Times', 'The Playlist', 'Lil Nas X Makes a Coming-Out Statement, and 9 More New Songs', '2021-03-26 10:05:30.000000', 'https://www.nytimes.com/2021/03/26/arts/music/playlist-lil-nas-x-taylor-swift.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 859; // SELECT last_insert_rowid();
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
// Step 3:  Stage songsData,
//          preview chart and prune songs,
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "Montero (Call Me by Your Name)",
        "artist_name": "Lil Nas X",
        "video_id": null,
        "capture_date": "2021-03-31 08:40:40.424424",
        "source_id": 859,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "You All Over Me",
        "artist_name": "Taylor Swift featuring Maren Morris",
        "video_id": null,
        "capture_date": "2021-03-31 08:40:40.426426",
        "source_id": 859,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "All Your Exes",
        "artist_name": "Julia Michaels",
        "video_id": null,
        "capture_date": "2021-03-31 08:40:40.426426",
        "source_id": 859,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dignity",
        "artist_name": "Angelique Kidjo and Yemi Alade",
        "video_id": null,
        "capture_date": "2021-03-31 08:40:40.426426",
        "source_id": 859,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Why Can’t We Live Together",
        "artist_name": "Dr. Lonnie Smith featuring Iggy Pop",
        "video_id": null,
        "capture_date": "2021-03-31 08:40:40.427427",
        "source_id": 859,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Jetski",
        "artist_name": "Internet Money featuring Lil Mosey and Lil Tecca",
        "video_id": null,
        "capture_date": "2021-03-31 08:40:40.427427",
        "source_id": 859,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Buzzcut",
        "artist_name": "Brockhampton featuring Danny Brown",
        "video_id": null,
        "capture_date": "2021-03-31 08:40:40.427427",
        "source_id": 859,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Tombstone",
        "artist_name": "Rod Wave",
        "video_id": null,
        "capture_date": "2021-03-31 08:40:40.427427",
        "source_id": 859,
        "song_id": 10062,
        "duplicate": true
    },
    {
        "title": "Night Singing",
        "artist_name": "Sara Watkins",
        "video_id": null,
        "capture_date": "2021-03-31 08:40:40.427427",
        "source_id": 859,
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
  ('Montero (Call Me by Your Name)', 'Lil Nas X', NULL),
  ('You All Over Me', 'Taylor Swift featuring Maren Morris', NULL),
  ('All Your Exes', 'Julia Michaels', NULL),
  ('Dignity', 'Angelique Kidjo and Yemi Alade', NULL),
  ('Why Can’t We Live Together', 'Dr. Lonnie Smith featuring Iggy Pop', NULL),
  ('Jetski', 'Internet Money featuring Lil Mosey and Lil Tecca', NULL),
  ('Buzzcut', 'Brockhampton featuring Danny Brown', NULL),
  ('Night Singing', 'Sara Watkins', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10089; // SELECT last_insert_rowid();

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
  ('2021-03-31 08:40:40.424424', '859', '10082'),
  ('2021-03-31 08:40:40.426426', '859', '10083'),
  ('2021-03-31 08:40:40.426426', '859', '10084'),
  ('2021-03-31 08:40:40.426426', '859', '10085'),
  ('2021-03-31 08:40:40.427427', '859', '10086'),
  ('2021-03-31 08:40:40.427427', '859', '10087'),
  ('2021-03-31 08:40:40.427427', '859', '10088'),
  ('2021-03-31 08:40:40.427427', '859', '10062'),
  ('2021-03-31 08:40:40.427427', '859', '10089')
  ;

  // Update to source_song table
