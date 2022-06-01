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
    ('New York Times', 'The Playlist', 'Sky Ferreira’s Dazzling, Defiant Return, and 11 More New Songs', '2022-05-27 08:25:04.000000', 'https://www.nytimes.com/2022/05/27/arts/music/playlist-sky-ferreira-rico-nasty.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1254; // SELECT last_insert_rowid();
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
        "title": "Don’t Forget",
        "artist_name": "Sky Ferreira",
        "video_id": null,
        "capture_date": "2022-05-31 07:17:05.023023",
        "source_id": 1254,
        "song_id": 12281,
        "duplicate": true
    },
    {
        "title": "Blessing",
        "artist_name": "Alex G",
        "video_id": null,
        "capture_date": "2022-05-31 07:17:05.023023",
        "source_id": 1254,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "On & On",
        "artist_name": "Superorganism",
        "video_id": null,
        "capture_date": "2022-05-31 07:17:05.023023",
        "source_id": 1254,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Other Side",
        "artist_name": "Wynonna & Waxahatchee",
        "video_id": null,
        "capture_date": "2022-05-31 07:17:05.023023",
        "source_id": 1254,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Empathy for Bethany",
        "artist_name": "Saya Gray",
        "video_id": null,
        "capture_date": "2022-05-31 07:17:05.023023",
        "source_id": 1254,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Tag",
        "artist_name": "Bruce Hornsby",
        "video_id": null,
        "capture_date": "2022-05-31 07:17:05.023023",
        "source_id": 1254,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "April",
        "artist_name": "Maria BC",
        "video_id": null,
        "capture_date": "2022-05-31 07:17:05.023023",
        "source_id": 1254,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Amber",
        "artist_name": "Kaitlyn Aurelia Smith & Emile Mosseri",
        "video_id": null,
        "capture_date": "2022-05-31 07:17:05.023023",
        "source_id": 1254,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mama",
        "artist_name": "Nduduzo Makhathini ft. Omagugu",
        "video_id": null,
        "capture_date": "2022-05-31 07:17:05.023023",
        "source_id": 1254,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Intrusive",
        "artist_name": "Rico Nasty",
        "video_id": null,
        "capture_date": "2022-05-31 07:17:05.023023",
        "source_id": 1254,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sleazy Flow (remix)",
        "artist_name": "SleazyWorld Go ft. Lil Baby",
        "video_id": null,
        "capture_date": "2022-05-31 07:17:05.024024",
        "source_id": 1254,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Al Compas de Mi Viejo Tres",
        "artist_name": "David Virelles",
        "video_id": null,
        "capture_date": "2022-05-31 07:17:05.024024",
        "source_id": 1254,
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
  ('Blessing', 'Alex G', NULL),
  ('On & On', 'Superorganism', NULL),
  ('Other Side', 'Wynonna & Waxahatchee', NULL),
  ('Empathy for Bethany', 'Saya Gray', NULL),
  ('Tag', 'Bruce Hornsby', NULL),
  ('April', 'Maria BC', NULL),
  ('Amber', 'Kaitlyn Aurelia Smith & Emile Mosseri', NULL),
  ('Mama', 'Nduduzo Makhathini ft. Omagugu', NULL),
  ('Intrusive', 'Rico Nasty', NULL),
  ('Sleazy Flow (remix)', 'SleazyWorld Go ft. Lil Baby', NULL),
  ('Al Compas de Mi Viejo Tres', 'David Virelles', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 12314; // SELECT last_insert_rowid();

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
  ('2022-05-31 07:17:05.023023', '1254', '12281'),
  ('2022-05-31 07:17:05.023023', '1254', '12304'),
  ('2022-05-31 07:17:05.023023', '1254', '12305'),
  ('2022-05-31 07:17:05.023023', '1254', '12306'),
  ('2022-05-31 07:17:05.023023', '1254', '12307'),
  ('2022-05-31 07:17:05.023023', '1254', '12308'),
  ('2022-05-31 07:17:05.023023', '1254', '12309'),
  ('2022-05-31 07:17:05.023023', '1254', '12310'),
  ('2022-05-31 07:17:05.023023', '1254', '12311'),
  ('2022-05-31 07:17:05.023023', '1254', '12312'),
  ('2022-05-31 07:17:05.024024', '1254', '12313'),
  ('2022-05-31 07:17:05.024024', '1254', '12314')
  ;

  // Update to source_song table
