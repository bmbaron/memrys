import {Client} from 'pg';

const client = new Client({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	port: Number(process.env.DB_PORT),
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
})

client.connect();
client.query(`Select * from tags`, (err, res) => {
	if (!err) {
		console.log(res.rows);
	}
	else {
		console.log(err.message);
	}
	client.end;
})

