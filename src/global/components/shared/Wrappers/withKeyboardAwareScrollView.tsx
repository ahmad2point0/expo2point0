import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export function withKeyboardAwareScrollView<P extends object>(
  WrapperComponent: React.ComponentType<P>,
) {
  const ComponentWithKeyboardAwareScrollView = (props: P) => {
    return (
      <KeyboardAwareScrollView
        bottomOffset={50}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <WrapperComponent {...props} />
      </KeyboardAwareScrollView>
    );
  };

  return ComponentWithKeyboardAwareScrollView;
}
