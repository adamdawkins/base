import { capitalize, pluralize, merge } from '../utils'

import * as Collections from '../api'

// collectionForType :: String -> Maybe(Mongo.Collection)
const collectionForType = type => Collections[pluralize(capitalize(type))]

// Re-usable basic Update mutation resolver
export const updateMutation = (typeName) => {
	const Collection = collectionForType(typeName)

	const resolver = (root, args) => {
		const { id, ...properties } = args[typeName.toLowerCase()]
		Collection.update({ _id: id }, { $set: properties })
		return Collection.findOne(id)
	}

	return resolver
}

// A simple delete mutation that takes an id arg and delets from the collection
export const deleteMutation = typeName => (root, { id }) => collectionForType(typeName).remove(id)


export const createMutation = typeName => (root, args) => {
	const Collection = collectionForType(typeName)
	const doc = args[typeName.toLowerCase()]
	const id = Collection.insert(doc)
	return Collection.findOne(id)
}

export const createChildOnParentMutation = (childName, parentName) => (root, args) => {
	const ParentCollection = collectionForType(parentName)
	const parentForeignKey = `${parentName.toLowerCase()}Id`
	const parentId = args[parentForeignKey]
	const child = args[childName.toLowerCase()]

	if (!ParentCollection.findOne(parentId)) {
		throw new Error(404, `Couldn't find ${parentName} with id ${parentId}`)
	}

	const ChildCollection = collectionForType(childName)
	const childId = ChildCollection.insert(merge(child, { [parentForeignKey]: parentId }))
	return ChildCollection.findOne(childId)
}

export const listQuery = (typeName, queryCreator) => (root, args, context) => {
	let query = {}

	if (typeof queryCreator === 'function') {
		query = queryCreator(root, args, context)
	}
	return collectionForType(typeName).find(query).fetch()
}
export const byIdQuery = typeName => (root, { id }) => collectionForType(typeName).findOne(id)

export const byQuery = (field, typeName) => (root, args) => {
	const Collection = collectionForType(typeName)
	return Collection.findOne({ [field]: args[field] })
}
