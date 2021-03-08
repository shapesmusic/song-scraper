//
// Step 0: Check recent scraped
//

  SELECT parent_stream, instance_name FROM source WHERE parent_entity = 'YouTube' ORDER BY publication_date DESC LIMIT 8;

//
// Step 1: Scrape source data
//

  // Add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // Get and format publicationDate
  publicationDate = document.getElementsByClassName('style-scope ytmc-dropdown iron-selected')[1].ariaLabel.match(/(?<=–)[^–]*/)[0].trim()
  weekBeginDate = moment(publicationDate).subtract(6, "days");

  publicationDateFormatted = moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // SQLite time format

  // Get location and format for current or past chart status
  currentChartLocation = window.location.href
    + "/"
    + moment(weekBeginDate, "MMM DD, YYYY").format("YYYYMMDD")
    + "-"
    + moment(publicationDate, "MMM DD, YYYY").format("YYYYMMDD");

pastChartLocation = window.location.href;

  // Build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'YouTube\', \'Global Top Songs\', \'Week of "
    + publicationDate + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + pastChartLocation + "\');" // use pastChartLocation if not the current week's chart, otherwise use currentChartLocation
  )


  // Stage the SQL statement
  // Replace any ' in strings with ’

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('YouTube', 'Global Top Songs', 'Week of Feb 25, 2021', '2021-02-25 12:00:00.000000', 'https://charts.youtube.com/charts/TopSongs/global/20210219-20210225');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 801; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName('chart-table-row style-scope ytmc-chart-table');

  songsData = [];

  for (var i=0; i<elements.length; i++){ // if artist_name error, set i to scrape up to the problem song, then after the problem song.
      element = elements[i];

      isNew = element.getElementsByClassName("style-scope ytmc-chart-table")[0].getElementsByClassName("style-scope ytmc-chart-table")[4].getElementsByClassName("style-scope ytmc-chart-table")[1].innerText;

      title = element.getElementsByClassName("ytmc-ellipsis-text style-scope")[0].innerText.trim();
      artist_name = element.getElementsByClassName("ytmc-artist-name clickable style-scope ytmc-artists-list")[0].innerText.trim();
      video_id = null;
      capture_date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format
      duplicate = false;

      songData = {
        // 'element': i,
        'title' : title,
        'artist_name' : artist_name,
        'video_id' : video_id,
        'capture_date' : capture_date,
        'source_id' : source_id,
        'song_id' : song_id,
        'duplicate' : duplicate
      };

      if(isNew == "--"){

        songsData.push(songData);
        console.log(i);

      };
  };

  JSON.stringify(songsData, null, 4);


//
// Step 3:  Stage songsData,
//          move artists out of titles,
//          prune unwanted songs,
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "ZAZA",
        "artist_name": "6ix9ine",
        "video_id": null,
        "capture_date": "2021-03-08 08:54:18.284284",
        "source_id": 801,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sira E Hou",
        "artist_name": "Amrit Maan & Nimrat Khaira",
        "video_id": null,
        "capture_date": "2021-03-08 08:54:18.286286",
        "source_id": 801,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "telepatía",
        "artist_name": "Kali Uchis",
        "video_id": null,
        "capture_date": "2021-03-08 08:54:18.287287",
        "source_id": 801,
        "song_id": 9695,
        "duplicate": true
    },
    {
        "title": "Don't Call Me",
        "artist_name": "SHINee",
        "video_id": null,
        "capture_date": "2021-03-08 08:58:26.627627",
        "source_id": 801,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Panghat",
        "artist_name": "Asees Kaur, Divya Kumar, Sachin–Jigar & Mellow D",
        "video_id": null,
        "capture_date": "2021-03-08 08:58:26.628628",
        "source_id": 801,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Lahangwa Las Las Karta",
        "artist_name": "Pawan Singh",
        "video_id": null,
        "capture_date": "2021-03-08 08:58:26.628628",
        "source_id": 801,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Back In Blood",
        "artist_name": "Pooh Shiesty feat. Lil Durk",
        "video_id": null,
        "capture_date": "2021-03-08 08:58:26.628628",
        "source_id": 801,
        "song_id": 9733,
        "duplicate": true
    },
    {
        "title": "Okey Oka Lokam",
        "artist_name": "Arun Chiluveru & Sid Sriram",
        "video_id": null,
        "capture_date": "2021-03-08 08:58:26.629629",
        "source_id": 801,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Rabba Mehar Kari",
        "artist_name": "Darshan Raval",
        "video_id": null,
        "capture_date": "2021-03-08 08:58:26.629629",
        "source_id": 801,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Tery Nal Payar Ho Gia",
        "artist_name": "Zaheer Lohar feat. Samina Parizad",
        "video_id": null,
        "capture_date": "2021-03-08 08:58:26.629629",
        "source_id": 801,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dhund Di Khushboo",
        "artist_name": "Kaka Ji & Adaab Kharound",
        "video_id": null,
        "capture_date": "2021-03-08 08:58:26.630630",
        "source_id": 801,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Acaso",
        "artist_name": "Vitor Fernandes",
        "video_id": null,
        "capture_date": "2021-03-08 08:58:26.630630",
        "source_id": 801,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Jala Jala Jalapaatham Nuvvu",
        "artist_name": "Jaspreet Jasz & Shreya Ghoshal",
        "video_id": null,
        "capture_date": "2021-03-08 08:58:26.630630",
        "source_id": 801,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Raule",
        "artist_name": "Jassa Dhillon, Gurlez Akhtar & Gur Sidhu",
        "video_id": null,
        "capture_date": "2021-03-08 08:58:26.630630",
        "source_id": 801,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "dil mang raha hai maholat tere sath jine ki",
        "artist_name": "Yasser Desai",
        "video_id": null,
        "capture_date": "2021-03-08 08:58:26.631631",
        "source_id": 801,
        "song_id": null,
        "duplicate": false
    }
]

  // Check each song for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%Up%'
    AND artist_name LIKE '%Cardi%'
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
  ('ZAZA', '6ix9ine', NULL),
  ('Sira E Hou', 'Amrit Maan & Nimrat Khaira', NULL),
  ('Don’t Call Me', 'SHINee', NULL),
  ('Panghat', 'Asees Kaur, Divya Kumar, Sachin–Jigar & Mellow D', NULL),
  ('Lahangwa Las Las Karta', 'Pawan Singh', NULL),
  ('Okey Oka Lokam', 'Arun Chiluveru & Sid Sriram', NULL),
  ('Rabba Mehar Kari', 'Darshan Raval', NULL),
  ('Tery Nal Payar Ho Gia', 'Zaheer Lohar feat. Samina Parizad', NULL),
  ('Dhund Di Khushboo', 'Kaka Ji & Adaab Kharound', NULL),
  ('Acaso', 'Vitor Fernandes', NULL),
  ('Jala Jala Jalapaatham Nuvvu', 'Jaspreet Jasz & Shreya Ghoshal', NULL),
  ('Raule', 'Jassa Dhillon, Gurlez Akhtar & Gur Sidhu', NULL),
  ('dil mang raha hai maholat tere sath jine ki', 'Yasser Desai', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9923; // SELECT last_insert_rowid();

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
  ('2021-03-08 08:54:18.284284', '801', '9911'),
  ('2021-03-08 08:54:18.286286', '801', '9912'),
  ('2021-03-08 08:54:18.287287', '801', '9695'),
  ('2021-03-08 08:58:26.627627', '801', '9913'),
  ('2021-03-08 08:58:26.628628', '801', '9914'),
  ('2021-03-08 08:58:26.628628', '801', '9915'),
  ('2021-03-08 08:58:26.628628', '801', '9733'),
  ('2021-03-08 08:58:26.629629', '801', '9916'),
  ('2021-03-08 08:58:26.629629', '801', '9917'),
  ('2021-03-08 08:58:26.629629', '801', '9918'),
  ('2021-03-08 08:58:26.630630', '801', '9919'),
  ('2021-03-08 08:58:26.630630', '801', '9920'),
  ('2021-03-08 08:58:26.630630', '801', '9921'),
  ('2021-03-08 08:58:26.630630', '801', '9922'),
  ('2021-03-08 08:58:26.631631', '801', '9923')
  ;

  // Update to source_song table
