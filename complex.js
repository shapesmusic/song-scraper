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
    ('Complex', 'Best New Music This Week', 'Migos, Megan Thee Stallion, Polo G, and More', '2021-06-11 12:00:00.000000', 'https://www.complex.com/music/best-new-music-this-week-june-11/');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 939; // SELECT last_insert_rowid();
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
//          prune unwanted songs,
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "Modern Day",
        "artist_name": "Migos",
        "video_id": "sFRF5tUgfes",
        "capture_date": "2021-06-17 12:06:09.161161",
        "source_id": 939,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Thot Sh*t",
        "artist_name": "Megan Thee Stallion",
        "video_id": "KynkMn5Hv3Q",
        "capture_date": "2021-06-17 12:06:09.162162",
        "source_id": 939,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Black Hearted",
        "artist_name": "Polo G",
        "video_id": "SZpdP4YjMx8",
        "capture_date": "2021-06-17 12:06:09.163163",
        "source_id": 939,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Switching Lanes",
        "artist_name": "Pi’erre Bourne f/ Playboi Carti",
        "video_id": "Jgg2Q_5YSxY",
        "capture_date": "2021-06-17 12:06:09.163163",
        "source_id": 939,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Fast Lane",
        "artist_name": "Don Toliver, Lil Durk, and Latto",
        "video_id": "P4q2_DGsixI",
        "capture_date": "2021-06-17 12:06:09.163163",
        "source_id": 939,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Need to Know",
        "artist_name": "Doja Cat",
        "video_id": "dI3xkL7qUAc",
        "capture_date": "2021-06-17 12:06:09.163163",
        "source_id": 939,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Just For Me",
        "artist_name": "SAINt JHN & SZA",
        "video_id": "ehrER-GHJLs",
        "capture_date": "2021-06-17 12:06:09.163163",
        "source_id": 939,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Splash",
        "artist_name": "Tyga f/ Moneybagg Yo",
        "video_id": "zUrYkfHCV60",
        "capture_date": "2021-06-17 12:06:09.163163",
        "source_id": 939,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Peloton",
        "artist_name": "IDK",
        "video_id": "QuyLQaEUBq4",
        "capture_date": "2021-06-17 12:06:09.163163",
        "source_id": 939,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Solar Power",
        "artist_name": "Lorde",
        "video_id": "wvsP_lzh2-8",
        "capture_date": "2021-06-17 12:06:09.163163",
        "source_id": 939,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bigger Than Life or Death",
        "artist_name": "EST Gee",
        "video_id": "IK87gdZxCRo",
        "capture_date": "2021-06-17 12:06:09.163163",
        "source_id": 939,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Back & Forth",
        "artist_name": "Emotional Oranges f/ Vince Staples",
        "video_id": "ar_049WbvHE",
        "capture_date": "2021-06-17 12:06:09.163163",
        "source_id": 939,
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
  ('Modern Day', 'Migos', NULL),
  ('Thot Sh*t', 'Megan Thee Stallion', NULL),
  ('Black Hearted', 'Polo G', NULL),
  ('Switching Lanes', 'Pi’erre Bourne f/ Playboi Carti', NULL),
  ('Fast Lane', 'Don Toliver, Lil Durk, and Latto', NULL),
  ('Need to Know', 'Doja Cat', NULL),
  ('Just For Me', 'SAINt JHN & SZA', NULL),
  ('Splash', 'Tyga f/ Moneybagg Yo', NULL),
  ('Peloton', 'IDK', NULL),
  ('Solar Power', 'Lorde', NULL),
  ('Bigger Than Life or Death', 'EST Gee', NULL),
  ('Back & Forth', 'Emotional Oranges f/ Vince Staples', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10583; // SELECT last_insert_rowid();

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
  ('2021-06-17 12:06:09.161161', '939', '10572'),
  ('2021-06-17 12:06:09.162162', '939', '10573'),
  ('2021-06-17 12:06:09.163163', '939', '10574'),
  ('2021-06-17 12:06:09.163163', '939', '10575'),
  ('2021-06-17 12:06:09.163163', '939', '10576'),
  ('2021-06-17 12:06:09.163163', '939', '10577'),
  ('2021-06-17 12:06:09.163163', '939', '10578'),
  ('2021-06-17 12:06:09.163163', '939', '10579'),
  ('2021-06-17 12:06:09.163163', '939', '10580'),
  ('2021-06-17 12:06:09.163163', '939', '10581'),
  ('2021-06-17 12:06:09.163163', '939', '10582'),
  ('2021-06-17 12:06:09.163163', '939', '10583')
  ;

  // Update to source_song table
