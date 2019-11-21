import { generateControllers } from "../../modules/query";
import { Media } from "./media.model";
import multer from "multer";
import mongoose from "mongoose";
import moment from "moment";

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/media/wallpaper");
  },
  filename: function(req, file, cb) {
    cb(null, moment().valueOf() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const mimeType = ["image/jpeg", "image/png", "audio/mpeg", "audio/mp3", "image/gif"]
  if (mimeType.indexOf(file.mimetype) > -1) {
    cb(null, true);
  } else {
    cb(new Error("invalid file"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 3072 * 3072 * 5 },
  fileFilter: fileFilter
});

const createMedia = async (req, res) => {
  const data = req.body;
  data.imagePath = req.file.path;
  data.tag = data.tag.split(",")
  const create = await Media.create(data);
  res.status(201).send({ success: true, message: create });
  try {
  } catch (err) {
    res.status(422).send({ success: false, message: err });
  }
};

const updateMedia = async (req, res) => {
  try {
    const _id = req.params.id;
    const { tag, categoryId, title, description, publish } = req.body;
    const data = {};
    if (tag) {
      data.tag = tag;
    }
    if (categoryId) {
      data.categoryId = categoryId;
    }
    if (title) {
      data.title = title;
    }
    if (description) {
      data.description = description;
    }
    if(publish){
      data.publish = publish
    }
    const media = await Media.findByIdAndUpdate({ _id }, data);
    res.status(200).send({ success: true, message: media });
  } catch (err) {
    console.log("Error", err);
    res
      .status(422)
      .send({ success: false, error: "Error in getting user details" });
  }
};

const getMediaByCategory = async (req, res) => {
  const category = req.body.name;
  try {
    const media = await Media.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category"
        }
      },
      {
        $unwind: "$category"
      },
      {
        $match: {
          "category.name": category,
          publish: true
        }
      },
      {
        $project: {
          name: 1,
          publish: 1,
          imagePath: 1,
          title: 1,
          tag: 1,
          description: 1,
          download: 1,
          mediaTypeId: 1,
          categoryId: 1,
          userId: 1
        }
      }
    ]);
    res.status(200).send({ success: true, message: media });
  } catch (err) {
    res.status(422).send({ success: false, message: err });
  }
};

const getMediaByCategoryId = async (req, res) => {
  const category = req.body.id;
  try {
    const media = await Media.aggregate([
      {
        $match: {
          categoryId: mongoose.Types.ObjectId(category),
          publish: true
        }
      }
    ]);
    res.status(200).send({ success: true, message: media });
  } catch (err) {
    res.status(422).send({ success: false, message: err });
  }
};

const getMediaByUserName = async (req, res) => {
  const userName = req.body.name;
  try {
    const media = await Media.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $match: {
          "user.name": userName,
          publish: true
        }
      },
      {
        $project: {
          name: 1,
          publish: 1,
          imagePath: 1,
          title: 1,
          tag: 1,
          description: 1,
          download: 1,
          mediaTypeId: 1,
          categoryId: 1,
          userId: 1
        }
      }
    ]);
    res.status(200).send({ success: true, message: media });
  } catch (err) {
    res.status(422).send({ success: false, message: err });
  }
};

const getMediaByUserId = async (req, res) => {
  const userId = req.body.id;
  try {
    const media = await Media.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
          publish: true
        }
      }
    ]);
    res.status(200).send({ success: true, message: media });
  } catch (err) {
    res.status(422).send({ success: false, message: err });
  }
};

const getMediaByMediaType = async (req, res) => {
  const mediaType = req.body.name;
  try {
    const media = await Media.aggregate([
      {
        $lookup: {
          from: "mediatypes",
          localField: "mediaTypeId",
          foreignField: "_id",
          as: "mediaType"
        }
      },
      {
        $unwind: "$mediaType"
      },
      {
        $match: {
          "mediaType.name": mediaType,
          publish: true
        }
      },
      {
        $project: {
          name: 1,
          publish: 1,
          imagePath: 1,
          title: 1,
          tag: 1,
          description: 1,
          download: 1,
          mediaTypeId: 1,
          categoryId: 1,
          userId: 1
        }
      }
    ]);
    res.status(200).send({ success: true, message: media });
  } catch (err) {
    res.status(422).send({ success: false, message: err });
  }
};

const getMediaByMediaTypeId = async (req, res) => {
  const mediaType = req.body.id;
  try {
    const media = await Media.aggregate([
      {
        $match: {
          mediaTypeId: mongoose.Types.ObjectId(mediaType),
          publish: true
        }
      }
    ]);
    res.status(200).send({ success: true, message: media });
  } catch (err) {
    res.status(422).send({ success: false, message: err });
  }
};

const getNotPublishMedia = async (req, res) => {
  try {
    const media = await Media.aggregate([
      {
        $match: {
          publish: false
        }
      }
    ]);
    res.status(200).send({ success: true, message: media });
  } catch (err) {
    res.status(422).send({ success: false, message: err });
  }
};

const getPublishMedia = async (req, res) => {
  let { sort, order } = req.params;
  let {
    skip,
    limit,
    title,
    name,
    mediaType,
    userName,
    category,
    tag
  } = req.body;
  sort ? null : (sort = "createdAt");
  order = req.params.order;
  order === "-1" ? (order = -1) : (order = 1);
  Number.isInteger(skip) ? null : (skip = 0);
  Number.isInteger(limit) ? null : (limit = 10);
  let match = { publish: true };
  title ? (match.title = title) : null;
  name ? (match.name = name) : null;
  mediaType ? (match = { ...match, "mediaType.name": mediaType }) : null;
  userName ? (match = { ...match, "user.name": userName }) : null;
  category ? (match = { ...match, "category.name": category }) : null;
  tag ? (match.tag = { $in: tag }) : null;

  try {
    const query = [];
    if (mediaType) {
      query.push({
        $lookup: {
          from: "mediatypes",
          localField: "mediaTypeId",
          foreignField: "_id",
          as: "mediaType"
        }
      });
      query.push({ $unwind: "$mediaType" });
    }
    if (userName) {
      query.push({
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      });
      query.push({ $unwind: "$user" });
    }
    if (category) {
      query.push({
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category"
        }
      });
      query.push({ $unwind: "$category" });
    }

    query.push({ $match: match });

    if (tag) {
      query.push({
        $project: {
          _id: 1,
          tag: 1,
          name: 1,
          title: 1,
          description: 1,
          download: 1,
          imagePath: 1,
          order: {
            $size: {
              $setIntersection: [tag, "$tag"]
            }
          }
        }
      });
      query.push({ $sort: { order: -1 } });
    }

    const media = await Media.aggregate(query)
      .sort({ [sort]: order })
      .skip(skip)
      .limit(limit);
    res.status(200).send({ success: true, message: media });
  } catch (err) {
    res.status(422).send({ success: false, message: err });
  }
};

const getMediaList = async (req, res) => {
  const { currentPage, size, mediaType, userId, publish } = req.query
  const page = parseInt(currentPage) || currentPage
  const sizes = parseInt(size) || size
  console.log({currentPage, size, mediaType, userId, publish})
  try {

    let query =
      (mediaType && userId) ? {mediaType, userId} : (mediaType && userId === undefined) ? {mediaType} : (mediaType === undefined && userId) ? {userId} : (mediaType === undefined && userId === undefined) ? {} : {}

    query = publish === undefined ? query : {...query, publish}

    const total = await Media.find(query).count()
    const mediaList = await Media.find(query).limit(sizes).skip(sizes * page)

    const pages = Math.ceil(total/sizes)
    res.send({done: true, media: { data: mediaList, metadata: { total, pages }, length: mediaList.length } })
  } catch (e) {
    console.log({e})
  }
}

const getMediaByTag = async (req, res) => {
  const { currentPage, size, mediaType, publish } = req.query
  const { tag } = req.params
  const page = parseInt(currentPage) || currentPage
  const sizes = parseInt(size) || size
  console.log({currentPage, size, mediaType, publish})
  try {

    const query =
      (mediaType) ? {mediaType, publish: true, tag: { $regex: tag.replace(/ /g, "|"), $options: "$i" }} : (mediaType === undefined) ? {publish: true, tag: { $regex: tag.replace(/ /g, "|"), $options: "$i" }} : {publish: true, tag: { $regex: tag.replace(/ /g, "|"), $options: "$i" }}

    const total = await Media.find(query).count()
    const mediaList = await Media.find(query).limit(sizes).skip(sizes * page)

    const pages = Math.ceil(total/sizes)
    res.send({done: true, media: { data: mediaList, metadata: { total, pages }, length: mediaList.length } })
  } catch (e) {
    console.log({e})
  }
}

export default generateControllers(Media, {
  updateMedia,
  upload,
  createMedia,
  getMediaByUserName,
  getMediaByCategory,
  getMediaByMediaType,
  getMediaByUserId,
  getMediaByMediaTypeId,
  getMediaByCategoryId,
  getNotPublishMedia,
  getPublishMedia,
  getMediaList,
  getMediaByTag
});
