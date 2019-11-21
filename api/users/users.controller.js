import { generateControllers } from "../../modules/query";
import { Users } from "./users.model";

const { ObjectID } = require("mongodb");

const updateUser = async (req, res) => {
  try {
    const _id = req.params.id;
    await Users.findByIdAndUpdate({ _id }, req.body);
    const user = await Users.findById({ _id });
    const userd = {};
    if (user) {
      Object.keys(user._doc).forEach(key => {
        if (key !== "userLoginCredentials") {
          userd[key] = user[key];
        }
      });
    }
    res.status(200).send(userd);
  } catch (err) {
    console.log("Error", err);
    res.status(422).send({ error: "Error in getting user details" });
  }
};

const getUser = async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await Users.aggregate([
      {
        $match: { _id: ObjectID(_id) }
      },
      {
        $lookup: {
          from: "applications",
          let: { appid: "$applications" },
          pipeline: [{ $match: { $expr: { $in: ["$_id", "$$appid"] } } }],
          as: "applications"
        }
      },
      {
        $project: {
          name: 1,
          emailId: 1,
          password: 1,
          mobileNo: 1,
          onboardingStatus: 1
        }
      }
    ]);
    res
      .status(200)
      .send({ success: true, message: (user && user.length && user[0]) || {} });
  } catch (err) {
    console.log("Error", err);
    res.status(422).send({ error: "Error in getting user details" });
  }
};

const createNewUser = async (req, res) => {
  try {
    console.log("enter....");
    const user = await Users.create(req.body);
    res.status(200).send({ message: "User created successfully.", user });
  } catch (err) {
    console.log(err);
    res.status(422).send({ success: false, message: err.message });
  }
};
const userStatus = async (req, res) => {
  try {
    const user = await Users.aggregate([
      {
        $match: { onboardingStatus: req.params.status }
      },
      {
        $project: {
          name: 1,
          emailId: 1,
          password: 1,
          mobileNo: 1,
          onboardingStatus: 1
        }
      }
    ]);
    res.status(200).send((user && user.length && user[0]) || {});
  } catch (err) {
    console.log("Error", err);
    res.status(422).send({ error: "Error in getting user details" });
  }
};
// const inactiveUsers = async (req, res) => {
//   try {
//     const user = await Users.aggregate([
//       {
//         $match: { onboardingStatus: "inactive" }
//       },
//       {
//         $project: {
//           name: 1,
//           emailId: 1,
//           password: 1,
//           mobileNo: 1,
//           onboardingStatus: 1
//         }
//       }
//     ]);
//     res.status(200).send((user && user.length && user[0]) || {});
//   } catch (err) {
//     console.log("Error", err);
//     res.status(422).send({ error: "Error in getting user details" });
//   }
// };

const userName = async (req, res) => {
  const name = req.params.name;
  try {
    const user = await Users.aggregate([
      {
        $match: { name: name }
      },
      {
        $project: {
          name: 1,
          emailId: 1,
          password: 1,
          mobileNo: 1,
          onboardingStatus: 1
        }
      }
    ]);
    res
      .status(200)
      .send((user && user.length && user[0]) || "user is not exist");
  } catch (err) {
    console.log("Error", err);
    res.status(422).send({ error: "Error in getting user details" });
  }
};
export default generateControllers(Users, {
  updateUser,
  getUser,
  createNewUser,
  userStatus,
  //inactiveUsers,
  userName
});
