// Pitchfork

const songsData = [];
const elements = document.getElementsByClassName("artist-list");
for (var i = 0; i < elements.length; i++) {
  const title = elements[i].nextElementSibling.innerText.match(/“(.*?)”/)[1]; // everything inside the quotatino marks
  const artist_name = elements[i].innerText;
  const video_id = null;

  const songData = {
    title: title,
    artist_name: artist_name,
    video_id: video_id
  };

  songsData.push(songData);
}

// Build the SQL Statement
const songs = [];

for (let i = 0; i < songsData.length; i++) {
  const title = songsData[i].title.replace(/'/g, "’");
  const artistName = songsData[i].artist_name.replace(/'/g, "’");

  const song = `  ('${title}', '${artistName}', NULL)`;
  songs.push(song);
}

console.log(
  `INSERT INTO song
  (title, artist_name, video_id)
VALUES
${songs.join(",\n")}
;`
);

// copy log since most recent track and add ;
