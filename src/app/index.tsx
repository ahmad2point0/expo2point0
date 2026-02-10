import {
  Button,
  withKeyboardAwareScrollView,
  withSafeAreaView,
} from "@/global";
import React from "react";
import { Text, View } from "react-native";

function Index() {
  return (
    <View>
      <Button>
        <Text>Press me</Text>
      </Button>
    </View>
  );
}
const SafeArea = withSafeAreaView(Index);
const KeyboardAvoid = withKeyboardAwareScrollView(SafeArea);
export default KeyboardAvoid;
