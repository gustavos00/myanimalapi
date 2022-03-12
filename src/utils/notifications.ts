import { Expo } from 'expo-server-sdk';
const expo = new Expo();

interface sendNotificationsParams {
  expoToken?: string;
  title: string;
  message: string;
  data: object;
}

export const sendNotifications = async ({
  expoToken,
  title,
  message,
  data,
}: sendNotificationsParams) => {
  if (!Expo.isExpoPushToken(expoToken)) {
    return console.log('Its not a expo token');
  }

  const notificationMessage = [
    {
      to: expoToken,
      title,
      body: message,
      data,
    },
  ];

  const receipt = await expo.sendPushNotificationsAsync(notificationMessage);
  return receipt;
};
