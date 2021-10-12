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
    ('New York Times', 'The Playlist', 'Taylor Swift Rejoins Her ‘Folklore’ Crew, and 8 More New Songs', '2021-10-11 01:03:52.000000', 'https://www.nytimes.com/2021/07/02/arts/music/playlist-taylor-swift-drake-j-balvin.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 962; // SELECT last_insert_rowid();
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
          "title": "Renegade",
          "artist_name": "Big Red Machine ft. Taylor Swift",
          "video_id": null,
          "capture_date": "2021-10-12 12:36:49.283283",
          "source_id": 962,
          "song_id": 10651,
          "duplicate": true
      },
      {
          "title": "Wasting Time",
          "artist_name": "Brent Faiyaz ft. Drake",
          "video_id": null,
          "capture_date": "2021-10-12 12:36:49.284284",
          "source_id": 962,
          "song_id": 10650,
          "duplicate": true
      },
      {
          "title": "In da Getto",
          "artist_name": "J. Balvin and Skrillex",
          "video_id": null,
          "capture_date": "2021-10-12 12:36:49.284284",
          "source_id": 962,
          "song_id": 10760,
          "duplicate": true
      },
      {
          "title": "Nu Ga Je Dansen",
          "artist_name": "De Schuurman",
          "video_id": null,
          "capture_date": "2021-10-12 12:36:49.284284",
          "source_id": 962,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Dark Star",
          "artist_name": "Chicano Batman",
          "video_id": null,
          "capture_date": "2021-10-12 12:36:49.284284",
          "source_id": 962,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Kudzana Dzana",
          "artist_name": "Ti Gonzi",
          "video_id": null,
          "capture_date": "2021-10-12 12:36:49.284284",
          "source_id": 962,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Heartbreak Anniversary",
          "artist_name": "Tarrus Riley",
          "video_id": null,
          "capture_date": "2021-10-12 12:36:49.284284",
          "source_id": 962,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Worse",
          "artist_name": "Sarah Proctor",
          "video_id": null,
          "capture_date": "2021-10-12 12:36:49.284284",
          "source_id": 962,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Iowa 146",
          "artist_name": "Squirrel Flower",
          "video_id": null,
          "capture_date": "2021-10-12 12:36:49.284284",
          "source_id": 962,
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
  ('Nu Ga Je Dansen', 'De Schuurman', NULL),
  ('Dark Star', 'Chicano Batman', NULL),
  ('Kudzana Dzana', 'Ti Gonzi', NULL),
  ('Heartbreak Anniversary', 'Tarrus Riley', NULL),
  ('Worse', 'Sarah Proctor', NULL),
  ('Iowa 146', 'Squirrel Flower', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10858; // SELECT last_insert_rowid();

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
  ('2021-10-12 12:36:49.283283', '962', '10651'),
  ('2021-10-12 12:36:49.284284', '962', '10650'),
  ('2021-10-12 12:36:49.284284', '962', '10760'),
  ('2021-10-12 12:36:49.284284', '962', '10853'),
  ('2021-10-12 12:36:49.284284', '962', '10854'),
  ('2021-10-12 12:36:49.284284', '962', '10855'),
  ('2021-10-12 12:36:49.284284', '962', '10856'),
  ('2021-10-12 12:36:49.284284', '962', '10857'),
  ('2021-10-12 12:36:49.284284', '962', '10858')
  ;

  // Update to source_song table
