const pool = require("../config/config")

class Reflections {
    constructor(id, success, low_point, take_away, owner_id, created_date, modified_date) {
        this.id = id;
        this.success = success;
        this.low_point = low_point;
        this.take_away = take_away;
        this.owner_id = owner_id;
        this.created_date = created_date;
        this.modified_date = modified_date;
    }

    static add(success, low_point, take_away, owner_id){
        return new Promise((resolve, reject)=>{
            const now = new Date()
            pool.query(`
                INSERT INTO reflections (success, low_point, take_away, owner_id, created_date, modified_date)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id, success, low_point, take_away, owner_id, created_date, modified_date
            `, [success, low_point, take_away, owner_id, now, now])
            .then(({rows})=>{
                const reflections = new Reflections(
                    rows[0].id,
                    rows[0].success,
                    rows[0].low_point,
                    rows[0].take_away,
                    rows[0].owner_id,
                    rows[0].created_date,
                    rows[0].modified_date,
                    );
                resolve(reflections)
            })
            .catch((error)=>{
                reject(error)
            });
        });
    }

    static findAll(owner_id) {
        return new Promise((resolve, reject) => {
            pool.query(`
                SELECT id, success, low_point, take_away, owner_id, created_date, modified_date
                FROM reflections
                WHERE owner_id = $1 ;
                `, [owner_id])
                .then(({ rows }) => {
                    const reflections = rows.map((row) => {
                        return new Reflections(
                            row.id,
                            row.success,
                            row.low_point,
                            row.take_away,
                            row.owner_id,
                            row.created_date,
                            row.modified_date,
                        )
                    })
                    resolve(reflections)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
}

module.exports = Reflections;