const Vinyl = require('../models/Vinyl')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')

const addVinyl = async (req, res) => {
    req.body.createdBy = req.user.userId
    const vinyl = await Vinyl.create(req.body)
    res.status(StatusCodes.CREATED).json({vinyl})
}

const getAllVinyls = async (req, res) => {
    const vinyls = await Vinyl.find({createdBy: req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({vinyls, count:vinyls.length})
}
const getVinyl = async (req, res) => {
    const {
        user:{userId},
        params:{id: vinylId}
    } = req
    const vinyl = await Vinyl.findOne({
        _id: vinylId, createdBy: userId
    })
    if(!vinyl) {
        throw new NotFoundError(`The vinyl with the id: ${vinylId} was not found`)
    }
    res.status(StatusCodes.OK).json({vinyl})
}
const updateVinyl = async (req, res) => {
    const {
        body:{albumTitle, artistName, vinylColor, dateObtained }, 
        user:{userId},
        params:{id: vinylId}
    } = req

    if ( albumTitle === "" ) {
        throw new BadRequestError("The album title field cannot be empty")
    } else if ( artistName === "" ) {
        throw new BadRequestError("The artist name field cannot be empty")
    } else if ( vinylColor === "" ) {
        throw new BadRequestError("The vinyl color field cannot be empty")
    } else if ( dateObtained === "" ) {
        throw new BadRequestError("The date obtained field cannot be empty")
    }


    const vinyl = await Vinyl.findByIdAndUpdate(
        {_id: vinylId, createdBy: userId}, 
        req.body, 
        {new: true, runValidators: true}
    )

    if (!vinyl) {
        throw new NotFoundError(`The vinyl with the id: ${vinylId} was not found`)
    }
    res.status(StatusCodes.OK).json({vinyl})
}
const deleteVinyl = async (req, res) => {
    const { 
        user:{userId},
        params:{id: vinylId}
    } = req
    const vinyl = await Vinyl.findByIdAndRemove({
        _id: vinylId, createdBy: userId
    })
    if(!vinyl) {
        throw new NotFoundError(`The vinyl with the id: ${vinylId} was not found.`)
    }
    res.status(StatusCodes.OK).json('The vinyl has been removed.')
}


module.exports = { 
    addVinyl,
    getAllVinyls,
    getVinyl, 
    updateVinyl, 
    deleteVinyl
 }