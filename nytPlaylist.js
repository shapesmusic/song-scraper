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
    ('New York Times', 'The Playlist', 'Megan Thee Stallion and Dua Lipa’s Sultry Team-Up, and 10 More New Songs', '2022-03-11 09:16:54.000000', 'https://www.nytimes.com/2022/03/11/arts/music/playlist-megan-thee-stallion-dua-lipa.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1164; // SELECT last_insert_rowid();
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
        "title": "Sweetest Pie",
        "artist_name": "Megan Thee Stallion and Dua Lipa",
        "video_id": null,
        "capture_date": "2022-03-16 08:28:33.161161",
        "source_id": 1164,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "My Love",
        "artist_name": "Florence + the Machine",
        "video_id": null,
        "capture_date": "2022-03-16 08:28:33.173173",
        "source_id": 1164,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Strange",
        "artist_name": "Miranda Lambert",
        "video_id": null,
        "capture_date": "2022-03-16 08:28:33.173173",
        "source_id": 1164,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Anti-Glory",
        "artist_name": "Horsegirl",
        "video_id": null,
        "capture_date": "2022-03-16 08:28:33.173173",
        "source_id": 1164,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Teenager",
        "artist_name": "Superorganism ft. Chai and Pi Ja Ma",
        "video_id": null,
        "capture_date": "2022-03-16 08:28:33.173173",
        "source_id": 1164,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Spillways",
        "artist_name": "Ghost",
        "video_id": null,
        "capture_date": "2022-03-16 08:28:33.174174",
        "source_id": 1164,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Something Like a Heartbreak",
        "artist_name": "Tinashe",
        "video_id": null,
        "capture_date": "2022-03-16 08:28:33.174174",
        "source_id": 1164,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Up 2 Me",
        "artist_name": "Tess Roby",
        "video_id": null,
        "capture_date": "2022-03-16 08:28:33.174174",
        "source_id": 1164,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "For Some Time",
        "artist_name": "Walter Smith III and Matthew Stevens",
        "video_id": null,
        "capture_date": "2022-03-16 08:28:33.174174",
        "source_id": 1164,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Goodbye Mr. Blue",
        "artist_name": "Father John Misty",
        "video_id": null,
        "capture_date": "2022-03-16 08:28:33.174174",
        "source_id": 1164,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Vocoder",
        "artist_name": "Floating Points",
        "video_id": null,
        "capture_date": "2022-03-16 08:28:33.174174",
        "source_id": 1164,
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
  ('Sweetest Pie', 'Megan Thee Stallion and Dua Lipa', NULL),
  ('My Love', 'Florence + the Machine', NULL),
  ('Strange', 'Miranda Lambert', NULL),
  ('Anti-Glory', 'Horsegirl', NULL),
  ('Teenager', 'Superorganism ft. Chai and Pi Ja Ma', NULL),
  ('Spillways', 'Ghost', NULL),
  ('Something Like a Heartbreak', 'Tinashe', NULL),
  ('Up 2 Me', 'Tess Roby', NULL),
  ('For Some Time', 'Walter Smith III and Matthew Stevens', NULL),
  ('Goodbye Mr. Blue', 'Father John Misty', NULL),
  ('Vocoder', 'Floating Points', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11819; // SELECT last_insert_rowid();

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
  ('2022-03-16 08:28:33.161161', '1164', '11809'),
  ('2022-03-16 08:28:33.173173', '1164', '11810'),
  ('2022-03-16 08:28:33.173173', '1164', '11811'),
  ('2022-03-16 08:28:33.173173', '1164', '11812'),
  ('2022-03-16 08:28:33.173173', '1164', '11813'),
  ('2022-03-16 08:28:33.174174', '1164', '11814'),
  ('2022-03-16 08:28:33.174174', '1164', '11815'),
  ('2022-03-16 08:28:33.174174', '1164', '11816'),
  ('2022-03-16 08:28:33.174174', '1164', '11817'),
  ('2022-03-16 08:28:33.174174', '1164', '11818'),
  ('2022-03-16 08:28:33.174174', '1164', '11819')
  ;

  // Update to source_song table
