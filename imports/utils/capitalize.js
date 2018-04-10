import { head, tail } from 'ramda'

const capitalize = string => (
	[
		head(string).toUpperCase(),
		tail(string),
	].join('')
)

export default capitalize
