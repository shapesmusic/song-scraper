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
    ('New York Times', 'The Playlist', 'Post Malone and the Weeknd’s Emo Synth-Pop, and 12 More New Songs', '2021-11-05 10:59:18.000000', 'https://www.nytimes.com/2021/11/05/arts/music/playlist-post-malone-the-weeknd-kendrick-lamar.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1063; // SELECT last_insert_rowid();
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
//          find and replace "Featur~ing" with "ft."
//

  songsData =
  [
    {
        "title": "One Right Now",
        "artist_name": "Post Malone and the Weeknd",
        "video_id": null,
        "capture_date": "2021-12-31 11:20:39.222222",
        "source_id": 1063,
        "song_id": 11167,
        "duplicate": true
    },
    {
        "title": "New Shapes",
        "artist_name": "Charli XCX ft. Christine and the Queens and Caroline Polachek",
        "video_id": null,
        "capture_date": "2021-12-31 11:20:39.222222",
        "source_id": 1063,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Drones",
        "artist_name": "Terrace Martin ft. Kendrick Lamar, Snoop Dogg, Ty Dolla Sign and James Fauntleroy",
        "video_id": null,
        "capture_date": "2021-12-31 11:20:39.223223",
        "source_id": 1063,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Loose Your Mind",
        "artist_name": "Dawn Richard",
        "video_id": null,
        "capture_date": "2021-12-31 11:20:39.223223",
        "source_id": 1063,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Tums",
        "artist_name": "TNGHT",
        "video_id": null,
        "capture_date": "2021-12-31 11:20:39.223223",
        "source_id": 1063,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Woman",
        "artist_name": "Simi",
        "video_id": null,
        "capture_date": "2021-12-31 11:20:39.223223",
        "source_id": 1063,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Puppy and a Truck",
        "artist_name": "Jenny Lewis",
        "video_id": null,
        "capture_date": "2021-12-31 11:20:39.223223",
        "source_id": 1063,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Fear",
        "artist_name": "Chastity Belt",
        "video_id": null,
        "capture_date": "2021-12-31 11:20:39.223223",
        "source_id": 1063,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Follow Me Around",
        "artist_name": "Radiohead",
        "video_id": null,
        "capture_date": "2021-12-31 11:20:39.223223",
        "source_id": 1063,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hold No Grudge",
        "artist_name": "Lorde",
        "video_id": null,
        "capture_date": "2021-12-31 11:20:39.223223",
        "source_id": 1063,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bad Life",
        "artist_name": "Omar Apollo ft. Kali Uchis",
        "video_id": null,
        "capture_date": "2021-12-31 11:20:39.223223",
        "source_id": 1063,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Get Better",
        "artist_name": "Alt-J",
        "video_id": null,
        "capture_date": "2021-12-31 11:20:39.223223",
        "source_id": 1063,
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
  ('New Shapes', 'Charli XCX ft. Christine and the Queens and Caroline Polachek', NULL),
  ('Drones', 'Terrace Martin ft. Kendrick Lamar, Snoop Dogg, Ty Dolla Sign and James Fauntleroy', NULL),
  ('Loose Your Mind', 'Dawn Richard', NULL),
  ('Tums', 'TNGHT', NULL),
  ('Woman', 'Simi', NULL),
  ('Puppy and a Truck', 'Jenny Lewis', NULL),
  ('Fear', 'Chastity Belt', NULL),
  ('Follow Me Around', 'Radiohead', NULL),
  ('Hold No Grudge', 'Lorde', NULL),
  ('Bad Life', 'Omar Apollo ft. Kali Uchis', NULL),
  ('Get Better', 'Alt-J', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11288; // SELECT last_insert_rowid();

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
  ('2021-12-31 11:20:39.222222', '1063', '11167'),
  ('2021-12-31 11:20:39.222222', '1063', '11278'),
  ('2021-12-31 11:20:39.223223', '1063', '11279'),
  ('2021-12-31 11:20:39.223223', '1063', '11280'),
  ('2021-12-31 11:20:39.223223', '1063', '11281'),
  ('2021-12-31 11:20:39.223223', '1063', '11282'),
  ('2021-12-31 11:20:39.223223', '1063', '11283'),
  ('2021-12-31 11:20:39.223223', '1063', '11284'),
  ('2021-12-31 11:20:39.223223', '1063', '11285'),
  ('2021-12-31 11:20:39.223223', '1063', '11286'),
  ('2021-12-31 11:20:39.223223', '1063', '11287'),
  ('2021-12-31 11:20:39.223223', '1063', '11288')
  ;

  // Update to source_song table
