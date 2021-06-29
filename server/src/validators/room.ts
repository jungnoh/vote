import joi from "joi";

export const createRoom = {
  body: joi.object().keys({
    name: joi.string().required(),
  }),
};
