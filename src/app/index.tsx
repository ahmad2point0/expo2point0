import { withSafeAreaView } from "@/global";
import React from "react";
import { Text, View } from "react-native";

function Index() {
  return (
    <View>
      <Text>Index</Text>
    </View>
  );
}
const SafeArea = withSafeAreaView(Index);
const KeyboardAvoid = withSafeAreaView(SafeArea);
export default KeyboardAvoid;
