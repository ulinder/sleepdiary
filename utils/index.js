  module.exports = {
    link_to: link_to
  } 

  function link_to(req, path){
    return `${req.protocol}://${req.get('host')}/${path}`
  }
