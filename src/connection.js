import { connect } from 'mongoose';

const connectDB = async () => {
	const db =
		'mongodb+srv://alumnos:35413541@practica1.dtdfwfc.mongodb.net/test';
	await connect(db);
};

export default connectDB;
