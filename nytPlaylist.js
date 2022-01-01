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
    ('New York Times', 'The Playlist', 'Taylor Swift and Phoebe Bridgers’s ‘Red’ Duet, and 14 More New Songs', '2021-11-12 11:05:59.000000', 'https://www.nytimes.com/2021/11/12/arts/music/taylor-swift-red.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1064; // SELECT last_insert_rowid();
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
        "title": "Nothing New",
        "artist_name": "Taylor Swift ft. Phoebe Bridgers",
        "video_id": null,
        "capture_date": "2022-01-01 09:36:44.630630",
        "source_id": 1064,
        "song_id": 11196,
        "duplicate": true
    },
    {
        "title": "Superstar",
        "artist_name": "Beach House",
        "video_id": null,
        "capture_date": "2022-01-01 09:36:44.631631",
        "source_id": 1064,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Be Alive",
        "artist_name": "Beyoncé",
        "video_id": null,
        "capture_date": "2022-01-01 09:36:44.631631",
        "source_id": 1064,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Open the Gates",
        "artist_name": "Irreversible Entanglements",
        "video_id": null,
        "capture_date": "2022-01-01 09:36:44.631631",
        "source_id": 1064,
        "song_id": 11010,
        "duplicate": true
    },
    {
        "title": "Amores de Droga",
        "artist_name": "Girl Ultra",
        "video_id": null,
        "capture_date": "2022-01-01 09:36:44.631631",
        "source_id": 1064,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cisgender",
        "artist_name": "Shamir",
        "video_id": null,
        "capture_date": "2022-01-01 09:36:44.631631",
        "source_id": 1064,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Only Heartbreaker",
        "artist_name": "Mitski",
        "video_id": null,
        "capture_date": "2022-01-01 09:36:44.631631",
        "source_id": 1064,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Alaska",
        "artist_name": "Pinegrove",
        "video_id": null,
        "capture_date": "2022-01-01 09:36:44.631631",
        "source_id": 1064,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Blue",
        "artist_name": "Camp Cope",
        "video_id": null,
        "capture_date": "2022-01-01 09:36:44.631631",
        "source_id": 1064,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Two Ribbons",
        "artist_name": "Let’s Eat Grandma",
        "video_id": null,
        "capture_date": "2022-01-01 09:36:44.631631",
        "source_id": 1064,
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
  ('Superstar', 'Beach House', NULL),
  ('Be Alive', 'Beyoncé', NULL),
  ('Amores de Droga', 'Girl Ultra', NULL),
  ('Cisgender', 'Shamir', NULL),
  ('The Only Heartbreaker', 'Mitski', NULL),
  ('Alaska', 'Pinegrove', NULL),
  ('Blue', 'Camp Cope', NULL),
  ('Two Ribbons', 'Let’s Eat Grandma', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11296; // SELECT last_insert_rowid();

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
  ('2022-01-01 09:36:44.630630', '1064', '11196'),
  ('2022-01-01 09:36:44.631631', '1064', '11289'),
  ('2022-01-01 09:36:44.631631', '1064', '11290'),
  ('2022-01-01 09:36:44.631631', '1064', '11010'),
  ('2022-01-01 09:36:44.631631', '1064', '11291'),
  ('2022-01-01 09:36:44.631631', '1064', '11292'),
  ('2022-01-01 09:36:44.631631', '1064', '11293'),
  ('2022-01-01 09:36:44.631631', '1064', '11294'),
  ('2022-01-01 09:36:44.631631', '1064', '11295'),
  ('2022-01-01 09:36:44.631631', '1064', '11296')
  ;

  // Update to source_song table
