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
  // Make sure the publication_date matches the URL's date

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('New York Times', 'The Playlist', 'Doja Cat Goes Horror Pop, and 12 More New Songs', '2023-09-01 10:44:31.000000', 'https://www.nytimes.com/2023/09/01/arts/music/playlist-doja-cat-nicki-minaj.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1697; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("css-kypbrf eoo0vm40"); // this class changes periodically

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
//          find and replace "featur~ing" with "ft."
//

  songsData =
  [
    {
        "title": "Demons",
        "artist_name": "Doja Cat",
        "video_id": null,
        "capture_date": "2023-09-16 09:46:14.449449",
        "source_id": 1697,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Last Time I Saw You",
        "artist_name": "Nicki Minaj",
        "video_id": null,
        "capture_date": "2023-09-16 09:46:14.450450",
        "source_id": 1697,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "You Thought",
        "artist_name": "Teezo Touchdown ft. Janelle Monáe",
        "video_id": null,
        "capture_date": "2023-09-16 09:46:14.450450",
        "source_id": 1697,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Eighth Pose",
        "artist_name": "Blankfor.ms, Jason Moran and Marcus Gilmore",
        "video_id": null,
        "capture_date": "2023-09-16 09:46:14.450450",
        "source_id": 1697,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Strangers",
        "artist_name": "Kenya Grace",
        "video_id": null,
        "capture_date": "2023-09-16 09:46:14.450450",
        "source_id": 1697,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Will U Still U",
        "artist_name": "Jeff Rosenstock",
        "video_id": null,
        "capture_date": "2023-09-16 09:46:14.450450",
        "source_id": 1697,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "A Barely Lit Path",
        "artist_name": "Oneohtrix Point Never",
        "video_id": null,
        "capture_date": "2023-09-16 09:46:14.450450",
        "source_id": 1697,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Love Can Heal (Bright-Side Mix)",
        "artist_name": "Peter Gabriel",
        "video_id": null,
        "capture_date": "2023-09-16 09:46:14.450450",
        "source_id": 1697,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Jordan and the Nile",
        "artist_name": "Jason Hawk Harris",
        "video_id": null,
        "capture_date": "2023-09-16 09:46:14.450450",
        "source_id": 1697,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Are You Awake?",
        "artist_name": "Lauren Mayberry",
        "video_id": null,
        "capture_date": "2023-09-16 09:46:14.450450",
        "source_id": 1697,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Amber and Watcher",
        "artist_name": "Maria BC",
        "video_id": null,
        "capture_date": "2023-09-16 09:46:14.450450",
        "source_id": 1697,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dolores (Take 1)",
        "artist_name": "Kris Davis",
        "video_id": null,
        "capture_date": "2023-09-16 09:46:14.450450",
        "source_id": 1697,
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
  // If ’ replaced, check again for duplicate

  INSERT INTO song
    (title, artist_name, video_id)
  VALUES
  ('Demons', 'Doja Cat', NULL),
  ('Last Time I Saw You', 'Nicki Minaj', NULL),
  ('You Thought', 'Teezo Touchdown ft. Janelle Monáe', NULL),
  ('Eighth Pose', 'Blankfor.ms, Jason Moran and Marcus Gilmore', NULL),
  ('Strangers', 'Kenya Grace', NULL),
  ('Will U Still U', 'Jeff Rosenstock', NULL),
  ('A Barely Lit Path', 'Oneohtrix Point Never', NULL),
  ('Love Can Heal (Bright-Side Mix)', 'Peter Gabriel', NULL),
  ('Jordan and the Nile', 'Jason Hawk Harris', NULL),
  ('Are You Awake?', 'Lauren Mayberry', NULL),
  ('Amber and Watcher', 'Maria BC', NULL),
  ('Dolores (Take 1)', 'Kris Davis', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 14719; // SELECT last_insert_rowid();

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
  ('2023-09-16 09:46:14.449449', '1697', '14708'),
  ('2023-09-16 09:46:14.450450', '1697', '14709'),
  ('2023-09-16 09:46:14.450450', '1697', '14710'),
  ('2023-09-16 09:46:14.450450', '1697', '14711'),
  ('2023-09-16 09:46:14.450450', '1697', '14712'),
  ('2023-09-16 09:46:14.450450', '1697', '14713'),
  ('2023-09-16 09:46:14.450450', '1697', '14714'),
  ('2023-09-16 09:46:14.450450', '1697', '14715'),
  ('2023-09-16 09:46:14.450450', '1697', '14716'),
  ('2023-09-16 09:46:14.450450', '1697', '14717'),
  ('2023-09-16 09:46:14.450450', '1697', '14718'),
  ('2023-09-16 09:46:14.450450', '1697', '14719')
  ;

  // Update to source_song table
