// Scroll to the bottom of the page first, so all the lazyload stuff loads.

// NOTE: sometimes two songs are grouped as one entry. This would potentially mess up `video_id` scraping.


//
// Step 0: Check recent scraped
//

  SELECT instance_name, publication_date FROM source WHERE parent_entity = 'New York Times' ORDER BY publication_date DESC LIMIT 3;


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
    ('New York Times', 'The Playlist', 'SZA Teases What’s Next, and 11 More New Songs', '2021-03-12 08:58:56.000000', 'https://www.nytimes.com/2021/03/12/arts/music/playlist-sza-jorja-smith-rose.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 850; // SELECT last_insert_rowid();
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

  JSON.stringify(songsData, null, 4);


//
// Step 3:  Stage songsData,
//          preview chart and prune songs,
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "Good Days",
        "artist_name": "SZA",
        "video_id": null,
        "capture_date": "2021-03-16 11:10:54.272272",
        "source_id": 850,
        "song_id": 9716,
        "duplicate": true
    },
    {
        "title": "On the Ground",
        "artist_name": "Rosé",
        "video_id": null,
        "capture_date": "2021-03-16 11:10:54.273273",
        "source_id": 850,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Thumbs",
        "artist_name": "Lucy Dacus",
        "video_id": null,
        "capture_date": "2021-03-16 11:10:54.273273",
        "source_id": 850,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Addicted",
        "artist_name": "Jorja Smith",
        "video_id": null,
        "capture_date": "2021-03-16 11:10:54.273273",
        "source_id": 850,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "FWB",
        "artist_name": "Chika",
        "video_id": null,
        "capture_date": "2021-03-16 11:10:54.274274",
        "source_id": 850,
        "song_id": 9675,
        "duplicate": true
    },
    {
        "title": "Storm in Summer",
        "artist_name": "Skullcrusher",
        "video_id": null,
        "capture_date": "2021-03-16 11:10:54.274274",
        "source_id": 850,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Outside the Party, Inside the Dream",
        "artist_name": "cehryl",
        "video_id": null,
        "capture_date": "2021-03-16 11:10:54.274274",
        "source_id": 850,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Breakdown",
        "artist_name": "Spoon",
        "video_id": null,
        "capture_date": "2021-03-16 11:10:54.274274",
        "source_id": 850,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "A Face in the Crowd",
        "artist_name": "Spoon",
        "video_id": null,
        "capture_date": "2021-03-16 11:10:54.274274",
        "source_id": 850,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Budem Tantsevat / Listo Pa Bailar",
        "artist_name": "Bajofondo feat. Natalia Oreiro",
        "video_id": null,
        "capture_date": "2021-03-16 11:10:54.274274",
        "source_id": 850,
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
  ('On the Ground', 'Rosé', NULL),
  ('Thumbs', 'Lucy Dacus', NULL),
  ('Addicted', 'Jorja Smith', NULL),
  ('Storm in Summer', 'Skullcrusher', NULL),
  ('Outside the Party, Inside the Dream', 'cehryl', NULL),
  ('Breakdown', 'Spoon', NULL),
  ('A Face in the Crowd', 'Spoon', NULL),
  ('Budem Tantsevat / Listo Pa Bailar', 'Bajofondo feat. Natalia Oreiro', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10015; // SELECT last_insert_rowid();

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
  ('2021-03-16 11:10:54.272272', '850', '9716'),
  ('2021-03-16 11:10:54.273273', '850', '10008'),
  ('2021-03-16 11:10:54.273273', '850', '10009'),
  ('2021-03-16 11:10:54.273273', '850', '10010'),
  ('2021-03-16 11:10:54.274274', '850', '9675'),
  ('2021-03-16 11:10:54.274274', '850', '10011'),
  ('2021-03-16 11:10:54.274274', '850', '10012'),
  ('2021-03-16 11:10:54.274274', '850', '10013'),
  ('2021-03-16 11:10:54.274274', '850', '10014'),
  ('2021-03-16 11:10:54.274274', '850', '10015')
  ;

  // Update to source_song table
