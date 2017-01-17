
import {
  controllerNotFound,
  controllerNotAllowed
} from '../config/errorMessages'

export default function (req, config) {

  const controller = req.options.controller

  if(config.all === false && !(controller in config)){
    throw new Error(controllerNotFound)
  }

  if(config[controller] === false){
    throw new Error(controllerNotAllowed + 'controller policy set to false')
  }

  return true
}
