//
// Step 0: Check recent scraped
//

  SELECT instance_name FROM source WHERE parent_entity = 'Billboard' ORDER BY publication_date DESC LIMIT 8;


//
// Step 1: Scrape source data
//

  // Add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // Get and format publicationDate
  publicationDate = document.getElementsByClassName('date-selector__button button--link')[0].innerText.trim();
  publicationDateFormatted = moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

  // Get location and format for current or past chart status
  currentChartLocation = window.location.href + "/" + moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD");
  pastChartLocation = window.location.href;

  // Build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'Billboard\', \'The Hot 100\', \'Week of "
    + publicationDate + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + pastChartLocation + "\');" // use pastChartLocation if not the current week's chart, otherwise use currentChartLocation
  )

  // Stage the SQL statement
  // Replace any ' in strings with ’

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('Billboard', 'The Hot 100', 'Week of December 5, 2020', '2020-12-05 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2020-12-05');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 750; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName('chart-list__element display--flex');

  songsData = [];

  for (var i=0; i<elements.length; i++){
      element = elements[i];
      isNew = element.getElementsByClassName('chart-element__trend chart-element__trend--new color--accent');
      songName = element.getElementsByClassName('chart-element__information__song text--truncate color--primary')[0];
      artistName = element.getElementsByClassName('chart-element__information__artist text--truncate color--secondary')[0];

      title = songName.innerText.trim();
      artist_name = artistName.innerText.trim();
      video_id = null;
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

      if(isNew.length == 1 && isNew[0].innerText == "New"){ // because innerText can also be "Re-Enter"

        songsData.push(songData);

      };
  };

  JSON.stringify(songsData, null, 4);


//
// Step 3: Stage songsData, find & set any duplicate songs to true, and add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "Life Goes On",
        "artist_name": "BTS",
        "video_id": null,
        "capture_date": "2020-12-22 09:50:33.870870",
        "source_id": 750,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Monster",
        "artist_name": "Shawn Mendes & Justin Bieber",
        "video_id": null,
        "capture_date": "2020-12-22 09:50:33.872872",
        "source_id": 750,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Body",
        "artist_name": "Megan Thee Stallion",
        "video_id": null,
        "capture_date": "2020-12-22 09:50:33.872872",
        "source_id": 750,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Blue & Grey",
        "artist_name": "BTS",
        "video_id": null,
        "capture_date": "2020-12-22 09:50:33.872872",
        "source_id": 750,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Stay",
        "artist_name": "BTS",
        "video_id": null,
        "capture_date": "2020-12-22 09:50:33.872872",
        "source_id": 750,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Somebody's Problem",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2020-12-22 09:50:33.872872",
        "source_id": 750,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Still Goin Down",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2020-12-22 09:50:33.873873",
        "source_id": 750,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Prisoner",
        "artist_name": "Miley Cyrus Featuring Dua Lipa",
        "video_id": null,
        "capture_date": "2020-12-22 09:50:33.873873",
        "source_id": 750,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Fly To My Room",
        "artist_name": "BTS",
        "video_id": null,
        "capture_date": "2020-12-22 09:50:33.873873",
        "source_id": 750,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Telepathy",
        "artist_name": "BTS",
        "video_id": null,
        "capture_date": "2020-12-22 09:50:33.873873",
        "source_id": 750,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cry Baby",
        "artist_name": "Megan Thee Stallion Featuring DaBaby",
        "video_id": null,
        "capture_date": "2020-12-22 09:50:33.873873",
        "source_id": 750,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dis-ease",
        "artist_name": "BTS",
        "video_id": null,
        "capture_date": "2020-12-22 09:50:33.873873",
        "source_id": 750,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Shots Fired",
        "artist_name": "Megan Thee Stallion",
        "video_id": null,
        "capture_date": "2020-12-22 09:50:33.874874",
        "source_id": 750,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Livin' The Dream",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2020-12-22 09:50:33.874874",
        "source_id": 750,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Pain Away",
        "artist_name": "Meek Mill Featuring Lil Durk",
        "video_id": null,
        "capture_date": "2020-12-22 09:50:33.874874",
        "source_id": 750,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Do It On The Tip",
        "artist_name": "Megan Thee Stallion Featuring City Girls & Hot Girl Meg",
        "video_id": null,
        "capture_date": "2020-12-22 09:50:33.874874",
        "source_id": 750,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Circles",
        "artist_name": "Megan Thee Stallion",
        "video_id": null,
        "capture_date": "2020-12-22 09:50:33.874874",
        "source_id": 750,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bichota",
        "artist_name": "Karol G",
        "video_id": null,
        "capture_date": "2020-12-22 09:50:33.874874",
        "source_id": 750,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cover Me Up",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2020-12-22 09:50:33.874874",
        "source_id": 750,
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
    ('Life Goes On', 'BTS', NULL),
    ('Monster', 'Shawn Mendes & Justin Bieber', NULL),
    ('Body', 'Megan Thee Stallion', NULL),
    ('Blue & Grey', 'BTS', NULL),
    ('Stay', 'BTS', NULL),
    ('Somebody’s Problem', 'Morgan Wallen', NULL),
    ('Still Goin Down', 'Morgan Wallen', NULL),
    ('Prisoner', 'Miley Cyrus Featuring Dua Lipa', NULL),
    ('Fly To My Room', 'BTS', NULL),
    ('Telepathy', 'BTS', NULL),
    ('Cry Baby', 'Megan Thee Stallion Featuring DaBaby', NULL),
    ('Dis-ease', 'BTS', NULL),
    ('Shots Fired', 'Megan Thee Stallion', NULL),
    ('Livin’ The Dream', 'Morgan Wallen', NULL),
    ('Pain Away', 'Meek Mill Featuring Lil Durk', NULL),
    ('Do It On The Tip', 'Megan Thee Stallion Featuring City Girls & Hot Girl Meg', NULL),
    ('Circles', 'Megan Thee Stallion', NULL),
    ('Bichota', 'Karol G', NULL),
    ('Cover Me Up', 'Morgan Wallen', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9609; // SELECT last_insert_rowid();

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
    ('2020-12-22 09:50:33.870870', '750', '9591'),
    ('2020-12-22 09:50:33.872872', '750', '9592'),
    ('2020-12-22 09:50:33.872872', '750', '9593'),
    ('2020-12-22 09:50:33.872872', '750', '9594'),
    ('2020-12-22 09:50:33.872872', '750', '9595'),
    ('2020-12-22 09:50:33.872872', '750', '9596'),
    ('2020-12-22 09:50:33.873873', '750', '9597'),
    ('2020-12-22 09:50:33.873873', '750', '9598'),
    ('2020-12-22 09:50:33.873873', '750', '9599'),
    ('2020-12-22 09:50:33.873873', '750', '9600'),
    ('2020-12-22 09:50:33.873873', '750', '9601'),
    ('2020-12-22 09:50:33.873873', '750', '9602'),
    ('2020-12-22 09:50:33.874874', '750', '9603'),
    ('2020-12-22 09:50:33.874874', '750', '9604'),
    ('2020-12-22 09:50:33.874874', '750', '9605'),
    ('2020-12-22 09:50:33.874874', '750', '9606'),
    ('2020-12-22 09:50:33.874874', '750', '9607'),
    ('2020-12-22 09:50:33.874874', '750', '9608'),
    ('2020-12-22 09:50:33.874874', '750', '9609')
  ;

  // Update to source_song table
