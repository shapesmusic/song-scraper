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
    ('New York Times', 'The Playlist', 'Billie Eilish’s Portrait of Power Abuse, and 11 More New Songs', '2021-05-03 07:44:15.000000', 'https://www.nytimes.com/2021/04/30/arts/music/playlist-billie-eilish-cardi-b-willow.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 907; // SELECT last_insert_rowid();
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
        "title": "Your Power",
        "artist_name": "Billie Eilish",
        "video_id": null,
        "capture_date": "2021-05-07 06:22:27.747747",
        "source_id": 907,
        "song_id": 10313,
        "duplicate": true
    },
    {
        "title": "Transparentsoul",
        "artist_name": "Willow featuring Travis Barker",
        "video_id": null,
        "capture_date": "2021-05-07 06:22:27.748748",
        "source_id": 907,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Serotonin",
        "artist_name": "girl in red",
        "video_id": null,
        "capture_date": "2021-05-07 06:22:27.749749",
        "source_id": 907,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Big Paper",
        "artist_name": "DJ Khaled featuring Cardi B",
        "video_id": null,
        "capture_date": "2021-05-07 06:22:27.749749",
        "source_id": 907,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "If You Care",
        "artist_name": "Q",
        "video_id": null,
        "capture_date": "2021-05-07 06:22:27.749749",
        "source_id": 907,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sad Girls Do Sad Things",
        "artist_name": "Priscilla Block",
        "video_id": null,
        "capture_date": "2021-05-07 06:22:27.749749",
        "source_id": 907,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I’d Rather Be Alone",
        "artist_name": "Brye",
        "video_id": null,
        "capture_date": "2021-05-07 06:22:27.749749",
        "source_id": 907,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Swimmer",
        "artist_name": "Half Waif",
        "video_id": null,
        "capture_date": "2021-05-07 06:22:27.749749",
        "source_id": 907,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Space Cadet",
        "artist_name": "Burial",
        "video_id": null,
        "capture_date": "2021-05-07 06:22:27.749749",
        "source_id": 907,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "La Otra",
        "artist_name": "Sofía Rei",
        "video_id": null,
        "capture_date": "2021-05-07 06:22:27.749749",
        "source_id": 907,
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
  ('Transparentsoul', 'Willow featuring Travis Barker', NULL),
  ('Serotonin', 'girl in red', NULL),
  ('Big Paper', 'DJ Khaled featuring Cardi B', NULL),
  ('If You Care', 'Q', NULL),
  ('Sad Girls Do Sad Things', 'Priscilla Block', NULL),
  ('I’d Rather Be Alone', 'Brye', NULL),
  ('Swimmer', 'Half Waif', NULL),
  ('Space Cadet', 'Burial', NULL),
  ('La Otra', 'Sofía Rei', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10337; // SELECT last_insert_rowid();

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
  ('2021-05-07 06:22:27.747747', '907', '10313'),
  ('2021-05-07 06:22:27.748748', '907', '10329'),
  ('2021-05-07 06:22:27.749749', '907', '10330'),
  ('2021-05-07 06:22:27.749749', '907', '10331'),
  ('2021-05-07 06:22:27.749749', '907', '10332'),
  ('2021-05-07 06:22:27.749749', '907', '10333'),
  ('2021-05-07 06:22:27.749749', '907', '10334'),
  ('2021-05-07 06:22:27.749749', '907', '10335'),
  ('2021-05-07 06:22:27.749749', '907', '10336'),
  ('2021-05-07 06:22:27.749749', '907', '10337')
  ;

  // Update to source_song table
