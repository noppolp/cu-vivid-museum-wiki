const _ = require('lodash')
const { Resolver, TypeComposer } = require('graphql-compose')
const mongooseUtils = require('mongoose/lib/utils')

const { scientificSplit } = require('../common')
const { GraphQLEnumType, GraphQLList, GraphQLObjectType, GraphQLString } = require('graphql')

module.exports = (modelsTC) => {
  const { PlantTC, GardenTC, MuseumTC, HerbariumTC, PlantSearchResultItemType } = modelsTC
  const CategoryEnum = new GraphQLEnumType({
    name: 'CategoryEnum',
    values: require('../../category')
  })

  const AutoCompleteResultItem = new GraphQLObjectType({
    name: 'ScientificNameItem',
    fields: {
      scientificName: { type: GraphQLString },
      familyName: { type: GraphQLString },
      name: { type: GraphQLString },
      _id: { type: GraphQLString }
    }
  })
  const AutoCompleteResultItemTC = TypeComposer.create(AutoCompleteResultItem)
  AutoCompleteResultItemTC.extendField('scientificName', {
    resolve: source => (scientificSplit(source.scientificName))
  })

  const PlantSearchResolver = new Resolver({
    name: 'search',
    type: new GraphQLObjectType({
      name: 'PlantSearchResult',
      fields: {
        result: { type: new GraphQLList(PlantSearchResultItemType) },
        count: { type: 'Int' }
      }
    }),
    args: {
      text: { type: '[String]', defaultValue: [] },
      categories: { type: new GraphQLList(CategoryEnum), defaultValue: ['garden', 'herbarium', 'museum'] },
      skip: { type: 'Int', defaultValue: 0 },
      limit: { type: 'Int', defaultValue: 20 }
    },
    resolve: async ({
      args: { text, skip, limit, categories },
      context: { Plant }
    }) => {
      console.time('Find plant by category and scientific name')
      const test = new RegExp(text.join('|'), 'i')

      const aggregates = []
      aggregates.push({
        $match: {
          $or: [{ name: test }, { $text: { $search: `"${text.join(' ')}"` } }]
        }
      })

      categories.forEach(category => {
        aggregates.push(
          { $lookup: { from: mongooseUtils.toCollectionName(category), localField: '_id', foreignField: 'plantId', as: category.toLowerCase() } }
        )
      })
      const $concatArrays = categories.map(cate => `$${cate.toLowerCase()}`)
      aggregates.push({ $project: { result: { $concatArrays } } })
      aggregates.push({ $sort: { scientificName: -1 } })

      const queryResult = await Plant.aggregate(aggregates)
      const result = _.flatMap(queryResult, item => item.result)
      console.timeEnd('Find plant by category and scientific name')
      return {
        result: _(result)
          .slice(skip, skip + limit),
        count: result.length
      }
    }
  })

  PlantTC.setResolver('autoCompletion', new Resolver({
    name: 'autoCompletion',
    args: {
      text: { type: 'String', defaultValue: '' }
    },
    resolve: async ({ args, context }) => {
      const { Plant } = context
      const test = new RegExp(args.text.split('.*').join('|'), 'ig')
      const result = await Plant.find({
        $or: [
          { scientificName: test },
          { familyName: test },
          { name: test }
        ]
      })
        .limit(40)
      return result
    },
    type: new GraphQLList(AutoCompleteResultItemTC.getType())
  }))

  PlantTC.setResolver('search', PlantSearchResolver)

  const PlantIdRelationArg = {
    filter: source => ({ plantId: source._id.toString() })
  }

  PlantTC.addRelation('Museum', () => ({
    resolver: MuseumTC.getResolver('findMany'),
    args: PlantIdRelationArg,
    projection: { _id: 1, plantId: 1 }
  }))
  PlantTC.addRelation('Garden', () => ({
    resolver: GardenTC.getResolver('findMany'),
    args: PlantIdRelationArg,
    projection: { _id: 1, plantId: 1 }
  }))
  PlantTC.addRelation('Herbarium', () => ({
    resolver: HerbariumTC.getResolver('findMany'),
    args: PlantIdRelationArg,
    projection: { _id: 1, plantId: 1 }
  }))

  PlantTC.extendField('scientificName', {
    description: '',
    resolve: source => (scientificSplit(source.scientificName))
  })
}
