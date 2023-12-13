import express from 'express'
import path from 'path'


export const isLoggedIn = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	if (req.session?.owner) {
        console.log(req.session.owner)
		console.log(req.session.owner_id)
		next()
	} else {
		res.status(404).sendFile(path.resolve('./public/404.html'))
	}
}
