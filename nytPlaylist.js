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
    ('New York Times', 'The Playlist', 'The Buzzy Band Wet Leg Trips Out at a Party, and 13 More New Songs', '2022-03-04 09:11:33.000000', 'https://www.nytimes.com/2022/03/04/arts/music/playlist-wet-leg-justin-bieber-bartees-strange.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1160; // SELECT last_insert_rowid();
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
        "title": "Angelica",
        "artist_name": "Wet Leg",
        "video_id": null,
        "capture_date": "2022-03-08 12:29:00.614614",
        "source_id": 1160,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Heavy Heart",
        "artist_name": "Bartees Strange",
        "video_id": null,
        "capture_date": "2022-03-08 12:29:00.615615",
        "source_id": 1160,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "This Is a Photograph",
        "artist_name": "Kevin Morby",
        "video_id": null,
        "capture_date": "2022-03-08 12:29:00.615615",
        "source_id": 1160,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I’m Tired",
        "artist_name": "Labrinth and Zendaya",
        "video_id": null,
        "capture_date": "2022-03-08 12:29:00.615615",
        "source_id": 1160,
        "song_id": 11773,
        "duplicate": true
    },
    {
        "title": "Buffalo Stance",
        "artist_name": "Robyn, Neneh Cherry and Maipei",
        "video_id": null,
        "capture_date": "2022-03-08 12:29:00.615615",
        "source_id": 1160,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Used to It",
        "artist_name": "Sharon Van Etten",
        "video_id": null,
        "capture_date": "2022-03-08 12:29:00.616616",
        "source_id": 1160,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Lost Track",
        "artist_name": "Haim",
        "video_id": null,
        "capture_date": "2022-03-08 12:29:00.616616",
        "source_id": 1160,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Attention",
        "artist_name": "Omah Lay and Justin Bieber",
        "video_id": null,
        "capture_date": "2022-03-08 12:29:00.616616",
        "source_id": 1160,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bring Back the Time",
        "artist_name": "New Kids on the Block ft. Salt-N-Pepa, Rick Astley and En Vogue",
        "video_id": null,
        "capture_date": "2022-03-08 12:29:00.616616",
        "source_id": 1160,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Suéltame",
        "artist_name": "La Marimba",
        "video_id": null,
        "capture_date": "2022-03-08 12:29:00.616616",
        "source_id": 1160,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Emelia",
        "artist_name": "Melissa Aldana",
        "video_id": null,
        "capture_date": "2022-03-08 12:29:00.616616",
        "source_id": 1160,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "To Talk About It",
        "artist_name": "The Weather Station",
        "video_id": null,
        "capture_date": "2022-03-08 12:29:00.616616",
        "source_id": 1160,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Subtle Bodies",
        "artist_name": "Carmen Villain",
        "video_id": null,
        "capture_date": "2022-03-08 12:29:00.616616",
        "source_id": 1160,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cuerpo que Flota",
        "artist_name": "Lila Tirando a Violeta & Nicola Cruz",
        "video_id": null,
        "capture_date": "2022-03-08 12:29:00.616616",
        "source_id": 1160,
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
  ('Angelica', 'Wet Leg', NULL),
  ('Heavy Heart', 'Bartees Strange', NULL),
  ('This Is a Photograph', 'Kevin Morby', NULL),
  ('Buffalo Stance', 'Robyn, Neneh Cherry and Maipei', NULL),
  ('Used to It', 'Sharon Van Etten', NULL),
  ('Lost Track', 'Haim', NULL),
  ('Attention', 'Omah Lay and Justin Bieber', NULL),
  ('Bring Back the Time', 'New Kids on the Block ft. Salt-N-Pepa, Rick Astley and En Vogue', NULL),
  ('Suéltame', 'La Marimba', NULL),
  ('Emelia', 'Melissa Aldana', NULL),
  ('To Talk About It', 'The Weather Station', NULL),
  ('Subtle Bodies', 'Carmen Villain', NULL),
  ('Cuerpo que Flota', 'Lila Tirando a Violeta & Nicola Cruz', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11790; // SELECT last_insert_rowid();

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
  ('2022-03-08 12:29:00.614614', '1160', '11778'),
  ('2022-03-08 12:29:00.615615', '1160', '11779'),
  ('2022-03-08 12:29:00.615615', '1160', '11780'),
  ('2022-03-08 12:29:00.615615', '1160', '11773'),
  ('2022-03-08 12:29:00.615615', '1160', '11781'),
  ('2022-03-08 12:29:00.616616', '1160', '11782'),
  ('2022-03-08 12:29:00.616616', '1160', '11783'),
  ('2022-03-08 12:29:00.616616', '1160', '11784'),
  ('2022-03-08 12:29:00.616616', '1160', '11785'),
  ('2022-03-08 12:29:00.616616', '1160', '11786'),
  ('2022-03-08 12:29:00.616616', '1160', '11787'),
  ('2022-03-08 12:29:00.616616', '1160', '11788'),
  ('2022-03-08 12:29:00.616616', '1160', '11789'),
  ('2022-03-08 12:29:00.616616', '1160', '11790')
  ;

  // Update to source_song table
