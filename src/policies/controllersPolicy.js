
export default function (req, res, injectedSails) {

  const _sails = sails || injectedSails
  const config = _sails.config.permissions
  const controller = req.options.controller

  if(!config.all && !config[controller]){
    throw new Error('global permissions set to false and controller has no permissions set')
  }

}
