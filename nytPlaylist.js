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
    ('New York Times', 'The Playlist', 'Beyoncé’s Dance-Floor Salvation, and 12 More New Songs', '2022-06-28 10:59:30.000000', 'https://www.nytimes.com/2022/06/24/arts/music/playlist-beyonce-taylor-swift.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1271; // SELECT last_insert_rowid();
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
        "title": "Break My Soul",
        "artist_name": "Beyoncé",
        "video_id": null,
        "capture_date": "2022-06-29 09:05:18.611611",
        "source_id": 1271,
        "song_id": 12418,
        "duplicate": true
    },
    {
        "title": "Cracker Island",
        "artist_name": "Gorillaz ft. Thundercat",
        "video_id": null,
        "capture_date": "2022-06-29 09:05:18.612612",
        "source_id": 1271,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I Got a Love",
        "artist_name": "Elizabeth King",
        "video_id": null,
        "capture_date": "2022-06-29 09:05:18.612612",
        "source_id": 1271,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Take It Like a Man",
        "artist_name": "Amanda Shires",
        "video_id": null,
        "capture_date": "2022-06-29 09:05:18.612612",
        "source_id": 1271,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Carolina",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2022-06-29 09:05:18.612612",
        "source_id": 1271,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Canção da Cura",
        "artist_name": "Sessa",
        "video_id": null,
        "capture_date": "2022-06-29 09:05:18.612612",
        "source_id": 1271,
        "song_id": 12220,
        "duplicate": true
    },
    {
        "title": "Blacklight Shine",
        "artist_name": "The Mars Volta",
        "video_id": null,
        "capture_date": "2022-06-29 09:05:18.612612",
        "source_id": 1271,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Watawi",
        "artist_name": "CKay ft. Davido, Focalistic and Abidoza",
        "video_id": null,
        "capture_date": "2022-06-29 09:05:18.612612",
        "source_id": 1271,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Runner",
        "artist_name": "Alex G",
        "video_id": null,
        "capture_date": "2022-06-29 09:05:18.612612",
        "source_id": 1271,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Late to da Party",
        "artist_name": "Lil Nas X ft. YoungBoy Never Broke Again",
        "video_id": null,
        "capture_date": "2022-06-29 09:05:18.612612",
        "source_id": 1271,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "True Romance",
        "artist_name": "Tove Lo",
        "video_id": null,
        "capture_date": "2022-06-29 09:05:18.612612",
        "source_id": 1271,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Heaven Come Crashing",
        "artist_name": "Rachika Nayar",
        "video_id": null,
        "capture_date": "2022-06-29 09:05:18.612612",
        "source_id": 1271,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Will Never Be Forgotten",
        "artist_name": "Abraham Burton and Eric McPherson",
        "video_id": null,
        "capture_date": "2022-06-29 09:05:18.612612",
        "source_id": 1271,
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
  ('Cracker Island', 'Gorillaz ft. Thundercat', NULL),
  ('I Got a Love', 'Elizabeth King', NULL),
  ('Take It Like a Man', 'Amanda Shires', NULL),
  ('Carolina', 'Taylor Swift', NULL),
  ('Blacklight Shine', 'The Mars Volta', NULL),
  ('Watawi', 'CKay ft. Davido, Focalistic and Abidoza', NULL),
  ('Runner', 'Alex G', NULL),
  ('Late to da Party', 'Lil Nas X ft. YoungBoy Never Broke Again', NULL),
  ('True Romance', 'Tove Lo', NULL),
  ('Heaven Come Crashing', 'Rachika Nayar', NULL),
  ('Will Never Be Forgotten', 'Abraham Burton and Eric McPherson', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 12440; // SELECT last_insert_rowid();

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
  ('2022-06-29 09:05:18.611611', '1271', '12418'),
  ('2022-06-29 09:05:18.612612', '1271', '12430'),
  ('2022-06-29 09:05:18.612612', '1271', '12431'),
  ('2022-06-29 09:05:18.612612', '1271', '12432'),
  ('2022-06-29 09:05:18.612612', '1271', '12433'),
  ('2022-06-29 09:05:18.612612', '1271', '12220'),
  ('2022-06-29 09:05:18.612612', '1271', '12434'),
  ('2022-06-29 09:05:18.612612', '1271', '12435'),
  ('2022-06-29 09:05:18.612612', '1271', '12436'),
  ('2022-06-29 09:05:18.612612', '1271', '12437'),
  ('2022-06-29 09:05:18.612612', '1271', '12438'),
  ('2022-06-29 09:05:18.612612', '1271', '12439'),
  ('2022-06-29 09:05:18.612612', '1271', '12440')
  ;

  // Update to source_song table
