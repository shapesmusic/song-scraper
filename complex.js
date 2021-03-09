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
    ('Complex', 'Best New Music This Week', 'Drake, Baby Keem, Bruno Mars, Anderson .Paak, and More', '2021-03-05 12:00:00.000000', 'https://www.complex.com/music/best-new-music-this-week-drake-baby-keem-bruno-mars-anderson-paak/denzel-curry-benny-the-butcher-diet-1.5');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 805; // SELECT last_insert_rowid();
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
// Step 3: Stage songsData, prune unwanted songs, find & set any duplicate songs to true, and add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "Lemon Pepper Freestyle",
        "artist_name": "Drake & Rick Ross",
        "video_id": "YvkHPdsjQQs",
        "capture_date": "2021-03-09 03:06:49.287287",
        "source_id": 805,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Real As It Gets",
        "artist_name": "Lil Baby f/ EST Gee",
        "video_id": "yhoGtNiNX40",
        "capture_date": "2021-03-09 03:06:49.288288",
        "source_id": 805,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "No Sense",
        "artist_name": "Baby Keem",
        "video_id": "qLqk4bgq6wI",
        "capture_date": "2021-03-09 03:06:49.288288",
        "source_id": 805,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Leave the Door Open",
        "artist_name": "Bruno Mars & Anderson .Paak",
        "video_id": "adLGHcj_fmA",
        "capture_date": "2021-03-09 03:06:49.288288",
        "source_id": 805,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hold On",
        "artist_name": "Justin Bieber",
        "video_id": "LWeiydKl0mU",
        "capture_date": "2021-03-09 03:06:49.289289",
        "source_id": 805,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Really Like That",
        "artist_name": "G Herbo",
        "video_id": "K0WYlMip5IQ",
        "capture_date": "2021-03-09 03:06:49.289289",
        "source_id": 805,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Heart & The Tongue",
        "artist_name": "Chance the Rapper",
        "video_id": "xnO2HDmT1D8",
        "capture_date": "2021-03-09 03:06:49.289289",
        "source_id": 805,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Life’s a Mess II",
        "artist_name": "Juice WRLD, Post Malone, & Clever",
        "video_id": "ig1idOx6SrE",
        "capture_date": "2021-03-09 03:06:49.289289",
        "source_id": 805,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Let It Blow",
        "artist_name": "OTF f/ Lil Uzi Vert",
        "video_id": "mhKmuDhvZbE",
        "capture_date": "2021-03-09 03:06:49.289289",
        "source_id": 805,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Tell Me How",
        "artist_name": "Tyler, the Creator",
        "video_id": "P1sl-wOiwSc",
        "capture_date": "2021-03-09 03:06:49.289289",
        "source_id": 805,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Best Friend (Remix)",
        "artist_name": "Saweetie & Doja Cat f/ Stefflon Don",
        "video_id": "lg1uk7Wtg4E",
        "capture_date": "2021-03-09 03:06:49.289289",
        "source_id": 805,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Thugged Out",
        "artist_name": "YNW Melly f/ Kodak Black",
        "video_id": "69RrVdbjrHM",
        "capture_date": "2021-03-09 03:06:49.289289",
        "source_id": 805,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "DIET_1.5",
        "artist_name": "Denzel Curry f/ Benny the Butcher",
        "video_id": "Z9hvQGWskUA",
        "capture_date": "2021-03-09 03:06:49.289289",
        "source_id": 805,
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
  ('Lemon Pepper Freestyle', 'Drake & Rick Ross', NULL),
  ('Real As It Gets', 'Lil Baby f/ EST Gee', NULL),
  ('No Sense', 'Baby Keem', NULL),
  ('Leave the Door Open', 'Bruno Mars & Anderson .Paak', NULL),
  ('Hold On', 'Justin Bieber', NULL),
  ('Really Like That', 'G Herbo', NULL),
  ('The Heart & The Tongue', 'Chance the Rapper', NULL),
  ('Life’s a Mess II', 'Juice WRLD, Post Malone, & Clever', NULL),
  ('Let It Blow', 'OTF f/ Lil Uzi Vert', NULL),
  ('Tell Me How', 'Tyler, the Creator', NULL),
  ('Best Friend (Remix)', 'Saweetie & Doja Cat f/ Stefflon Don', NULL),
  ('Thugged Out', 'YNW Melly f/ Kodak Black', NULL),
  ('DIET_1.5', 'Denzel Curry f/ Benny the Butcher', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9960; // SELECT last_insert_rowid();

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
  ('2021-03-09 03:06:49.287287', '805', '9948'),
  ('2021-03-09 03:06:49.288288', '805', '9949'),
  ('2021-03-09 03:06:49.288288', '805', '9950'),
  ('2021-03-09 03:06:49.288288', '805', '9951'),
  ('2021-03-09 03:06:49.289289', '805', '9952'),
  ('2021-03-09 03:06:49.289289', '805', '9953'),
  ('2021-03-09 03:06:49.289289', '805', '9954'),
  ('2021-03-09 03:06:49.289289', '805', '9955'),
  ('2021-03-09 03:06:49.289289', '805', '9956'),
  ('2021-03-09 03:06:49.289289', '805', '9957'),
  ('2021-03-09 03:06:49.289289', '805', '9958'),
  ('2021-03-09 03:06:49.289289', '805', '9959'),
  ('2021-03-09 03:06:49.289289', '805', '9960')
  ;

  // Update to source_song table
