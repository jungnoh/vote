import joi from "joi";

export const login = {
  body: joi.object().keys({
    username: joi.string().required(),
    password: joi.string().required(),
  }),
};

export const loginSSOCallback = {
  query: joi.object().keys({
    state: joi.string().required(),
    code: joi.string().required(),
  }),
};
