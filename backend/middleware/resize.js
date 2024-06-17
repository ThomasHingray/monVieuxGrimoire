const sharp = require('sharp')
const fs = require('fs')

module.exports = async (req, res, next) => {

	if (!req.file) {
    	return next()
	}
	try {
			req.file.compressedFilename = req.file.filename + '.webp'
			req.file.compressedFilePath = req.file.path + '.webp'


			// sharp permet de modifier la taille et le type de fichier
			sharp.cache(false)
			await sharp(req.file.path)
			.resize(463, 595)
			.webp(90)
			.toFile(req.file.compressedFilePath) 
		
			// fs permet de supprimer le fichier d'origine
			fs.unlink(req.file.path, (error) => {
				if(error) console.log(error)
			})
			next()
		} 	catch(error) {
				res.status(403).json({ error })
			}
}