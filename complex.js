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
    ('Complex', 'Best New Music This Week', 'Megan Thee Stallion, DaBaby, Meek Mill, and More', '2020-11-20 12:00:00.000000', 'https://www.complex.com/music/2020/11/best-new-music-this-week-november-20/');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 754; // SELECT last_insert_rowid();
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
        "title": "Shots Fired",
        "artist_name": "Megan Thee Stallion",
        "video_id": "P8jNPawT-aM",
        "capture_date": "2020-12-22 01:10:28.798798",
        "source_id": 754,
        "song_id": 9603,
        "duplicate": true
    },
    {
        "title": "Gucci Peacoat",
        "artist_name": "DaBaby",
        "video_id": "uKhy1Y69BT4",
        "capture_date": "2020-12-22 01:10:28.799799",
        "source_id": 754,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Pain Away",
        "artist_name": "Meek Mill f/ Lil Durk",
        "video_id": "E0gmyePNri4",
        "capture_date": "2020-12-22 01:10:28.800800",
        "source_id": 754,
        "song_id": 9605,
        "duplicate": true
    },
    {
        "title": "Freedom Is Priceless",
        "artist_name": "SAINt JHN",
        "video_id": "kzb5lFcXo0A",
        "capture_date": "2020-12-22 01:10:28.800800",
        "source_id": 754,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Here We Go",
        "artist_name": "Jeezy",
        "video_id": "fIUN8JfLwhA",
        "capture_date": "2020-12-22 01:10:28.800800",
        "source_id": 754,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Flawed",
        "artist_name": "Wale f/ Gunna",
        "video_id": "EI1dpTo3nFU",
        "capture_date": "2020-12-22 01:10:28.800800",
        "source_id": 754,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Wave Blues",
        "artist_name": "French Montana f/ Benny the Butcher",
        "video_id": "lAW6qZbFxxI",
        "capture_date": "2020-12-22 01:10:28.800800",
        "source_id": 754,
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
    ('Gucci Peacoat', 'DaBaby', NULL),
    ('Freedom Is Priceless', 'SAINt JHN', NULL),
    ('Here We Go', 'Jeezy', NULL),
    ('Flawed', 'Wale f/ Gunna', NULL),
    ('Wave Blues', 'French Montana f/ Benny the Butcher', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9664; // SELECT last_insert_rowid();

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
    ('2020-12-22 01:10:28.798798', '754', '9603'),
    ('2020-12-22 01:10:28.799799', '754', '9660'),
    ('2020-12-22 01:10:28.800800', '754', '9605'),
    ('2020-12-22 01:10:28.800800', '754', '9661'),
    ('2020-12-22 01:10:28.800800', '754', '9662'),
    ('2020-12-22 01:10:28.800800', '754', '9663'),
    ('2020-12-22 01:10:28.800800', '754', '9664')
  ;

  // Update to source_song table
