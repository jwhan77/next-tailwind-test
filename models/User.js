import Adapters from "next-auth/adapters";

export default class User extends Adapters.TypeORM.Models.User.model {
  constructor(name, email, image, emailVerified) {
    super(name, email, image, emailVerified);
    this.myRepos = [];
  }
}

export const UserSchema = {
  name: "User",
  target: User,
  columns: {
    ...Adapters.TypeORM.Models.User.schema.columns,
  },
};

// https://next-auth.js.org/v3/tutorials/typeorm-custom-models
