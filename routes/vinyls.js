const express = require('express')
const router = express.Router()

const { 
    addVinyl, 
    getAllVinyls, 
    getVinyl, 
    updateVinyl, 
    deleteVinyl 
} = require('../controllers/vinyls');

router.route('/').post(addVinyl).get(getAllVinyls)
router.route('/:id').get(getVinyl).patch(updateVinyl).delete(deleteVinyl)

module.exports = router;