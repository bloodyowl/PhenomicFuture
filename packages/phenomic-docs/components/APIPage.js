import React from "react"
import { View, Text, ActivityIndicator, StyleSheet } from "react-native-web"
import Link from "react-router/Link"

import { createContainer, query } from "phenomic-react/lib/client"

import MarkdownGenerated from "./MarkdownGenerated"

const Home = (props) => (
  <View>
    {props.isLoading &&
      <ActivityIndicator />
    }
    {!props.isLoading &&
      <View style={styles.page}>
        <View style={styles.column}>
          <Text style={styles.menuTitle}>
            {"API Reference"}
          </Text>
          {props.apis.list.map(api =>
            <View key={api.id}>
              <Link to={`/api/${ api.id }`}>
                <Text style={styles.property}>
                  {api.title}
                </Text>
              </Link>
            </View>
          )}
        </View>
        <View>
          <Text style={styles.title}>{props.page.title}</Text>
          <MarkdownGenerated
            body={props.page.body}
          />
        </View>
      </View>
    }
  </View>
)

const styles = StyleSheet.create({
  menuTitle: {
    fontWeight: "900",
  },
  page: {
    padding: 10,
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
  },
  column: {
    width: "30%",
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
  },
  property: {
    backgroundColor: "#fafafa",
    borderRadius: 2,
    fontFamily: "monospace",
  },
})

export default createContainer(Home, props => ({
  apis: query({
    collection: "api",
  }),
  page: query({
    collection: "api",
    id: props.params[0],
  })
}))
