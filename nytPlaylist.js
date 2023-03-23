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
    ('New York Times', 'The Playlist', 'Miley Cyrus and Brandi Carlile’s Raw Duet, and 9 More New Songs', '2023-03-13 07:50:44.000000', 'https://www.nytimes.com/2023/03/10/arts/music/playlist-miley-cyrus-brandi-carlile-eladio-carrion.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1548; // SELECT last_insert_rowid();
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
        "title": "Thousand Miles",
        "artist_name": "Miley Cyrus ft. Brandi Carlile",
        "video_id": null,
        "capture_date": "2023-03-23 02:39:24.141141",
        "source_id": 1548,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "No Voy a Llorar",
        "artist_name": "Nicki Nicole",
        "video_id": null,
        "capture_date": "2023-03-23 02:39:24.141141",
        "source_id": 1548,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Freak Out",
        "artist_name": "Baaba Maal ft. the Very Best",
        "video_id": null,
        "capture_date": "2023-03-23 02:39:24.141141",
        "source_id": 1548,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mbappe (Remix)",
        "artist_name": "Eladio Carrión ft. Future",
        "video_id": null,
        "capture_date": "2023-03-23 02:39:24.141141",
        "source_id": 1548,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Motto",
        "artist_name": "NF",
        "video_id": null,
        "capture_date": "2023-03-23 02:39:24.141141",
        "source_id": 1548,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Daily News",
        "artist_name": "Bartees Strange",
        "video_id": null,
        "capture_date": "2023-03-23 02:39:24.141141",
        "source_id": 1548,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Tell Me What You Want",
        "artist_name": "Caroline Rose",
        "video_id": null,
        "capture_date": "2023-03-23 02:39:24.141141",
        "source_id": 1548,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Nothing’s Free",
        "artist_name": "Angel Olsen",
        "video_id": null,
        "capture_date": "2023-03-23 02:39:24.141141",
        "source_id": 1548,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Verano Adentro",
        "artist_name": "Noia",
        "video_id": null,
        "capture_date": "2023-03-23 02:39:24.141141",
        "source_id": 1548,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Premiers Pas Au Marécage",
        "artist_name": "Sarah Pagé",
        "video_id": null,
        "capture_date": "2023-03-23 02:39:24.141141",
        "source_id": 1548,
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
  ('Thousand Miles', 'Miley Cyrus ft. Brandi Carlile', NULL),
  ('No Voy a Llorar', 'Nicki Nicole', NULL),
  ('Freak Out', 'Baaba Maal ft. the Very Best', NULL),
  ('Mbappe (Remix)', 'Eladio Carrión ft. Future', NULL),
  ('Motto', 'NF', NULL),
  ('Daily News', 'Bartees Strange', NULL),
  ('Tell Me What You Want', 'Caroline Rose', NULL),
  ('Nothing’s Free', 'Angel Olsen', NULL),
  ('Verano Adentro', 'Noia', NULL),
  ('Premiers Pas Au Marécage', 'Sarah Pagé', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 13688; // SELECT last_insert_rowid();

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
  ('2023-03-23 02:39:24.141141', '1548', '13679'),
  ('2023-03-23 02:39:24.141141', '1548', '13680'),
  ('2023-03-23 02:39:24.141141', '1548', '13681'),
  ('2023-03-23 02:39:24.141141', '1548', '13682'),
  ('2023-03-23 02:39:24.141141', '1548', '13683'),
  ('2023-03-23 02:39:24.141141', '1548', '13684'),
  ('2023-03-23 02:39:24.141141', '1548', '13685'),
  ('2023-03-23 02:39:24.141141', '1548', '13686'),
  ('2023-03-23 02:39:24.141141', '1548', '13687'),
  ('2023-03-23 02:39:24.141141', '1548', '13688')
  ;

  // Update to source_song table
