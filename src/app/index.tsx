import { Button, Text } from "@/global/components";
import { View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button>
        <Text>Hello </Text>
      </Button>
    </View>
  );
}
