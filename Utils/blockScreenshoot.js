import * as ScreenCapture from 'expo-screen-capture';
import { useIsFocused } from '@react-navigation/native';

export const blockScreenshot = () => {
  const isFocused = useIsFocused();
  const activate = async () => {await ScreenCapture.preventScreenCaptureAsync();};
  const deactivate = async () => {await ScreenCapture.allowScreenCaptureAsync();};
  if (isFocused) {activate();} else {deactivate();}
}
