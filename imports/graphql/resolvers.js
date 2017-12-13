export default {
	Query: {
		say(root, { phrase }) {
			return phrase || 'Hello'
		},
	},
}
