const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const cron = require('node-cron');
const admin = require("./fireb")
const Conversation = require("./models/conversation")
const Membership = require("./models/membership");
const User = require("./models/user");

require("dotenv").config();

//middlewares
app.use(cors());
app.use(morgan("dev"));
// app.use(bodyParser.json());

//connect to DB
const connectDB = async () => {
	try {
		mongoose.set("strictQuery", false);
		mongoose.connect(process.env.PRODDB).then(() => {
			console.log("DB is connected");
		});
	} catch (err) {
		console.log(err);
	}
};

connectDB();

const connectApp = () => {
	try {
		app.listen(process.env.PORT, () => {
			console.log(`Server is running on ${process.env.PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
};
connectApp();

cron.schedule('0 */12 * * *', async () => {
	const date = new Date()
	const day = date.getDate()
	const month = date.getMonth() + 1
	const year = date.getFullYear()
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();

	const paddedMinutes = minutes.toString().padStart(2, '0');
	const paddedSeconds = seconds.toString().padStart(2, '0');

	const actualDateTime = `${day}/${month}/${year} run at ${hours}:${paddedMinutes}:${paddedSeconds}`;
	console.log(actualDateTime)
	try {
		const free = await Membership.findById("65671e5204b7d0d07ef0e796");
		const users = await User.find({ "memberships.membership": { $ne: free._id } });
		// const workspace = await User.findById("65f5539d09dbe77dea51400d");
		// const workspaceprofilepic = workspace.profilepic

		for (let i = 0; i < users.length; i++) {
			const endingDate = new Date(users[i].memberships.ending);
			if (endingDate < new Date()) {

				console.log(
					endingDate, new Date(), endingDate < new Date(), users[i].fullname
				)
				// Membership has expired

				const memberships = {
					membership: "65671e5204b7d0d07ef0e796",
					ending: "infinite",
					status: true
				}

				users[i].memberships = memberships
				users[i].isverified = false
				await users[i].save()

				// const timestamp = `${new Date()}`;

				// const senderpic = process.env.URL + users[i].profilepic;
				// const recpic = process.env.URL + workspaceprofilepic;


				// function msgid() {
				// 	return Math.floor(100000 + Math.random() * 900000);
				// }
				// const mesId = msgid();
				// const convs = await Conversation.findOne({
				// 	members: { $all: [workspace?._id, users[i]._id] },
				// });

				// if (users[i].notificationtoken) {

				// 	const timestamp = `${new Date()}`;
				// 	// const msg = {
				// 	// 	notification: {
				// 	// 		title: `Grovyo Workspace`,
				// 	// 		body: `Your Membership has Expired.`,
				// 	// 	},
				// 	// 	data: {
				// 	// 		screen: "Conversation",
				// 	// 		sender_fullname: `${users[i]?.fullname}`,
				// 	// 		sender_id: `${users[i]?._id}`,
				// 	// 		text: `Your Membership has Expired.`,
				// 	// 		convId: `${convs?._id}`,
				// 	// 		createdAt: `${timestamp}`,
				// 	// 		mesId: `${mesId}`,
				// 	// 		typ: "message",
				// 	// 		senderuname: `${users[i]?.username}`,
				// 	// 		senderverification: `${users[i].isverified}`,
				// 	// 		senderpic: `${recpic}`,
				// 	// 		reciever_fullname: `${workspace.fullname}`,
				// 	// 		reciever_username: `${workspace.username}`,
				// 	// 		reciever_isverified: `${workspace.isverified}`,
				// 	// 		reciever_pic: `${senderpic}`,
				// 	// 		reciever_id: `${workspace._id} `,
				// 	// 	},
				// 	// 	token: users[i]?.notificationtoken,
				// 	// };

				// 	// await admin
				// 	// 	?.messaging()
				// 	// 	?.sendMulticast(msg)
				// 	// 	.then((response) => {
				// 	// 		console.log("Successfully sent message");
				// 	// 	})
				// 	// 	.catch((error) => {
				// 	// 		console.log("Error sending message:", error);
				// 	// 	});

				// }
				console.log(`Membership of ${users[i].fullname} has expired`);
			} else {
				console.log(`Membership of ${users[i].fullname} is active`);
			}
		}
	} catch (error) {
		console.log(error)
	}
});

// cron.schedule('*/5 * * * * *', async () => {
// 	const date = new Date()
// 	const day = date.getDate()
// 	const month = date.getMonth() + 1
// 	const year = date.getFullYear()
// 	const hours = date.getHours();
// 	const minutes = date.getMinutes();
// 	const seconds = date.getSeconds();

// 	const paddedMinutes = minutes.toString().padStart(2, '0');
// 	const paddedSeconds = seconds.toString().padStart(2, '0');

// 	const actualDateTime = `${day}/${month}/${year} run at ${hours}:${paddedMinutes}:${paddedSeconds}`;
// 	console.log(actualDateTime)
// 	try {
// 		const free = await Membership.findById("65671e5204b7d0d07ef0e796");
// 		const users = await User.find({ "memberships.membership": { $ne: free._id } });
// 		const workspace = await User.findById("65f5539d09dbe77dea51400d");
// 		const workspaceprofilepic = workspace.profilepic

// 		for (let i = 0; i < users.length; i++) {
// 			const endingDate = new Date(users[i].memberships.ending);
// 			if (endingDate < new Date()) {

// 				console.log(
// 					endingDate, new Date(), endingDate < new Date(), users[i].fullname
// 				)
// 				// Membership has expired

// 				const memberships = {
// 					membership: "65671e5204b7d0d07ef0e796",
// 					ending: "infinite",
// 					status: true
// 				}

// 				users[i].memberships = memberships
// 				users[i].isverified = false
// 				await users[i].save()

// 				const timestamp = `${new Date()}`;

// 				const senderpic = process.env.URL + users[i].profilepic;
// 				const recpic = process.env.URL + workspaceprofilepic;


// 				function msgid() {
// 					return Math.floor(100000 + Math.random() * 900000);
// 				}
// 				const mesId = msgid();
// 				const convs = await Conversation.findOne({
// 					members: { $all: [workspace?._id, users[i]._id] },
// 				});

// 				if (users[i].notificationtoken) {

// 					const timestamp = `${new Date()}`;
// 					const msg = {
// 						notification: {
// 							title: `Grovyo Workspace`,
// 							body: `Your Membership has Expired.`,
// 						},
// 						data: {
// 							screen: "Conversation",
// 							sender_fullname: `${users[i]?.fullname}`,
// 							sender_id: `${users[i]?._id}`,
// 							text: `Your Membership has Expired.`,
// 							convId: `${convs?._id}`,
// 							createdAt: `${timestamp}`,
// 							mesId: `${mesId}`,
// 							typ: "message",
// 							senderuname: `${users[i]?.username}`,
// 							senderverification: `${users[i].isverified}`,
// 							senderpic: `${recpic}`,
// 							reciever_fullname: `${workspace.fullname}`,
// 							reciever_username: `${workspace.username}`,
// 							reciever_isverified: `${workspace.isverified}`,
// 							reciever_pic: `${senderpic}`,
// 							reciever_id: `${workspace._id} `,
// 						},
// 						token: users[i]?.notificationtoken,
// 					};

// 					await admin
// 						?.messaging()
// 						?.sendMulticast(msg)
// 						.then((response) => {
// 							console.log("Successfully sent message");
// 						})
// 						.catch((error) => {
// 							console.log("Error sending message:", error);
// 						});

// 				}
// 				console.log(`Membership of ${users[i].fullname} has expired`);
// 			} else {
// 				console.log(`Membership of ${users[i].fullname} is active`);
// 			}
// 		}
// 	} catch (error) {
// 		console.log(error)
// 	}
// });