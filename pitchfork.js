// FIXME: regex [ft. artists are in brackets] and IN SONG NAME, not ARTIST

//
// Step 0: Check recent scraped
//

  SELECT source.publication_date, song.title
  FROM source_song
  INNER JOIN song
    ON song.id = source_song.song_id
  INNER JOIN source
    ON source.id = source_song.source_id
  WHERE source.parent_entity = 'Pitchfork'
    AND source.parent_stream = 'Track Reviews'
  ORDER BY source.publication_date DESC LIMIT 8;


//
// Step 1: Scrape source data without duplicates
//

  // Note: a new song may already have an existing source!
  //
  // Songs released today have an "hours ago" date format, so enter YYYY-MM-DD manually
  //
  // Also may need to remove page number from "chartLocation" if scrolling down a lot to catch up.


  // Add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  sourceDates = [];

  // get a list of source dates from songs
  elements = document.getElementsByClassName("artist-list");
  for (var i=0; i<elements.length; i++){

    publicationDate = document.getElementsByClassName("pub-date")[i].innerText.trim();
    publicationDateFormatted = moment(publicationDate, "MMMM DD YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

    sourceDates.push(publicationDateFormatted);
  };

  // remove duplicate dates
  sourceSet = new Set(sourceDates);
  sourceArray = Array.from(sourceSet)

  // build sources object from dates
  sources = [];
  for (var i=0; i<sourceArray.length; i++){

    publicationDate = sourceArray[i];
    chartLocation = window.location.href;

    source = String(
      "\n(\'Pitchfork\', "
      + "\'Track Reviews\', "
      + "NULL, "
      + "\'" + publicationDate + "\', "
      + "\'" + chartLocation + "\')"
    );

    sources.push(source);

  };

  console.log(String(sources));


  // Paste sources into the SQL statement, and prune out existing sources
  // If necessary, remove page numbers (ex: ?page=2) from location

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
  ('Pitchfork', 'Track Reviews', NULL, '2021-10-06 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-10-05 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-10-01 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-09-30 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-09-28 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-09-23 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-09-21 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-09-15 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-09-13 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-09-09 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-09-08 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-09-07 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-09-03 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-09-02 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-08-31 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-08-30 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-08-27 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-08-25 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-08-23 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-08-20 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-08-17 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-08-13 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-08-10 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-08-09 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-08-06 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-07-28 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-07-27 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-07-23 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-07-22 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-07-21 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-07-20 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-07-19 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-07-16 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-07-14 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-07-13 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-07-09 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-07-08 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-07-07 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-07-06 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-07-02 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-06-30 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-06-25 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-06-24 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-06-23 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-06-22 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-06-21 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-06-17 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-06-16 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-06-15 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-06-11 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-06-10 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-06-09 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-06-08 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-06-04 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-06-03 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-06-02 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-05-27 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/')
  ;

  // Update to source table


//
// Step 2: Scrape songs data w/ placeholder source
//

  songsData = [];
  elements = document.getElementsByClassName("artist-list");
  for (var i=0; i<elements.length; i++){

    title = elements[i].nextElementSibling.innerText.match(/“(.*?)”/)[1]; // everything inside the quotatino marks
    artist_name = elements[i].innerText;
    video_id = null;

    capture_date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

    // date placeholder for source_id
    publicationDate = document.getElementsByClassName("pub-date")[i].innerText.trim();
    publicationDateFormatted = moment(publicationDate, "MMMM DD YYYY").format(); // to ISO

    songData = {
      'title' : title,
      'artist_name' : artist_name,
      'video_id' : video_id,
      'capture_date' : capture_date,
      'source_id' : publicationDateFormatted, // placeholder
      'song_id' : null,
      'duplicate' : false
    };

    songsData.push(songData);

  };

  console.log(JSON.stringify(songsData, null, 4));


//
// Step 3:  Stage new songs only,
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//

  songsData =
  [
      {
          "title": "Born Yesterday",
          "artist_name": "Arca / Sia",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.654654",
          "source_id": 977,
          "song_id": 10989,
          "duplicate": true
      },
      {
          "title": "Bottle Episode",
          "artist_name": "Mandy, Indiana",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.656656",
          "source_id": 978,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "zero",
          "artist_name": "cktrl",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.657657",
          "source_id": 979,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Want It All",
          "artist_name": "Burna Boy",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.657657",
          "source_id": 980,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "≈ In The Pinewaves ≈ / guardian angel bear",
          "artist_name": "Fire-Toolz",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.657657",
          "source_id": 981,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Queens",
          "artist_name": "Aeon Station",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.657657",
          "source_id": 982,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "miu",
          "artist_name": "Marina Herlop",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.657657",
          "source_id": 983,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "I Don’t Live Here Anymore",
          "artist_name": "The War on Drugs",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.657657",
          "source_id": 984,
          "song_id": 10955,
          "duplicate": true
      },
      {
          "title": "Valentine",
          "artist_name": "Snail Mail",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.657657",
          "source_id": 984,
          "song_id": 10960,
          "duplicate": true
      },
      {
          "title": "Tales From the Trash Stratum",
          "artist_name": "Oneohtrix Point Never / Elizabeth Fraser",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.657657",
          "source_id": 985,
          "song_id": 10962,
          "duplicate": true
      },
      {
          "title": "Spanish on the Beach",
          "artist_name": "Andy Shauf",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.658658",
          "source_id": 986,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Big Persona",
          "artist_name": "Maxo Kream",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.658658",
          "source_id": 987,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Life of the Party",
          "artist_name": "Kanye West",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.658658",
          "source_id": 988,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "If You Say the Word",
          "artist_name": "Radiohead",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.658658",
          "source_id": 988,
          "song_id": 10945,
          "duplicate": true
      },
      {
          "title": "7am on Bridle Path",
          "artist_name": "Drake",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.658658",
          "source_id": 989,
          "song_id": 10773,
          "duplicate": true
      },
      {
          "title": "Good Ones",
          "artist_name": "Charli XCX",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.658658",
          "source_id": 990,
          "song_id": 10935,
          "duplicate": true
      },
      {
          "title": "joni",
          "artist_name": "SZA",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.658658",
          "source_id": 991,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Off the Grid",
          "artist_name": "Kanye West",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.658658",
          "source_id": 992,
          "song_id": 10737,
          "duplicate": true
      },
      {
          "title": "Family Ties",
          "artist_name": "Baby Keem / Kendrick Lamar",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.658658",
          "source_id": 993,
          "song_id": 10741,
          "duplicate": true
      },
      {
          "title": "23",
          "artist_name": "Cleo Sol",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.658658",
          "source_id": 994,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Open the Gates",
          "artist_name": "Irreversible Entanglements",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.658658",
          "source_id": 994,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Star-Crossed",
          "artist_name": "Kacey Musgraves",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.659659",
          "source_id": 995,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Walking at a Downtown Pace",
          "artist_name": "Parquet Courts",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.659659",
          "source_id": 996,
          "song_id": 10915,
          "duplicate": true
      },
      {
          "title": "Mood Ring",
          "artist_name": "Lorde",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.659659",
          "source_id": 997,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Color of the Pool",
          "artist_name": "Lala Lala",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.659659",
          "source_id": 997,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Rumors",
          "artist_name": "Lizzo",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.659659",
          "source_id": 998,
          "song_id": 10710,
          "duplicate": true
      },
      {
          "title": "“Quotations“",
          "artist_name": "Water From Your Eyes",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.659659",
          "source_id": 998,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Little Things",
          "artist_name": "Big Thief",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.659659",
          "source_id": 999,
          "song_id": 10913,
          "duplicate": true
      },
      {
          "title": "Neon Blue",
          "artist_name": "Amelia Meath / Blake Mills",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.659659",
          "source_id": 1000,
          "song_id": 10906,
          "duplicate": true
      },
      {
          "title": "Take My Breath",
          "artist_name": "The Weeknd",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.659659",
          "source_id": 1001,
          "song_id": 10701,
          "duplicate": true
      },
      {
          "title": "Unclean Mind",
          "artist_name": "Grouper",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.659659",
          "source_id": 1002,
          "song_id": 10898,
          "duplicate": true
      },
      {
          "title": "Superperfection",
          "artist_name": "Film School",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.659659",
          "source_id": 1003,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Hold U",
          "artist_name": "Indigo De Souza",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.659659",
          "source_id": 1004,
          "song_id": 10886,
          "duplicate": true
      },
      {
          "title": "Day 7.5093",
          "artist_name": "Nilüfer Yanya",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.659659",
          "source_id": 1005,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Stoned at the Nail Salon",
          "artist_name": "Lorde",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.659659",
          "source_id": 1006,
          "song_id": 10884,
          "duplicate": true
      },
      {
          "title": "Before I Go",
          "artist_name": "Nite Jewel",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.659659",
          "source_id": 1007,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Living Proof",
          "artist_name": "The War on Drugs",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.659659",
          "source_id": 1008,
          "song_id": 10888,
          "duplicate": true
      },
      {
          "title": "Wild Side",
          "artist_name": "Normani",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.659659",
          "source_id": 1009,
          "song_id": 10667,
          "duplicate": true
      },
      {
          "title": "Maybe You Died",
          "artist_name": "Mega Bog",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.659659",
          "source_id": 1010,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Fuck Him All Night",
          "artist_name": "Azealia Banks",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.659659",
          "source_id": 1011,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Passion",
          "artist_name": "PinkPantheress",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.659659",
          "source_id": 1012,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Rae Street",
          "artist_name": "Courtney Barnett",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.659659",
          "source_id": 1013,
          "song_id": 10864,
          "duplicate": true
      },
      {
          "title": "Feel Nothing",
          "artist_name": "Amen Dunes",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.659659",
          "source_id": 1014,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Chaeri",
          "artist_name": "Magdalena Bay",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.660660",
          "source_id": 1015,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Renegade",
          "artist_name": "Big Red Machine",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.660660",
          "source_id": 1016,
          "song_id": 10651,
          "duplicate": true
      },
      {
          "title": "Michi No Eki",
          "artist_name": "Foodman",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.660660",
          "source_id": 1017,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "BDE",
          "artist_name": "Shygirl",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.660660",
          "source_id": 1017,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Bad Habits",
          "artist_name": "Ed Sheeran",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.660660",
          "source_id": 1018,
          "song_id": 10629,
          "duplicate": true
      },
      {
          "title": "Gemini and Leo",
          "artist_name": "Helado Negro",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.660660",
          "source_id": 1019,
          "song_id": 10846,
          "duplicate": true
      },
      {
          "title": "Richer Than Blood",
          "artist_name": "Arushi Jain",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.660660",
          "source_id": 1020,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Days Like These",
          "artist_name": "Low",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.660660",
          "source_id": 1021,
          "song_id": 10848,
          "duplicate": true
      },
      {
          "title": "Kill Me",
          "artist_name": "Indigo De Souza",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.660660",
          "source_id": 1021,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Jackie",
          "artist_name": "Yves Tumor",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.660660",
          "source_id": 1022,
          "song_id": 10822,
          "duplicate": true
      },
      {
          "title": "Thresholds (through a hole in the fence)",
          "artist_name": "Walt McClements",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.660660",
          "source_id": 1022,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Lumberjack",
          "artist_name": "Tyler, the Creator",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.660660",
          "source_id": 1023,
          "song_id": 10626,
          "duplicate": true
      },
      {
          "title": "Dustland",
          "artist_name": "The Killers",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.660660",
          "source_id": 1023,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Handsome Man",
          "artist_name": "Wednesday",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.660660",
          "source_id": 1024,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "DASH SNOW",
          "artist_name": "Dean Blunt",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.660660",
          "source_id": 1025,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Blouse",
          "artist_name": "Clairo",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.660660",
          "source_id": 1026,
          "song_id": 10602,
          "duplicate": true
      },
      {
          "title": "Thot Shit",
          "artist_name": "Megan Thee Stallion",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.660660",
          "source_id": 1026,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Solar Power",
          "artist_name": "Lorde",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.660660",
          "source_id": 1027,
          "song_id": 10581,
          "duplicate": true
      },
      {
          "title": "Great Mass of Color",
          "artist_name": "Deafheaven",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.660660",
          "source_id": 1027,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Glidin’",
          "artist_name": "Pa Salieu",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.660660",
          "source_id": 1028,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Everything Is Different (To Me)",
          "artist_name": "quickly, quickly",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.660660",
          "source_id": 1029,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Zami",
          "artist_name": "Moor Mother",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.660660",
          "source_id": 1030,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Glass Peach",
          "artist_name": "Joviale",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.660660",
          "source_id": 1031,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Caffeine Dream",
          "artist_name": "Iglew",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.661661",
          "source_id": 1032,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Table 42",
          "artist_name": "Taphari",
          "video_id": null,
          "capture_date": "2021-10-12 10:54:32.661661",
          "source_id": 1033,
          "song_id": null,
          "duplicate": false
      }
  ]

  // To check for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%Up%'
    AND artist_name LIKE '%Cardi%'
  ;


//
// Step 4: add source_ids
//

  // get source_ids and dates for newly added sources
  // increase LIMIT number if necessary
  SELECT id, publication_date, parent_entity FROM source ORDER BY id DESC LIMIT 10;

  // manually add source_ids in songsData above (INT without quotation marks).

  // Update var songsData = the array above.


//
// Step 5: Update nonduplicates to the song table
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
  // check artist name formatting

  INSERT INTO song
    (title, artist_name, video_id)
  VALUES
  ('Bottle Episode', 'Mandy, Indiana', NULL),
  ('zero', 'cktrl', NULL),
  ('Want It All', 'Burna Boy', NULL),
  ('≈ In The Pinewaves ≈ / guardian angel bear', 'Fire-Toolz', NULL),
  ('Queens', 'Aeon Station', NULL),
  ('miu', 'Marina Herlop', NULL),
  ('Spanish on the Beach', 'Andy Shauf', NULL),
  ('Big Persona', 'Maxo Kream', NULL),
  ('Life of the Party', 'Kanye West', NULL),
  ('joni', 'SZA', NULL),
  ('23', 'Cleo Sol', NULL),
  ('Open the Gates', 'Irreversible Entanglements', NULL),
  ('Star-Crossed', 'Kacey Musgraves', NULL),
  ('Mood Ring', 'Lorde', NULL),
  ('Color of the Pool', 'Lala Lala', NULL),
  ('“Quotations“', 'Water From Your Eyes', NULL),
  ('Superperfection', 'Film School', NULL),
  ('Day 7.5093', 'Nilüfer Yanya', NULL),
  ('Before I Go', 'Nite Jewel', NULL),
  ('Maybe You Died', 'Mega Bog', NULL),
  ('Fuck Him All Night', 'Azealia Banks', NULL),
  ('Passion', 'PinkPantheress', NULL),
  ('Feel Nothing', 'Amen Dunes', NULL),
  ('Chaeri', 'Magdalena Bay', NULL),
  ('Michi No Eki', 'Foodman', NULL),
  ('BDE', 'Shygirl', NULL),
  ('Richer Than Blood', 'Arushi Jain', NULL),
  ('Kill Me', 'Indigo De Souza', NULL),
  ('Thresholds (through a hole in the fence)', 'Walt McClements', NULL),
  ('Dustland', 'The Killers', NULL),
  ('Handsome Man', 'Wednesday', NULL),
  ('DASH SNOW', 'Dean Blunt', NULL),
  ('Thot Shit', 'Megan Thee Stallion', NULL),
  ('Great Mass of Color', 'Deafheaven', NULL),
  ('Glidin’', 'Pa Salieu', NULL),
  ('Everything Is Different (To Me)', 'quickly, quickly', NULL),
  ('Zami', 'Moor Mother', NULL),
  ('Glass Peach', 'Joviale', NULL),
  ('Caffeine Dream', 'Iglew', NULL),
  ('Table 42', 'Taphari', NULL)
  ;

   // Update to song table


//
// Step 6: Add new song_ids and update all songs to the source_song table.
//

  // Get the last song_id inserted
  song_id = 11038; // SELECT last_insert_rowid();

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
  ('2021-10-12 10:54:32.654654', '977', '10989'),
  ('2021-10-12 10:54:32.656656', '978', '10999'),
  ('2021-10-12 10:54:32.657657', '979', '11000'),
  ('2021-10-12 10:54:32.657657', '980', '11001'),
  ('2021-10-12 10:54:32.657657', '981', '11002'),
  ('2021-10-12 10:54:32.657657', '982', '11003'),
  ('2021-10-12 10:54:32.657657', '983', '11004'),
  ('2021-10-12 10:54:32.657657', '984', '10955'),
  ('2021-10-12 10:54:32.657657', '984', '10960'),
  ('2021-10-12 10:54:32.657657', '985', '10962'),
  ('2021-10-12 10:54:32.658658', '986', '11005'),
  ('2021-10-12 10:54:32.658658', '987', '11006'),
  ('2021-10-12 10:54:32.658658', '988', '11007'),
  ('2021-10-12 10:54:32.658658', '988', '10945'),
  ('2021-10-12 10:54:32.658658', '989', '10773'),
  ('2021-10-12 10:54:32.658658', '990', '10935'),
  ('2021-10-12 10:54:32.658658', '991', '11008'),
  ('2021-10-12 10:54:32.658658', '992', '10737'),
  ('2021-10-12 10:54:32.658658', '993', '10741'),
  ('2021-10-12 10:54:32.658658', '994', '11009'),
  ('2021-10-12 10:54:32.658658', '994', '11010'),
  ('2021-10-12 10:54:32.659659', '995', '11011'),
  ('2021-10-12 10:54:32.659659', '996', '10915'),
  ('2021-10-12 10:54:32.659659', '997', '11012'),
  ('2021-10-12 10:54:32.659659', '997', '11013'),
  ('2021-10-12 10:54:32.659659', '998', '10710'),
  ('2021-10-12 10:54:32.659659', '998', '11014'),
  ('2021-10-12 10:54:32.659659', '999', '10913'),
  ('2021-10-12 10:54:32.659659', '1000', '10906'),
  ('2021-10-12 10:54:32.659659', '1001', '10701'),
  ('2021-10-12 10:54:32.659659', '1002', '10898'),
  ('2021-10-12 10:54:32.659659', '1003', '11015'),
  ('2021-10-12 10:54:32.659659', '1004', '10886'),
  ('2021-10-12 10:54:32.659659', '1005', '11016'),
  ('2021-10-12 10:54:32.659659', '1006', '10884'),
  ('2021-10-12 10:54:32.659659', '1007', '11017'),
  ('2021-10-12 10:54:32.659659', '1008', '10888'),
  ('2021-10-12 10:54:32.659659', '1009', '10667'),
  ('2021-10-12 10:54:32.659659', '1010', '11018'),
  ('2021-10-12 10:54:32.659659', '1011', '11019'),
  ('2021-10-12 10:54:32.659659', '1012', '11020'),
  ('2021-10-12 10:54:32.659659', '1013', '10864'),
  ('2021-10-12 10:54:32.659659', '1014', '11021'),
  ('2021-10-12 10:54:32.660660', '1015', '11022'),
  ('2021-10-12 10:54:32.660660', '1016', '10651'),
  ('2021-10-12 10:54:32.660660', '1017', '11023'),
  ('2021-10-12 10:54:32.660660', '1017', '11024'),
  ('2021-10-12 10:54:32.660660', '1018', '10629'),
  ('2021-10-12 10:54:32.660660', '1019', '10846'),
  ('2021-10-12 10:54:32.660660', '1020', '11025'),
  ('2021-10-12 10:54:32.660660', '1021', '10848'),
  ('2021-10-12 10:54:32.660660', '1021', '11026'),
  ('2021-10-12 10:54:32.660660', '1022', '10822'),
  ('2021-10-12 10:54:32.660660', '1022', '11027'),
  ('2021-10-12 10:54:32.660660', '1023', '10626'),
  ('2021-10-12 10:54:32.660660', '1023', '11028'),
  ('2021-10-12 10:54:32.660660', '1024', '11029'),
  ('2021-10-12 10:54:32.660660', '1025', '11030'),
  ('2021-10-12 10:54:32.660660', '1026', '10602'),
  ('2021-10-12 10:54:32.660660', '1026', '11031'),
  ('2021-10-12 10:54:32.660660', '1027', '10581'),
  ('2021-10-12 10:54:32.660660', '1027', '11032'),
  ('2021-10-12 10:54:32.660660', '1028', '11033'),
  ('2021-10-12 10:54:32.660660', '1029', '11034'),
  ('2021-10-12 10:54:32.660660', '1030', '11035'),
  ('2021-10-12 10:54:32.660660', '1031', '11036'),
  ('2021-10-12 10:54:32.661661', '1032', '11037'),
  ('2021-10-12 10:54:32.661661', '1033', '11038')
  ;

  // Update to source_song table
