<template>
  <vue-mermaid-string class="graph" :value="graph" />
</template>

<script>
import {
  endent,
  find,
  flatMap,
  flatten,
  join,
  map,
  property,
  replace,
} from '@dword-design/functions'

import notion from '@/model/notion'

const databases = [
  {
    id: '155c76aa824b41109a46560a25d17714',
    relations: ['Produkte'],
    title: 'Aktion',
  },
  {
    id: '0436cd58074c4ffc91a95d6b4e377861',
    relations: ['Ziele: Aktionen', 'Ziele: Entitäten'],
    title: 'Aufgabe',
  },
  {
    id: 'fcb4bac268b2488b9bcbf1ca897b5688',
    relations: ['Daten'],
    title: 'Entität',
  },
  {
    id: 'f41df952f3a44188bffe7c78825b4733',
    relations: [],
    title: 'Daten',
  },
]

export default {
  asyncData: async () => {
    const pages =
      databases
      |> map(database => notion.databases.query({ database_id: database.id }))
      |> Promise.all
      |> await
      |> map(property('results'))
      |> flatten

    return {
      pages,
    }
  },
  computed: {
    graph() {
      const graph = endent`
        graph LR
          ${
            this.pages
            |> flatMap(page => {
              const pageTitle =
                page.properties.Name.title?.[0]?.plain_text?.replace(
                  /"/g,
                  '&quot;'
                )

              const databaseId = page.parent.database_id |> replace(/-/g, '')

              const database = databases |> find({ id: databaseId })

              const typeTitle = database.title

              const title = `${pageTitle}: ${typeTitle}`

              return [
                `${page.id}["${title}"]`,
                ...(database.relations
                  |> flatMap(
                    relation =>
                      page.properties[relation].relation
                      |> map(related => `${page.id} --> ${related.id}`)
                  )),
              ]
            })
            |> join('\n')
          }
      `
      console.log(graph.length)

      return graph
    },
  },
  mounted() {
    console.log(this.pages)
    console.log(this.graph)
  },
}
</script>

<style lang="scss">
.graph svg {
  height: auto !important;
}
</style>
