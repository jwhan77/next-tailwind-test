import User, { UserSchema } from "./User";

export default {
  User: {
    model: User,
    schema: UserSchema,
  },
};

// https://next-auth.js.org/v3/tutorials/typeorm-custom-models
