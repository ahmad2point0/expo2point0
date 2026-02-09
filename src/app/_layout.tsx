import { Provider } from "@/global";
import { Stack } from "expo-router";
import "../../global.css";
export default function RootLayout() {
  return (
    <Provider>
      <Stack />
    </Provider>
  );
}
