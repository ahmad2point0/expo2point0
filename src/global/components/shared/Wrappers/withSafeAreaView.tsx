import React from "react";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function withSafeAreaView<P extends object>(
  WrapperComponent: React.ComponentType<P>,
) {
  const ComponentWithSafeAreaView = (props: P) => {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <WrapperComponent {...props} />
      </SafeAreaView>
    );
  };

  return ComponentWithSafeAreaView;
}
