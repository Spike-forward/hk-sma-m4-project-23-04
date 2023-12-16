import express from 'express'
import { Fields, Files } from 'formidable'
import IncomingForm from 'formidable/Formidable'

export function parseForm(form: IncomingForm, req: express.Request) {
	return new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
		form.parse(req, (err, fields, files) => {
			if (err) {
				reject(err)
			} else {
                console.log({ fields, files })
				resolve({ fields, files })
			}
		})
	})
}