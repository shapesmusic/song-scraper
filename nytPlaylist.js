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
    ('New York Times', 'The Playlist', 'The Kid Laroi and Justin Bieber’s Bouncy Plea, and 14 More New Songs', '2021-10-07 08:45:53.000000', 'https://www.nytimes.com/2021/07/09/arts/music/playlist-justin-bieber-kid-laroi-maluma.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 963; // SELECT last_insert_rowid();
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
          "title": "Stay",
          "artist_name": "The Kid Laroi ft. Justin Bieber",
          "video_id": null,
          "capture_date": "2021-10-12 12:43:32.287287",
          "source_id": 963,
          "song_id": 10658,
          "duplicate": true
      },
      {
          "title": "She Doesn’t Love You",
          "artist_name": "The Kondi Band ft. Mariama",
          "video_id": null,
          "capture_date": "2021-10-12 12:43:32.287287",
          "source_id": 963,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "I Love You, I Hate You",
          "artist_name": "Little Simz",
          "video_id": null,
          "capture_date": "2021-10-12 12:43:32.287287",
          "source_id": 963,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Vax That Thang Up",
          "artist_name": "BLK presents Juvenile, Mannie Fresh and Mia X",
          "video_id": null,
          "capture_date": "2021-10-12 12:43:32.288288",
          "source_id": 963,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Nyumba Ndogo",
          "artist_name": "Zuchu",
          "video_id": null,
          "capture_date": "2021-10-12 12:43:32.288288",
          "source_id": 963,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Dumb Dumb",
          "artist_name": "mazie",
          "video_id": null,
          "capture_date": "2021-10-12 12:43:32.288288",
          "source_id": 963,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Rae Street",
          "artist_name": "Courtney Barnett",
          "video_id": null,
          "capture_date": "2021-10-12 12:43:32.288288",
          "source_id": 963,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Gloria",
          "artist_name": "Angel Olsen",
          "video_id": null,
          "capture_date": "2021-10-12 12:43:32.288288",
          "source_id": 963,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Glad Ur Gone",
          "artist_name": "gglum",
          "video_id": null,
          "capture_date": "2021-10-12 12:43:32.288288",
          "source_id": 963,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Mafiosa",
          "artist_name": "Nathy Peluso",
          "video_id": null,
          "capture_date": "2021-10-12 12:43:32.288288",
          "source_id": 963,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Sobrio",
          "artist_name": "Maluma",
          "video_id": null,
          "capture_date": "2021-10-12 12:43:32.288288",
          "source_id": 963,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Reach Out",
          "artist_name": "Sufjan Stevens and Angelo De Augustine",
          "video_id": null,
          "capture_date": "2021-10-12 12:43:32.288288",
          "source_id": 963,
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
  ('She Doesn’t Love You', 'The Kondi Band ft. Mariama', NULL),
  ('I Love You, I Hate You', 'Little Simz', NULL),
  ('Vax That Thang Up', 'BLK presents Juvenile, Mannie Fresh and Mia X', NULL),
  ('Nyumba Ndogo', 'Zuchu', NULL),
  ('Dumb Dumb', 'mazie', NULL),
  ('Rae Street', 'Courtney Barnett', NULL),
  ('Gloria', 'Angel Olsen', NULL),
  ('Glad Ur Gone', 'gglum', NULL),
  ('Mafiosa', 'Nathy Peluso', NULL),
  ('Sobrio', 'Maluma', NULL),
  ('Reach Out', 'Sufjan Stevens and Angelo De Augustine', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10869; // SELECT last_insert_rowid();

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
  ('2021-10-12 12:43:32.287287', '963', '10658'),
  ('2021-10-12 12:43:32.287287', '963', '10859'),
  ('2021-10-12 12:43:32.287287', '963', '10860'),
  ('2021-10-12 12:43:32.288288', '963', '10861'),
  ('2021-10-12 12:43:32.288288', '963', '10862'),
  ('2021-10-12 12:43:32.288288', '963', '10863'),
  ('2021-10-12 12:43:32.288288', '963', '10864'),
  ('2021-10-12 12:43:32.288288', '963', '10865'),
  ('2021-10-12 12:43:32.288288', '963', '10866'),
  ('2021-10-12 12:43:32.288288', '963', '10867'),
  ('2021-10-12 12:43:32.288288', '963', '10868'),
  ('2021-10-12 12:43:32.288288', '963', '10869')
  ;

  // Update to source_song table
