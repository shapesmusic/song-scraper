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
    ('New York Times', 'The Playlist', 'Dolly Parton Reunites Two Beatles, and 12 More New Songs', '2023-08-18 09:21:44.000000', 'https://www.nytimes.com/2023/08/18/arts/music/playlist-dolly-parton-beatles-joni-mitchell.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1691; // SELECT last_insert_rowid();
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
        "title": "Let It Be",
        "artist_name": "Dolly Parton ft. Paul McCartney and Ringo Starr",
        "video_id": null,
        "capture_date": "2023-09-15 08:43:12.427427",
        "source_id": 1691,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Help Me (Demo)",
        "artist_name": "Joni Mitchell",
        "video_id": null,
        "capture_date": "2023-09-15 08:43:12.428428",
        "source_id": 1691,
        "song_id": 7107,
        "duplicate": true
    },
    {
        "title": "Perhaps",
        "artist_name": "Guns N’ Roses",
        "video_id": null,
        "capture_date": "2023-09-15 08:43:12.428428",
        "source_id": 1691,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Planet of the Bass",
        "artist_name": "Kyle Gordon ft. DJ Crazy Times and Ms. Biljana Electronica",
        "video_id": null,
        "capture_date": "2023-09-15 08:43:12.428428",
        "source_id": 1691,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Better Things",
        "artist_name": "aespa",
        "video_id": null,
        "capture_date": "2023-09-15 08:43:12.428428",
        "source_id": 1691,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mi Ex Tenía Razón",
        "artist_name": "Karol G",
        "video_id": null,
        "capture_date": "2023-09-15 08:43:12.428428",
        "source_id": 1691,
        "song_id": 14644,
        "duplicate": true
    },
    {
        "title": "Ready for You",
        "artist_name": "Cherry Glazerr",
        "video_id": null,
        "capture_date": "2023-09-15 08:43:12.428428",
        "source_id": 1691,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Criolla",
        "artist_name": "Guillermo Klein Quinteto",
        "video_id": null,
        "capture_date": "2023-09-15 08:43:12.428428",
        "source_id": 1691,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hold Me",
        "artist_name": "Quavo",
        "video_id": null,
        "capture_date": "2023-09-15 08:43:12.428428",
        "source_id": 1691,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Moments Stolen",
        "artist_name": "Cautious Clay",
        "video_id": null,
        "capture_date": "2023-09-15 08:43:12.428428",
        "source_id": 1691,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Because of You",
        "artist_name": "K.D. Lang",
        "video_id": null,
        "capture_date": "2023-09-15 08:43:12.428428",
        "source_id": 1691,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "So You Are Tired",
        "artist_name": "Sufjan Stevens",
        "video_id": null,
        "capture_date": "2023-09-15 08:43:12.429429",
        "source_id": 1691,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Snake Tune",
        "artist_name": "Ember",
        "video_id": null,
        "capture_date": "2023-09-15 08:43:12.429429",
        "source_id": 1691,
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
  ('Let It Be', 'Dolly Parton ft. Paul McCartney and Ringo Starr', NULL),
  ('Perhaps', 'Guns N’ Roses', NULL),
  ('Planet of the Bass', 'Kyle Gordon ft. DJ Crazy Times and Ms. Biljana Electronica', NULL),
  ('Better Things', 'aespa', NULL),
  ('Ready for You', 'Cherry Glazerr', NULL),
  ('Criolla', 'Guillermo Klein Quinteto', NULL),
  ('Hold Me', 'Quavo', NULL),
  ('Moments Stolen', 'Cautious Clay', NULL),
  ('Because of You', 'K.D. Lang', NULL),
  ('So You Are Tired', 'Sufjan Stevens', NULL),
  ('Snake Tune', 'Ember', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 14666; // SELECT last_insert_rowid();

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
  ('2023-09-15 08:43:12.427427', '1691', '14656'),
  ('2023-09-15 08:43:12.428428', '1691', '7107'),
  ('2023-09-15 08:43:12.428428', '1691', '14657'),
  ('2023-09-15 08:43:12.428428', '1691', '14658'),
  ('2023-09-15 08:43:12.428428', '1691', '14659'),
  ('2023-09-15 08:43:12.428428', '1691', '14644'),
  ('2023-09-15 08:43:12.428428', '1691', '14660'),
  ('2023-09-15 08:43:12.428428', '1691', '14661'),
  ('2023-09-15 08:43:12.428428', '1691', '14662'),
  ('2023-09-15 08:43:12.428428', '1691', '14663'),
  ('2023-09-15 08:43:12.428428', '1691', '14664'),
  ('2023-09-15 08:43:12.429429', '1691', '14665'),
  ('2023-09-15 08:43:12.429429', '1691', '14666')
  ;

  // Update to source_song table
