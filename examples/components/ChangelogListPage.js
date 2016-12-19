import React from "react"
import { View, Text, ActivityIndicator, StyleSheet } from "react-native-web"
import Link from "react-router/Link"

import createContainer from "../../src/client/hoc/Container"
import query from "../../src/client/query"

const ChangelogListPage = (props) => (
  <View>
    {props.isLoading &&
      <ActivityIndicator />
    }
    {!props.isLoading &&
      <View style={styles.page}>
        <Text style={styles.title}>
          {"Changelog"}
        </Text>
        {props.apis.list.map(api =>
          <View key={api.id}>
            <Link to={`/changelog/${ api.id }`}>
              <Text style={styles.property}>
                {api.title}
              </Text>
            </Link>
          </View>
        )}
      </View>
    }
  </View>
)

const styles = StyleSheet.create({
  page: {
    padding: 10,
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
  },
  property: {
    backgroundColor: "#fafafa",
    borderRadius: 2,
    fontFamily: "monospace",
    fontSize: 20,
  },
})

export default createContainer(ChangelogListPage, props => ({
  apis: query({
    collection: "changelog",
  }),
}))
