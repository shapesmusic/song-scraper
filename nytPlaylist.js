// NYT Playlist

const elements = document.getElementsByClassName("css-15h6bi9 e1gnsphs0"); // this class changes periodically

const songsData = [];

for (var i = 0; i < elements.length; i++) {
  const merged = elements[i].innerText;
  const title = merged.match(/, ‘(.*?)’$/)[1]; // $ gives you the last apostrophe, so it doesn't cut off words like "ain't, etc."
  // if this throws an error, enter `merged` to see the problem song.
  const artist_name = merged.match(/.+?(?=, ‘)/)[0];
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
  `INSERT INTO NMT
  (title, artist_name, video_id)
VALUES
${songs.join(",\n")}
;`
);
