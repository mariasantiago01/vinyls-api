const mongoose = require('mongoose')
const { isNumberObject } = require('util/types')

const VinylSchema = new mongoose.Schema({
    albumTitle: {
        type: String, 
        required: [true, 'Please provide album title'],
        maxLength: 70
    },
    artistName: {
        type: String, 
        required: [true, 'Please provide artist name'],
        maxLength: 70
    },
    vinylColor: {
        type: String, 
        required: [true, 'Please provide vinyl color'],
        maxLength: 70
    },
    dateObtained: {
        type: Date,
        required: [true, 'Please provide the date the vinyl was acquired']
    },
    pressing:{
        type:String, 
        enum:['Original pressing', 'Limited Edition', 'Limited Edition/Signed'],
        default: 'Original pressing'
    },
    cost:{
        type: Number, 
        required: false,
        maxLength: 10
    },
    catalog: {
        type: String, 
        required: false,
        maxLength: 40
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref:'User',
        required: [true, 'Please provide user']
    }
}, {timestamps:true})

module.exports = mongoose.model('Vinyl', VinylSchema)

