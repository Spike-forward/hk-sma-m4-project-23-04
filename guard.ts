import express from 'express'
import path from 'path'


export const isLoggedIn = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	if (req.session?.owner) {
        //console.log(req.session.owner)
		//console.log(req.session.owner_id)
		next()
	} else {
		// res.status(404).sendFile(path.resolve('./public/404/404.html'))
		// res.status(401).redirect('/404/404.html')
		res.status(401).redirect('/login/login.html')
	}
}

