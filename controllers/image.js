const clarifai = require('clarifai');
const clarifaiApi = new clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY
})

/**
 * Get response from Clarifai colors API 
 * Required body param 
 * - input
 * @return response 
 */
const handleColorApiCall = (req,res) => {
  const {input} = req.body;

  if (!input) {
    return res.status(400).json('Insufficient information - Unable to handle color API');
  }

  clarifaiApi.models
  .predict(clarifai.COLOR_MODEL, req.body.input)
  .then(data => res.json(data))
  .catch(err=> res.status(400).json('Unable to handle color API'));
}

/**
 * Get response from Clarifai faces API 
 * Required body param 
 * - input
 * 
 * @return response 
 */
const handleFacesApiCall = (req,res) => {
  const {input} = req.body;

  if (!input) {
    return res.status(400).json('Insufficient information - Unable to handle faces API');
  }

  clarifaiApi.models
  .predict(clarifai.FACE_DETECT_MODEL, req.body.input)
  .then(data => res.json(data))
  .catch(err=> res.status(400).json('Unable to handle faces API'));
}

/**
 * Increase the amount of entries in the database 
 * Return updated entries count
 * Required body param 
 * - url
 * - id
 * 
 * @param database
 * @return entries 
 */
const increaseImages = (database) => (req, res) => {
  const { url, id } = req.body;

  if (!url || !id) {
    return res.status(400).json('Insufficient information - Could not upadte images and entries');
  }

  database.select('*')
  .from('images')
  .where({
    url: url,
    userid: id
  })
  .then(data => {
    if(!data.length) {
      return database('images')
      .insert({
        url: url,
        userid: id
      })
    } 
  })
  .catch(err => res.status(400).json('Could not add image'))
  .then(data => {
    return database('users')
    .where('id', '=', id)
    .increment('entries', 1)
  })
  .catch(err => res.status(400).json('Could not update entries'))
  .then(data => {
    return database.select('entries')
      .from('users')
      .where('id', '=', id)
      .then(data => {
        res.status(200).json(data[0].entries)
      })
  })
  .catch(err => res.status(400).json('Could not fetch entries'))
}

module.exports = {
  increaseImages,
  handleColorApiCall,
  handleFacesApiCall
};
