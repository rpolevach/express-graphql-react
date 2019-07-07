const { dateToString } = require("../../helpers/date");
const Event = require("../../models/event");
const { transformEvent } = require("./merge");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async args => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: dateToString(args.eventInput.date),
      creator: "5d1ca50a6482613468670c44"
    });

    try {
      const result = await event.save();
      createdEvent = transformEvent(result);

      const userModel = await User.findById("5d1ca50a6482613468670c44");

      if (!userModel) throw new Error("User not found");

      userModel.createdEvents.push(event);
      userModel.save();

      return {
        ...result._doc,
        _id: result._doc._id.toString(),
        creator: user.bind(this, result._doc.creator)
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
