import { model, Schema } from 'mongoose';

const LoginSchema = new Schema(
	{
		noserie: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const LoginModel = model('login', LoginSchema);
export default LoginModel;
