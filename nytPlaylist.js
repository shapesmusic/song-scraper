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
    ('New York Times', 'The Playlist', 'Taylor Swift’s Revised ‘Revenge,’ and 10 More New Songs', '2023-07-07 09:44:16.000000', 'https://www.nytimes.com/2023/07/07/arts/music/playlist-taylor-swift-speak-now-better-than-revenge.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1663; // SELECT last_insert_rowid();
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
        "title": "Better Than Revenge (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2023-07-14 07:10:06.309309",
        "source_id": 1663,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Everybody’s Got to Learn",
        "artist_name": "First Aid Kit",
        "video_id": null,
        "capture_date": "2023-07-14 07:10:06.310310",
        "source_id": 1663,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "All a Share Together Now",
        "artist_name": "Prince",
        "video_id": null,
        "capture_date": "2023-07-14 07:10:06.310310",
        "source_id": 1663,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cuando Baje el Sol",
        "artist_name": "Rauw Alejandro",
        "video_id": null,
        "capture_date": "2023-07-14 07:10:06.310310",
        "source_id": 1663,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Gravity",
        "artist_name": "Kaisa’s Machine",
        "video_id": null,
        "capture_date": "2023-07-14 07:10:06.310310",
        "source_id": 1663,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Why Am I Alive Now?",
        "artist_name": "Anohni and the Johnsons",
        "video_id": null,
        "capture_date": "2023-07-14 07:10:06.310310",
        "source_id": 1663,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Glow",
        "artist_name": "Little Dragon ft. Damon Albarn",
        "video_id": null,
        "capture_date": "2023-07-14 07:10:06.310310",
        "source_id": 1663,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sasha, Sissi y el Círculo de Baba",
        "artist_name": "Fito Páez ft. Mon Laferte",
        "video_id": null,
        "capture_date": "2023-07-14 07:10:06.310310",
        "source_id": 1663,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Silent Assassin",
        "artist_name": "Tkay Maidza & Flume",
        "video_id": null,
        "capture_date": "2023-07-14 07:10:06.310310",
        "source_id": 1663,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Lwonesome Tonight",
        "artist_name": "PJ Harvey",
        "video_id": null,
        "capture_date": "2023-07-14 07:10:06.310310",
        "source_id": 1663,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "God Be With You",
        "artist_name": "Brian Blade & the Fellowship Band",
        "video_id": null,
        "capture_date": "2023-07-14 07:10:06.310310",
        "source_id": 1663,
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
  ('Better Than Revenge (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Everybody’s Got to Learn', 'First Aid Kit', NULL),
  ('All a Share Together Now', 'Prince', NULL),
  ('Cuando Baje el Sol', 'Rauw Alejandro', NULL),
  ('Gravity', 'Kaisa’s Machine', NULL),
  ('Why Am I Alive Now?', 'Anohni and the Johnsons', NULL),
  ('Glow', 'Little Dragon ft. Damon Albarn', NULL),
  ('Sasha, Sissi y el Círculo de Baba', 'Fito Páez ft. Mon Laferte', NULL),
  ('Silent Assassin', 'Tkay Maidza & Flume', NULL),
  ('Lwonesome Tonight', 'PJ Harvey', NULL),
  ('God Be With You', 'Brian Blade & the Fellowship Band', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 14489; // SELECT last_insert_rowid();

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
  ('2023-07-14 07:10:06.309309', '1663', '14479'),
  ('2023-07-14 07:10:06.310310', '1663', '14480'),
  ('2023-07-14 07:10:06.310310', '1663', '14481'),
  ('2023-07-14 07:10:06.310310', '1663', '14482'),
  ('2023-07-14 07:10:06.310310', '1663', '14483'),
  ('2023-07-14 07:10:06.310310', '1663', '14484'),
  ('2023-07-14 07:10:06.310310', '1663', '14485'),
  ('2023-07-14 07:10:06.310310', '1663', '14486'),
  ('2023-07-14 07:10:06.310310', '1663', '14487'),
  ('2023-07-14 07:10:06.310310', '1663', '14488'),
  ('2023-07-14 07:10:06.310310', '1663', '14489')
  ;

  // Update to source_song table
