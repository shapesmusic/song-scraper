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
    ('Complex', 'Best New Music This Week', 'Tyler, the Creator, Vince Staples, Don Toliver, and More', '2021-06-18 12:00:00.000000', 'https://www.complex.com/music/best-new-music-this-tyler-the-creator-vince-staples-don-toliver/her-dont');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1034; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("article-list");
  element = elements[0].getElementsByTagName("h2"); // sometimes h2 or h3
  videoUrl = document.getElementsByClassName("video-lazyload");

  songsData = [];

  for (var i=0; i<element.length; i++){
    title = element[i].innerText.match(/, “(.*?)”/)[1]; // may need " or “” type quotation marks, or a comma after the artist name, or may have an &nbsp; instead of a space
    artist_name = element[i].innerText.match(/.+?(?=, “)/)[0]; // may need " or “ type quotation marks
    video_id = videoUrl[i].style.backgroundImage.match(/(?<=vi\/)(.*)(?=\/)/)[0]; // example: url("https://i.ytimg.com/vi/gejbbL1AaJk/hqdefault.jpg")

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
          "title": "Lumberjack",
          "artist_name": "Tyler, the Creator",
          "video_id": "R4Y7JIQlv20",
          "capture_date": "2021-10-13 09:56:08.625625",
          "source_id": 1034,
          "song_id": 10626,
          "duplicate": true
      },
      {
          "title": "Drugs N Hella Melodies",
          "artist_name": "Don Toliver ft. Kali Uchis",
          "video_id": "i_PYqIZoGvo",
          "capture_date": "2021-10-13 09:56:08.627627",
          "source_id": 1034,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Law of Averages",
          "artist_name": "Vince Staples",
          "video_id": "oTri3zbX-R8",
          "capture_date": "2021-10-13 09:56:08.627627",
          "source_id": 1034,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "How We Coming",
          "artist_name": "Migos",
          "video_id": "TEx7uNCoskg",
          "capture_date": "2021-10-13 09:56:08.628628",
          "source_id": 1034,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Ball If I Want To",
          "artist_name": "DaBaby",
          "video_id": "_Rzm7cPzVUo",
          "capture_date": "2021-10-13 09:56:08.628628",
          "source_id": 1034,
          "song_id": 10622,
          "duplicate": true
      },
      {
          "title": "Headshots (4r Da Locals)",
          "artist_name": "Isaiah Rashad",
          "video_id": "cRQRmFhL_vo",
          "capture_date": "2021-10-13 09:56:08.703703",
          "source_id": 1034,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Raindrops",
          "artist_name": "GoldLink ft. Flo Milli",
          "video_id": "oNMXSdAIPBU",
          "capture_date": "2021-10-13 09:56:08.703703",
          "source_id": 1034,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "I Got It",
          "artist_name": "Gucci Mane ft. Lil Uzi Vert",
          "video_id": "mL9EJBv-iII",
          "capture_date": "2021-10-13 09:56:08.703703",
          "source_id": 1034,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Don’t",
          "artist_name": "H.E.R.",
          "video_id": "fdp4hWrpRyI",
          "capture_date": "2021-10-13 09:56:08.704704",
          "source_id": 1034,
          "song_id": null,
          "duplicate": false
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
  ('Drugs N Hella Melodies', 'Don Toliver ft. Kali Uchis', NULL),
  ('Law of Averages', 'Vince Staples', NULL),
  ('How We Coming', 'Migos', NULL),
  ('Headshots (4r Da Locals)', 'Isaiah Rashad', NULL),
  ('Raindrops', 'GoldLink ft. Flo Milli', NULL),
  ('I Got It', 'Gucci Mane ft. Lil Uzi Vert', NULL),
  ('Don’t', 'H.E.R.', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11045; // SELECT last_insert_rowid();

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
  ('2021-10-13 09:56:08.625625', '1034', '10626'),
  ('2021-10-13 09:56:08.627627', '1034', '11039'),
  ('2021-10-13 09:56:08.627627', '1034', '11040'),
  ('2021-10-13 09:56:08.628628', '1034', '11041'),
  ('2021-10-13 09:56:08.628628', '1034', '10622'),
  ('2021-10-13 09:56:08.703703', '1034', '11042'),
  ('2021-10-13 09:56:08.703703', '1034', '11043'),
  ('2021-10-13 09:56:08.703703', '1034', '11044'),
  ('2021-10-13 09:56:08.704704', '1034', '11045')
  ;

  // Update to source_song table
