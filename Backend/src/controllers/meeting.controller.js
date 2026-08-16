import meetingModel from "../models/meeting.model.js";
import userModel from "../models/user.model.js";
import httpStatus from "http-status";
export async function createMeeting(req, res) {
  try {
    const { meetingName, meetingCode } = req.body;

    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "User invalid",
      });
    }

    await meetingModel.create({
      user_id: user._id,
      meetingName,
      meetingCode,
    });

    return res.status(httpStatus.CREATED).json({
      message: "Meeting created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: `${error}`,
    });
  }
}

export async function joinMeeting(req, res) {
  try {
    const { meetingName, meetingCode } = req.body;

    const meeting = await meetingModel.findOne({ meetingName, meetingCode });

    if (!meeting) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "Meeting not found",
      });
    }

    const user = await userModel.findById(meeting.user_id);

    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "Invalid user or meeting",
      });
    }

    return res.status(httpStatus.OK).json({
      message: "Join meeting successfully",
      meetingId: meeting._id,
      meetingCode: meeting.meetingCode,
    });
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
}
