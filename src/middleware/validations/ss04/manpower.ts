import { body, header } from "express-validator";

import { checkSingleValueInDatabase } from "../../../repo/database/manpower";


export const createValidation = () => [
  body("nip")
    .exists()
    .withMessage("nip required")
    .isString()
    .withMessage("nip is string")
    .notEmpty()
    .withMessage("nip not empty"),
  body("name")
    .exists()
    .withMessage("name required")
    .isString()
    .withMessage("name is string")
    .notEmpty()
    .withMessage("name not empty"),
  body("id_project")
    .exists()
    .withMessage("id_project required")
    .isInt({
      min: 0,
    })
    .withMessage("id_project is numeric"),
  body("no_hp")
    .exists()
    .withMessage("no_hp required")
    .notEmpty()
    .withMessage("no_hp not empty")
    .isInt({
      min: 15,
    })
    .withMessage("no_hp is numeric +62 format")
    .custom(checkSingleValueInDatabase("no_hp"))
    .withMessage("No Hp already used"),
];

export const updateNoHpValidation = () =>[
  body("no_hp")
    .exists()
    .withMessage("no_hp required")
    .notEmpty()
    .withMessage("no_hp not empty")
    .isInt({
      min: 15,
    })
    .withMessage("no_hp is numeric +62 format")
    .custom(checkSingleValueInDatabase("no_hp"))
    .withMessage("No Hp already used"),
]

export const updateNIPValidation = () =>[
  body("nip")
    .exists()
    .withMessage("nip required")
    .notEmpty()
    .withMessage("nip not empty")
    .custom(checkSingleValueInDatabase("nip"))
    .withMessage("nip already used"),
]

export const updateProjectValidation = () =>[
  body("id_project")
    .exists()
    .withMessage("project id required")
    .notEmpty()
    .withMessage("project id not empty")
]