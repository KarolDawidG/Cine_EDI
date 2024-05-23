const { performTransaction } = require("../performTransaction");
const { pool } = require("../../pool");

class VHSRecord {
  constructor(obj) {
    this.id = obj.id;
    this.title = obj.title;
    this.description = obj.description;
    this.img_url = obj.img_url;
    this.genre = obj.genre;
    this.release_date = obj.release_date;
    this.vote_average = obj.vote_average;
    this.price_per_day = obj.price_per_day;
    this.quantity_available = obj.quantity_available;
  }

  static async selectAll() {
    const [results] = await pool.execute("Select * from vhs_tapes");
    return results.map(obj => new VHSRecord(obj));
  }
}

module.exports = { VHSRecord };
