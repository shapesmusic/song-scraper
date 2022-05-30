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
    ('New York Times', 'The Playlist', 'Rina Sawayama Flips Damnation Into a Dance Party, and 15 More New Songs', '2022-05-20 07:30:54.000000', 'https://www.nytimes.com/2022/05/20/arts/music/playlist-rina-sawayama-burna-boy.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1214; // SELECT last_insert_rowid();
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
        "title": "This Hell",
        "artist_name": "Rina Sawayama",
        "video_id": null,
        "capture_date": "2022-05-30 07:34:25.244244",
        "source_id": 1214,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Frown",
        "artist_name": "mxmtoon",
        "video_id": null,
        "capture_date": "2022-05-30 07:34:25.248248",
        "source_id": 1214,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Turn Up the Sunshine",
        "artist_name": "Diana Ross and Tame Impala",
        "video_id": null,
        "capture_date": "2022-05-30 07:34:25.248248",
        "source_id": 1214,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "She Don’t Know",
        "artist_name": "Carrie Underwood",
        "video_id": null,
        "capture_date": "2022-05-30 07:34:25.248248",
        "source_id": 1214,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Conchitas",
        "artist_name": "Katzù Oso",
        "video_id": null,
        "capture_date": "2022-05-30 07:34:25.248248",
        "source_id": 1214,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Selfish Soul",
        "artist_name": "Sudan Archives",
        "video_id": null,
        "capture_date": "2022-05-30 07:34:25.248248",
        "source_id": 1214,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Doomscroller",
        "artist_name": "Metric",
        "video_id": null,
        "capture_date": "2022-05-30 07:34:25.248248",
        "source_id": 1214,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sunburn",
        "artist_name": "Sylvan Esso",
        "video_id": null,
        "capture_date": "2022-05-30 07:34:25.248248",
        "source_id": 1214,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Last Last",
        "artist_name": "Burna Boy",
        "video_id": null,
        "capture_date": "2022-05-30 07:34:25.248248",
        "source_id": 1214,
        "song_id": 12213,
        "duplicate": true
    },
    {
        "title": "Metamorfosis",
        "artist_name": "Meridian Brothers & El Grupo Renacimiento",
        "video_id": null,
        "capture_date": "2022-05-30 07:34:25.248248",
        "source_id": 1214,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Watina",
        "artist_name": "Calypso Rose ft. Carlos Santana and the Garifuna Collective",
        "video_id": null,
        "capture_date": "2022-05-30 07:34:25.248248",
        "source_id": 1214,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I Wanna Hold Your Electric Hand",
        "artist_name": "Oneida",
        "video_id": null,
        "capture_date": "2022-05-30 07:34:25.248248",
        "source_id": 1214,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "A Moment of Mystery",
        "artist_name": "FKJ ft. Toro y Moi",
        "video_id": null,
        "capture_date": "2022-05-30 07:34:25.248248",
        "source_id": 1214,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Formwela 12",
        "artist_name": "Esperanza Spalding",
        "video_id": null,
        "capture_date": "2022-05-30 07:34:25.248248",
        "source_id": 1214,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Explore Inner Space",
        "artist_name": "Shabaka",
        "video_id": null,
        "capture_date": "2022-05-30 07:34:25.248248",
        "source_id": 1214,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hundred Dollar Hoagie",
        "artist_name": "Mary Lattimore and Paul Sukeena",
        "video_id": null,
        "capture_date": "2022-05-30 07:34:25.248248",
        "source_id": 1214,
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
  ('This Hell', 'Rina Sawayama', NULL),
  ('Frown', 'mxmtoon', NULL),
  ('Turn Up the Sunshine', 'Diana Ross and Tame Impala', NULL),
  ('She Don’t Know', 'Carrie Underwood', NULL),
  ('Conchitas', 'Katzù Oso', NULL),
  ('Selfish Soul', 'Sudan Archives', NULL),
  ('Doomscroller', 'Metric', NULL),
  ('Sunburn', 'Sylvan Esso', NULL),
  ('Metamorfosis', 'Meridian Brothers & El Grupo Renacimiento', NULL),
  ('Watina', 'Calypso Rose ft. Carlos Santana and the Garifuna Collective', NULL),
  ('I Wanna Hold Your Electric Hand', 'Oneida', NULL),
  ('A Moment of Mystery', 'FKJ ft. Toro y Moi', NULL),
  ('Formwela 12', 'Esperanza Spalding', NULL),
  ('Explore Inner Space', 'Shabaka', NULL),
  ('Hundred Dollar Hoagie', 'Mary Lattimore and Paul Sukeena', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 12260; // SELECT last_insert_rowid();

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
  ('2022-05-30 07:34:25.244244', '1214', '12246'),
  ('2022-05-30 07:34:25.248248', '1214', '12247'),
  ('2022-05-30 07:34:25.248248', '1214', '12248'),
  ('2022-05-30 07:34:25.248248', '1214', '12249'),
  ('2022-05-30 07:34:25.248248', '1214', '12250'),
  ('2022-05-30 07:34:25.248248', '1214', '12251'),
  ('2022-05-30 07:34:25.248248', '1214', '12252'),
  ('2022-05-30 07:34:25.248248', '1214', '12253'),
  ('2022-05-30 07:34:25.248248', '1214', '12213'),
  ('2022-05-30 07:34:25.248248', '1214', '12254'),
  ('2022-05-30 07:34:25.248248', '1214', '12255'),
  ('2022-05-30 07:34:25.248248', '1214', '12256'),
  ('2022-05-30 07:34:25.248248', '1214', '12257'),
  ('2022-05-30 07:34:25.248248', '1214', '12258'),
  ('2022-05-30 07:34:25.248248', '1214', '12259'),
  ('2022-05-30 07:34:25.248248', '1214', '12260')
  ;

  // Update to source_song table
