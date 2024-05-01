import fs from 'fs/promises';

async function generateSqlInserts() {
  try {
    // Odczyt danych z pliku JSON
    const data = await fs.readFile('movies-database.json', 'utf8');
    const movies = JSON.parse(data);

    const sqlInserts = movies.map(movie => {
      return `INSERT INTO vhs_tapes (id, title, description, img_url, price_per_day, quantity_available, genre) VALUES
      (UUID(), '${movie.title.replace(/'/g, "''")}', '${movie.overview.replace(/'/g, "''")}', '${movie.poster_path}', 5.00, 1, '${movie.genre}');`;
    }).join('\n');

    // Zapisywanie zapytań SQL do pliku
    await fs.writeFile('inserts.sql', sqlInserts);
    console.log('SQL insert statements have been saved to inserts.sql');

  } catch (err) {
    console.error('Error:', err);
  }
}

generateSqlInserts();
