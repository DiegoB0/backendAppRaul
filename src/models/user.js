import { model, Schema } from 'mongoose';

const UserSchema = new Schema(
	{
		_id: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		pass: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const UserModel = model('user', UserSchema);
export default UserModel;
