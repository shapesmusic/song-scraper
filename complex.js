// Scroll to the bottom of the page first, so all the lazyload stuff loads
// Always check the last song name to make sure everything got scraped


//
// Step 0: Check recent scraped
//

  SELECT instance_name, publication_date FROM source WHERE parent_entity = 'Complex' ORDER BY publication_date DESC LIMIT 8;


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
    ('Complex', 'Best New Music This Week', 'Young Thug, Eminem, Sheff G, and More', '2020-12-18 12:00:00.000000', 'https://www.complex.com/music/2020/12/best-new-music-this-week-december-18/smoove-l-long-nights');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 757; // SELECT last_insert_rowid();
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

  JSON.stringify(songsData, null, 4);


//
// Step 3: Stage songsData, find & set any duplicate songs to true, and add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "Take It to Trial",
        "artist_name": "Young Thug, Gunna, & Yak Gotti",
        "video_id": "N4nfjhJN6SA",
        "capture_date": "2020-12-22 02:53:43.449449",
        "source_id": 757,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Anyone",
        "artist_name": "Sheff G",
        "video_id": "FNoPU7Aceh8",
        "capture_date": "2020-12-22 02:53:43.450450",
        "source_id": 757,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Raw Oysters",
        "artist_name": "Conway the Machine",
        "video_id": "o4IF6h6_3yA",
        "capture_date": "2020-12-22 02:53:43.450450",
        "source_id": 757,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Gnat",
        "artist_name": "Eminem",
        "video_id": "EosMazKaPbU",
        "capture_date": "2020-12-22 02:53:43.450450",
        "source_id": 757,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Statement",
        "artist_name": "G Herbo",
        "video_id": "FdhKsXJCAbk",
        "capture_date": "2020-12-22 02:53:43.450450",
        "source_id": 757,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cinderblocks",
        "artist_name": "Michael Christmas f/ Kota the Friend",
        "video_id": "0sMz6g3Uiz8",
        "capture_date": "2020-12-22 02:53:43.450450",
        "source_id": 757,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Long Nights",
        "artist_name": "Smoove'L",
        "video_id": "403i57Mg-Yc",
        "capture_date": "2020-12-22 02:53:43.450450",
        "source_id": 757,
        "song_id": null,
        "duplicate": false
    }
]

  // Check each song for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%Stay Down%'
    AND artist_name LIKE '%durk%'
  ;

  // If duplicates:
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
    ('Take It to Trial', 'Young Thug, Gunna, & Yak Gotti', NULL),
    ('Anyone', 'Sheff G', NULL),
    ('Raw Oysters', 'Conway the Machine', NULL),
    ('Gnat', 'Eminem', NULL),
    ('Statement', 'G Herbo', NULL),
    ('Cinderblocks', 'Michael Christmas f/ Kota the Friend', NULL),
    ('Long Nights', 'Smoove’L', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9684; // SELECT last_insert_rowid();

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
  ('2020-12-22 02:53:43.449449', '757', '9678'),
  ('2020-12-22 02:53:43.450450', '757', '9679'),
  ('2020-12-22 02:53:43.450450', '757', '9680'),
  ('2020-12-22 02:53:43.450450', '757', '9681'),
  ('2020-12-22 02:53:43.450450', '757', '9682'),
  ('2020-12-22 02:53:43.450450', '757', '9683'),
  ('2020-12-22 02:53:43.450450', '757', '9684')
  ;

  // Update to source_song table
