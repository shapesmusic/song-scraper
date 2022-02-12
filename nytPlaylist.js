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
    ('New York Times', 'The Playlist', 'Kamasi Washington Blasts Into a Fresh Era, and 13 More New Songs', '2022-02-04 09:53:13.000000', 'https://www.nytimes.com/2022/02/04/arts/music/playlist-kamasi-washington-koffee.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1128; // SELECT last_insert_rowid();
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
        "title": "The Garden Path",
        "artist_name": "Kamasi Washington",
        "video_id": null,
        "capture_date": "2022-02-12 01:28:49.290290",
        "source_id": 1128,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Pull Up",
        "artist_name": "Koffee",
        "video_id": null,
        "capture_date": "2022-02-12 01:28:49.291291",
        "source_id": 1128,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Emo Girl",
        "artist_name": "Machine Gun Kelly featuring Willow",
        "video_id": null,
        "capture_date": "2022-02-12 01:28:49.291291",
        "source_id": 1128,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Kissing Lessons",
        "artist_name": "Lucy Dacus",
        "video_id": null,
        "capture_date": "2022-02-12 01:28:49.291291",
        "source_id": 1128,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "She’s All I Wanna Be",
        "artist_name": "Tate McRae",
        "video_id": null,
        "capture_date": "2022-02-12 01:28:49.291291",
        "source_id": 1128,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Call Me Home",
        "artist_name": "Sasami",
        "video_id": null,
        "capture_date": "2022-02-12 01:28:49.291291",
        "source_id": 1128,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Softly",
        "artist_name": "Arlo Parks",
        "video_id": null,
        "capture_date": "2022-02-12 01:28:49.291291",
        "source_id": 1128,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dates in Pickup Trucks",
        "artist_name": "Kassi Ashton",
        "video_id": null,
        "capture_date": "2022-02-12 01:28:49.292292",
        "source_id": 1128,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Try",
        "artist_name": "Obongjayar",
        "video_id": null,
        "capture_date": "2022-02-12 01:28:49.292292",
        "source_id": 1128,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cry Mfer",
        "artist_name": "My Idea",
        "video_id": null,
        "capture_date": "2022-02-12 01:28:49.292292",
        "source_id": 1128,
        "song_id": 11611,
        "duplicate": true
    },
    {
        "title": "Sandwich Sharer",
        "artist_name": "Illuminati Hotties",
        "video_id": null,
        "capture_date": "2022-02-12 01:28:49.292292",
        "source_id": 1128,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "17ºC",
        "artist_name": "Whatever the Weather",
        "video_id": null,
        "capture_date": "2022-02-12 01:28:49.292292",
        "source_id": 1128,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Reconciliación Con la Vida",
        "artist_name": "Ayver",
        "video_id": null,
        "capture_date": "2022-02-12 01:28:49.292292",
        "source_id": 1128,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Historic Music Past Tense Future, Side C",
        "artist_name": "Peter Brötzmann, Milford Graves, William Parker",
        "video_id": null,
        "capture_date": "2022-02-12 01:28:49.292292",
        "source_id": 1128,
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
  ('The Garden Path', 'Kamasi Washington', NULL),
  ('Pull Up', 'Koffee', NULL),
  ('Emo Girl', 'Machine Gun Kelly featuring Willow', NULL),
  ('Kissing Lessons', 'Lucy Dacus', NULL),
  ('She’s All I Wanna Be', 'Tate McRae', NULL),
  ('Call Me Home', 'Sasami', NULL),
  ('Softly', 'Arlo Parks', NULL),
  ('Dates in Pickup Trucks', 'Kassi Ashton', NULL),
  ('Try', 'Obongjayar', NULL),
  ('Sandwich Sharer', 'Illuminati Hotties', NULL),
  ('17ºC', 'Whatever the Weather', NULL),
  ('Reconciliación Con la Vida', 'Ayver', NULL),
  ('Historic Music Past Tense Future, Side C', 'Peter Brötzmann, Milford Graves, William Parker', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11643; // SELECT last_insert_rowid();

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
  ('2022-02-12 01:28:49.290290', '1128', '11631'),
  ('2022-02-12 01:28:49.291291', '1128', '11632'),
  ('2022-02-12 01:28:49.291291', '1128', '11633'),
  ('2022-02-12 01:28:49.291291', '1128', '11634'),
  ('2022-02-12 01:28:49.291291', '1128', '11635'),
  ('2022-02-12 01:28:49.291291', '1128', '11636'),
  ('2022-02-12 01:28:49.291291', '1128', '11637'),
  ('2022-02-12 01:28:49.292292', '1128', '11638'),
  ('2022-02-12 01:28:49.292292', '1128', '11639'),
  ('2022-02-12 01:28:49.292292', '1128', '11611'),
  ('2022-02-12 01:28:49.292292', '1128', '11640'),
  ('2022-02-12 01:28:49.292292', '1128', '11641'),
  ('2022-02-12 01:28:49.292292', '1128', '11642'),
  ('2022-02-12 01:28:49.292292', '1128', '11643')
  ;

  // Update to source_song table
