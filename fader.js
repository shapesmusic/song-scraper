// Fader

// Array to store song data
const songsData = [];

// Select all song headlines
const headlines = document.querySelectorAll('h5.headline');

// Iterate through each headline
headlines.forEach(headline => {
    // Extract the text content of the headline
    const headlineText = headline.textContent.trim();

    // Split the headline into title and artist
    const [artist, title] = headlineText.split(':').map(item => item.trim());

    // Create song data object and push it to songsData array
    const songData = {
      title: title,
      artist_name: artist,
      video_id: null
    };

    songsData.push(songData);
});

// Build the SQL Statement
const songs = [];

// Iterate through songsData to create SQL statements
for (let i = 0; i < songsData.length; i++) {
  // Format title with single quotes, remove surrounding quotes, and replace single quotes with a different character
  const title = songsData[i].title ? `'${songsData[i].title.replace(/'/g, "’").slice(1, -1)}'` : '';
  // Format artist name with single quotes and replace single quotes with a different character
  const artistName = songsData[i].artist_name ? `'${songsData[i].artist_name.replace(/'/g, "’")}'` : '';

  // Concatenate values into SQL INSERT statement
  const song = `(${title}, ${artistName}, NULL)`;
  songs.push(song);
}

// Output the SQL INSERT statement
console.log(
  `INSERT INTO NMT
  (title, artist_name, video_id)
VALUES
${songs.join(",\n")}
;`
);
