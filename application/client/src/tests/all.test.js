const esmimport = require('esm')(module);
const appTest = esmimport('./App.assert');
const artistTest = esmimport('artist.assert');
const cookiesTest = esmimport('cookies.assert');
const crewTest = esmimport('crew.assert');