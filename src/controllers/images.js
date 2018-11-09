const IMAGECTRL = {};  // Create Object.
const path = require('path');
const fs = require('fs');  // File System

IMAGECTRL.getImage = async (req, res)=> {

  let collection = req.params.collection; // Data from URL
  let image = req.params.image;

  let imagePath = path.resolve(__dirname, `../uploads/${collection}/${image}`);  // Server PATH

  if (fs.existsSync(imagePath)){  // Image on Server? Send IT
    res.sendFile(imagePath);
  } else {
    let noImagePath = path.resolve(__dirname, `../assets/no-image.jpg`);
    res.sendFile(noImagePath);
  }
};

module.exports = IMAGECTRL;  // Exports the Object with all the Methods
