//
// Step 1: Fill in the source data manually
//

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('The Fader',
    NULL,
    'The 100 best songs of 2021',
    '2021-12-16 12:00:00.000000',
    'https://www.thefader.com/2021/12/16/the-100-best-songs-of-2021');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1090; // SELECT last_insert_rowid();
  song_id = null;

  // Add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  elements = document.getElementsByClassName("headline");

  songsData = [];

  for (var i=0; i<elements.length; i++){
    title = elements[i].innerText.match(/, “(.*?)”/)[1];
    artist_name = elements[i].innerText.match(/.+?(?=, “)/)[0];
    video_id = null

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
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//          find and replace "ft."
//

  songsData =
  [
    {
        "title": "Be Sweet",
        "artist_name": "Japanese Breakfast",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.890890",
        "source_id": 1090,
        "song_id": 9971,
        "duplicate": true
    },
    {
        "title": "The Holding Hand",
        "artist_name": "Iceage",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.891891",
        "source_id": 1090,
        "song_id": 9837,
        "duplicate": true
    },
    {
        "title": "Falling",
        "artist_name": "Prettyboy D-O, IAMDDB",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.891891",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Chaeri",
        "artist_name": "Magdalena Bay",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.891891",
        "source_id": 1090,
        "song_id": 11022,
        "duplicate": true
    },
    {
        "title": "In The Flesh",
        "artist_name": "Ecco2k",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.891891",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Spinning",
        "artist_name": "No Rome",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.891891",
        "source_id": 1090,
        "song_id": 9962,
        "duplicate": true
    },
    {
        "title": "So U Know",
        "artist_name": "Overmono",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.891891",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "rom com 2021",
        "artist_name": "Soccer Mommy & Kero Kero Bonito",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.891891",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "‘Quotations’",
        "artist_name": "Water From Your Eyes",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.891891",
        "source_id": 1090,
        "song_id": 11014,
        "duplicate": true
    },
    {
        "title": "Night/Day/Work/Home",
        "artist_name": "CFCF",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.891891",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Last Day On Earth",
        "artist_name": "Beabadoobee",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.891891",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Falling Out The Sky",
        "artist_name": "Armand Hammer & The Alchemist ft. Earl Sweatshirt",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.891891",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "To Be Rich Should Be a Crime",
        "artist_name": "Cola Boyy",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.891891",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "That’s The Game",
        "artist_name": "Stove God Cooks",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Don’t Cry Over Spilled Milk",
        "artist_name": "GoldLink ft. Jesse Boykins III",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Ain’t Gon Stop Me",
        "artist_name": "Reggie, Monte Booker & Kenny Beats",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": 10036,
        "duplicate": true
    },
    {
        "title": "WW2",
        "artist_name": "Unknown T",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hurt",
        "artist_name": "Arlo Parks",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "People Watching",
        "artist_name": "Conan Gray",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "BDE",
        "artist_name": "Shygirl",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": 11024,
        "duplicate": true
    },
    {
        "title": "Time Today",
        "artist_name": "Moneybagg Yo",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": 9775,
        "duplicate": true
    },
    {
        "title": "Snakeskin Has Been",
        "artist_name": "Leon Vynehall",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "breadwinner",
        "artist_name": "Kacey Musgraves",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Thot Shit",
        "artist_name": "Megan Thee Stallion",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": 11031,
        "duplicate": true
    },
    {
        "title": "Gravity",
        "artist_name": "Brent Faiyaz ft. Tyler, The Creator",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": 9770,
        "duplicate": true
    },
    {
        "title": "Kill Me",
        "artist_name": "Indigo De Souza",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": 11026,
        "duplicate": true
    },
    {
        "title": "Intimate Moments",
        "artist_name": "Isaac Dunbar",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Owe Me",
        "artist_name": "Lily Konigsberg",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Stars Align",
        "artist_name": "Majid Jordan ft. Drake",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bunny Is a Rider",
        "artist_name": "Caroline Polachek",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": 10873,
        "duplicate": true
    },
    {
        "title": "Hurricane",
        "artist_name": "Kanye West",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": 10735,
        "duplicate": true
    },
    {
        "title": "2055",
        "artist_name": "Sleepy Hallow",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": 10676,
        "duplicate": true
    },
    {
        "title": "Fellowship",
        "artist_name": "Serpentwithfeet",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Control",
        "artist_name": "Mannequin Pussy",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Smile.",
        "artist_name": "Wolf Alice",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Crazy Tings",
        "artist_name": "Tems",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dragonfly",
        "artist_name": "Fauness",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Pick Up Your Feelings",
        "artist_name": "Jazmine Sullivan",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": 9754,
        "duplicate": true
    },
    {
        "title": "My Whole Life",
        "artist_name": "Navy Blue",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Fafo",
        "artist_name": "Zack Fox",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Made of Gold",
        "artist_name": "Ibeyi ft. Pa Salieu",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": 11308,
        "duplicate": true
    },
    {
        "title": "Luvaroq",
        "artist_name": "Elujay",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Over The Top",
        "artist_name": "Smiley ft. Drake",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": 10682,
        "duplicate": true
    },
    {
        "title": "Point & Kill",
        "artist_name": "Little Simz ft. Obongjayar",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "DEAD RIGHT NOW",
        "artist_name": "Lil Nas X",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": 10795,
        "duplicate": true
    },
    {
        "title": "Try Not to Be Afraid",
        "artist_name": "DJ Sabrina the Teenage DJ",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Ascending Forth",
        "artist_name": "Black Midi",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "search party",
        "artist_name": "dltzk",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": 11337,
        "duplicate": true
    },
    {
        "title": "Every Chance I Get",
        "artist_name": "DJ Khaled ft. Lil Durk & Lil Baby",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": 10338,
        "duplicate": true
    },
    {
        "title": "Great Mass of Color",
        "artist_name": "Deafheaven",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": 11032,
        "duplicate": true
    },
    {
        "title": "Dash Snow",
        "artist_name": "Dean Blunt",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": 11030,
        "duplicate": true
    },
    {
        "title": "Mohabbat",
        "artist_name": "Arooj Aftab",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": 10094,
        "duplicate": true
    },
    {
        "title": "Leave The Door Open",
        "artist_name": "Silk Sonic",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": 9951,
        "duplicate": true
    },
    {
        "title": "Bastard",
        "artist_name": "Glaive",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Get Into It (Yuh)",
        "artist_name": "Doja Cat",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": 10646,
        "duplicate": true
    },
    {
        "title": "Drugs N Hella Melodies",
        "artist_name": "Don Toliver ft. Kali Uchis",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": 11039,
        "duplicate": true
    },
    {
        "title": "Good Days",
        "artist_name": "SZA",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": 9716,
        "duplicate": true
    },
    {
        "title": "CORSO",
        "artist_name": "Tyler, The Creator",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.892892",
        "source_id": 1090,
        "song_id": 10637,
        "duplicate": true
    },
    {
        "title": "Marea (We’ve Lost Dancing)",
        "artist_name": "Fred again..",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Driver’s License",
        "artist_name": "Olivia Rodrigo",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": 9738,
        "duplicate": true
    },
    {
        "title": "Movie",
        "artist_name": "Solo Career",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "hangar",
        "artist_name": "8485",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Fuku",
        "artist_name": "Lambchop",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I’m Just a Fan",
        "artist_name": "Teezo Touchdown",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Happier Than Ever",
        "artist_name": "Billie Eilish",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": 10689,
        "duplicate": true
    },
    {
        "title": "Telepatia",
        "artist_name": "Kali Uchis",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": 9695,
        "duplicate": true
    },
    {
        "title": "Enough Is Enough",
        "artist_name": "Backroad Gee ft. Lethal Bizzle & JME",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "White Dress",
        "artist_name": "Lana Del Rey",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Linda",
        "artist_name": "Tokischa & Rosalía",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": 10938,
        "duplicate": true
    },
    {
        "title": "Cash Under Your Bed",
        "artist_name": "Punko",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Monalisa",
        "artist_name": "Sarz & Lojay",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Guided By Angels",
        "artist_name": "Amyl & The Sniffers",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The 26th Letter",
        "artist_name": "Mach-Hommy",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Chuu",
        "artist_name": "anaiis ft. Topaz Jones",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "SAD GIRLZ LUV MONEY",
        "artist_name": "Amaarae, Kali Uchis, Moliy",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": 10963,
        "duplicate": true
    },
    {
        "title": "Bozo bozo bozo",
        "artist_name": "underscores",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "ANDRETTI",
        "artist_name": "454",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hotel Breakfast",
        "artist_name": "Bladee",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Andrew",
        "artist_name": "M Field",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cambia!",
        "artist_name": "C. Tangana, Carin Leon, Adriel Favela",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "All I Need",
        "artist_name": "Jayda G",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Pennsylvania Furnace",
        "artist_name": "Lingua Ignota",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I Need All That",
        "artist_name": "KA",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Look At The Sky",
        "artist_name": "Porter Robinson",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Second Sermon",
        "artist_name": "Black Sherif",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "t r a n s p a r e n t s o u l",
        "artist_name": "WILLOW",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": 10329,
        "duplicate": true
    },
    {
        "title": "Lo Siento BB :/",
        "artist_name": "Tainy, Bad Bunny, Julieta Venegas",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": 10990,
        "duplicate": true
    },
    {
        "title": "Wilder Days",
        "artist_name": "Morgan Wade",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Big Mike’s",
        "artist_name": "Dijon",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Crush",
        "artist_name": "Ethel Cain",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Family Ties",
        "artist_name": "Baby Keem & Kendrick Lamar",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": 10741,
        "duplicate": true
    },
    {
        "title": "Puppy",
        "artist_name": "Doss",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Love, Lovers",
        "artist_name": "Lost Girl",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "American tterroristt",
        "artist_name": "RXK Nephew",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Todo de Ti",
        "artist_name": "Rauw Alejandro",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": 10480,
        "duplicate": true
    },
    {
        "title": "Like I Used To",
        "artist_name": "Sharon Van Etten & Angel Olsen",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": 10454,
        "duplicate": true
    },
    {
        "title": "Essence",
        "artist_name": "Wizkid ft. Tems",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": 10653,
        "duplicate": true
    },
    {
        "title": "Thumbs",
        "artist_name": "Lucy Dacus",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": 10009,
        "duplicate": true
    },
    {
        "title": "Ting Tun Up, Pt. 2",
        "artist_name": "Skiifall ft. Knucks",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Just for me",
        "artist_name": "PinkPantheress",
        "video_id": null,
        "capture_date": "2022-01-01 05:06:23.893893",
        "source_id": 1090,
        "song_id": 11075,
        "duplicate": true
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
  ('Falling', 'Prettyboy D-O, IAMDDB', NULL),
  ('In The Flesh', 'Ecco2k', NULL),
  ('So U Know', 'Overmono', NULL),
  ('rom com 2021', 'Soccer Mommy & Kero Kero Bonito', NULL),
  ('Night/Day/Work/Home', 'CFCF', NULL),
  ('Last Day On Earth', 'Beabadoobee', NULL),
  ('Falling Out The Sky', 'Armand Hammer & The Alchemist ft. Earl Sweatshirt', NULL),
  ('To Be Rich Should Be a Crime', 'Cola Boyy', NULL),
  ('That’s The Game', 'Stove God Cooks', NULL),
  ('Don’t Cry Over Spilled Milk', 'GoldLink ft. Jesse Boykins III', NULL),
  ('WW2', 'Unknown T', NULL),
  ('Hurt', 'Arlo Parks', NULL),
  ('People Watching', 'Conan Gray', NULL),
  ('Snakeskin Has Been', 'Leon Vynehall', NULL),
  ('breadwinner', 'Kacey Musgraves', NULL),
  ('Intimate Moments', 'Isaac Dunbar', NULL),
  ('Owe Me', 'Lily Konigsberg', NULL),
  ('Stars Align', 'Majid Jordan ft. Drake', NULL),
  ('Fellowship', 'Serpentwithfeet', NULL),
  ('Control', 'Mannequin Pussy', NULL),
  ('Smile.', 'Wolf Alice', NULL),
  ('Crazy Tings', 'Tems', NULL),
  ('Dragonfly', 'Fauness', NULL),
  ('My Whole Life', 'Navy Blue', NULL),
  ('Fafo', 'Zack Fox', NULL),
  ('Luvaroq', 'Elujay', NULL),
  ('Point & Kill', 'Little Simz ft. Obongjayar', NULL),
  ('Try Not to Be Afraid', 'DJ Sabrina the Teenage DJ', NULL),
  ('Ascending Forth', 'Black Midi', NULL),
  ('Bastard', 'Glaive', NULL),
  ('Marea (We’ve Lost Dancing)', 'Fred again..', NULL),
  ('Movie', 'Solo Career', NULL),
  ('hangar', '8485', NULL),
  ('Fuku', 'Lambchop', NULL),
  ('I’m Just a Fan', 'Teezo Touchdown', NULL),
  ('Enough Is Enough', 'Backroad Gee ft. Lethal Bizzle & JME', NULL),
  ('White Dress', 'Lana Del Rey', NULL),
  ('Cash Under Your Bed', 'Punko', NULL),
  ('Monalisa', 'Sarz & Lojay', NULL),
  ('Guided By Angels', 'Amyl & The Sniffers', NULL),
  ('The 26th Letter', 'Mach-Hommy', NULL),
  ('Chuu', 'anaiis ft. Topaz Jones', NULL),
  ('Bozo bozo bozo', 'underscores', NULL),
  ('ANDRETTI', '454', NULL),
  ('Hotel Breakfast', 'Bladee', NULL),
  ('Andrew', 'M Field', NULL),
  ('Cambia!', 'C. Tangana, Carin Leon, Adriel Favela', NULL),
  ('All I Need', 'Jayda G', NULL),
  ('Pennsylvania Furnace', 'Lingua Ignota', NULL),
  ('I Need All That', 'KA', NULL),
  ('Look At The Sky', 'Porter Robinson', NULL),
  ('Second Sermon', 'Black Sherif', NULL),
  ('Wilder Days', 'Morgan Wade', NULL),
  ('Big Mike’s', 'Dijon', NULL),
  ('Crush', 'Ethel Cain', NULL),
  ('Puppy', 'Doss', NULL),
  ('Love, Lovers', 'Lost Girl', NULL),
  ('American tterroristt', 'RXK Nephew', NULL),
  ('Ting Tun Up, Pt. 2', 'Skiifall ft. Knucks', NULL)
  ;

  // this list had a uniqueness rating of 59%. Not bad.
  // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11420; // SELECT last_insert_rowid();

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
  ('2022-01-01 05:06:23.890890', '1090', '9971'),
  ('2022-01-01 05:06:23.891891', '1090', '9837'),
  ('2022-01-01 05:06:23.891891', '1090', '11362'),
  ('2022-01-01 05:06:23.891891', '1090', '11022'),
  ('2022-01-01 05:06:23.891891', '1090', '11363'),
  ('2022-01-01 05:06:23.891891', '1090', '9962'),
  ('2022-01-01 05:06:23.891891', '1090', '11364'),
  ('2022-01-01 05:06:23.891891', '1090', '11365'),
  ('2022-01-01 05:06:23.891891', '1090', '11014'),
  ('2022-01-01 05:06:23.891891', '1090', '11366'),
  ('2022-01-01 05:06:23.891891', '1090', '11367'),
  ('2022-01-01 05:06:23.891891', '1090', '11368'),
  ('2022-01-01 05:06:23.891891', '1090', '11369'),
  ('2022-01-01 05:06:23.892892', '1090', '11370'),
  ('2022-01-01 05:06:23.892892', '1090', '11371'),
  ('2022-01-01 05:06:23.892892', '1090', '10036'),
  ('2022-01-01 05:06:23.892892', '1090', '11372'),
  ('2022-01-01 05:06:23.892892', '1090', '11373'),
  ('2022-01-01 05:06:23.892892', '1090', '11374'),
  ('2022-01-01 05:06:23.892892', '1090', '11024'),
  ('2022-01-01 05:06:23.892892', '1090', '9775'),
  ('2022-01-01 05:06:23.892892', '1090', '11375'),
  ('2022-01-01 05:06:23.892892', '1090', '11376'),
  ('2022-01-01 05:06:23.892892', '1090', '11031'),
  ('2022-01-01 05:06:23.892892', '1090', '9770'),
  ('2022-01-01 05:06:23.892892', '1090', '11026'),
  ('2022-01-01 05:06:23.892892', '1090', '11377'),
  ('2022-01-01 05:06:23.892892', '1090', '11378'),
  ('2022-01-01 05:06:23.892892', '1090', '11379'),
  ('2022-01-01 05:06:23.892892', '1090', '10873'),
  ('2022-01-01 05:06:23.892892', '1090', '10735'),
  ('2022-01-01 05:06:23.892892', '1090', '10676'),
  ('2022-01-01 05:06:23.892892', '1090', '11380'),
  ('2022-01-01 05:06:23.892892', '1090', '11381'),
  ('2022-01-01 05:06:23.892892', '1090', '11382'),
  ('2022-01-01 05:06:23.892892', '1090', '11383'),
  ('2022-01-01 05:06:23.892892', '1090', '11384'),
  ('2022-01-01 05:06:23.892892', '1090', '9754'),
  ('2022-01-01 05:06:23.892892', '1090', '11385'),
  ('2022-01-01 05:06:23.892892', '1090', '11386'),
  ('2022-01-01 05:06:23.892892', '1090', '11308'),
  ('2022-01-01 05:06:23.892892', '1090', '11387'),
  ('2022-01-01 05:06:23.892892', '1090', '10682'),
  ('2022-01-01 05:06:23.892892', '1090', '11388'),
  ('2022-01-01 05:06:23.892892', '1090', '10795'),
  ('2022-01-01 05:06:23.892892', '1090', '11389'),
  ('2022-01-01 05:06:23.892892', '1090', '11390'),
  ('2022-01-01 05:06:23.892892', '1090', '11337'),
  ('2022-01-01 05:06:23.892892', '1090', '10338'),
  ('2022-01-01 05:06:23.892892', '1090', '11032'),
  ('2022-01-01 05:06:23.892892', '1090', '11030'),
  ('2022-01-01 05:06:23.892892', '1090', '10094'),
  ('2022-01-01 05:06:23.892892', '1090', '9951'),
  ('2022-01-01 05:06:23.892892', '1090', '11391'),
  ('2022-01-01 05:06:23.892892', '1090', '10646'),
  ('2022-01-01 05:06:23.892892', '1090', '11039'),
  ('2022-01-01 05:06:23.892892', '1090', '9716'),
  ('2022-01-01 05:06:23.892892', '1090', '10637'),
  ('2022-01-01 05:06:23.893893', '1090', '11392'),
  ('2022-01-01 05:06:23.893893', '1090', '9738'),
  ('2022-01-01 05:06:23.893893', '1090', '11393'),
  ('2022-01-01 05:06:23.893893', '1090', '11394'),
  ('2022-01-01 05:06:23.893893', '1090', '11395'),
  ('2022-01-01 05:06:23.893893', '1090', '11396'),
  ('2022-01-01 05:06:23.893893', '1090', '10689'),
  ('2022-01-01 05:06:23.893893', '1090', '9695'),
  ('2022-01-01 05:06:23.893893', '1090', '11397'),
  ('2022-01-01 05:06:23.893893', '1090', '11398'),
  ('2022-01-01 05:06:23.893893', '1090', '10938'),
  ('2022-01-01 05:06:23.893893', '1090', '11399'),
  ('2022-01-01 05:06:23.893893', '1090', '11400'),
  ('2022-01-01 05:06:23.893893', '1090', '11401'),
  ('2022-01-01 05:06:23.893893', '1090', '11402'),
  ('2022-01-01 05:06:23.893893', '1090', '11403'),
  ('2022-01-01 05:06:23.893893', '1090', '10963'),
  ('2022-01-01 05:06:23.893893', '1090', '11404'),
  ('2022-01-01 05:06:23.893893', '1090', '11405'),
  ('2022-01-01 05:06:23.893893', '1090', '11406'),
  ('2022-01-01 05:06:23.893893', '1090', '11407'),
  ('2022-01-01 05:06:23.893893', '1090', '11408'),
  ('2022-01-01 05:06:23.893893', '1090', '11409'),
  ('2022-01-01 05:06:23.893893', '1090', '11410'),
  ('2022-01-01 05:06:23.893893', '1090', '11411'),
  ('2022-01-01 05:06:23.893893', '1090', '11412'),
  ('2022-01-01 05:06:23.893893', '1090', '11413'),
  ('2022-01-01 05:06:23.893893', '1090', '10329'),
  ('2022-01-01 05:06:23.893893', '1090', '10990'),
  ('2022-01-01 05:06:23.893893', '1090', '11414'),
  ('2022-01-01 05:06:23.893893', '1090', '11415'),
  ('2022-01-01 05:06:23.893893', '1090', '11416'),
  ('2022-01-01 05:06:23.893893', '1090', '10741'),
  ('2022-01-01 05:06:23.893893', '1090', '11417'),
  ('2022-01-01 05:06:23.893893', '1090', '11418'),
  ('2022-01-01 05:06:23.893893', '1090', '11419'),
  ('2022-01-01 05:06:23.893893', '1090', '10480'),
  ('2022-01-01 05:06:23.893893', '1090', '10454'),
  ('2022-01-01 05:06:23.893893', '1090', '10653'),
  ('2022-01-01 05:06:23.893893', '1090', '10009'),
  ('2022-01-01 05:06:23.893893', '1090', '11420'),
  ('2022-01-01 05:06:23.893893', '1090', '11075')
  ;

  // Update to source_song table
