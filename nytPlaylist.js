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
    ('New York Times', 'The Playlist', 'Mitski’s Beautifully Moody Meditation, and 11 More New Songs', '2023-08-07 07:52:26.000000', 'https://www.nytimes.com/2023/08/04/arts/music/playlist-mitski-post-malone-jorja-smith.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1684; // SELECT last_insert_rowid();
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
        "title": "Bug Like an Angel",
        "artist_name": "Mitski",
        "video_id": null,
        "capture_date": "2023-08-14 06:02:24.288288",
        "source_id": 1684,
        "song_id": 14558,
        "duplicate": true
    },
    {
        "title": "This Isn’t Me",
        "artist_name": "Towa Bird",
        "video_id": null,
        "capture_date": "2023-08-14 06:02:24.290290",
        "source_id": 1684,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Go Go Go",
        "artist_name": "Jorja Smith",
        "video_id": null,
        "capture_date": "2023-08-14 06:02:24.290290",
        "source_id": 1684,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Joy",
        "artist_name": "Post Malone",
        "video_id": null,
        "capture_date": "2023-08-14 06:02:24.290290",
        "source_id": 1684,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Evicted",
        "artist_name": "Wilco",
        "video_id": null,
        "capture_date": "2023-08-14 06:02:24.290290",
        "source_id": 1684,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Angel",
        "artist_name": "Halle",
        "video_id": null,
        "capture_date": "2023-08-14 06:02:24.290290",
        "source_id": 1684,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Singing Bones",
        "artist_name": "Nite Bjuti",
        "video_id": null,
        "capture_date": "2023-08-14 06:02:24.290290",
        "source_id": 1684,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Yes!",
        "artist_name": "Damon Locks & Rob Mazurek",
        "video_id": null,
        "capture_date": "2023-08-14 06:02:24.290290",
        "source_id": 1684,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Te Lo Agradezco",
        "artist_name": "Kany García and Carin Leon",
        "video_id": null,
        "capture_date": "2023-08-14 06:02:24.290290",
        "source_id": 1684,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Good Good",
        "artist_name": "Usher, Summer Walker and 21 Savage",
        "video_id": null,
        "capture_date": "2023-08-14 06:02:24.290290",
        "source_id": 1684,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Don’t Take Kindly",
        "artist_name": "Jonathan Suazo",
        "video_id": null,
        "capture_date": "2023-08-14 06:02:24.290290",
        "source_id": 1684,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Les Funambules",
        "artist_name": "Knoel Scott ft. Marshall Allen",
        "video_id": null,
        "capture_date": "2023-08-14 06:02:24.291291",
        "source_id": 1684,
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
  ('This Isn’t Me', 'Towa Bird', NULL),
  ('Go Go Go', 'Jorja Smith', NULL),
  ('Joy', 'Post Malone', NULL),
  ('Evicted', 'Wilco', NULL),
  ('Angel', 'Halle', NULL),
  ('Singing Bones', 'Nite Bjuti', NULL),
  ('Yes!', 'Damon Locks & Rob Mazurek', NULL),
  ('Te Lo Agradezco', 'Kany García and Carin Leon', NULL),
  ('Good Good', 'Usher, Summer Walker and 21 Savage', NULL),
  ('Don’t Take Kindly', 'Jonathan Suazo', NULL),
  ('Les Funambules', 'Knoel Scott ft. Marshall Allen', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 14620; // SELECT last_insert_rowid();

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
  ('2023-08-14 06:02:24.288288', '1684', '14558'),
  ('2023-08-14 06:02:24.290290', '1684', '14610'),
  ('2023-08-14 06:02:24.290290', '1684', '14611'),
  ('2023-08-14 06:02:24.290290', '1684', '14612'),
  ('2023-08-14 06:02:24.290290', '1684', '14613'),
  ('2023-08-14 06:02:24.290290', '1684', '14614'),
  ('2023-08-14 06:02:24.290290', '1684', '14615'),
  ('2023-08-14 06:02:24.290290', '1684', '14616'),
  ('2023-08-14 06:02:24.290290', '1684', '14617'),
  ('2023-08-14 06:02:24.290290', '1684', '14618'),
  ('2023-08-14 06:02:24.290290', '1684', '14619'),
  ('2023-08-14 06:02:24.291291', '1684', '14620')
  ;

  // Update to source_song table
