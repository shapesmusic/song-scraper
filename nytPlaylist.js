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
    ('New York Times', 'The Playlist', 'Robert Plant and Alison Krauss Team Up Again, and 10 More New Songs', '2021-08-13 11:55:24.000000', 'https://www.nytimes.com/2021/08/13/arts/music/playlist-cardi-b-lizzo-machine-gun-kelly.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 968; // SELECT last_insert_rowid();
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
          "title": "Can’t Let Go",
          "artist_name": "Robert Plant and Alison Krauss",
          "video_id": null,
          "capture_date": "2021-10-12 04:46:38.038038",
          "source_id": 968,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Candidate",
          "artist_name": "Jade Bird",
          "video_id": null,
          "capture_date": "2021-10-12 04:46:38.039039",
          "source_id": 968,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Think About You",
          "artist_name": "Ladyhawke",
          "video_id": null,
          "capture_date": "2021-10-12 04:46:38.039039",
          "source_id": 968,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Under My Skin",
          "artist_name": "Katy B",
          "video_id": null,
          "capture_date": "2021-10-12 04:46:38.039039",
          "source_id": 968,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Rumors",
          "artist_name": "Lizzo ft. Cardi B",
          "video_id": null,
          "capture_date": "2021-10-12 04:46:38.039039",
          "source_id": 968,
          "song_id": 10710,
          "duplicate": true
      },
      {
          "title": "Nobody",
          "artist_name": "Nas ft. Ms. Lauryn Hill",
          "video_id": null,
          "capture_date": "2021-10-12 04:46:38.039039",
          "source_id": 968,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Before I Go",
          "artist_name": "Kodak Black ft. Rod Wave",
          "video_id": null,
          "capture_date": "2021-10-12 04:46:38.039039",
          "source_id": 968,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Papercuts",
          "artist_name": "Machine Gun Kelly",
          "video_id": null,
          "capture_date": "2021-10-12 04:46:38.039039",
          "source_id": 968,
          "song_id": 10713,
          "duplicate": true
      },
      {
          "title": "Little Things",
          "artist_name": "Big Thief",
          "video_id": null,
          "capture_date": "2021-10-12 04:46:38.039039",
          "source_id": 968,
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
  ('Can’t Let Go', 'Robert Plant and Alison Krauss', NULL),
  ('Candidate', 'Jade Bird', NULL),
  ('Think About You', 'Ladyhawke', NULL),
  ('Under My Skin', 'Katy B', NULL),
  ('Nobody', 'Nas ft. Ms. Lauryn Hill', NULL),
  ('Before I Go', 'Kodak Black ft. Rod Wave', NULL),
  ('Little Things', 'Big Thief', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10913; // SELECT last_insert_rowid();

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
  ('2021-10-12 04:46:38.038038', '968', '10907'),
  ('2021-10-12 04:46:38.039039', '968', '10908'),
  ('2021-10-12 04:46:38.039039', '968', '10909'),
  ('2021-10-12 04:46:38.039039', '968', '10910'),
  ('2021-10-12 04:46:38.039039', '968', '10710'),
  ('2021-10-12 04:46:38.039039', '968', '10911'),
  ('2021-10-12 04:46:38.039039', '968', '10912'),
  ('2021-10-12 04:46:38.039039', '968', '10713'),
  ('2021-10-12 04:46:38.039039', '968', '10913')
  ;

  // Update to source_song table
