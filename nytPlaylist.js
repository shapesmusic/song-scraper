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
    ('New York Times', 'The Playlist', 'Florence + the Machine’s Conflicted Coronation, and 12 More New Songs', '2022-02-25 10:18:19.000000', 'https://www.nytimes.com/2022/02/25/arts/music/playlist-florence-the-machine-kehlani.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1155; // SELECT last_insert_rowid();
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
//          find and replace "featur~ing" with "ft."
//

  songsData =
  [
    {
        "title": "King",
        "artist_name": "Florence + the Machine",
        "video_id": null,
        "capture_date": "2022-03-06 09:10:55.939939",
        "source_id": 1155,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Made Up Mind",
        "artist_name": "Bonnie Raitt",
        "video_id": null,
        "capture_date": "2022-03-06 09:10:55.940940",
        "source_id": 1155,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Little Story",
        "artist_name": "Kehlani",
        "video_id": null,
        "capture_date": "2022-03-06 09:10:55.940940",
        "source_id": 1155,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Greener Pasture",
        "artist_name": "Carter Faith",
        "video_id": null,
        "capture_date": "2022-03-06 09:10:55.940940",
        "source_id": 1155,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Come Away With Me (Alternate Version)",
        "artist_name": "Norah Jones",
        "video_id": null,
        "capture_date": "2022-03-06 09:10:55.940940",
        "source_id": 1155,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Back to the Radio",
        "artist_name": "Porridge Radio",
        "video_id": null,
        "capture_date": "2022-03-06 09:10:55.940940",
        "source_id": 1155,
        "song_id": 11724,
        "duplicate": true
    },
    {
        "title": "Letter to Ur Ex",
        "artist_name": "Mahalia",
        "video_id": null,
        "capture_date": "2022-03-06 09:10:55.940940",
        "source_id": 1155,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Pegao!!!",
        "artist_name": "Esty",
        "video_id": null,
        "capture_date": "2022-03-06 09:10:55.940940",
        "source_id": 1155,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bbycakes",
        "artist_name": "Mura Masa ft. Lil Uzi Vert, PinkPantheress and Shygirl",
        "video_id": null,
        "capture_date": "2022-03-06 09:10:55.940940",
        "source_id": 1155,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Put Your Hands On My ____ (Original Phonk Version)",
        "artist_name": "R3hab ft. Saucy Santana",
        "video_id": null,
        "capture_date": "2022-03-06 09:10:55.940940",
        "source_id": 1155,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Ahhh Ha",
        "artist_name": "Lil Durk",
        "video_id": null,
        "capture_date": "2022-03-06 09:10:55.940940",
        "source_id": 1155,
        "song_id": 11739,
        "duplicate": true
    },
    {
        "title": "Comandante",
        "artist_name": "Kiko El Crazy, Braulio Fogón and Randy",
        "video_id": null,
        "capture_date": "2022-03-06 09:10:55.940940",
        "source_id": 1155,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sequence of Events",
        "artist_name": "Charles Goold",
        "video_id": null,
        "capture_date": "2022-03-06 09:10:55.940940",
        "source_id": 1155,
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
  ('King', 'Florence + the Machine', NULL),
  ('Made Up Mind', 'Bonnie Raitt', NULL),
  ('Little Story', 'Kehlani', NULL),
  ('Greener Pasture', 'Carter Faith', NULL),
  ('Come Away With Me (Alternate Version)', 'Norah Jones', NULL),
  ('Letter to Ur Ex', 'Mahalia', NULL),
  ('Pegao!!!', 'Esty', NULL),
  ('Bbycakes', 'Mura Masa ft. Lil Uzi Vert, PinkPantheress and Shygirl', NULL),
  ('Put Your Hands On My ____ (Original Phonk Version)', 'R3hab ft. Saucy Santana', NULL),
  ('Comandante', 'Kiko El Crazy, Braulio Fogón and Randy', NULL),
  ('Sequence of Events', 'Charles Goold', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11753; // SELECT last_insert_rowid();

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
  ('2022-03-06 09:10:55.939939', '1155', '11743'),
  ('2022-03-06 09:10:55.940940', '1155', '11744'),
  ('2022-03-06 09:10:55.940940', '1155', '11745'),
  ('2022-03-06 09:10:55.940940', '1155', '11746'),
  ('2022-03-06 09:10:55.940940', '1155', '11747'),
  ('2022-03-06 09:10:55.940940', '1155', '11724'),
  ('2022-03-06 09:10:55.940940', '1155', '11748'),
  ('2022-03-06 09:10:55.940940', '1155', '11749'),
  ('2022-03-06 09:10:55.940940', '1155', '11750'),
  ('2022-03-06 09:10:55.940940', '1155', '11751'),
  ('2022-03-06 09:10:55.940940', '1155', '11739'),
  ('2022-03-06 09:10:55.940940', '1155', '11752'),
  ('2022-03-06 09:10:55.940940', '1155', '11753')
  ;

  // Update to source_song table
