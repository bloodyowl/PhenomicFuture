import React from "react"
import { View, Text, StyleSheet } from "react-native-web"

import { createContainer } from "phenomic-react/lib/client"
import Hero from "./Hero"

const Home = () => (
  <View>
    <Hero />
  </View>
)

const styles = StyleSheet.create({
})

export default createContainer(Home)
