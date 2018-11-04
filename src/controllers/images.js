const IMAGECTRL = {};  // Create Object. We add Methods to it so We can use them OUTSIDE later

const path = require('path');
const fs = require('fs');

IMAGECTRL.getImage = async (req, res)=> {

  let collection = req.params.collection;
  let image = req.params.image;

  let imagePath = path.resolve(__dirname, `../uploads/${collection}/${image}`);

  if (fs.existsSync(imagePath)){
    res.sendFile(imagePath);
  } else {
    let noImagePath = path.resolve(__dirname, `../assets/no-img.jpg`);
    res.sendFile(noImagePath);
  }
};

module.exports = IMAGECTRL;  // Exports the Object with all the Methods
