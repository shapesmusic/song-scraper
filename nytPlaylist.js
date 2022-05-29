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
    ('New York Times', 'The Playlist', 'Black Star’s First Album in 24 Years Arrives, and 11 More New Songs', '2022-05-06 08:50:08.000000', 'https://www.nytimes.com/2022/05/06/arts/music/playlist-black-star-lady-gaga-doja-cat.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1204; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("css-1bxm55 eoo0vm40"); // this class changes periodically

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
        "title": "O.G.",
        "artist_name": "Black Star",
        "video_id": null,
        "capture_date": "2022-05-29 07:31:08.255255",
        "source_id": 1204,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Vegas",
        "artist_name": "Doja Cat",
        "video_id": null,
        "capture_date": "2022-05-29 07:31:08.256256",
        "source_id": 1204,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Western Wind",
        "artist_name": "Carly Rae Jepsen",
        "video_id": null,
        "capture_date": "2022-05-29 07:31:08.256256",
        "source_id": 1204,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sleep Tight",
        "artist_name": "Holly Humberstone",
        "video_id": null,
        "capture_date": "2022-05-29 07:31:08.256256",
        "source_id": 1204,
        "song_id": 12112,
        "duplicate": true
    },
    {
        "title": "Hold My Hand",
        "artist_name": "Lady Gaga",
        "video_id": null,
        "capture_date": "2022-05-29 07:31:08.256256",
        "source_id": 1204,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Web",
        "artist_name": "070 Shake",
        "video_id": null,
        "capture_date": "2022-05-29 07:31:08.256256",
        "source_id": 1204,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Come Back",
        "artist_name": "Sharon Van Etten",
        "video_id": null,
        "capture_date": "2022-05-29 07:31:08.256256",
        "source_id": 1204,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mirrorball",
        "artist_name": "Kathleen Hanna, Erica Dawn Lyle and Vice Cooler",
        "video_id": null,
        "capture_date": "2022-05-29 07:31:08.256256",
        "source_id": 1204,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Le Bal Est Fini",
        "artist_name": "Leyla McCalla",
        "video_id": null,
        "capture_date": "2022-05-29 07:31:08.256256",
        "source_id": 1204,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "D.M.B.",
        "artist_name": "ASAP Rocky",
        "video_id": null,
        "capture_date": "2022-05-29 07:31:08.256256",
        "source_id": 1204,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Ribs",
        "artist_name": "Tirzah",
        "video_id": null,
        "capture_date": "2022-05-29 07:31:08.257257",
        "source_id": 1204,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "New Scars",
        "artist_name": "Glasser",
        "video_id": null,
        "capture_date": "2022-05-29 07:31:08.257257",
        "source_id": 1204,
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
  ('O.G.', 'Black Star', NULL),
  ('Vegas', 'Doja Cat', NULL),
  ('Western Wind', 'Carly Rae Jepsen', NULL),
  ('Hold My Hand', 'Lady Gaga', NULL),
  ('Web', '070 Shake', NULL),
  ('Come Back', 'Sharon Van Etten', NULL),
  ('Mirrorball', 'Kathleen Hanna, Erica Dawn Lyle and Vice Cooler', NULL),
  ('Le Bal Est Fini', 'Leyla McCalla', NULL),
  ('D.M.B.', 'ASAP Rocky', NULL),
  ('Ribs', 'Tirzah', NULL),
  ('New Scars', 'Glasser', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 12151; // SELECT last_insert_rowid();

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
  ('2022-05-29 07:31:08.255255', '1204', '12141'),
  ('2022-05-29 07:31:08.256256', '1204', '12142'),
  ('2022-05-29 07:31:08.256256', '1204', '12143'),
  ('2022-05-29 07:31:08.256256', '1204', '12112'),
  ('2022-05-29 07:31:08.256256', '1204', '12144'),
  ('2022-05-29 07:31:08.256256', '1204', '12145'),
  ('2022-05-29 07:31:08.256256', '1204', '12146'),
  ('2022-05-29 07:31:08.256256', '1204', '12147'),
  ('2022-05-29 07:31:08.256256', '1204', '12148'),
  ('2022-05-29 07:31:08.256256', '1204', '12149'),
  ('2022-05-29 07:31:08.257257', '1204', '12150'),
  ('2022-05-29 07:31:08.257257', '1204', '12151')
  ;

  // Update to source_song table
