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
    ('New York Times', 'The Playlist', 'Phoebe Bridgers Reworks Paul McCartney, and 11 More New Songs', '2021-04-16 10:06:12.000000', 'https://www.nytimes.com/2021/04/16/arts/music/playlist-paul-mccartney-dave-grohl-saweetie.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 889; // SELECT last_insert_rowid();
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
//          preview chart and prune songs (add video_id later),
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "Seize the Day",
        "artist_name": "Paul McCartney featuring Phoebe Bridgers",
        "video_id": null,
        "capture_date": "2021-04-22 09:53:17.650650",
        "source_id": 889,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hot & Heavy",
        "artist_name": "Lucy Dacus",
        "video_id": null,
        "capture_date": "2021-04-22 09:53:17.651651",
        "source_id": 889,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Love More",
        "artist_name": "Fiona Apple",
        "video_id": null,
        "capture_date": "2021-04-22 09:53:17.651651",
        "source_id": 889,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Phone Dies",
        "artist_name": "Andra Day",
        "video_id": null,
        "capture_date": "2021-04-22 09:53:17.651651",
        "source_id": 889,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Send Me",
        "artist_name": "Tirzah",
        "video_id": null,
        "capture_date": "2021-04-22 09:53:17.651651",
        "source_id": 889,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Risky",
        "artist_name": "Saweetie and Drakeo the Ruler",
        "video_id": null,
        "capture_date": "2021-04-22 09:53:17.651651",
        "source_id": 889,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Eazy Sleazy",
        "artist_name": "Mick Jagger with Dave Grohl",
        "video_id": null,
        "capture_date": "2021-04-22 09:53:17.651651",
        "source_id": 889,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Lord It’s a Feeling",
        "artist_name": "London Grammar",
        "video_id": null,
        "capture_date": "2021-04-22 09:53:17.651651",
        "source_id": 889,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Rapid & Complete Recovery",
        "artist_name": "Spirit of the Beehive",
        "video_id": null,
        "capture_date": "2021-04-22 09:53:17.651651",
        "source_id": 889,
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
  ('Seize the Day', 'Paul McCartney featuring Phoebe Bridgers', NULL),
  ('Hot & Heavy', 'Lucy Dacus', NULL),
  ('Love More', 'Fiona Apple', NULL),
  ('Phone Dies', 'Andra Day', NULL),
  ('Send Me', 'Tirzah', NULL),
  ('Risky', 'Saweetie and Drakeo the Ruler', NULL),
  ('Eazy Sleazy', 'Mick Jagger with Dave Grohl', NULL),
  ('Lord It’s a Feeling', 'London Grammar', NULL),
  ('Rapid & Complete Recovery', 'Spirit of the Beehive', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10249; // SELECT last_insert_rowid();

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
  ('2021-04-22 09:53:17.650650', '889', '10241'),
  ('2021-04-22 09:53:17.651651', '889', '10242'),
  ('2021-04-22 09:53:17.651651', '889', '10243'),
  ('2021-04-22 09:53:17.651651', '889', '10244'),
  ('2021-04-22 09:53:17.651651', '889', '10245'),
  ('2021-04-22 09:53:17.651651', '889', '10246'),
  ('2021-04-22 09:53:17.651651', '889', '10247'),
  ('2021-04-22 09:53:17.651651', '889', '10248'),
  ('2021-04-22 09:53:17.651651', '889', '10249')
  ;

  // Update to source_song table
