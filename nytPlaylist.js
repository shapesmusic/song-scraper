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
    ('New York Times', 'The Playlist', 'Pop Smoke’s Memory Lives On, and 14 More New Songs', '2021-08-03 10:30:23.000000', 'https://www.nytimes.com/2021/07/16/arts/music/playlist-pop-smoke-swedish-house-mafia.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 964; // SELECT last_insert_rowid();
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
//          find and replace "Featured" with "ft."
//

  songsData =
  [
      {
          "title": "More Time",
          "artist_name": "Pop Smoke",
          "video_id": null,
          "capture_date": "2021-10-12 01:01:01.119119",
          "source_id": 964,
          "song_id": 10673,
          "duplicate": true
      },
      {
          "title": "Working All the Time",
          "artist_name": "Xenia Rubinos",
          "video_id": null,
          "capture_date": "2021-10-12 01:01:01.120120",
          "source_id": 964,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "It Gets Better",
          "artist_name": "Swedish House Mafia",
          "video_id": null,
          "capture_date": "2021-10-12 01:01:01.121121",
          "source_id": 964,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Whenever You’re Ready",
          "artist_name": "Mahalia",
          "video_id": null,
          "capture_date": "2021-10-12 01:01:01.121121",
          "source_id": 964,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Bunny Is a Rider",
          "artist_name": "Caroline Polachek",
          "video_id": null,
          "capture_date": "2021-10-12 01:01:01.121121",
          "source_id": 964,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Rom Com 2004",
          "artist_name": "Soccer Mommy",
          "video_id": null,
          "capture_date": "2021-10-12 01:01:01.121121",
          "source_id": 964,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Alien Love Call",
          "artist_name": "Turnstile ft. Blood Orange",
          "video_id": null,
          "capture_date": "2021-10-12 01:01:01.121121",
          "source_id": 964,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Swimmer",
          "artist_name": "Half Waif",
          "video_id": null,
          "capture_date": "2021-10-12 01:01:01.121121",
          "source_id": 964,
          "song_id": 10335,
          "duplicate": true
      },
      {
          "title": "Idea of You",
          "artist_name": "Yas",
          "video_id": null,
          "capture_date": "2021-10-12 01:01:01.121121",
          "source_id": 964,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "White Picket Fence",
          "artist_name": "Koreless",
          "video_id": null,
          "capture_date": "2021-10-12 01:01:01.121121",
          "source_id": 964,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "200 Copas",
          "artist_name": "Karol G",
          "video_id": null,
          "capture_date": "2021-10-12 01:01:01.121121",
          "source_id": 964,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "El Plan",
          "artist_name": "Tainy and Yandel",
          "video_id": null,
          "capture_date": "2021-10-12 01:01:01.121121",
          "source_id": 964,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Momento Presente",
          "artist_name": "Mas Aya",
          "video_id": null,
          "capture_date": "2021-10-12 01:01:01.121121",
          "source_id": 964,
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
  ('Working All the Time', 'Xenia Rubinos', NULL),
  ('It Gets Better', 'Swedish House Mafia', NULL),
  ('Whenever You’re Ready', 'Mahalia', NULL),
  ('Bunny Is a Rider', 'Caroline Polachek', NULL),
  ('Rom Com 2004', 'Soccer Mommy', NULL),
  ('Alien Love Call', 'Turnstile ft. Blood Orange', NULL),
  ('Idea of You', 'Yas', NULL),
  ('White Picket Fence', 'Koreless', NULL),
  ('200 Copas', 'Karol G', NULL),
  ('El Plan', 'Tainy and Yandel', NULL),
  ('Momento Presente', 'Mas Aya', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10880; // SELECT last_insert_rowid();

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
  ('2021-10-12 01:01:01.119119', '964', '10673'),
  ('2021-10-12 01:01:01.120120', '964', '10870'),
  ('2021-10-12 01:01:01.121121', '964', '10871'),
  ('2021-10-12 01:01:01.121121', '964', '10872'),
  ('2021-10-12 01:01:01.121121', '964', '10873'),
  ('2021-10-12 01:01:01.121121', '964', '10874'),
  ('2021-10-12 01:01:01.121121', '964', '10875'),
  ('2021-10-12 01:01:01.121121', '964', '10335'),
  ('2021-10-12 01:01:01.121121', '964', '10876'),
  ('2021-10-12 01:01:01.121121', '964', '10877'),
  ('2021-10-12 01:01:01.121121', '964', '10878'),
  ('2021-10-12 01:01:01.121121', '964', '10879'),
  ('2021-10-12 01:01:01.121121', '964', '10880')
  ;

  // Update to source_song table
