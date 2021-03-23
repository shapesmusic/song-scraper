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
    + "\nVALUES \n  (\'YouTube\', \'Global Top Songs\', \'Week of " // Change instance_name 'Global Top Songs' if scraping a different YT chart
    + publicationDate + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + currentChartLocation + "\');" // use pastChartLocation if not the current week's chart, otherwise use currentChartLocation
  )


  // Stage the SQL statement
  // Replace any ' in strings with ’

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('YouTube', 'Global Top Songs', 'Week of Mar 18, 2021', '2021-03-18 12:00:00.000000', 'https://charts.youtube.com/charts/TopSongs/global/20210312-20210318');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 856; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName('chart-table-row style-scope ytmc-chart-table');

  songsData = [];

  for (var i=0; i<elements.length; i++){
      element = elements[i];

      isNew = element.getElementsByClassName("style-scope ytmc-chart-table")[0].getElementsByClassName("style-scope ytmc-chart-table")[4].getElementsByClassName("style-scope ytmc-chart-table")[1].innerText;

      title = element.getElementsByClassName("ytmc-ellipsis-text style-scope")[0].innerText.trim();
      artist_name = element.getElementsByClassName("ytmc-artist-name style-scope ytmc-artists-list")[0].innerText.trim();
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
//          move any artists out of titles,
//          prune unwanted songs,
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "On The Ground",
        "artist_name": "Rosé",
        "video_id": null,
        "capture_date": "2021-03-23 09:47:17.036036",
        "source_id": 856,
        "song_id": 10008,
        "duplicate": true
    },
    {
        "title": "GONE",
        "artist_name": "Rosé",
        "video_id": null,
        "capture_date": "2021-03-23 09:47:17.039039",
        "source_id": 856,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bzrp Music Sessions, Vol.38",
        "artist_name": "Bizarrap & L-gante",
        "video_id": null,
        "capture_date": "2021-03-23 09:47:17.040040",
        "source_id": 856,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Har Funn Maula",
        "artist_name": "Vishal Dadlani & Zara Khan",
        "video_id": null,
        "capture_date": "2021-03-23 09:47:17.041041",
        "source_id": 856,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Oye Hoye Hoye",
        "artist_name": "Jassi Gill & Simar Kaur",
        "video_id": null,
        "capture_date": "2021-03-23 09:47:17.041041",
        "source_id": 856,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Batom de Cereja (Ao Vivo)",
        "artist_name": "Israel & Rodolffo",
        "video_id": null,
        "capture_date": "2021-03-23 09:47:17.042042",
        "source_id": 856,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Travesuras",
        "artist_name": "Nio Garcia & Casper Magico",
        "video_id": null,
        "capture_date": "2021-03-23 09:47:17.042042",
        "source_id": 856,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Tu Shayar Banaagi",
        "artist_name": "Parry Sidhu, Isha Sharma, MixSingh",
        "video_id": null,
        "capture_date": "2021-03-23 09:47:17.043043",
        "source_id": 856,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "To the Bone",
        "artist_name": "Pamungkas",
        "video_id": null,
        "capture_date": "2021-03-23 09:47:17.043043",
        "source_id": 856,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Ali Baba",
        "artist_name": "Mankirt Aulakh feat. Japji Khaira",
        "video_id": null,
        "capture_date": "2021-03-23 09:47:17.043043",
        "source_id": 856,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "No More Parties",
        "artist_name": "Coi Leray feat. Lil Durk",
        "video_id": null,
        "capture_date": "2021-03-23 09:47:17.044044",
        "source_id": 856,
        "song_id": 9782,
        "duplicate": true
    },
    {
        "title": "भतार मोर टेम्पू के ड्राइवर",
        "artist_name": "Khesari Lal Yadav",
        "video_id": null,
        "capture_date": "2021-03-23 09:47:17.044044",
        "source_id": 856,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Teri Aadat",
        "artist_name": "Abhi Dutt",
        "video_id": null,
        "capture_date": "2021-03-23 09:47:17.045045",
        "source_id": 856,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Jugni Jugni",
        "artist_name": "Anuradha Paudwal, Sukhwinder Singh, Jaspinder Narula & Anmol Malik",
        "video_id": null,
        "capture_date": "2021-03-23 09:47:17.045045",
        "source_id": 856,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "MIC Drop (Steve Aoki Remix)",
        "artist_name": "BTS feat. Steve Aoki",
        "video_id": null,
        "capture_date": "2021-03-23 09:47:17.046046",
        "source_id": 856,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "En Tu Cuerpo (Remix)",
        "artist_name": "Lyanno, Rauw Alejandro, Lenny Tavárez & Maria Becerra",
        "video_id": null,
        "capture_date": "2021-03-23 09:47:17.046046",
        "source_id": 856,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Wellerman",
        "artist_name": "Nathan Evans",
        "video_id": null,
        "capture_date": "2021-03-23 09:47:17.046046",
        "source_id": 856,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Beautiful Mistakes",
        "artist_name": "Maroon 5 feat. Megan Thee Stallion",
        "video_id": null,
        "capture_date": "2021-03-23 09:47:17.047047",
        "source_id": 856,
        "song_id": 9965,
        "duplicate": true
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
  ('GONE', 'Rosé', NULL),
  ('Bzrp Music Sessions, Vol.38', 'Bizarrap & L-gante', NULL),
  ('Har Funn Maula', 'Vishal Dadlani & Zara Khan', NULL),
  ('Oye Hoye Hoye', 'Jassi Gill & Simar Kaur', NULL),
  ('Batom de Cereja (Ao Vivo)', 'Israel & Rodolffo', NULL),
  ('Travesuras', 'Nio Garcia & Casper Magico', NULL),
  ('Tu Shayar Banaagi', 'Parry Sidhu, Isha Sharma, MixSingh', NULL),
  ('To the Bone', 'Pamungkas', NULL),
  ('Ali Baba', 'Mankirt Aulakh feat. Japji Khaira', NULL),
  ('भतार मोर टेम्पू के ड्राइवर', 'Khesari Lal Yadav', NULL),
  ('Teri Aadat', 'Abhi Dutt', NULL),
  ('Jugni Jugni', 'Anuradha Paudwal, Sukhwinder Singh, Jaspinder Narula & Anmol Malik', NULL),
  ('MIC Drop (Steve Aoki Remix)', 'BTS feat. Steve Aoki', NULL),
  ('En Tu Cuerpo (Remix)', 'Lyanno, Rauw Alejandro, Lenny Tavárez & Maria Becerra', NULL),
  ('Wellerman', 'Nathan Evans', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10054; // SELECT last_insert_rowid();

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
  ('2021-03-23 09:47:17.036036', '856', '10008'),
  ('2021-03-23 09:47:17.039039', '856', '10040'),
  ('2021-03-23 09:47:17.040040', '856', '10041'),
  ('2021-03-23 09:47:17.041041', '856', '10042'),
  ('2021-03-23 09:47:17.041041', '856', '10043'),
  ('2021-03-23 09:47:17.042042', '856', '10044'),
  ('2021-03-23 09:47:17.042042', '856', '10045'),
  ('2021-03-23 09:47:17.043043', '856', '10046'),
  ('2021-03-23 09:47:17.043043', '856', '10047'),
  ('2021-03-23 09:47:17.043043', '856', '10048'),
  ('2021-03-23 09:47:17.044044', '856', '9782'),
  ('2021-03-23 09:47:17.044044', '856', '10049'),
  ('2021-03-23 09:47:17.045045', '856', '10050'),
  ('2021-03-23 09:47:17.045045', '856', '10051'),
  ('2021-03-23 09:47:17.046046', '856', '10052'),
  ('2021-03-23 09:47:17.046046', '856', '10053'),
  ('2021-03-23 09:47:17.046046', '856', '10054'),
  ('2021-03-23 09:47:17.047047', '856', '9965')
  ;

  // Update to source_song table
