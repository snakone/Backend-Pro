const MAINCTRL = {};  // Create Object. We add Methods to it so We can use them OUTSIDE later

MAINCTRL.function = async (req, res)=> {
  res.status(200).json({
    ok: true,
    message: 'Everything OK'
  })
};

module.exports = MAINCTRL;  // Exports the Object with all the Methods
