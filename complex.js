// Scroll to the bottom of the page first, so all the lazyload stuff loads
// Always check the last song name to make sure everything got scraped


//
// Step 0: Check recent scraped
//

  SELECT publication_date, instance_name FROM source WHERE parent_entity = 'Complex' ORDER BY publication_date DESC LIMIT 8;


//
// Step 1: Scrape source data
//

  chartTitle = document.getElementsByClassName("story-title story-title__article")[0].innerText;
  parentStream = chartTitle.match(/.+?(?=:)/)[0];
  instanceName = chartTitle.match(/[^:]+$/)[0].trim();

  // Add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // Get and format publicationDate
  publicationDate = document.getElementsByClassName("info-row__datetime")[0].innerHTML.trim();
  publicationDateFormatted = moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

  // Get and format location
  chartLocation = window.location.href; // "location" is a reserved word

  // Build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'Complex\', "
    + "\'" + parentStream + "\', "
    + "\'" + instanceName + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + chartLocation + "\');"
  );


  // Stage the SQL statement
  // Replace any ' in strings with ’

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('Complex', 'Best New Music This Week', 'Lil Nas X, Kehlani, Majid Jordan, and More', '2021-09-17 12:00:00.000000', 'https://www.complex.com/music/best-new-music-this-week-lil-nas-x-kehlani-majid-jordan/mozzy-est-gee-babyface-ray-beat-the-case');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1044; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("article-list");
  element = elements[0].getElementsByTagName("h2"); // sometimes h2 or h3
  // videoUrl = document.getElementsByClassName("video-lazyload");

  songsData = [];

  for (var i=0; i<element.length; i++){
    title = element[i].innerText.match(/, “(.*?)”/)[1]; // may need " or “” type quotation marks, or a comma after the artist name, or may have an &nbsp; instead of a space
    artist_name = element[i].innerText.match(/.+?(?=, “)/)[0]; // may need " or “ type quotation marks
    video_id = null
      // replace null with below to grab video IDs (when all songs are YT)
      // videoUrl[i].style.backgroundImage.match(/(?<=vi\/)(.*)(?=\/)/)[0];

    capture_date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

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
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//          find and replace f[slash] with "ft."
//

  songsData =
  [
      {
          "title": "That’s What I Want",
          "artist_name": "Lil Nas X",
          "video_id": null,
          "capture_date": "2021-10-13 08:03:17.096096",
          "source_id": 1044,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Altar",
          "artist_name": "Kehlani",
          "video_id": null,
          "capture_date": "2021-10-13 08:03:17.099099",
          "source_id": 1044,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Found",
          "artist_name": "Tems ft. Brent Faiyaz",
          "video_id": null,
          "capture_date": "2021-10-13 08:03:17.100100",
          "source_id": 1044,
          "song_id": 10956,
          "duplicate": true
      },
      {
          "title": "Summer Rain",
          "artist_name": "Majid Jordan",
          "video_id": null,
          "capture_date": "2021-10-13 08:03:17.100100",
          "source_id": 1044,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Famous Last Words",
          "artist_name": "James Blake",
          "video_id": null,
          "capture_date": "2021-10-13 08:03:17.100100",
          "source_id": 1044,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "On My Side",
          "artist_name": "NBA YoungBoy",
          "video_id": null,
          "capture_date": "2021-10-13 08:03:17.100100",
          "source_id": 1044,
          "song_id": 10794,
          "duplicate": true
      },
      {
          "title": "Beat the Case",
          "artist_name": "Mozzy ft. EST Gee & Babyface Ray",
          "video_id": null,
          "capture_date": "2021-10-13 08:03:17.100100",
          "source_id": 1044,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "313-414",
          "artist_name": "Lakeyah ft. Tee Grizzley",
          "video_id": null,
          "capture_date": "2021-10-13 08:03:17.100100",
          "source_id": 1044,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "V12",
          "artist_name": "Iann Dior ft. Lil Uzi Vert",
          "video_id": null,
          "capture_date": "2021-10-13 08:03:17.100100",
          "source_id": 1044,
          "song_id": 10965,
          "duplicate": true
      }
  ]

  // Check each song for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%Set%'
    AND artist_name LIKE '%CJ%'
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
  ('That’s What I Want', 'Lil Nas X', NULL),
  ('Altar', 'Kehlani', NULL),
  ('Summer Rain', 'Majid Jordan', NULL),
  ('Famous Last Words', 'James Blake', NULL),
  ('Beat the Case', 'Mozzy ft. EST Gee & Babyface Ray', NULL),
  ('313-414', 'Lakeyah ft. Tee Grizzley', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11091; // SELECT last_insert_rowid();

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
  ('2021-10-13 08:03:17.096096', '1044', '11086'),
  ('2021-10-13 08:03:17.099099', '1044', '11087'),
  ('2021-10-13 08:03:17.100100', '1044', '10956'),
  ('2021-10-13 08:03:17.100100', '1044', '11088'),
  ('2021-10-13 08:03:17.100100', '1044', '11089'),
  ('2021-10-13 08:03:17.100100', '1044', '10794'),
  ('2021-10-13 08:03:17.100100', '1044', '11090'),
  ('2021-10-13 08:03:17.100100', '1044', '11091'),
  ('2021-10-13 08:03:17.100100', '1044', '10965')
  ;

  // Update to source_song table
