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
    ('Complex', 'Best New Music This Week', 'J. Cole, 21 Savage, Nicki Minaj, and More', '2021-05-14 12:00:00.000000', 'https://www.complex.com/music/best-new-music-this-week-j-cole-21-savage-nicki-minaj/jorja-smith-time');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 914; // SELECT last_insert_rowid();
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
        "title": "Amari",
        "artist_name": "J. Cole",
        "video_id": "gK07p6RGbtg",
        "capture_date": "2021-05-27 05:56:54.108108",
        "source_id": 914,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Emergency",
        "artist_name": "21 Savage f/ Young Thug & Gunna",
        "video_id": "kMDOCRHBh7c",
        "capture_date": "2021-05-27 05:56:54.109109",
        "source_id": 914,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Seeing Green",
        "artist_name": "Nicki Minaj f/ Drake & Lil Wayne",
        "video_id": "_Q7rcUm0Dro",
        "capture_date": "2021-05-27 05:56:54.109109",
        "source_id": 914,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Straightenin",
        "artist_name": "Migos",
        "video_id": "E553AnMAvlU",
        "capture_date": "2021-05-27 05:56:54.109109",
        "source_id": 914,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "His & Hers",
        "artist_name": "Internet Money f/ Lil Uzi Vert, Gunna, & Don Toliver",
        "video_id": "mz-FT8Z3Hu8",
        "capture_date": "2021-05-27 05:56:54.110110",
        "source_id": 914,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Like Dat",
        "artist_name": "Kehlani & T-Pain",
        "video_id": "nel6zLnYrSw",
        "capture_date": "2021-05-27 05:56:54.110110",
        "source_id": 914,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "9 Bridge",
        "artist_name": "A Boogie & Rowdy Rebel",
        "video_id": "wXnJN2uAyOg",
        "capture_date": "2021-05-27 05:56:54.110110",
        "source_id": 914,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "White Teeth",
        "artist_name": "YoungBoy Never Broke Again",
        "video_id": "V2GhUGSOhEc",
        "capture_date": "2021-05-27 05:56:54.110110",
        "source_id": 914,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "From These Heights",
        "artist_name": "Jelani Aryeh",
        "video_id": "DkzG2IV8vms",
        "capture_date": "2021-05-27 05:56:54.110110",
        "source_id": 914,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Good 4 U",
        "artist_name": "Olivia Rodrigo",
        "video_id": "gNi_6U5Pm_o",
        "capture_date": "2021-05-27 05:56:54.110110",
        "source_id": 914,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "NEW BUGATTI",
        "artist_name": "Lil Gnar f/ Ski Mask The Slump God, Chief Keef, and DJ Scheme",
        "video_id": "xC3dnTLTRe8",
        "capture_date": "2021-05-27 05:56:54.110110",
        "source_id": 914,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Time",
        "artist_name": "Jorja Smith",
        "video_id": "DMLSvu_zVcc",
        "capture_date": "2021-05-27 05:56:54.110110",
        "source_id": 914,
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
  ('Amari', 'J. Cole', NULL),
  ('Emergency', '21 Savage f/ Young Thug & Gunna', NULL),
  ('Seeing Green', 'Nicki Minaj f/ Drake & Lil Wayne', NULL),
  ('Straightenin', 'Migos', NULL),
  ('His & Hers', 'Internet Money f/ Lil Uzi Vert, Gunna, & Don Toliver', NULL),
  ('Like Dat', 'Kehlani & T-Pain', NULL),
  ('9 Bridge', 'A Boogie & Rowdy Rebel', NULL),
  ('White Teeth', 'YoungBoy Never Broke Again', NULL),
  ('From These Heights', 'Jelani Aryeh', NULL),
  ('Good 4 U', 'Olivia Rodrigo', NULL),
  ('NEW BUGATTI', 'Lil Gnar f/ Ski Mask The Slump God, Chief Keef, and DJ Scheme', NULL),
  ('Time', 'Jorja Smith', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10395; // SELECT last_insert_rowid();

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
  ('2021-05-27 05:56:54.108108', '914', '10384'),
  ('2021-05-27 05:56:54.109109', '914', '10385'),
  ('2021-05-27 05:56:54.109109', '914', '10386'),
  ('2021-05-27 05:56:54.109109', '914', '10387'),
  ('2021-05-27 05:56:54.110110', '914', '10388'),
  ('2021-05-27 05:56:54.110110', '914', '10389'),
  ('2021-05-27 05:56:54.110110', '914', '10390'),
  ('2021-05-27 05:56:54.110110', '914', '10391'),
  ('2021-05-27 05:56:54.110110', '914', '10392'),
  ('2021-05-27 05:56:54.110110', '914', '10393'),
  ('2021-05-27 05:56:54.110110', '914', '10394'),
  ('2021-05-27 05:56:54.110110', '914', '10395')
  ;

  // Update to source_song table
