// pluralize :: String -> String
const pluralize = (word) => {
	if (word === 'person') {
		return 'people'
	}
	if (word === 'Person') {
		return 'People'
	}

	if (word.endsWith('ss')) {
		return `${word}es`
	}

	return `${word}s`
}

export default pluralize
