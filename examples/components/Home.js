import React from "react"
import { View, Text, StyleSheet } from "react-native-web"

import createContainer from "../../src/client/hoc/Container"
import Hero from "./Hero"

const Home = () => (
  <View>
    <Hero />
  </View>
)

const styles = StyleSheet.create({
})

export default createContainer(Home)
