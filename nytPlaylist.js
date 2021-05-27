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
    ('New York Times', 'The Playlist', 'Nicki Minaj Reunites With Lil Wayne and Drake, and 13 More New Songs', '2021-05-14 08:13:34.000000', 'https://www.nytimes.com/2021/05/14/arts/music/playlist-nicki-minaj-drake-lil-wayne.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 916; // SELECT last_insert_rowid();
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
//

  songsData =
  [
    {
        "title": "Seeing Green",
        "artist_name": "Nicki Minaj with Drake and Lil Wayne",
        "video_id": null,
        "capture_date": "2021-05-27 06:28:36.105105",
        "source_id": 916,
        "song_id": 10386,
        "duplicate": true
    },
    {
        "title": "Good 4 U",
        "artist_name": "Olivia Rodrigo",
        "video_id": null,
        "capture_date": "2021-05-27 06:28:36.107107",
        "source_id": 916,
        "song_id": 10393,
        "duplicate": true
    },
    {
        "title": "Don’t Go Puttin Wishes in My Head",
        "artist_name": "Torres",
        "video_id": null,
        "capture_date": "2021-05-27 06:28:36.107107",
        "source_id": 916,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mau Mau",
        "artist_name": "Tony Allen",
        "video_id": null,
        "capture_date": "2021-05-27 06:28:36.107107",
        "source_id": 916,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Build a Bitch",
        "artist_name": "Bella Poarch",
        "video_id": null,
        "capture_date": "2021-05-27 06:28:36.107107",
        "source_id": 916,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Worry With You",
        "artist_name": "Sleater-Kinney",
        "video_id": null,
        "capture_date": "2021-05-27 06:28:36.107107",
        "source_id": 916,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "We Are the People",
        "artist_name": "Martin Garrix featuring Bono & The Edge",
        "video_id": null,
        "capture_date": "2021-05-27 06:28:36.107107",
        "source_id": 916,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "You Can Do Better",
        "artist_name": "Holly Macve",
        "video_id": null,
        "capture_date": "2021-05-27 06:28:36.107107",
        "source_id": 916,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Blame Me",
        "artist_name": "L’Rain",
        "video_id": null,
        "capture_date": "2021-05-27 06:28:36.107107",
        "source_id": 916,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Right Now",
        "artist_name": "Elaine",
        "video_id": null,
        "capture_date": "2021-05-27 06:28:36.107107",
        "source_id": 916,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Where Have You Gone",
        "artist_name": "Alan Jackson",
        "video_id": null,
        "capture_date": "2021-05-27 06:28:36.107107",
        "source_id": 916,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Particle Of …",
        "artist_name": "Erika Dohi",
        "video_id": null,
        "capture_date": "2021-05-27 06:28:36.107107",
        "source_id": 916,
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
  ('Don’t Go Puttin Wishes in My Head', 'Torres', NULL),
  ('Mau Mau', 'Tony Allen', NULL),
  ('Build a Bitch', 'Bella Poarch', NULL),
  ('Worry With You', 'Sleater-Kinney', NULL),
  ('We Are the People', 'Martin Garrix featuring Bono & The Edge', NULL),
  ('You Can Do Better', 'Holly Macve', NULL),
  ('Blame Me', 'L’Rain', NULL),
  ('Right Now', 'Elaine', NULL),
  ('Where Have You Gone', 'Alan Jackson', NULL),
  ('Particle Of …', 'Erika Dohi', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10416; // SELECT last_insert_rowid();

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
  ('2021-05-27 06:28:36.105105', '916', '10386'),
  ('2021-05-27 06:28:36.107107', '916', '10393'),
  ('2021-05-27 06:28:36.107107', '916', '10407'),
  ('2021-05-27 06:28:36.107107', '916', '10408'),
  ('2021-05-27 06:28:36.107107', '916', '10409'),
  ('2021-05-27 06:28:36.107107', '916', '10410'),
  ('2021-05-27 06:28:36.107107', '916', '10411'),
  ('2021-05-27 06:28:36.107107', '916', '10412'),
  ('2021-05-27 06:28:36.107107', '916', '10413'),
  ('2021-05-27 06:28:36.107107', '916', '10414'),
  ('2021-05-27 06:28:36.107107', '916', '10415'),
  ('2021-05-27 06:28:36.107107', '916', '10416')
  ;

  // Update to source_song table
