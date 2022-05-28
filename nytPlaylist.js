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
    ('New York Times', 'The Playlist', 'Mavis Staples and Levon Helm’s Last Show, and 12 More New Songs', '2022-04-22 07:45:06.000000', 'https://www.nytimes.com/2022/04/22/arts/music/playlist-mavis-staples-pusha-t-shakira.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1194; // SELECT last_insert_rowid();
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
        "title": "You Got to Move",
        "artist_name": "Mavis Staples and Levon Helm",
        "video_id": null,
        "capture_date": "2022-05-28 07:55:11.080080",
        "source_id": 1194,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dreamin of the Past",
        "artist_name": "Pusha T ft. Ye",
        "video_id": null,
        "capture_date": "2022-05-28 07:55:11.089089",
        "source_id": 1194,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Te Felicito",
        "artist_name": "Shakira and Rauw Alejandro",
        "video_id": null,
        "capture_date": "2022-05-28 07:55:11.089089",
        "source_id": 1194,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "420",
        "artist_name": "Midas the Jagaban ft. Liya",
        "video_id": null,
        "capture_date": "2022-05-28 07:55:11.089089",
        "source_id": 1194,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Where You Are",
        "artist_name": "PinkPantheress ft. Willow",
        "video_id": null,
        "capture_date": "2022-05-28 07:55:11.089089",
        "source_id": 1194,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Winter Windows",
        "artist_name": "Laura Veirs",
        "video_id": null,
        "capture_date": "2022-05-28 07:55:11.089089",
        "source_id": 1194,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "There’s So Many People That Want to Be Loved",
        "artist_name": "Sorry",
        "video_id": null,
        "capture_date": "2022-05-28 07:55:11.089089",
        "source_id": 1194,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "M.I.A.",
        "artist_name": "Ravyn Lenae",
        "video_id": null,
        "capture_date": "2022-05-28 07:55:11.089089",
        "source_id": 1194,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Crimes",
        "artist_name": "Ruth Radelet",
        "video_id": null,
        "capture_date": "2022-05-28 07:55:11.090090",
        "source_id": 1194,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Ya No Estoy Aquí",
        "artist_name": "Helado Negro",
        "video_id": null,
        "capture_date": "2022-05-28 07:55:11.090090",
        "source_id": 1194,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "U.D.I.D.",
        "artist_name": "Lou Roy",
        "video_id": null,
        "capture_date": "2022-05-28 07:55:11.090090",
        "source_id": 1194,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Man Who Never Sleeps",
        "artist_name": "Charles Mingus",
        "video_id": null,
        "capture_date": "2022-05-28 07:55:11.090090",
        "source_id": 1194,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Abolition of Art, the Abolition of Freedom, the Abolition of You and Me",
        "artist_name": "Fred Moten, Brandon López and Gerald Cleaver",
        "video_id": null,
        "capture_date": "2022-05-28 07:55:11.090090",
        "source_id": 1194,
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
  ('You Got to Move', 'Mavis Staples and Levon Helm', NULL),
  ('Dreamin of the Past', 'Pusha T ft. Ye', NULL),
  ('Te Felicito', 'Shakira and Rauw Alejandro', NULL),
  ('420', 'Midas the Jagaban ft. Liya', NULL),
  ('Where You Are', 'PinkPantheress ft. Willow', NULL),
  ('Winter Windows', 'Laura Veirs', NULL),
  ('There’s So Many People That Want to Be Loved', 'Sorry', NULL),
  ('M.I.A.', 'Ravyn Lenae', NULL),
  ('Crimes', 'Ruth Radelet', NULL),
  ('Ya No Estoy Aquí', 'Helado Negro', NULL),
  ('U.D.I.D.', 'Lou Roy', NULL),
  ('The Man Who Never Sleeps', 'Charles Mingus', NULL),
  ('The Abolition of Art, the Abolition of Freedom, the Abolition of You and Me', 'Fred Moten, Brandon López and Gerald Cleaver', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 12063; // SELECT last_insert_rowid();

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
  ('2022-05-28 07:55:11.080080', '1194', '12051'),
  ('2022-05-28 07:55:11.089089', '1194', '12052'),
  ('2022-05-28 07:55:11.089089', '1194', '12053'),
  ('2022-05-28 07:55:11.089089', '1194', '12054'),
  ('2022-05-28 07:55:11.089089', '1194', '12055'),
  ('2022-05-28 07:55:11.089089', '1194', '12056'),
  ('2022-05-28 07:55:11.089089', '1194', '12057'),
  ('2022-05-28 07:55:11.089089', '1194', '12058'),
  ('2022-05-28 07:55:11.090090', '1194', '12059'),
  ('2022-05-28 07:55:11.090090', '1194', '12060'),
  ('2022-05-28 07:55:11.090090', '1194', '12061'),
  ('2022-05-28 07:55:11.090090', '1194', '12062'),
  ('2022-05-28 07:55:11.090090', '1194', '12063')
  ;

  // Update to source_song table
